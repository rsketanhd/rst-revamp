export type TalentPoolScope = 'my' | 'all'

export type TalentPoolVisibility = 'public' | 'private' | 'shared'

export type TalentCrmMetric = {
  id: string
  label: string
  value: number
  change: number
  changeLabel: string
}

export type TalentPool = {
  id: string
  name: string
  visibility: TalentPoolVisibility
  candidateCount: number
  owners: string[]
  activeCampaigns: number
  createdOn: string
  /** Created timestamp for sorting */
  createdAt: number
  isMine: boolean
}

export type TalentCrmFilters = {
  visibility: TalentPoolVisibility | ''
  owner: string
  sortBy: 'createdOn' | 'name' | 'candidates' | 'campaigns'
  sortDir: 'asc' | 'desc'
}

export const emptyTalentCrmFilters: TalentCrmFilters = {
  visibility: '',
  owner: '',
  sortBy: 'createdOn',
  sortDir: 'desc',
}

const VS_LAST_MONTH = 'vs Last Month'

export const TALENT_CRM_METRICS: TalentCrmMetric[] = [
  {
    id: 'pools',
    label: 'Talent Pools',
    value: 1500,
    change: 15,
    changeLabel: VS_LAST_MONTH,
  },
  {
    id: 'candidates',
    label: 'Candidates',
    value: 1140,
    change: 5,
    changeLabel: VS_LAST_MONTH,
  },
  {
    id: 'campaign-ready',
    label: 'Campaign Ready',
    value: 1020,
    change: 2,
    changeLabel: VS_LAST_MONTH,
  },
  {
    id: 'engaged',
    label: 'Engaged',
    value: 1100,
    change: -2,
    changeLabel: VS_LAST_MONTH,
  },
  {
    id: 'qualified',
    label: 'Qualified',
    value: 1300,
    change: -4,
    changeLabel: VS_LAST_MONTH,
  },
]

export const TALENT_POOL_OWNER_OPTIONS = [
  'Olivia Mackenzie',
  'Sarah Johnson',
  'Alexander Mathew',
  'Priya Nair',
  'James Okafor',
]

export const TALENT_POOLS: TalentPool[] = [
  {
    id: 'tp-finance-analysts',
    name: 'Finance Analysts — Jeddah & Riyadh',
    visibility: 'public',
    candidateCount: 1500,
    owners: ['Olivia Mackenzie', 'Sarah Johnson'],
    activeCampaigns: 2,
    createdOn: '22 Sep 2025',
    createdAt: Date.parse('2025-09-22'),
    isMine: true,
  },
  {
    id: 'tp-1',
    name: 'Software Engineers in Ahmedabad',
    visibility: 'shared',
    candidateCount: 115,
    owners: ['Olivia Mackenzie', 'Sarah Johnson'],
    activeCampaigns: 0,
    createdOn: '20 Sep 2025',
    createdAt: Date.parse('2025-09-20'),
    isMine: true,
  },
  {
    id: 'tp-2',
    name: 'Sales Leadership Pipeline',
    visibility: 'public',
    candidateCount: 1420,
    owners: ['Alexander Mathew'],
    activeCampaigns: 1,
    createdOn: '18 Sep 2025',
    createdAt: Date.parse('2025-09-18'),
    isMine: true,
  },
  {
    id: 'tp-3',
    name: 'Q3 Intern Applicants',
    visibility: 'private',
    candidateCount: 800,
    owners: ['Priya Nair', 'Olivia Mackenzie'],
    activeCampaigns: 2,
    createdOn: '12 Sep 2025',
    createdAt: Date.parse('2025-09-12'),
    isMine: true,
  },
  {
    id: 'tp-4',
    name: 'Field Service Technicians - Northeast US',
    visibility: 'public',
    candidateCount: 512,
    owners: ['James Okafor', 'Sarah Johnson'],
    activeCampaigns: 3,
    createdOn: '05 Sep 2025',
    createdAt: Date.parse('2025-09-05'),
    isMine: false,
  },
  {
    id: 'tp-5',
    name: 'Product Managers - Remote',
    visibility: 'shared',
    candidateCount: 268,
    owners: ['Alexander Mathew', 'Priya Nair'],
    activeCampaigns: 1,
    createdOn: '28 Aug 2025',
    createdAt: Date.parse('2025-08-28'),
    isMine: true,
  },
]

export function getTalentPoolById(poolId: string): TalentPool | undefined {
  return TALENT_POOLS.find((pool) => pool.id === poolId)
}

export function formatTalentMetric(value: number): string {
  return value.toLocaleString('en-US')
}

export function formatPaddedCount(value: number): string {
  return String(value).padStart(2, '0')
}

export function formatOwners(owners: string[]): string {
  if (owners.length === 0) return '—'
  if (owners.length === 1) return owners[0] ?? '—'
  const preview = owners.slice(0, 2).join(', ')
  return owners.length > 2 ? `${preview}...` : preview
}

export function countTalentCrmFilters(filters: TalentCrmFilters): number {
  return [filters.visibility, filters.owner].filter(Boolean).length
}

/**
 * Filter + sort talent pools for the Talent CRM landing list.
 */
export function filterTalentPools(
  pools: TalentPool[],
  query: string,
  scope: TalentPoolScope,
  filters: TalentCrmFilters,
): TalentPool[] {
  const needle = query.trim().toLowerCase()

  const rows = pools.filter((pool) => {
    if (scope === 'my' && !pool.isMine) return false
    if (filters.visibility && pool.visibility !== filters.visibility) {
      return false
    }
    if (filters.owner && !pool.owners.includes(filters.owner)) return false
    if (!needle) return true
    return (
      pool.name.toLowerCase().includes(needle) ||
      pool.owners.some((owner) => owner.toLowerCase().includes(needle))
    )
  })

  const dir = filters.sortDir === 'asc' ? 1 : -1

  return [...rows].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name) * dir
      case 'candidates':
        return (a.candidateCount - b.candidateCount) * dir
      case 'campaigns':
        return (a.activeCampaigns - b.activeCampaigns) * dir
      case 'createdOn':
        return (a.createdAt - b.createdAt) * dir
      default: {
        const exhaustive: never = filters.sortBy
        return exhaustive
      }
    }
  })
}
