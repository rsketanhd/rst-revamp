export type CopilotMatch = {
  title: string
  company: string
  score: number
}

export type CopilotProfileSeed = {
  name: string
  initials: string
  title: string
  years: string
  location: string
  education: string
  skills: string[]
  completeness: number
}

export const COPILOT_PROFILE: CopilotProfileSeed = {
  name: 'Faisal',
  initials: 'FA',
  title: 'Senior UI Designer',
  years: '6 years',
  location: 'Riyadh, Saudi Arabia',
  education: 'BSc Computer Science, KSU',
  skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
  completeness: 60,
}

export const COPILOT_MATCHES: CopilotMatch[] = [
  {
    title: 'Sr. Product Designer (UI/UX)',
    company: 'Riyadh Digital Bank · Riyadh',
    score: 92,
  },
  {
    title: 'Product Designer (UI)',
    company: 'Al Khaleej Insurance · Dubai · Hybrid',
    score: 84,
  },
  {
    title: 'Senior UX Designer — Mobile',
    company: 'Emirates Mobility · Abu Dhabi',
    score: 81,
  },
]

export const COPILOT_SKILL_OPTIONS = [
  'Usability Testing',
  'Accessibility (WCAG)',
  'Arabic UI / RTL',
  'Motion Design',
  'Design Tokens',
  'HTML/CSS',
  'Service Design',
  'Data Visualisation',
] as const

export const COPILOT_LOCATION_OPTIONS = [
  'Riyadh',
  'Jeddah',
  'Dubai',
  'Abu Dhabi',
  'Remote (GCC)',
  'Anywhere in GCC',
] as const

export const COPILOT_MODE_OPTIONS = ['On site', 'Hybrid', 'Remote'] as const

export const COPILOT_STATUS_OPTIONS = [
  'Employed, open to offers',
  'Employed, actively looking',
  'Not currently employed',
  'Student / recent graduate',
] as const

export const COPILOT_NOTICE_OPTIONS = [
  'Immediate',
  '2 weeks',
  '1 month',
  '2 months',
  '3 months',
] as const

export type CopilotInterviewStepId =
  | 'resume'
  | 'skills'
  | 'role'
  | 'pay'
  | 'where'
  | 'visa'
  | 'matches'

export type CopilotInterviewStep = {
  id: CopilotInterviewStepId
  gain: number
}

export const COPILOT_INTERVIEW_STEPS: CopilotInterviewStep[] = [
  { id: 'resume', gain: 5 },
  { id: 'skills', gain: 10 },
  { id: 'role', gain: 8 },
  { id: 'pay', gain: 7 },
  { id: 'where', gain: 5 },
  { id: 'visa', gain: 5 },
  { id: 'matches', gain: 0 },
]

const CANDIDATE_CHAT_REPLIES: Array<{ match: RegExp; reply: string }> = [
  {
    match: /match|job|recommend/,
    reply:
      'Opening My Jobs filtered to your recommended roles. Want me to sort by salary or by match score?',
  },
  {
    match: /interview|prep|mock/,
    reply:
      'I can run a short mock interview with typical questions, then give feedback. Ready when you are.',
  },
  {
    match: /resume|cv/,
    reply:
      'Three quick wins: add metrics to your last two roles, tag Design Systems under skills, and shorten your summary to three lines.',
  },
  {
    match: /salary|pay|money/,
    reply:
      'Senior UI/UX roles in Riyadh listed recently: SAR 18k–28k/month, median 22k. Your target sits in the upper half.',
  },
  {
    match: /recruiter|human|person/,
    reply:
      'I can open a thread with your recruiter in the Communication Hub and include this conversation for context.',
  },
  {
    match: /alert|notify/,
    reply:
      'I’ll email you when a new job scores 80% or higher. Prefer instantly, daily, or weekly?',
  },
]

const RECRUITER_CHAT_REPLIES: Array<{ match: RegExp; reply: string }> = [
  {
    match: /job|role|requisition|pipeline|jd/,
    reply:
      'I can surface jobs needing attention, finish a draft JD, or open Create Job. Which do you want?',
  },
  {
    match: /candidate|applicant|talent|shortlist|discovery/,
    reply:
      'I can review new applicants, suggest a shortlist, or open Candidate Discovery. Where should we start?',
  },
  {
    match: /interview|schedule|calendar|panel/,
    reply:
      'You have interviews on the calendar today. I can show the agenda, fill scheduling gaps, or build a prep pack.',
  },
  {
    match: /report|funnel|analytics|hire|offer|metric/,
    reply:
      'I can walk through the hiring funnel, time-to-hire, or offer/hired distribution. Which report?',
  },
]

const DEFAULT_CANDIDATE_REPLY =
  'I can help with job matches, your profile and resume, interview practice, salary insights, or reaching your recruiter. What would you like?'

const DEFAULT_RECRUITER_REPLY =
  'I can help with jobs, candidates, interview schedule, or reports. What would you like?'

export function copilotChatReply(
  text: string,
  role: 'candidate' | 'recruiter' = 'candidate',
): string {
  const normalized = text.toLowerCase()
  const replies =
    role === 'recruiter' ? RECRUITER_CHAT_REPLIES : CANDIDATE_CHAT_REPLIES
  const fallback =
    role === 'recruiter' ? DEFAULT_RECRUITER_REPLY : DEFAULT_CANDIDATE_REPLY
  return replies.find(({ match }) => match.test(normalized))?.reply ?? fallback
}
