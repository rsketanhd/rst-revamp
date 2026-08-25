import { cn } from '../../../lib/cn'
import type {
  LineSeriesConfig,
  LineSeriesPoint,
} from '../../../data/jobStatisticsOverview'

export type AreaLineChartProps = {
  series: LineSeriesConfig[]
  points: LineSeriesPoint[]
  yMax?: number
  className?: string
}

/**
 * SVG multi-series area/line chart for report timelines.
 * Compact type and stroke weight to match Job Statistics designs.
 */
export function AreaLineChart({
  series,
  points,
  yMax = 100,
  className,
}: AreaLineChartProps) {
  const width = 760
  const height = 240
  const pad = { top: 12, right: 12, bottom: 28, left: 30 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const yTicks = [0, 20, 40, 60, 80, 100].filter((t) => t <= yMax)
  const axisFont = 7

  function xFor(index: number) {
    if (points.length <= 1) return pad.left + innerW / 2
    return pad.left + (index / (points.length - 1)) * innerW
  }

  function yFor(value: number) {
    return pad.top + innerH - (value / yMax) * innerH
  }

  function linePath(key: string) {
    return points
      .map((point, index) => {
        const x = xFor(index)
        const y = yFor(point.values[key] ?? 0)
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')
  }

  function areaPath(key: string) {
    if (points.length === 0) return ''
    const line = linePath(key)
    const lastX = xFor(points.length - 1)
    const firstX = xFor(0)
    const baseY = yFor(0)
    return `${line} L ${lastX} ${baseY} L ${firstX} ${baseY} Z`
  }

  return (
    <div className={cn('w-full', className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Average time to hire trend"
      >
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
                {tick}d
              </text>
            </g>
          )
        })}

        {points.map((point, index) => (
          <text
            key={point.label}
            x={xFor(index)}
            y={height - 8}
            textAnchor="middle"
            fill="#9B97AE"
            style={{ fontSize: axisFont }}
          >
            {point.label}
          </text>
        ))}

        {series.map((item) => (
          <g key={item.key}>
            <path d={areaPath(item.key)} fill={item.fillColor} />
            <path
              d={linePath(item.key)}
              fill="none"
              stroke={item.color}
              strokeWidth={1.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {points.map((point, index) => (
              <circle
                key={`${item.key}-${point.label}`}
                cx={xFor(index)}
                cy={yFor(point.values[item.key] ?? 0)}
                r={2.5}
                fill="#fff"
                stroke={item.color}
                strokeWidth={1.25}
              />
            ))}
          </g>
        ))}
      </svg>

      <div className="mt-1 flex flex-wrap items-center justify-center gap-3.5">
        {series.map((item) => (
          <span
            key={item.key}
            className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#5C5878]"
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
