import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Check, Pencil, Search, Trash2, X } from 'lucide-react'
import {
  Button,
  ConfirmDeleteModal,
  DataTable,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTableRow,
  DataTableTd,
  DataTableTh,
  Switch,
  toast,
} from '../ui'
import { cn } from '../../lib/cn'
import { SettingsPanel } from './SettingsPanel'

type IndustryRow = {
  id: string
  name: string
  masterList: boolean
  jobsCount: number
  active: boolean
}

const CONTROL_CLASS = cn(
  'h-11 rounded-lg border border-[#D5D2E2] bg-white text-sm text-[#2D2061]',
  'outline-none transition-colors focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
)

function industry(
  id: string,
  name: string,
  jobsCount = 0,
  active = true,
  masterList = true,
): IndustryRow {
  return { id, name, jobsCount, active, masterList }
}

const INITIAL_INDUSTRIES: IndustryRow[] = [
  industry('aero', 'Aerospace & Defense', 1),
  industry('agri', 'Agriculture & Food Production'),
  industry('const', 'Construction & Infrastructure', 1),
  industry('fmcg', 'Consumer Goods & FMCG'),
  industry('edu', 'Education & Training'),
  industry('energy', 'Energy & Utilities (Oil, Gas, Renewables)'),
  industry('eng', 'Engineering & Technical Services'),
  industry('finance', 'Financial Services & Banking'),
  industry('gov', 'Government & Public Sector'),
  industry('health', 'Healthcare & Life Sciences'),
  industry('hosp', 'Hospitality & Tourism'),
  industry('it', 'Information Technology & Software'),
  industry('ins', 'Insurance'),
  industry('legal', 'Legal Services'),
  industry('mfg', 'Manufacturing'),
  industry('media', 'Media & Entertainment'),
  industry('mining', 'Mining & Metals'),
  industry('ngo', 'Non-Profit & NGO'),
  industry('pharma', 'Pharmaceuticals & Biotech'),
  industry('prof', 'Professional Services'),
  industry('re', 'Real Estate & Property'),
  industry('retail', 'Retail & E-Commerce'),
  industry('telecom', 'Telecommunications'),
  industry('logistics', 'Transportation & Logistics'),
  industry('travel', 'Travel & Aviation'),
  industry('wholesale', 'Wholesale & Distribution'),
]

function IconButton({
  label,
  onClick,
  danger = false,
  children,
}: {
  label: string
  onClick: () => void
  danger?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md text-[#8B8B9E] transition-colors hover:bg-[#F5F4FA]',
        danger ? 'hover:text-[#E53935]' : 'hover:text-[#2D2061]',
      )}
    >
      {children}
    </button>
  )
}

/**
 * Settings → Module Configuration → Jobs → Industries.
 */
