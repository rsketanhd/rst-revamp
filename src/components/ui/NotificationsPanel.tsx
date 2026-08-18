import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { Bell, MoreVertical } from 'lucide-react'
import { cn } from '../../lib/cn'

export type AppNotification = {
  id: string
  /** Rendered notification body (use <strong> for emphasis) */
  message: ReactNode
  timeLabel: string
  read: boolean
}

export type NotificationsPanelProps = {
  open: boolean
  onClose: () => void
  anchorRef: RefObject<HTMLElement | null>
  notifications: AppNotification[]
  onNotificationsChange: (next: AppNotification[]) => void
  className?: string
}

type Coords = { top: number; left: number }

const PANEL_GAP = 8
const VIEWPORT_PAD = 8
const HEADER_BG = '#4A4E7B'

/**
 * Top-bar notifications dropdown — list + empty states match product design.
 */
export function NotificationsPanel({
  open,
  onClose,
  anchorRef,
  notifications,
  onNotificationsChange,
  className,
}: NotificationsPanelProps) {
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState<Coords | null>(null)
  const [onlyUnread, setOnlyUnread] = useState(false)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  const visible = onlyUnread
    ? notifications.filter((n) => !n.read)
    : notifications
  const isEmpty = notifications.length === 0

  function updatePosition() {
    const anchor = anchorRef.current
    const panel = panelRef.current
    if (!anchor || !panel) return

    const rect = anchor.getBoundingClientRect()
    const panelW = panel.offsetWidth || 360
    const panelH = panel.offsetHeight || 320

    let left = rect.right - panelW
    left = Math.min(
      Math.max(VIEWPORT_PAD, left),
      window.innerWidth - panelW - VIEWPORT_PAD,
    )

    let top = rect.bottom + PANEL_GAP
    if (top + panelH > window.innerHeight - VIEWPORT_PAD) {
      top = Math.max(VIEWPORT_PAD, rect.top - panelH - PANEL_GAP)
    }

    setCoords({ top, left })
  }

  useLayoutEffect(() => {
    if (!open) {
      setCoords(null)
      setMenuOpenId(null)
      return
    }
    updatePosition()
    const onReposition = () => updatePosition()
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open, onlyUnread, notifications.length, visible.length, isEmpty])

  useEffect(() => {
    if (!open) return

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }

    function onPointer(e: MouseEvent) {
      const target = e.target as Node
      if (panelRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return
      onClose()
    }

    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onPointer)
    }
  }, [open, onClose, anchorRef])

  function markAllRead() {
    onNotificationsChange(notifications.map((n) => ({ ...n, read: true })))
  }

  function markRead(id: string, read: boolean) {
    onNotificationsChange(
      notifications.map((n) => (n.id === id ? { ...n, read } : n)),
    )
    setMenuOpenId(null)
  }

  function removeNotification(id: string) {
    onNotificationsChange(notifications.filter((n) => n.id !== id))
    setMenuOpenId(null)
  }

  if (!open) return null

  return createPortal(
    <div
      ref={panelRef}
      id={panelId}
      role="dialog"
      aria-label="Notifications"
      className={cn(
        'fixed z-[120] flex w-[min(22.5rem,calc(100vw-1rem))] flex-col overflow-hidden rounded-lg border border-[#E0E0E8] bg-white shadow-[0_8px_28px_rgba(40,40,70,0.18)]',
        isEmpty ? 'min-h-[16rem]' : 'max-h-[min(28rem,calc(100vh-2rem))]',
        className,
      )}
      style={{
        top: coords?.top ?? -9999,
        left: coords?.left ?? -9999,
        visibility: coords ? 'visible' : 'hidden',
      }}
    >
      {/* Header */}
      <header
        className={cn(
          'flex shrink-0 items-center gap-3 px-3.5 py-2.5 text-white',
          isEmpty ? 'justify-start' : 'justify-between',
        )}
        style={{ backgroundColor: HEADER_BG }}
      >
        <h2 className="text-sm font-bold tracking-tight">Notifications</h2>
        {!isEmpty ? (
          <div className="flex min-w-0 items-center gap-2.5">
            <button
              type="button"
              onClick={markAllRead}
              className="shrink-0 text-xs text-white/95 underline-offset-2 hover:underline"
            >
              Mark all as read
            </button>
            <label
              className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-2 py-1"
              style={{ backgroundColor: 'rgba(255,255,255,0.14)' }}
            >
              <input
                type="checkbox"
                checked={onlyUnread}
                onChange={(e) => setOnlyUnread(e.target.checked)}
                className="size-3.5 shrink-0 rounded border border-white/80 bg-transparent accent-white"
                aria-label="Only show unread"
              />
              <span className="text-[11px] font-medium leading-none text-white">
                Only show unread
              </span>
            </label>
          </div>
        ) : null}
      </header>

      {isEmpty ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <span
            className="mb-4 inline-flex size-14 items-center justify-center rounded-full bg-[#E8EAF2]"
            aria-hidden="true"
          >
            <Bell className="size-6 text-[#4A4E7B]" strokeWidth={1.5} />
          </span>
          <p className="text-base font-bold text-[#2A2A38]">No Notification!</p>
          <p className="mt-1.5 max-w-[14rem] text-sm leading-snug text-[#8B8B9E]">
            Notifications about your activity will show up here!
          </p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto">
          {visible.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[#8B8B9E]">
              No unread notifications.
            </p>
          ) : (
            <ul className="divide-y divide-[#EEEDF3]">
              {visible.map((item) => (
                <li
                  key={item.id}
                  className={cn(
                    'relative flex items-start gap-2 px-3.5 py-3.5',
                    !item.read && 'bg-[#EEF0F9]',
                  )}
                >
                  {!item.read ? (
                    <span
                      className="absolute left-1.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full bg-[#4A4E7B]"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className={cn('min-w-0 flex-1', !item.read && 'pl-1.5')}>
                    <p className="text-sm leading-snug text-[#2A2A38] [&_strong]:font-bold [&_strong]:text-[#1E1E2C]">
                      {item.message}
                    </p>
                    <p className="mt-1 text-xs text-[#9B9BAA]">{item.timeLabel}</p>
                  </div>
                  <div className="relative shrink-0">
                    <button
                      type="button"
                      aria-label="Notification options"
                      aria-expanded={menuOpenId === item.id}
                      onClick={() =>
                        setMenuOpenId((id) =>
                          id === item.id ? null : item.id,
                        )
                      }
                      className="inline-flex size-7 items-center justify-center rounded-md text-[#A0A0B2] hover:bg-black/5 hover:text-[#2D2061]"
                    >
                      <MoreVertical className="size-4" strokeWidth={1.75} />
                    </button>
                    {menuOpenId === item.id ? (
                      <div
                        role="menu"
                        className="absolute right-0 top-full z-10 mt-0.5 min-w-[9rem] overflow-hidden rounded-md border border-[#E4E1EE] bg-white py-1 shadow-md"
                      >
                        <button
                          type="button"
                          role="menuitem"
                          className="block w-full px-3 py-1.5 text-left text-xs font-medium text-[#2D2061] hover:bg-[#F5F5F8]"
                          onClick={() => markRead(item.id, !item.read)}
                        >
                          {item.read ? 'Mark as unread' : 'Mark as read'}
                        </button>
                        <button
                          type="button"
                          role="menuitem"
                          className="block w-full px-3 py-1.5 text-left text-xs font-medium text-[#C23B4A] hover:bg-[#FDF2F3]"
                          onClick={() => removeNotification(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <p className="border-t border-[#EEEDF3] px-4 py-3 text-center text-xs text-[#A8A8B8]">
            No more notifications to show.
          </p>
        </div>
      )}
    </div>,
    document.body,
  )
}

/** Default sample notifications matching product design copy. */
export const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    message: (
      <>
        <strong>Sarah Johnson</strong> accepted the offer for{' '}
        <strong>SAI1213-Product Designer role</strong>
      </>
    ),
    timeLabel: '5 minutes ago',
    read: true,
  },
  {
    id: 'n2',
    message: (
      <>
        <strong>Weekly recruitment report</strong> is now available
      </>
    ),
    timeLabel: 'Yesterday',
    read: true,
  },
  {
    id: 'n3',
    message: (
      <>
        Interview scheduled with <strong>Jane Smith</strong> for tomorrow at{' '}
        <strong>2:00 PM</strong>
      </>
    ),
    timeLabel: 'Yesterday',
    read: false,
  },
  {
    id: 'n4',
    message: (
      <>
        <strong>John Mathew</strong> accepted the offer for{' '}
        <strong>SAI1214-Data Scientists role</strong>
      </>
    ),
    timeLabel: '3 days ago',
    read: true,
  },
]
