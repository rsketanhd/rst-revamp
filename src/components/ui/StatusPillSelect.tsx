import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type StatusPillOption = {
  value: string
  label: string
  /** Tailwind classes for pill bg/text */
  className: string
  /** Tailwind class for the leading dot, e.g. `bg-[#1A6FD0]` */
  dotClassName: string
}

export type StatusPillSelectProps = {
  value: string
  options: StatusPillOption[]
  onChange: (value: string) => void
  'aria-label'?: string
  className?: string
  /** Dropdown panel title */
  panelTitle?: string
}

const PANEL_GAP = 6
const VIEWPORT_PAD = 8
const PANEL_MIN_WIDTH = 280

type PanelCoords = { top: number; left: number }

function StatusPillBadge({
  option,
  showChevron,
  className,
}: {
  option: StatusPillOption
  showChevron?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold leading-none',
        option.className,
        className,
      )}
    >
      <span
        className={cn('size-1.5 shrink-0 rounded-full', option.dotClassName)}
        aria-hidden="true"
      />
      <span className="truncate">{option.label}</span>
      {showChevron ? (
        <ChevronDown
          className="size-3.5 shrink-0 opacity-90"
          strokeWidth={2.25}
          aria-hidden="true"
        />
      ) : null}
    </span>
  )
}

/**
 * Status shown as a colored pill; opens a portaled "Set Status" panel
 * anchored just below the trigger (never clipped by table overflow).
 */
export function StatusPillSelect({
  value,
  options,
  onChange,
  'aria-label': ariaLabel,
  className,
  panelTitle = 'Set Status',
}: StatusPillSelectProps) {
  const panelId = useId()
  const titleId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState<PanelCoords | null>(null)

  const current = options.find((o) => o.value === value) ?? options[0]

  function updatePosition() {
    const trigger = triggerRef.current
    const panel = panelRef.current
    if (!trigger || !panel) return

    const rect = trigger.getBoundingClientRect()
    const panelW = Math.max(
      panel.offsetWidth || PANEL_MIN_WIDTH,
      PANEL_MIN_WIDTH,
    )
    const panelH = panel.offsetHeight || panel.getBoundingClientRect().height

    // Prefer left-aligned under the trigger; clamp into viewport
    let left = rect.left
    left = Math.min(
      Math.max(VIEWPORT_PAD, left),
      window.innerWidth - panelW - VIEWPORT_PAD,
    )

    // Prefer just below; flip above if not enough space
    let top = rect.bottom + PANEL_GAP
    if (top + panelH > window.innerHeight - VIEWPORT_PAD) {
      const above = rect.top - PANEL_GAP - panelH
      if (above >= VIEWPORT_PAD) {
        top = above
      } else {
        top = Math.min(
          Math.max(VIEWPORT_PAD, top),
          window.innerHeight - panelH - VIEWPORT_PAD,
        )
      }
    }

    setCoords({ top, left })
  }

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
    const id = window.requestAnimationFrame(updatePosition)
    return () => window.cancelAnimationFrame(id)
  }, [open, options, value])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (rootRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setOpen(false)
      setCoords(null)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        setCoords(null)
      }
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
  }, [open])

  function selectStatus(next: string) {
    onChange(next)
    setOpen(false)
    setCoords(null)
  }

  function toggleOpen() {
    setOpen((prev) => {
      if (prev) setCoords(null)
      return !prev
    })
  }

  const panel =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={panelRef}
            id={panelId}
            role="listbox"
            aria-labelledby={titleId}
            style={
              coords
                ? { top: coords.top, left: coords.left }
                : { top: -9999, left: -9999, visibility: 'hidden' as const }
            }
            className={cn(
              'fixed z-[100] w-[min(17.5rem,calc(100vw-1rem))] overflow-hidden rounded-xl border border-[#E8E6F0] bg-white',
              'shadow-[0_12px_40px_rgba(26,26,46,0.16)]',
            )}
          >
            <header className="flex items-center justify-between gap-3 border-b border-[#ECEAF3] px-4 py-3">
              <h2
                id={titleId}
                className="text-[15px] font-semibold tracking-tight text-[#2A2740]"
              >
                {panelTitle}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  setCoords(null)
                }}
                aria-label="Close"
                className="inline-flex size-7 items-center justify-center rounded-md text-[#8B8B9E] transition-colors hover:bg-[#F5F4F8] hover:text-[#2A2740] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/25"
              >
                <X className="size-4" strokeWidth={2} aria-hidden="true" />
              </button>
            </header>

            <ul className="max-h-[min(50vh,22rem)] overflow-y-auto py-1.5">
              {options.map((opt) => {
                const selected = opt.value === value
                return (
                  <li key={opt.value} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => selectStatus(opt.value)}
                      className={cn(
                        'flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left transition-colors',
                        'hover:bg-[#F7F6FA] focus-visible:bg-[#F7F6FA] focus-visible:outline-none',
                        selected && 'bg-[#FAFAFC]',
                      )}
                    >
                      <StatusPillBadge option={opt} />
                      {selected ? (
                        <Check
                          className="size-4 shrink-0 text-[#1A6FD0]"
                          strokeWidth={2.5}
                          aria-hidden="true"
                        />
                      ) : (
                        <span className="size-4 shrink-0" aria-hidden="true" />
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>,
          document.body,
        )
      : null

  return (
    <div ref={rootRef} className={cn('relative inline-flex max-w-full', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={toggleOpen}
        className="inline-flex max-w-full cursor-pointer rounded-full outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-[#2D2061]/30"
      >
        {current ? (
          <StatusPillBadge option={current} showChevron />
        ) : (
          <span className="text-[12px] text-[#6B6B80]">Select status</span>
        )}
      </button>
      {panel}
    </div>
  )
}
