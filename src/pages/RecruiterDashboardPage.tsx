import { PageContainer, PageHeader } from '../components/layout'
import {
  ActiveCandidatesPanel,
  ActivityStatusPanel,
  DashboardKpiStrip,
  GrowthTrendsPanel,
  HiringVelocityPanel,
  LatestApplicantsPanel,
  PipelineBreakdownPanel,
  PlatformEngagementPanel,
  RecruiterJobOverviewPanel,
  SystemLicensePanel,
  UpcomingActivitiesPanel,
} from '../components/recruiter-dashboard'

/**
 * Recruiter home — full analytics dashboard matching product design.
 * Wrapped in a single shrink-0 column so tall sections are not flex-clipped
 * inside PageContainer's scrollable flex layout.
 */
export function RecruiterDashboardPage() {
  return (
    <PageContainer
      className="bg-[#F7F7FA]"
      contentClassName="!bg-[#F7F7FA] !gap-0"
    >
      <div className="flex w-full min-w-0 shrink-0 flex-col gap-5 pb-6 sm:gap-6">
        <PageHeader
          title="Dashboard"
          subtitle="At a glance you can see all of this."
        />

        <DashboardKpiStrip />

        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-3">
          <LatestApplicantsPanel />
          <RecruiterJobOverviewPanel />
          <ActivityStatusPanel />
        </div>

        <HiringVelocityPanel />

        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2">
          <SystemLicensePanel />
          <PlatformEngagementPanel />
        </div>

        <GrowthTrendsPanel />

        <PipelineBreakdownPanel />

        <ActiveCandidatesPanel />

        <UpcomingActivitiesPanel />
      </div>
    </PageContainer>
  )
}
