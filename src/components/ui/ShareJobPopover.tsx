import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'

export type ShareChannelId =
  | 'email'
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'whatsapp'

export type ShareJobPopoverProps = {
  open: boolean
  onClose: () => void
  /** Element to anchor the share bar against (typically the job ⋮ control). */
  anchorRef: RefObject<HTMLElement | null>
  jobCode: string
  jobTitle: string
  /** Shareable URL; defaults to current origin + job path */
  shareUrl?: string
  className?: string
  onShare?: (channel: ShareChannelId) => void
}

type Coords = { top: number; left: number; caretTop: number }

const PANEL_GAP = 10
const VIEWPORT_PAD = 8

const CHANNELS: Array<{
  id: ShareChannelId
  label: string
}> = [
  { id: 'email', label: 'Email' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'twitter', label: 'Twitter' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'whatsapp', label: 'WhatsApp' },
]

/**
 * Share Job overlay — horizontal brand icons with caret on the right
 * (points toward the ⋮ / Share trigger), matching product design.
 */
export function ShareJobPopover({
  open,
  onClose,
  anchorRef,
  jobCode,
  jobTitle,
  shareUrl,
  className,
  onShare,
}: ShareJobPopoverProps) {
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState<Coords | null>(null)

  const resolvedUrl =
    shareUrl ??
    (typeof window !== 'undefined'
      ? `${window.location.origin}/jobs/${jobCode}`
      : `/jobs/${jobCode}`)

  const shareText = `${jobTitle} (${jobCode})`

  function updatePosition() {
    const anchor = anchorRef.current
    const panel = panelRef.current
    if (!anchor || !panel) return

    const rect = anchor.getBoundingClientRect()
    const panelW = panel.offsetWidth || panel.getBoundingClientRect().width
    const panelH = panel.offsetHeight || panel.getBoundingClientRect().height

    // Prefer left of the trigger (caret on right edge pointing toward ⋮)
    let left = rect.left - panelW - PANEL_GAP
    if (left < VIEWPORT_PAD) {
      left = rect.right + PANEL_GAP
    }
    left = Math.min(
      Math.max(VIEWPORT_PAD, left),
      window.innerWidth - panelW - VIEWPORT_PAD,
    )

    let top = rect.top + rect.height / 2 - panelH / 2
    top = Math.min(
      Math.max(VIEWPORT_PAD, top),
      window.innerHeight - panelH - VIEWPORT_PAD,
    )

    const caretTop = Math.min(
      Math.max(14, rect.top + rect.height / 2 - top),
      panelH - 14,
    )

    setCoords({ top, left, caretTop })
  }

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
    const id = window.requestAnimationFrame(updatePosition)
    return () => window.cancelAnimationFrame(id)
  }, [open, jobCode])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return
      onClose()
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    function handleReposition() {
      updatePosition()
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [open, onClose, anchorRef])

  function openChannel(id: ShareChannelId) {
    const encodedUrl = encodeURIComponent(resolvedUrl)
    const encodedText = encodeURIComponent(shareText)

    const urls: Record<ShareChannelId, string> = {
      email: `mailto:?subject=${encodedText}&body=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${resolvedUrl}`)}`,
    }

    onShare?.(id)
    window.open(urls[id], '_blank', 'noopener,noreferrer')
    onClose()
  }

  if (!open || typeof document === 'undefined') return null

  const caretOnRight =
    !coords ||
    (anchorRef.current
      ? coords.left + (panelRef.current?.offsetWidth ?? 0) <=
        anchorRef.current.getBoundingClientRect().left + 4
      : true)

  return createPortal(
    <div
      ref={panelRef}
      id={panelId}
      role="menu"
      aria-label={`Share ${jobTitle}`}
      style={
        coords
          ? { top: coords.top, left: coords.left }
          : { top: -9999, left: -9999, visibility: 'hidden' as const }
      }
      className={cn(
        'fixed z-[110] flex items-center gap-4 rounded-md border border-[#BDBDBD] bg-white px-4 py-3',
        'shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_2px_6px_rgba(0,0,0,0.14)]',
        className,
      )}
    >
      {CHANNELS.map((channel) => (
        <button
          key={channel.id}
          type="button"
          role="menuitem"
          aria-label={`Share via ${channel.label}`}
          onClick={() => openChannel(channel.id)}
          className="inline-flex size-8 shrink-0 items-center justify-center outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#2D2061]/30"
        >
          <ShareChannelIcon channel={channel.id} />
        </button>
      ))}

      {/* Caret on the side facing the ⋮ (design: right edge →) */}
      {coords ? (
        caretOnRight ? (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-full top-0 -ml-px size-0 -translate-y-1/2 border-y-[8px] border-l-[9px] border-y-transparent border-l-[#BDBDBD]"
              style={{ top: coords.caretTop }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-full top-0 size-0 -translate-y-1/2 border-y-[7px] border-l-[8px] border-y-transparent border-l-white"
              style={{ top: coords.caretTop }}
            />
          </>
        ) : (
          <>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-full top-0 -mr-px size-0 -translate-y-1/2 border-y-[8px] border-r-[9px] border-y-transparent border-r-[#BDBDBD]"
              style={{ top: coords.caretTop }}
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute right-full top-0 size-0 -translate-y-1/2 border-y-[7px] border-r-[8px] border-y-transparent border-r-white"
              style={{ top: coords.caretTop }}
            />
          </>
        )
      ) : null}
    </div>,
    document.body,
  )
}

function ShareChannelIcon({ channel }: { channel: ShareChannelId }) {
  switch (channel) {
    case 'email':
      return (
        <svg
          viewBox="0 0 32 32"
          className="size-7"
          aria-hidden="true"
          focusable="false"
        >
          <rect width="32" height="32" rx="4" fill="#5B6B7A" />
          <path
            d="M6 10.5h20v12H6z"
            fill="none"
            stroke="#fff"
            strokeWidth="1.6"
          />
          <path
            d="M6.5 11.2 16 18.2l9.5-7"
            fill="none"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'facebook':
      return (
        <svg
          viewBox="0 0 32 32"
          className="size-7"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="16" cy="16" r="16" fill="#1877F2" />
          <path
            d="M17.8 25v-8.1h2.7l.4-3.2h-3.1v-2c0-.9.3-1.6 1.6-1.6h1.7V7.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4h-2.8v3.2h2.8V25h3.4z"
            fill="#fff"
          />
        </svg>
      )
    case 'twitter':
      return (
        <svg
          viewBox="0 0 32 32"
          className="size-7"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#1DA1F2"
            d="M28.5 9.2c-.8.4-1.7.6-2.6.7a4.4 4.4 0 0 0 2-2.4 8.9 8.9 0 0 1-2.8 1.1 4.4 4.4 0 0 0-7.6 3 4.6 4.6 0 0 0 .1 1A12.5 12.5 0 0 1 8 8.2a4.4 4.4 0 0 0 1.4 5.9 4.3 4.3 0 0 1-2-.5v.1c0 2.1 1.5 3.9 3.5 4.3a4.4 4.4 0 0 1-2 .1 4.5 4.5 0 0 0 4.1 3.1A8.9 8.9 0 0 1 6 22.6a12.5 12.5 0 0 0 6.8 2c8.1 0 12.6-6.8 12.6-12.6v-.6c.9-.6 1.6-1.4 2.1-2.2z"
          />
        </svg>
      )
    case 'linkedin':
      return (
        <svg
          viewBox="0 0 32 32"
          className="size-7"
          aria-hidden="true"
          focusable="false"
        >
          <rect width="32" height="32" rx="4" fill="#0A66C2" />
          <path
            fill="#fff"
            d="M9.4 12.9H6.2V25h3.2V12.9zM7.8 7a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM25.8 18.1c0-3.5-1.9-5.2-4.4-5.2-2 0-2.9 1.1-3.4 1.9v-1.6h-3.1c0 .8 0 12 0 12h3.1v-6.7c0-.4 0-.7.1-1 .3-.7.9-1.5 2-1.5 1.4 0 2 1.1 2 2.6V25h3.2v-6.9z"
          />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg
          viewBox="0 0 32 32"
          className="size-7"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="#25D366"
            d="M16.1 4C9.6 4 4.3 9.3 4.3 15.8c0 2.1.5 4 1.5 5.7L4 28l6.7-1.7c1.6.9 3.5 1.4 5.4 1.4 6.5 0 11.8-5.3 11.8-11.8S22.6 4 16.1 4z"
          />
          <path
            fill="#fff"
            d="M21.7 18.6c-.3-.1-1.6-.8-1.8-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 1 .4 1.8.7 2.5.9 1 .3 1.9.3 2.6.2.8-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3 0-.1-.2-.2-.5-.3z"
          />
        </svg>
      )
    default: {
      const _exhaustive: never = channel
      return _exhaustive
    }
  }
}
