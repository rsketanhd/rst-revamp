import { useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const SIZE = 40
const STROKE = 3.5

export type ProfileCompletionCellProps = {
  percent: number
  incompleteFields: readonly string[]
}

/**
 * Circular profile completion with a hover card of fields still missing.
 * The card is portaled so the table's horizontal scroll does not clip it.
 */
export function ProfileCompletionCell({
  percent,
  incompleteFields,
}: ProfileCompletionCellProps) {
  const triggerRef = useRef<HTMLSpanElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)
  const tooltipId = useId()
  const [open, setOpen] = useState(false)
  const [point, setPoint] = useState({ top: 0, left: 0 })

  function show() {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setOpen(true)
  }

  function hideSoon() {
    closeTimer.current = window.setTimeout(() => setOpen(false), 80)
  }

  useLayoutEffect(() => {
    if (!open) return

    function place() {
      const trigger = triggerRef.current
      const card = cardRef.current
      if (!trigger || !card) return

      const rect = trigger.getBoundingClientRect()
      const cardRect = card.getBoundingClientRect()
      const pad = 8
      let left = rect.left
      let top = rect.bottom + 6

      if (left + cardRect.width > window.innerWidth - pad) {
        left = Math.max(pad, window.innerWidth - cardRect.width - pad)
      }
      if (top + cardRect.height > window.innerHeight - pad) {
        top = Math.max(pad, rect.top - cardRect.height - 6)
      }

      setPoint({ top, left })
    }

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(place)
    })
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open, incompleteFields])

  const radius = (SIZE - STROKE) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - Math.min(100, Math.max(0, percent)) / 100)

  const card =
    open && typeof document !== 'undefined'
      ? createPortal(
          <div
            ref={cardRef}
            id={tooltipId}
            role="tooltip"
            style={{ top: point.top, left: point.left }}
            onMouseEnter={show}
            onMouseLeave={hideSoon}
            className="fixed z-[300] min-w-[11.5rem] rounded-md border border-[#EFEAF8] bg-white px-4 py-3 shadow-[0_8px_24px_rgba(16,12,40,0.12)]"
          >
            <p className="text-[13px] font-medium text-[#1A1A2E]">
              Incomplete fields
            </p>
            {incompleteFields.length > 0 ? (
              <ul className="mt-2 flex flex-col gap-1">
                {incompleteFields.map((field) => (
                  <li
                    key={field}
                    className="text-[13px] font-medium leading-5 text-[#E03131]"
                  >
                    {field}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-[13px] text-[#6B6B80]">
                All profile fields are filled.
              </p>
            )}
          </div>,
          document.body,
        )
      : null

  return (
    <span
      ref={triggerRef}
      tabIndex={0}
      aria-label={`Profile ${percent} percent`}
      aria-describedby={open ? tooltipId : undefined}
      className="relative inline-flex size-10 cursor-default items-center justify-center outline-none"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onFocus={show}
      onBlur={hideSoon}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={radius}
          fill="none"
          stroke="#E6E4EE"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={radius}
          fill="none"
          stroke="#8B6CE0"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="text-[11px] font-medium tabular-nums text-[#6B6B80]">
        {percent}%
      </span>
      {card}
    </span>
  )
}
