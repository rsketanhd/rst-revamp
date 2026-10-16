import { Button, SidePanel } from '../../ui'
import { cn } from '../../../lib/cn'
import {
  SETUP_STATUS_META,
  aiRoundsBadgeLabel,
  getTwoWayInterviewSetRounds,
  type TwoWayInterviewSet,
} from '../../../data/twoWayInterviewSets'

export type ViewInterviewSetPanelProps = {
  open: boolean
  set: TwoWayInterviewSet | null
  onClose: () => void
  onEdit: () => void
  onSchedule: () => void
  onViewScheduled: () => void
}

/**
 * Interview Sets → Open interview set side panel.
 */
export function ViewInterviewSetPanel({
  open,
  set,
  onClose,
  onEdit,
  onSchedule,
  onViewScheduled,
}: ViewInterviewSetPanelProps) {
  const rounds = set ? getTwoWayInterviewSetRounds(set.id) : []
  const statusMeta = set ? SETUP_STATUS_META[set.setupStatus] : undefined
  const aiBadge = set ? aiRoundsBadgeLabel(set.aiRounds) : null

  return (
    <SidePanel
      open={open && Boolean(set)}
      onClose={onClose}
      title={set ? set.jobTitle : 'Interview set'}
      widthClassName="w-full max-w-[32rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Close
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onEdit}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Edit
          </Button>
          <Button
            type="button"
            onClick={onSchedule}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Schedule
          </Button>
        </>
      }
    >
      {set && statusMeta ? (
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-semibold uppercase',
                statusMeta.className,
              )}
            >
              {statusMeta.label}
            </span>
            {aiBadge ? (
              <span className="inline-flex h-6 items-center rounded-full bg-[#FDE7EF] px-2.5 text-[11px] font-semibold text-[#C2185B]">
                {aiBadge}
              </span>
            ) : null}
            <span className="text-xs text-[#8B8B9E]">
              {set.jobReqId} · {set.location}
            </span>
          </div>

          <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <MetaField label="Rounds" value={String(set.rounds)} />
            <MetaField label="Ready" value={`${set.readyRounds} of ${set.rounds}`} />
            <MetaField label="Scheduled" value={String(set.scheduled)} />
            <MetaField label="Organiser" value={set.organiser} />
          </dl>

          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-[#2D2061]">Rounds</h3>
              {set.scheduled > 0 ? (
                <button
                  type="button"
                  onClick={onViewScheduled}
                  className="text-[13px] font-medium text-[#2D2061] underline-offset-2 hover:underline"
                >
                  View scheduled ({set.scheduled})
                </button>
              ) : null}
            </div>

            {rounds.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[#E0DDEA] bg-[#FAFAFC] px-4 py-6 text-center text-sm text-[#8B8B9E]">
                No rounds configured yet. Edit this set to add rounds.
              </p>
            ) : (
              <ol className="flex flex-col gap-2">
                {rounds.map((round, index) => (
                  <li
                    key={round.id}
                    className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-[#E4E1EE] bg-white px-3 py-2.5 text-sm"
                  >
                    <span className="font-semibold text-[#1A1A2E]">
                      {String(index + 1).padStart(2, '0')}. {round.name}
                    </span>
                    <span className="text-[#6B6B80]">
                      {round.meetingPlatform} · {round.durationMins} min
                    </span>
                    {round.aiJoins ? (
                      <span className="inline-flex rounded-full bg-[#FDE7EF] px-2 py-0.5 text-[11px] font-semibold text-[#C2185B]">
                        Two-Way AI
                      </span>
                    ) : null}
                    <span
                      className={cn(
                        'ml-auto inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold',
                        round.ready
                          ? 'bg-[#E3F5EA] text-[#15803D]'
                          : 'bg-[#EEEEF2] text-[#6B6B80]',
                      )}
                    >
                      {round.ready ? 'Ready' : 'Pending'}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <p className="text-xs text-[#8B8B9E]">Updated {set.updatedOn}</p>
        </div>
      ) : null}
    </SidePanel>
  )
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium text-[#8B8B9E]">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-[#2D2061]">{value}</dd>
    </div>
  )
}
