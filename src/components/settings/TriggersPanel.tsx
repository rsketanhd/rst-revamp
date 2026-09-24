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
  Switch,
  toast,
  type SortDirection,
} from '../ui'
import { INITIAL_TEMPLATES, channelLabel } from '../../data/templates'
import {
  INITIAL_TRIGGERS,
  applyTriggerForm,
  type NotificationTrigger,
  type TriggerFormValues,
} from '../../data/triggers'
import { SettingsPanel } from './SettingsPanel'
import { TriggerFormPanel } from './TriggerFormPanel'

type SortKey = 'name' | 'channel' | 'event' | 'eventValue' | 'templateName'

function compareText(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: 'base' })
}

export function TriggersPanel() {
  const [triggers, setTriggers] = useState(INITIAL_TRIGGERS)
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDirection>('asc')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<NotificationTrigger | null>(null)
  const [pendingDelete, setPendingDelete] =
    useState<NotificationTrigger | null>(null)

  const templateOptions = useMemo(
    () => INITIAL_TEMPLATES.map((template) => template.name),
    [],
  )

  const sorted = useMemo(() => {
    if (!sortDir) return triggers
    const factor = sortDir === 'asc' ? 1 : -1
    return [...triggers].sort(
      (a, b) => compareText(sortValue(a, sortKey), sortValue(b, sortKey)) * factor,
    )
  }, [triggers, sortDir, sortKey])

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

  function handleSave(form: TriggerFormValues) {
    const next = applyTriggerForm(form, editing)
    if (editing) {
      setTriggers((current) =>
        current.map((item) => (item.id === editing.id ? next : item)),
      )
      toast.success('Trigger updated.', { title: 'Triggers' })
      return
    }
    setTriggers((current) => [next, ...current])
    toast.success('Trigger created.', { title: 'Triggers' })
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setTriggers((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    )
    toast.success(`Deleted “${pendingDelete.name}”.`, { title: 'Triggers' })
    setPendingDelete(null)
  }

  return (
    <>
      <SettingsPanel
        title="Triggers"
        description="Configure automated conditions and event rules that dispatch notifications without manual recruiter intervention."
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
        <DataTable minWidthClassName="min-w-[64rem]" className="border-0">
          <DataTableHead className="bg-[#F5F5F8]">
            <DataTableSortHeader
              label="Trigger Name"
              direction={directionFor('name')}
              onSort={() => toggleSort('name')}
            />
            <DataTableSortHeader
              label="Template For"
              direction={directionFor('channel')}
              onSort={() => toggleSort('channel')}
            />
            <DataTableSortHeader
              label="Event"
              direction={directionFor('event')}
              onSort={() => toggleSort('event')}
            />
            <DataTableSortHeader
              label="Value"
              direction={directionFor('eventValue')}
              onSort={() => toggleSort('eventValue')}
            />
            <DataTableSortHeader
              label="Template"
              direction={directionFor('templateName')}
              onSort={() => toggleSort('templateName')}
            />
            <th className="w-28 px-2 pb-3 pt-1" aria-label="Actions" />
          </DataTableHead>
          <DataTableBody>
            {sorted.length === 0 ? (
              <DataTableEmpty colSpan={6}>No triggers yet.</DataTableEmpty>
            ) : (
              sorted.map((trigger, index) => (
                <DataTableRow
                  key={trigger.id}
                  className={
                    index % 2 === 1
                      ? 'border-b border-[#F0EEF5] bg-[#F7F8FB] last:border-b-0'
                      : 'border-b border-[#F0EEF5] last:border-b-0'
                  }
                >
                  <DataTableTd strong className="whitespace-normal">
                    {trigger.name}
                  </DataTableTd>
                  <DataTableTd muted>{channelLabel(trigger.channel)}</DataTableTd>
                  <DataTableTd muted>{trigger.event}</DataTableTd>
                  <DataTableTd muted>{trigger.eventValue}</DataTableTd>
                  <DataTableTd muted>{trigger.templateName}</DataTableTd>
                  <DataTableTd className="px-2">
                    <div className="flex items-center justify-end gap-1.5">
                      <Switch
                        className="w-auto"
                        checked={trigger.enabled}
                        aria-label={`${trigger.enabled ? 'Disable' : 'Enable'} ${trigger.name}`}
                        onCheckedChange={(checked) =>
                          setTriggers((current) =>
                            current.map((item) =>
                              item.id === trigger.id
                                ? { ...item, enabled: checked }
                                : item,
                            ),
                          )
                        }
                      />
                      <IconButton
                        label={`Delete ${trigger.name}`}
                        onClick={() => setPendingDelete(trigger)}
                      >
                        <Trash2 className="size-4" strokeWidth={1.75} />
                      </IconButton>
                      <IconButton
                        label={`Edit ${trigger.name}`}
                        onClick={() => {
                          setEditing(trigger)
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

      <TriggerFormPanel
        open={formOpen}
        trigger={editing}
        templateOptions={templateOptions}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
      />

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Trigger"
        itemName={pendingDelete?.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

function sortValue(trigger: NotificationTrigger, key: SortKey): string {
  switch (key) {
    case 'name':
      return trigger.name
    case 'channel':
      return channelLabel(trigger.channel)
    case 'event':
      return trigger.event
    case 'eventValue':
      return trigger.eventValue
    case 'templateName':
      return trigger.templateName
    default: {
      const _exhaustive: never = key
      throw new Error(`Unhandled trigger sort key: ${_exhaustive}`)
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
