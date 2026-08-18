/**
 * Role Management — permission catalog and default role matrix.
 */

export type PermissionItem = {
  id: string
  label: string
  description: string
}

export type PermissionCategory = {
  id: string
  label: string
  permissions: PermissionItem[]
}

export type PlatformRole = {
  id: string
  name: string
  /** When true, name can be edited (new roles). */
  nameEditable?: boolean
  /** When true, role cannot be deleted (system roles). */
  locked?: boolean
}

export const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: 'tenant',
    label: 'Tenant Management',
    permissions: [
      {
        id: 'tenant.add-remove',
        label: 'Add/Remove Tenants',
        description:
          'Create new tenant organizations and remove existing tenants from the platform.',
      },
      {
        id: 'tenant.configure',
        label: 'Configure Tenant Settings',
        description:
          'Update tenant-level configuration such as branding, domains, and limits.',
      },
      {
        id: 'tenant.analytics',
        label: 'View Tenant Analytics',
        description:
          'Access aggregate tenant usage analytics and health metrics.',
      },
    ],
  },
  {
    id: 'user',
    label: 'User Management',
    permissions: [
      {
        id: 'user.create-delete',
        label: 'Create/Delete Users',
        description: 'Invite, create, and permanently delete platform users.',
      },
      {
        id: 'user.assign-roles',
        label: 'Assign Roles',
        description: 'Change role assignments for users in the organization.',
      },
      {
        id: 'user.view-list',
        label: 'View User List',
        description: 'Browse and search the full user directory.',
      },
      {
        id: 'user.manage-profile',
        label: 'Manage Own Profile',
        description:
          'Edit personal profile details, credentials, and notification preferences.',
      },
    ],
  },
  {
    id: 'job',
    label: 'Job Management',
    permissions: [
      {
        id: 'job.create',
        label: 'Create Jobs',
        description: 'Create new job requisitions and postings.',
      },
      {
        id: 'job.edit-all',
        label: 'Edit All Jobs',
        description: 'Modify any job, including those owned by other recruiters.',
      },
      {
        id: 'job.delete',
        label: 'Delete Jobs',
        description: 'Permanently remove job postings from the system.',
      },
      {
        id: 'job.view-all',
        label: 'View All Jobs',
        description: 'View all jobs across the organization, not only owned jobs.',
      },
      {
        id: 'job.publish',
        label: 'Publish/Unpublish Jobs',
        description: 'Change job visibility by publishing or unpublishing posts.',
      },
      {
        id: 'job.assign-users',
        label: 'Assign Users to Jobs',
        description: 'Assign recruiters and team members to job postings.',
      },
      {
        id: 'job.clone',
        label: 'Clone Jobs',
        description: 'Duplicate existing jobs as new requisitions.',
      },
    ],
  },
  {
    id: 'candidate',
    label: 'Candidate Management',
    permissions: [
      {
        id: 'candidate.add',
        label: 'Add Candidates',
        description: 'Create candidate records manually or via import.',
      },
      {
        id: 'candidate.view-full',
        label: 'View Full Candidate Profiles',
        description: 'Access complete candidate profiles including sensitive fields.',
      },
      {
        id: 'candidate.view-anon',
        label: 'View Anonymized Profiles',
        description: 'View candidate data with personally identifiable fields masked.',
      },
      {
        id: 'candidate.edit',
        label: 'Edit Candidate Info',
        description: 'Update candidate profile fields and attachments.',
      },
      {
        id: 'candidate.delete',
        label: 'Delete Candidates',
        description: 'Permanently delete candidates from the talent pool.',
      },
      {
        id: 'candidate.view-pii',
        label: 'View Candidate PII',
        description:
          'Access personally identifiable information such as email, phone, and address.',
      },
      {
        id: 'candidate.export',
        label: 'Export Candidate Data',
        description: 'Export candidate records to CSV or external systems.',
      },
    ],
  },
  {
    id: 'application',
    label: 'Application Management',
    permissions: [
      {
        id: 'application.view',
        label: 'View Applications',
        description: 'Browse job applications and pipeline status.',
      },
      {
        id: 'application.move',
        label: 'Move Pipeline Stages',
        description: 'Advance or move applications between pipeline stages.',
      },
      {
        id: 'application.shortlist',
        label: 'Shortlist/Reject',
        description: 'Shortlist candidates or reject applications.',
      },
      {
        id: 'application.schedule',
        label: 'Schedule Interviews',
        description: 'Schedule interviews from application records.',
      },
    ],
  },
  {
    id: 'interview',
    label: 'Interview Management',
    permissions: [
      {
        id: 'interview.panels',
        label: 'Create Interview Panels',
        description: 'Define interview panels and scorecard templates.',
      },
      {
        id: 'interview.assign',
        label: 'Assign Interviewers',
        description: 'Assign interviewers to scheduled interview sessions.',
      },
      {
        id: 'interview.conduct',
        label: 'Conduct Interviews',
        description: 'Participate in live or one-way interview sessions.',
      },
      {
        id: 'interview.submit-feedback',
        label: 'Submit Feedback',
        description: 'Submit interview scorecards and written feedback.',
      },
      {
        id: 'interview.view-all-feedback',
        label: 'View All Feedback',
        description: 'Read feedback submitted by any interviewer.',
      },
      {
        id: 'interview.edit-own-feedback',
        label: 'Edit Own Feedback',
        description: 'Edit scorecards and notes after own submission.',
      },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    permissions: [
      {
        id: 'comm.email',
        label: 'Email Candidates',
        description: 'Send outbound email messages to candidates.',
      },
      {
        id: 'comm.history',
        label: 'View Communication History',
        description: 'Review historical emails and messages with candidates.',
      },
      {
        id: 'comm.use-templates',
        label: 'Use Email Templates',
        description: 'Send messages using existing organization email templates.',
      },
      {
        id: 'comm.create-templates',
        label: 'Create Email Templates',
        description: 'Create and edit shared email templates.',
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & Reports',
    permissions: [
      {
        id: 'analytics.dashboards',
        label: 'View Dashboards',
        description: 'Open recruitment and hiring dashboards.',
      },
      {
        id: 'analytics.generate',
        label: 'Generate Reports',
        description: 'Run standard operational and compliance reports.',
      },
      {
        id: 'analytics.export',
        label: 'Export Reports',
        description: 'Download report outputs as files.',
      },
      {
        id: 'analytics.custom',
        label: 'Custom Report Builder',
        description: 'Build custom reports with filters and columns.',
      },
      {
        id: 'analytics.metrics',
        label: 'View Hiring Metrics',
        description: 'Access KPIs such as time-to-hire and pipeline conversion.',
      },
      {
        id: 'analytics.audit',
        label: 'Access Audit Logs',
        description: 'Review security and activity audit logs.',
      },
    ],
  },
  {
    id: 'ai',
    label: 'AI Features',
    permissions: [
      {
        id: 'ai.matching',
        label: 'AI Candidate Matching',
        description: 'Use AI recommendations to match candidates to jobs.',
      },
      {
        id: 'ai.parsing',
        label: 'AI Resume Parsing',
        description: 'Parse resumes automatically with AI extraction.',
      },
      {
        id: 'ai.interview-analysis',
        label: 'AI Interview Analysis',
        description: 'Run AI-assisted analysis of interview sessions.',
      },
      {
        id: 'ai.train',
        label: 'Train AI Models',
        description: 'Configure and train organization-specific AI models.',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings & Config',
    permissions: [
      {
        id: 'settings.platform',
        label: 'Platform Settings',
        description: 'Manage global platform administration settings.',
      },
      {
        id: 'settings.tenant',
        label: 'Tenant Settings',
        description: 'Manage tenant-scoped product configuration.',
      },
      {
        id: 'settings.workflow',
        label: 'Workflow Configuration',
        description: 'Configure hiring workflows, stages, and automations.',
      },
      {
        id: 'settings.integrations',
        label: 'Integration Management',
        description: 'Connect and manage third-party integrations.',
      },
    ],
  },
]

export const DEFAULT_ROLES: PlatformRole[] = [
  {
    id: 'role-super-admin',
    name: 'Super Admin (Licensed User)',
    locked: true,
  },
  { id: 'role-super-user', name: 'Super User', locked: true },
  { id: 'role-hr-admin', name: 'HR Admin' },
  { id: 'role-hiring-manager', name: 'Hiring Manager' },
  { id: 'role-primary-recruiter', name: 'Primary Recruiter' },
  { id: 'role-support-recruiter', name: 'Support Recruiter' },
  { id: 'role-interviewer', name: 'Interviewer' },
  { id: 'role-analyst', name: 'Read-Only Analyst' },
]

/** permissionId -> roleId -> granted */
export type RolePermissionMatrix = Record<string, Record<string, boolean>>

export function allPermissionIds(): string[] {
  return PERMISSION_CATEGORIES.flatMap((category) =>
    category.permissions.map((permission) => permission.id),
  )
}

function grantAll(roleId: string, matrix: RolePermissionMatrix) {
  for (const id of allPermissionIds()) {
    matrix[id] = matrix[id] ?? {}
    matrix[id][roleId] = true
  }
}

function grant(
  roleId: string,
  permissionIds: string[],
  matrix: RolePermissionMatrix,
) {
  for (const id of permissionIds) {
    matrix[id] = matrix[id] ?? {}
    matrix[id][roleId] = true
  }
}

/** Seed matrix matching design: Super Admin full; others selective. */
export function createDefaultRoleMatrix(): RolePermissionMatrix {
  const matrix: RolePermissionMatrix = {}
  for (const id of allPermissionIds()) {
    matrix[id] = {}
  }

  grantAll('role-super-admin', matrix)

  grant(
    'role-super-user',
    allPermissionIds().filter(
      (id) =>
        !id.startsWith('tenant.') &&
        id !== 'settings.platform' &&
        id !== 'ai.train',
    ),
    matrix,
  )

  grant(
    'role-hr-admin',
    [
      'user.create-delete',
      'user.assign-roles',
      'user.view-list',
      'user.manage-profile',
      'job.view-all',
      'candidate.view-full',
      'application.view',
      'analytics.dashboards',
      'analytics.generate',
      'settings.tenant',
    ],
    matrix,
  )

  grant(
    'role-hiring-manager',
    [
      'user.manage-profile',
      'job.create',
      'job.edit-all',
      'job.view-all',
      'job.publish',
      'job.assign-users',
      'job.clone',
      'candidate.add',
      'candidate.view-full',
      'candidate.edit',
      'application.view',
      'application.move',
      'application.shortlist',
      'application.schedule',
      'interview.assign',
      'interview.conduct',
      'interview.submit-feedback',
      'interview.view-all-feedback',
      'comm.email',
      'comm.use-templates',
      'analytics.dashboards',
      'analytics.metrics',
      'ai.matching',
      'ai.parsing',
    ],
    matrix,
  )

  grant(
    'role-primary-recruiter',
    [
      'user.manage-profile',
      'job.create',
      'job.view-all',
      'job.clone',
      'candidate.add',
      'candidate.view-full',
      'candidate.edit',
      'application.view',
      'application.move',
      'application.shortlist',
      'application.schedule',
      'interview.conduct',
      'interview.submit-feedback',
      'comm.email',
      'comm.history',
      'comm.use-templates',
      'ai.matching',
      'ai.parsing',
    ],
    matrix,
  )

  grant(
    'role-support-recruiter',
    [
      'user.manage-profile',
      'job.view-all',
      'candidate.add',
      'candidate.view-full',
      'application.view',
      'application.schedule',
      'comm.email',
      'comm.use-templates',
    ],
    matrix,
  )

  grant(
    'role-interviewer',
    [
      'user.manage-profile',
      'candidate.view-anon',
      'application.view',
      'interview.conduct',
      'interview.submit-feedback',
      'interview.edit-own-feedback',
    ],
    matrix,
  )

  grant(
    'role-analyst',
    [
      'user.manage-profile',
      'job.view-all',
      'candidate.view-anon',
      'application.view',
      'analytics.dashboards',
      'analytics.generate',
      'analytics.export',
      'analytics.metrics',
    ],
    matrix,
  )

  return matrix
}

export function copyRolePermissions(
  matrix: RolePermissionMatrix,
  fromRoleId: string,
  toRoleId: string,
): RolePermissionMatrix {
  const next: RolePermissionMatrix = {}
  for (const [permissionId, roles] of Object.entries(matrix)) {
    next[permissionId] = {
      ...roles,
      [toRoleId]: Boolean(roles[fromRoleId]),
    }
  }
  return next
}
