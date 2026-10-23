import { Navigate, useNavigate } from 'react-router-dom'
import { CopilotInterview } from '../components/copilot/CopilotInterview'
import { getUserRole } from '../lib/auth'
import {
  getAuthEmail,
  hasCompletedCopilotSetup,
  markCopilotSetupComplete,
} from '../lib/copilot'

export function CopilotSetupPage() {
  const navigate = useNavigate()
  const email = getAuthEmail()
  const shouldSetup =
    getUserRole() === 'candidate' && !hasCompletedCopilotSetup(email)

  if (!shouldSetup) {
    return <Navigate to="/dashboard" replace />
  }

  function finish() {
    markCopilotSetupComplete(email)
    navigate('/dashboard', { replace: true, state: { openCopilot: true } })
  }

  return <CopilotInterview onComplete={finish} />
}
