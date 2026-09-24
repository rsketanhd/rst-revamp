export const JOURNEY_EVENTS = [
  {
    id: 'applied',
    title: 'Applied via Linkedin',
    actor: 'Harsh Mistry',
    at: '18 Sep 2026, 09:45am',
  },
  {
    id: 'scored',
    title: 'SniperAI scored the CV – 84% match',
    actor: 'System',
    at: '19 Sep 2026, 09:30am',
  },
  {
    id: 'ack',
    title: 'Acknowledgement email sent',
    actor: 'System',
    at: '19 Sep 2026, 09:15am',
  },
  {
    id: 'portal',
    title: 'Candidate portal account created',
    actor: 'Candidate',
    at: '18 Sep 2026, 09:00am',
  },
] as const

export const RADAR_AXES = [
  { lines: ['Identity &', 'Positioning'], score: '8/10', value: 8 },
  { lines: ['Structure &', 'Architecture'], score: '7/10', value: 7 },
  { lines: ['Timeline & Career', 'Continuity'], score: '8/10', value: 8 },
  { lines: ['Experience &', 'Representation'], score: '7/10', value: 7 },
  { lines: ['Achievement &', 'Evidence'], score: '6/10', value: 6 },
  { lines: ['Professionalism &', 'Credibility'], score: '8/10', value: 8 },
  { lines: ['Communication', 'Quality'], score: '7/10', value: 7 },
] as const

export const SCORE_BARS = [
  { label: 'Identity & Positioning', score: 8 },
  { label: 'Structure & Information Architecture', score: 7 },
  { label: 'Timeline & Career Continuity', score: 8 },
  { label: 'Experience & Representation', score: 7 },
  { label: 'Achievement & Evidence', score: 6 },
  { label: 'Professionalism & Credibility', score: 8 },
  { label: 'Communication Quality', score: 7 },
  { label: 'Differentiation & Memorability', score: 5 },
] as const

export const JOB_CRITERIA = [
  {
    title: 'Job Title',
    percent: 90,
    detail:
      "The candidate's current and past roles as Staff Software Engineer and Senior Software Engineer align directly with the Senior Full Stack Developer job title.",
  },
  {
    title: 'Job Duties And Responsibilities',
    percent: 80,
    detail:
      "The candidate's experience as a Staff Software Engineer and Senior Software Engineer at LinkedIn, involving full-stack development and platform work, strongly matches the described duties.",
  },
  {
    title: 'Required Qualifications',
    percent: 90,
    detail:
      "The candidate has attended California State University – East Bay, indicating a relevant educational background for a Bachelor's degree in Computer Science.",
  },
  {
    title: 'Must Have Skills',
    percent: 95,
    detail:
      "The candidate's CV clearly shows extensive experience with HTML, CSS, JavaScript, React, and Node.js, fulfilling all essential skill requirements.",
  },
  {
    title: 'Good To Have Skills',
    percent: 85,
    detail:
      "The candidate's CV demonstrates proficiency in SQL, Java, and PHP, aligning with the secondary skills requirement.",
  },
  {
    title: 'Industry',
    percent: 100,
    detail:
      "The candidate's work experience at LinkedIn, a prominent Information Technology company, perfectly matches the required industry.",
  },
] as const

export type JobActivity = 'active' | 'inactive'

export type TrackerFit = 'excellent' | 'good' | 'plain'

export type TrackerJob = {
  id: string
  code: string
  title: string
  status: string
  fit: TrackerFit
  fitLabel?: string
  percent: number
  appliedOn: string
  updatedOn: string
  activity: JobActivity
}

export const TRACKER_JOBS: TrackerJob[] = [
  {
    id: 'rst-112',
    code: 'RST-112',
    title: 'Entry Level Data Scientist',
    status: 'New',
    fit: 'excellent',
    fitLabel: 'Excellent Fit',
    percent: 98,
    appliedOn: '01-Jun-2025',
    updatedOn: '01-Mar-2025',
    activity: 'active',
  },
  {
    id: 'rst-110',
    code: 'RST-110',
    title: 'Junior Data Scientist',
    status: 'Interview Scheduled',
    fit: 'good',
    fitLabel: 'Good Fit',
    percent: 85,
    appliedOn: '01-Jun-2024',
    updatedOn: '01-Mar-2024',
    activity: 'active',
  },
  {
    id: 'rst-108',
    code: 'RST-108',
    title: 'Senior Data Analyst',
    status: 'New',
    fit: 'plain',
    percent: 65,
    appliedOn: '01-Jun-2023',
    updatedOn: '01-Mar-2023',
    activity: 'active',
  },
]

export const AI_RECOMMENDATIONS = [
  {
    id: 'rec-1',
    code: 'RST-108',
    title: 'Senior Data Analyst',
    percent: 65,
    strong: false,
  },
  {
    id: 'rec-2',
    code: 'RST-108',
    title: 'Senior Data Analyst',
    percent: 97,
    strong: true,
  },
] as const

export type InterviewKind = 'one-way' | 'two-way'
export type InterviewBadge = 'priority' | 'scheduled'
export type InterviewStatus = 'COMPLETED' | 'PENDING'

export type ProfileInterview = {
  id: string
  kind: InterviewKind
  job: string
  badge: string
  badgeTone: InterviewBadge
  date: string
  time: string
  status: InterviewStatus
  rating: number | null
  activity: JobActivity
}

