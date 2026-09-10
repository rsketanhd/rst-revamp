import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button, ConfirmDeleteModal, Switch, toast } from '../ui'
import {
  AddNewFieldPanel,
  type AddNewFieldFormValues,
} from './AddNewFieldPanel'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'
import { cn } from '../../lib/cn'

type JobFieldRow = {
  id: string
  name: string
  category: string
  description: string
  values: string[]
  visible: boolean
  required: boolean
}

const INITIAL_FIELDS: JobFieldRow[] = [
  {
    id: 'first-name-1',
    name: 'First Name',
    category: 'text',
    description: 'Candidate first name',
    values: [],
    visible: true,
    required: true,
  },
  {
    id: 'last-name',
    name: 'Last Name',
    category: 'text',
    description: 'Candidate last name',
    values: [],
    visible: true,
    required: true,
  },
  {
    id: 'first-name-2',
    name: 'First Name',
    category: 'text',
    description: 'Alternate first name field',
    values: [],
    visible: true,
    required: true,
  },
  {
    id: 'email',
    name: 'Email Address',
    category: 'email',
    description: 'Primary email address',
    values: [],
    visible: true,
    required: true,
  },
  {
    id: 'phone',
    name: 'Phone Number',
    category: 'phone-number',
    description: 'Primary phone number',
    values: [],
    visible: true,
    required: true,
  },
]

/**
 * Settings → Module Configuration → Jobs — field customization.
 */
export function JobsModulePanel() {
  const [fields, setFields] = useState<JobFieldRow[]>(INITIAL_FIELDS)
  const [fieldPanelOpen, setFieldPanelOpen] = useState(false)
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{
    id: string
    name: string
  } | null>(null)

  const editingField = editingFieldId
    ? fields.find((field) => field.id === editingFieldId) ?? null
    : null

  function patchField(id: string, patch: Partial<JobFieldRow>) {
    setFields((current) =>
      current.map((field) =>
        field.id === id ? { ...field, ...patch } : field,
      ),
    )
  }

  function openCreatePanel() {
    setEditingFieldId(null)
    setFieldPanelOpen(true)
  }

  function openEditPanel(fieldId: string) {
    setEditingFieldId(fieldId)
    setFieldPanelOpen(true)
  }

  function closeFieldPanel() {
    setFieldPanelOpen(false)
    setEditingFieldId(null)
  }

  function handleFieldSubmit(values: AddNewFieldFormValues) {
    const name = values.name.trim()
    const category = values.category
    const description = values.description.trim()
    const optionValues = values.values

    if (editingFieldId) {
      setFields((current) =>
        current.map((field) =>
          field.id === editingFieldId
            ? {
                ...field,
                name,
                category,
                description,
                values: optionValues,
              }
            : field,
        ),
      )
      return
    }

    setFields((current) => [
      ...current,
      {
        id: `field-${Date.now()}`,
        name,
        category,
        description,
        values: optionValues,
        visible: true,
        required: false,
      },
    ])
  }

  function requestDelete(id: string, name: string) {
    setPendingDelete({ id, name })
  }

  function confirmDelete() {
    if (!pendingDelete) return
    const { id, name } = pendingDelete
    setFields((current) => current.filter((field) => field.id !== id))
    setPendingDelete(null)
    toast.success(`“${name}” was removed.`, { title: 'Field deleted' })
  }

  function handleSave() {
    toast.success('Job field preferences saved successfully.', {
      title: 'Save Preferences',
    })
  }

  return (
    <SettingsPanel
      title="Jobs"
      description="Manage your user registration credentials and customize active recruiter daily digest parameters."
    >
      <SettingsBlock
        title="Field Customization"
        trailing={
          <button
            type="button"
            onClick={openCreatePanel}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#2D2061] transition-colors hover:text-[#241a52]"
          >
            <Plus className="size-4" strokeWidth={2.5} aria-hidden="true" />
            Add New
          </button>
        }
        footer={
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleSave}
              className="!h-10 !rounded-md !bg-[#2D2061] px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
            >
              Save Preferences
            </Button>
          </div>
        }
      >
        <div className="-mx-1 overflow-x-auto px-1">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#E8E6F0]">
                <th className="px-2 pb-3 text-xs font-medium text-[#6B6B80]">
                  Field Name
                </th>
                <th className="px-2 pb-3 text-center text-xs font-medium text-[#6B6B80]">
                  Visibility
                </th>
                <th className="px-2 pb-3 text-center text-xs font-medium text-[#6B6B80]">
                  Required
                </th>
                <th className="px-2 pb-3 text-right text-xs font-medium text-[#6B6B80]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr
                  key={field.id}
                  className="border-b border-[#F0EEF5] last:border-b-0"
                >
                  <td className="px-2 py-3.5 font-medium text-[#2D2061]">
                    {field.name}
                  </td>
                  <td className="px-2 py-3.5">
                    <div className="flex justify-center">
                      <Switch
                        checked={field.visible}
                        onCheckedChange={(visible) =>
                          patchField(field.id, { visible })
                        }
                        checkedTrackClassName="bg-[#3B82F6]"
                        id={`visibility-${field.id}`}
                        className="!gap-0"
                      />
                    </div>
                  </td>
                  <td className="px-2 py-3.5">
                    <div className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) =>
                          patchField(field.id, {
                            required: e.target.checked,
                          })
                        }
                        aria-label={`Required for ${field.name}`}
                        className={cn(
                          'size-4 rounded border-[#C8C5D6] accent-[#2D2061]',
                        )}
                      />
                    </div>
                  </td>
                  <td className="px-2 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        aria-label={`Delete ${field.name}`}
                        onClick={() => requestDelete(field.id, field.name)}
                        className="inline-flex size-8 items-center justify-center rounded-md text-[#8B8B9E] transition-colors hover:bg-white hover:text-[#E53935]"
                      >
                        <Trash2 className="size-4" strokeWidth={1.75} />
                      </button>
                      <button
                        type="button"
                        aria-label={`Edit ${field.name}`}
                        onClick={() => openEditPanel(field.id)}
                        className="inline-flex size-8 items-center justify-center rounded-md text-[#8B8B9E] transition-colors hover:bg-white hover:text-[#2D2061]"
                      >
                        <Pencil className="size-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsBlock>

      <AddNewFieldPanel
        open={fieldPanelOpen}
        onClose={closeFieldPanel}
        initialValues={
          editingField
            ? {
                name: editingField.name,
                category: editingField.category,
                description: editingField.description,
                values: editingField.values,
              }
            : null
        }
        onSubmit={handleFieldSubmit}
      />

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Field"
        itemName={pendingDelete?.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </SettingsPanel>
  )
}
