import { MapPin } from 'lucide-react'
import { SidePanel } from '../ui'
import {
  buildApplicationTimeline,
  type MyApplication,
} from '../../data/myApplications'
import { ApplicationStatusTimeline } from './ApplicationStatusTimeline'
import { MyApplicationMetaField } from './MyApplicationMetaField'

export type MyApplicationDetailsPanelProps = {
  open: boolean
  application: MyApplication | null
  onClose: () => void
}

/**
 * My Applications — detail drawer with job info and status timeline.
 */
export function MyApplicationDetailsPanel({
  open,
  application,
  onClose,
}: MyApplicationDetailsPanelProps) {
  const timeline = application
    ? buildApplicationTimeline(application.currentStageId)
    : []

  return (
    <SidePanel
      open={open && Boolean(application)}
      onClose={onClose}
      title={application?.jobTitle ?? 'Application Details'}
      widthClassName="w-full max-w-[38rem] min-w-0 overflow-hidden"
      bodyClassName="overflow-x-hidden bg-white p-0"
    >
      {application ? (
        <div className="flex h-full min-h-full min-w-0 bg-white">
          <section className="min-w-0 flex-1 border-r border-[#ECEAF3] p-5">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[#2D2061]">
                {application.jobTitle}
              </h2>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-[#8B8B9E]">
                <MapPin
                  className="size-3.5 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>{application.location}</span>
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <MyApplicationMetaField label="Job Type" value={application.jobType} />
              <MyApplicationMetaField
                label="Experience"
                value={application.experience}
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
            </div>
          </section>

          <aside className="w-[15rem] shrink-0 bg-[#F8F9FB] p-5">
            <ApplicationStatusTimeline stages={timeline} />
          </aside>
        </div>
      ) : null}
    </SidePanel>
  )
}
