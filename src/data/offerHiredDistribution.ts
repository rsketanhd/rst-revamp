export type OfferHiredMetric = {
  id: string
  label: string
  value: string
  description: string
}

export type OfferHiredBreakdownGrouping =
  | 'scientific-specialty'
  | 'job-title'
  | 'client'
  | 'active-sources'

export type HorizontalBarItem = {
  id: string
  label: string
  value: number
  color?: string
}

export type GroupedBarMonth = {
  month: string
  application: number
  recommendation: number
}

export const OFFER_HIRED_METRICS: OfferHiredMetric[] = [
  {
    id: 'total-offers',
    label: 'Total Offers',
    value: '3,631',
    description: 'January 2023 – March 2024',
  },
  {
    id: 'total-employees',
    label: 'Total Employees',
    value: '771',
    description: 'January 2023 – March 2024',
  },
  {
    id: 'offer-hire-ratio',
    label: 'Offer to Hire Ratio',
    value: '21.2%',
    description: '771 out of 3,631 offers',
  },
  {
    id: 'avg-time-hire',
    label: 'Average Time to Hire',
    value: '90',
    description: 'Average Time to Hire',
  },
  {
    id: 'avg-time-offer',
    label: 'Average Time to Offer',
    value: '120',
    description: 'Average Time to Submit Offer',
  },
  {
    id: 'avg-ai-score',
    label: 'Average AI Score for Employees',
    value: '66',
    description: 'Average AI Score for Employees',
  },
]

export const OFFER_HIRED_BREAKDOWN_OPTIONS: Array<{
  value: OfferHiredBreakdownGrouping
  label: string
}> = [
  { value: 'scientific-specialty', label: 'By scientific specialization' },
  { value: 'job-title', label: 'By job title' },
  { value: 'client', label: 'By client' },
  { value: 'active-sources', label: 'Active sources' },
]

export const OFFER_HIRED_OFFER_BREAKDOWN_OPTIONS: Array<{
  value: OfferHiredBreakdownGrouping
  label: string
}> = [
  {
    value: 'scientific-specialty',
    label: 'According to the scientific specialty',
  },
  { value: 'job-title', label: 'According to the job title' },
  { value: 'client', label: 'According to the client' },
  { value: 'active-sources', label: 'Active sources' },
]

export const OFFER_HIRED_DISPLAY_OPTIONS = [
  { value: 'diagram', label: 'Diagram' },
  { value: 'table', label: 'Table' },
]

export const OFFER_HIRED_ACTIVITY_PERIODS = [
  { value: 'last-6-months', label: 'Last 6 Months' },
  { value: 'last-12-months', label: 'Last 12 Months' },
  { value: 'ytd', label: 'Year to Date' },
]

const BREAKDOWN_BARS: Record<OfferHiredBreakdownGrouping, HorizontalBarItem[]> =
  {
    'scientific-specialty': [
      { id: 'mech', label: 'Mechanical Engineering', value: 48 },
      { id: 'aero', label: 'Aerospace Engineering', value: 36 },
      {
        id: 'diploma-mech',
        label: 'Diploma in Mechanical Engineering',
        value: 29,
      },
      { id: 'cs', label: 'Computer Science', value: 72 },
      { id: 'ee', label: 'Electrical Engineering', value: 41 },
      { id: 'civil', label: 'Civil Engineering', value: 28 },
      { id: 'chem', label: 'Chemical Engineering', value: 22 },
      { id: 'bio', label: 'Biotechnology', value: 33 },
      { id: 'data', label: 'Data Science', value: 55 },
      { id: 'it', label: 'Information Technology', value: 44 },
    ],
    'job-title': [
      { id: 'swe', label: 'Software Engineer', value: 68 },
      { id: 'pm', label: 'Product Manager', value: 34 },
      { id: 'ds', label: 'Data Analyst', value: 47 },
      { id: 'qa', label: 'QA Engineer', value: 29 },
      { id: 'design', label: 'UX Designer', value: 25 },
      { id: 'devops', label: 'DevOps Engineer', value: 38 },
    ],
    client: [
      { id: 'acme', label: 'Acme Corp', value: 52 },
      { id: 'globex', label: 'Globex', value: 41 },
      { id: 'initech', label: 'Initech', value: 63 },
      { id: 'umbrella', label: 'Umbrella', value: 27 },
      { id: 'stark', label: 'Stark Industries', value: 45 },
    ],
    'active-sources': [
      { id: 'referral', label: 'Referral', value: 58 },
      { id: 'agency', label: 'Agency', value: 44 },
      { id: 'boards', label: 'Job Boards', value: 66 },
      { id: 'campus', label: 'Campus', value: 31 },
      { id: 'social', label: 'Social Media', value: 39 },
    ],
  }

export function getOfferHiredBreakdownBars(
  grouping: OfferHiredBreakdownGrouping,
): HorizontalBarItem[] {
  return BREAKDOWN_BARS[grouping]
}

export const OFFER_HIRED_MONTHLY: GroupedBarMonth[] = [
  { month: 'January', application: 40, recommendation: 30 },
  { month: 'February', application: 12, recommendation: 25 },
  { month: 'March', application: 10, recommendation: 57 },
  { month: 'April', application: 40, recommendation: 30 },
  { month: 'May', application: 12, recommendation: 25 },
  { month: 'June', application: 10, recommendation: 57 },
  { month: 'July', application: 40, recommendation: 30 },
  { month: 'August', application: 12, recommendation: 25 },
  { month: 'September', application: 10, recommendation: 57 },
  { month: 'October', application: 40, recommendation: 30 },
  { month: 'November', application: 12, recommendation: 25 },
]
