import { cn } from '../../../lib/cn'
import type { GroupedBarMonth } from '../../../data/offerHiredDistribution'

export type GroupedVerticalBarChartProps = {
  items: GroupedBarMonth[]
  yMax?: number
  yLabel?: string
  seriesA?: { key: 'application'; label: string; color: string }
  seriesB?: { key: 'recommendation'; label: string; color: string }
  /** Fixed bar thickness in px. Design uses very thin columns. */
  barThickness?: number
  className?: string
}

/**
 * Grouped vertical bar chart (Application vs Recommendation by month).
 * Defaults match Offer & Hired Distribution (thin bars, small type).
 */
export function GroupedVerticalBarChart({
  items,
  yMax,
  yLabel = 'Numbers',
  seriesA = {
    key: 'application',
    label: 'Application',
    color: '#2D2061',
  },
  seriesB = {
    key: 'recommendation',
    label: 'Recommendation',
    color: '#C45B8C',
  },
  barThickness = 7,
  className,
}: GroupedVerticalBarChartProps) {
  const maxValue =
    yMax ??
    Math.max(
      ...items.flatMap((item) => [item.application, item.recommendation]),
      1,
    )
  const width = 780
  const height = 300
  const pad = { top: 22, right: 12, bottom: 42, left: 42 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const groupW = innerW / items.length
  const barGap = 3
  const pairW = barThickness * 2 + barGap
  const tickCount = 7
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((maxValue / tickCount) * i),
  )
  const axisFont = 8
  const valueFont = 7

  function groupCenter(index: number) {
    return pad.left + index * groupW + groupW / 2
  }

  function yFor(value: number) {
    return pad.top + innerH - (value / maxValue) * innerH
  }

  return (
    <div className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={yLabel}
      >
        <text
          x={12}
          y={pad.top + innerH / 2}
          textAnchor="middle"
          transform={`rotate(-90 12 ${pad.top + innerH / 2})`}
          fill="#8B8B9E"
          style={{ fontSize: axisFont }}
        >
          {yLabel}
        </text>

        {yTicks.map((tick) => {
          const y = yFor(tick)
          return (
            <g key={tick}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y}
                y2={y}
                stroke="#E8E6F0"
                strokeWidth={1}
              />
              <text
                x={pad.left - 6}
                y={y + 2.5}
                textAnchor="end"
                fill="#8B8B9E"
                style={{ fontSize: axisFont }}
              >
                {tick}
              </text>
            </g>
          )
        })}

        {items.map((item, index) => {
          const center = groupCenter(index)
          const aX = center - pairW / 2
          const bX = aX + barThickness + barGap
          const aVal = item[seriesA.key]
          const bVal = item[seriesB.key]
          const aY = yFor(aVal)
          const bY = yFor(bVal)
          return (
            <g key={item.month}>
              <rect
                x={aX}
                y={aY}
                width={barThickness}
                height={Math.max(2, pad.top + innerH - aY)}
                rx={1.5}
                fill={seriesA.color}
              />
              <text
                x={aX + barThickness / 2}
                y={aY - 4}
                textAnchor="middle"
                fill="#6B6B80"
                style={{ fontSize: valueFont }}
              >
                {aVal}
              </text>
              <rect
                x={bX}
                y={bY}
                width={barThickness}
                height={Math.max(2, pad.top + innerH - bY)}
                rx={1.5}
                fill={seriesB.color}
              />
              <text
                x={bX + barThickness / 2}
                y={bY - 4}
                textAnchor="middle"
                fill="#6B6B80"
                style={{ fontSize: valueFont }}
              >
                {bVal}
              </text>
              <text
                x={center}
                y={height - 14}
                textAnchor="middle"
                fill="#5C5878"
                style={{ fontSize: axisFont }}
              >
                {item.month}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="mt-1.5 flex flex-wrap items-center justify-center gap-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#5C5878]">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: seriesB.color }}
            aria-hidden="true"
          />
          {seriesB.label}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#5C5878]">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: seriesA.color }}
            aria-hidden="true"
          />
          {seriesA.label}
        </span>
      </div>
    </div>
  )
}
