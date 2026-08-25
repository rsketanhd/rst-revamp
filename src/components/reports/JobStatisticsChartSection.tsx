import { useMemo, useState } from 'react'
import { Select } from '../ui'
import { AreaLineChart } from './charts/AreaLineChart'
import { DonutChart } from './charts/DonutChart'
import { HorizontalBarChart } from './charts/HorizontalBarChart'
import { ReportChartPanel } from './ReportChartPanel'
import { ReportHighlightStatRow } from './ReportHighlightStatCard'
import { ReportSegmentedTabs } from './ReportSegmentedTabs'
import { ReportSimpleTable } from './ReportSimpleTable'
import {
  JOB_STATISTICS_ACTIVITY_PERIODS,
  JOB_STATISTICS_GROUPING_OPTIONS,
  REPORT_DISPLAY_OPTIONS,
  getJobStatisticsChartView,
  type JobStatisticsGrouping,
} from '../../data/jobStatisticsOverview'
import {
  getActivityPeriodMonthCount,
  scaleBarValues,
  scaleHighlightStats,
  scaleInteger,
  takeTrailingMonths,
} from '../../data/reportFilterUtils'

export type JobStatisticsChartSectionProps = {
  grouping: JobStatisticsGrouping
  onGroupingChange: (value: JobStatisticsGrouping) => void
  activityPeriod: string
  onActivityPeriodChange: (value: string) => void
  /** Combined factor from date filters / additional filters. */
  filterFactor?: number
}

/**
 * Average Time to Hire panel — grouping filters left; Activity Period + Display by right.
 */
export function JobStatisticsChartSection({
  grouping,
  onGroupingChange,
  activityPeriod,
  onActivityPeriodChange,
  filterFactor = 1,
}: JobStatisticsChartSectionProps) {
  const [displayBy, setDisplayBy] = useState('diagram')

  const view = useMemo(() => {
    const base = getJobStatisticsChartView(grouping)
    const monthCount = getActivityPeriodMonthCount(activityPeriod)
    const highlights = scaleHighlightStats(base.highlights, filterFactor)

    if (base.chartType === 'line' && base.line) {
      const points = takeTrailingMonths(base.line.points, monthCount).map(
        (point) => ({
          ...point,
          values: Object.fromEntries(
            Object.entries(point.values).map(([key, value]) => [
              key,
              scaleInteger(value, 1 + (filterFactor - 1) * 0.22),
            ]),
          ),
        }),
      )
      return {
        ...base,
        highlights,
        line: { ...base.line, points },
      }
    }

    if (base.chartType === 'bar' && base.bars) {
      return {
        ...base,
        highlights,
        bars: {
          ...base.bars,
          items: scaleBarValues(base.bars.items, 1 + (filterFactor - 1) * 0.22),
        },
      }
    }

    if (base.chartType === 'donut' && base.donut) {
      const slices = scaleBarValues(
        base.donut.slices,
        1 + (filterFactor - 1) * 0.22,
      )
      const centerValue = String(
        scaleInteger(
          Number(base.donut.centerValue),
          1 + (filterFactor - 1) * 0.22,
        ),
      )
      return {
        ...base,
        highlights,
        donut: { ...base.donut, slices, centerValue },
      }
    }

    return { ...base, highlights }
  }, [activityPeriod, filterFactor, grouping])

  const tableRows = useMemo(() => {
    if (view.chartType === 'bar' && view.bars) {
      return view.bars.items.map((item) => ({
        category: item.label,
        value: `${item.value}d`,
      }))
    }
    if (view.chartType === 'donut' && view.donut) {
      return view.donut.slices.map((item) => ({
        category: item.label,
        value: `${item.value}d`,
      }))
    }
    if (view.chartType === 'line' && view.line) {
      return view.line.points.map((point) => ({
        category: point.label,
        ...Object.fromEntries(
          Object.entries(point.values).map(([key, value]) => [key, `${value}d`]),
        ),
      }))
    }
    return []
  }, [view])

  const tableColumns = useMemo(() => {
    if (view.chartType === 'line' && view.line) {
      return [
        { key: 'category', header: 'Period' },
        ...view.line.series.map((series) => ({
          key: series.key,
          header: series.label,
          align: 'right' as const,
        })),
      ]
    }
    return [
      { key: 'category', header: 'Category' },
      { key: 'value', header: 'Value', align: 'right' as const },
    ]
  }, [view])

  return (
    <ReportChartPanel
      title={view.chartTitle}
      toolbar={
        <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <ReportSegmentedTabs
            aria-label="Group hiring metrics by"
            value={grouping}
            options={JOB_STATISTICS_GROUPING_OPTIONS}
            onChange={onGroupingChange}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full sm:w-40">
              <Select
                id="job-stats-display-by"
                label="Display by"
                options={REPORT_DISPLAY_OPTIONS}
                value={displayBy}
                placeholder="Select"
                onChange={(e) => setDisplayBy(e.target.value)}
                className="!h-10 bg-white"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                id="job-stats-activity-period"
                label="Activity Period"
                options={JOB_STATISTICS_ACTIVITY_PERIODS}
                value={activityPeriod}
                placeholder="Select"
                onChange={(e) => onActivityPeriodChange(e.target.value)}
                className="!h-10 bg-white"
              />
            </div>
          </div>
        </div>
      }
    >
      <ReportHighlightStatRow items={view.highlights} />

      {displayBy === 'table' ? (
        <ReportSimpleTable columns={tableColumns} rows={tableRows} />
      ) : (
        <>
          {view.chartType === 'line' && view.line ? (
            <AreaLineChart
              series={view.line.series}
              points={view.line.points}
              yMax={view.line.yMax}
            />
          ) : null}

          {view.chartType === 'bar' && view.bars ? (
            <HorizontalBarChart
              items={view.bars.items}
              xMax={view.bars.xMax}
              rowHeight={22}
              barThickness={5}
              barRadius={2.5}
              leftPad={108}
            />
          ) : null}

          {view.chartType === 'donut' && view.donut ? (
            <DonutChart
              slices={view.donut.slices}
              centerValue={view.donut.centerValue}
              centerLabel={view.donut.centerLabel}
            />
          ) : null}
        </>
      )}
    </ReportChartPanel>
  )
}
