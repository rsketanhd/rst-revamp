import { cn } from '../../lib/cn'

export type SparklineProps = {
  points: number[]
  color?: string
  className?: string
}

/**
 * Compact area/line sparkline for growth trend cards.
 */
export function Sparkline({
  points,
  color = '#2D2061',
  className,
}: SparklineProps) {
  const width = 240
  const height = 72
  const pad = 4
  const max = Math.max(...points, 1)
  const min = Math.min(...points, 0)
  const span = Math.max(max - min, 1)
  const plotWidth = width - pad * 2
  const plotHeight = height - pad * 2

  const coords = points.map((value, index) => {
    const x =
      points.length <= 1
        ? pad + plotWidth / 2
        : pad + (index / (points.length - 1)) * plotWidth
    const y = pad + (1 - (value - min) / span) * plotHeight
    return { x, y }
  })

  if (coords.length === 0) {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className={cn('h-16 w-full', className)}
        role="img"
        aria-hidden="true"
      />
    )
  }

  const line = coords
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')
  const last = coords[coords.length - 1]
  const area = `${line} L ${last.x} ${height - pad} L ${coords[0].x} ${height - pad} Z`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={cn('h-16 w-full', className)}
      role="img"
      aria-hidden="true"
    >
      <path d={area} fill={color} opacity={0.12} />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
