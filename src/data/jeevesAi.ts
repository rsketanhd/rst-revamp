/**
 * Mock data for Jeeves AI (Chatbot) applicants / recommendations list.
 */

export type JeevesTab = 'applicants' | 'recommendations'

export type JeevesRecord = {
  id: string
  name: string
  email: string
  jobReqId: string
  canId: string
  jobTitle: string
  experience: string
  currentCity: string
  currentCountry: string
  relocation: 'Yes' | 'No'
  preferredLocation: string
  noticePeriod: string
  compensation: string
  lastUpdatedOn: string
  tags: string[]
  hidden: boolean
  tab: JeevesTab
}

export const JEEVES_TAG_OPTIONS = [
  'Shortlisted',
  'Interview',
  'New',
  'Remote-ready',
  'Priority',
  'Follow-up',
]

export const JEEVES_HIDING_OPTIONS = [
  'Show all',
  'Hide shortlisted',
  'Hide rejected',
  'Hide contacted',
]

const NAMES = [
  'Abdul Rahim',
  'Priya Singh',
  'Carlos Mendoza',
  'Sara Alami',
  'James Walker',
  'Fatima Noor',
  'Rahul Mehta',
  'Layla Hassan',
  'Daniel Ortiz',
  'Neha Kapoor',
  'Omar Khalid',
  'Maya Chen',
  'Vikram Nair',
  'Hana Ibrahim',
  'Alex Turner',
  'Zara Malik',
  'Chris Lee',
  'Aisha Rahman',
  'Luis Garza',
  'Sofia Petrova',
]

const JOBS = [
  'Associate Manager - HR Analytics',
  'Product Manager',
  'Senior Data Scientist',
  'UX Designer',
  'Backend Engineer',
  'Frontend Developer',
  'DevOps Engineer',
  'Finance Analyst',
  'Marketing Lead',
  'Solutions Architect',
]

const CITIES = [
  { city: 'Ahmedabad', country: 'India' },
  { city: 'Bangalore', country: 'India' },
  { city: 'Mexico City', country: 'Mexico' },
  { city: 'Cairo', country: 'Egypt' },
  { city: 'Seattle', country: 'USA' },
  { city: 'Dubai', country: 'UAE' },
  { city: 'Riyadh', country: 'Saudi Arabia' },
  { city: 'London', country: 'UK' },
  { city: 'Mumbai', country: 'India' },
  { city: 'Toronto', country: 'Canada' },
]

const EXPERIENCE = [
  '2 to 4 years',
  '4.1 to 6 years',
  '6 to 8 years',
  '8 to 10 years',
  '10+ years',
  '1 to 3 years',
]

const PREFERRED = ['Anywhere', 'On-site', 'Hybrid', 'Remote']

const COMP = [
  '75,000 – 95,000 USD',
  '95,000 – 135,000 USD',
  '110,000 – 140,000 USD',
  '60,000 – 80,000 USD',
  '150,000 USD',
  '45,000 – 65,000 GBP',
  '120,000 – 160,000 USD',
  '80,000 – 100,000 EUR',
]

function pad(n: number, width = 4) {
  return String(n).padStart(width, '0')
}

function buildRecords(): JeevesRecord[] {
  return Array.from({ length: 50 }, (_, i) => {
    const loc = CITIES[i % CITIES.length]
    const name = NAMES[i % NAMES.length]
    const emailLocal = name.toLowerCase().replace(/\s+/g, '.')
    const tab: JeevesTab = i % 2 === 0 ? 'applicants' : 'recommendations'
    const month = ((i % 9) + 1).toString().padStart(2, '0')
    const day = ((i % 27) + 1).toString().padStart(2, '0')
    return {
      id: `jeeves-${i + 1}`,
      name,
      email: `${emailLocal}@mail.com`,
      jobReqId: pad(1200 + (i % 40)),
      canId: `C${pad(12345 + i, 5)}`,
      jobTitle: JOBS[i % JOBS.length],
      experience: EXPERIENCE[i % EXPERIENCE.length],
      currentCity: loc.city,
      currentCountry: loc.country,
      relocation: i % 3 === 0 ? 'No' : 'Yes',
      preferredLocation: PREFERRED[i % PREFERRED.length],
      noticePeriod: `2026-${month}-${day}`,
      compensation: COMP[i % COMP.length],
      lastUpdatedOn: `2026-${month}-${day}`,
      tags: [
        JEEVES_TAG_OPTIONS[i % JEEVES_TAG_OPTIONS.length],
        ...(i % 4 === 0 ? [JEEVES_TAG_OPTIONS[(i + 2) % JEEVES_TAG_OPTIONS.length]] : []),
      ],
      hidden: i % 11 === 0,
      tab,
    }
  })
}

const ALL = buildRecords()

export function getJeevesRecords(): JeevesRecord[] {
  return ALL.map((r) => ({ ...r, tags: [...r.tags] }))
}

export type JeevesMoreFilters = {
  jobTitle: string
  country: string
  city: string
  relocation: string
  preferredLocation: string
}

export function emptyJeevesMoreFilters(): JeevesMoreFilters {
  return {
    jobTitle: '',
    country: '',
    city: '',
    relocation: '',
    preferredLocation: '',
  }
}
