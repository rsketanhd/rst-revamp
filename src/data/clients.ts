export type ClientTab = 'clients' | 'endClients' | 'industries'

export type ClientRecord = {
  id: string
  /** Display / filterable client code (e.g. CLI-001) */
  clientId: string
  name: string
  location: string
  taxonomyFocus: string
  coreContact: string
  assignedRecruiter: string
  endClientsCount: number
  industry: string
  status: string
  /** ISO date (yyyy-mm-dd) for Created On filter */
  createdOn: string
}

export type ClientsMoreFilters = {
  clientIds: string[]
  clientNames: string[]
  createdOn: string
}

export const emptyClientsMoreFilters: ClientsMoreFilters = {
  clientIds: [],
  clientNames: [],
  createdOn: '',
}

export type EndClientRecord = {
  id: string
  subsidiary: string
  primaryClient: string
  industrySector: string
  hiringManager: string
  activeFunnels: number
  createdDate: string
  syncState: 'synced' | 'pending' | 'error'
}

export type IndustryRecord = {
  id: string
  code: string
  name: string
  createdDate: string
}

export type ClientMetrics = {
  activeClients: number
  endClientEntities: number
  classificationIndustries: number
  hiringVolumeDensity: number
}

export const CLIENTS: ClientRecord[] = [
  {
    id: 'cli-1',
    clientId: 'CLI-001',
    name: 'Global Tech Solutions',
    location: 'North America',
    taxonomyFocus: 'Software Engineering',
    coreContact: 'Sarah Jenkins',
    assignedRecruiter: 'Alex Mercer',
    endClientsCount: 5,
    industry: 'Software Engineering',
    status: 'Active',
    createdOn: '2026-01-20',
  },
  {
    id: 'cli-2',
    clientId: 'CLI-002',
    name: 'NextGen Networks',
    location: 'South America',
    taxonomyFocus: 'Cybersecurity',
    coreContact: 'Carlos Sanchez',
    assignedRecruiter: 'Elena Diaz',
    endClientsCount: 5,
    industry: 'Financial Services',
    status: 'Active',
    createdOn: '2025-11-15',
  },
  {
    id: 'cli-3',
    clientId: 'CLI-003',
    name: 'Pioneer Analytics',
    location: 'Asia-Pacific',
    taxonomyFocus: 'Data Science',
    coreContact: 'Ravi Kumar',
    assignedRecruiter: 'Tina Wong',
    endClientsCount: 2,
    industry: 'Healthcare & Pharma',
    status: 'Active',
    createdOn: '2025-03-15',
  },
  {
    id: 'cli-4',
    clientId: 'CLI-004',
    name: 'Innovatech Dynamics',
    location: 'Europe',
    taxonomyFocus: 'Product Design',
    coreContact: 'Lena Schmidt',
    assignedRecruiter: 'Markus Vogel',
    endClientsCount: 3,
    industry: 'Supply Chain',
    status: 'Prospect',
    createdOn: '2025-01-07',
  },
]

export const END_CLIENTS: EndClientRecord[] = [
  {
    id: 'ec-1',
    subsidiary: 'Apex Credit Services',
    primaryClient: 'Apex Banking Group',
    industrySector: 'Financial Services',
    hiringManager: 'Sarah Jenkins',
    activeFunnels: 4,
    createdDate: '12 Jan 2026',
    syncState: 'synced',
  },
  {
    id: 'ec-2',
    subsidiary: 'Nova Health Clinics',
    primaryClient: 'Nova Medical Group',
    industrySector: 'Healthcare',
    hiringManager: 'Dr. Chen Wei',
    activeFunnels: 9,
    createdDate: '08 Dec 2025',
    syncState: 'pending',
  },
  {
    id: 'ec-3',
    subsidiary: 'Horizon Retail Ops',
    primaryClient: 'Horizon Commerce',
    industrySector: 'Retail & E-Commerce',
    hiringManager: 'Priya Nair',
    activeFunnels: 7,
    createdDate: '22 Nov 2025',
    syncState: 'synced',
  },
  {
    id: 'ec-4',
    subsidiary: 'Atlas Logistics Hub',
    primaryClient: 'Atlas Supply Co',
    industrySector: 'Supply Chain',
    hiringManager: 'James Ortega',
    activeFunnels: 12,
    createdDate: '03 Oct 2025',
    syncState: 'error',
  },
]