export function JobsIndustriesPanel() {
  const [industries, setIndustries] = useState(INITIAL_INDUSTRIES)
  const [newName, setNewName] = useState('')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [pendingDelete, setPendingDelete] = useState<IndustryRow | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  const activeCount = industries.filter((row) => row.active).length
  const totalCount = industries.length

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return industries
    return industries.filter((row) => row.name.toLowerCase().includes(query))
  }, [industries, search])

  useEffect(() => {
    if (!editingId) return
    editInputRef.current?.focus()
    editInputRef.current?.select()
  }, [editingId])

  function handleAdd() {
    const name = newName.trim()
    if (!name) {
      toast.error('Enter an industry name to add.')
      return
    }
    if (
      industries.some(
        (row) => row.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      toast.error('That industry already exists.')
      return
    }

    setIndustries((current) => [
      industry(`ind-${Date.now()}`, name, 0, true, false),
      ...current,
    ])
    setNewName('')
    toast.success(`“${name}” was added.`, { title: 'Industry added' })
  }

  function patchIndustry(id: string, patch: Partial<IndustryRow>) {
    setIndustries((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    )
  }

  function startEdit(row: IndustryRow) {
    setEditingId(row.id)
    setEditName(row.name)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
  }

  function saveEdit() {
    if (!editingId) return
    const name = editName.trim()
    if (!name) {
      toast.error('Industry name is required.')
      return
    }
    if (
      industries.some(
        (row) =>
          row.id !== editingId &&
          row.name.toLowerCase() === name.toLowerCase(),
      )
    ) {
      toast.error('That industry already exists.')
      return
    }

    patchIndustry(editingId, { name })
    toast.success(`“${name}” was updated.`, { title: 'Industry updated' })
    cancelEdit()
  }

  function confirmDelete() {
    if (!pendingDelete) return
    if (editingId === pendingDelete.id) cancelEdit()
    setIndustries((current) =>
      current.filter((row) => row.id !== pendingDelete.id),
    )
    toast.success(`“${pendingDelete.name}” was deleted.`, {
      title: 'Industry removed',
    })
    setPendingDelete(null)
  }

  return (
    <>
      <SettingsPanel
        eyebrow="JOBS"
        title="Industries"
        description="Manage industries used on jobs and the careers page filter."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            id="jobs-industries-add"
            type="text"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleAdd()
              }
            }}
            placeholder="Add an industry, e.g. Maritime & Shipping"
            className={cn(
              CONTROL_CLASS,
              'min-w-0 flex-1 px-3.5 placeholder:text-[#A0A0B2]',
            )}
          />
          <Button
            type="button"
            onClick={handleAdd}
            className="!h-11 shrink-0 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Add
          </Button>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#6B6B80]">
            <span className="font-semibold text-[#2D2061]">{activeCount}</span>
            {' '}
            active of {totalCount}
          </p>
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <input
              id="jobs-industries-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search industries"
              aria-label="Search industries"
              className={cn(
                CONTROL_CLASS,
                'w-full py-2 pl-9 pr-3.5 placeholder:text-[#A0A0B2]',
              )}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
          <DataTable minWidthClassName="min-w-[40rem]">
            <DataTableHead>
              <DataTableTh className="!px-5 !py-3">Industry</DataTableTh>
              <DataTableTh className="!w-36 !px-5 !py-3">Source</DataTableTh>
              <DataTableTh className="!w-24 !px-5 !py-3">Jobs</DataTableTh>
              <DataTableTh className="!w-40 !px-5 !py-3 !text-right">
                Active
              </DataTableTh>
            </DataTableHead>
            <DataTableBody>
              {filtered.length === 0 ? (
                <DataTableEmpty colSpan={4}>
                  No industries found
                </DataTableEmpty>
              ) : (
                filtered.map((row) => {
                  const isEditing = editingId === row.id
                  return (
                    <DataTableRow
                      key={row.id}
                      className="border-b border-[#F0EEF5]"
                    >
                      <DataTableTd className="!px-5 !py-3.5 !whitespace-normal font-medium text-[#2A2740]">
                        {isEditing ? (
                          <input
                            ref={editInputRef}
                            type="text"
                            value={editName}
                            onChange={(event) =>
                              setEditName(event.target.value)
                            }
                            onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                event.preventDefault()
                                saveEdit()
                              }
                              if (event.key === 'Escape') {
                                event.preventDefault()
                                cancelEdit()
                              }
                            }}
                            aria-label={`Edit ${row.name}`}
                            className={cn(
                              CONTROL_CLASS,
                              'h-9 w-full max-w-md px-3',
                            )}
                          />
                        ) : (
                          row.name
                        )}
                      </DataTableTd>
                      <DataTableTd className="!px-5 !py-3.5">
                        {row.masterList ? (
                          <span className="inline-flex rounded-full bg-[#E8E4F8] px-2.5 py-0.5 text-[11px] font-medium text-[#4C3D9A]">
                            Master list
                          </span>
                        ) : (
                          <span className="text-xs text-[#8B8B9E]">
                            Custom
                          </span>
                        )}
                      </DataTableTd>
                      <DataTableTd className="!px-5 !py-3.5 tabular-nums text-[#2A2740]">
                        {row.jobsCount}
                      </DataTableTd>
                      <DataTableTd className="!px-5 !py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <Switch
                            checked={row.active}
                            onCheckedChange={(active) =>
                              patchIndustry(row.id, { active })
                            }
                            aria-label={`${row.name} active`}
                            className="!gap-0"
                          />
                          {isEditing ? (
                            <>
                              <IconButton
                                label={`Save ${row.name}`}
                                onClick={saveEdit}
                              >
                                <Check className="size-4" strokeWidth={2} />
                              </IconButton>
                              <IconButton
                                label="Cancel edit"
                                onClick={cancelEdit}
                              >
                                <X className="size-4" strokeWidth={2} />
                              </IconButton>
                            </>
                          ) : (
                            <>
                              <IconButton
                                label={`Edit ${row.name}`}
                                onClick={() => startEdit(row)}
                              >
                                <Pencil
                                  className="size-4"
                                  strokeWidth={1.75}
                                />
                              </IconButton>
                              <IconButton
                                label={`Delete ${row.name}`}
                                danger
                                onClick={() => setPendingDelete(row)}
                              >
                                <Trash2
                                  className="size-4"
                                  strokeWidth={1.75}
                                />
                              </IconButton>
                            </>
                          )}
                        </div>
                      </DataTableTd>
                    </DataTableRow>
                  )
                })
              )}
            </DataTableBody>
          </DataTable>
        </div>
      </SettingsPanel>

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Industry"
        itemName={pendingDelete?.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
