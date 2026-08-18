import {
  useCallback,
  useId,
  useRef,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { cn } from '../../lib/cn'

export type RangeSliderProps = {
  min?: number
  max?: number
  step?: number
  /** Inclusive low value */
  value: [number, number]
  onChange: (value: [number, number]) => void
  label?: string
  /** Shown next to the label, e.g. "(3-10 Years)". Pass "" to hide. */
  valueLabel?: string
  unit?: string
  className?: string
  disabled?: boolean
  /**
   * Visual tokens for the bar.
   * - `brand` — default navy fill (product theme)
   * - `suitability` — design filter slider: medium purple track + solid knobs
   */
  accent?: 'brand' | 'suitability'
}

/**
 * Dual-thumb range slider (e.g. experience years on Job Details).
 */
export function RangeSlider({
  min = 0,
  max = 20,
  step = 1,
  value,
  onChange,
  label,
  valueLabel,
  unit = 'Years',
  className,
  disabled = false,
  accent = 'brand',
}: RangeSliderProps) {
  const id = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const [low, high] = value

  const fillColor =
    accent === 'suitability' ? 'bg-[#5B4B9E]' : 'bg-[#2D2061]'
  const thumbColor =
    accent === 'suitability'
      ? 'border-[#5B4B9E] bg-[#5B4B9E] focus-visible:ring-[#5B4B9E]/30'
      : 'border-[#2D2061] bg-[#2D2061] focus-visible:ring-[#2D2061]/30'

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

  const pct = (n: number) => ((n - min) / (max - min)) * 100

  function valueFromClientX(clientX: number) {
    const track = trackRef.current
    if (!track) return min
    const rect = track.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    return snap(min + ratio * (max - min))
  }

  function startDrag(thumb: 'low' | 'high', event: ReactPointerEvent) {
    if (disabled) return
    event.preventDefault()
    const target = event.currentTarget
    target.setPointerCapture(event.pointerId)

    function onMove(moveEvent: PointerEvent) {
      const next = valueFromClientX(moveEvent.clientX)
      if (thumb === 'low') {
        onChange([Math.min(next, high), high])
      } else {
        onChange([low, Math.max(next, low)])
      }
    }

    function onUp(upEvent: PointerEvent) {
      target.releasePointerCapture(upEvent.pointerId)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }

  function onKey(
    thumb: 'low' | 'high',
    event: KeyboardEvent<HTMLButtonElement>,
  ) {
    if (disabled) return
    const delta =
      event.key === 'ArrowRight' || event.key === 'ArrowUp'
        ? step
        : event.key === 'ArrowLeft' || event.key === 'ArrowDown'
          ? -step
          : 0
    if (!delta) return
    event.preventDefault()
    if (thumb === 'low') {
      onChange([Math.min(clamp(low + delta), high), high])
    } else {
      onChange([low, Math.max(clamp(high + delta), low)])
    }
  }

  const displayLabel = valueLabel === undefined ? `(${low}-${high} ${unit})` : valueLabel

  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      {label ? (
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <span id={id} className="text-xs font-medium text-[#5c5878]">
            {label}
          </span>
          {displayLabel ? (
            <span className="text-xs font-semibold text-[#2D2061]">
              {displayLabel}
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        ref={trackRef}
        className={cn(
          'relative mx-1 h-8 touch-none select-none',
          disabled && 'opacity-50',
        )}
        aria-labelledby={label ? id : undefined}
      >
        <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#DAD7E6]" />
        <div
          className={cn(
            'absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full',
            fillColor,
          )}
          style={{
            left: `${pct(low)}%`,
            width: `${pct(high) - pct(low)}%`,
          }}
        />
        {(['low', 'high'] as const).map((thumb) => {
          const v = thumb === 'low' ? low : high
          return (
            <button
              key={thumb}
              type="button"
              disabled={disabled}
              aria-label={thumb === 'low' ? 'Minimum value' : 'Maximum value'}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={v}
              role="slider"
              tabIndex={0}
              onKeyDown={(e) => onKey(thumb, e)}
              onPointerDown={(e) => startDrag(thumb, e)}
              className={cn(
                'absolute top-1/2 size-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-sm',
                'focus-visible:outline-none focus-visible:ring-2',
                thumbColor,
                !disabled && 'cursor-grab active:cursor-grabbing',
              )}
              style={{ left: `${pct(v)}%` }}
            />
          )
        })}
      </div>
    </div>
  )
}
