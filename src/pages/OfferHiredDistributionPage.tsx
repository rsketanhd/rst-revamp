import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import {
  GroupedVerticalBarChart,
  HorizontalBarChart,
  JobStatisticsAdditionalFiltersPanel,
  ReportChartPanel,
  ReportFiltersBar,
  ReportMetricGrid,
  ReportSegmentedTabs,
  ReportSimpleTable,
  countActiveAdditionalFilters,
  type JobStatisticsAdditionalFilters,
} from '../components/reports'
import { Button, Select, toast } from '../components/ui'
import { JOB_STATISTICS_DATE_RANGE_OPTIONS } from '../data/jobStatisticsOverview'
import {
  OFFER_HIRED_ACTIVITY_PERIODS,
  OFFER_HIRED_BREAKDOWN_OPTIONS,
  OFFER_HIRED_DISPLAY_OPTIONS,
  OFFER_HIRED_METRICS,
  OFFER_HIRED_MONTHLY,
  OFFER_HIRED_OFFER_BREAKDOWN_OPTIONS,
  getOfferHiredBreakdownBars,
  type OfferHiredBreakdownGrouping,
} from '../data/offerHiredDistribution'
import {
  combineFilterFactor,
  getActivityPeriodFactor,
  getActivityPeriodMonthCount,
  getDateRangeFactor,
  scaleBarValues,
  scaleInteger,
  scaleOfferMetrics,
  takeTrailingMonths,
} from '../data/reportFilterUtils'

const INITIAL_ADDITIONAL_FILTERS: JobStatisticsAdditionalFilters = {
  department: 'Technology',
  location: 'United Kingdom',
  employmentType: 'Permanent',
  source: 'Agency',
}

function additionalFiltersFactor(
  filters: JobStatisticsAdditionalFilters,
): number {
  let factor = 1
  if (filters.department && !filters.department.startsWith('All')) {
    factor *= filters.department === 'Technology' ? 1.05 : 0.93
  }
  if (filters.location && !filters.location.startsWith('All')) {
    factor *= 0.97
  }
  if (filters.employmentType && !filters.employmentType.startsWith('All')) {
    factor *= 0.96
  }
  if (filters.source && !filters.source.startsWith('All')) {
    factor *= filters.source === 'Agency' ? 1.08 : 1.02
  }
  return factor
}

/**
 * Offer & Hired Distribution — metrics, breakdown bars, and monthly offers.
 */
