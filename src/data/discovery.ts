/**
 * Mock data + types for Candidate Discovery (prompt + results).
 */

export type DiscoverySource =
  | 'Internal Candidates'
  | 'LinkedIn'
  | 'RS Plus'
  | 'Monster'

export type PromptFilterId =
  | 'skills'
  | 'experience'
  | 'location'
  | 'jobRadius'
  | 'score'

export type SavedSearch = {
  id: string
  title: string
  date: string
  description: string
  prompt: string
}

export type AiSuggestion = {
  id: string
  title: string
  description: string
  prompt: string
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type DiscoveryCandidate = {
  id: string
  name: string
  title: string
  company: string
  location: string
  noticePeriod: string
  experienceYears: number
  email: string
  emailLocked: boolean
  latestRole: string
  education: string
  skills: string[]
  /** Used for mock filtering */
  tags: string[]
  source: DiscoverySource
  score: number
  avatarTone: number
}

export type DiscoveryListFilters = {
  minExperience: number
  maxExperience: number
  locationQuery: string
  skillsQuery: string
  noticePeriod: string
  minScore: number
  source: DiscoverySource | ''
}

export const DISCOVERY_SOURCE_OPTIONS: DiscoverySource[] = [
  'Internal Candidates',
  'LinkedIn',
  'RS Plus',
  'Monster',
]

export const PROMPT_FILTERS: {
  id: PromptFilterId
  label: string
}[] = [
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'location', label: 'Location' },
  { id: 'jobRadius', label: 'Job Radius' },
  { id: 'score', label: 'Score' },
]

export const DEFAULT_PROMPT_FILTERS: Record<PromptFilterId, boolean> = {
  skills: false,
  experience: false,
  location: false,
  jobRadius: false,
  score: false,
}

export const DEFAULT_PROMPT =
  'Finance analysts in Jeddah and Riyadh, 3 to 7 years banking experience, CFA preferred. Auto-refresh bi-weekly from ATS and job boards. Notify recruiter on each run.'

const SKILL_HINTS = [
  'java',
  'javascript',
  'react',
  'python',
  'typescript',
  'node',
  'spring',
  'boot',
  'kafka',
  'docker',
  'kubernetes',
  'aws',
  'sql',
  'cfa',
  'banking',
  'finance',
  'fintech',
  'microservices',
  'django',
  'fastapi',
  'ml',
  'machine learning',
  'frontend',
  'backend',
  'devops',
  'sre',
  'product manager',
  'analyst',
  'engineer',
  'developer',
  'skill',
  'preferred',
  'certified',
]

const LOCATION_HINTS = [
  'jeddah',
  'riyadh',
  'dubai',
  'abu dhabi',
  'ahmedabad',
  'bengaluru',
  'bangalore',
  'mumbai',
  'delhi',
  'london',
  'doha',
  'saudi',
  'ksa',
  'uae',
  'india',
  'gcc',
  'mena',
  'remote',
  'onsite',
  'relocation',
  'based in',
  'located',
  'city',
  'country',
]

/**
 * Detect which prompt criteria chips should show as active (green) from free text.
 */
export function detectPromptCriteria(
  prompt: string,
): Record<PromptFilterId, boolean> {
  const t = prompt.toLowerCase().trim()
  if (!t) {
    return { ...DEFAULT_PROMPT_FILTERS }
  }

  const skills = SKILL_HINTS.some((hint) => t.includes(hint))

  const experience =
    /\b\d+\s*(?:\+|to|-|–)?\s*(?:\d+\s*)?years?\b/.test(t) ||
    /\bexp(?:erience)?\b/.test(t) ||
    /\byrs?\b/.test(t)

  const location = LOCATION_HINTS.some((hint) => t.includes(hint))

  const jobRadius =
    /\bradius\b/.test(t) ||
    /\bwithin\s+\d+\s*(km|kilometers|miles|mi)\b/.test(t) ||
    /\b\d+\s*(km|kilometers|miles|mi)\b/.test(t) ||
    /\bcommute\b/.test(t)

  const score =
    /\bscore\b/.test(t) ||
    /\brelevancy\b/.test(t) ||
    /\bsuitability\b/.test(t) ||
    /\bmatch\s*(rate|%)?\b/.test(t) ||
    /\d+\s*%\b/.test(t)

  return {
    skills,
    experience,
    location,
    jobRadius,
    score,
  }
}

