import { Check, MapPin, Plus } from 'lucide-react'
import { Button } from '../ui'
import type { ExternalCandidate } from '../../data/externalCandidates'

export type ExternalCandidateCardProps = {
  candidate: ExternalCandidate
  added: boolean
  onViewCv: () => void
  onAddToJob: () => void
}

/**
 * Sourced (external) candidate — headline, location, LinkedIn, skills,
 * with View CV / Add to Job actions.
 */
export function ExternalCandidateCard({
  candidate,
  added,
  onViewCv,
  onAddToJob,
}: ExternalCandidateCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-xl border border-[#E4E1EE] bg-white p-4 sm:flex-row sm:items-start">
      <div className="min-w-0 flex-1">
        <h3 className="text-[15px] font-bold text-[#1A1A2E]">{candidate.name}</h3>
        <p className="mt-0.5 text-[13px] font-semibold leading-snug text-[#6D5BD0]">
          {candidate.headline}
        </p>
        <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[#6B6B80]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5 text-[#E53935]" strokeWidth={2} aria-hidden="true" />
            {candidate.location}
          </span>
          {candidate.linkedinUrl ? (
            <a
              href={candidate.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-[#2F6FD6] underline underline-offset-2 hover:text-[#1F57B0]"
            >
              LinkedIn
            </a>
          ) : null}
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${candidate.name} skills`}>
          {candidate.skills.map((skill) => (
            <li
              key={skill}
              className="rounded-full bg-[#EFEAFB] px-2.5 py-1 text-xs text-[#6D5BD0]"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex shrink-0 gap-2 sm:w-36 sm:flex-col">
        <Button
          type="button"
          variant="outline"
          onClick={onViewCv}
          className="!h-9 flex-1 !rounded-md border-[#D5D2E2] bg-white text-sm font-medium text-[#2D2061] hover:bg-[#F7F6FB] sm:flex-none"
        >
          View CV
        </Button>
        <Button
          type="button"
          onClick={onAddToJob}
          disabled={added}
          className="!h-10 flex-1 !rounded-md !bg-[#2D2061] text-sm font-semibold text-white hover:!bg-[#241a52] disabled:!bg-[#E6F6EC] disabled:!text-[#15803D] sm:flex-none"
        >
          {added ? (
            <>
              <Check className="size-4" strokeWidth={2.25} aria-hidden="true" />
              Added
            </>
          ) : (
            <>
              <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
              Add to Job
            </>
          )}
        </Button>
      </div>
    </article>
  )
}
