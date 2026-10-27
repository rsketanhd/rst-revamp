import {
  getOneWayInterviewById,
  getOneWayInvites,
  type OneWayInterview,
  type OneWayInvite,
} from './oneWayInterviews'

export type AssessmentSkillTone = 'match' | 'partial' | 'miss'

export type AssessmentSkillTag = {
  id: string
  label: string
  tone: AssessmentSkillTone
}

export type AssessmentBarTone = 'green' | 'red' | 'amber'

export type AssessmentSkillGroup = {
  id: string
  title: string
  percent: number
  tone: AssessmentBarTone
  tags: AssessmentSkillTag[]
}

export type AssessmentRoundTab = {
  id: string
  label: string
  aiScore?: number
  expired?: boolean
}

export type AssessmentVideoQuestion = {
  id: string
  number: number
  question: string
  answer: string
  duration: string
  retakes: number
  skillTag: string
}

export type AssessmentProctorId =
  | 'copy'
  | 'refresh'
  | 'edit'
  | 'focus'
  | 'eyes'
  | 'phone'
  | 'ai'

export type AssessmentProctorTone =
  | 'green'
  | 'amber'
  | 'pink'
  | 'red'
  | 'yellow'

export type AssessmentProctorMetric = {
  id: AssessmentProctorId
  label: string
  value: string
  tone: AssessmentProctorTone
}

export type AssessmentMatchRow = {
  id: string
  label: string
  percent: number
  tone: 'green' | 'amber'
}

export type AiSummaryCategory = {
  id: string
  title: string
  prompt: string
  stars: number
  feedback: string
}

export type AiEvaluationDetail = {
  id: string
  number: number
  question: string
  stars: number
  candidateAnswer: string
  aiEvaluation: string
  scorePercent: number
}

export type AiAssessmentPanel = {
  overallSummary: string
  overallStars: number
  feedbackVote: 'up' | 'down' | null
  summaryPercent: number
  categories: AiSummaryCategory[]
  evaluations: AiEvaluationDetail[]
}

export type OneWayAssessment = {
  invite: OneWayInvite
  interview: OneWayInterview
  jobLabel: string
  recruiterName: string
  recruiterEmail: string
  overallStars: number
  aiScorePercent: number
  roundStatus: 'Completed' | 'In Progress' | 'Expired'
  rounds: AssessmentRoundTab[]
  mustHaveMatched: string
  goodToHaveMatched: string
  skillGroups: AssessmentSkillGroup[]
  interviewDuration: string
  questions: AssessmentVideoQuestion[]
  proctoring: AssessmentProctorMetric[]
  aiAssessment: AiAssessmentPanel
  recruiterRating: number
  recruiterStatus: string
  hmRating: number
  hmNotes: string
  hmDecision: string
  resumeMatchPercent: number
  matchRows: AssessmentMatchRow[]
  cvSummary: {
    currentRole: string
    experience: string
    education: string
    skills: string[]
  }
  jobDescription: {
    title: string
    department: string
    location: string
    requirements: string[]
  }
}

const SKILL_GROUPS: AssessmentSkillGroup[] = [
  {
    id: 'duties',
    title: 'Job Duties & Responsibilities',
    percent: 82,
    tone: 'green',
    tags: [
      { id: 'd1', label: 'Product Roadmap Ownership', tone: 'match' },
      { id: 'd2', label: 'PRD and Backlog Management', tone: 'match' },
      { id: 'd3', label: 'Cross-functional Coordination', tone: 'match' },
      { id: 'd4', label: 'Feature Adoption Tracking', tone: 'partial' },
      { id: 'd5', label: 'Release Planning', tone: 'match' },
      { id: 'd6', label: 'Customer Feedback Loops', tone: 'partial' },
      { id: 'd7', label: 'OKR Definition', tone: 'match' },
    ],
  },
  {
    id: 'must',
    title: 'Must have Skills',
    percent: 45,
    tone: 'red',
    tags: [
      { id: 'm1', label: 'Product Management', tone: 'miss' },
      { id: 'm2', label: 'HR Tech Knowledge', tone: 'match' },
      { id: 'm3', label: 'Data Analysis', tone: 'miss' },
      { id: 'm4', label: 'Stakeholder Management', tone: 'match' },
      { id: 'm5', label: 'Workflow Design', tone: 'partial' },
      { id: 'm6', label: 'Requirements Gathering', tone: 'miss' },
      { id: 'm7', label: 'Prioritization Frameworks', tone: 'partial' },
      { id: 'm8', label: 'Metrics & KPIs', tone: 'match' },
    ],
  },
  {
    id: 'good',
    title: 'Good to have Skills',
    percent: 65,
    tone: 'amber',
    tags: [
      { id: 'g1', label: 'AI Products', tone: 'miss' },
      { id: 'g2', label: 'Global Compliance', tone: 'match' },
      { id: 'g3', label: 'ATS/HRMS Exposure', tone: 'partial' },
      { id: 'g4', label: 'UX Fundamentals', tone: 'partial' },
      { id: 'g5', label: 'Workflow Engines', tone: 'partial' },
      { id: 'g6', label: 'API Product Sense', tone: 'miss' },
      { id: 'g7', label: 'Experiment Design', tone: 'match' },
    ],
  },
]

