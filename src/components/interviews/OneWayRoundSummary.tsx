import { cn } from '../../lib/cn'
import type { OneWayRoundSummary as Summary } from '../../data/oneWayInterviews'

/**
 * One-Way Interview detail — "All rounds" total plus one progress card per round.
 * The round in progress is outlined; its bar is navy, others green.
 */
export function OneWayRoundSummary({ summary }: { summary: Summary }) {
  const lastRoundNumber = summary.rounds.length
  return (
    <section
      aria-label="Interview rounds progress"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]"
    >
      <article className="rounded-xl border border-[#E4E1EE] bg-white px-5 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
          All rounds
        </p>
        <p className="mt-1 text-xl font-bold text-[#1A1A2E]">
          {summary.totalInvites} {summary.totalInvites === 1 ? 'invite' : 'invites'}
        </p>
        <p className="mt-3 text-sm text-[#6B6B80]">
          {summary.candidates} {summary.candidates === 1 ? 'candidate' : 'candidates'}
        </p>
      </article>

      {summary.rounds.map((round) => {
        const current = round.id === summary.currentRoundId
        const percent = round.invited
          ? Math.round((round.completed / round.invited) * 100)
          : 0
        return (
          <article
            key={round.id}
            aria-current={current ? 'step' : undefined}
            className={cn(
              'rounded-xl border bg-white px-5 py-4',
              current ? 'border-[#2D2061]' : 'border-[#E4E1EE]',
            )}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
              Round {round.number}, {round.type}
            </p>
            <p className="mt-1 text-lg font-semibold text-[#1A1A2E]">{round.name}</p>
            <p className="mt-3 text-sm text-[#6B6B80]">
              {round.invited} invited, {round.completed} completed
              {round.readyForNextRound > 0 && round.number < lastRoundNumber ? (
                <>
                  ,{' '}
                  <span className="font-medium text-[#15A05B]">
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
              className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#EEEDF5]"
            >
              <div
                className={cn(
                  'h-full rounded-full',
                  current ? 'bg-[#2D2061]' : 'bg-[#1DBF84]',
                )}
                style={{ width: `${percent}%` }}
              />
            </div>
          </article>
        )
      })}
    </section>
  )
}
