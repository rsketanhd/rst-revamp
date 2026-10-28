/**
 * Mock candidate search results for a job — global (external) sourcing and
 * the company's own candidate database. Returned in pages for "fetch more".
 */

export type ExternalCandidate = {
  id: string
  name: string
  headline: string
  location: string
  /** External profiles link to LinkedIn; database profiles don't */
  linkedinUrl?: string
  skills: string[]
}

const GLOBAL_CANDIDATES: ExternalCandidate[] = [
  {
    id: 'ext-jinay-shah',
    name: 'Jinay Shah',
    headline:
      'Product @ Healthkart | Prev @ Yuja | Building Products, Leading Teams | Final Year CSE @ PDEU',
    location: 'Ahmedabad, Gujarat, India',
    linkedinUrl: 'https://www.linkedin.com/',
    skills: [
      'Aircraft',
      'Analysis',
      'Analytics',
      'Android',
      'Anti-fraud',
      'Application Development',
      'Attention to Detail',
      'Aviation',
      'Bookings',
      'Branding',
    ],
  },
  {
    id: 'ext-chirag-shrivastav',
    name: 'Chirag Shrivastav',
    headline:
      'Product Manager I Product Strategy and Roadmap I Team Management I Business Development I B2B SaaS',
    location: 'Ahmedabad, Gujarat, India',
    linkedinUrl: 'https://www.linkedin.com/',
    skills: [
      'Acne',
      'Adaptability',
      'Administration',
      'Administrative Assistance',
      'Adobe Fireworks',
      'Agile Methodologies',
      'Agile Project Management',
      'Aircraft',
      'Algorithms',
      'Alternative Medicine',
    ],
  },
  {
    id: 'ext-priya-mehta',
    name: 'Priya Mehta',
    headline:
      'Senior Product Manager @ Zomato | Growth & Monetisation | Ex-Flipkart | IIM Ahmedabad',
    location: 'Bengaluru, Karnataka, India',
    linkedinUrl: 'https://www.linkedin.com/',
    skills: [
      'A/B Testing',
      'Analytics',
      'Growth Strategy',
      'Monetisation',
      'Product Roadmap',
      'SQL',
      'Stakeholder Management',
    ],
  },
  {
    id: 'ext-rahul-desai',
    name: 'Rahul Desai',
    headline:
      'Associate Product Manager | Fintech | Payments & Lending | Ex-Razorpay',
    location: 'Mumbai, Maharashtra, India',
    linkedinUrl: 'https://www.linkedin.com/',
    skills: [
      'Agile Methodologies',
      'Fintech',
      'Jira',
      'Payments',
      'Product Discovery',
      'User Research',
    ],
  },
]

const DATABASE_CANDIDATES: ExternalCandidate[] = [
  {
    id: 'db-ananya-iyer',
    name: 'Ananya Iyer',
    headline:
      'Product Manager | Marketplace & Payments | 6 yrs | Previously applied for RST1342',
    location: 'Pune, Maharashtra, India',
    skills: [
      'Product Strategy',
      'Roadmapping',
      'Payments',
      'SQL',
      'Stakeholder Management',
    ],
  },
  {
    id: 'db-karan-malhotra',
    name: 'Karan Malhotra',
    headline:
      'Senior Business Analyst | B2B SaaS | Agile Delivery | Talent pool: Product',
    location: 'Ahmedabad, Gujarat, India',
    skills: [
      'Agile Methodologies',
      'Business Analysis',
      'Jira',
      'Requirements Gathering',
      'Tableau',
    ],
  },
  {
    id: 'db-sneha-kulkarni',
    name: 'Sneha Kulkarni',
    headline: 'Associate Product Manager | Mobile Apps | Growth Experiments',
    location: 'Bengaluru, Karnataka, India',
    skills: [
      'A/B Testing',
      'Android',
      'Analytics',
      'Product Discovery',
      'User Research',
    ],
  },
  {
    id: 'db-vikram-joshi',
    name: 'Vikram Joshi',
    headline:
      'Product Owner | Healthtech | Scrum | Imported from resume on 12 Aug 2026',
    location: 'Mumbai, Maharashtra, India',
    skills: ['Healthcare', 'Product Ownership', 'Scrum', 'Backlog Management'],
  },
]

export type CandidateSearchSource = 'global' | 'database'

export const CANDIDATE_SEARCH_PAGE_SIZE = 2

const SOURCES: Record<CandidateSearchSource, ExternalCandidate[]> = {
  global: GLOBAL_CANDIDATES,
  database: DATABASE_CANDIDATES,
}

/** Page `page` (0-based) of candidate search results for a job. */
export function fetchCandidateSearchResults(
  source: CandidateSearchSource,
  page: number,
  pageSize = CANDIDATE_SEARCH_PAGE_SIZE,
): { items: ExternalCandidate[]; hasMore: boolean } {
  const all = SOURCES[source]
  const start = page * pageSize
  return {
    items: all.slice(start, start + pageSize),
    hasMore: start + pageSize < all.length,
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function buildExternalCandidateCvHtml(candidate: ExternalCandidate): string {
  const name = escapeHtml(candidate.name)
  const location = escapeHtml(candidate.location)
  const headline = escapeHtml(candidate.headline)
  const skills = candidate.skills.map(escapeHtml).join(', ')
  const linkedin = candidate.linkedinUrl
    ? `<p><a href="${escapeHtml(candidate.linkedinUrl)}" target="_blank" rel="noopener noreferrer">LinkedIn profile</a></p>`
    : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${name} — CV</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; max-width: 720px; margin: 40px auto; padding: 0 24px; color: #1a1a2e; line-height: 1.5; }
    h1 { font-size: 28px; margin: 0 0 4px; color: #2D2061; }
    .meta { color: #6B6B80; font-size: 14px; margin-bottom: 24px; }
    h2 { font-size: 16px; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #D5D2E2; padding-bottom: 6px; margin: 28px 0 12px; color: #2D2061; }
    p { margin: 0 0 10px; }
  </style>
</head>
<body>
  <h1>${name}</h1>
  <p class="meta">${location}</p>
  <h2>Summary</h2>
  <p>${headline}</p>
  ${linkedin}
  <h2>Skills</h2>
  <p>${skills}</p>
</body>
</html>`
}

/** Opens a printable CV preview for an external search candidate in a new window. */
export function openExternalCandidateCv(candidate: ExternalCandidate): void {
  const url = URL.createObjectURL(
    new Blob([buildExternalCandidateCvHtml(candidate)], { type: 'text/html' }),
  )
  if (!window.open(url, '_blank', 'noopener,noreferrer')) {
    URL.revokeObjectURL(url)
    return
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
