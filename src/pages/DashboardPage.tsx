import { getUserRole } from '../lib/auth'
import { CandidateDashboardPage } from './CandidateDashboardPage'
import { RecruiterDashboardPage } from './RecruiterDashboardPage'

/**
 * Home overview — recruiter analytics dashboard or candidate home by role.
 */
export function DashboardPage() {
  const role = getUserRole()
  switch (role) {
    case 'candidate':
      return <CandidateDashboardPage />
    case 'recruiter':
      return <RecruiterDashboardPage />
    default: {
      const _exhaustive: never = role
      return _exhaustive
    }
  }
}
