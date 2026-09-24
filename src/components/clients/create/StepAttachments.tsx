import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  Button,
  ConfirmDeleteModal,
  DataTable,
  DataTableActionsHeader,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableSortHeader,
  DataTableTd,
  DataTableTh,
  Modal,
  ThreeDotsMenu,
  toast,
} from '../../ui'
import type { CreateClientFormState } from './types'
import { FieldInput } from './StepChrome'

type Props = {
  value: CreateClientFormState
  onChange: (patch: Partial<CreateClientFormState>) => void
}

export function StepAttachments({ value, onChange }: Props) {
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [addOpen, setAddOpen] = useState(false)
  const [documentName, setDocumentName] = useState('')
  const [description, setDescription] = useState('')
  const [pendingDelete, setPendingDelete] = useState<{
    id: string
    name: string
  } | null>(null)

  function toggleAll(checked: boolean) {
    const next: Record<string, boolean> = {}
    if (checked) {
      for (const item of value.attachments) next[item.id] = true
    }
    setSelected(next)
  }

  function removeAttachment(id: string) {
    onChange({
      attachments: value.attachments.filter((item) => item.id !== id),
    })
    setSelected((current) => {
      const next = { ...current }
      delete next[id]
      return next
    })
  }

  function handleAdd() {
    if (!documentName.trim()) {
      toast.error('Document name is required')
      return
    }
    onChange({
      attachments: [
        ...value.attachments,
        {
          id: `att-${Date.now()}`,
          documentName: documentName.trim(),
          description: description.trim() || '—',
        },
      ],
    })
    setDocumentName('')
    setDescription('')
    setAddOpen(false)
    toast.success('Attachment added')
  }

  const allSelected =
    value.attachments.length > 0 &&
    value.attachments.every((item) => selected[item.id])

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#2D2061]">Client Attachments</h2>
        <Button
          type="button"
          variant="outline"
          onClick={() => setAddOpen(true)}
          className="shrink-0 !h-10 border-[#2D2061]/35 text-[#2D2061] hover:bg-[#f7f6fb]"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add Attachment
        </Button>
      </div>

      <DataTable minWidthClassName="min-w-[36rem]">
        <DataTableHead>
          <DataTableTh checkbox>
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => toggleAll(e.target.checked)}
              aria-label="Select all attachments"
              className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
            />
          </DataTableTh>
          <DataTableSortHeader label="Document Name" />
          <DataTableSortHeader label="Description" />
          <DataTableActionsHeader />
        </DataTableHead>
        <DataTableBody>
          {value.attachments.map((item) => (
            <DataTableRow key={item.id}>
              <DataTableTd checkbox>
                <input
                  type="checkbox"
                  checked={Boolean(selected[item.id])}
                  onChange={(e) =>
                    setSelected((current) => ({
                      ...current,
                      [item.id]: e.target.checked,
                    }))
                  }
                  aria-label={`Select ${item.documentName}`}
                  className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
                />
              </DataTableTd>
              <DataTableTd strong>{item.documentName}</DataTableTd>
              <DataTableTd muted>{item.description}</DataTableTd>
              <DataTableTd className="pr-1">
                <ThreeDotsMenu
                  triggerLabel={`Actions for ${item.documentName}`}
                  items={[
                    {
                      id: 'remove',
                      label: 'Remove',
                      destructive: true,
                      onSelect: () =>
                        setPendingDelete({
                          id: item.id,
                          name: item.documentName,
                        }),
                    },
                  ]}
                />
              </DataTableTd>
            </DataTableRow>
          ))}
        </DataTableBody>
      </DataTable>

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Attachment"
        className="max-w-md"
      >
        <div className="flex flex-col gap-4">
          <FieldInput
            label="Document Name"
            requiredMark
            placeholder="Document Name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
          />
          <FieldInput
            label="Description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setAddOpen(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </Modal>

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Attachment"
        itemName={pendingDelete?.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (!pendingDelete) return
          removeAttachment(pendingDelete.id)
          setPendingDelete(null)
        }}
      />
    </div>
  )
}
