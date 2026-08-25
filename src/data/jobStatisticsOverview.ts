export type JobStatisticsGrouping =
  | 'recent-graduates'
  | 'source'
  | 'job-function'
  | 'employee-group'

export type ReportKpi = {
  id: string
  label: string
  value: string
}

export type ReportHighlightStat = {
  id: string
  label: string
  value: string
  emphasis?: 'longest' | 'fastest' | 'gap' | 'default'
}

export type LineSeriesPoint = {
  label: string
  values: Record<string, number>
}

export type LineSeriesConfig = {
  key: string
  label: string
  color: string
  fillColor: string
}

export type BarDatum = {
  id: string
  label: string
  value: number
  color: string
}

export type DonutSlice = {
  id: string
  label: string
  value: number
  color: string
}

export type JobStatisticsChartView = {
  grouping: JobStatisticsGrouping
  chartTitle: string
  highlights: ReportHighlightStat[]
  chartType: 'line' | 'bar' | 'donut'
  line?: {
    yMax: number
    series: LineSeriesConfig[]
    points: LineSeriesPoint[]
  }
  bars?: {
    xMax: number
    items: BarDatum[]
  }
  donut?: {
    centerLabel: string
    centerValue: string
    slices: DonutSlice[]
  }
}

export const JOB_STATISTICS_GROUPING_OPTIONS: Array<{
  value: JobStatisticsGrouping
  label: string
}> = [
  { value: 'recent-graduates', label: 'By Recent Graduates' },
  { value: 'source', label: 'By Source' },
  { value: 'job-function', label: 'By Job Function' },
  { value: 'employee-group', label: 'By Employee Group' },
]

export const JOB_STATISTICS_ACTIVITY_PERIODS = [
  { value: 'last-6-months', label: 'Last 6 Months' },
  { value: 'last-3-months', label: 'Last 3 Months' },
  { value: 'last-12-months', label: 'Last 12 Months' },
  { value: 'ytd', label: 'Year to Date' },
]

export const REPORT_DISPLAY_OPTIONS = [
  { value: 'diagram', label: 'Diagram' },
  { value: 'table', label: 'Table' },
]

export const JOB_STATISTICS_DATE_RANGE_OPTIONS = [
  { value: '2024-01', label: '01/01/2024 - 01/31/2024' },
  { value: '2024-02', label: '02/01/2024 - 02/29/2024' },
  { value: '2024-q1', label: '01/01/2024 - 03/31/2024' },
  { value: '2024-ytd', label: '01/01/2024 - 12/31/2024' },
]

export const JOB_STATISTICS_KPIS: ReportKpi[] = [
  { id: 'total-jobs', label: 'Total Jobs', value: '1247' },
  { id: 'jobs-with-offers', label: 'Jobs with Offers', value: '843' },
  { id: 'jobs-with-hires', label: 'Jobs with Hires', value: '712' },
  { id: 'total-offers', label: 'Total Offers', value: '1089' },
  { id: 'total-employees', label: 'Total Employees', value: '938' },
  { id: 'avg-offer-time', label: 'Average Offer Time', value: '24d' },
  { id: 'avg-hiring-time', label: 'Average Hiring Time', value: '38d' },
]

