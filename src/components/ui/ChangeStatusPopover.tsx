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
import {
  StatusPillOptionButton,
  type StatusPillOption,
} from './StatusPillSelect'

export type ChangeableJobStatus =
  | 'new'
  | 'sendMail'
  | 'interviewReady'
  | 'videoInterview'
  | 'clientEndorsement'

type JobChangeStatusOption = StatusPillOption & {
  value: ChangeableJobStatus
}

export function jobChangeStatusLabel(status: ChangeableJobStatus): string {
  switch (status) {
    case 'new':
      return 'New'
    case 'sendMail':
      return 'Send Mail'
    case 'interviewReady':
      return 'Interview Ready'
    case 'videoInterview':
      return 'Video Interview Scheduled'
    case 'clientEndorsement':
      return 'Client Endorsement'
    default: {
      const _exhaustive: never = status
      return _exhaustive
    }
  }
}

export const JOB_CHANGE_STATUS_OPTIONS: JobChangeStatusOption[] = [
  {
    value: 'new',
    label: jobChangeStatusLabel('new'),
    className: 'bg-[#E3F0FF] text-[#1A6FD0]',
    dotClassName: 'bg-[#1A6FD0]',
  },
  {
    value: 'sendMail',
    label: jobChangeStatusLabel('sendMail'),
    className: 'bg-[#FFF0E0] text-[#D97706]',
    dotClassName: 'bg-[#D97706]',
  },
  {
    value: 'interviewReady',
    label: jobChangeStatusLabel('interviewReady'),
    className: 'bg-[#E7F8ED] text-[#15803D]',
    dotClassName: 'bg-[#15803D]',
  },
  {
    value: 'videoInterview',
    label: jobChangeStatusLabel('videoInterview'),
    className: 'bg-[#E0F7F5] text-[#0D9488]',
    dotClassName: 'bg-[#0D9488]',
  },
  {
    value: 'clientEndorsement',
    label: jobChangeStatusLabel('clientEndorsement'),
    className: 'bg-[#EDE8F8] text-[#5B4B9E]',
    dotClassName: 'bg-[#5B4B9E]',
  },
]

export function jobChangeStatusOption(
  status: ChangeableJobStatus,
): JobChangeStatusOption {
  return (
    JOB_CHANGE_STATUS_OPTIONS.find((option) => option.value === status) ??
    JOB_CHANGE_STATUS_OPTIONS[0]
  )
}

export type ChangeStatusPopoverProps = {
  open: boolean
  onClose: () => void
  value: ChangeableJobStatus
  onChange: (status: ChangeableJobStatus) => void
  /** Anchor for the floating list (typically the job ⋮ control). */
  anchorRef?: RefObject<HTMLElement | null>
  className?: string
}

type Coords = { top: number; left: number }

const PANEL_GAP = 10
const VIEWPORT_PAD = 8

/**
 * Change Status overlay — colored status pills with a check on the current value.
 */
export function ChangeStatusPopover({
  open,
  onClose,
  value,
  onChange,
  anchorRef,
  className,
}: ChangeStatusPopoverProps) {
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState<Coords | null>(null)

  function updatePosition() {
    const panel = panelRef.current
    if (!panel) return

    const panelW = panel.offsetWidth || panel.getBoundingClientRect().width
    const panelH = panel.offsetHeight || panel.getBoundingClientRect().height
    const anchor = anchorRef?.current

    if (!anchor) {
      setCoords({
        top: Math.max(VIEWPORT_PAD, window.innerHeight / 2 - panelH / 2),
        left: Math.max(VIEWPORT_PAD, window.innerWidth / 2 - panelW / 2),
      })
      return
    }

    const rect = anchor.getBoundingClientRect()
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

    setCoords({ top, left })
  }

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
    const id = window.requestAnimationFrame(updatePosition)
    return () => window.cancelAnimationFrame(id)
  }, [open, anchorRef])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (anchorRef?.current?.contains(target)) return
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

  function selectStatus(next: ChangeableJobStatus) {
    onChange(next)
    onClose()
  }

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={panelRef}
      id={panelId}
      role="listbox"
      aria-label="Change Status"
      style={
        coords
          ? { top: coords.top, left: coords.left }
          : { top: -9999, left: -9999, visibility: 'hidden' as const }
      }
      className={cn(
        'fixed z-[110] w-[min(17.5rem,calc(100vw-1rem))] overflow-hidden rounded-xl border border-[#E8E6F0] bg-white',
        'shadow-[0_12px_40px_rgba(26,26,46,0.16)]',
        className,
      )}
    >
      <ul className="py-2">
        {JOB_CHANGE_STATUS_OPTIONS.map((opt) => (
          <StatusPillOptionButton
            key={opt.value}
            option={opt}
            selected={opt.value === value}
            onSelect={() => selectStatus(opt.value)}
          />
        ))}
      </ul>
    </div>,
    document.body,
  )
}
