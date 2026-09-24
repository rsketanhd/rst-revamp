import { useMemo, useState, type DragEvent } from 'react'
import { GripVertical } from 'lucide-react'
import { Button, Select, toast } from '../ui'
import { SettingsPanel } from './SettingsPanel'
import { SettingsPointerTabs } from './SettingsPointerTabs'
import { cn } from '../../lib/cn'

type VisibilityMode = 'column' | 'filter'

type PageId = 'all' | 'auto-update' | 'talent-pool'

type VisibilityField = {
  id: string
  name: string
  showInColumn: boolean
  showInFilter: boolean
}

const PAGE_OPTIONS = [
  { value: 'all', label: 'All Candidates' },
  { value: 'auto-update', label: 'Auto Update Candidates' },
  { value: 'talent-pool', label: 'Talent Pool Candidates' },
] as const

/** Default field set used by All Candidates. */
const ALL_CANDIDATES_FIELDS: VisibilityField[] = [
  { id: 'name', name: 'Name', showInColumn: true, showInFilter: true },
  { id: 'email', name: 'Email', showInColumn: true, showInFilter: true },
  {
    id: 'experience',
    name: 'Experience',
    showInColumn: true,
    showInFilter: true,
  },
  {
    id: 'job-title',
    name: 'Job Title',
    showInColumn: true,
    showInFilter: true,
  },
  { id: 'company', name: 'Company', showInColumn: true, showInFilter: true },
  { id: 'industry', name: 'Industry', showInColumn: true, showInFilter: true },
  { id: 'school', name: 'School', showInColumn: true, showInFilter: true },
  { id: 'badges', name: 'Badges', showInColumn: true, showInFilter: true },
  { id: 'skills', name: 'Skills', showInColumn: true, showInFilter: true },
  { id: 'city', name: 'City', showInColumn: true, showInFilter: true },
  { id: 'state', name: 'State', showInColumn: true, showInFilter: true },
  { id: 'country', name: 'Country', showInColumn: true, showInFilter: true },
  {
    id: 'nationality',
    name: 'Nationality',
    showInColumn: true,
    showInFilter: true,
  },
  { id: 'updated', name: 'Updated', showInColumn: false, showInFilter: true },
  { id: 'source', name: 'Source', showInColumn: true, showInFilter: true },
]

/**
 * Talent Pool Candidates — field order + visibility from design.
 * Updated is unchecked for column visibility.
 */
const TALENT_POOL_CANDIDATE_FIELDS: VisibilityField[] = [
  { id: 'name', name: 'Name', showInColumn: true, showInFilter: true },
  { id: 'email', name: 'Email', showInColumn: true, showInFilter: true },
  {
    id: 'experience',
    name: 'Experience',
    showInColumn: true,
    showInFilter: true,
  },
  {
    id: 'job-title',
    name: 'Job Title',
    showInColumn: true,
    showInFilter: true,
  },
  { id: 'company', name: 'Company', showInColumn: true, showInFilter: true },
  { id: 'industry', name: 'Industry', showInColumn: true, showInFilter: true },
  { id: 'school', name: 'School', showInColumn: true, showInFilter: true },
  { id: 'badges', name: 'Badges', showInColumn: true, showInFilter: true },
  { id: 'skills', name: 'Skills', showInColumn: true, showInFilter: true },
  { id: 'city', name: 'City', showInColumn: true, showInFilter: true },
  { id: 'state', name: 'State', showInColumn: true, showInFilter: true },
  { id: 'country', name: 'Country', showInColumn: true, showInFilter: true },
  {
    id: 'nationality',
    name: 'Nationality',
    showInColumn: true,
    showInFilter: true,
  },
  { id: 'updated', name: 'Updated', showInColumn: false, showInFilter: false },
  { id: 'source', name: 'Source', showInColumn: true, showInFilter: true },
]

/**
 * Auto Update Candidates — filter-only (no Column tab).
 * Field order + visibility from design; Updated unchecked.
 */
const AUTO_UPDATE_CANDIDATE_FIELDS: VisibilityField[] = [
  { id: 'name', name: 'Name', showInColumn: false, showInFilter: true },
  { id: 'email', name: 'Email', showInColumn: false, showInFilter: true },
  {
    id: 'experience',
    name: 'Experience',
    showInColumn: false,
    showInFilter: true,
  },
  {
    id: 'job-title',
    name: 'Job Title',
    showInColumn: false,
    showInFilter: true,
  },
  { id: 'company', name: 'Company', showInColumn: false, showInFilter: true },
  { id: 'industry', name: 'Industry', showInColumn: false, showInFilter: true },
  { id: 'school', name: 'School', showInColumn: false, showInFilter: true },
  { id: 'badges', name: 'Badges', showInColumn: false, showInFilter: true },
  { id: 'skills', name: 'Skills', showInColumn: false, showInFilter: true },
  { id: 'city', name: 'City', showInColumn: false, showInFilter: true },
  { id: 'state', name: 'State', showInColumn: false, showInFilter: true },
  { id: 'country', name: 'Country', showInColumn: false, showInFilter: true },
  {
    id: 'nationality',
    name: 'Nationality',
    showInColumn: false,
    showInFilter: true,
  },
  { id: 'updated', name: 'Updated', showInColumn: false, showInFilter: false },
  { id: 'source', name: 'Source', showInColumn: false, showInFilter: true },
]

function cloneFields(fields: VisibilityField[]): VisibilityField[] {
  return fields.map((field) => ({ ...field }))
}

