import { useEffect, useState } from 'react'
import { CornerDownRight, Loader2 } from 'lucide-react'
import { Button, toast } from '../ui'
import {
  fetchCandidateSearchResults,
  type CandidateSearchSource,
  type ExternalCandidate,
} from '../../data/externalCandidates'
import { ExternalCandidateCard } from './ExternalCandidateCard'

const EMPTY_TEXT: Record<CandidateSearchSource, string> = {
  global: 'No more global candidates for this job.',
  database: 'No more matching candidates in your database.',
}

export type CandidateSearchResultsProps = {
  source: CandidateSearchSource
  /** e.g. "RST1342 : Senior Data Analyst" */
  jobLabel: string
  onAddedCountChange?: (count: number) => void
}

/**
 * Paged candidate results (Global / Database search) with View CV and
 * Add to Job — rendered inside the Add/Fetch Candidate side panel.
 */
export function CandidateSearchResults({
  source,
  jobLabel,
  onAddedCountChange,
}: CandidateSearchResultsProps) {
  const [candidates, setCandidates] = useState<ExternalCandidate[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addedIds, setAddedIds] = useState<string[]>([])

  // Load the first page whenever the source changes
  useEffect(() => {
    const first = fetchCandidateSearchResults(source, 0)
    setCandidates(first.items)
    setHasMore(first.hasMore)
    setPage(1)
    setAddedIds([])
    setLoading(false)
  }, [source])

  function fetchMore() {
    setLoading(true)
    // Simulated network delay
    window.setTimeout(() => {
      const next = fetchCandidateSearchResults(source, page)
      setCandidates((current) => [...current, ...next.items])
      setHasMore(next.hasMore)
      setPage((p) => p + 1)
      setLoading(false)
    }, 600)
  }

  useEffect(() => {
    onAddedCountChange?.(addedIds.length)
  }, [addedIds, onAddedCountChange])

  function addToJob(candidate: ExternalCandidate) {
    setAddedIds((ids) => [...ids, candidate.id])
    toast.success(`${candidate.name} added to ${jobLabel}.`, {
      title: 'Add to Job',
    })
  }

  return (
    <div className="flex flex-col gap-3">
      {candidates.map((candidate) => (
        <ExternalCandidateCard
          key={candidate.id}
          candidate={candidate}
          added={addedIds.includes(candidate.id)}
          onViewCv={() =>
            toast.success(`Opening ${candidate.name}'s CV.`, { title: 'View CV' })
          }
          onAddToJob={() => addToJob(candidate)}
        />
      ))}

      {hasMore ? (
        <Button
          type="button"
          variant="outline"
          onClick={fetchMore}
          disabled={loading}
          className="!h-9 w-fit !rounded-md border-[#D5D2E2] bg-white px-3 text-[13px] font-medium text-[#2D2061] hover:bg-[#F7F6FB]"
        >
          {loading ? (
            <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <CornerDownRight className="size-3.5" aria-hidden="true" />
          )}
          {loading ? 'Fetching…' : 'Fetch more candidates'}
        </Button>
      ) : (
        <p className="text-xs text-[#8B8B9E]">{EMPTY_TEXT[source]}</p>
      )}
    </div>
  )
}
