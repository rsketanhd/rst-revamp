import { cn } from '../../../lib/cn'
import type { DonutSlice } from '../../../data/jobStatisticsOverview'

export type DonutChartProps = {
  slices: DonutSlice[]
  centerValue: string
  centerLabel: string
  className?: string
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  }
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

/**
 * SVG donut chart with center metric and legend.
 * Compact sizing for Job Statistics Overview.
 */
export function DonutChart({
  slices,
  centerValue,
  centerLabel,
  className,
}: DonutChartProps) {
  const size = 230
  const cx = size / 2
  const cy = size / 2
  const radius = 78
  const ringWidth = 15
  const total = slices.reduce((sum, slice) => sum + slice.value, 0) || 1

  let angle = 0
  const arcs = slices.map((slice) => {
    const sweep = (slice.value / total) * 360
    const start = angle
    const end = angle + sweep
    angle = end
    return { ...slice, start, end }
  })

  return (
    <div className={cn('flex w-full flex-col items-center gap-3', className)}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="h-auto w-full max-w-[14rem]"
        role="img"
        aria-label={`${centerValue} ${centerLabel}`}
      >
        {arcs.map((arc) => (
          <path
            key={arc.id}
            d={describeArc(cx, cy, radius, arc.start, arc.end - 0.5)}
            fill="none"
            stroke={arc.color}
            strokeWidth={ringWidth}
            strokeLinecap="butt"
          />
        ))}
        <text
          x={cx}
          y={cy - 3}
          textAnchor="middle"
          fill="#2D2061"
          style={{ fontSize: 22, fontWeight: 700 }}
        >
          {centerValue}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="#8B8B9E"
          style={{ fontSize: 8, fontWeight: 600, letterSpacing: '0.04em' }}
        >
          {centerLabel.toUpperCase()}
        </text>
      </svg>

      <div className="flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1">
        {slices.map((slice) => (
          <span
            key={slice.id}
            className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#5C5878]"
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: slice.color }}
              aria-hidden="true"
            />
            {slice.label}
          </span>
        ))}
      </div>
    </div>
  )
}