const QUESTIONS: AssessmentVideoQuestion[] = [
  {
    id: 'q1',
    number: 1,
    question:
      'Can you describe a time when you analyzed a large dataset to identify trends? What was the outcome of your analysis?',
    answer:
      'The time started, 50 five, fifty three, two, fifty one, 50. Can you describe your answer for software development life?',
    duration: '00:11',
    retakes: 0,
    skillTag: 'Data Analysis',
  },
  {
    id: 'q2',
    number: 2,
    question:
      'Tell me about a predictive model you developed and how stakeholders used the insights.',
    answer:
      'I built a churn model that flagged at-risk accounts weekly and shared dashboards with CS leads.',
    duration: '00:11',
    retakes: 1,
    skillTag: 'Product Management',
  },
  {
    id: 'q3',
    number: 3,
    question:
      'Describe an experience where you collaborated with stakeholders to prioritize a roadmap.',
    answer:
      'We ran a scoring workshop, aligned on impact versus effort, and locked a quarterly plan.',
    duration: '00:11',
    retakes: 0,
    skillTag: 'Stakeholder Management',
  },
]

const PROCTORING: AssessmentProctorMetric[] = [
  { id: 'copy', label: 'Copy Link', value: '00', tone: 'green' },
  { id: 'refresh', label: 'Refresh Page', value: '01', tone: 'amber' },
  { id: 'edit', label: 'Edit Settings', value: '04', tone: 'pink' },
  { id: 'focus', label: 'Focus Lost', value: '09', tone: 'red' },
  { id: 'eyes', label: 'Eyes off Screen', value: '02', tone: 'yellow' },
  { id: 'phone', label: 'Phone Detected', value: '00', tone: 'green' },
  { id: 'ai', label: 'AI Responded', value: '00', tone: 'pink' },
]

const AI_CATEGORIES: AiSummaryCategory[] = [
  {
    id: 'technical',
    title: 'Technical Skills',
    prompt:
      'Does the candidate demonstrate the technical depth the role requires?',
    stars: 4,
    feedback:
      'Limited demonstration of technical depth; answers stayed surface-level without concrete systems or metrics.',
  },
  {
    id: 'leadership',
    title: 'Leadership',
    prompt: 'Does the candidate show ownership, initiative and influence?',
    stars: 4,
    feedback:
      'No clear evidence of leadership, ownership, or influence over outcomes in the responses provided.',
  },
  {
    id: 'communication',
    title: 'Communication Skills',
    prompt: 'Are the answers clear, structured and well articulated?',
    stars: 4,
    feedback:
      'Answers were often unclear and lacked structure, making it hard to follow the candidate’s intent.',
  },
]

/** AI write-ups keyed by video question id — reuses Q/A text from QUESTIONS. */
const AI_EVALUATION_NOTES: Record<
  string,
  { aiEvaluation: string; scorePercent: number; stars: number }
> = {
  q1: {
    stars: 4,
    scorePercent: 0,
    aiEvaluation:
      'The response does not address the question. There is no example of dataset analysis, trends identified, or measurable outcome.',
  },
  q2: {
    stars: 4,
    scorePercent: 20,
    aiEvaluation:
      'Mentions a predictive model and stakeholder usage, but lacks depth on methodology, validation, and business impact.',
  },
  q3: {
    stars: 4,
    scorePercent: 20,
    aiEvaluation:
      'Shows a basic prioritization approach, but does not explain trade-offs, stakeholder conflict, or follow-through results.',
  },
}

const AI_ASSESSMENT: AiAssessmentPanel = {
  overallSummary:
    'The candidate struggled to provide coherent and relevant answers across most questions. Responses lacked structure, depth, and clear examples tied to the role requirements. Communication was unclear in places, and there was limited evidence of technical ownership or leadership impact.',
  overallStars: 4,
  feedbackVote: 'up',
  summaryPercent: 87,
  categories: AI_CATEGORIES,
  evaluations: QUESTIONS.flatMap((question): AiEvaluationDetail[] => {
    const notes = AI_EVALUATION_NOTES[question.id]
    if (!notes) return []
    return [
      {
        id: `ae${question.number}`,
        number: question.number,
        question: question.question,
        candidateAnswer: question.answer,
        stars: notes.stars,
        aiEvaluation: notes.aiEvaluation,
        scorePercent: notes.scorePercent,
      },
    ]
  }),
}

