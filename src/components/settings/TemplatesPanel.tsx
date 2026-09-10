import { useMemo, useState, type ReactNode } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import {
  Button,
  DataTable,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTableRow,
  DataTableSortHeader,
  DataTableTd,
  ConfirmDeleteModal,
  toast,
  type SortDirection,
} from '../ui'
import {
  INITIAL_TEMPLATES,
  applyTemplateForm,
  channelLabel,
  type CorrespondenceTemplate,
  type TemplateFormValues,
} from '../../data/templates'
import { SettingsPanel } from './SettingsPanel'
import { TemplateFormPanel } from './TemplateFormPanel'

type SortKey = 'name' | 'channel' | 'module' | 'type' | 'createdDate'

function compareText(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: 'base' })
}

export function TemplatesPanel() {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES)
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDirection>('asc')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<CorrespondenceTemplate | null>(null)
  const [pendingDelete, setPendingDelete] =
    useState<CorrespondenceTemplate | null>(null)

  const sorted = useMemo(() => {
    if (!sortDir) return templates
    const factor = sortDir === 'asc' ? 1 : -1
    return [...templates].sort(
      (a, b) => compareText(sortValue(a, sortKey), sortValue(b, sortKey)) * factor,
    )
  }, [templates, sortDir, sortKey])

  function toggleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key)
      setSortDir('asc')
      return
    }
    setSortDir((current) => {
      if (current === 'asc') return 'desc'
      if (current === 'desc') return null
      return 'asc'
    })
  }

  function directionFor(key: SortKey): SortDirection {
    return sortKey === key ? sortDir : null
  }

  function handleSave(form: TemplateFormValues) {
    const next = applyTemplateForm(form, editing)
    if (editing) {
      setTemplates((current) =>
        current.map((item) => (item.id === editing.id ? next : item)),
      )
      toast.success('Template updated.', { title: 'Templates' })
      return
    }
    setTemplates((current) => [next, ...current])
    toast.success('Template created.', { title: 'Templates' })
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setTemplates((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    )
    toast.success(`Deleted “${pendingDelete.name}”.`, { title: 'Templates' })
    setPendingDelete(null)
  }

  return (
    <>
      <SettingsPanel
        title="Templates"
        description="Customize and manage automated correspondence templates sent to candidates and interviewers."
        actions={
          <Button
            type="button"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
            className="!h-10 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Create New
          </Button>
        }
      >
        <DataTable minWidthClassName="min-w-[56rem]" className="border-0">
          <DataTableHead className="bg-[#F5F5F8]">
            <DataTableSortHeader
              label="Template Name"
              direction={directionFor('name')}
              onSort={() => toggleSort('name')}
            />
            <DataTableSortHeader
              label="Template Type"
              direction={directionFor('channel')}
              onSort={() => toggleSort('channel')}
            />
            <DataTableSortHeader
              label="Module"
              direction={directionFor('module')}
              onSort={() => toggleSort('module')}
            />
            <DataTableSortHeader
              label="Type"
              direction={directionFor('type')}
              onSort={() => toggleSort('type')}
            />
            <DataTableSortHeader
              label="Created Date"
              direction={directionFor('createdDate')}
              onSort={() => toggleSort('createdDate')}
            />
            <th className="w-20 px-2 pb-3 pt-1" aria-label="Actions" />
          </DataTableHead>
          <DataTableBody>
            {sorted.length === 0 ? (
              <DataTableEmpty colSpan={6}>No templates yet.</DataTableEmpty>
            ) : (
              sorted.map((template, index) => (
                <DataTableRow
                  key={template.id}
                  className={
                    index % 2 === 1
                      ? 'border-b border-[#F0EEF5] bg-[#F7F8FB] last:border-b-0'
                      : 'border-b border-[#F0EEF5] last:border-b-0'
                  }
                >
                  <DataTableTd strong>{template.name}</DataTableTd>
                  <DataTableTd muted>{channelLabel(template.channel)}</DataTableTd>
                  <DataTableTd muted>{template.module}</DataTableTd>
                  <DataTableTd muted>{template.type}</DataTableTd>
                  <DataTableTd muted>{template.createdDate}</DataTableTd>
                  <DataTableTd className="px-2">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        label={`Delete ${template.name}`}
                        onClick={() => setPendingDelete(template)}
                      >
                        <Trash2 className="size-4" strokeWidth={1.75} />
                      </IconButton>
                      <IconButton
                        label={`Edit ${template.name}`}
                        onClick={() => {
                          setEditing(template)
                          setFormOpen(true)
                        }}
                      >
                        <Pencil className="size-4" strokeWidth={1.75} />
                      </IconButton>
                    </div>
                  </DataTableTd>
                </DataTableRow>
              ))
            )}
          </DataTableBody>
        </DataTable>
      </SettingsPanel>

      <TemplateFormPanel
        open={formOpen}
        template={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
      />

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Template"
        itemName={pendingDelete?.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

function sortValue(template: CorrespondenceTemplate, key: SortKey): string {
  switch (key) {
    case 'name':
      return template.name
    case 'channel':
      return channelLabel(template.channel)
    case 'module':
      return template.module
    case 'type':
      return template.type
    case 'createdDate':
      return template.createdDate
    default: {
      const _exhaustive: never = key
      throw new Error(`Unhandled template sort key: ${_exhaustive}`)
    }
  }
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex size-8 items-center justify-center rounded-md text-[#9CA3AF] transition-colors hover:bg-[#F3F3F6] hover:text-[#2D2061]"
    >
      {children}
    </button>
  )
}
