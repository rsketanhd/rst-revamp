export type ReleaseChangeKind =
  | 'new'
  | 'ai'
  | 'improved'
  | 'fixed'
  | 'security'

export type ReleaseChange = {
  id: string
  kind: ReleaseChangeKind
  module: string
  title: string
  description: string
}

export type ReleaseNote = {
  id: string
  version: string
  date: string
  /** Short row label shown when collapsed, e.g. "Module update - 3 changes". */
  summary: string
  changes: ReleaseChange[]
}

export const CURRENT_RELEASE = {
  version: 'v20.10.0',
  releasedAt: '15 Oct 2026',
} as const

const KB_SEEN_VERSION_KEY = 'rst-kb-seen-version'

/** Pink-dot indicator on the Knowledgebase top-bar button. */
export function hasUnseenKnowledgeRelease(): boolean {
  try {
    return localStorage.getItem(KB_SEEN_VERSION_KEY) !== CURRENT_RELEASE.version
  } catch {
    return true
  }
}

/** Call when the user opens What's new so the pink dot clears. */
export function markKnowledgeReleaseSeen(): void {
  try {
    localStorage.setItem(KB_SEEN_VERSION_KEY, CURRENT_RELEASE.version)
  } catch {
    // ignore private-mode storage failures
  }
}

export const RELEASE_CHANGE_FILTERS = [
  { id: 'all', label: 'All changes' },
  { id: 'new', label: 'New' },
  { id: 'ai', label: 'AI' },
  { id: 'improved', label: 'Improved' },
  { id: 'fixed', label: 'Fixed' },
  { id: 'security', label: 'Security' },
] as const

export type ReleaseChangeFilterId =
  (typeof RELEASE_CHANGE_FILTERS)[number]['id']

export const RELEASE_MODULE_OPTIONS = [
  { value: 'all', label: 'All modules' },
  { value: 'Jobs', label: 'Jobs' },
  { value: 'Candidates', label: 'Candidates' },
  { value: 'Jeeves AI', label: 'Jeeves AI' },
  { value: 'Interviews', label: 'Interviews' },
  { value: 'Offers', label: 'Offers' },
  { value: 'Settings', label: 'Settings' },
  { value: 'Reports', label: 'Reports' },
  { value: 'Messaging', label: 'Messaging' },
] as const

function change(
  id: string,
  kind: ReleaseChangeKind,
  module: string,
  title: string,
  description: string,
): ReleaseChange {
  return { id, kind, module, title, description }
}

function note(
  version: string,
  date: string,
  summary: string,
  changes: ReleaseChange[],
): ReleaseNote {
  return {
    id: version,
    version,
    date,
    summary,
    changes,
  }
}

