import { useMemo, useState } from 'react'
import { PageContainer, PageHeader } from '../components/layout'
import {
  MyApplicationCard,
  MyApplicationDetailsPanel,
  MyApplicationsSearchBar,
} from '../components/my-applications'
import {
  filterMyApplications,
  getMyApplications,
  type MyApplication,
} from '../data/myApplications'

/**
 * Candidate portal — My Applications list.
 */
export function MyApplicationsPage() {
  const [query, setQuery] = useState('')
  const [selectedApplication, setSelectedApplication] =
    useState<MyApplication | null>(null)
  const applications = useMemo(() => getMyApplications(), [])

  const filtered = useMemo(
    () => filterMyApplications(applications, query),
    [applications, query],
  )

  return (
    <>
      <PageContainer contentClassName="gap-5">
        <PageHeader
          title="My Applications"
          subtitle="Track the status of jobs you have applied to."
        />
        <MyApplicationsSearchBar value={query} onChange={setQuery} />

        <div className="flex flex-col gap-3">
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
                Try a different search term.
              </p>
            </div>
          ) : null}
        </div>
      </PageContainer>

      <MyApplicationDetailsPanel
        open={selectedApplication !== null}
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
      />
    </>
  )
}
