import { useState } from 'react'
import { X } from 'lucide-react'
import { PROFILE_MAX_SKILLS } from '../../data/myProfile'
import { cn } from '../../lib/cn'
import { PROFILE_SECTION_CLASS } from './ProfileSectionBlocks'
import { Button } from '../ui'

export type ProfileSkillsSectionProps = {
  skills: string[]
  onAdd: (skill: string) => { ok: boolean; error?: string }
  onRemove: (skill: string) => void
  inputRef?: React.RefObject<HTMLInputElement | null>
}

export function ProfileSkillsSection({
  skills,
  onAdd,
  onRemove,
  inputRef,
}: ProfileSkillsSectionProps) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleAdd() {
    const result = onAdd(value)
    if (!result.ok) {
      setError(result.error ?? 'Unable to add skill.')
      return
    }

    setValue('')
    setError(null)
  }

  return (
    <section className={PROFILE_SECTION_CLASS}>
      <h3 className="text-sm font-bold uppercase tracking-[0.04em] text-[#2D2061]">
        Skills
      </h3>

      <div className="mt-4">
        <label
          htmlFor="profile-skills-input"
          className="text-sm font-medium text-[#2D2061]"
        >
          Skills (Max {PROFILE_MAX_SKILLS}){' '}
          <span className="text-[#E85D4C]" aria-hidden="true">
            *
          </span>
        </label>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            ref={inputRef}
            id="profile-skills-input"
            type="text"
            value={value}
            placeholder="Enter Skills"
            onChange={(event) => {
              setValue(event.target.value)
              setError(null)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleAdd()
              }
            }}
            className={cn(
              'h-11 min-w-0 flex-1 rounded-md border border-[#D5D2E2] bg-white px-3.5 text-sm text-[#2D2061]',
              'placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:outline-none focus:ring-2 focus:ring-[#2D2061]/10',
              error && 'border-[#E85D4C] focus:border-[#E85D4C] focus:ring-[#E85D4C]/10',
            )}
          />
          <Button
            type="button"
            className="!h-11 !rounded-md bg-[#2D2061] px-6 text-sm font-semibold text-white hover:bg-[#241a52]"
            onClick={handleAdd}
          >
            Add
          </Button>
        </div>

        {error ? <p className="mt-1.5 text-xs text-[#E85D4C]">{error}</p> : null}
      </div>

      {skills.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#E8E6F0] px-3 py-1.5 text-sm font-medium text-[#2D2061]"
            >
              {skill}
              <button
                type="button"
                onClick={() => onRemove(skill)}
                aria-label={`Remove ${skill}`}
                className="inline-flex size-4 items-center justify-center rounded-full text-[#5C5878] transition-colors hover:bg-white hover:text-[#2D2061]"
              >
                <X className="size-3" strokeWidth={2} aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      ) : null}
    </section>
  )
}
