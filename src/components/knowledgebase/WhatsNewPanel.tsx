import { useMemo, useState, type ReactNode } from 'react'
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react'
import { Select } from '../ui'
import {
  CURRENT_RELEASE,
  filterReleaseNotes,
  getReleaseChangeKindLabel,
  RELEASE_CHANGE_FILTERS,
  RELEASE_MODULE_OPTIONS,
  RELEASE_NOTES,
  type ReleaseChange,
  type ReleaseChangeFilterId,
  type ReleaseChangeKind,
  type ReleaseNote,
} from '../../data/releaseNotes'
import { cn } from '../../lib/cn'

/**
 * Knowledge Base → What's new: filterable expand/collapse release notes.
 */
export function WhatsNewPanel() {
  const [kindFilter, setKindFilter] = useState<ReleaseChangeFilterId>('all')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})

  const releases = useMemo(
    () => filterReleaseNotes(RELEASE_NOTES, kindFilter, moduleFilter),
    [kindFilter, moduleFilter],
  )

  function toggleExpanded(id: string): void {
    setExpandedIds((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,18rem)] lg:items-start lg:gap-6">
      <div className="min-w-0">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="group"
            aria-label="Filter by change type"
            className="flex flex-wrap gap-2"
          >
            {RELEASE_CHANGE_FILTERS.map((filter) => {
              const active = kindFilter === filter.id
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setKindFilter(filter.id)}
                  className={cn(
                    'rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
                    active
                      ? 'border-[#2D2061] bg-[#2D2061] text-white'
                      : 'border-[#D5D2E2] bg-white text-[#2D2061] hover:border-[#2D2061] hover:bg-[#F7F8FB]',
                  )}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>

          <div className="w-full sm:w-44">
            <Select
              id="release-module-filter"
              aria-label="Filter by module"
              options={[...RELEASE_MODULE_OPTIONS]}
              value={moduleFilter}
              onChange={(event) =>
                setModuleFilter(event.target.value || 'all')
              }
              className="!h-9 !text-xs"
              placeholder="All modules"
            />
          </div>
        </div>

        {releases.length === 0 ? (
          <p className="rounded-[10px] border border-[#E4E1EE] bg-[#F8F9FB] px-4 py-10 text-center text-sm text-[#8B8B9E]">
            No release notes match these filters.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {releases.map((release) => (
              <ReleaseNoteRow
                key={release.id}
                release={release}
                expanded={Boolean(expandedIds[release.id])}
                onToggle={() => toggleExpanded(release.id)}
              />
            ))}
          </ul>
        )}
      </div>

      <aside className="flex w-full flex-col gap-3 lg:sticky lg:top-4">
        <InfoCard
          title="Current version"
          icon={
            <Sparkles
              className="size-3.5 text-[#2D2061]"
              strokeWidth={2}
              aria-hidden="true"
            />
          }
        >
          <div className="flex flex-wrap items-center gap-2">
            <VersionBadge version={CURRENT_RELEASE.version} />
            <span className="text-sm text-[#5A5A72]">
              Released {CURRENT_RELEASE.releasedAt}
            </span>
          </div>
        </InfoCard>

        <InfoCard title="How versions work">
          <ul className="flex flex-col gap-2.5 text-sm leading-relaxed text-[#4A4A60]">
            <li>
              <span className="font-semibold text-[#2D2061]">First number</span>{' '}
              <span className="text-[#8B8B9E]">(1.0.0)</span> — a new module.
            </li>
            <li>
              <span className="font-semibold text-[#2D2061]">Second number</span>{' '}
              <span className="text-[#8B8B9E]">(1.1.0)</span> — a change to an
              existing module.
            </li>
            <li>
              <span className="font-semibold text-[#2D2061]">Third number</span>{' '}
              <span className="text-[#8B8B9E]">(1.0.1)</span> — fixes and
              behind-the-scenes changes.
            </li>
          </ul>
        </InfoCard>

        <InfoCard title="Stay up to date">
          <p className="text-sm leading-relaxed text-[#4A4A60]">
            A pink dot on Knowledge Base shows when there&apos;s a new version.
          </p>
        </InfoCard>
      </aside>
    </div>
  )
}

function ReleaseNoteRow({
  release,
  expanded,
  onToggle,
}: {
  release: ReleaseNote
  expanded: boolean
  onToggle: () => void
}) {
  const ChevronIcon = expanded ? ChevronDown : ChevronRight

  return (
    <li className="overflow-hidden rounded-[10px] border border-[#E8E6F0] bg-white shadow-[0_1px_2px_rgba(45,32,97,0.04)]">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="flex w-full items-center gap-2.5 px-3.5 py-3.5 text-left transition-colors hover:bg-[#FAFAFC] sm:gap-3 sm:px-4"
      >
        <VersionBadge version={release.version} />
        <span className="shrink-0 text-sm text-[#6B6B80]">{release.date}</span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#3D3A52]">
          {release.summary}
        </span>
        <span className="inline-flex size-7 shrink-0 items-center justify-center text-[#8B8B9E]">
          <ChevronIcon className="size-4" strokeWidth={2} aria-hidden="true" />
        </span>
      </button>

      {expanded ? (
        <div className="border-t border-[#F0EEF5] bg-[#FAFAFC] px-4 py-3 sm:px-5">
          <ul className="flex flex-col gap-3">
            {release.changes.map((item) => (
              <ChangeItem key={item.id} change={item} />
            ))}
          </ul>
        </div>
      ) : null}
    </li>
  )
}

function ChangeItem({ change }: { change: ReleaseChange }) {
  return (
    <li className="rounded-lg border border-[#E8E6F0] bg-white px-3.5 py-3">
      <div className="mb-1.5 flex flex-wrap items-center gap-2">
        <ChangeKindBadge kind={change.kind} />
        <span className="text-xs font-medium text-[#8B8B9E]">{change.module}</span>
      </div>
      <p className="text-sm font-semibold text-[#1A1A2E]">{change.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-[#5A5A72]">
        {change.description}
      </p>
    </li>
  )
}

function VersionBadge({ version }: { version: string }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-[#2D2061] px-2.5 py-0.5 text-xs font-semibold text-white">
      {version}
    </span>
  )
}

function ChangeKindBadge({ kind }: { kind: ReleaseChangeKind }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
        kindBadgeClass(kind),
      )}
    >
      {getReleaseChangeKindLabel(kind)}
    </span>
  )
}

function kindBadgeClass(kind: ReleaseChangeKind): string {
  switch (kind) {
    case 'new':
      return 'bg-[#E8F1FE] text-[#2F6FD6]'
    case 'ai':
      return 'bg-[#F3E8FF] text-[#7C3AED]'
    case 'improved':
      return 'bg-[#E6F6EC] text-[#15803D]'
    case 'fixed':
      return 'bg-[#FEF3C7] text-[#B45309]'
    case 'security':
      return 'bg-[#FEE8E8] text-[#C44B4B]'
    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }
}

function InfoCard({
  title,
  icon,
  children,
}: {
  title: string
  icon?: ReactNode
  children: ReactNode
}) {
  return (
    <section className="rounded-[10px] border border-[#E8E6F0] bg-white p-4 shadow-[0_4px_18px_rgba(45,32,97,0.05)]">
      <h3 className="mb-3 flex items-center gap-1.5 text-[13px] font-bold text-[#2D2061]">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  )
}
