import {
  formatOwners,
  formatPaddedCount,
  TALENT_POOL_OWNER_OPTIONS,
  type TalentCrmMetric,
} from './talentCrm'

export type CampaignScope = 'my' | 'all'

export type CampaignChannel = 'Email' | 'SMS'

export type CampaignFrequency = 'Recurring' | 'Once'

export type CampaignStatus =
  | 'draft'
  | 'archived'
  | 'active'
  | 'paused'
  | 'completed'

export type Campaign = {
  id: string
  name: string
  talentPool: string
  channel: CampaignChannel
  owners: string[]
  createdOn: string
  /** Created timestamp for sorting */
  createdAt: number
  frequency: CampaignFrequency
  status: CampaignStatus
  isMine: boolean
}

export type CampaignFilters = {
  status: CampaignStatus | ''
  channel: CampaignChannel | ''
  owner: string
  frequency: CampaignFrequency | ''
  sortBy: 'createdOn' | 'name' | 'talentPool' | 'status'
  sortDir: 'asc' | 'desc'
}

export const emptyCampaignFilters: CampaignFilters = {
  status: '',
  channel: '',
  owner: '',
  frequency: '',
  sortBy: 'createdOn',
  sortDir: 'desc',
}

const VS_LAST_MONTH = 'vs last Month'

export const CAMPAIGN_METRICS: TalentCrmMetric[] = [
  {
    id: 'total',
    label: 'Total Campaigns',
    value: 24,
    change: 15,
    changeLabel: VS_LAST_MONTH,
  },
  {
    id: 'messages',
    label: 'Total Messages Sent',
    value: 8450,
    change: 5,
    changeSuffix: '%',
    changeLabel: VS_LAST_MONTH,
  },
  {
    id: 'open-rate',
    label: 'Open Rate',
    value: 42,
    valueSuffix: '%',
    change: 5,
    changeSuffix: '%',
    changeLabel: VS_LAST_MONTH,
  },
  {
    id: 'reply-rate',
    label: 'Reply Rate',
    value: 18,
    valueSuffix: '%',
    change: -2,
    changeSuffix: '%',
    changeLabel: VS_LAST_MONTH,
  },
  {
    id: 'meetings',
    label: 'Meetings Booked',
    value: 142,
    change: 12,
    changeLabel: VS_LAST_MONTH,
  },
]

export type CampaignStatusMeta = {
  label: string
  className: string
  dotClassName: string
}

export const CAMPAIGN_STATUS_META: Record<CampaignStatus, CampaignStatusMeta> =
  {
    draft: {
      label: 'Draft',
      className: 'bg-[#EEF0F4] text-[#5B6178]',
      dotClassName: 'bg-[#8B91A8]',
    },
    archived: {
      label: 'Archived',
      className: 'bg-[#F0E9FA] text-[#6B4FA8]',
      dotClassName: 'bg-[#8B6BC7]',
    },
    active: {
      label: 'Active',
      className: 'bg-[#E6F6ED] text-[#1F7A4D]',
      dotClassName: 'bg-[#2F9E6B]',
    },
    paused: {
      label: 'Paused',
      className: 'bg-[#FFF3E6] text-[#B86A1A]',
      dotClassName: 'bg-[#E89A3C]',
    },
    completed: {
      label: 'Completed',
      className: 'bg-[#E8F1FE] text-[#2F6FD6]',
      dotClassName: 'bg-[#4A8AE8]',
    },
  }

export function campaignStatusPillOption(status: CampaignStatus) {
  return { value: status, ...CAMPAIGN_STATUS_META[status] }
}

export const CAMPAIGN_OWNER_OPTIONS = TALENT_POOL_OWNER_OPTIONS

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-1',
    name: 'Winter Campus Career Event',
    talentPool: 'Software Developers in Ahmedabad',
    channel: 'Email',
    owners: ['Sarah Johnson', 'Olivia Mackenzie'],
    createdOn: '15 Dec, 2025',
    createdAt: Date.parse('2025-12-15'),
    frequency: 'Recurring',
    status: 'draft',
    isMine: true,
  },
  {
    id: 'cmp-2',
    name: 'Q1 Finance Analyst Nurture',
    talentPool: 'Finance Analysts — Jeddah & Riyadh',
    channel: 'Email',
    owners: ['Alexander Mathew'],
    createdOn: '02 Dec, 2025',
    createdAt: Date.parse('2025-12-02'),
    frequency: 'Once',
    status: 'archived',
    isMine: true,
  },
  {
    id: 'cmp-3',
    name: 'Remote PM Outreach Wave',
    talentPool: 'Product Managers - Remote',
    channel: 'SMS',
    owners: ['Priya Nair', 'Alexander Mathew'],
    createdOn: '28 Nov, 2025',
    createdAt: Date.parse('2025-11-28'),
    frequency: 'Recurring',
    status: 'active',
    isMine: true,
  },
  {
    id: 'cmp-4',
    name: 'Northeast Field Tech Blast',
    talentPool: 'Field Service Technicians - Northeast US',
    channel: 'Email',
    owners: ['James Okafor', 'Sarah Johnson'],
    createdOn: '12 Nov, 2025',
    createdAt: Date.parse('2025-11-12'),
    frequency: 'Once',
    status: 'paused',
    isMine: true,
  },
  {
    id: 'cmp-5',
    name: 'Sales Leadership Warm-up',
    talentPool: 'Sales Leadership Pipeline',
    channel: 'SMS',
    owners: ['Olivia Mackenzie'],
    createdOn: '05 Nov, 2025',
    createdAt: Date.parse('2025-11-05'),
    frequency: 'Recurring',
    status: 'completed',
    isMine: true,
  },
]

export function countCampaignFilters(filters: CampaignFilters): number {
  return [filters.status, filters.channel, filters.owner, filters.frequency].filter(
    Boolean,
  ).length
}

/**
 * Filter + sort campaigns for the Campaigns landing list.
 */
export function filterCampaigns(
  campaigns: Campaign[],
  query: string,
  scope: CampaignScope,
  filters: CampaignFilters,
): Campaign[] {
  const needle = query.trim().toLowerCase()

  const rows = campaigns.filter((campaign) => {
    if (scope === 'my' && !campaign.isMine) return false
    if (filters.status && campaign.status !== filters.status) return false
    if (filters.channel && campaign.channel !== filters.channel) return false
    if (filters.frequency && campaign.frequency !== filters.frequency) {
      return false
    }
    if (filters.owner && !campaign.owners.includes(filters.owner)) return false
    if (!needle) return true

    const haystack = [
      campaign.name,
      campaign.talentPool,
      campaign.channel,
      ...campaign.owners,
    ]
    return haystack.some((part) => part.toLowerCase().includes(needle))
  })

  const dir = filters.sortDir === 'asc' ? 1 : -1

  return [...rows].sort((a, b) => {
    switch (filters.sortBy) {
      case 'name':
        return a.name.localeCompare(b.name) * dir
      case 'talentPool':
        return a.talentPool.localeCompare(b.talentPool) * dir
      case 'status':
        return a.status.localeCompare(b.status) * dir
      case 'createdOn':
        return (a.createdAt - b.createdAt) * dir
      default: {
        const exhaustive: never = filters.sortBy
        return exhaustive
      }
    }
  })
}

export { formatOwners, formatPaddedCount }
