export type KnowledgeTocItem = {
  id: string
  label: string
}

export type KnowledgeArticleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; id: string; text: string }
  | { type: 'ordered-list'; items: string[] }
  | { type: 'unordered-list'; items: string[] }
  | { type: 'callout'; tone: 'info' | 'important'; title: string; text: string }
  | {
      type: 'table'
      headers: string[]
      rows: string[][]
    }
  | { type: 'figure'; caption: string; label: string }

export type KnowledgeArticleDetail = {
  id: string
  title: string
  module: string
  updatedAt: string
  readMins: number
  toc: KnowledgeTocItem[]
  blocks: KnowledgeArticleBlock[]
}

export type KnowledgeModuleNav = {
  id: string
  title: string
  articles: Array<{ id: string; title: string }>
}

export const KNOWLEDGE_MODULE_NAV: KnowledgeModuleNav[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    articles: [
      { id: 'welcome', title: 'Welcome to Recruitment SMART' },
      { id: 'recruiter-profile', title: 'Set up your recruiter profile' },
      { id: 'create-job', title: 'Create and edit a job' },
      { id: 'invite-team', title: 'Invite your team members' },
    ],
  },
  {
    id: 'candidates-jobs',
    title: 'Candidates & Jobs',
    articles: [
      { id: 'import-candidates', title: 'Import Candidates' },
      { id: 'candidate-page', title: 'Candidate page' },
      { id: 'candidate-discovery', title: 'Candidate Discovery (RS Plus)' },
      { id: 'pipelines', title: 'Manage application pipelines' },
    ],
  },
  {
    id: 'messaging',
    title: 'Messaging',
    articles: [
      {
        id: 'messaging',
        title: 'Messaging (Email Sender, Email Templates, SMS, Unsubscribes)',
      },
    ],
  },
  {
    id: 'offers-reports',
    title: 'Offers & Reports',
    articles: [
      {
        id: 'offer-management',
        title: 'Offer Management: list and Create Offer',
      },
      { id: 'reports-overview', title: 'Using reports and analytics' },
    ],
  },
]

const CREATE_JOB_ARTICLE: KnowledgeArticleDetail = {
  id: 'create-job',
  title: 'Create and edit a job',
  module: 'Getting Started',
  updatedAt: '16 Oct 2026',
  readMins: 14,
  toc: [
    { id: 'overview', label: 'Overview' },
    { id: 'create-new-job', label: 'Create a new job' },
    { id: 'job-details', label: 'Job details & pipeline' },
    { id: 'publish', label: 'Publish and share' },
    { id: 'edit-existing', label: 'Edit an existing job' },
    { id: 'permitted-actions', label: 'Permitted actions' },
  ],
  blocks: [
    {
      type: 'paragraph',
      text: 'The Jobs page is where recruiters create, publish and maintain openings. From here you can open the create-job wizard, duplicate a listing, update stages, and share the career-page link with candidates.',
    },
    {
      type: 'paragraph',
      text: 'This article explains how to create a job, what each step in the wizard covers, and which actions are available after a job is live.',
    },
    { type: 'heading', id: 'overview', text: 'Overview' },
    {
      type: 'unordered-list',
      items: [
        'Jobs live under Jobs in the main navigation.',
        'Use Create New Job (or AI Create) to open the wizard.',
        'Draft jobs stay invisible to candidates until you publish.',
        'Pipeline stages control how applications move after candidates apply.',
      ],
    },
    {
      type: 'figure',
      label: 'Jobs list',
      caption:
        'Jobs list with status filters, search and the Create New Job action.',
    },
    { type: 'heading', id: 'create-new-job', text: 'Create a new job' },
    {
      type: 'ordered-list',
      items: [
        'Go to Jobs and select Create New Job.',
        'Choose whether to start from a blank form or generate a draft with AI.',
        'Complete Job Details: title, location, employment type and description.',
        'Review the pipeline stages and adjust if your hiring process differs.',
        'Add screening questions or assessments if required, then continue to Review.',
        'Select Save Draft or Publish when the review looks correct.',
      ],
    },
    {
      type: 'callout',
      tone: 'info',
      title: 'Tip',
      text: 'You can leave a draft and return later. Candidates only see the job after Publish.',
    },
    { type: 'heading', id: 'job-details', text: 'Job details & pipeline' },
    {
      type: 'paragraph',
      text: 'Job Details holds the content shown on the career page. The Pipeline step maps application statuses to your hiring workflow. Changes here apply to new applicants; existing applications keep their current stage until you move them.',
    },
    {
      type: 'figure',
      label: 'Create job wizard',
      caption: 'Create job wizard — Job Details step with title and description.',
    },
    { type: 'heading', id: 'publish', text: 'Publish and share' },
    {
      type: 'unordered-list',
      items: [
        'Publish makes the job available on your career page and internal search.',
        'Use Share from the job row to copy the public link or invite recruiters.',
        'Unpublishing hides the listing without deleting applications.',
      ],
    },
    {
      type: 'callout',
      tone: 'important',
      title: 'Important',
      text: 'Unpublishing does not remove candidates already in the pipeline. Review Offer and Interview stages before closing a role.',
    },
    { type: 'heading', id: 'edit-existing', text: 'Edit an existing job' },
    {
      type: 'ordered-list',
      items: [
        'Open Jobs and find the listing with search or filters.',
        'Select the job title or Edit from the row menu.',
        'Update details, pipeline or questions, then Save.',
        'If the job is published, career-page content updates immediately.',
      ],
    },
    {
      type: 'heading',
      id: 'permitted-actions',
      text: 'Permitted actions',
    },
    {
      type: 'paragraph',
      text: 'What you can do on the Jobs page depends on your role permissions.',
    },
    {
      type: 'table',
      headers: ['Action', 'Recruiter', 'Hiring Manager', 'Admin'],
      rows: [
        ['View jobs', 'Yes', 'Yes', 'Yes'],
        ['Create / edit jobs', 'Yes', 'Limited', 'Yes'],
        ['Publish / unpublish', 'Yes', 'No', 'Yes'],
        ['Delete jobs', 'No', 'No', 'Yes'],
        ['Configure pipeline defaults', 'No', 'No', 'Yes'],
      ],
    },
  ],
}