export function OfferHiredDistributionPage() {
  const [lastStatusChange, setLastStatusChange] = useState('2024-01')
  const [jobCreationDate, setJobCreationDate] = useState('2024-01')
  const [employmentGrouping, setEmploymentGrouping] =
    useState<OfferHiredBreakdownGrouping>('scientific-specialty')
  const [offerGrouping, setOfferGrouping] =
    useState<OfferHiredBreakdownGrouping>('scientific-specialty')
  const [employmentDisplay, setEmploymentDisplay] = useState('diagram')
  const [offerDisplay, setOfferDisplay] = useState('diagram')
  const [employmentPeriod, setEmploymentPeriod] = useState('last-6-months')
  const [offerPeriod, setOfferPeriod] = useState('last-6-months')
  const [monthlyDisplay, setMonthlyDisplay] = useState('diagram')
  const [monthlyPeriod, setMonthlyPeriod] = useState('last-12-months')
  const [additionalFilters, setAdditionalFilters] =
    useState<JobStatisticsAdditionalFilters>(INITIAL_ADDITIONAL_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const additionalFilterCount = useMemo(
    () => countActiveAdditionalFilters(additionalFilters),
    [additionalFilters],
  )

  const globalDateFactor = useMemo(
    () =>
      combineFilterFactor(
        getDateRangeFactor(lastStatusChange),
        getDateRangeFactor(jobCreationDate),
        1,
        additionalFiltersFactor(additionalFilters),
      ),
    [additionalFilters, jobCreationDate, lastStatusChange],
  )

  const metrics = useMemo(
    () =>
      scaleOfferMetrics(
        OFFER_HIRED_METRICS,
        globalDateFactor * getActivityPeriodFactor(monthlyPeriod),
      ),
    [globalDateFactor, monthlyPeriod],
  )

  const employmentBars = useMemo(() => {
    const factor =
      globalDateFactor * getActivityPeriodFactor(employmentPeriod)
    return scaleBarValues(
      getOfferHiredBreakdownBars(employmentGrouping),
      factor,
    )
  }, [employmentGrouping, employmentPeriod, globalDateFactor])

  const offerBars = useMemo(() => {
    const factor = globalDateFactor * getActivityPeriodFactor(offerPeriod)
    return scaleBarValues(getOfferHiredBreakdownBars(offerGrouping), factor)
  }, [globalDateFactor, offerGrouping, offerPeriod])

  const employmentXMax = useMemo(() => {
    const peak = Math.max(...employmentBars.map((item) => item.value), 1)
    return Math.max(85, Math.ceil(peak / 5) * 5)
  }, [employmentBars])

  const offerXMax = useMemo(() => {
    const peak = Math.max(...offerBars.map((item) => item.value), 1)
    return Math.max(85, Math.ceil(peak / 5) * 5)
  }, [offerBars])

  const monthlyItems = useMemo(() => {
    const monthCount = getActivityPeriodMonthCount(monthlyPeriod)
    const factor =
      globalDateFactor * getActivityPeriodFactor(monthlyPeriod)
    return takeTrailingMonths(OFFER_HIRED_MONTHLY, monthCount).map((item) => ({
      ...item,
      application: scaleInteger(item.application, factor),
      recommendation: scaleInteger(item.recommendation, factor),
    }))
  }, [globalDateFactor, monthlyPeriod])

  const monthlyYMax = useMemo(() => {
    const peak = Math.max(
      ...monthlyItems.flatMap((item) => [
        item.application,
        item.recommendation,
      ]),
      1,
    )
    return Math.max(70, Math.ceil(peak / 10) * 10)
  }, [monthlyItems])

  const employmentTableRows = employmentBars.map((item) => ({
    category: item.label,
    jobs: item.value,
  }))

  const offerTableRows = offerBars.map((item) => ({
    category: item.label,
    offers: item.value,
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
        title="Offer & Hired Distribution"
        subtitle="Agency · Candidate Forwarding Intelligence"
        actions={
          <Button
            type="button"
            onClick={() =>
              toast.success('Preparing export for Offer & Hired Distribution.', {
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
        lastStatusLabel="Date of last status change"
        jobCreationLabel="Date of job creation"
        additionalFilterCount={additionalFilterCount}
        onAdditionalFilters={() => setFiltersOpen(true)}
      />

      <ReportMetricGrid items={metrics} />

      <ReportChartPanel
        title="Employment Distribution Analysis"
        toolbar={
          <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <ReportSegmentedTabs
              aria-label="Employment distribution grouping"
              value={employmentGrouping}
              options={OFFER_HIRED_BREAKDOWN_OPTIONS}
              onChange={setEmploymentGrouping}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="w-full sm:w-40">
                <Select
                  id="employment-display-by"
                  label="Display by"
                  options={OFFER_HIRED_DISPLAY_OPTIONS}
                  value={employmentDisplay}
                  placeholder="Select"
                  onChange={(e) => setEmploymentDisplay(e.target.value)}
                  className="!h-10 bg-white"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  id="employment-activity-period"
                  label="Activity period"
                  options={OFFER_HIRED_ACTIVITY_PERIODS}
                  value={employmentPeriod}
                  placeholder="Select"
                  onChange={(e) => setEmploymentPeriod(e.target.value)}
                  className="!h-10 bg-white"
                />
              </div>
            </div>
          </div>
        }
      >
        {employmentDisplay === 'table' ? (
          <ReportSimpleTable
            columns={[
              { key: 'category', header: 'Category' },
              { key: 'jobs', header: 'Jobs', align: 'right' },
            ]}
            rows={employmentTableRows}
          />
        ) : (
          <HorizontalBarChart
            items={employmentBars}
            xMax={employmentXMax}
            xUnit=""
            xTickStep={5}
            leftPad={190}
            defaultBarColor="#2D2061"
            yAxisLabel="Jobs"
            rowHeight={26}
            barThickness={7}
            barRadius={3.5}
          />
        )}
      </ReportChartPanel>

      <ReportChartPanel
        title="Analysis of Offer Distribution"
        toolbar={
          <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <ReportSegmentedTabs
              aria-label="Offer distribution grouping"
              value={offerGrouping}
              options={OFFER_HIRED_OFFER_BREAKDOWN_OPTIONS}
              onChange={setOfferGrouping}
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="w-full sm:w-40">
                <Select
                  id="offer-display-by"
                  label="Display by"
                  options={OFFER_HIRED_DISPLAY_OPTIONS}
                  value={offerDisplay}
                  placeholder="Select"
                  onChange={(e) => setOfferDisplay(e.target.value)}
                  className="!h-10 bg-white"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  id="offer-activity-period"
                  label="Activity period"
                  options={OFFER_HIRED_ACTIVITY_PERIODS}
                  value={offerPeriod}
                  placeholder="Select"
                  onChange={(e) => setOfferPeriod(e.target.value)}
                  className="!h-10 bg-white"
                />
              </div>
            </div>
          </div>
        }
      >
        {offerDisplay === 'table' ? (
          <ReportSimpleTable
            columns={[
              { key: 'category', header: 'Category' },
              { key: 'offers', header: 'Offers', align: 'right' },
            ]}
            rows={offerTableRows}
          />
        ) : (
          <HorizontalBarChart
            items={offerBars}
            xMax={offerXMax}
            xUnit=""
            xTickStep={5}
            leftPad={190}
            defaultBarColor="#2D2061"
            yAxisLabel="Jobs"
            rowHeight={26}
            barThickness={7}
            barRadius={3.5}
          />
        )}
      </ReportChartPanel>

      <ReportChartPanel
        title="Monthly Offers"
        toolbar={
          <div className="flex w-full flex-col gap-3 xl:flex-row xl:items-center xl:justify-end">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="w-full sm:w-40">
                <Select
                  id="monthly-display-by"
                  label="Display by"
                  options={OFFER_HIRED_DISPLAY_OPTIONS}
                  value={monthlyDisplay}
                  placeholder="Select"
                  onChange={(e) => setMonthlyDisplay(e.target.value)}
                  className="!h-10 bg-white"
                />
              </div>
              <div className="w-full sm:w-48">
                <Select
                  id="monthly-offers-period"
                  label="Activity period"
                  options={OFFER_HIRED_ACTIVITY_PERIODS}
                  value={monthlyPeriod}
                  placeholder="Select"
                  onChange={(e) => setMonthlyPeriod(e.target.value)}
                  className="!h-10 bg-white"
                />
              </div>
            </div>
          </div>
        }
      >
        {monthlyDisplay === 'table' ? (
          <ReportSimpleTable
            columns={[
              { key: 'month', header: 'Month' },
              { key: 'application', header: 'Application', align: 'right' },
              {
                key: 'recommendation',
                header: 'Recommendation',
                align: 'right',
              },
            ]}
            rows={monthlyItems.map((item) => ({
              month: item.month,
              application: item.application,
              recommendation: item.recommendation,
            }))}
          />
        ) : (
          <GroupedVerticalBarChart
            items={monthlyItems}
            yMax={monthlyYMax}
            barThickness={6}
          />
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
