import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import {
  JobStatisticsAdditionalFiltersPanel,
  LabeledLineChart,
  ReportChartPanel,
  ReportFiltersBar,
  ReportHighlightStatRow,
  ReportSegmentedTabs,
  ReportSimpleTable,
  VerticalBarChart,
  countActiveAdditionalFilters,
  type JobStatisticsAdditionalFilters,
} from '../components/reports'
import { Button, Checkbox, Select, toast } from '../components/ui'
import {
  HIRING_STAGE_DISTRIBUTION_OPTIONS,
  HIRING_STAGE_DISTRIBUTION_STATS,
  HIRING_STAGE_TRANSITIONS,
  getHiringStageDistributionBars,
  getHiringStageTrend,
  type HiringStageDistributionGrouping,
  type HiringStageTransitionId,
} from '../data/hiringStageTimeAnalytics'
import {
  JOB_STATISTICS_ACTIVITY_PERIODS,
  JOB_STATISTICS_DATE_RANGE_OPTIONS,
  REPORT_DISPLAY_OPTIONS,
} from '../data/jobStatisticsOverview'
import {
  combineFilterFactor,
  getActivityPeriodFactor,
  getActivityPeriodMonthCount,
  getDateRangeFactor,
  scaleBarValues,
  scaleHighlightStats,
  scaleInteger,
  takeTrailingMonths,
} from '../data/reportFilterUtils'

const INITIAL_ADDITIONAL_FILTERS: JobStatisticsAdditionalFilters = {
  department: 'Technology',
  location: 'United Kingdom',
  employmentType: 'Permanent',
  source: '',
}

/**
 * Hiring Stage Time Analytics — distribution bars + stage transition trends.
 */
