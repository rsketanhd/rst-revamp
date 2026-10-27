import { useEffect } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { CopilotInterview } from '../components/copilot/CopilotInterview'
import { getUserRole } from '../lib/auth'
import {
  clearCopilotSetup,
  getAuthEmail,
  hasCompletedCopilotSetup,
  markCopilotSetupComplete,
} from '../lib/copilot'

/**
 * First-login (or forced replay) Copilot profile interview for candidates.
 * Pass `?force=1` to clear completion and reopen the flow anytime.
 */
export function CopilotSetupPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = getAuthEmail()
  const forceReplay = searchParams.get('force') === '1'
  const isCandidate = getUserRole() === 'candidate'

  useEffect(() => {
    if (forceReplay && isCandidate) {
      clearCopilotSetup(email)
    }
  }, [forceReplay, isCandidate, email])

  const shouldSetup =
    isCandidate && (forceReplay || !hasCompletedCopilotSetup(email))

  if (!isCandidate) {
    return <Navigate to="/dashboard" replace />
  }

  if (!shouldSetup) {
    return <Navigate to="/dashboard" replace />
  }

  function finish() {
    markCopilotSetupComplete(email)
    navigate('/dashboard', { replace: true, state: { openCopilot: true } })
  }

  return <CopilotInterview onComplete={finish} />
}
