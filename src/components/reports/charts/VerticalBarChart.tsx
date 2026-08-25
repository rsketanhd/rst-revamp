import { cn } from '../../../lib/cn'

export type VerticalBarDatum = {
  id: string
  label: string
  value: number
}

export type VerticalBarChartProps = {
  items: VerticalBarDatum[]
  yMax?: number
  yLabel?: string
  barColor?: string
  /** Fixed bar width in px. Design uses slim columns. */
  barThickness?: number
  className?: string
}

/**
 * SVG vertical bar chart with value labels above each bar.
 * Sized for Hiring Stage Time Analytics (slim bars, small type).
 */
export function VerticalBarChart({
  items,
  yMax,
  yLabel = 'Numbers',
  barColor = '#2D2061',
  barThickness = 9,
  className,
}: VerticalBarChartProps) {
  const maxValue = yMax ?? Math.max(...items.map((item) => item.value), 1)
  const width = 780
  const height = 270
  const pad = { top: 18, right: 10, bottom: 52, left: 36 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const slotW = innerW / Math.max(items.length, 1)
  const tickCount = 5
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) =>
    Math.round((maxValue / tickCount) * i),
  )
  const axisFont = 7
  const valueFont = 6.5
  const labelFont = 6.5

  function xCenter(index: number) {
    return pad.left + index * slotW + slotW / 2
  }

  function yFor(value: number) {
    return pad.top + innerH - (value / maxValue) * innerH
  }

  function wrapLabel(label: string) {
    if (label.length <= 12) return [label]
    const words = label.split(' ')
    if (words.length === 1) return [`${label.slice(0, 11)}…`]
    const mid = Math.ceil(words.length / 2)
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
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

        {items.map((item, index) => {
          const cx = xCenter(index)
          const x = cx - barThickness / 2
          const y = yFor(item.value)
          const h = Math.max(2, pad.top + innerH - y)
          const lines = wrapLabel(item.label)
          return (
            <g key={item.id}>
              <rect
                x={x}
                y={y}
                width={barThickness}
                height={h}
                rx={1.5}
                fill={barColor}
              />
              <text
                x={cx}
                y={y - 4}
                textAnchor="middle"
                fill="#6B6B80"
                style={{ fontSize: valueFont }}
              >
                {item.value}
              </text>
              {lines.map((line, lineIndex) => (
                <text
                  key={`${item.id}-l-${lineIndex}`}
                  x={cx}
                  y={height - 26 + lineIndex * 8}
                  textAnchor="middle"
                  fill="#5C5878"
                  style={{ fontSize: labelFont }}
                >
                  {line}
                </text>
              ))}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
