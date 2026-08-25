import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { GripVertical } from 'lucide-react'
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
   * - `teal` — Job Experience design: teal track + grip knobs + synced inputs
   */
  accent?: 'brand' | 'suitability' | 'teal'
  /**
   * When true, shows editable min/max inputs above the track.
   * Typing a valid number moves the matching thumb.
   */
  showInputs?: boolean
  /** Prefix inside inputs (e.g. "$ "). Ignored when unset. */
  inputPrefix?: string
  /**
   * Format number for input display. Default: plain number string.
   * Parsing strips non-numeric characters except leading minus / decimal.
   */
  formatInputValue?: (value: number) => string
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
  showInputs = false,
  inputPrefix,
  formatInputValue,
}: RangeSliderProps) {
  const id = useId()
  const trackRef = useRef<HTMLDivElement>(null)
  const [low, high] = value

  const fillColor =
    accent === 'suitability'
      ? 'bg-[#5B4B9E]'
      : accent === 'teal'
        ? 'bg-[#2BB5A8]'
        : 'bg-[#2D2061]'
  const thumbColor =
    accent === 'suitability'
      ? 'border-[#5B4B9E] bg-[#5B4B9E] focus-visible:ring-[#5B4B9E]/30'
      : accent === 'teal'
        ? 'border-[#2BB5A8] bg-[#2BB5A8] focus-visible:ring-[#2BB5A8]/30'
        : 'border-[#2D2061] bg-[#2D2061] focus-visible:ring-[#2D2061]/30'
  const inputFocusRing =
    accent === 'teal'
      ? 'focus-within:border-[#2BB5A8] focus-within:ring-[#2BB5A8]/15'
      : 'focus-within:border-[#2D2061] focus-within:ring-[#2D2061]/15'
  const showGrip = accent === 'teal' || showInputs

  const formatValue = useCallback(
    (n: number) => (formatInputValue ? formatInputValue(n) : String(n)),
    [formatInputValue],
  )

  const [lowText, setLowText] = useState(formatValue(low))
  const [highText, setHighText] = useState(formatValue(high))

  useEffect(() => {
    setLowText(formatValue(low))
  }, [low, formatValue])

  useEffect(() => {
    setHighText(formatValue(high))
  }, [high, formatValue])

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

  function parseInput(raw: string): number | null {
    const cleaned = raw.replace(/[^0-9.-]/g, '')
    if (cleaned === '' || cleaned === '-' || cleaned === '.') return null
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : null
  }

  function commitLow(raw: string) {
    const parsed = parseInput(raw)
    if (parsed === null) {
      setLowText(formatValue(low))
      return
    }
    const next = Math.min(snap(parsed), high)
    setLowText(formatValue(next))
    onChange([next, high])
  }

  function commitHigh(raw: string) {
    const parsed = parseInput(raw)
    if (parsed === null) {
      setHighText(formatValue(high))
      return
    }
    const next = Math.max(snap(parsed), low)
    setHighText(formatValue(next))
    onChange([low, next])
  }

  function handleLowInputChange(raw: string) {
    setLowText(raw)
    const parsed = parseInput(raw)
    if (parsed === null) return
    const next = Math.min(snap(parsed), high)
    onChange([next, high])
  }

  function handleHighInputChange(raw: string) {
    setHighText(raw)
    const parsed = parseInput(raw)
    if (parsed === null) return
    const next = Math.max(snap(parsed), low)
    onChange([low, next])
  }

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

  const displayLabel =
    valueLabel === undefined ? `(${low}-${high} ${unit})` : valueLabel

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

      {showInputs ? (
        <div className="flex items-center justify-between gap-2">
          <RangeNumberInput
            aria-label={`Minimum ${unit}`}
            disabled={disabled}
            prefix={inputPrefix}
            value={lowText}
            focusRingClassName={inputFocusRing}
            onChange={handleLowInputChange}
            onBlur={() => commitLow(lowText)}
            onEnter={() => commitLow(lowText)}
          />
          <RangeNumberInput
            aria-label={`Maximum ${unit}`}
            disabled={disabled}
            prefix={inputPrefix}
            value={highText}
            focusRingClassName={inputFocusRing}
            onChange={handleHighInputChange}
            onBlur={() => commitHigh(highText)}
            onEnter={() => commitHigh(highText)}
            className="text-right"
          />
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
            width: `${Math.max(pct(high) - pct(low), 0)}%`,
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
                'absolute top-1/2 -translate-x-1/2 -translate-y-1/2 shadow-sm',
                'focus-visible:outline-none focus-visible:ring-2',
                showGrip
                  ? 'inline-flex size-5 items-center justify-center rounded-md border-0 text-white'
                  : 'size-[18px] rounded-full border-2',
                thumbColor,
                !disabled && 'cursor-grab active:cursor-grabbing',
              )}
              style={{ left: `${pct(v)}%` }}
            >
              {showGrip ? (
                <GripVertical
                  className="size-3.5"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function RangeNumberInput({
  value,
  onChange,
  onBlur,
  onEnter,
  disabled,
  prefix,
  className,
  focusRingClassName,
  'aria-label': ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  onBlur: () => void
  onEnter: () => void
  disabled?: boolean
  prefix?: string
  className?: string
  focusRingClassName?: string
  'aria-label': string
}) {
  return (
    <div
      className={cn(
        'inline-flex h-7 min-w-[3.25rem] max-w-[4.75rem] items-center rounded border border-[#ddd9e8] bg-white px-1.5',
        'focus-within:ring-2',
        focusRingClassName,
        disabled && 'opacity-50',
        className,
      )}
    >
      {prefix ? (
        <span className="mr-0.5 shrink-0 text-[11px] text-[#8B8B9E]">
          {prefix}
        </span>
      ) : null}
      <input
        type="text"
        inputMode="decimal"
        disabled={disabled}
        aria-label={ariaLabel}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            onEnter()
            ;(e.target as HTMLInputElement).blur()
          }
        }}
        className={cn(
          'min-w-0 flex-1 bg-transparent text-[12px] leading-none text-[#2D2061] outline-none',
          className?.includes('text-right') && 'text-right',
        )}
      />
    </div>
  )
}