/** Release notes shown on Knowledge Base → What's new (from product help). */
export const RELEASE_NOTES: ReleaseNote[] = [
  note('v20.9.0', '14 Oct 2026', 'Module update - 3 changes', [
    change(
      '20.9-1',
      'improved',
      'Jobs',
      'Faster job list filters',
      'Filter and search on the Jobs page respond more quickly on large accounts.',
    ),
    change(
      '20.9-2',
      'ai',
      'Jeeves AI',
      'Smarter chat prescreen follow-ups',
      'Jeeves asks clearer follow-up questions when a candidate answer is incomplete.',
    ),
    change(
      '20.9-3',
      'fixed',
      'Candidates',
      'Import status refresh',
      'Bulk import progress now updates correctly after a failed row is retried.',
    ),
  ]),
  note('v20.8.0', '13 Oct 2026', 'Module update - 3 changes', [
    change(
      '20.8-1',
      'new',
      'Offers',
      'Offer joining-date reminder',
      'Recruiters can set a reminder when an offer joining date is approaching.',
    ),
    change(
      '20.8-2',
      'improved',
      'Interviews',
      'One-way round summary layout',
      'Round summary cards use clearer scoring and status hierarchy.',
    ),
    change(
      '20.8-3',
      'security',
      'Settings',
      'Session timeout alignment',
      'Idle timeout now matches your organisation security policy across modules.',
    ),
  ]),
  note('v20.7.0', '9 Oct 2026', 'Module update - 3 changes', [
    change(
      '20.7-1',
      'ai',
      'Jeeves AI',
      'Question set versioning',
      'Save and restore previous versions of chat prescreen question sets.',
    ),
    change(
      '20.7-2',
      'improved',
      'Reports',
      'Hiring stage time export',
      'Export hiring-stage analytics to CSV with the same filters as on screen.',
    ),
    change(
      '20.7-3',
      'fixed',
      'Messaging',
      'SMS delivery labels',
      'Failed SMS rows show the provider reason instead of a generic error.',
    ),
  ]),
  note('v20.6.0', '8 Oct 2026', 'Module update - 3 changes', [
    change(
      '20.6-1',
      'new',
      'Candidates',
      'Profile completeness column',
      'See profile completeness percentage directly on the Candidates list.',
    ),
    change(
      '20.6-2',
      'improved',
      'Jobs',
      'AI create job review step',
      'Review AI-generated job drafts with clearer section-by-section edits.',
    ),
    change(
      '20.6-3',
      'fixed',
      'Interviews',
      'Scheduler timezone display',
      'Interview slots keep the selected timezone after reschedule.',
    ),
  ]),
  note('v20.5.0', '7 Oct 2026', 'Module update - 3 changes', [
    change(
      '20.5-1',
      'improved',
      'Offers',
      'Offer letter preview',
      'Preview the offer letter before sending without leaving the wizard.',
    ),
    change(
      '20.5-2',
      'ai',
      'Candidate Discovery',
      'Prompt suggestions',
      'Discovery chat suggests starter prompts based on the open job.',
    ),
    change(
      '20.5-3',
      'fixed',
      'Settings',
      'Role permission save',
      'Nested permission toggles persist correctly after a page refresh.',
    ),
  ]),
  note('v20.4.0', '6 Oct 2026', 'Module update - 2 changes', [
    change(
      '20.4-1',
      'new',
      'Reports',
      'Offer hired distribution chart',
      'New report shows offer-to-hired distribution by team and period.',
    ),
    change(
      '20.4-2',
      'improved',
      'Jobs',
      'Pipeline funnel colours',
      'Application funnel stages use consistent colours across Jobs and Reports.',
    ),
  ]),
  note('v20.3.0', '1 Oct 2026', 'Module update - 2 changes', [
    change(
      '20.3-1',
      'improved',
      'Interviews',
      'Two-way set duplication',
      'Duplicate an interview set including rounds and question templates.',
    ),
    change(
      '20.3-2',
      'fixed',
      'Candidates',
      'Document upload size message',
      'Clearer error when a CV exceeds the allowed upload size.',
    ),
  ]),
  note('v20.2.0', '30 Sep 2026', 'Module update - 1 change', [
    change(
      '20.2-1',
      'ai',
      'Jeeves AI',
      'Assessment intro messages',
      'Customise intro and closing copy for assessment question sets.',
    ),
  ]),
  note('v20.1.0', '29 Sep 2026', 'Module update - 1 change', [
    change(
      '20.1-1',
      'improved',
      'Messaging',
      'Email template search',
      'Find templates faster with search across name, subject and tags.',
    ),
  ]),
  note('v20.0.0', '25 Sep 2026', 'Module update - 3 changes', [
    change(
      '20.0-1',
      'new',
      'Knowledge Base',
      'In-app Knowledge Base',
      'Guides and release notes are available from the top bar Knowledgebase button.',
    ),
    change(
      '20.0-2',
      'improved',
      'Settings',
      'Module configuration navigation',
      'Settings left nav groups modules more clearly for admins.',
    ),
    change(
      '20.0-3',
      'security',
      'Settings',
      'Domain rules hardening',
      'Stricter validation on email domain allow and block rules.',
    ),
  ]),
  note('v19.9.0', '22 Sep 2026', 'Module update - 1 change', [
    change(
      '19.9-1',
      'improved',
      'Jobs',
      'Share job link copy',
      'One-click copy of the public career-page link from the job row menu.',
    ),
  ]),
  note('v19.8.0', '18 Sep 2026', 'Module update - 1 change', [
    change(
      '19.8-1',
      'fixed',
      'Offers',
      'Status badge colours',
      'Offer status badges stay readable on light and dark row hover states.',
    ),
  ]),
  note('v19.7.0', '15 Sep 2026', 'Module update - 1 change', [
    change(
      '19.7-1',
      'ai',
      'Jeeves AI',
      'Credit usage summary',
      'See remaining Jeeves credits and recent usage from Settings → General.',
    ),
  ]),
  note('v19.6.0', '11 Sep 2026', 'Module update - 2 changes', [
    change(
      '19.6-1',
      'improved',
      'Candidates',
      'Bulk tag actions',
      'Apply or remove tags for multiple candidates in one action.',
    ),
    change(
      '19.6-2',
      'fixed',
      'Interviews',
      'Public link expiry',
      'Expired one-way public links show a clear message instead of a blank page.',
    ),
  ]),
  note('v19.5.0', '8 Sep 2026', 'Module update - 1 change', [
    change(
      '19.5-1',
      'new',
      'Reports',
      'Job statistics overview',
      'High-level job KPI cards and trend charts on a dedicated report page.',
    ),
  ]),
  note('v19.4.0', '4 Sep 2026', 'Module update - 2 changes', [
    change(
      '19.4-1',
      'improved',
      'Messaging',
      'Unsubscribe list export',
      'Export unsubscribed contacts for compliance reviews.',
    ),
    change(
      '19.4-2',
      'security',
      'Settings',
      'Admin invite audit',
      'Inviting a user writes an audit entry with actor and role assigned.',
    ),
  ]),
  note('v19.3.0', '1 Sep 2026', 'Module update - 1 change', [
    change(
      '19.3-1',
      'fixed',
      'Jobs',
      'Draft publish guard',
      'Publish is blocked until required job fields are complete.',
    ),
  ]),
  note('v19.2.0', '28 Aug 2026', 'Module update - 1 change', [
    change(
      '19.2-1',
      'improved',
      'Interviews',
      'Competency mapping labels',
      'Clearer labels when mapping one-way answers to competencies.',
    ),
  ]),
  note('v19.1.0', '25 Aug 2026', 'Module update - 1 change', [
    change(
      '19.1-1',
      'new',
      'Candidates',
      'Import candidates panel',
      'Guided bulk import with template download and validation summary.',
    ),
  ]),
  note('v19.0.0', '20 Aug 2026', 'Module update - 1 change', [
    change(
      '19.0-1',
      'improved',
      'Offers',
      'Create offer wizard steps',
      'Compensation and letter steps are clearer with inline validation.',
    ),
  ]),
  note('v18.2.0', '12 Aug 2026', 'Module update - 1 change', [
    change(
      '18.2-1',
      'ai',
      'Jeeves AI',
      'Pipeline sync rules',
      'Map Jeeves outcomes to application pipeline stages from Settings.',
    ),
  ]),
  note('v18.1.0', '5 Aug 2026', 'Module update - 1 change', [
    change(
      '18.1-1',
      'fixed',
      'Reports',
      'Date range persistence',
      'Report date ranges keep your last selection when returning to the page.',
    ),
  ]),
  note('v18.0.0', '28 Jul 2026', 'Module update - 1 change', [
    change(
      '18.0-1',
      'new',
      'Client Management',
      'Create client flow',
      'Multi-step client creation with agency POC and attachments.',
    ),
  ]),
  note('v17.0.0', '15 Jul 2026', 'Module update - 1 change', [
    change(
      '17.0-1',
      'improved',
      'Jobs',
      'Job boards step',
      'Select and review job board destinations before publish.',
    ),
  ]),
  note('v16.0.0', '1 Jul 2026', 'Module update - 1 change', [
    change(
      '16.0-1',
      'new',
      'Interviews',
      'Interview scheduler',
      'Team availability and slot booking for two-way interviews.',
    ),
  ]),
  note('v15.0.0', '18 Jun 2026', 'Module update - 1 change', [
    change(
      '15.0-1',
      'improved',
      'Candidates',
      'Candidate profile tabs',
      'Notes, documents and journey panels open in a clearer tab layout.',
    ),
  ]),
  note('v14.0.0', '4 Jun 2026', 'Module update - 1 change', [
    change(
      '14.0-1',
      'ai',
      'Jeeves AI',
      'Chat prescreen library',
      'Browse, preview and assign chat prescreen sets from one library.',
    ),
  ]),
  note('v13.0.0', '20 May 2026', 'New module - 1 change', [
    change(
      '13.0-1',
      'new',
      'Candidate Discovery',
      'Candidate Discovery (RS Plus)',
      'Search and shortlist external talent with AI-assisted prompts.',
    ),
  ]),
  note('v12.13.0', '6 May 2026', 'Fixes - 1 change', [
    change(
      '12.13-1',
      'fixed',
      'Settings',
      'Login redirect after password reset',
      'Users land on the dashboard after resetting their password successfully.',
    ),
  ]),
]