function buildSimpleArticle(
  id: string,
  title: string,
  module: string,
  readMins: number,
): KnowledgeArticleDetail {
  const slug = id
  return {
    id,
    title,
    module,
    updatedAt: '16 Oct 2026',
    readMins,
    toc: [
      { id: `${slug}-overview`, label: 'Overview' },
      { id: `${slug}-steps`, label: 'How to use it' },
      { id: `${slug}-tips`, label: 'Tips' },
    ],
    blocks: [
      {
        type: 'paragraph',
        text: `${title} is covered in the ${module} section of the Recruitment SMART knowledgebase. Use this guide to understand the main screens and the actions available to your role.`,
      },
      {
        type: 'heading',
        id: `${slug}-overview`,
        text: 'Overview',
      },
      {
        type: 'paragraph',
        text: `This article summarises how ${title.toLowerCase()} works in day-to-day recruiting, what you will see on the page, and when to use each control.`,
      },
      {
        type: 'figure',
        label: title,
        caption: `Example view related to ${title}.`,
      },
      {
        type: 'heading',
        id: `${slug}-steps`,
        text: 'How to use it',
      },
      {
        type: 'ordered-list',
        items: [
          'Open the related module from the main navigation or Settings.',
          'Locate the feature described in this article.',
          'Follow the on-screen fields and confirm your changes.',
          'Review the result on the list or detail page.',
        ],
      },
      {
        type: 'heading',
        id: `${slug}-tips`,
        text: 'Tips',
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Tip',
        text: 'If a control is disabled, check Role Management — your permission set may not include this action.',
      },
      {
        type: 'unordered-list',
        items: [
          'Save drafts before publishing changes that affect candidates.',
          'Use Search and filters on list pages to find records faster.',
          'Contact your admin if a module is missing from your navigation.',
        ],
      },
    ],
  }
}

const ARTICLE_INDEX: Record<string, KnowledgeArticleDetail> = {
  'create-job': CREATE_JOB_ARTICLE,
  welcome: buildSimpleArticle(
    'welcome',
    'Welcome to Recruitment SMART',
    'Getting Started',
    8,
  ),
  'recruiter-profile': buildSimpleArticle(
    'recruiter-profile',
    'Set up your recruiter profile',
    'Getting Started',
    10,
  ),
  'invite-team': buildSimpleArticle(
    'invite-team',
    'Invite your team members',
    'Getting Started',
    9,
  ),
  'import-candidates': buildSimpleArticle(
    'import-candidates',
    'Import Candidates',
    'Candidates & Jobs',
    12,
  ),
  'candidate-page': buildSimpleArticle(
    'candidate-page',
    'Candidate page',
    'Candidates & Jobs',
    15,
  ),
  'candidate-discovery': buildSimpleArticle(
    'candidate-discovery',
    'Candidate Discovery (RS Plus)',
    'Candidates & Jobs',
    14,
  ),
  pipelines: buildSimpleArticle(
    'pipelines',
    'Manage application pipelines',
    'Candidates & Jobs',
    11,
  ),
  messaging: buildSimpleArticle(
    'messaging',
    'Messaging (Email Sender, Email Templates, SMS, Unsubscribes)',
    'Messaging',
    17,
  ),
  'offer-management': buildSimpleArticle(
    'offer-management',
    'Offer Management: list and Create Offer',
    'Offers & Reports',
    14,
  ),
  'reports-overview': buildSimpleArticle(
    'reports-overview',
    'Using reports and analytics',
    'Offers & Reports',
    12,
  ),
}

/** Resolve a knowledgebase article by id, or undefined if unknown. */
export function getKnowledgeArticle(
  id: string,
): KnowledgeArticleDetail | undefined {
  return ARTICLE_INDEX[id]
}

/** Module nav entry that contains the given article id. */
export function getKnowledgeModuleForArticle(
  articleId: string,
): KnowledgeModuleNav | undefined {
  return KNOWLEDGE_MODULE_NAV.find((module) =>
    module.articles.some((item) => item.id === articleId),
  )
}

/** Map a display title (from listing cards) to an article id when possible. */
export function getKnowledgeArticleIdByTitle(title: string): string | undefined {
  const normalised = title.trim().toLowerCase()

  const fromIndex = Object.values(ARTICLE_INDEX).find(
    (article) => article.title.toLowerCase() === normalised,
  )
  if (fromIndex) return fromIndex.id

  for (const module of KNOWLEDGE_MODULE_NAV) {
    const match = module.articles.find(
      (item) => item.title.toLowerCase() === normalised,
    )
    if (match) return match.id
  }

  return undefined
}
