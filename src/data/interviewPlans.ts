import { getScheduledInterviews, type ScheduledInterview } from './scheduledInterviews'

/**
 * Two-Way AI interview plan (demo data): what Jeeves prepared for an
 * interview — resume fit, strengths, skills, job context and question bank.
 */

export type FitCriterion = { label: string; score: number }

export type QuestionBankCategory = 'technical' | 'behavioral' | 'iceBreakers' | 'vista'

export type InterviewPlan = {
  interview: ScheduledInterview
  overallFit: number
  criteria: FitCriterion[]
  strengths: string[]
  weaknesses: string[]
  /** matched = candidate has it */
  skills: Array<{ name: string; matched: boolean }>
  resumeSummary: string
  jobDescription: string
  jobRequirement: string
  questions: Record<QuestionBankCategory, string[]>
}

export const QUESTION_CATEGORY_LABELS: Record<QuestionBankCategory, string> = {
  technical: 'Technical',
  behavioral: 'Behavioral',
  iceBreakers: 'Ice Breakers',
  vista: 'VISTA',
}

const PLAN_CONTENT: Omit<InterviewPlan, 'interview'> = {
  overallFit: 69,
  criteria: [
    { label: 'Education', score: 70 },
    { label: 'Job Title', score: 60 },
    { label: 'Job Summary', score: 50 },
    { label: 'SQL Expertise', score: 90 },
    { label: 'Communication Skills', score: 85 },
    { label: 'Problem-Solving Skills', score: 80 },
    { label: 'BI Tools', score: 75 },
    { label: 'Cloud Data Warehouse', score: 40 },
  ],
  strengths: [
    'Strong SQL and Python for analysis and transformation.',
    'Led a reporting migration across 4 regions.',
    'Clear communicator with business stakeholders.',
  ],
  weaknesses: [
    'Limited exposure to cloud data warehouses such as Snowflake.',
    'No formal statistics training listed.',
  ],
  skills: [
    { name: 'SQL', matched: true },
    { name: 'Python', matched: true },
    { name: 'Power BI', matched: true },
    { name: 'Excel', matched: true },
    { name: 'Snowflake', matched: false },
    { name: 'Stakeholder management', matched: true },
    { name: 'Storytelling', matched: true },
  ],
  resumeSummary:
    '7 years in data analytics with SQL, Python and Power BI; led a reporting migration across 4 regions.',
  jobDescription: 'Owns weekly KPI reporting for operations across 4 regions.',
  jobRequirement: '4+ years in analytics, strong SQL, one BI tool.',
  questions: {
    technical: [
      'How would you find duplicate orders in a 50M-row table?',
      'Walk me through how you would design a weekly KPI dashboard.',
      'When would you choose a window function over a GROUP BY?',
    ],
    behavioral: [
      'Tell me about a time a stakeholder disagreed with your numbers. What did you do?',
      'Describe a project where you had to learn a new tool quickly.',
    ],
    iceBreakers: [
      'What got you interested in data analytics?',
      'Which dashboard you have built are you most proud of?',
    ],
    vista: [
      'Vision: Where do you see analytics adding the most value in operations?',
      'Integrity: Tell me about a time you found an error in a published report.',
      'Service: How do you make data useful for non-technical teams?',
      'Teamwork: Describe how you split work on the regional migration.',
      'Agility: How did you adapt when requirements changed mid-project?',
    ],
  },
}

/** Interview plan for a scheduled interview (same demo content for each). */
export function getInterviewPlan(interviewId: string): InterviewPlan | undefined {
  const interview = getScheduledInterviews().find((row) => row.id === interviewId)
  return interview ? { interview, ...PLAN_CONTENT } : undefined
}
