import { useState } from 'react'
import {
  PROFILE_INTERVIEWS,
  type InterviewBadge,
  type InterviewStatus,
  type JobActivity,
} from '../../data/candidateProfileTabs'
import { SegmentedToggle, StarRating, toast } from '../ui'
import { cn } from '../../lib/cn'
import { ProfileFold } from './ProfileFold'

const BADGE_CLASS: Record<InterviewBadge, string> = {
  priority: 'bg-[#5B4DC7] text-white',
  scheduled: 'bg-[#F3EEFF] text-[#6D5BD0]',
}

const STATUS_CLASS: Record<InterviewStatus, string> = {
  COMPLETED: 'text-[#1F9D55]',
  PENDING: 'text-[#E39B2B]',
}

export function VideoInterviewPanel() {
  const [activity, setActivity] = useState<JobActivity>('active')
  const [oneWayOpen, setOneWayOpen] = useState(true)
  const [twoWayOpen, setTwoWayOpen] = useState(false)
  const interviews = PROFILE_INTERVIEWS.filter((item) => item.activity === activity)
  const oneWay = interviews.filter((item) => item.kind === 'one-way')
  const twoWay = interviews.filter((item) => item.kind === 'two-way')

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-medium text-[#5C5870]">Jobs</span>
        <SegmentedToggle
          aria-label="Interview jobs"
          value={activity}
          onChange={setActivity}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />
      </div>

      <ProfileFold
        title="One Way Interview"
        open={oneWayOpen}
        onToggle={() => setOneWayOpen((open) => !open)}
      >
        {oneWay.length === 0 ? (
          <p className="text-[13px] text-[#8B8B9E]">No one way interviews.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {oneWay.map((item) => (
              <article key={item.id} className="rounded-lg border border-[#E8E6F0] px-3.5 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-[14px] font-semibold text-[#1A1A2E]">{item.job}</h4>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[11px] font-semibold',
                      BADGE_CLASS[item.badgeTone],
                    )}
                  >
                    {item.badge}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
                  <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-3 gap-y-2 text-[12px] sm:grid-cols-4">
                    <Meta label="Interview Date" value={item.date} />
                    <Meta label="Interview Time" value={item.time} />
                    <Meta
                      label="Interview Status"
                      value={item.status}
                      valueClassName={STATUS_CLASS[item.status]}
                    />
                    <div>
                      <p className="text-[#8B8B9E]">Interview Rating</p>
                      <div className="mt-1">
                        {item.rating === null ? (
                          <span className="font-medium text-[#8B8B9E]">Not Available</span>
                        ) : (
                          <StarRating value={item.rating} aria-label={`${item.rating} of 5 stars`} />
                        )}
                      </div>
                    </div>
                  </div>
                  <InterviewAction status={item.status} interviewId={item.id} />
                </div>
              </article>
            ))}
          </div>
        )}
      </ProfileFold>

      <ProfileFold
        title="Two Way Interview"
        open={twoWayOpen}
        onToggle={() => setTwoWayOpen((open) => !open)}
      >
        {twoWay.length === 0 ? (
          <p className="text-[13px] text-[#8B8B9E]">No two way interviews.</p>
        ) : null}
      </ProfileFold>
    </div>
  )
}

function Meta({
  label,
  value,
  valueClassName,
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div>
      <p className="text-[#8B8B9E]">{label}</p>
      <p className={cn('mt-1 font-semibold text-[#1A1A2E]', valueClassName)}>{value}</p>
    </div>
  )
}

function InterviewAction({
  status,
  interviewId,
}: {
  status: InterviewStatus
  interviewId: string
}) {
  switch (status) {
    case 'COMPLETED':
      return (
        <button
          type="button"
          onClick={() =>
            toast.success('Assessment opened', {
              description: 'The completed interview assessment is ready to review.',
            })
          }
          className="h-8 rounded-md bg-[#2D2061] px-3 text-[12px] font-semibold whitespace-nowrap text-white hover:bg-[#241a4e]"
        >
          View Assessment
        </button>
      )
    case 'PENDING':
      return (
        <button
          type="button"
          onClick={() => {
            const link = `${window.location.origin}/interview/${interviewId}`
            void navigator.clipboard?.writeText(link)
            toast.success('Interview link copied')
          }}
          className="h-8 rounded-md border border-[#D5D2E2] bg-white px-3 text-[12px] font-semibold whitespace-nowrap text-[#2D2061] hover:bg-[#F7F6FB]"
        >
          Copy Interview link
        </button>
      )
    default: {
      const unreachable: never = status
      return unreachable
    }
  }
}