export const INDUSTRIES: IndustryRecord[] = [
  {
    id: 'ind-1',
    code: 'SWE',
    name: 'Software Engineering',
    createdDate: '20 Jan 2026',
  },
  {
    id: 'ind-2',
    code: 'RETL',
    name: 'Retail & E-Commerce',
    createdDate: '15 Nov 2025',
  },
  {
    id: 'ind-3',
    code: 'HLTH',
    name: 'Healthcare Providers',
    createdDate: '15 Mar 2025',
  },
  {
    id: 'ind-4',
    code: 'TECH',
    name: 'Technology Solutions',
    createdDate: '07 Jan 2025',
  },
]

export const CLIENT_INDUSTRY_OPTIONS = [
  'Software Engineering',
  'Financial Services',
  'Healthcare & Pharma',
  'Supply Chain',
  'Retail & E-Commerce',
  'Technology Solutions',
]

export const CLIENT_STATUS_OPTIONS = ['Active', 'Inactive', 'Prospect']

export const CLIENT_USER_ROLE_OPTIONS = ['Admin', 'Recruiter', 'Viewer', 'Hiring Manager']

export const AGENCY_POC_OPTIONS = [
  'Jordan Hale',
  'Sam Rivera',
  'Taylor Brooks',
  'Morgan Ellis',
]

export const LEAD_RECRUITER_OPTIONS = [
  'Alex Mercer',
  'Elena Diaz',
  'Tina Wong',
  'Markus Vogel',
]

export const SYNC_STATE_OPTIONS = [
  { value: 'synced', label: 'Synced' },
  { value: 'pending', label: 'Pending' },
  { value: 'error', label: 'Error' },
]

export function getClientMetrics(
  clients: ClientRecord[] = CLIENTS,
  endClients: EndClientRecord[] = END_CLIENTS,
  industries: IndustryRecord[] = INDUSTRIES,
): ClientMetrics {
  return {
    activeClients: clients.length,
    endClientEntities: endClients.length,
    classificationIndustries: industries.length,
    // Demo metric aligned with listing design (density score, not funnel sum)
    hiringVolumeDensity: clients.length,
  }
}

/** Design shows zero-padded metric values (e.g. 04). */
export function formatClientStat(value: number): string {
  return String(value).padStart(2, '0')
}

export function countClientsMoreFilters(filters: ClientsMoreFilters): number {
  let count = 0
  count += filters.clientIds.length
  count += filters.clientNames.length
  if (filters.createdOn) count += 1
  return count
}

export function matchesClientsMoreFilters(
  client: ClientRecord,
  filters: ClientsMoreFilters,
): boolean {
  if (
    filters.clientIds.length > 0 &&
    !filters.clientIds.includes(client.clientId)
  ) {
    return false
  }
  if (
    filters.clientNames.length > 0 &&
    !filters.clientNames.includes(client.name)
  ) {
    return false
  }
  if (filters.createdOn && client.createdOn !== filters.createdOn) {
    return false
  }
  return true
}

export function filterClients(
  clients: ClientRecord[],
  query: string,
  moreFilters: ClientsMoreFilters = emptyClientsMoreFilters,
): ClientRecord[] {
  const q = query.trim().toLowerCase()
  return clients.filter((client) => {
    if (!matchesClientsMoreFilters(client, moreFilters)) return false
    if (!q) return true
    return [
      client.clientId,
      client.name,
      client.location,
      client.taxonomyFocus,
      client.coreContact,
      client.assignedRecruiter,
      client.industry,
      client.status,
      String(client.endClientsCount),
    ]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
}

export function filterEndClients(
  endClients: EndClientRecord[],
  query: string,
  syncState: string,
): EndClientRecord[] {
  const q = query.trim().toLowerCase()
  return endClients.filter((item) => {
    if (syncState && item.syncState !== syncState) return false
    if (!q) return true
    return [
      item.subsidiary,
      item.primaryClient,
      item.industrySector,
      item.hiringManager,
      String(item.activeFunnels),
      item.createdDate,
    ]
      .join(' ')
      .toLowerCase()
      .includes(q)
  })
}

export function filterIndustries(
  industries: IndustryRecord[],
  query: string,
): IndustryRecord[] {
  const q = query.trim().toLowerCase()
  if (!q) return industries
  return industries.filter((item) =>
    [item.code, item.name, item.createdDate]
      .join(' ')
      .toLowerCase()
      .includes(q),
  )
}
