import { ArrowRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { MyApplication } from '../../data/myApplications'
import { MyApplicationMetaField } from '../my-applications/MyApplicationMetaField'
import { ApplicationStageBadge } from './ApplicationStageBadge'

export type RecentlyAppliedListProps = {
  applications: MyApplication[]
}

/**
 * Recently applied jobs on the candidate dashboard.
 */
export function RecentlyAppliedList({ applications }: RecentlyAppliedListProps) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-[#2D2061]">Recently Applied</h2>
        <Link
          to="/my-applications"
          className="inline-flex items-center gap-1 text-sm font-medium text-[#8B8B9E] transition-colors hover:text-[#2D2061]"
        >
          View all
          <ArrowRight className="size-3.5" strokeWidth={2.25} aria-hidden="true" />
        </Link>
      </div>

      <ul className="flex flex-col gap-3">
        {applications.map((application) => (
          <li key={application.id}>
            <article className="rounded-xl border border-[#E8E6F0] bg-white px-4 py-3.5 sm:px-5">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(4,minmax(0,0.9fr))_auto] lg:items-center lg:gap-5">
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-[#2D2061]">
                    {application.jobTitle}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#8B8B9E]">
                    <MapPin
                      className="size-3.5 shrink-0"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span>{application.location}</span>
                  </p>
                </div>
                <MyApplicationMetaField
                  label="Job Type"
                  value={application.jobType}
                />
                <MyApplicationMetaField
                  label="Department"
                  value={application.department}
                />
                <MyApplicationMetaField
                  label="Date Applied"
                  value={application.dateApplied}
                />
                <MyApplicationMetaField
                  label="Last Updated"
                  value={application.lastUpdated}
                />
                <div className="flex lg:justify-end">
                  <ApplicationStageBadge stageId={application.currentStageId} />
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
