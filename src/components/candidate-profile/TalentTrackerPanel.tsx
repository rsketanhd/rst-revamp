import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { AI_RECOMMENDATIONS, TRACKER_JOBS, type JobActivity, type TrackerFit } from '../../data/candidateProfileTabs'
import { SegmentedToggle, toast } from '../ui'
import { cn } from '../../lib/cn'
import { ProfileFold } from './ProfileFold'

const FIT_CLASS: Record<TrackerFit, string> = {
  excellent: 'text-[#1F9D55]',
  good: 'text-[#E39B2B]',
  plain: 'text-[#8B8B9E]',
}

export function TalentTrackerPanel() {
  const [activity, setActivity] = useState<JobActivity>('active')
  const [jobsOpen, setJobsOpen] = useState(true)
  const [recommendationsOpen, setRecommendationsOpen] = useState(true)
  const jobs = TRACKER_JOBS.filter((job) => job.activity === activity)

  return (
    <div className="flex flex-col gap-3">
      <ProfileFold
        title="All Jobs"
        open={jobsOpen}
        onToggle={() => setJobsOpen((open) => !open)}
        aside={
          <SegmentedToggle
            aria-label="Job activity"
            value={activity}
            onChange={setActivity}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        }
      >
        {jobs.length === 0 ? (
          <p className="text-[13px] text-[#8B8B9E]">No inactive jobs.</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {jobs.map((job) => (
              <article key={job.id} className="rounded-lg border border-[#E8E6F0] px-3.5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-[14px] font-semibold text-[#1A1A2E]">
                        {job.code} : {job.title}
                      </h4>
                      <span className="rounded-full bg-[#F3EEFF] px-2 py-0.5 text-[11px] font-semibold text-[#6D5BD0]">
                        {job.status}
                      </span>
                    </div>
                    <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#8B8B9E]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3.5" strokeWidth={2} aria-hidden="true" />
                        Applied On: {job.appliedOn}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="size-3.5" strokeWidth={2} aria-hidden="true" />
                        Last Updated On: {job.updatedOn}
                      </span>
                    </p>
                  </div>
                  <p className={cn('shrink-0 text-right text-[13px] font-semibold', FIT_CLASS[job.fit])}>
                    {job.fitLabel ? (
                      <span className="block text-[11px] font-medium">{job.fitLabel}</span>
                    ) : null}
                    {job.percent}%
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </ProfileFold>

      <ProfileFold
        title="AI Recommendations"
        open={recommendationsOpen}
        onToggle={() => setRecommendationsOpen((open) => !open)}
        headerClassName="bg-[#F7F4FC]"
      >
        <button
          type="button"
          onClick={() =>
            toast.success('AI recommendations ready', {
              description: 'The suggested jobs are listed below.',
            })
          }
          className="mb-3 flex h-10 w-full items-center justify-center rounded-lg border border-[#D9D0F5] text-[13px] font-semibold text-[#6D5BD0] hover:bg-[#F7F4FC]"
        >
          Generate AI Recommendations
        </button>
        <div className="flex flex-col gap-2.5">
          {AI_RECOMMENDATIONS.map((item) => (
            <article
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-[#E8E6F0] px-3.5 py-3"
            >
              <h4 className="text-[14px] font-semibold text-[#1A1A2E]">
                {item.code} : {item.title}
              </h4>
              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={cn(
                    'text-[13px] font-semibold',
                    item.strong ? 'text-[#1F9D55]' : 'text-[#8B8B9E]',
                  )}
                >
                  {item.percent}%
                </span>
                <button
                  type="button"
                  onClick={() =>
                    toast.success('Added to job', {
                      description: `${item.code} : ${item.title}`,
                    })
                  }
                  className="h-8 rounded-md border border-[#D5D2E2] px-3 text-[12px] font-semibold text-[#2D2061] hover:bg-[#F7F6FB]"
                >
                  Add to Job
                </button>
              </div>
            </article>
          ))}
        </div>
      </ProfileFold>
    </div>
  )
}