export const SAVED_SEARCHES: SavedSearch[] = [
  {
    id: 'ss1',
    title: 'Finance Analysts Saudi Arabia',
    date: '2026-06-08',
    description:
      'Finance analysts in Jeddah and Riyadh, 3 to 7 years banking experience, CFA preferred. Auto-refresh bi-weekly from ATS and job boards. Notify recruiter on each run.',
    prompt:
      'Finance analysts in Jeddah and Riyadh, 3 to 7 years banking experience, CFA preferred.',
  },
  {
    id: 'ss2',
    title: 'Senior React Engineers MENA',
    date: '2026-05-22',
    description:
      'Senior React engineers in UAE and KSA, 5+ years frontend experience, TypeScript preferred. Weekly refresh from LinkedIn and RS Plus.',
    prompt:
      'Senior React engineers in UAE and KSA, 5+ years frontend experience, TypeScript preferred.',
  },
  {
    id: 'ss3',
    title: 'Data Scientists Fintech',
    date: '2026-04-14',
    description:
      'Data scientists in fintech with Python, ML, and 4–8 years experience. Prefer candidates open to remote collaboration across GCC.',
    prompt:
      'Data scientists in fintech with Python, ML, and 4 to 8 years experience in GCC.',
  },
  {
    id: 'ss4',
    title: 'DevOps Engineers Remote GCC',
    date: '2026-03-28',
    description:
      'DevOps and SRE engineers open to remote GCC roles with Kubernetes, Terraform, and on-call ownership. Refresh monthly from RS Plus.',
    prompt:
      'DevOps and SRE engineers remote GCC, Kubernetes and Terraform, 4+ years experience.',
  },
  {
    id: 'ss5',
    title: 'Java Backend Riyadh',
    date: '2026-03-10',
    description:
      'Java microservice engineers for Riyadh with Spring Boot and Kafka. Banking or payments domain preferred. Notify on each run.',
    prompt:
      'Backend Java engineers in Riyadh with Spring Boot and microservices, 5+ years experience.',
  },
  {
    id: 'ss6',
    title: 'Product Managers Growth SaaS',
    date: '2026-02-18',
    description:
      'B2B product managers focused on growth funnels and experimentation across product and marketing teams in Dubai or remote.',
    prompt:
      'Product managers with growth experimentation experience in B2B SaaS, Dubai or remote, 6+ years.',
  },
  {
    id: 'ss7',
    title: 'UX Designers Jeddah',
    date: '2026-01-30',
    description:
      'Product designers with strong UX research and Figma systems experience for consumer apps in Jeddah.',
    prompt:
      'UX product designers in Jeddah with Figma and research experience, 3 to 6 years.',
  },
  {
    id: 'ss8',
    title: 'Sales Leaders UAE',
    date: '2026-01-12',
    description:
      'Enterprise sales leaders targeting UAE with SaaS or fintech quota history and multi-country team management.',
    prompt:
      'Enterprise sales leaders in UAE with SaaS fintech experience, 8+ years.',
  },
  {
    id: 'ss9',
    title: 'Mobile Engineers India',
    date: '2025-12-05',
    description:
      'React Native and Flutter mobile engineers in India for high-scale consumer apps, open to hybrid Bangalore or Mumbai.',
    prompt:
      'Mobile engineers React Native or Flutter in Bangalore or Mumbai, 4+ years experience.',
  },
]


export const AI_SUGGESTIONS: AiSuggestion[] = [
  {
    id: 'ai1',
    title: 'Backend Java Roles Riyadh',
    description:
      'Java microservice engineers for Riyadh with Spring Boot, Kafka, and cloud experience. Prior banking or payments domain preferred.',
    prompt:
      'Backend Java engineers in Riyadh with Spring Boot and microservices, 5+ years experience.',
  },
  {
    id: 'ai2',
    title: 'Product Managers Growth',
    description:
      'B2B product managers focused on growth funnels, experimentation, and cross-functional leadership across product and marketing.',
    prompt:
      'Product managers with growth experimentation experience in B2B SaaS, 6+ years.',
  },
  {
    id: 'ai3',
    title: 'DevOps / SRE Remote GCC',
    description:
      'Site reliability engineers open to remote GCC roles with Kubernetes, Terraform, and on-call incident ownership.',
    prompt:
      'DevOps and SRE engineers remote GCC, Kubernetes and Terraform, 4+ years experience.',
  },
]

const FIRST_NAMES = [
  'Keval',
  'Aisha',
  'Omar',
  'Sara',
  'Rahul',
  'Fatima',
  'James',
  'Priya',
  'Hassan',
  'Neha',
  'Daniel',
  'Layla',
  'Vikram',
  'Noor',
  'Alex',
  'Maya',
  'Arjun',
  'Hana',
  'Chris',
  'Zara',
]