export function HiringStageTimeAnalyticsPage() {
  const [lastStatusChange, setLastStatusChange] = useState('2024-01')
  const [jobCreationDate, setJobCreationDate] = useState('2024-01')
  const [saiEnabled, setSaiEnabled] = useState(true)
  const [manualEnabled, setManualEnabled] = useState(false)
  const [grouping, setGrouping] =
    useState<HiringStageDistributionGrouping>('employee-group')
  const [distributionDisplay, setDistributionDisplay] = useState('diagram')
  const [stageDisplay, setStageDisplay] = useState('diagram')
  const [activityPeriod, setActivityPeriod] = useState('last-12-months')
  const [transitionId, setTransitionId] =
    useState<HiringStageTransitionId>('shortlist-evaluation')
  const [additionalFilters, setAdditionalFilters] =
    useState<JobStatisticsAdditionalFilters>(INITIAL_ADDITIONAL_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const additionalFilterCount = useMemo(
    () => countActiveAdditionalFilters(additionalFilters),
    [additionalFilters],
  )

  const sourceModeFactor = useMemo(() => {
    if (saiEnabled && manualEnabled) return 1.12
    if (saiEnabled) return 1
    if (manualEnabled) return 0.78
    return 0.45
  }, [manualEnabled, saiEnabled])

  const filterFactor = useMemo(
    () =>
      combineFilterFactor(
        getDateRangeFactor(lastStatusChange),
        getDateRangeFactor(jobCreationDate),
        getActivityPeriodFactor(activityPeriod),
        sourceModeFactor *
          (additionalFilterCount > 0 ? 0.96 + additionalFilterCount * 0.02 : 1),
      ),
    [
      activityPeriod,
      additionalFilterCount,
      jobCreationDate,
      lastStatusChange,
      sourceModeFactor,
    ],
  )

  const distributionStats = useMemo(
    () => scaleHighlightStats(HIRING_STAGE_DISTRIBUTION_STATS, filterFactor),
    [filterFactor],
  )

  const distributionBars = useMemo(
    () =>
      scaleBarValues(getHiringStageDistributionBars(grouping), filterFactor),
    [filterFactor, grouping],
  )

  const distributionYMax = useMemo(() => {
    const peak = Math.max(...distributionBars.map((item) => item.value), 1)
    return Math.ceil(peak / 500) * 500
  }, [distributionBars])

  const trendPoints = useMemo(() => {
    const monthCount = getActivityPeriodMonthCount(activityPeriod)
    return takeTrailingMonths(
      getHiringStageTrend(transitionId),
      monthCount,
    ).map((point) => ({
      label: point.month,
      value: scaleInteger(point.value, 1 + (filterFactor - 1) * 0.22),
    }))
  }, [activityPeriod, filterFactor, transitionId])

  const trendYMax = useMemo(() => {
    const peak = Math.max(...trendPoints.map((point) => point.value), 1)
    return Math.max(45, Math.ceil(peak / 5) * 5)
  }, [trendPoints])

  const transitionOptions = HIRING_STAGE_TRANSITIONS.map((item) => ({
    value: item.id,
    label: `${item.label} (${scaleInteger(item.count, filterFactor)})`,
  }))

  return (
    <PageContainer contentClassName="gap-5">
      <div>
        <Link
          to="/reports#job-reports"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2D2061] transition-colors hover:text-[#241a52]"
        >
          <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
          Go Back to Reports
        </Link>
      </div>

      <PageHeader
        title="Hiring Stage Time Analytics"
        subtitle="Trends in accuracy and quality of predictions and the impact of data cleaning filters on AI model performance."
        actions={
          <Button
            type="button"
            onClick={() =>
              toast.success('Preparing export for Hiring Stage Time Analytics.', {
                title: 'Export All',
              })
            }
            className="!h-10 !rounded-md !bg-[#2D2061] px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Export All
          </Button>
        }
      />

      <ReportFiltersBar
        lastStatusChange={lastStatusChange}
        jobCreationDate={jobCreationDate}
        dateRangeOptions={JOB_STATISTICS_DATE_RANGE_OPTIONS}
        onLastStatusChange={setLastStatusChange}
        onJobCreationDateChange={setJobCreationDate}
        additionalFilterCount={additionalFilterCount}
        onAdditionalFilters={() => setFiltersOpen(true)}
        middle={
          <>
            <Checkbox
              id="hiring-stage-sai"
              label="SAI"
              checked={saiEnabled}
              onChange={(e) => setSaiEnabled(e.target.checked)}
            />
            <Checkbox
              id="hiring-stage-manual"
              label="Manual"
              checked={manualEnabled}
              onChange={(e) => setManualEnabled(e.target.checked)}
            />
          </>
        }
      />

      <ReportChartPanel
        title="Distribution Analysis"
        toolbar={
          <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <ReportSegmentedTabs
              aria-label="Distribution grouping"
              value={grouping}
              options={HIRING_STAGE_DISTRIBUTION_OPTIONS}
              onChange={setGrouping}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="w-full sm:w-40">
                <Select
                  id="distribution-display-by"
                  label="Display by"
                  options={REPORT_DISPLAY_OPTIONS}
                  value={distributionDisplay}
                  placeholder="Select"
                  onChange={(e) => setDistributionDisplay(e.target.value)}
                  className="!h-10 bg-white"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  id="distribution-activity-period"
                  label="Activity period"
                  options={JOB_STATISTICS_ACTIVITY_PERIODS}
                  value={activityPeriod}
                  placeholder="Select"
                  onChange={(e) => setActivityPeriod(e.target.value)}
                  className="!h-10 bg-white"
                />
              </div>
            </div>
          </div>
        }
      >
        <ReportHighlightStatRow items={distributionStats} />
        {distributionDisplay === 'table' ? (
          <ReportSimpleTable
            columns={[
              { key: 'category', header: 'Category' },
              { key: 'value', header: 'Numbers', align: 'right' },
            ]}
            rows={distributionBars.map((item) => ({
              category: item.label,
              value: item.value,
            }))}
          />
        ) : (
          <VerticalBarChart
            items={distributionBars}
            yMax={distributionYMax}
            barThickness={8}
          />
        )}
      </ReportChartPanel>

      <ReportChartPanel
        title="Average time between stages"
        toolbar={
          <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <ReportSegmentedTabs
              aria-label="Hiring stage transition"
              value={transitionId}
              options={transitionOptions}
              onChange={setTransitionId}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="w-full sm:w-40">
                <Select
                  id="stage-display-by"
                  label="Display by"
                  options={REPORT_DISPLAY_OPTIONS}
                  value={stageDisplay}
                  placeholder="Select"
                  onChange={(e) => setStageDisplay(e.target.value)}
                  className="!h-10 bg-white"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  id="hiring-stage-activity-period"
                  label="Activity period"
                  options={JOB_STATISTICS_ACTIVITY_PERIODS}
                  value={activityPeriod}
                  placeholder="Select"
                  onChange={(e) => setActivityPeriod(e.target.value)}
                  className="!h-10 bg-white"
                />
              </div>
            </div>
          </div>
        }
      >
        {stageDisplay === 'table' ? (
          <ReportSimpleTable
            columns={[
              { key: 'month', header: 'Month' },
              { key: 'days', header: 'Average days', align: 'right' },
            ]}
            rows={trendPoints.map((point) => ({
              month: point.label,
              days: point.value,
            }))}
          />
        ) : (
          <LabeledLineChart points={trendPoints} yMax={trendYMax} />
        )}
      </ReportChartPanel>

      <JobStatisticsAdditionalFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={additionalFilters}
        onApply={setAdditionalFilters}
      />
    </PageContainer>
  )
}