export function getOneWayInvite(
  interviewId: string,
  inviteId: string,
): OneWayInvite | undefined {
  return getOneWayInvites(interviewId).find((row) => row.id === inviteId)
}

/**
 * Demo assessment payload for View Assessment (Completed invites).
 */
export function getOneWayAssessment(
  interviewId: string,
  inviteId: string,
): OneWayAssessment | undefined {
  const interview = getOneWayInterviewById(interviewId)
  const invite = getOneWayInvite(interviewId, inviteId)
  if (!interview || !invite) return undefined

  const rating = invite.rating ?? 0

  return {
    invite,
    interview,
    jobLabel: `${interview.jobReqId} : ${interview.title}`,
    recruiterName: 'Alexander Mathew',
    recruiterEmail: 'alexandar.mathew@gmail.com',
    overallStars: rating > 0 ? rating : 4,
    aiScorePercent: 10,
    roundStatus: 'Completed',
    rounds: [
      { id: 'r1', label: 'Round 01, AI 10' },
      { id: 'r2', label: 'Round 02, AI 10' },
      { id: 'r3', label: 'Round 03, Expired', expired: true },
    ],
    mustHaveMatched: '7 of 8 matched',
    goodToHaveMatched: '5 of 6 matched',
    skillGroups: SKILL_GROUPS,
    interviewDuration: '18 min',
    questions: QUESTIONS,
    proctoring: PROCTORING,
    aiAssessment: AI_ASSESSMENT,
    recruiterRating: 3,
    recruiterStatus: 'Short List',
    hmRating: 3,
    hmNotes: '',
    hmDecision: 'Short List',
    resumeMatchPercent: 87,
    matchRows: [
      { id: 'jt', label: 'Job Title', percent: 80, tone: 'green' },
      { id: 'rq', label: 'Required Qualifications', percent: 90, tone: 'green' },
      {
        id: 'jd',
        label: 'Job Duties And Responsibilities',
        percent: 100,
        tone: 'green',
      },
      { id: 'gh', label: 'Good To Have Skills', percent: 70, tone: 'amber' },
      { id: 'mh', label: 'Must Have Skills', percent: 60, tone: 'amber' },
    ],
    cvSummary: {
      currentRole: 'Senior Product Manager',
      experience: '8 years in product management',
      education: 'MBA from Stanford University',
      skills: [
        'Product Strategy',
        'Stakeholder Management',
        'Data Analysis',
        'Agile/Scrum',
      ],
    },
    jobDescription: {
      title: interview.title.includes('Software')
        ? 'Senior Software Engineer'
        : interview.title,
      department: 'Engineering',
      location: interview.location || 'San Francisco, CA',
      requirements: [
        '5+ years of experience',
        'React/Node.js',
        'System Design',
        'Team Leadership',
      ],
    },
  }
}

export const SKILL_TAG_CLASS: Record<AssessmentSkillTone, string> = {
  match: 'bg-[#E3F5EA] text-[#1F8F57]',
  partial: 'bg-[#FFF1E8] text-[#C2410C]',
  miss: 'bg-[#FDF2F5] text-[#C44B7A]',
}

export const SKILL_PERCENT_CLASS: Record<AssessmentBarTone, string> = {
  green: 'text-[#1F8F57]',
  red: 'text-[#C44B7A]',
  amber: 'text-[#B56A00]',
}

export const SKILL_BAR_CLASS: Record<AssessmentBarTone, string> = {
  green: 'bg-[#22C55E]',
  red: 'bg-[#E11D48]',
  amber: 'bg-[#F59E0B]',
}

export const PROCTOR_CARD_CLASS: Record<AssessmentProctorTone, string> = {
  green: 'bg-[#E8F8EF] text-[#1F8F57]',
  amber: 'bg-[#FFF1E8] text-[#C2410C]',
  pink: 'bg-[#FDF2F5] text-[#C44B7A]',
  red: 'bg-[#FCE8EC] text-[#BE123C]',
  yellow: 'bg-[#FFF8E8] text-[#B56A00]',
}

export const MATCH_BAR_CLASS: Record<AssessmentMatchRow['tone'], string> = {
  green: 'bg-[#22C55E]',
  amber: 'bg-[#F59E0B]',
}
