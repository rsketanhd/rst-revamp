/**
 * Platform users for Settings → User Management.
 */

export type PlatformUserStatus = 'active' | 'inactive' | 'invited'

export type PlatformUser = {
  id: string
  name: string
  email: string
  joinedDate: string
  role: string
  createdDate: string
  lastSeen: string
  status: PlatformUserStatus
  userType: string
}

export const PLATFORM_USER_STATUS_META: Record<
  PlatformUserStatus,
  { label: string; className: string }
> = {
  active: {
    label: 'Active',
    className: 'bg-[#E8F8E8] text-[#2F9E44]',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-[#F0F0F3] text-[#6B6B80]',
  },
  invited: {
    label: 'Invited',
    className: 'bg-[#E8F1FF] text-[#2B6DE5]',
  },
}

export const PLATFORM_USER_ROLE_OPTIONS = [
  'Admin',
  'Hiring Manager',
  'Recruiter',
  'Viewer',
]

export const PLATFORM_USER_TYPE_OPTIONS = [
  'Internal',
  'External',
  'Agency',
]

export const PLATFORM_USER_STATUS_OPTIONS: PlatformUserStatus[] = [
  'active',
  'inactive',
  'invited',
]

const USERS: PlatformUser[] = [
  {
    id: 'u-1',
    name: 'Michael Anderson',
    email: 'michael.anderson@gmail.com',
    joinedDate: '12 Jan 2025',
    role: 'Admin',
    createdDate: '10 Jan 2025',
    lastSeen: '18 Nov 2025',
    status: 'active',
    userType: 'Internal',
  },
  {
    id: 'u-2',
    name: 'Christopher Wright',
    email: 'c.wright@talentco.com',
    joinedDate: '04 Feb 2025',
    role: 'Hiring Manager',
    createdDate: '02 Feb 2025',
    lastSeen: '18 Nov 2025',
    status: 'active',
    userType: 'Internal',
  },
  {
    id: 'u-3',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.io',
    joinedDate: '—',
    role: 'Hiring Manager',
    createdDate: '05 Nov 2025',
    lastSeen: 'Invited 30 minutes ago',
    status: 'invited',
    userType: 'External',
  },
  {
    id: 'u-4',
    name: 'David Clark',
    email: 'david.clark@outlook.com',
    joinedDate: '22 Mar 2024',
    role: 'Admin',
    createdDate: '20 Mar 2024',
    lastSeen: '02 Oct 2025',
    status: 'inactive',
    userType: 'Internal',
  },
  {
    id: 'u-5',
    name: 'Emily Parker',
    email: 'emily.parker@rst.io',
    joinedDate: '15 Apr 2025',
    role: 'Recruiter',
    createdDate: '14 Apr 2025',
    lastSeen: '17 Nov 2025',
    status: 'active',
    userType: 'Internal',
  },
  {
    id: 'u-6',
    name: 'James Roberts',
    email: 'james.r@agency.co',
    joinedDate: '—',
    role: 'Recruiter',
    createdDate: '01 Nov 2025',
    lastSeen: 'Invited 2 hours ago',
    status: 'invited',
    userType: 'Agency',
  },
  {
    id: 'u-7',
    name: 'Olivia Martinez',
    email: 'olivia.m@talentco.com',
    joinedDate: '08 Jun 2025',
    role: 'Viewer',
    createdDate: '07 Jun 2025',
    lastSeen: '16 Nov 2025',
    status: 'active',
    userType: 'Internal',
  },
  {
    id: 'u-8',
    name: 'Daniel Thompson',
    email: 'd.thompson@company.io',
    joinedDate: '19 Jul 2025',
    role: 'Hiring Manager',
    createdDate: '18 Jul 2025',
    lastSeen: '15 Nov 2025',
    status: 'active',
    userType: 'External',
  },
  {
    id: 'u-9',
    name: 'Jessica Lee',
    email: 'jessica.lee@gmail.com',
    joinedDate: '—',
    role: 'Viewer',
    createdDate: '28 Oct 2025',
    lastSeen: 'Invited 1 day ago',
    status: 'invited',
    userType: 'External',
  },
  {
    id: 'u-10',
    name: 'Robert Kim',
    email: 'robert.kim@rst.io',
    joinedDate: '03 Sep 2024',
    role: 'Recruiter',
    createdDate: '01 Sep 2024',
    lastSeen: '12 Sep 2025',
    status: 'inactive',
    userType: 'Internal',
  },
]

export type PlatformUserStats = {
  total: number
  active: number
  inactive: number
  invited: number
}

export function getPlatformUsers(): PlatformUser[] {
  return USERS.map((user) => ({ ...user }))
}

export function computePlatformUserStats(
  users: PlatformUser[],
): PlatformUserStats {
  return {
    total: users.length,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    invited: users.filter((u) => u.status === 'invited').length,
  }
}

/** Zero-padded display matching design (e.g. `08`). */
export function formatUserStat(value: number): string {
  return String(value).padStart(2, '0')
}

export type UserManagementFilters = {
  role: string
  status: string
  userType: string
}

export const emptyUserManagementFilters: UserManagementFilters = {
  role: '',
  status: '',
  userType: '',
}

export function countUserManagementFilters(
  filters: UserManagementFilters,
): number {
  return [filters.role, filters.status, filters.userType].filter(Boolean)
    .length
}
