import { useLocation } from 'react-router-dom'

const TITLES: Record<string, string> = {
  '/jobs': 'Jobs',
  '/candidates': 'Candidates',
  '/candidate-discovery': 'Candidate Discovery',
  '/client-management': 'Client Management',
  '/talent-crm': 'Talent CRM',
  '/jeeves-ai': 'Jeeves AI',
  '/e2e-interviews': 'E2E Interviews',
  '/e2e-interviews/schedule': 'Interview Schedule',
  '/e2e-interviews/feedback': 'Interview Feedback',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export function ModulePage() {
  const { pathname } = useLocation()
  const title = TITLES[pathname] ?? 'Module'

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold tracking-tight text-brand-800">{title}</h1>
      <p className="mt-2 text-sm text-muted">
        This module page is ready for content. The shared side navigation stays available
        across the product.
      </p>
    </div>
  )
}
