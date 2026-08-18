import { useMemo, useState } from 'react'
import {
  Download,
  Search,
  Send,
  Share2,
  SlidersHorizontal,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  countUserManagementFilters,
  emptyUserManagementFilters,
  formatUserStat,
  getPlatformUsers,
  PLATFORM_USER_STATUS_META,
  type PlatformUser,
  type PlatformUserStatus,
  type UserManagementFilters,
} from '../../data/users'
import {
  Button,
  DataTable,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTableRow,
  DataTableSortHeader,
  DataTableTd,
  ThreeDotsMenu,
  toast,
  type SortDirection,
} from '../ui'
import { SettingsPanel } from './SettingsPanel'
import { InviteUserPanel } from './InviteUserPanel'
import { ImportUserPanel } from './ImportUserPanel'
import { UserManagementFiltersPanel } from './UserManagementFiltersPanel'

type SortKey =
  | 'name'
  | 'email'
  | 'joinedDate'
  | 'role'
  | 'createdDate'
  | 'lastSeen'
  | 'status'

/**
 * Settings → User Management — stats, search/filter, table, invite side panel.
 */
export function UserManagementPanel() {
  const allUsers = useMemo(() => getPlatformUsers(), [])
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<UserManagementFilters>(
    emptyUserManagementFilters,
  )
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [importOpen, setImportOpen] = useState(false)
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDirection>('asc')

  // Stat cards match design mock (zero-padded display via formatUserStat)
  const stats = { total: 10, active: 8, inactive: 2, invited: 4 }
  const activeFilterCount = countUserManagementFilters(filters)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return allUsers.filter((user) => {
      if (filters.role && user.role !== filters.role) return false
      if (filters.status && user.status !== filters.status) return false
      if (filters.userType && user.userType !== filters.userType) return false
      if (!query) return true
      return (
        user.name.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    })
  }, [allUsers, filters, search])

  const sorted = useMemo(() => {
    if (!sortDir) return filtered
    const factor = sortDir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const aVal = getSortValue(a, sortKey)
      const bVal = getSortValue(b, sortKey)
      return aVal.localeCompare(bVal, undefined, { sensitivity: 'base' }) * factor
    })
  }, [filtered, sortDir, sortKey])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((current) =>
        current === 'asc' ? 'desc' : current === 'desc' ? null : 'asc',
      )
      return
    }
    setSortKey(key)
    setSortDir('asc')
  }

  function directionFor(key: SortKey): SortDirection {
    return sortKey === key ? sortDir : null
  }

  function handleDownload() {
    toast.success('User list download started.', { title: 'Download Users' })
  }

  function handleShare() {
    toast.success('Shareable user list link copied.', {
      title: 'Share User List',
    })
  }

  const statCards = [
    { label: 'Total Users', value: stats.total },
    { label: 'Active Users', value: stats.active },
    { label: 'Inactive Users', value: stats.inactive },
    { label: 'Invited', value: stats.invited },
  ]

  return (
    <>
      <SettingsPanel
        title="User Management"
        description="Manage Users and Access Control"
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setImportOpen(true)}
              className="!h-10 !rounded-md border-[#2D2061] bg-white px-4 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
            >
              Import User
            </Button>
            <Button
              type="button"
              onClick={() => setInviteOpen(true)}
              className="!h-10 !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Invite User
            </Button>
          </>
        }
      >
        {/* Summary stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-between gap-3 rounded-lg bg-[#F7F7F9] px-4 py-3.5"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.05em] text-[#626889]">
                {stat.label}
              </p>
              <p className="text-[1.5rem] font-bold leading-none tabular-nums text-[#2D2061]">
                {formatUserStat(stat.value)}
              </p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
              strokeWidth={2}
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by User Name, Role"
              className="h-11 w-full rounded-md border border-[#ddd9e8] bg-white py-2 pl-10 pr-11 text-sm text-[#2D2061] outline-none transition-colors placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
              aria-label="Search by user name or role"
            />
            <button
              type="button"
              className="absolute right-2.5 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-[#2D2061] transition-colors hover:bg-[#F2F1F6]"
              aria-label="Submit search"
              onClick={() => undefined}
            >
              <Send className="size-3.5" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className={cn(
              'relative inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-[#ddd9e8] bg-white px-4',
              'text-sm font-semibold text-[#2D2061] transition-colors hover:bg-[#f7f6fb]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/25',
            )}
          >
            <SlidersHorizontal
              className="size-4 shrink-0"
              strokeWidth={2}
              aria-hidden="true"
            />
            Filter
            {activeFilterCount > 0 ? (
              <span className="ml-0.5 inline-flex size-5 items-center justify-center rounded-full bg-[#2D2061] text-[10px] font-bold leading-none text-white">
                {activeFilterCount}
              </span>
            ) : null}
          </button>
        </div>

        {/* Secondary actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#E0DDEA] bg-white px-3.5 text-sm font-semibold text-[#2D2061] transition-colors hover:bg-[#F7F6FA]"
          >
            <Download className="size-4" strokeWidth={2} aria-hidden="true" />
            Download Users
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-[#E0DDEA] bg-white px-3.5 text-sm font-semibold text-[#2D2061] transition-colors hover:bg-[#F7F6FA]"
          >
            <Share2 className="size-4" strokeWidth={2} aria-hidden="true" />
            Share User List
          </button>
        </div>

        {/* Users table */}
        <DataTable minWidthClassName="min-w-[64rem]" className="border-0">
          <DataTableHead>
            <DataTableSortHeader
              label="Name"
              direction={directionFor('name')}
              onSort={() => toggleSort('name')}
            />
            <DataTableSortHeader
              label="Email Address"
              direction={directionFor('email')}
              onSort={() => toggleSort('email')}
            />
            <DataTableSortHeader
              label="Joined Date"
              direction={directionFor('joinedDate')}
              onSort={() => toggleSort('joinedDate')}
            />
            <DataTableSortHeader
              label="Role"
              direction={directionFor('role')}
              onSort={() => toggleSort('role')}
            />
            <DataTableSortHeader
              label="Created Date"
              direction={directionFor('createdDate')}
              onSort={() => toggleSort('createdDate')}
            />
            <DataTableSortHeader
              label="Last Seen"
              direction={directionFor('lastSeen')}
              onSort={() => toggleSort('lastSeen')}
            />
            <DataTableSortHeader
              label="Status"
              direction={directionFor('status')}
              onSort={() => toggleSort('status')}
            />
            <th className="w-12 px-2 pb-3 pt-1" aria-label="Actions" />
          </DataTableHead>
          <DataTableBody>
            {sorted.length === 0 ? (
              <DataTableEmpty colSpan={8}>
                No users match your filters.
              </DataTableEmpty>
            ) : (
              sorted.map((user) => (
                <DataTableRow
                  key={user.id}
                  className="border-b border-[#F0EEF5] last:border-b-0"
                >
                  <DataTableTd strong>{user.name}</DataTableTd>
                  <DataTableTd muted>{user.email}</DataTableTd>
                  <DataTableTd muted>{user.joinedDate}</DataTableTd>
                  <DataTableTd muted>{user.role}</DataTableTd>
                  <DataTableTd muted>{user.createdDate}</DataTableTd>
                  <DataTableTd muted>{user.lastSeen}</DataTableTd>
                  <DataTableTd>
                    <UserStatusPill status={user.status} />
                  </DataTableTd>
                  <DataTableTd className="px-2">
                    <ThreeDotsMenu
                      triggerLabel={`More actions for ${user.name}`}
                      side="left"
                      items={userRowMenuItems(user)}
                    />
                  </DataTableTd>
                </DataTableRow>
              ))
            )}
          </DataTableBody>
        </DataTable>
      </SettingsPanel>

      <UserManagementFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        onApply={setFilters}
      />

      <InviteUserPanel
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />

      <ImportUserPanel
        open={importOpen}
        onClose={() => setImportOpen(false)}
      />
    </>
  )
}

function UserStatusPill({ status }: { status: PlatformUserStatus }) {
  const meta = PLATFORM_USER_STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold',
        meta.className,
      )}
    >
      {meta.label}
    </span>
  )
}

function getSortValue(user: PlatformUser, key: SortKey): string {
  switch (key) {
    case 'name':
      return user.name
    case 'email':
      return user.email
    case 'joinedDate':
      return user.joinedDate
    case 'role':
      return user.role
    case 'createdDate':
      return user.createdDate
    case 'lastSeen':
      return user.lastSeen
    case 'status':
      return user.status
    default: {
      const _exhaustive: never = key
      return _exhaustive
    }
  }
}

function userRowMenuItems(user: PlatformUser) {
  return [
    {
      id: 'view-edit',
      label: 'View/Edit User',
      onSelect: () =>
        toast.success(`Opening view/edit for ${user.name}.`, {
          title: 'View/Edit User',
        }),
    },
    {
      id: 'history',
      label: 'Modified User History',
      onSelect: () =>
        toast.success(`Loading modification history for ${user.name}.`, {
          title: 'Modified User History',
        }),
    },
  ]
}
