import { Info } from 'lucide-react'
import { Select } from '../ui'
import { cn } from '../../lib/cn'
import {
  AI_SIMILAR_TALENT_POOLS,
  TALENT_POOL_EXPERIENCE_OPTIONS,
  TALENT_POOL_JOB_RADIUS_OPTIONS,
  TALENT_POOL_JOB_TITLE_OPTIONS,
  TALENT_POOL_LOCATION_OPTIONS,
  type SimilarTalentPoolMatch,
  type TalentPoolRefineCriteria,
} from './createTalentPoolData'

const REFINE_FIELDS: Array<{
  key: keyof TalentPoolRefineCriteria
  id: string
  label: string
  options: string[]
}> = [
  {
    key: 'jobTitle',
    id: 'talent-pool-job-title',
    label: 'Job Title',
    options: TALENT_POOL_JOB_TITLE_OPTIONS,
  },
  {
    key: 'locationPrimary',
    id: 'talent-pool-location',
    label: 'Location (Primary)',
    options: TALENT_POOL_LOCATION_OPTIONS,
  },
  {
    key: 'jobRadius',
    id: 'talent-pool-job-radius',
    label: 'Job Radius',
    options: TALENT_POOL_JOB_RADIUS_OPTIONS,
  },
  {
    key: 'experienceLevel',
    id: 'talent-pool-experience',
    label: 'Experience Level',
    options: TALENT_POOL_EXPERIENCE_OPTIONS,
  },
]

export type CreateTalentPoolMatchesStepProps = {
  similarPools?: SimilarTalentPoolMatch[]
  selectedId: string | null
  criteria: TalentPoolRefineCriteria
  onTogglePool: (id: string) => void
  onCriteriaChange: (key: keyof TalentPoolRefineCriteria, value: string) => void
}

/**
 * Matches + refine step body for Create Talent Pool (no SidePanel chrome).
 */
export function CreateTalentPoolMatchesStep({
  similarPools = AI_SIMILAR_TALENT_POOLS,
  selectedId,
  criteria,
  onTogglePool,
  onCriteriaChange,
}: CreateTalentPoolMatchesStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F0ECF8] px-3 py-1.5">
        <Info
          className="size-3.5 text-[#6B5A9E]"
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="text-xs font-semibold text-[#6B5A9E]">
          Similar Talent Pools Detected
        </span>
      </div>

      <div>
        <h2 className="text-lg font-bold text-[#1a1a2e]">
          We found existing Talent Pools that match your description
        </h2>
        <p className="mt-1 text-sm text-[#8B8B9E]">
          Would you like to use one of these as a template or continue creating a
          new one?
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {similarPools.map((pool) => {
            const active = selectedId === pool.id
            return (
              <button
                key={pool.id}
                type="button"
                onClick={() => onTogglePool(pool.id)}
                className={cn(
                  'rounded-xl border p-4 text-left transition-colors',
                  active
                    ? 'border-[#9B8BC8] bg-[#F5F2FB]'
                    : 'border-[#E4E1EE] bg-white hover:border-[#9B8BC8]/50 hover:bg-[#FAF9FC]',
                )}
              >
                <span className="block text-sm font-semibold text-[#1a1a2e]">
                  {pool.name}
                </span>
                <span className="mt-1.5 block text-xs text-[#6B6B80]">
                  Match Score:{' '}
                  <span className="font-semibold text-[#22A45A]">
                    {pool.matchPercent}%
                  </span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-[#1a1a2e]">
          Refine Pool Criteria
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {REFINE_FIELDS.map((field) => (
            <Select
              key={field.key}
              id={field.id}
              label={field.label}
              options={field.options}
              value={criteria[field.key]}
              onChange={(event) =>
                onCriteriaChange(field.key, event.target.value)
              }
            />
          ))}
        </div>
      </div>
    </div>
  )
}
