import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageContainer, PageHeader } from '../components/layout'
import {
  CandidateStatCards,
  ProfileCompletenessBanner,
  RecentActivityList,
  RecentlyAppliedList,
} from '../components/candidate-dashboard'
import {
  CANDIDATE_DASHBOARD_STATS,
  CANDIDATE_PROFILE_COMPLETENESS,
  CANDIDATE_RECENT_ACTIVITY,
  withLiveApplicationCount,
} from '../data/candidateDashboard'
import { getMyApplications } from '../data/myApplications'
import { getMyProfile } from '../data/myProfile'

const BANNER_DISMISS_KEY = 'rst_dismiss_profile_banner'

/**
 * Candidate home — applications, profile completeness, and recent activity.
 */
export function CandidateDashboardPage() {
  const navigate = useNavigate()
  const profile = getMyProfile()
  const [bannerDismissed, setBannerDismissed] = useState(readBannerDismissed)
  const applications = useMemo(() => getMyApplications(), [])
  const stats = useMemo(
    () =>
      withLiveApplicationCount(
        CANDIDATE_DASHBOARD_STATS,
        applications.length,
      ),
    [applications.length],
  )

  function dismissBanner() {
    sessionStorage.setItem(BANNER_DISMISS_KEY, '1')
    setBannerDismissed(true)
  }

  return (
    <PageContainer contentClassName="gap-6">
      <PageHeader
        title="Dashboard"
        subtitle="Track your applications, profile views, and recent activity."
      />

      <CandidateStatCards stats={stats} />

      {bannerDismissed ? null : (
        <ProfileCompletenessBanner
          profile={profile}
          percent={CANDIDATE_PROFILE_COMPLETENESS}
          onDismiss={dismissBanner}
          onEditProfile={() => navigate('/my-profile')}
        />
      )}

      <RecentlyAppliedList applications={applications} />
      <RecentActivityList items={CANDIDATE_RECENT_ACTIVITY} />
    </PageContainer>
  )
}

function readBannerDismissed(): boolean {
  if (typeof sessionStorage === 'undefined') return false
  return sessionStorage.getItem(BANNER_DISMISS_KEY) === '1'
}
