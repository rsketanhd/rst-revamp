import { useMemo, useState, type ReactNode } from 'react'
import { ArrowRight, Plus } from 'lucide-react'
import {
  getTeamPanelJobs,
  jobRosterLabel,
  TEAM_PANEL_DURATION_OPTIONS,
  TEAM_PANEL_TIMEZONE_OPTIONS,
  type InterviewPanelLoop,
  type TeamPanelJob,
  type TeamPanelJobStatus,
  type TeamPanelParticipant,
} from '../../data/teamPanelConfig'
import { Button, Select, Switch, toast } from '../ui'
import { cn } from '../../lib/cn'

type StatusFilter = 'all' | 'configured' | 'pending'
type RoleKind = 'recruiter' | 'hiringManager'
type ParticipantSlot = 'organizer' | 'mandatory' | 'optional'

/**
 * Team Panel Configurations — job loop setup + configuration status sidebar.
 */
export function TeamPanelConfigurations() {
  const initialJobs = useMemo(() => getTeamPanelJobs(), [])
  const [jobs, setJobs] = useState<TeamPanelJob[]>(initialJobs)
  const [selectedJobId, setSelectedJobId] = useState(initialJobs[0]?.id ?? '')
  const [team, setTeam] = useState(
    initialJobs[0]?.teamOptions[0] ?? 'Internal Team',
  )
  const [roleKind, setRoleKind] = useState<RoleKind>('recruiter')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {}
    for (const job of initialJobs) {
      for (const panel of job.panels) {
        if (panel.defaultExpanded) map[panel.id] = true
      }
    }
    return map
  })

  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? jobs[0]

  const configuredCount = jobs.filter((j) => j.status === 'configured').length
  const pendingCount = jobs.filter((j) => j.status === 'pending').length

  const filteredSidebarJobs = useMemo(() => {
    if (statusFilter === 'all') return jobs
    return jobs.filter((j) => j.status === statusFilter)
  }, [jobs, statusFilter])

  function selectJob(jobId: string) {
    setSelectedJobId(jobId)
    const job = jobs.find((j) => j.id === jobId)
    if (job) setTeam(job.teamOptions[0] ?? 'Internal Team')
  }

  function updatePanel(
    panelId: string,
    updater: (panel: InterviewPanelLoop) => InterviewPanelLoop,
  ) {
    setJobs((current) =>
      current.map((job) => {
        if (job.id !== selectedJobId) return job
        return {
          ...job,
          panels: job.panels.map((p) =>
            p.id === panelId ? updater(p) : p,
          ),
        }
      }),
    )
  }

  function togglePanelEnabled(panelId: string, enabled: boolean) {
    updatePanel(panelId, (p) => ({ ...p, enabled }))
    setExpanded((current) => ({
      ...current,
      [panelId]: enabled,
    }))
  }

  function setPanelField(
    panelId: string,
    patch: Partial<Pick<InterviewPanelLoop, 'duration' | 'timezone'>>,
  ) {
    updatePanel(panelId, (p) => ({ ...p, ...patch }))
  }

  function addTag(panelId: string, slot: ParticipantSlot) {
    updatePanel(panelId, (panel) => {
      const person = panel[slot]
      const nextTag = `Tag ${person.tags.length + 1}`
      return {
        ...panel,
        [slot]: { ...person, tags: [...person.tags, nextTag] },
      }
    })
    toast.success('Tag added to participant.', { title: 'Add Tag' })
  }

  function handleSave() {
    toast.success('Team panel configuration saved.', { title: 'Saved' })
  }

  function handleStartMail() {
    toast.success('Applicant mail loop queued.', {
      title: 'Sending mail',
    })
  }

  if (!selectedJob) return null

  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-12 xl:items-start">
      {/* Main configuration column */}
      <div className="flex min-w-0 flex-col gap-5 xl:col-span-8 2xl:col-span-9">
        {/* Job roster */}
        <ConfigFieldRow
          label="Target Job Requisition Roster"
          hint="Independent scheduling loop configurations per role."
        >
          <Select
            options={jobs.map((j) => ({
              value: j.id,
              label: jobRosterLabel(j),
            }))}
            value={selectedJobId}
            placeholder="Select job"
            onChange={(e) => selectJob(e.target.value)}
            className="bg-white"
          />
        </ConfigFieldRow>

        {/* Team + role radios */}
        <ConfigFieldRow
          label="Target Job Requisition Roster"
          hint="Independent scheduling loop configurations per role."
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="min-w-0 flex-1">
              <Select
                options={selectedJob.teamOptions}
                value={team}
                placeholder="Select team"
                onChange={(e) => setTeam(e.target.value)}
                className="bg-white"
              />
            </div>
            <div
              className="flex shrink-0 items-center gap-4 sm:gap-5"
              role="radiogroup"
              aria-label="Configuration owner"
            >
              <RoleRadio
                checked={roleKind === 'recruiter'}
                label="Recruiter"
                onChange={() => setRoleKind('recruiter')}
              />
              <RoleRadio
                checked={roleKind === 'hiringManager'}
                label="Hiring Manager"
                onChange={() => setRoleKind('hiringManager')}
              />
            </div>
          </div>
        </ConfigFieldRow>

        {/* Panel accordions */}
        <div className="flex flex-col gap-3">
          {selectedJob.panels.map((panel) => {
            const isOpen = Boolean(expanded[panel.id])
            return (
              <InterviewPanelAccordion
                key={panel.id}
                panel={panel}
                roleLabel={selectedJob.title}
                open={isOpen}
                onToggleOpen={() =>
                  setExpanded((current) => ({
                    ...current,
                    [panel.id]: !current[panel.id],
                  }))
                }
                onEnabledChange={(on) => togglePanelEnabled(panel.id, on)}
                onDurationChange={(value) =>
                  setPanelField(panel.id, { duration: value })
                }
                onTimezoneChange={(value) =>
                  setPanelField(panel.id, { timezone: value })
                }
                onAddTag={(slot) => addTag(panel.id, slot)}
              />
            )
          })}
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 min-w-[5.5rem] !rounded-md !bg-[#2D2061] px-6 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Save
          </Button>
          <button
            type="button"
            onClick={handleStartMail}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7C3AED] transition-colors hover:text-[#6D28D9]"
          >
            Start Sending Mail to Applicants
            <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Status sidebar */}
      <aside className="xl:col-span-4 2xl:col-span-3">
        <div className="rounded-xl border border-[#E8E6F0] bg-white p-4 sm:p-5">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#2D2061]">
            Team Panel Configuration Status
          </h2>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <SummaryCard tone="configured" count={configuredCount} />
            <SummaryCard tone="pending" count={pendingCount} />
          </div>

          <div
            className="mt-4 flex flex-wrap items-center gap-1 border-b border-[#F0EEF5] pb-2"
            role="tablist"
            aria-label="Filter by status"
          >
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'configured', label: 'Configured' },
                { id: 'pending', label: 'Pending' },
              ] as const
            ).map((item) => {
              const active = statusFilter === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatusFilter(item.id)}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors',
                    active
                      ? 'bg-[#F0EEF8] text-[#2D2061]'
                      : 'text-[#8B8B9E] hover:text-[#2D2061]',
                  )}
                >
                  {item.label}
                </button>
              )
            })}
          </div>

          <ul className="mt-3 flex flex-col gap-0">
            {filteredSidebarJobs.map((job) => (
              <li key={job.id}>
                <button
                  type="button"
                  onClick={() => selectJob(job.id)}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-md px-1 py-2.5 text-left transition-colors',
                    'hover:bg-[#FAFAFC]',
                    job.id === selectedJobId && 'bg-[#F7F6FB]',
                  )}
                >
                  <span className="min-w-0 truncate text-sm font-medium text-[#2D2061]">
                    {job.title}
                  </span>
                  <StatusPill status={job.status} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}

