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
  INITIAL_DOMAIN_RULES,
  applyDomainRuleForm,
  type DomainRule,
  type DomainRuleFormValues,
} from '../../data/domainRules'
import { SettingsPanel } from './SettingsPanel'
import { DomainRuleFormPanel } from './DomainRuleFormPanel'

type SortKey = 'domain' | 'status' | 'reason'

function compareText(a: string, b: string) {
  return a.localeCompare(b, undefined, { sensitivity: 'base' })
}

export function DomainRulesPanel() {
  const [rules, setRules] = useState(INITIAL_DOMAIN_RULES)
  const [sortKey, setSortKey] = useState<SortKey>('domain')
  const [sortDir, setSortDir] = useState<SortDirection>('asc')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<DomainRule | null>(null)
  const [pendingDelete, setPendingDelete] = useState<DomainRule | null>(null)

  const sorted = useMemo(() => {
    if (!sortDir) return rules
    const factor = sortDir === 'asc' ? 1 : -1
    return [...rules].sort(
      (a, b) => compareText(sortValue(a, sortKey), sortValue(b, sortKey)) * factor,
    )
  }, [rules, sortDir, sortKey])

  const existingDomains = rules
    .filter((rule) => rule.id !== editing?.id)
    .map((rule) => rule.domain)

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

  function handleSave(form: DomainRuleFormValues) {
    const next = applyDomainRuleForm(form, editing)
    if (editing) {
      setRules((current) =>
        current.map((item) => (item.id === editing.id ? next : item)),
      )
      toast.success('Domain rule updated.', { title: 'Domain Rules' })
      return
    }
    setRules((current) => [next, ...current])
    toast.success('Domain rule created.', { title: 'Domain Rules' })
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setRules((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    )
    toast.success(`Deleted “${pendingDelete.domain}”.`, { title: 'Domain Rules' })
    setPendingDelete(null)
  }

  return (
    <>
      <SettingsPanel
        title="Domain Rules"
        description="Automatically protect candidates and contacts that match restricted organization or email domains."
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
        <DataTable minWidthClassName="min-w-[36rem]" className="border-0">
          <DataTableHead className="bg-[#F5F5F8]">
            <DataTableSortHeader
              label="Domain"
              direction={directionFor('domain')}
              onSort={() => toggleSort('domain')}
            />
            <DataTableSortHeader
              label="Status"
              direction={directionFor('status')}
              onSort={() => toggleSort('status')}
            />
            <DataTableSortHeader
              label="Reason"
              direction={directionFor('reason')}
              onSort={() => toggleSort('reason')}
            />
            <th className="w-20 px-2 pb-3 pt-1" aria-label="Actions" />
          </DataTableHead>
          <DataTableBody>
            {sorted.length === 0 ? (
              <DataTableEmpty colSpan={4}>No domain rules yet.</DataTableEmpty>
            ) : (
              sorted.map((rule, index) => (
                <DataTableRow
                  key={rule.id}
                  className={
                    index % 2 === 1
                      ? 'border-b border-[#F0EEF5] bg-[#F7F8FB] last:border-b-0'
                      : 'border-b border-[#F0EEF5] last:border-b-0'
                  }
                >
                  <DataTableTd strong>{rule.domain}</DataTableTd>
                  <DataTableTd muted>{rule.status}</DataTableTd>
                  <DataTableTd muted>{rule.reason}</DataTableTd>
                  <DataTableTd className="px-2">
                    <div className="flex items-center justify-end gap-1">
                      <IconButton
                        label={`Delete ${rule.domain}`}
                        onClick={() => setPendingDelete(rule)}
                      >
                        <Trash2 className="size-4" strokeWidth={1.75} />
                      </IconButton>
                      <IconButton
                        label={`Edit ${rule.domain}`}
                        onClick={() => {
                          setEditing(rule)
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

      <DomainRuleFormPanel
        open={formOpen}
        rule={editing}
        existingDomains={existingDomains}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
      />

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Domain Rule"
        itemName={pendingDelete?.domain}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

function sortValue(rule: DomainRule, key: SortKey): string {
  switch (key) {
    case 'domain':
      return rule.domain
    case 'status':
      return rule.status
    case 'reason':
      return rule.reason
    default: {
      const _exhaustive: never = key
      throw new Error(`Unhandled domain rule sort key: ${_exhaustive}`)
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
