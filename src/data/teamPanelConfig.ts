export type TeamPanelJobStatus = 'configured' | 'pending'

export type TeamPanelParticipant = {
  id: string
  name: string
  email: string
  /** e.g. "Mon-Fri 11:00 - 22:00" or timezone note */
  hoursNote: string
  tags: string[]
}

export type TeamPanelWorkingHours = {
  recruiterName: string
  recruiterEmail: string
  workingDays: string[]
  startTime: string
  endTime: string
}

export type InterviewPanelLoop = {
  id: string
  /** Base title without role suffix, e.g. "Technical Interview Panel" */
  title: string
  enabled: boolean
  /** Expanded by default when first loaded */
  defaultExpanded?: boolean
  organizer: TeamPanelParticipant
  mandatory: TeamPanelParticipant
  optional: TeamPanelParticipant
  duration: string
  timezone: string
  workingHours: TeamPanelWorkingHours
}

export type TeamPanelJob = {
  id: string
  title: string
  reqId: string
  status: TeamPanelJobStatus
  teamOptions: string[]
  panels: InterviewPanelLoop[]
}

export const TEAM_PANEL_DURATION_OPTIONS = [
  '30 Minutes (Screening)',
  '45 Minutes (Technical Assessment)',
  '60 Minutes (Panel Interview)',
  '90 Minutes (Final Round)',
]

export const TEAM_PANEL_TIMEZONE_OPTIONS = [
  '(GMT+00:00) UTC',
  '(GMT+04:00) Asia',
  '(GMT+05:30) India',
  '(GMT-05:00) Eastern',
  '(GMT-08:00) Pacific',
]

export const TEAM_OPTIONS = ['Internal Team', 'Client Panel', 'Mixed Panel']

const HELI_WORKING: TeamPanelWorkingHours = {
  recruiterName: 'Heli Shah',
  recruiterEmail: 'heli@recruitmentsmart.com',
  workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
  startTime: '11:00 Hrs',
  endTime: '20:00 Hrs',
}

function basePanels(roleLabel: string): InterviewPanelLoop[] {
  return [
    {
      id: `${roleLabel}-technical`,
      title: 'Technical Interview Panel',
      enabled: true,
      organizer: {
        id: 'org-1',
        name: 'Heli Shah',
        email: 'heli@recruitmentsmart.com',
        hoursNote: 'Mon-Fri 11:00 - 22:00',
        tags: [],
      },
      mandatory: {
        id: 'man-1',
        name: 'Marc Andre',
        email: 'heli@recruitmentsmart.com',
        hoursNote: 'Time Zone: Asia/Dubai (GMT +04:00)',
        tags: [],
      },
      optional: {
        id: 'opt-1',
        name: 'Dev Ops Team',
        email: 'heli@recruitmentsmart.com',
        hoursNote: 'Mon-Fri 11:00 - 22:00',
        tags: [],
      },
      duration: '45 Minutes (Technical Assessment)',
      timezone: '(GMT+04:00) Asia',
      workingHours: HELI_WORKING,
    },
    {
      id: `${roleLabel}-hr`,
      title: 'HR Interview Panel',
      enabled: false,
      organizer: {
        id: 'org-2',
        name: 'Heli Shah',
        email: 'heli@recruitmentsmart.com',
        hoursNote: 'Mon-Fri 11:00 - 22:00',
        tags: [],
      },
      mandatory: {
        id: 'man-2',
        name: 'Marc Andre',
        email: 'heli@recruitmentsmart.com',
        hoursNote: 'Time Zone: Asia/Dubai (GMT +04:00)',
        tags: [],
      },
      optional: {
        id: 'opt-2',
        name: 'Dev Ops Team',
        email: 'heli@recruitmentsmart.com',
        hoursNote: 'Mon-Fri 11:00 - 22:00',
        tags: [],
      },
      duration: '30 Minutes (Screening)',
      timezone: '(GMT+04:00) Asia',
      workingHours: HELI_WORKING,
    },
    {
      id: `${roleLabel}-first`,
      title: '1st Interview Panel',
      enabled: true,
      defaultExpanded: true,
      organizer: {
        id: 'org-3',
        name: 'Heli Shah',
        email: 'heli@recruitmentsmart.com',
        hoursNote: 'Mon-Fri 11:00 - 22:00',
        tags: [],
      },
      mandatory: {
        id: 'man-3',
        name: 'Marc Andre',
        email: 'heli@recruitmentsmart.com',
        hoursNote: 'Time Zone: Asia/Dubai (GMT +04:00)',
        tags: [],
      },
      optional: {
        id: 'opt-3',
        name: 'Dev Ops Team',
        email: 'heli@recruitmentsmart.com',
        hoursNote: 'Mon-Fri 11:00 - 22:00',
        tags: [],
      },
      duration: '45 Minutes (Technical Assessment)',
      timezone: '(GMT+04:00) Asia',
      workingHours: HELI_WORKING,
    },
  ]
}

export const TEAM_PANEL_JOBS: TeamPanelJob[] = [
  {
    id: 'job-php',
    title: 'Php Developer',
    reqId: 'VID-002',
    status: 'configured',
    teamOptions: TEAM_OPTIONS,
    panels: basePanels('php'),
  },
  {
    id: 'job-qa',
    title: 'Qa Analyst',
    reqId: 'VID-012',
    status: 'pending',
    teamOptions: TEAM_OPTIONS,
    panels: basePanels('qa').map((p) => ({
      ...p,
      enabled: false,
      defaultExpanded: false,
    })),
  },
  {
    id: 'job-mern',
    title: 'Mern Stack Developer',
    reqId: 'VID-018',
    status: 'configured',
    teamOptions: TEAM_OPTIONS,
    panels: basePanels('mern'),
  },
  {
    id: 'job-laravel',
    title: 'Senior - Php Laravel Developer',
    reqId: 'VID-021',
    status: 'pending',
    teamOptions: TEAM_OPTIONS,
    panels: basePanels('laravel').map((p) => ({
      ...p,
      enabled: p.title === 'Technical Interview Panel',
      defaultExpanded: false,
    })),
  },
]

export function getTeamPanelJobs(): TeamPanelJob[] {
  return TEAM_PANEL_JOBS.map((job) => ({
    ...job,
    panels: job.panels.map((p) => ({
      ...p,
      organizer: { ...p.organizer, tags: [...p.organizer.tags] },
      mandatory: { ...p.mandatory, tags: [...p.mandatory.tags] },
      optional: { ...p.optional, tags: [...p.optional.tags] },
      workingHours: {
        ...p.workingHours,
        workingDays: [...p.workingHours.workingDays],
      },
    })),
  }))
}

export function jobRosterLabel(job: Pick<TeamPanelJob, 'title' | 'reqId'>): string {
  return `${job.title} (${job.reqId})`
}