const LAST_NAMES = [
  'Sakhiya',
  'Alami',
  'Khan',
  'Patel',
  'Ahmed',
  'Singh',
  'Rahman',
  'Shah',
  'Ibrahim',
  'Mehta',
  'Walker',
  'Nair',
  'Hussain',
  'Gupta',
  'Lee',
]

const TITLES = [
  'Data Scientist',
  'Software Engineer',
  'Finance Analyst',
  'Product Manager',
  'Backend Engineer',
  'Frontend Developer',
  'DevOps Engineer',
  'ML Engineer',
]

const COMPANIES = [
  'Freelance',
  'IBM',
  'eClinicalWorks',
  'EPAM',
  'Two Sigma',
  'HSBC',
  'Accenture',
  'Microsoft',
  'Amazon',
  'Oracle',
]

const LOCATIONS = [
  'Ahmedabad, India',
  'Jeddah, Saudi Arabia',
  'Riyadh, Saudi Arabia',
  'Dubai, UAE',
  'Bengaluru, India',
  'London, UK',
  'Mumbai, India',
  'Doha, Qatar',
]

const NOTICE = ['Immediate', '2 Weeks Notice', '1 Month Notice', '2 Months Notice']

const EDUCATION = [
  'Indian Institute of Technology',
  'King Saud University',
  'Cairo University',
  'University of Mumbai',
  'BITS Pilani',
  'Stanford University',
  'NUS Singapore',
]

const SKILL_POOL = [
  'JavaScript',
  'React',
  'Java',
  'Spring Boot',
  'Microservices',
  'Python',
  'SQL',
  'AWS',
  'TypeScript',
  'Node.js',
  'Kafka',
  'Docker',
  'Kubernetes',
  'Finance',
  'CFA',
  'Banking',
  'Machine Learning',
]

const LATEST_ROLES = [
  'Vice President, Data Science @ Two Sigma, Aug 2022',
  'Senior Engineer @ IBM, Jan 2021',
  'Lead Developer @ EPAM, Mar 2020',
  'Staff Analyst @ HSBC, Jun 2019',
  'Principal Engineer @ Microsoft, Sep 2021',
  'SDE III @ Amazon, Feb 2022',
]

function pick<T>(list: T[], index: number): T {
  return list[index % list.length]
}

function buildCandidates(): DiscoveryCandidate[] {
  return Array.from({ length: 48 }, (_, i) => {
    const name = `${pick(FIRST_NAMES, i)} ${pick(LAST_NAMES, i + 3)}`
    const title = pick(TITLES, i)
    const company = pick(COMPANIES, i + 1)
    const location = pick(LOCATIONS, i)
    const experienceYears = 2 + (i % 12)
    const skills = [
      pick(SKILL_POOL, i),
      pick(SKILL_POOL, i + 2),
      pick(SKILL_POOL, i + 4),
      pick(SKILL_POOL, i + 6),
      pick(SKILL_POOL, i + 8),
    ]
    const uniqueSkills = [...new Set(skills)]
    const emailLocked = i % 3 !== 0
    const local = name.toLowerCase().replace(/\s+/g, '.')
    return {
      id: `disc-${i + 1}`,
      name,
      title,
      company,
      location,
      noticePeriod: pick(NOTICE, i),
      experienceYears,
      email: emailLocked
        ? 'xxx.xxxxxxxx@xxxx.com'
        : `${local}@email.com`,
      emailLocked,
      latestRole: pick(LATEST_ROLES, i),
      education: pick(EDUCATION, i),
      skills: uniqueSkills,
      tags: uniqueSkills.map((s) => s.toLowerCase()),
      source: pick(DISCOVERY_SOURCE_OPTIONS, i),
      score: 55 + (i % 45),
      avatarTone: i % 6,
    }
  })
}

const ALL_CANDIDATES = buildCandidates()

export function getDiscoveryCandidates(): DiscoveryCandidate[] {
  return ALL_CANDIDATES.map((c) => ({ ...c, skills: [...c.skills], tags: [...c.tags] }))
}

export function emptyDiscoveryListFilters(): DiscoveryListFilters {
  return {
    minExperience: 0,
    maxExperience: 30,
    locationQuery: '',
    skillsQuery: '',
    noticePeriod: '',
    minScore: 0,
    source: '',
  }
}

/**
 * Filter discovery candidates using prompt text + structured filters.
 */
