export const AI_JOB_PROMPT_PLACEHOLDER =
  'Create a job for a Head of Engineering in London. Looking for candidates with 10+ years of software engineering experience and at least 5 years leading engineering teams. Hybrid work model. Candidates must reside within 50 km of London. Salary £120,000–£150,000. Hiring for 2 positions.'

export const AI_SUGGESTED_PROMPTS = [
  {
    id: 'prompt-1',
    text: 'Senior Frontend Engineer for a high-growth fintech startup in Riyadh. Remote/Hybrid workflow, focus on React and design systems.',
  },
  {
    id: 'prompt-2',
    text: 'Product Marketing Manager targeting GCC markets. 5+ years experience in SaaS, based in Dubai or Abu Dhabi.',
  },
  {
    id: 'prompt-3',
    text: 'Graduate Engineering Program in Jeddah. Focused on civil and structural engineering for major infrastructure projects.',
  },
] as const

export type SimilarJobMatch = {
  id: string
  title: string
  department: string
  matchPercent: number
}

/** Demo duplicates returned after an AI prompt Continue. */
export const AI_SIMILAR_JOBS: SimilarJobMatch[] = [
  {
    id: 'dup-1',
    title: 'Senior React Developer',
    department: 'Engineering',
    matchPercent: 95,
  },
  {
    id: 'dup-2',
    title: 'Frontend Specialist (Contract)',
    department: 'Engineering',
    matchPercent: 95,
  },
]

export type AiCreateJobNavState = {
  /** Prompt used to seed the job description */
  aiPrompt?: string
  /** Selected similar/existing job to copy from */
  similarJobId?: string
  similarJobTitle?: string
}
