export type CandidateDashboardStat = {
  id: 'active-applications' | 'profile-views'
  label: string
  value: number
}

export type CandidateActivityKind = 'applied' | 'interview' | 'progressed' | 'rejected'

export type CandidateActivityItem = {
  id: string
  kind: CandidateActivityKind
  title: string
  timeLabel: string
  detail?: string
}

export const CANDIDATE_DASHBOARD_STATS: CandidateDashboardStat[] = [
  { id: 'active-applications', label: 'Active Applications', value: 3 },
  { id: 'profile-views', label: 'Profile View by Recruiter', value: 90 },
]

export const CANDIDATE_PROFILE_COMPLETENESS = 60

export const CANDIDATE_RECENT_ACTIVITY: CandidateActivityItem[] = [
  {
    id: 'activity-1',
    kind: 'applied',
    title: 'Applied to Senior Software Engineer at TechCorp',
    timeLabel: '2 hours ago',
  },
  {
    id: 'activity-2',
    kind: 'interview',
    title: 'Interview scheduled with DataSystems Inc.',
    timeLabel: '5 hours ago',
    detail: 'November 5, 2025 at 2:00 PM',
  },
  {
    id: 'activity-3',
    kind: 'progressed',
    title: 'Moved to final round at CloudServe Technologies',
    timeLabel: '2 days ago',
  },
  {
    id: 'activity-4',
    kind: 'rejected',
    title: 'Application not selected for Marketing Lead at BrandCo',
    timeLabel: '3 days ago',
  },
]

export function formatDashboardStat(value: number): string {
  return String(value).padStart(2, '0')
}

export function withLiveApplicationCount(
  stats: CandidateDashboardStat[],
  applicationCount: number,
): CandidateDashboardStat[] {
  return stats.map((stat) => {
    if (stat.id !== 'active-applications') return stat
    return { ...stat, value: applicationCount }
  })
}
