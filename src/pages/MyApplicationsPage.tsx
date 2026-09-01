import { useMemo, useState } from 'react'
import { PageContainer, PageHeader } from '../components/layout'
import {
  MyApplicationCard,
  MyApplicationDetailsPanel,
  MyApplicationsFiltersPanel,
  MyApplicationsSearchBar,
} from '../components/my-applications'
import {
  countMyApplicationFilters,
  emptyMyApplicationFilters,
  filterMyApplications,
  getMyApplicationFilterOptions,
  getMyApplications,
  type MyApplication,
  type MyApplicationFilters,
} from '../data/myApplications'

/**
 * Candidate portal — My Applications list.
 */
export function MyApplicationsPage() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<MyApplicationFilters>(
    emptyMyApplicationFilters,
  )
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] =
    useState<MyApplication | null>(null)
  const applications = useMemo(() => getMyApplications(), [])
  const filterOptions = useMemo(
    () => getMyApplicationFilterOptions(applications),
    [applications],
  )
  const activeFilterCount = countMyApplicationFilters(filters)

  const filtered = useMemo(
    () => filterMyApplications(applications, query, filters),
    [applications, query, filters],
  )

  return (
    <>
      <PageContainer contentClassName="gap-0">
        <PageHeader
          title="My Applications"
          subtitle="Track jobs you have applied to and your application status."
        />
        <MyApplicationsSearchBar
          className="mt-5 border-b border-[#E8E6F0] pb-5"
          value={query}
          onChange={setQuery}
          activeFilterCount={activeFilterCount}
          onFilterClick={() => setFiltersOpen(true)}
        />

        <div className="flex flex-col gap-3 pt-5">
          {filtered.map((application) => (
            <MyApplicationCard
              key={application.id}
              application={application}
              onOpen={setSelectedApplication}
            />
          ))}

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#E0DDEA] bg-[#FAFAFC] px-6 py-12 text-center">
              <p className="text-sm font-semibold text-[#2D2061]">
                No applications found
              </p>
              <p className="mt-1 text-sm text-[#8B8B9E]">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : null}
        </div>
      </PageContainer>

      <MyApplicationsFiltersPanel
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        options={filterOptions}
        onApply={setFilters}
      />

      <MyApplicationDetailsPanel
        open={selectedApplication !== null}
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
      />
    </>
  )
}
