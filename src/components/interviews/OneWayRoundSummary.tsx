import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import type { OneWayRoundSummary as Summary } from '../../data/oneWayInterviews'

/** 'all' or a round id */
export type RoundSelection = string

/**
 * One-Way Interview detail — left rail: "All rounds" plus one entry per
 * round. Selecting an entry filters the invitations table.
 */
export function OneWayRoundSummary({
  summary,
  selected,
  onSelect,
}: {
  summary: Summary
  selected: RoundSelection
  onSelect: (selection: RoundSelection) => void
}) {
  const allActive = selected === 'all'
  return (
    <nav
      aria-label="Interview rounds"
      className="overflow-hidden rounded-xl border border-[#E4E1EE] bg-white"
    >
      <button
        type="button"
        aria-current={allActive ? 'true' : undefined}
        onClick={() => onSelect('all')}
        className={cn(
          'block w-full border-b border-[#E4E1EE] px-4 py-3.5 text-left transition-colors',
          allActive ? 'bg-[#2D2061] text-white' : 'bg-[#F7F7FA] hover:bg-[#F1F0F7]',
        )}
      >
        <Eyebrow active={allActive}>All rounds</Eyebrow>
        <p className={cn('mt-1 text-[15px] font-bold', allActive ? 'text-white' : 'text-[#1A1A2E]')}>
          {summary.candidates} {summary.candidates === 1 ? 'candidate' : 'candidates'} ·{' '}
          {summary.totalInvites} {summary.totalInvites === 1 ? 'invite' : 'invites'}
        </p>
        <p className={cn('mt-0.5 text-xs', allActive ? 'text-white/80' : 'text-[#8B8B9E]')}>
          {summary.rounds.length} {summary.rounds.length === 1 ? 'round' : 'rounds'} ·{' '}
          {summary.completedOverall} completed overall
        </p>
      </button>

      <ol>
        {summary.rounds.map((round, index) => {
          const active = round.id === selected
          const percent = round.invited
            ? Math.round((round.completed / round.invited) * 100)
            : 0
          const hasNext = index < summary.rounds.length - 1
          return (
            <li key={round.id} className="border-b border-[#E4E1EE] last:border-b-0">
              <button
                type="button"
                aria-current={active ? 'true' : undefined}
                onClick={() => onSelect(round.id)}
                className={cn(
                  'block w-full px-4 py-3.5 text-left transition-colors',
                  active ? 'bg-[#2D2061] text-white' : 'bg-white hover:bg-[#F7F7FA]',
                )}
              >
                <Eyebrow active={active}>
                  Round {round.number} · {round.type}
                </Eyebrow>
                <p className="mt-1 flex items-center gap-2">
                  <span className={cn('text-[15px] font-semibold', active ? 'text-white' : 'text-[#1A1A2E]')}>
                    {round.name}
                  </span>
                  <span
                    className={cn(
                      'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none',
                      active ? 'bg-white text-[#2D2061]' : 'bg-[#EEEDF5] text-[#2D2061]',
                    )}
                  >
                    {round.invited}
                  </span>
                </p>
                <p className={cn('mt-1 text-xs', active ? 'text-white/85' : 'text-[#6B6B80]')}>
                  {round.completed} of {round.invited} Completed
                  {hasNext && round.readyForNextRound > 0 ? (
                    <>
                      {' · '}
                      <span className={cn('font-medium', active ? 'text-[#7EE2B8]' : 'text-[#15A05B]')}>
                        {round.readyForNextRound} ready for Round {round.number + 1}
                      </span>
                    </>
                  ) : null}
                </p>
                <div
                  role="progressbar"
                  aria-label={`${round.name} completion`}
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  className={cn(
                    'mt-2 h-1 w-full overflow-hidden rounded-full',
                    active ? 'bg-white/25' : 'bg-[#EEEDF5]',
                  )}
                >
                  <div
                    className={cn('h-full rounded-full', active ? 'bg-[#1DBF84]' : 'bg-[#2D2061]')}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function Eyebrow({ active, children }: { active: boolean; children: ReactNode }) {
  return (
    <p
      className={cn(
        'text-[11px] font-semibold uppercase tracking-[0.06em]',
        active ? 'text-white/75' : 'text-[#8B8B9E]',
      )}
    >
      {children}
    </p>
  )
}