export function filterDiscoveryCandidates(
  candidates: DiscoveryCandidate[],
  prompt: string,
  listFilters: DiscoveryListFilters,
  promptFilters: Record<PromptFilterId, boolean>,
  sourcing: DiscoverySource,
): DiscoveryCandidate[] {
  const promptLower = prompt.toLowerCase()
  const skillTokens = listFilters.skillsQuery
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(Boolean)

  return candidates.filter((candidate) => {
    if (listFilters.source && candidate.source !== listFilters.source) {
      return false
    }
    // When structured source empty, prefer selected sourcing channel from prompt bar
    if (!listFilters.source && sourcing !== 'Internal Candidates') {
      // Soft preference: keep all internal + selected channel
      if (
        candidate.source !== sourcing &&
        candidate.source !== 'Internal Candidates'
      ) {
        // keep some diversity but bias toward channel
        if (candidate.id.charCodeAt(candidate.id.length - 1) % 3 === 0) {
          return false
        }
      }
    }

    if (promptFilters.experience || listFilters.minExperience > 0) {
      if (candidate.experienceYears < listFilters.minExperience) return false
      if (candidate.experienceYears > listFilters.maxExperience) return false
    }

    if (listFilters.locationQuery.trim()) {
      if (
        !candidate.location
          .toLowerCase()
          .includes(listFilters.locationQuery.toLowerCase())
      ) {
        return false
      }
    } else if (promptFilters.location && promptLower) {
      const locationHints = [
        'jeddah',
        'riyadh',
        'dubai',
        'ahmedabad',
        'bengaluru',
        'mumbai',
        'london',
        'doha',
        'saudi',
        'uae',
        'india',
        'gcc',
      ]
      const mentioned = locationHints.filter((h) => promptLower.includes(h))
      if (mentioned.length > 0) {
        const match = mentioned.some((h) =>
          candidate.location.toLowerCase().includes(h),
        )
        // Keep ~50% of non-matches so list still feels full after first search
        if (!match && candidate.id.charCodeAt(5) % 2 === 0) return false
      }
    }

    if (skillTokens.length > 0) {
      const hasSkill = skillTokens.some(
        (token) =>
          candidate.tags.some((t) => t.includes(token)) ||
          candidate.skills.some((s) => s.toLowerCase().includes(token)),
      )
      if (!hasSkill) return false
    } else if (promptFilters.skills && promptLower) {
      const skillHints = SKILL_POOL.map((s) => s.toLowerCase()).filter((s) =>
        promptLower.includes(s),
      )
      if (skillHints.length > 0) {
        const match = skillHints.some(
          (h) =>
            candidate.tags.some((t) => t.includes(h)) ||
            candidate.skills.some((s) => s.toLowerCase().includes(h)),
        )
        if (!match && candidate.score < 70) return false
      }
    }

    if (listFilters.noticePeriod && candidate.noticePeriod !== listFilters.noticePeriod) {
      return false
    }

    if (promptFilters.score || listFilters.minScore > 0) {
      if (candidate.score < listFilters.minScore) return false
    }

    // experience ranges from prompt text e.g. "3 to 7 years"
    const expMatch = promptLower.match(/(\d+)\s*(?:to|-)\s*(\d+)\s*years?/)
    if (expMatch && promptFilters.experience && listFilters.minExperience === 0) {
      const min = Number(expMatch[1])
      const max = Number(expMatch[2])
      if (
        candidate.experienceYears < min ||
        candidate.experienceYears > max
      ) {
        return false
      }
    } else {
      const minOnly = promptLower.match(/(\d+)\+\s*years?/)
      if (minOnly && promptFilters.experience && listFilters.minExperience === 0) {
        if (candidate.experienceYears < Number(minOnly[1])) return false
      }
    }

    return true
  })
}

export function buildAssistantSummary(
  count: number,
  candidates: DiscoveryCandidate[],
): string {
  const companies = [...new Set(candidates.slice(0, 12).map((c) => c.company))]
    .slice(0, 3)
    .join(', ')
  const skills = [...new Set(candidates.flatMap((c) => c.skills))]
    .slice(0, 3)
    .join(', ')

  return `The search yielded ${count} candidates who match your criteria, showcasing a notable concentration from top companies like ${companies || 'leading firms'}, with core strengths in ${skills || 'in-demand skills'}.`
}

export const AVATAR_TONES = [
  'bg-[#E8E4F8] text-[#2D2061]',
  'bg-[#DCEBFA] text-[#1E4B8A]',
  'bg-[#E4F4EC] text-[#1F6B45]',
  'bg-[#FCE8E0] text-[#A8472A]',
  'bg-[#F5E8F7] text-[#7A2B8A]',
  'bg-[#E8F3F5] text-[#1F5F6B]',
]

export function candidateInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}
