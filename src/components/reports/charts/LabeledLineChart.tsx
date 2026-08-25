import { cn } from '../../../lib/cn'

export type LabeledLinePoint = {
  label: string
  value: number
}

export type LabeledLineChartProps = {
  points: LabeledLinePoint[]
  yMax?: number
  yLabel?: string
  lineColor?: string
  className?: string
}

/**
 * SVG line chart with compact value badges above each data point.
 * Sized for Hiring Stage Time Analytics designs.
 */
export function LabeledLineChart({
  points,
  yMax,
  yLabel = 'Average days',
  lineColor = '#2D2061',
  className,
}: LabeledLineChartProps) {
  const maxValue = yMax ?? Math.max(...points.map((p) => p.value), 1)
  const width = 780
  const height = 250
  const pad = { top: 24, right: 12, bottom: 28, left: 34 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const tickStep = Math.ceil(maxValue / 9)
  const yTicks = Array.from(
    { length: Math.floor(maxValue / tickStep) + 1 },
    (_, i) => i * tickStep,
  ).filter((t) => t <= maxValue)
  const axisFont = 7
  const badgeFont = 6.5

  function xFor(index: number) {
    if (points.length <= 1) return pad.left + innerW / 2
    return pad.left + (index / (points.length - 1)) * innerW
  }

  function yFor(value: number) {
    return pad.top + innerH - (value / maxValue) * innerH
  }

  const path = points
    .map((point, index) => {
      const x = xFor(index)
      const y = yFor(point.value)
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  return (
    <div className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label={yLabel}
      >
        <text
          x={10}
          y={pad.top + innerH / 2}
          textAnchor="middle"
          transform={`rotate(-90 10 ${pad.top + innerH / 2})`}
          fill="#9B97AE"
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
                x={pad.left - 5}
                y={y + 2}
                textAnchor="end"
                fill="#9B97AE"
                style={{ fontSize: axisFont }}
              >
                {tick}
              </text>
            </g>
          )
        })}

        <path
          d={path}
          fill="none"
          stroke={lineColor}
          strokeWidth={1.5}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {points.map((point, index) => {
          const x = xFor(index)
          const y = yFor(point.value)
          const badgeW = 18
          const badgeH = 11
          return (
            <g key={point.label}>
              <circle
                cx={x}
                cy={y}
                r={2.75}
                fill="#fff"
                stroke={lineColor}
                strokeWidth={1.5}
              />
              <rect
                x={x - badgeW / 2}
                y={y - 20}
                width={badgeW}
                height={badgeH}
                rx={2.5}
                fill={lineColor}
              />
              <text
                x={x}
                y={y - 12}
                textAnchor="middle"
                fill="#fff"
                style={{ fontSize: badgeFont, fontWeight: 600 }}
              >
                {point.value}
              </text>
              <text
                x={x}
                y={height - 8}
                textAnchor="middle"
                fill="#9B97AE"
                style={{ fontSize: axisFont }}
              >
                {point.label.slice(0, 3)}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
