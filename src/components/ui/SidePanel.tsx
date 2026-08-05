import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

/**
 * Shared app side panel (slides in from the right).
 * Reuse for Filter & Sort, forms, and other drawers — keep UI the same; only override width when needed.
 */
export type SidePanelProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  /** Extra classes on the panel shell */
  className?: string
  /**
   * Tailwind width classes. Prefer this for per-screen sizing.
   * Default: slightly wide drawer used by most screens.
   */
  widthClassName?: string
  /**
   * Optional fixed width (px number or any CSS length, e.g. `"28rem"`).
   * Applied as `style.width` and wins over the default max-width when set.
   */
  width?: number | string
  /** Classes for the scrollable body */
  bodyClassName?: string
  /** Classes for the footer row */
  footerClassName?: string
}

const DEFAULT_WIDTH_CLASS = 'w-full max-w-[32rem]'
/** Keep open + close the same length so both feel smooth. */
const ANIMATION_MS = 400

export function SidePanel({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  widthClassName = DEFAULT_WIDTH_CLASS,
  width,
  bodyClassName,
  footerClassName,
}: SidePanelProps) {
  const titleId = useId()
  const [mounted, setMounted] = useState(open)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      // Start off-screen, then animate in only after the closed state has painted
      // (double-rAF alone can skip the first frame and make open feel instant).
      setEntered(false)
      let enterFrame = 0
      const startFrame = window.requestAnimationFrame(() => {
        enterFrame = window.requestAnimationFrame(() => {
          setEntered(true)
        })
      })
      return () => {
        window.cancelAnimationFrame(startFrame)
        window.cancelAnimationFrame(enterFrame)
      }
    }

    setEntered(false)
    const timer = window.setTimeout(() => setMounted(false), ANIMATION_MS)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!mounted) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mounted, onClose])

  if (!mounted || typeof document === 'undefined') {
    return null
  }

  const panelStyle: CSSProperties = {
    transitionDuration: `${ANIMATION_MS}ms`,
    ...(width === undefined
      ? {}
      : { width: typeof width === 'number' ? `${width}px` : width }),
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-end" role="presentation">
      <button
        type="button"
        aria-label="Close panel backdrop"
        style={{ transitionDuration: `${ANIMATION_MS}ms` }}
        className={cn(
          'absolute inset-0 bg-[#1a1638]/45 backdrop-blur-[1px] transition-opacity ease-[cubic-bezier(0.32,0.72,0,1)]',
          entered ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        style={panelStyle}
        className={cn(
          'relative z-10 flex h-full max-h-full flex-col bg-white shadow-[-8px_0_32px_rgba(26,22,56,0.18)]',
          'transition-transform ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform',
          entered ? 'translate-x-0' : 'translate-x-full',
          width ? 'max-w-full' : widthClassName,
          className,
        )}
      >
        <header className="flex h-14 shrink-0 items-center justify-between bg-[#2D2061] px-5 sm:px-6">
          <h2
            id={titleId}
            className="text-base font-semibold tracking-tight text-white"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div
          className={cn(
            'min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6',
            bodyClassName,
          )}
        >
          {children}
        </div>

        {footer ? (
          <footer
            className={cn(
              'flex shrink-0 justify-end gap-3 border-t border-[#eceaf3] bg-white px-5 py-4 sm:px-6',
              footerClassName,
            )}
          >
            {footer}
          </footer>
        ) : null}
      </aside>
    </div>,
    document.body,
  )
}