const CHART_VIEWS: Record<JobStatisticsGrouping, JobStatisticsChartView> = {
  'recent-graduates': {
    grouping: 'recent-graduates',
    chartTitle: 'Average Time to Hire',
    chartType: 'line',
    highlights: [
      { id: 'new-grad', label: 'New Graduate', value: '42 Days' },
      { id: 'experienced', label: 'Experienced', value: '31 Days' },
      { id: 'overall', label: 'Overall Average', value: '38 Days' },
      {
        id: 'gap',
        label: 'The gap',
        value: '+11 Days',
        emphasis: 'gap',
      },
    ],
    line: {
      yMax: 100,
      series: [
        {
          key: 'newGraduate',
          label: 'New Graduate',
          color: '#D9773A',
          fillColor: 'rgba(217, 119, 58, 0.18)',
        },
        {
          key: 'experienced',
          label: 'Experienced',
          color: '#2A9D8F',
          fillColor: 'rgba(42, 157, 143, 0.16)',
        },
      ],
      points: [
        {
          label: 'September 25',
          values: { newGraduate: 78, experienced: 48 },
        },
        {
          label: 'October 25',
          values: { newGraduate: 72, experienced: 44 },
        },
        {
          label: 'November 25',
          values: { newGraduate: 80, experienced: 46 },
        },
        {
          label: 'December 25',
          values: { newGraduate: 74, experienced: 42 },
        },
        {
          label: 'January 26',
          values: { newGraduate: 76, experienced: 45 },
        },
      ],
    },
  },
  source: {
    grouping: 'source',
    chartTitle: 'Average Time to Hire',
    chartType: 'bar',
    highlights: [
      {
        id: 'referral',
        label: 'Referral — Fastest',
        value: '22 Days',
        emphasis: 'fastest',
      },
      { id: 'corporate', label: 'Corporate Site', value: '35 Days' },
      { id: 'social', label: 'Social Media', value: '37 Days' },
      { id: 'boards', label: 'Job Boards', value: '41 Days' },
      {
        id: 'agency',
        label: 'Agency — Slowest',
        value: '48 Days',
        emphasis: 'longest',
      },
    ],
    bars: {
      xMax: 60,
      items: [
        { id: 'referral', label: 'Referral', value: 22, color: '#2A9D8F' },
        {
          id: 'corporate',
          label: 'Corporate Site',
          value: 35,
          color: '#6B4C9A',
        },
        { id: 'social', label: 'Social Media', value: 37, color: '#4A90D9' },
        { id: 'boards', label: 'Job Boards', value: 41, color: '#C4A574' },
        { id: 'agency', label: 'Agency', value: 48, color: '#E07A9A' },
      ],
    },
  },
  'job-function': {
    grouping: 'job-function',
    chartTitle: 'Average Hiring Time',
    chartType: 'bar',
    highlights: [
      {
        id: 'tech',
        label: 'Technology — Longest',
        value: '45 Days',
        emphasis: 'longest',
      },
      { id: 'finance', label: 'Finance', value: '36 Days' },
      { id: 'marketing', label: 'Marketing', value: '33 Days' },
      { id: 'operations', label: 'Operations', value: '28 Days' },
      {
        id: 'hr',
        label: 'Human Resources — Fastest',
        value: '25 Days',
        emphasis: 'fastest',
      },
    ],
    bars: {
      xMax: 60,
      items: [
        { id: 'tech', label: 'Technology', value: 45, color: '#2A9D8F' },
        { id: 'finance', label: 'Finance', value: 36, color: '#6B4C9A' },
        { id: 'marketing', label: 'Marketing', value: 33, color: '#4A90D9' },
        { id: 'operations', label: 'Operations', value: 28, color: '#C4A574' },
        { id: 'hr', label: 'HR', value: 25, color: '#E07A9A' },
      ],
    },
  },
  'employee-group': {
    grouping: 'employee-group',
    chartTitle: 'Average Hiring Time',
    chartType: 'donut',
    highlights: [
      {
        id: 'permanent',
        label: 'Permanent — Longest',
        value: '42 Days',
        emphasis: 'longest',
      },
      { id: 'contractor', label: 'Contractor', value: '33 Days' },
      { id: 'consultant', label: 'Consultant', value: '29 Days' },
      { id: 'temporary', label: 'Temporary', value: '21 Days' },
      {
        id: 'intern',
        label: 'Intern — Fastest',
        value: '14 Days',
        emphasis: 'fastest',
      },
    ],
    donut: {
      centerLabel: 'Median Days',
      centerValue: '38',
      slices: [
        { id: 'permanent', label: 'Permanent', value: 42, color: '#6B4C9A' },
        { id: 'contractor', label: 'Contractor', value: 33, color: '#E07A9A' },
        { id: 'consultant', label: 'Consultant', value: 29, color: '#4A90D9' },
        { id: 'temporary', label: 'Temporary', value: 21, color: '#D9773A' },
        { id: 'intern', label: 'Intern', value: 14, color: '#2A9D8F' },
      ],
    },
  },
}

export function getJobStatisticsChartView(
  grouping: JobStatisticsGrouping,
): JobStatisticsChartView {
  return CHART_VIEWS[grouping]
}

export const JOB_STATISTICS_ADDITIONAL_FILTER_OPTIONS = {
  departments: ['All Departments', 'Technology', 'Finance', 'Marketing', 'HR'],
  locations: ['All Locations', 'United Kingdom', 'United States', 'India', 'UAE'],
  employmentTypes: [
    'All Types',
    'Permanent',
    'Contractor',
    'Consultant',
    'Temporary',
    'Intern',
  ],
  sources: [
    'All Sources',
    'Referral',
    'Corporate Site',
    'Social Media',
    'Job Boards',
    'Agency',
  ],
}
