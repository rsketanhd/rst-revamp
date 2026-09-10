import { useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, RefreshCw } from 'lucide-react'
import {
  getMyProfile,
  getProfileDesignation,
  getProfileDisplayName,
  getProfileInitials,
} from '../../data/myProfile'
import { cn } from '../../lib/cn'
import {
  DEFAULT_NOTIFICATIONS,
  NotificationsPanel,
  type AppNotification,
} from './NotificationsPanel'
import { ProfileMenu, type ProfileMenuItemId, type ProfileMenuProps } from './ProfileMenu'
import { getUserRole, setAuthenticated } from '../../lib/auth'

export type AppTopBarProps = {
  /** ISO or display string, e.g. `"08/14/2023 9:23 PM"` */
  lastSyncLabel?: string
  /** Profile initials shown in the avatar */
  profileInitials?: string
  profileAriaLabel?: string
  onSync?: () => void | Promise<void>
  onNotificationsClick?: () => void
  onProfileClick?: () => void
  /** Controlled syncing indicator (icon spins when true) */
  syncing?: boolean
  className?: string
  /** Whether to show the red notification dot (defaults from unread items) */
  hasNotifications?: boolean
  /** Initial / controlled notification list for the dropdown */
  notifications?: AppNotification[]
  /** When set, used instead of the built-in profile navigation. */
  onItemSelect?: (id: string) => void
  profileMenuItems?: ProfileMenuProps['items']
}

/**
 * Shared app header: Last Sync action + notifications + profile.
 * Background always `#F5F5F5` for consistency across pages.
 */
export function AppTopBar({
  lastSyncLabel = '08/14/2023 9:23 PM',
  profileInitials = 'KS',
  profileAriaLabel = 'User profile',
  onSync,
  onNotificationsClick,
  onProfileClick,
  syncing: syncingProp,
  className,
  hasNotifications,
  notifications: notificationsProp,
  onItemSelect,
  profileMenuItems,
}: AppTopBarProps) {
  const navigate = useNavigate()
  const [internalSyncing, setInternalSyncing] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState<AppNotification[]>(
    () => notificationsProp ?? DEFAULT_NOTIFICATIONS,
  )
  const bellRef = useRef<HTMLButtonElement>(null)
  const profileRef = useRef<HTMLButtonElement>(null)
  const syncing = syncingProp ?? internalSyncing
  const userRole = getUserRole()
  const candidateSummary = useMemo(() => {
    if (userRole !== 'candidate') return undefined

    const profile = getMyProfile()
    return {
      name: getProfileDisplayName(profile),
      designation: getProfileDesignation(profile),
      initials: getProfileInitials(profile),
    }
  }, [userRole, profileOpen])

  const topBarInitials =
    userRole === 'candidate'
      ? candidateSummary?.initials ?? profileInitials
      : profileInitials

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  )
  const showDot = hasNotifications ?? unreadCount > 0

  async function handleSync() {
    if (!onSync) {
      setInternalSyncing(true)
      await new Promise((resolve) => window.setTimeout(resolve, 600))
      setInternalSyncing(false)
      return
    }
    setInternalSyncing(true)
    try {
      await onSync()
    } finally {
      setInternalSyncing(false)
    }
  }

  function handleBellClick() {
    setProfileOpen(false)
    setPanelOpen((open) => !open)
    onNotificationsClick?.()
  }

  function handleProfileClick() {
    setPanelOpen(false)
    setProfileOpen((open) => !open)
    onProfileClick?.()
  }

  function handleProfileItem(id: string) {
    if (onItemSelect) {
      onItemSelect(id)
      return
    }

    const role = getUserRole()

    switch (id as ProfileMenuItemId) {
      case 'myProfile':
        navigate(role === 'candidate' ? '/my-profile' : '/settings/recruiter-profile')
        return
      case 'changePassword':
        navigate(
          role === 'candidate'
            ? '/settings/account-settings'
            : '/settings/recruiter-profile',
        )
        return
      case 'settings':
        navigate(
          role === 'candidate'
            ? '/settings/account-settings'
            : '/settings/recruiter-profile',
        )
        return
      case 'logout':
        setAuthenticated(false)
        navigate('/login', { replace: true })
        return
      default:
        return
    }
  }

  return (
    <div
      className={cn(
        'flex h-shell-header shrink-0 items-center justify-between gap-2 border-b border-[#ececf1] bg-[#F5F5F5] px-3 sm:gap-3 sm:px-5 lg:px-8',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => {
          void handleSync()
        }}
        className="inline-flex min-w-0 items-center gap-1.5 text-xs text-[#6B6B80] transition-colors hover:text-[#2D2061] sm:gap-2 sm:text-sm"
      >
        <RefreshCw
          className={cn(
            'size-4 shrink-0 text-[#6B6B80]',
            syncing && 'animate-spin',
          )}
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <span className="truncate">
          <span className="hidden sm:inline">Last Sync : </span>
          <span className="font-medium text-[#4A4A60]">{lastSyncLabel}</span>
        </span>
      </button>

      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        <button
          ref={bellRef}
          type="button"
          aria-label="Notifications"
          aria-expanded={panelOpen}
          aria-haspopup="dialog"
          onClick={handleBellClick}
          className="relative inline-flex size-8 items-center justify-center rounded-full text-[#6B6B80] transition-colors hover:bg-black/5 hover:text-[#2D2061]"
        >
          <Bell className="size-[1.125rem]" strokeWidth={1.75} />
          {showDot ? (
            <span className="absolute right-1 top-1 size-1.5 rounded-full bg-[#E53935] ring-2 ring-[#F5F5F5]" />
          ) : null}
        </button>

        <NotificationsPanel
          open={panelOpen}
          onClose={() => setPanelOpen(false)}
          anchorRef={bellRef}
          notifications={notifications}
          onNotificationsChange={setNotifications}
        />

        <button
          ref={profileRef}
          type="button"
          aria-label={profileAriaLabel}
          aria-expanded={profileOpen}
          aria-haspopup="menu"
          onClick={handleProfileClick}
          className="size-7 overflow-hidden rounded-full bg-[#C9C4DE] shadow-[0_0_0_1px_rgba(45,32,97,0.08)] transition-opacity hover:opacity-90"
        >
          <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[#2D2061]">
            {topBarInitials}
          </span>
        </button>

        <ProfileMenu
          open={profileOpen}
          onClose={() => setProfileOpen(false)}
          anchorRef={profileRef}
          items={profileMenuItems}
          onItemSelect={userRole === 'candidate' && !onItemSelect ? undefined : handleProfileItem}
          onViewProfile={
            userRole === 'candidate' && !onItemSelect
              ? () => navigate('/my-profile')
              : undefined
          }
          candidateSummary={onItemSelect ? undefined : candidateSummary}
        />
      </div>
    </div>
  )
}
