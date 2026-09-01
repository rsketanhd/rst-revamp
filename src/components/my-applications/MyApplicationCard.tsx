import { MapPin } from 'lucide-react'
import type { MyApplication } from '../../data/myApplications'
import { MyApplicationMetaField } from './MyApplicationMetaField'

export type MyApplicationCardProps = {
  application: MyApplication
  onOpen?: (application: MyApplication) => void
}

/**
 * Single job application row card (My Applications list).
 */
export function MyApplicationCard({ application, onOpen }: MyApplicationCardProps) {
  return (
    <article className="rounded-lg border border-[#E8E6F0] bg-white px-4 py-4 sm:px-5 sm:py-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.35fr)_repeat(5,minmax(0,1fr))] lg:items-start lg:gap-6">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[#2D2061] sm:text-[15px]">
            <button
              type="button"
              onClick={() => onOpen?.(application)}
              className="cursor-pointer text-left text-inherit"
            >
              {application.jobTitle}
            </button>
          </h2>
          <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#8B8B9E]">
            <MapPin className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            <span>{application.location}</span>
          </p>
        </div>

        <MyApplicationMetaField label="Job Type" value={application.jobType} />
        <MyApplicationMetaField label="Experience" value={application.experience} />
        <MyApplicationMetaField label="Department" value={application.department} />
        <MyApplicationMetaField
          label="Date Applied"
          value={application.dateApplied}
        />
        <MyApplicationMetaField
          label="Last Updated"
          value={application.lastUpdated}
        />
      </div>
    </article>
  )
}
