import type { DragEvent, ReactNode } from 'react'
import { ChevronDown, Copy, GripVertical, Info, SquarePen, Sparkles, Trash2, X } from 'lucide-react'
import { Collapse, Switch, ThreeDotsMenu, Tooltip } from '../../ui'
import { cn } from '../../../lib/cn'
import type { PanelRound } from './CreateRoundPanel'

/** Someone who can organise or join a round's interviews */
export type PanelMember = {
  name: string
  email: string
  /** e.g. "Mon–Fri 10:00–18:00 (GMT+04:00) Asia/Dubai" */
  hours: string
}

export type TwoWayRoundCardProps = {
  round: PanelRound
  number: number
  expanded: boolean
  onToggleExpanded: () => void
  /** People who can be added as organiser / participants */
  people: PanelMember[]
  onChange: (patch: Partial<PanelRound>) => void
  onAction: (action: 'edit' | 'duplicate' | 'remove') => void
  dragging: boolean
  onDragStart: () => void
  onDragOver: (event: DragEvent) => void
  onDragEnd: () => void
}

/**
 * Configure Panel → Rounds: one round. Collapsed by default; click the header
 * to see panel members and slot settings. Drag the handle to reorder.
 */
export function TwoWayRoundCard({
  round,
  number,
  expanded,
  onToggleExpanded,
  people,
  onChange,
  onAction,
  dragging,
  onDragStart,
  onDragOver,
  onDragEnd,
}: TwoWayRoundCardProps) {
  const ready = Boolean(round.organiser)
  const names = people.map((p) => p.name)
  const subtitle = `${round.durationMins} min · ${round.meetingPlatform} · slots open after ${round.slotsOpenAfterDays} ${round.slotsOpenAfterDays === 1 ? 'day' : 'days'}, ${round.lookAheadDays} days look ahead`

  return (
    <article
      onDragOver={onDragOver}
      className={cn(
        'overflow-hidden rounded-xl border border-[#E4E1EE] bg-white',
        dragging && 'opacity-70 ring-2 ring-[#2D2061]/20',
      )}
    >
      {/* Round row — same layout as the One-Way round card */}
      <div
        onClick={onToggleExpanded}
        className="flex cursor-pointer flex-wrap items-center gap-x-6 gap-y-3 px-3 py-3 lg:flex-nowrap"
      >
        <div className="flex min-w-[14rem] flex-1 items-center gap-3">
          <span
            draggable
            onDragStart={(e) => {
              e.stopPropagation()
              onDragStart()
            }}
            onDragEnd={onDragEnd}
            onClick={(e) => e.stopPropagation()}
            title="Drag to reorder"
            className="inline-flex cursor-grab text-[#C5C2D3] active:cursor-grabbing"
          >
            <GripVertical className="size-4" strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#2D2061] text-sm font-bold tabular-nums text-white">
            {String(number).padStart(2, '0')}
          </span>
          <div className="min-w-0">
            <p
              className={cn(
                'truncate text-[15px] font-semibold',
                round.active ? 'text-[#1F1B4D]' : 'text-[#8B8B9E]',
              )}
            >
              {round.name}
            </p>
            <p className="mt-0.5 truncate text-xs text-[#8B8B9E]">{subtitle}</p>
          </div>
        </div>

        <p className="w-40 shrink-0 truncate text-sm text-[#6B6B80]">
          Panel{' '}
          <span className="font-bold text-[#1F1B4D]">{round.organiser ?? '—'}</span>
        </p>

        <p className="flex w-44 shrink-0 items-center gap-2 text-sm text-[#6B6B80]">
          Status
          <span
            className={cn(
              'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
              ready ? 'bg-[#E6F6EC] text-[#15803D]' : 'bg-[#FDF3D7] text-[#B7791F]',
            )}
          >
            {ready ? 'Ready' : 'Needs organiser'}
          </span>
        </p>

        <div
          className="ml-auto flex shrink-0 items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onChange({ aiJoins: !round.aiJoins })}
              aria-pressed={round.aiJoins}
              className={cn(
                'inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md border px-3.5 text-[13px] font-medium',
                round.aiJoins
                  ? 'border-[#C2185B] bg-[#C2185B] text-white hover:bg-[#A8154F]'
                  : 'border-[#E9A3BD] bg-white text-[#C2185B] hover:bg-[#FFF5F8]',
              )}
            >
              <Sparkles className="size-3.5" strokeWidth={2} aria-hidden="true" />
              {round.aiJoins ? 'Two-Way AI On' : 'Enable Two-Way AI'}
            </button>
            <Tooltip
              content="Jeeves joins this round's meetings and creates results. Its interview plan and summary are set in Interviews › Set up two-way after you save."
              side="top"
              align="end"
              maxWidth={280}
            >
              <button
                type="button"
                aria-label="About Two-Way AI"
                className="inline-flex text-[#8B8B9E] hover:text-[#2D2061]"
              >
                <Info className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2 px-1">
            <span className="text-sm text-[#6B6B80]">{round.active ? 'Active' : 'Inactive'}</span>
            <Switch
              checked={round.active}
              onCheckedChange={(active) => onChange({ active })}
              aria-label={`${round.name} active`}
            />
          </div>

          <ThreeDotsMenu
            triggerLabel={`More actions for ${round.name}`}
            side="left"
            items={[
              {
                id: 'edit',
                label: 'Edit',
                icon: <SquarePen strokeWidth={1.75} aria-hidden="true" />,
              },
              {
                id: 'duplicate',
                label: 'Duplicate',
                icon: <Copy strokeWidth={1.75} aria-hidden="true" />,
              },
              {
                id: 'remove',
                label: 'Remove',
                destructive: true,
                icon: <Trash2 strokeWidth={1.75} aria-hidden="true" />,
              },
            ]}
            onItemSelect={(id) => {
              if (id === 'edit' || id === 'duplicate' || id === 'remove') onAction(id)
            }}
          />

          <button
            type="button"
            onClick={onToggleExpanded}
            aria-expanded={expanded}
            aria-label={`${expanded ? 'Hide' : 'Show'} details for ${round.name}`}
            className="inline-flex size-9 items-center justify-center rounded-md border border-[#E4E1EE] bg-[#F7F7FA] text-[#2D2061] transition-colors hover:bg-[#EFEEF5]"
          >
            <ChevronDown
              className={cn('size-4 transition-transform duration-200', expanded && 'rotate-180')}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      {/* Body */}
      <Collapse open={expanded}>
        <div className="border-t border-[#E4E1EE] bg-[#F7F7FA] p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <PeopleBox
              title="Interview Organiser"
              tone="lavender"
              members={people}
              selected={round.organiser ? [round.organiser] : []}
              options={names.filter((p) => p !== round.organiser)}
              onAdd={(person) => onChange({ organiser: person })}
              onRemove={() => onChange({ organiser: null })}
            />
            <PeopleBox
              title="Mandatory Participants"
              tone="pink"
              members={people}
              selected={round.mandatoryParticipants}
              options={names.filter(
                (p) =>
                  !round.mandatoryParticipants.includes(p) &&
                  !round.optionalParticipants.includes(p),
              )}
              onAdd={(person) =>
                onChange({ mandatoryParticipants: [...round.mandatoryParticipants, person] })
              }
              onRemove={(person) =>
                onChange({
                  mandatoryParticipants: round.mandatoryParticipants.filter((p) => p !== person),
                })
              }
            />
            <PeopleBox
              title="Optional Participants"
              tone="lavender"
              members={people}
              selected={round.optionalParticipants}
              options={names.filter(
                (p) =>
                  !round.optionalParticipants.includes(p) &&
                  !round.mandatoryParticipants.includes(p),
              )}
              onAdd={(person) =>
                onChange({ optionalParticipants: [...round.optionalParticipants, person] })
              }
              onRemove={(person) =>
                onChange({
                  optionalParticipants: round.optionalParticipants.filter((p) => p !== person),
                })
              }
            />
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-4 rounded-xl border border-[#E4E1EE] bg-white p-3 sm:grid-cols-3 lg:grid-cols-5">
            <Setting label="Duration" value={`${round.durationMins} min`} />
            <Setting label="Fallback timezone" value={round.fallbackTimezone} />
            <Setting label="Gap between start times" value={`${round.gapMins} min`} />
            <Setting
              label="Slots open after"
              value={`${round.slotsOpenAfterDays} ${round.slotsOpenAfterDays === 1 ? 'day' : 'days'}`}
            />
            <Setting label="Look ahead" value={`${round.lookAheadDays} days`} />
          </dl>
        </div>
      </Collapse>
    </article>
  )
}

const MEMBER_TONE = {
  lavender: 'bg-[#EEF0FB]',
  pink: 'bg-[#FDECEC]',
} as const

function PeopleBox({
  title,
  tone,
  members,
  selected,
  options,
  onAdd,
  onRemove,
}: {
  title: string
  tone: keyof typeof MEMBER_TONE
  /** Everyone, for looking up email / hours */
  members: PanelMember[]
  /** Names added to this box */
  selected: string[]
  options: string[]
  onAdd: (person: string) => void
  onRemove: (person: string) => void
}) {
  return (
    <section className="rounded-xl border border-[#E4E1EE] bg-white p-3">
      <header className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-[#1F1B4D]">{title}</h4>
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) onAdd(e.target.value)
          }}
          aria-label={`Add to ${title}`}
          className="h-8 w-[6.5rem] rounded-md border border-[#ddd9e8] bg-white px-2 text-sm font-semibold text-[#1A1A2E] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
        >
          <option value="">+ Add</option>
          {options.map((person) => (
            <option key={person} value={person}>
              {person}
            </option>
          ))}
        </select>
      </header>
      {selected.length === 0 ? (
        <p className="mt-2 text-sm text-[#8B8B9E]">None</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {selected.map((name) => {
            const member = members.find((m) => m.name === name)
            return (
              <li
                key={name}
                className={cn('relative animate-fade-up rounded-lg px-3 py-2.5 pr-8', MEMBER_TONE[tone])}
              >
                <p className="text-sm font-bold text-[#1A1A2E]">{name}</p>
                {member ? (
                  <>
                    <p className="mt-0.5 truncate text-[13px] text-[#1A1A2E]">{member.email}</p>
                    <p className="mt-0.5 text-xs text-[#8B8B9E]">Hours: {member.hours}</p>
                  </>
                ) : null}
                <button
                  type="button"
                  onClick={() => onRemove(name)}
                  aria-label={`Remove ${name}`}
                  className="absolute right-2 top-2 inline-flex size-5 items-center justify-center rounded text-[#8B8B9E] hover:bg-white/70 hover:text-[#E53935]"
                >
                  <X className="size-3.5" strokeWidth={2} aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

function Setting({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-[#8B8B9E]">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-[#1F1B4D]">{value}</dd>
    </div>
  )
}
