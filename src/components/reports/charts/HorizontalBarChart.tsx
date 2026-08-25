import { cn } from '../../../lib/cn'

export type HorizontalBarChartItem = {
  id: string
  label: string
  value: number
  color?: string
}

export type HorizontalBarChartProps = {
  items: HorizontalBarChartItem[]
  xMax?: number
  /** Appended to x-axis tick labels (e.g. "d"). Pass "" for plain numbers. */
  xUnit?: string
  xTickStep?: number
  leftPad?: number
  defaultBarColor?: string
  /** Vertical space per row. Default compact for report designs. */
  rowHeight?: number
  /** Bar thickness in px. Design uses thin bars (~8). */
  barThickness?: number
  /** Corner radius of bars. */
  barRadius?: number
  /** Optional rotated Y-axis title (e.g. "Jobs"). */
  yAxisLabel?: string
  className?: string
}

/**
 * SVG horizontal bar chart for report category comparisons.
 * Defaults match Offer & Hired Distribution (thin bars, small type).
 */
export function HorizontalBarChart({
  items,
  xMax = 60,
  xUnit = 'd',
  xTickStep = 10,
  leftPad = 168,
  defaultBarColor = '#2D2061',
  rowHeight = 24,
  barThickness = 6,
  barRadius = 3,
  yAxisLabel,
  className,
}: HorizontalBarChartProps) {
  const width = 760
  const yTitlePad = yAxisLabel ? 16 : 0
  const pad = {
    top: 8,
    right: 16,
    bottom: 24,
    left: leftPad + yTitlePad,
  }
  const height = pad.top + pad.bottom + items.length * rowHeight
  const innerW = width - pad.left - pad.right
  const tickCount = Math.floor(xMax / xTickStep)
  const xTicks = Array.from({ length: tickCount + 1 }, (_, i) => i * xTickStep)
  const labelFont = 7
  const tickFont = 7

  function xFor(value: number) {
    return pad.left + (value / xMax) * innerW
  }

  return (
    <div className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={yAxisLabel ?? 'Category comparison'}
      >
        {yAxisLabel ? (
          <text
            x={12}
            y={pad.top + (height - pad.top - pad.bottom) / 2}
            textAnchor="middle"
            transform={`rotate(-90 12 ${pad.top + (height - pad.top - pad.bottom) / 2})`}
            fill="#8B8B9E"
            style={{ fontSize: tickFont }}
          >
            {yAxisLabel}
          </text>
        ) : null}

        {xTicks.map((tick) => {
          const x = xFor(tick)
          return (
            <g key={tick}>
              <line
                x1={x}
                x2={x}
                y1={pad.top}
                y2={height - pad.bottom}
                stroke="#E8E6F0"
                strokeWidth={1}
              />
              <text
                x={x}
                y={height - 10}
                textAnchor="middle"
                fill="#8B8B9E"
                style={{ fontSize: tickFont }}
              >
                {tick}
                {xUnit}
              </text>
            </g>
          )
        })}

        {items.map((item, index) => {
          const rowTop = pad.top + index * rowHeight
          const y = rowTop + (rowHeight - barThickness) / 2
          const barW = Math.max(3, (item.value / xMax) * innerW)
          const labelY = rowTop + rowHeight / 2 + 2.5
          return (
            <g key={item.id}>
              <text
                x={pad.left - 10}
                y={labelY}
                textAnchor="end"
                fill="#5C5878"
                style={{ fontSize: labelFont }}
              >
                {item.label}
              </text>
              <rect
                x={pad.left}
                y={y}
                width={barW}
                height={barThickness}
                rx={barRadius}
                fill={item.color ?? defaultBarColor}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