export function filterReleaseNotes(
  notes: ReleaseNote[],
  kind: ReleaseChangeFilterId,
  module: string,
): ReleaseNote[] {
  const unfiltered = kind === 'all' && module === 'all'
  const moduleNeedle = module.toLowerCase()

  return notes.flatMap((release) => {
    const changes = release.changes.filter((item) => {
      if (kind !== 'all' && item.kind !== kind) return false
      if (module !== 'all' && item.module.toLowerCase() !== moduleNeedle) {
        return false
      }
      return true
    })
    if (changes.length === 0) return []

    return [
      {
        ...release,
        changes,
        summary: unfiltered ? release.summary : buildFilteredSummary(changes),
      },
    ]
  })
}

function buildFilteredSummary(changes: ReleaseChange[]): string {
  const dominant = changes[0]?.kind ?? 'improved'
  const sameKind = changes.every((item) => item.kind === dominant)
  const prefix = sameKind ? getReleaseChangeKindLabel(dominant) : 'Filtered'
  const noun = changes.length === 1 ? 'change' : 'changes'
  return `${prefix} - ${changes.length} ${noun}`
}

export function getReleaseChangeKindLabel(kind: ReleaseChangeKind): string {
  switch (kind) {
    case 'new':
      return 'New'
    case 'ai':
      return 'AI'
    case 'improved':
      return 'Improved'
    case 'fixed':
      return 'Fixed'
    case 'security':
      return 'Security'
    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }
}