export const PROFILE_INTERVIEWS: ProfileInterview[] = [
  {
    id: 'iv-1',
    kind: 'one-way',
    job: 'RST-112 : Entry Level Data Scientist',
    badge: 'Shortlisted',
    badgeTone: 'priority',
    date: '22 Dec 2024',
    time: '02:00 PM – 03:00 PM',
    status: 'COMPLETED',
    rating: 3,
    activity: 'active',
  },
  {
    id: 'iv-2',
    kind: 'one-way',
    job: 'RST-112 : Entry Level Data Scientist',
    badge: 'Interview Scheduled',
    badgeTone: 'scheduled',
    date: '14 Sep 2025',
    time: '02:00 PM – 03:00 PM',
    status: 'PENDING',
    rating: null,
    activity: 'active',
  },
]

export type ConversationStatus = 'OPEN' | 'CLOSED'

export type ProfileConversation = {
  id: string
  title: string
  status: ConversationStatus
}

export const PROFILE_CONVERSATIONS: ProfileConversation[] = [
  {
    id: 'msg-1',
    title: 'Document Verification & Pre-boarding Compliance',
    status: 'OPEN',
  },
  {
    id: 'msg-2',
    title: 'Salary Expectation & Benefits Alignment',
    status: 'CLOSED',
  },
  {
    id: 'msg-3',
    title: 'Initial Screening & Technical Profile Review',
    status: 'CLOSED',
  },
]

export type DocumentCategory = 'onboarding' | 'identity' | 'education' | 'medical' | 'resume'
export type DocumentKind = 'pdf' | 'image'
export type DocumentPrimary = 'accept' | 'mark-verified'

export type VaultDocument = {
  id: string
  title: string
  kind: DocumentKind
  tag: string
  category: DocumentCategory
  fileName: string
  size: string
  uploaded: string
  primary: DocumentPrimary
}

export const VAULT_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-1',
    title: 'Resume / CV (Latest Version)',
    kind: 'pdf',
    tag: 'Resume',
    category: 'resume',
    fileName: 'Ramakrishnan_N_CV_2026.pdf',
    size: '1.8 MB',
    uploaded: '3 days ago',
    primary: 'accept',
  },
  {
    id: 'doc-2',
    title: 'Resume / CV (Latest Version)',
    kind: 'pdf',
    tag: 'Resume',
    category: 'resume',
    fileName: 'Ramakrishnan_N_CV_2026.pdf',
    size: '1.8 MB',
    uploaded: '3 days ago',
    primary: 'mark-verified',
  },
  {
    id: 'doc-3',
    title: 'Passport & International Travel Scan',
    kind: 'image',
    tag: 'Identity',
    category: 'identity',
    fileName: 'Ramakrishnan_N_CV_2026.pdf',
    size: '1.8 MB',
    uploaded: '3 days ago',
    primary: 'accept',
  },
]

export const DOCUMENT_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'onboarding', label: 'Onboarding & Offer' },
  { id: 'identity', label: 'Identity Proof' },
  { id: 'education', label: 'Education' },
  { id: 'medical', label: 'Medical' },
] as const

export type DocumentFilterId = (typeof DOCUMENT_FILTERS)[number]['id']

export type NoteScope = 'general' | 'job'

export const NOTE_JOBS = [
  { id: 'software-developer', label: 'Software Developer Application' },
  { id: 'entry-data-scientist', label: 'Entry Level Data Scientist' },
] as const

export type NoteJobId = (typeof NOTE_JOBS)[number]['id']

export type ProfileNote = {
  id: string
  author: string
  role: string
  at: string
  title?: string
  body: string
  scope: NoteScope
  jobId?: NoteJobId
  jobLabel?: string
  canEdit: boolean
  canDelete: boolean
}

export const PROFILE_NOTES: ProfileNote[] = [
  {
    id: 'n1',
    author: 'Deepak Singh',
    role: 'Lead Technical Recruiter',
    at: '22 Sep 2026, 11:10',
    body: "Skills line up well for this role (PHP/JS/MySQL). Missing Laravel on the profile but it's in the CV — ask in screening.",
    scope: 'job',
    jobId: 'software-developer',
    jobLabel: 'Job : Software Developer Application',
    canEdit: true,
    canDelete: true,
  },
  {
    id: 'n2',
    author: 'Lina Al-Harbi',
    role: 'Hiring Manager',
    at: '22 Sep 2026, 11:10',
    body: 'Strong fundamentals but not enough Laravel depth for a senior role at that time. Worth re-approaching for mid-level openings.',
    scope: 'general',
    canEdit: false,
    canDelete: true,
  },
  {
    id: 'n3',
    author: 'Lina Al-Harbi',
    role: 'Hiring Manager',
    at: '22 Sep 2026, 11:10',
    body: 'Strong fundamentals but not enough Laravel depth for a senior role at that time. Worth re-approaching for mid-level openings.',
    scope: 'job',
    jobId: 'entry-data-scientist',
    canEdit: true,
    canDelete: false,
  },
  {
    id: 'n4',
    author: 'Deepak Singh',
    role: 'Lead Technical Recruiter',
    at: '21 Sep 2026, 16:40',
    body: 'Client screen is on hold until the Laravel sample is attached.',
    scope: 'job',
    jobId: 'software-developer',
    jobLabel: 'Job : Software Developer Application',
    canEdit: true,
    canDelete: true,
  },
  {
    id: 'n5',
    author: 'Lina Al-Harbi',
    role: 'Hiring Manager',
    at: '20 Sep 2026, 10:05',
    body: 'Keep this profile warm for the mid-level full-stack opening.',
    scope: 'job',
    jobId: 'entry-data-scientist',
    jobLabel: 'Job : Entry Level Data Scientist',
    canEdit: true,
    canDelete: true,
  },
]
