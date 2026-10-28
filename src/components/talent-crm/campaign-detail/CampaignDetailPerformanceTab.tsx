import { useMemo, useState } from 'react'
import { Search, Send } from 'lucide-react'
import type {
  CampaignDetail,
  CampaignFunnelMessage,
  CampaignTrendPoint,
} from '../../../data/campaignDetail'
import {
  Button,
  DataTable,
  DataTableBody,
  DataTableEmpty,
  DataTableHead,
  DataTableRow,
  DataTableSortHeader,
  DataTableTd,
  DataTableTh,
  toast,
} from '../../ui'

const TOAST_TITLE = 'Campaigns'
const cardClass =
  'rounded-xl border border-[#E4E1EE] bg-white p-4 shadow-[0_1px_2px_rgba(45,32,97,0.04)] sm:p-5'

export type CampaignDetailPerformanceTabProps = {
  detail: CampaignDetail
}

/**
 * Campaign Performance tab — KPIs, funnels, trend chart, candidate activity.
 */
export function CampaignDetailPerformanceTab({
  detail,
}: CampaignDetailPerformanceTabProps) {
  const [query, setQuery] = useState('')
  const [activityPeriod, setActivityPeriod] = useState('All')
  const [trendMessageId, setTrendMessageId] = useState(
    detail.funnels[0]?.id ?? 'msg-1',
  )
  const [hoverIndex, setHoverIndex] = useState<number | null>(2)

  const activityRows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return detail.activity
    return detail.activity.filter((row) =>
      [row.name, row.email].some((part) => part.toLowerCase().includes(needle)),
    )
  }, [detail.activity, query])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            toast.success('CSV export coming soon.', { title: TOAST_TITLE })
          }
          className="!h-9 !rounded-md !border-[#D5D2E2] !px-3.5 !text-[13px] !font-semibold !text-[#2D2061]"
        >
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
        {detail.performanceMetrics.map((metric) => (
          <div
            key={metric.id}
            className="rounded-xl bg-[#F5F4F9] px-3 py-3 text-center"
          >
            <p className="text-[10px] font-semibold tracking-[0.06em] text-[#8B8B9E]">
              {metric.label}
            </p>
            <p className="mt-1 text-xl font-bold tabular-nums text-[#2D2061]">
              {metric.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <section className={cardClass}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[#2D2061]">
              Engagement Funnel
            </h3>
            <label className="inline-flex items-center gap-1.5 text-xs text-[#8B8B9E]">
              Activity Period:
              <select
                value={activityPeriod}
                onChange={(event) => setActivityPeriod(event.target.value)}
                className="h-8 rounded-md border border-[#D5D2E2] bg-white px-2 text-xs font-semibold text-[#2D2061]"
              >
                <option value="All">All</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </label>
          </div>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-3 lg:gap-5">
            <FunnelColumn funnel={detail.funnels[0]} />
            <FunnelBridge
              percent={detail.funnelBridgePercent}
              label={detail.funnelBridgeLabel}
            />
            <FunnelColumn funnel={detail.funnels[1]} />
          </div>
        </section>

        <section className={cardClass}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-[#2D2061]">
              Performance Trend
            </h3>
            <label className="inline-flex items-center gap-1.5 text-xs text-[#8B8B9E]">
              Message:
              <select
                value={trendMessageId}
                onChange={(event) => setTrendMessageId(event.target.value)}
                className="h-8 rounded-md border border-[#D5D2E2] bg-white px-2 text-xs font-semibold text-[#2D2061]"
              >
                {detail.funnels.map((funnel) => (
                  <option key={funnel.id} value={funnel.id}>
                    {funnel.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <PerformanceTrendChart
            points={detail.trend}
            hoverIndex={hoverIndex}
            onHover={setHoverIndex}
          />
          <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-medium text-[#5B6178]">
            <LegendDot color="#22C55E" label="Delivery Rate" />
            <LegendDot color="#EAB308" label="Open Rate" />
            <LegendDot color="#8B5CF6" label="Click Rate" />
            <LegendDot color="#F43F5E" label="Reply Rate" />
          </div>
        </section>
      </div>

      <section className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-[#2D2061]">Candidate Activity</h3>
        <div className="relative min-w-0">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type here to search"
            aria-label="Search candidates"
            className="h-11 w-full rounded-[5px] border border-[#E0DDEA] bg-white py-2 pl-11 pr-12 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
          <span
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#5B8DEF]"
            aria-hidden="true"
          >
            <Send className="size-4" strokeWidth={1.75} />
          </span>
        </div>

        <DataTable>
          <DataTableHead>
            <DataTableSortHeader label="Name" />
            <DataTableTh>Email</DataTableTh>
            <DataTableSortHeader label="Delivered" />
            <DataTableSortHeader label="Opened" />
            <DataTableSortHeader label="Last Updated" />
            <DataTableTh>Action</DataTableTh>
          </DataTableHead>
          <DataTableBody>
            {activityRows.map((row) => (
              <DataTableRow key={row.id}>
                <DataTableTd strong>{row.name}</DataTableTd>
                <DataTableTd>{row.email}</DataTableTd>
                <DataTableTd>{row.delivered}</DataTableTd>
                <DataTableTd>{row.opened}</DataTableTd>
                <DataTableTd>{row.lastUpdated}</DataTableTd>
                <DataTableTd>
                  <button
                    type="button"
                    onClick={() =>
                      toast.success(`Message history for ${row.name}.`, {
                        title: TOAST_TITLE,
                      })
                    }
                    className="text-sm font-semibold text-[#2D2061] underline-offset-2 hover:underline"
                  >
                    Message History
                  </button>
                </DataTableTd>
              </DataTableRow>
            ))}
            {activityRows.length === 0 ? (
              <DataTableEmpty colSpan={6}>
                No candidates match your search.
              </DataTableEmpty>
            ) : null}
          </DataTableBody>
        </DataTable>
      </section>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="size-2.5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}

function FunnelBridge({ percent, label }: { percent: string; label: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-center px-1 text-center">
      <p className="text-lg font-bold tabular-nums text-[#2D2061]">{percent}</p>
      <svg
        width="36"
        height="14"
        viewBox="0 0 36 14"
        className="my-1 text-[#9CA3AF]"
        aria-hidden="true"
      >
        <path
          d="M2 7h28M24 2l8 5-8 5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="max-w-[6.5rem] text-[11px] font-medium leading-snug text-[#5B6178]">
        {label}
      </p>
    </div>
  )
}

/** Fixed taper widths (% of funnel) so both columns match the attached design. */
const FUNNEL_BAND_WIDTHS = [100, 88, 74, 58, 44]

function FunnelColumn({ funnel }: { funnel?: CampaignFunnelMessage }) {
  if (!funnel) return null
  const stageCount = funnel.stages.length
  const bandH = 52
  const gap = 2
  const svgW = 220
  const svgH = stageCount * bandH + (stageCount - 1) * gap
  const cx = svgW / 2

  return (
    <div className="flex w-full max-w-[14.5rem] flex-col items-center">
      <p className="mb-3 text-center text-sm font-bold text-[#2D2061]">
        {funnel.label}
      </p>
      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="h-auto w-full"
        role="img"
        aria-label={`${funnel.label} engagement funnel`}
      >
        {funnel.stages.map((stage, index) => {
          const topW =
            (svgW * (FUNNEL_BAND_WIDTHS[index] ?? 44)) / 100
          const bottomW =
            index === stageCount - 1
              ? topW * 0.82
              : (svgW * (FUNNEL_BAND_WIDTHS[index + 1] ?? 44)) / 100
          const y = index * (bandH + gap)
          const topL = cx - topW / 2
          const topR = cx + topW / 2
          const botL = cx - bottomW / 2
          const botR = cx + bottomW / 2
          const points = `${topL},${y} ${topR},${y} ${botR},${y + bandH} ${botL},${y + bandH}`
          const textY = y + bandH / 2

          return (
            <g key={stage.key}>
              <polygon points={points} fill={stage.color} />
              <text
                x={cx}
                y={textY - 6}
                textAnchor="middle"
                fill="#ffffff"
                style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em' }}
              >
                {stage.label}
              </text>
              <text
                x={cx}
                y={textY + 10}
                textAnchor="middle"
                fill="#ffffff"
                style={{ fontSize: 14, fontWeight: 700 }}
              >
                {stage.count.toLocaleString()}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function PerformanceTrendChart({
  points,
  hoverIndex,
  onHover,
}: {
  points: CampaignTrendPoint[]
  hoverIndex: number | null
  onHover: (index: number | null) => void
}) {
  const width = 560
  const height = 240
  const pad = { top: 16, right: 12, bottom: 36, left: 36 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom

  function xFor(index: number) {
    if (points.length <= 1) return pad.left + innerW / 2
    return pad.left + (index / (points.length - 1)) * innerW
  }

  function yFor(value: number) {
    return pad.top + innerH - (value / 100) * innerH
  }

  function pathFor(
    key: keyof Omit<CampaignTrendPoint, 'label'>,
  ): string {
    return points
      .map((point, index) => {
        const x = xFor(index)
        const y = yFor(point[key])
        return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
      })
      .join(' ')
  }

  const series = [
    { key: 'deliveryRate' as const, color: '#22C55E', label: 'Delivery Rate' },
    { key: 'openRate' as const, color: '#EAB308', label: 'Open Rate' },
    { key: 'clickRate' as const, color: '#8B5CF6', label: 'Click Rate' },
    { key: 'replyRate' as const, color: '#F43F5E', label: 'Reply Rate' },
  ]

  const active = hoverIndex != null ? points[hoverIndex] : null

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Performance trend"
      >
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = yFor(tick)
          return (
            <g key={tick}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y}
                y2={y}
                stroke="#ECEAF3"
                strokeWidth={1}
              />
              <text
                x={pad.left - 8}
                y={y + 3}
                textAnchor="end"
                fill="#9B97AE"
                style={{ fontSize: 9 }}
              >
                {tick}%
              </text>
            </g>
          )
        })}

        {series.map((item) => (
          <path
            key={item.key}
            d={pathFor(item.key)}
            fill="none"
            stroke={item.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}

        {points.map((point, index) => {
          const x = xFor(index)
          return (
            <g key={point.label}>
              <rect
                x={x - innerW / points.length / 2}
                y={pad.top}
                width={innerW / points.length}
                height={innerH}
                fill="transparent"
                onMouseEnter={() => onHover(index)}
                onMouseLeave={() => onHover(null)}
              />
              <text
                x={x}
                y={height - 10}
                textAnchor="middle"
                fill="#9B97AE"
                style={{ fontSize: 8 }}
              >
                {point.label.replace(/ 20\d{2}$/, '')}
              </text>
            </g>
          )
        })}

        {hoverIndex != null ? (
          <line
            x1={xFor(hoverIndex)}
            x2={xFor(hoverIndex)}
            y1={pad.top}
            y2={pad.top + innerH}
            stroke="#C9C4D8"
            strokeDasharray="4 3"
          />
        ) : null}
      </svg>

      {active && hoverIndex != null ? (
        <div
          className="pointer-events-none absolute z-10 min-w-[9.5rem] rounded-lg bg-[#1F1A33] px-3 py-2 text-[11px] text-white shadow-lg"
          style={{
            left: `clamp(0px, calc(${(hoverIndex / Math.max(points.length - 1, 1)) * 100}% - 4.75rem), calc(100% - 10rem))`,
            top: 8,
          }}
        >
          <p className="mb-1 font-semibold text-[#C9C4D8]">{active.label}</p>
          {series.map((item) => (
            <p key={item.key} className="flex justify-between gap-3">
              <span style={{ color: item.color }}>{item.label}</span>
              <span className="tabular-nums">{active[item.key].toFixed(1)}%</span>
            </p>
          ))}
        </div>
      ) : null}
    </div>
  )
}
