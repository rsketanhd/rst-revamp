import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import {
  JobStatisticsAdditionalFiltersPanel,
  JobStatisticsChartSection,
  ReportFiltersBar,
  ReportKpiGrid,
  countActiveAdditionalFilters,
  type JobStatisticsAdditionalFilters,
} from '../components/reports'
import { Button, toast } from '../components/ui'
import {
  JOB_STATISTICS_DATE_RANGE_OPTIONS,
  JOB_STATISTICS_KPIS,
  type JobStatisticsGrouping,
} from '../data/jobStatisticsOverview'
import {
  combineFilterFactor,
  getActivityPeriodFactor,
  getDateRangeFactor,
  scaleKpis,
} from '../data/reportFilterUtils'

const INITIAL_ADDITIONAL_FILTERS: JobStatisticsAdditionalFilters = {
  department: 'Technology',
  location: 'United Kingdom',
  employmentType: 'Permanent',
  source: '',
}

function additionalFiltersFactor(
  filters: JobStatisticsAdditionalFilters,
): number {
  let factor = 1
  if (filters.department && !filters.department.startsWith('All')) {
    factor *= filters.department === 'Technology' ? 1.06 : 0.94
  }
  if (filters.location && !filters.location.startsWith('All')) {
    factor *= 0.98
  }
  if (filters.employmentType && !filters.employmentType.startsWith('All')) {
    factor *= 0.97
  }
  if (filters.source && !filters.source.startsWith('All')) {
    factor *= 1.04
  }
  return factor
}

/**
 * Job Statistics Overview — KPI strip + filterable hiring-time charts.
 */
export function JobStatisticsOverviewPage() {
  const [lastStatusChange, setLastStatusChange] = useState('2024-01')
  const [jobCreationDate, setJobCreationDate] = useState('2024-01')
  const [activityPeriod, setActivityPeriod] = useState('last-6-months')
  const [grouping, setGrouping] =
    useState<JobStatisticsGrouping>('recent-graduates')
  const [additionalFilters, setAdditionalFilters] =
    useState<JobStatisticsAdditionalFilters>(INITIAL_ADDITIONAL_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const additionalFilterCount = useMemo(
    () => countActiveAdditionalFilters(additionalFilters),
    [additionalFilters],
  )

  const filterFactor = useMemo(
    () =>
      combineFilterFactor(
        getDateRangeFactor(lastStatusChange),
        getDateRangeFactor(jobCreationDate),
        getActivityPeriodFactor(activityPeriod),
        additionalFiltersFactor(additionalFilters),
      ),
    [activityPeriod, additionalFilters, jobCreationDate, lastStatusChange],
  )

  const kpis = useMemo(
    () => scaleKpis(JOB_STATISTICS_KPIS, filterFactor),
    [filterFactor],
  )

  function handleExport() {
    toast.success('Preparing export for Job Statistics Overview.', {
      title: 'Export All',
    })
  }

  return (
    <PageContainer contentClassName="gap-5">
      <div>
        <Link
          to="/reports#job-reports"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2D2061] transition-colors hover:text-[#241a52]"
        >
          <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
          Return to Reports
        </Link>
      </div>

      <PageHeader
        title="Job Statistics Overview"
        subtitle="View key job metrics, application activity, and source performance."
        actions={
          <Button
            type="button"
            onClick={handleExport}
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
      />

      <ReportKpiGrid items={kpis} />

      <JobStatisticsChartSection
        grouping={grouping}
        onGroupingChange={setGrouping}
        activityPeriod={activityPeriod}
        onActivityPeriodChange={setActivityPeriod}
        filterFactor={filterFactor}
      />

      <JobStatisticsAdditionalFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={additionalFilters}
        onApply={setAdditionalFilters}
      />
    </PageContainer>
  )
}
