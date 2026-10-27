import { cn } from '../../lib/cn'
import type { ActivitySlice } from '../../data/recruiterDashboard'

export type MiniDonutProps = {
  slices: ActivitySlice[]
  centerValue: string
  centerLabel: string
  className?: string
  showLegend?: boolean
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angle: number,
): { x: number; y: number } {
  const rad = ((angle - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

/**
 * Compact donut used on Activity Status and license panels.
 */
export function MiniDonut({
  slices,
  centerValue,
  centerLabel,
  className,
  showLegend = true,
}: MiniDonutProps) {
  const size = 180
  const cx = size / 2
  const cy = size / 2
  const radius = 62
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1

  let angle = 0
  const arcs = slices.map((slice) => {
    const sweep = (slice.value / total) * 360
    const start = angle
    const end = angle + Math.max(sweep, 0.01)
    angle = end
    return { ...slice, start, end }
  })

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full max-w-[11rem]"
        role="img"
        aria-label={`${centerValue} ${centerLabel}`}
      >
        {arcs.map((item) => (
          <path
            key={item.id}
            d={describeArc(cx, cy, radius, item.start, item.end - 0.4)}
            fill="none"
            stroke={item.color}
            strokeWidth={16}
          />
        ))}
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fill="#2D2061"
          style={{ fontSize: 22, fontWeight: 700 }}
        >
          {centerValue}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill="#8B8B9E"
          style={{ fontSize: 9, fontWeight: 600 }}
        >
          {centerLabel}
        </text>
      </svg>
      {showLegend ? (
        <ul className="flex w-full flex-wrap justify-center gap-x-3 gap-y-1.5">
          {slices.map((slice) => (
            <li
              key={slice.id}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#5C5878]"
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: slice.color }}
                aria-hidden="true"
              />
              {slice.label}
              <span className="tabular-nums text-[#2D2061]">{slice.value}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
