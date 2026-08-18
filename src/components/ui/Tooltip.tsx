import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'

export type TooltipProps = {
  /** Hover / focus label */
  content: string
  children: ReactNode
  /** Preferred placement of the tooltip relative to the trigger */
  side?: 'top' | 'bottom'
  /**
   * Horizontal alignment of the bubble relative to the trigger.
   * `start` prefers opening to the right of the trigger.
   */
  align?: 'center' | 'start' | 'end'
  className?: string
  /** Extra classes on the tooltip bubble */
  contentClassName?: string
  /**
   * Preferred max width in px (used for multi-line tooltips).
   * Bubble is also limited by viewport so nothing is clipped on the right.
   */
  maxWidth?: number
}

type Point = { top: number; left: number; width: number }

/**
 * Hover/focus tooltip. Renders in a portal so it is not clipped by
 * overflow containers or covered by side navigation.
 */
export function Tooltip({
  content,
  children,
  side = 'top',
  align = 'center',
  className,
  contentClassName,
  maxWidth,
}: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null)
  const bubbleRef = useRef<HTMLSpanElement>(null)
  const tooltipId = useId()
  const [open, setOpen] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [point, setPoint] = useState<Point>({ top: 0, left: 0, width: 0 })

  useLayoutEffect(() => {
    if (!open) {
      setPlaced(false)
      return
    }

    function updatePosition() {
      const trigger = triggerRef.current
      const bubble = bubbleRef.current
      if (!trigger || !bubble) return

      const rect = trigger.getBoundingClientRect()
      const gap = 8
      const pad = 16
      const viewportW = window.innerWidth
      const viewportH = window.innerHeight

      // Cap width to available viewport so the full bubble always fits
      const preferredWidth = maxWidth ?? (contentClassName ? 280 : 0)
      const availableWidth = Math.max(120, viewportW - pad * 2)
      const width =
        preferredWidth > 0
          ? Math.min(preferredWidth, availableWidth)
          : bubble.offsetWidth

      // Temporarily apply width so we measure real wrapped height
      if (preferredWidth > 0) {
        bubble.style.width = `${width}px`
      }

      const bubbleRect = bubble.getBoundingClientRect()
      const bubbleH = bubbleRect.height
      const bubbleW = preferredWidth > 0 ? width : bubbleRect.width

      let top =
        side === 'top' ? rect.top - bubbleH - gap : rect.bottom + gap

      // Prefer requested align, then flip if it would clip the right edge
      let left =
        align === 'start'
          ? rect.left
          : align === 'end'
            ? rect.right - bubbleW
            : rect.left + rect.width / 2 - bubbleW / 2

      if (left + bubbleW > viewportW - pad) {
        // Prefer anchoring to the right edge of the trigger so content stays on-screen
        left = rect.right - bubbleW
      }
      if (left < pad) {
        left = pad
      }
      if (left + bubbleW > viewportW - pad) {
        left = Math.max(pad, viewportW - bubbleW - pad)
      }

      if (top < pad) {
        // Flip below if not enough room above
        top = rect.bottom + gap
      }
      if (top + bubbleH > viewportH - pad) {
        top = Math.max(pad, viewportH - bubbleH - pad)
      }

      setPoint({ top, left, width: bubbleW })
      setPlaced(true)
    }

    // Double rAF so Tailwind classes (width/wrap) are applied before measure
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(updatePosition)
    })

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open, side, align, content, contentClassName, maxWidth])

  const bubble =
    open && typeof document !== 'undefined'
      ? createPortal(
          <span
            ref={bubbleRef}
            id={tooltipId}
            role="tooltip"
            style={{
              top: point.top,
              left: point.left,
              ...(maxWidth || point.width
                ? { width: point.width || maxWidth }
                : null),
            }}
            className={cn(
              'pointer-events-none fixed z-[300] box-border rounded-md bg-[#2D2061] px-3 py-2 text-[11px] font-medium text-white shadow-lg',
              maxWidth || contentClassName
                ? 'whitespace-normal break-words text-left leading-snug'
                : 'whitespace-nowrap',
              placed ? 'opacity-100' : 'opacity-0',
              contentClassName,
            )}
          >
            {content}
          </span>,
          document.body,
        )
      : null

  return (
    <span
      ref={triggerRef}
      className={cn('inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      {bubble}
    </span>
  )
}
