import { useLocation } from 'react-router-dom'
import { PageContainer, PageHeader } from '../components/layout'

const TITLES: Record<string, { title: string; subtitle: string }> = {
  '/jobs': {
    title: 'Jobs',
    subtitle: 'Monitor and optimize your job postings performance.',
  },
  '/candidates': {
    title: 'Candidates',
    subtitle: 'Monitor and optimize your job postings performance.',
  },
  '/candidate-discovery': {
    title: 'Candidate Discovery',
    subtitle: 'Find and engage talent across your discovery channels.',
  },
  '/client-management': {
    title: 'Client Management',
    subtitle: 'Manage client accounts, contacts, and relationships.',
  },
  '/talent-crm': {
    title: 'Talent CRM',
    subtitle: 'Engage and nurture your talent pipeline.',
  },
  '/jeeves-ai': {
    title: 'Jeeves AI',
    subtitle: 'AI-assisted recruiting workflows and insights.',
  },
  '/e2e-interviews': {
    title: 'E2E Interviews',
    subtitle: 'Run and track end-to-end interview workflows.',
  },
  '/e2e-interviews/one-way': {
    title: 'One-Way Interviews',
    subtitle: 'Configure and review asynchronous interview sessions.',
  },
  '/e2e-interviews/two-way': {
    title: 'Two-Way Interviews',
    subtitle: 'Schedule and manage live interview sessions.',
  },
  '/e2e-interviews/scheduler': {
    title: 'Interview Scheduler & Analytics',
    subtitle: 'Coordinate interviews and collect feedback in one place.',
  },
  '/e2e-interviews/schedule': {
    title: 'Interview Schedule',
    subtitle: 'View and manage upcoming interview appointments.',
  },
  '/e2e-interviews/feedback': {
    title: 'Interview Feedback',
    subtitle: 'Capture and review interview feedback.',
  },
  '/reports': {
    title: 'Reports',
    subtitle: 'Track recruitment metrics and performance reports.',
  },
  '/settings': {
    title: 'Settings',
    subtitle: 'Track credit balance, usage, and purchase history.',
  },
}

export function ModulePage() {
  const { pathname } = useLocation()
  const meta = TITLES[pathname] ?? {
    title: 'Module',
    subtitle:
      'This module page is ready for content. The shared side navigation stays available across the product.',
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader title={meta.title} subtitle={meta.subtitle} />
      <p className="text-sm text-muted">
        This module page is ready for content. The shared side navigation stays
        available across the product.
      </p>
    </PageContainer>
  )
}
