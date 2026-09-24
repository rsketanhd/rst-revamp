import { getApplicantsForJob, getJobByCode } from './applications'
import { getCandidates } from './candidates'

export type ProfileOrigin = 'application' | 'candidate'

export type ProfileIdentity = {
  id: string
  name: string
  email: string
  headline: string
  location: string
  appliedAgo: string
}

export type ProfileNavigation = {
  origin: ProfileOrigin
  identity: ProfileIdentity
  backTo: string
  backLabel: string
  previousTo: string | null
  nextTo: string | null
  showScoreSummary: boolean
}

export type ResumeExperience = {
  title: string
  dates: string
  bullets: string[]
}

export const PROFILE_VISIBLE_TAGS = ['Good Candidate', 'Salary Expectation in Budget']

export const PROFILE_MORE_TAGS = ['Notice 90d', 'Referral', 'Relocation OK']

export const PROFILE_STATUS_OPTIONS = [
  'New',
  'Client Endorsement',
  'Interview Ready',
  'Offered',
  'Rejected',
]

export const PROFILE_SKILLS = [
  'PHP',
  'JavaScript',
  'HTML/CSS',
  'C++',
  'Core JAVA',
  'Oracle',
  'MySQL',
]

export type ProfileEmployment = {
  id: string
  title: string
  employmentType: string
  company: string
  startDate: string
  endDate: string
  duration: string
  current: boolean
}

export const EMPLOYMENT_TITLE_OPTIONS = [
  'Data Science Trainee',
  'Software Developer',
  'Product Manager',
  'UI/UX Designer',
  'Business Analyst',
]

export const EMPLOYMENT_TYPE_OPTIONS = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Trainee',
]

export const EMPLOYMENT_COMPANY_OPTIONS = [
  'Latitude TechnoLabs Pvt. Ltd.',
  'Qualitat Systems',
  'Innovation Technologies Pvt. Ltd.',
  'CMARIX TechnoLabs Pvt. Ltd.',
  'Acme Corp',
]

export const EMPLOYMENT_DATE_OPTIONS = [
  'Jan 2018',
  'Mar 2018',
  'Jun 2018',
  'Mar 2019',
  'Sep 2019',
  'Jan 2020',
  'Jun 2021',
  'Jan 2024',
]

export const PROFILE_EMPLOYMENT: ProfileEmployment[] = [
  {
    id: 'emp-1',
    title: 'Data Science Trainee',
    employmentType: 'Trainee',
    company: 'Latitude TechnoLabs Pvt. Ltd.',
    startDate: 'Sep 2019',
    endDate: '',
    duration: '',
    current: true,
  },
  {
    id: 'emp-2',
    title: 'Software Developer',
    employmentType: 'Full-time',
    company: 'Qualitat Systems',
    startDate: 'Jun 2018',
    endDate: 'Mar 2019',
    duration: '0 yrs 9 mos',
    current: false,
  },
  {
    id: 'emp-3',
    title: 'Software Developer',
    employmentType: 'Full-time',
    company: 'Innovation Technologies Pvt. Ltd.',
    startDate: 'Jan 2018',
    endDate: 'Mar 2018',
    duration: '0 yrs 2 mos',
    current: false,
  },
]

export function employmentDateLabel(job: ProfileEmployment): string {
  const end = job.current ? 'Present' : job.endDate
  return end ? `${job.startDate} – ${end}` : job.startDate
}

export const PROFILE_EDUCATION = [
  {
    id: 'edu-1',
    school: 'Sinhgad Institute Of Management',
    degree: 'Master of Computer Applications – MCA',
    dates: '2016 – 2018',
  },
  {
    id: 'edu-2',
    school: 'Saurashtra University',
    degree: 'Bachelor of Computer Applications – BCA',
    dates: '2012 – 2015',
  },
]

export const RESUME_FILE_NAME = 'Harsh_Mistry_Resume.pdf'

export const RESUME_EXPERIENCES: ResumeExperience[] = [
  {
    title: 'Data Science Trainee at Latitude TechnoLabs Pvt. Ltd.',
    dates: 'Sep 2019 — Present',
    bullets: [
      'Built ETL pipelines in Python and SQL feeding dashboards used by 40+ analysts.',
      'Maintained REST APIs in PHP / Laravel for the internal reporting platform.',
      'Cut nightly job runtime by 33% through query optimisation on MySQL.',
    ],
  },
  {
    title: 'Software Developer at Qualitat Systems',
    dates: 'Jun 2018 — Mar 2019',
    bullets: [
      'Developed customer portal features in JavaScript and PHP.',
      'Wrote unit and integration tests, raised coverage from 40% to 78%.',
      'Worked with designers to implement responsive layouts in HTML/CSS.',
    ],
  },
  {
    title: 'Software Developer at Innovation Technologies Pvt. Ltd.',
    dates: 'Jan 2018 — Mar 2018',
    bullets: [
      'Supported a PHP application used by the internal operations team.',
      'Fixed layout issues across the careers site and documented the release notes.',
    ],
  },
]

const DESIGN_HEADLINE = 'Software Developer at CMARIX TechnoLabs Pvt. Ltd.'

function neighbors<T extends { id: string }>(
  items: T[],
  currentId: string,
  toPath: (id: string) => string,
): { previousTo: string | null; nextTo: string | null } {
  const index = items.findIndex((item) => item.id === currentId)
  if (index < 0) return { previousTo: null, nextTo: null }
  const previous = items[index - 1]
  const next = items[index + 1]
  return {
    previousTo: previous ? toPath(previous.id) : null,
    nextTo: next ? toPath(next.id) : null,
  }
}

export function resolveProfileNavigation(input: {
  jobCode?: string
  applicantId?: string
  candidateId?: string
}): ProfileNavigation | null {
  if (input.jobCode && input.applicantId) {
    const job = getJobByCode(input.jobCode)
    if (!job) return null
    const applicants = getApplicantsForJob(job.code)
    const applicant = applicants.find((item) => item.id === input.applicantId)
    if (!applicant) return null
    const { previousTo, nextTo } = neighbors(
      applicants,
      applicant.id,
      (id) => `/jobs/${job.code}/applications/${id}`,
    )
    return {
      origin: 'application',
      identity: {
        id: applicant.id,
        name: applicant.name,
        email: applicant.email,
        headline: DESIGN_HEADLINE,
        location: applicant.location,
        appliedAgo: 'Applied 3 days ago',
      },
      backTo: `/jobs/${job.code}/applications`,
      backLabel: `Back to "${job.title} Application"`,
      previousTo,
      nextTo,
      showScoreSummary: true,
    }
  }

  if (input.candidateId) {
    const candidates = getCandidates()
    const candidate = candidates.find((item) => item.id === input.candidateId)
    if (!candidate) return null
    const { previousTo, nextTo } = neighbors(
      candidates,
      candidate.id,
      (id) => `/candidates/${id}`,
    )
    return {
      origin: 'candidate',
      identity: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        headline: `${candidate.designation} at ${candidate.currentCompany}`,
        location: `${candidate.city}, ${candidate.country}`,
        appliedAgo: 'Applied 3 days ago',
      },
      backTo: '/candidates',
      backLabel: 'Back to "Candidates"',
      previousTo,
      nextTo,
      showScoreSummary: false,
    }
  }

  return null
}