function ConfigFieldRow({
  label,
  hint,
  children,
}: {
  label: string
  hint: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#E8E6F0] bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5">
      <div className="min-w-0 shrink-0 sm:max-w-[14rem] lg:max-w-[16rem]">
        <p className="text-sm font-bold text-[#2D2061]">{label}</p>
        <p className="mt-0.5 text-xs leading-snug text-[#8B8B9E]">{hint}</p>
      </div>
      <div className="min-w-0 w-full flex-1">{children}</div>
    </div>
  )
}

function RoleRadio({
  checked,
  label,
  onChange,
}: {
  checked: boolean
  label: string
  onChange: () => void
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <span className="relative inline-flex size-[1.125rem] shrink-0 items-center justify-center">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="peer size-[1.125rem] appearance-none rounded-full border-2 border-[#C8C5D6] transition-colors checked:border-[#2D2061]"
        />
        <span
          className={cn(
            'pointer-events-none absolute size-2 rounded-full bg-[#2D2061] opacity-0 transition-opacity',
            'peer-checked:opacity-100',
          )}
          aria-hidden="true"
        />
      </span>
      <span className="text-sm font-medium text-[#2D2061]">{label}</span>
    </label>
  )
}

function InterviewPanelAccordion({
  panel,
  roleLabel,
  open,
  onToggleOpen,
  onEnabledChange,
  onDurationChange,
  onTimezoneChange,
  onAddTag,
}: {
  panel: InterviewPanelLoop
  roleLabel: string
  open: boolean
  onToggleOpen: () => void
  onEnabledChange: (enabled: boolean) => void
  onDurationChange: (value: string) => void
  onTimezoneChange: (value: string) => void
  onAddTag: (slot: ParticipantSlot) => void
}) {
  const muted = !panel.enabled

  return (
    <section
      className={cn(
        'overflow-hidden rounded-xl border bg-white transition-colors',
        muted ? 'border-[#E8E6F0] bg-[#FAFAFC]' : 'border-[#E4E1EE]',
      )}
    >
      <header className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
        <button
          type="button"
          onClick={onToggleOpen}
          className="flex min-w-0 flex-1 items-center gap-2.5 text-left"
          aria-expanded={open}
        >
          <span
            className={cn(
              'min-w-0 text-sm font-bold',
              muted
                ? 'text-[#A0A0B2] line-through decoration-[#A0A0B2]'
                : 'text-[#2D2061]',
            )}
          >
            {panel.title} [{roleLabel}]
          </span>
          <LoopBadge enabled={panel.enabled} />
        </button>
        <Switch
          checked={panel.enabled}
          onCheckedChange={onEnabledChange}
          checkedTrackClassName="bg-[#E53955]"
          className="!gap-0"
        />
      </header>

      {open ? (
        <div className="border-t border-[#F0EEF5] px-4 pb-4 pt-4 sm:px-5">
          {/* Participants */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <ParticipantColumn
              title="Interview Organizer"
              person={panel.organizer}
              variant="organizer"
              onAddTag={() => onAddTag('organizer')}
            />
            <ParticipantColumn
              title="Mandatory Participants"
              person={panel.mandatory}
              variant="mandatory"
              onAddTag={() => onAddTag('mandatory')}
            />
            <ParticipantColumn
              title="Optional Participants"
              person={panel.optional}
              variant="optional"
              onAddTag={() => onAddTag('optional')}
            />
          </div>

          {/* Duration + timezone */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Interview Durations (Minutes)"
              options={TEAM_PANEL_DURATION_OPTIONS}
              value={panel.duration}
              onChange={(e) => onDurationChange(e.target.value)}
              className="bg-white"
            />
            <Select
              label="Fallback Target Timezone"
              options={TEAM_PANEL_TIMEZONE_OPTIONS}
              value={panel.timezone}
              onChange={(e) => onTimezoneChange(e.target.value)}
              className="bg-white"
            />
          </div>

          {/* Working hours summary */}
          <div className="mt-4 rounded-lg border border-[#E8E6F0] bg-[#F7F7FA] px-3 py-3 sm:px-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B9E]">
                  Recruiter Details
                </p>
                <p className="mt-1 text-sm font-semibold text-[#2D2061]">
                  {panel.workingHours.recruiterName}
                </p>
                <p className="truncate text-xs text-[#7C3AED]">
                  {panel.workingHours.recruiterEmail}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B9E]">
                  Working Days
                </p>
                <p className="mt-1 text-sm font-medium text-[#2D2061]">
                  {panel.workingHours.workingDays.join(', ')}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B9E]">
                  Start Time Hrs
                </p>
                <p className="mt-1 text-sm font-semibold text-[#12B76A]">
                  {panel.workingHours.startTime}
                </p>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#8B8B9E]">
                  End Time Hrs
                </p>
                <p className="mt-1 text-sm font-semibold text-[#E53955]">
                  {panel.workingHours.endTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function LoopBadge({ enabled }: { enabled: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.04em]',
        enabled
          ? 'bg-[#F5C56B] text-[#5C3D0A]'
          : 'bg-[#E5E5EA] text-[#6B6B80]',
      )}
    >
      {enabled ? 'Active Loop' : 'Muted Loop'}
    </span>
  )
}

function ParticipantColumn({
  title,
  person,
  variant,
  onAddTag,
}: {
  title: string
  person: TeamPanelParticipant
  variant: ParticipantSlot
  onAddTag: () => void
}) {
  const cardClass =
    variant === 'mandatory'
      ? 'border-[#F5C4C8] bg-[#FFF5F6]'
      : variant === 'organizer'
        ? 'border-[#E4E1EE] bg-white'
        : 'border-[#E4E1EE] bg-[#F7F7FA]'

  const emailClass =
    variant === 'organizer'
      ? 'text-[#7C3AED]'
      : variant === 'mandatory'
        ? 'text-[#E53955]'
        : 'text-[#2D2061]'

  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-bold text-[#2D2061]">{title}</p>
      <div className={cn('rounded-lg border px-3 py-2.5', cardClass)}>
        <p className="text-sm font-semibold text-[#2D2061]">{person.name}</p>
        <p className={cn('truncate text-xs font-medium', emailClass)}>
          {person.email}
        </p>
        <p className="mt-1 text-[11px] leading-snug text-[#8B8B9E]">
          {person.hoursNote}
        </p>
        {person.tags.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {person.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#2D2061] ring-1 ring-[#E4E1EE]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onAddTag}
        className="mt-2 inline-flex h-8 items-center gap-1 rounded-md border border-[#E4E1EE] bg-white px-2.5 text-[11px] font-bold uppercase tracking-wide text-[#2D2061] transition-colors hover:bg-[#F7F6FB]"
      >
        <Plus className="size-3" strokeWidth={2.5} aria-hidden="true" />
        Add Tag
      </button>
    </div>
  )
}

function SummaryCard({
  tone,
  count,
}: {
  tone: 'configured' | 'pending'
  count: number
}) {
  const isConfigured = tone === 'configured'
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-3',
        isConfigured
          ? 'border-[#A7E7C3] bg-[#F0FDF6]'
          : 'border-[#F5D08A] bg-[#FFF8EB]',
      )}
    >
      <p
        className={cn(
          'text-xs font-semibold',
          isConfigured ? 'text-[#15803D]' : 'text-[#B45309]',
        )}
      >
        {isConfigured ? 'Configured' : 'Pending'}
      </p>
      <p
        className={cn(
          'mt-1 text-2xl font-bold tabular-nums',
          isConfigured ? 'text-[#15803D]' : 'text-[#B45309]',
        )}
      >
        {count}
      </p>
    </div>
  )
}

function StatusPill({ status }: { status: TeamPanelJobStatus }) {
  const configured = status === 'configured'
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
        configured
          ? 'bg-[#DCFCE7] text-[#15803D]'
          : 'bg-[#FFEDD5] text-[#C2410C]',
      )}
    >
      {configured ? 'Configured' : 'Pending'}
    </span>
  )
}
