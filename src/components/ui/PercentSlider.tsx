import {
  useCallback,
  useId,
  useRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { cn } from '../../lib/cn'

export type PercentSliderTone = 'success' | 'danger'

export type PercentSliderProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  className?: string
  /** Accessible name */
  'aria-label'?: string
  /** Green for general criteria; red for penalty criteria. */
  tone?: PercentSliderTone
}

const TONE_STYLES: Record<
  PercentSliderTone,
  { fill: string; tip: string; caret: string; thumb: string; focus: string; shadow: string }
> = {
  success: {
    fill: 'bg-[#22A45A]',
    tip: 'bg-[#22A45A]',
    caret: 'border-t-[#22A45A]',
    thumb: 'bg-[#22A45A]',
    focus: 'focus-visible:ring-[#22A45A]/40',
    shadow: 'shadow-[0_1px_3px_rgba(34,164,90,0.45)]',
  },
  danger: {
    fill: 'bg-[#D92D20]',
    tip: 'bg-[#D92D20]',
    caret: 'border-t-[#D92D20]',
    thumb: 'bg-[#D92D20]',
    focus: 'focus-visible:ring-[#D92D20]/40',
    shadow: 'shadow-[0_1px_3px_rgba(217,45,32,0.45)]',
  },
}

/**
 * Single-thumb percent slider with fill, solid thumb,
 * and tooltip + caret above the handle (Job Analyzer).
 */
export function PercentSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 5,
  disabled = false,
  className,
  'aria-label': ariaLabel = 'Weight',
  tone = 'success',
}: PercentSliderProps) {
  const toneClass = TONE_STYLES[tone]
  const id = useId()
  const trackRef = useRef<HTMLDivElement>(null)

  const clamp = useCallback(
    (n: number) => Math.min(max, Math.max(min, n)),
    [min, max],
  )

  const snap = useCallback(
    (n: number) => {
      const raw = Math.round((n - min) / step) * step + min
      return clamp(raw)
    },
    [clamp, min, step],
  )

  const pct = ((value - min) / (max - min)) * 100

  function valueFromClientX(clientX: number) {
    const track = trackRef.current
    if (!track) return min
    const rect = track.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    return snap(min + ratio * (max - min))
  }

  function startDrag(event: ReactPointerEvent) {
    if (disabled) return
    event.preventDefault()
    const target = event.currentTarget
    target.setPointerCapture(event.pointerId)

    function onMove(moveEvent: PointerEvent) {
      onChange(valueFromClientX(moveEvent.clientX))
    }

    function onUp(upEvent: PointerEvent) {
      target.releasePointerCapture(upEvent.pointerId)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  function onKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return
    const delta =
      event.key === 'ArrowRight' || event.key === 'ArrowUp'
        ? step
        : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
          ? -step
          : 0
    if (!delta) return
    event.preventDefault()
    onChange(clamp(value + delta))
  }

  function onTrackPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (disabled) return
    onChange(valueFromClientX(event.clientX))
  }

  return (
    <div
      className={cn(
        'relative w-full min-w-[9rem] max-w-[14rem] pt-7',
        className,
      )}
    >
      <div
        ref={trackRef}
        className={cn(
          'relative h-6 touch-none select-none',
          disabled && 'pointer-events-none opacity-50',
        )}
        onPointerDown={onTrackPointerDown}
      >
        {/* Track */}
        <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#E6E8EE]" />
        <div
          className={cn(
            'absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full',
            toneClass.fill,
          )}
          style={{ width: `${pct}%` }}
        />

        {/* Tooltip + caret above thumb */}
        <div
          className="pointer-events-none absolute bottom-full z-10 flex -translate-x-1/2 flex-col items-center"
          style={{ left: `${pct}%` }}
        >
          <span
            className={cn(
              'inline-flex min-w-[2rem] items-center justify-center rounded-[4px] px-1.5 py-0.5 text-[11px] font-bold leading-none text-white',
              toneClass.tip,
            )}
          >
            {value}%
          </span>
          <span
            className={cn(
              'size-0 border-x-[5px] border-t-[5px] border-x-transparent',
              toneClass.caret,
            )}
            aria-hidden="true"
          />
        </div>

        <button
          id={id}
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          role="slider"
          onKeyDown={onKey}
          onPointerDown={startDrag}
          className={cn(
            'absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white',
            toneClass.thumb,
            toneClass.shadow,
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
            toneClass.focus,
            !disabled && 'cursor-grab active:cursor-grabbing',
          )}
          style={{ left: `${pct}%` }}
        />
      </div>
    </div>
  )
}
