export type ReportCategoryId =
  | 'job-reports'
  | 'candidate-reports'
  | 'leadership-reports'
  | 'feature-reports'

export type ReportItem = {
  id: string
  title: string
  description: string
}

export type ReportCategory = {
  id: ReportCategoryId
  /** Left nav label */
  navLabel: string
  /** Section heading in the catalog */
  title: string
  description: string
  reports: ReportItem[]
}

export const REPORT_CATEGORIES: ReportCategory[] = [
  {
    id: 'job-reports',
    navLabel: 'Job Reports',
    title: 'Jobs Reports',
    description:
      'Track job performance, hiring efficiency, and recruitment trends.',
    reports: [
      {
        id: 'job-statistics-overview',
        title: 'Job Statistics Overview',
        description:
          'View key job metrics, application activity, and source performance.',
      },
      {
        id: 'hiring-stage-timing',
        title: 'Hiring Stage Timing Analytics',
        description:
          'Analyze time spent at each hiring stage and identify bottlenecks.',
      },
      {
        id: 'offer-to-offer-conversion',
        title: 'Offer & Hired Distribution',
        description:
          'Track offer acceptance, conversion rates, and hiring outcomes.',
      },
    ],
  },
  {
    id: 'candidate-reports',
    navLabel: 'Candidate Reports',
    title: 'Candidate Reports',
    description:
      'Analyze candidate movement, pipeline health, and hiring outcomes.',
    reports: [
      {
        id: 'candidates-by-pipeline-stage',
        title: 'Candidates by Pipeline Stage',
        description:
          'View candidate distribution and movement across hiring stages.',
      },
    ],
  },
  {
    id: 'leadership-reports',
    navLabel: 'Leadership Reports',
    title: 'Leadership Reports',
    description:
      'Monitor workforce activity, hiring performance, and key business metrics.',
    reports: [
      {
        id: 'users-and-license',
        title: 'Users and License',
        description:
          'Track user activity, license usage, and account utilization.',
      },
    ],
  },
  {
    id: 'feature-reports',
    navLabel: 'Feature Reports',
    title: 'Feature Reports',
    description:
      'Measure adoption and performance across key recruitment features.',
    reports: [
      {
        id: 'end-to-end-interview',
        title: 'End to End Interview',
        description:
          'Analyze interview activity, completion rates, and candidate performance.',
      },
      {
        id: 'job-board',
        title: 'Job Board',
        description:
          'Track job board activity, postings, applications, and source performance.',
      },
    ],
  },
]

export const DEFAULT_REPORT_CATEGORY: ReportCategoryId = 'job-reports'

/** Section element id / URL hash fragment for a report category. */
export function getReportSectionHash(id: ReportCategoryId | string): string {
  return id
}

export function getReportSectionPath(id: ReportCategoryId | string): string {
  return `/reports#${getReportSectionHash(id)}`
}

/** Detail route for a catalog report, when implemented. */
export function getReportDetailPath(reportId: string): string | null {
  switch (reportId) {
    case 'job-statistics-overview':
      return '/reports/job-statistics-overview'
    case 'hiring-stage-timing':
      return '/reports/hiring-stage-time-analytics'
    case 'offer-to-offer-conversion':
      return '/reports/offer-hired-distribution'
    default:
      return null
  }
}

/** Same shape as Settings left nav — single grouped card of report categories. */
export const REPORT_NAV_GROUPS = [
  {
    id: 'report-categories',
    title: '',
    items: REPORT_CATEGORIES.map((category) => ({
      id: category.id,
      label: category.navLabel,
    })),
  },
]

export function isReportCategoryId(value: string): value is ReportCategoryId {
  return REPORT_CATEGORIES.some((category) => category.id === value)
}