function createPageConfigs(): Record<PageId, VisibilityField[]> {
  return {
    all: cloneFields(ALL_CANDIDATES_FIELDS),
    'auto-update': cloneFields(AUTO_UPDATE_CANDIDATE_FIELDS),
    'talent-pool': cloneFields(TALENT_POOL_CANDIDATE_FIELDS),
  }
}

/**
 * Settings → Talent CRM → Column & Filter Visibility.
 */
export function ColumnFilterVisibilityPanel() {
  const [page, setPage] = useState<PageId>('all')
  const [mode, setMode] = useState<VisibilityMode>('column')
  const [configs, setConfigs] = useState(createPageConfigs)
  const [dragId, setDragId] = useState<string | null>(null)

  const isAutoUpdate = page === 'auto-update'
  const activeMode: VisibilityMode = isAutoUpdate ? 'filter' : mode
  const fields = configs[page]

  function handlePageChange(next: PageId) {
    setPage(next)
    if (next === 'auto-update') {
      setMode('filter')
    }
  }

  const allVisible = useMemo(() => {
    if (fields.length === 0) return false
    return fields.every((field) =>
      activeMode === 'column' ? field.showInColumn : field.showInFilter,
    )
  }, [fields, activeMode])

  const someVisible = useMemo(() => {
    const count = fields.filter((field) =>
      activeMode === 'column' ? field.showInColumn : field.showInFilter,
    ).length
    return count > 0 && count < fields.length
  }, [fields, activeMode])

  function updatePageFields(
    updater: (current: VisibilityField[]) => VisibilityField[],
  ) {
    setConfigs((current) => ({
      ...current,
      [page]: updater(current[page]),
    }))
  }

  function toggleField(id: string, checked: boolean) {
    updatePageFields((current) =>
      current.map((field) => {
        if (field.id !== id) return field
        return activeMode === 'column'
          ? { ...field, showInColumn: checked }
          : { ...field, showInFilter: checked }
      }),
    )
  }

  function toggleAll(checked: boolean) {
    updatePageFields((current) =>
      current.map((field) =>
        activeMode === 'column'
          ? { ...field, showInColumn: checked }
          : { ...field, showInFilter: checked },
      ),
    )
  }

  function handleDragStart(id: string) {
    setDragId(id)
  }

  function handleDragOver(event: DragEvent, overId: string) {
    event.preventDefault()
    if (!dragId || dragId === overId) return
    updatePageFields((current) => {
      const from = current.findIndex((field) => field.id === dragId)
      const to = current.findIndex((field) => field.id === overId)
      if (from < 0 || to < 0 || from === to) return current
      const next = [...current]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  function handleDragEnd() {
    setDragId(null)
  }

  function handleSave() {
    const pageLabel =
      PAGE_OPTIONS.find((option) => option.value === page)?.label ?? page
    toast.success(`Visibility preferences saved for ${pageLabel}.`, {
      title: 'Settings saved',
    })
  }

  const visibilityLabel =
    activeMode === 'column' ? 'Show in Column' : 'Show in Filter'

  return (
    <SettingsPanel
      eyebrow="Talent CRM"
      title="Column & Filter Visibility"
      description="Choose which fields to show in columns and enable for filtering."
    >
      <Select
        id="column-filter-page"
        aria-label="Page"
        options={[...PAGE_OPTIONS]}
        value={page}
        onChange={(e) => handlePageChange(e.target.value as PageId)}
      />

      <SettingsPointerTabs
        aria-label="Visibility mode"
        value={activeMode}
        onChange={setMode}
        options={
          isAutoUpdate
            ? [{ value: 'filter', label: 'Filter' }]
            : [
                { value: 'column', label: 'Column' },
                { value: 'filter', label: 'Filter' },
              ]
        }
      />

      <div className="overflow-hidden rounded-lg border border-[#E8E6F0]">
        <div className="flex items-center justify-between gap-3 border-b border-[#E8E6F0] bg-white px-4 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
            Field Name
          </span>
          <label className="inline-flex items-center gap-2 text-xs font-medium text-[#6B6B80]">
            {visibilityLabel}
            <input
              type="checkbox"
              checked={allVisible}
              ref={(node) => {
                if (node) node.indeterminate = someVisible
              }}
              onChange={(e) => toggleAll(e.target.checked)}
              aria-label={`Toggle all fields for ${visibilityLabel.toLowerCase()}`}
              className="size-4 rounded border-[#C8C5D6] accent-[#2D2061]"
            />
          </label>
        </div>

        <ul className="divide-y divide-[#ECEAF3] bg-white">
          {fields.map((field, index) => {
            const checked =
              activeMode === 'column'
                ? field.showInColumn
                : field.showInFilter
            const isDragging = dragId === field.id
            return (
              <li
                key={field.id}
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = 'move'
                  handleDragStart(field.id)
                }}
                onDragOver={(event) => handleDragOver(event, field.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'flex items-center gap-3 px-3 py-3.5 transition-shadow sm:px-4',
                  index % 2 === 1 && 'bg-[#F7F7F9]',
                  isDragging &&
                    'bg-[#F0EEF5] opacity-80 ring-2 ring-inset ring-[#2D2061]/15',
                )}
              >
                <span
                  className="inline-flex size-7 shrink-0 cursor-grab items-center justify-center text-[#B0ACC4] active:cursor-grabbing"
                  aria-hidden="true"
                >
                  <GripVertical className="size-4" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1 text-sm font-medium text-[#2D2061]">
                  {field.name}
                </span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => toggleField(field.id, e.target.checked)}
                  aria-label={`${checked ? 'Hide' : 'Show'} ${field.name} in ${activeMode}`}
                  className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
                />
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSave}
          className="!h-10 min-w-[5.5rem] !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
        >
          Save
        </Button>
      </div>
    </SettingsPanel>
  )
}
