import { useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { Button, toast } from '../ui'
import { cn } from '../../lib/cn'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'

type PrimaryCvRule = 'source-priority' | 'most-recent' | 'recruiter-decides'

type SourcePriorityId =
  | 'candidate-portal'
  | 'recruiter'
  | 'careers-page'
  | 'external-recommendation'

type SourcePriorityItem = {
  id: SourcePriorityId
  label: string
}

const DEFAULT_RULE: PrimaryCvRule = 'source-priority'

const DEFAULT_SOURCE_PRIORITY: SourcePriorityItem[] = [
  { id: 'candidate-portal', label: 'Candidate Portal' },
  { id: 'recruiter', label: 'Recruiter' },
  { id: 'careers-page', label: 'Careers Page' },
  { id: 'external-recommendation', label: 'External Recommendation' },
]

const RULE_OPTIONS: Array<{
  value: PrimaryCvRule
  title: string
  description: string
}> = [
  {
    value: 'source-priority',
    title: 'By source priority',
    description:
      'A new CV becomes the primary one unless the current primary came from a higher source. Otherwise it is kept as a version.',
  },
  {
    value: 'most-recent',
    title: 'Most recent upload',
    description:
      'The newest CV is always the primary one, wherever it came from.',
  },
  {
    value: 'recruiter-decides',
    title: 'Recruiter decides',
    description:
      'A new CV is kept as a version; a recruiter makes it primary from the CV versions list. A candidate’s first CV is primary automatically.',
  },
]

/**
 * Settings → Module Configuration → Candidates → General.
 */
export function CandidatesGeneralPanel() {
  const [rule, setRule] = useState<PrimaryCvRule>(DEFAULT_RULE)
  const [sources, setSources] = useState(DEFAULT_SOURCE_PRIORITY)

  function handleSave() {
    toast.success('General settings saved.', { title: 'Candidates' })
  }

  function handleReset() {
    setRule(DEFAULT_RULE)
    setSources(DEFAULT_SOURCE_PRIORITY)
    toast.success('Settings reset to default.', { title: 'Candidates' })
  }

  function moveSource(id: SourcePriorityId, direction: -1 | 1) {
    setSources((current) => {
      const index = current.findIndex((item) => item.id === id)
      if (index < 0) return current
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= current.length) return current
      const next = [...current]
      const [item] = next.splice(index, 1)
      next.splice(nextIndex, 0, item)
      return next
    })
  }

  return (
    <SettingsPanel
      eyebrow="Candidates"
      title="General"
      description="Configure how the primary CV is chosen when a candidate has multiple versions."
    >
      <SettingsBlock
        title="Primary CV Rule"
        description={
          <>
            Every CV is kept as a version. The{' '}
            <span className="font-semibold text-[#2D2061]">primary CV</span> is
            shown on the candidate page, used for the profile, and scored on
            every job the candidate is on.
          </>
        }
      >
        <div
          className="grid grid-cols-1 gap-3 lg:grid-cols-3"
          role="radiogroup"
          aria-label="Primary CV rule"
        >
          {RULE_OPTIONS.map((option) => {
            const selected = rule === option.value
            return (
              <label
                key={option.value}
                className={cn(
                  'flex h-full cursor-pointer items-start gap-3 rounded-[8px] border bg-white px-4 py-3.5 transition-colors',
                  selected
                    ? 'border-[#2D2061]'
                    : 'border-[#E4E1EE] hover:border-[#2D2061]/40',
                )}
              >
                <input
                  type="radio"
                  name="primary-cv-rule"
                  value={option.value}
                  checked={selected}
                  onChange={() => setRule(option.value)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
                    selected
                      ? 'border-[#2D2061] bg-[#2D2061]'
                      : 'border-[#C8C5D6] bg-white',
                  )}
                  aria-hidden="true"
                >
                  {selected ? (
                    <span className="size-1.5 rounded-full bg-white" />
                  ) : null}
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[#2D2061]">
                    {option.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-[#8B8B9E]">
                    {option.description}
                  </span>
                </span>
              </label>
            )
          })}
        </div>

        {rule === 'source-priority' ? (
          <div className="mt-5">
            <p className="mb-2.5 text-[11px] font-semibold tracking-[0.06em] text-[#8B8B9E] uppercase">
              Source priority (highest first)
            </p>
            <ol className="flex flex-col gap-2">
              {sources.map((source, index) => (
                <li
                  key={source.id}
                  className="flex items-center gap-3 rounded-lg border border-[#E4E1EE] bg-white px-3 py-2.5"
                >
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-[#F5F4FA] text-xs font-semibold text-[#2D2061]">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-medium text-[#2D2061]">
                    {source.label}
                  </span>
                  <div className="flex items-center gap-1">
                    <OrderButton
                      label={`Move ${source.label} up`}
                      disabled={index === 0}
                      onClick={() => moveSource(source.id, -1)}
                    >
                      <ArrowUp className="size-3.5" strokeWidth={2.25} />
                    </OrderButton>
                    <OrderButton
                      label={`Move ${source.label} down`}
                      disabled={index === sources.length - 1}
                      onClick={() => moveSource(source.id, 1)}
                    >
                      <ArrowDown className="size-3.5" strokeWidth={2.25} />
                    </OrderButton>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs leading-relaxed text-[#8B8B9E]">
              Example: with Candidate Portal first, a CV a recruiter uploads
              never replaces the one the candidate uploaded themselves — it is
              kept as a version.
            </p>
          </div>
        ) : null}
      </SettingsBlock>

      <p className="text-xs leading-relaxed text-[#8B8B9E]">
        Changing the rule applies to CVs added from now on; existing primary CVs
        stay as they are. A recruiter can always pick another version with{' '}
        <span className="font-semibold text-[#6B6B80]">Make primary</span> on the
        candidate page.
      </p>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="!h-10 !rounded-md !border-[#D5D2E2] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
        >
          Reset to default
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
        >
          Save
        </Button>
      </div>
    </SettingsPanel>
  )
}

function OrderButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md border border-[#E4E1EE] bg-white text-[#2D2061] transition-colors',
        'hover:bg-[#F7F6FA]',
        'disabled:cursor-not-allowed disabled:border-[#F0EEF5] disabled:text-[#C8C5D6] disabled:hover:bg-white',
      )}
    >
      {children}
    </button>
  )
}
