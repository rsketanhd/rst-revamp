import type { ReactNode } from 'react'
import {
  Briefcase,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Plus,
  Timer,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  AVATAR_TONES,
  candidateInitials,
  type DiscoveryCandidate,
} from '../../data/discovery'

export type DiscoveryCandidateCardProps = {
  candidate: DiscoveryCandidate
  selected: boolean
  onSelectChange: (checked: boolean) => void
  onViewProfile?: () => void
  onMessage?: () => void
  onAdd?: () => void
}

/**
 * Discovery results — single candidate card matching the design layout.
 */
export function DiscoveryCandidateCard({
  candidate,
  selected,
  onSelectChange,
  onViewProfile,
  onMessage,
  onAdd,
}: DiscoveryCandidateCardProps) {
  const visibleSkills = candidate.skills.slice(0, 2)
  const extraSkills = Math.max(0, candidate.skills.length - 2)
  const avatarClass = AVATAR_TONES[candidate.avatarTone % AVATAR_TONES.length]

  return (
    <article
      className={cn(
        'rounded-xl border border-[#E8E6F0] bg-white p-4 transition-shadow sm:p-5',
        selected && 'border-[#C8C0E8] shadow-[0_2px_8px_rgba(45,32,97,0.06)]',
      )}
    >
      <div className="flex gap-3">
        <label className="mt-1 shrink-0 cursor-pointer">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelectChange(e.target.checked)}
            aria-label={`Select ${candidate.name}`}
            className="size-4 rounded border-[#C8C5D6] accent-[#2D2061]"
          />
        </label>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-3">
            <span
              className={cn(
                'inline-flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                avatarClass,
              )}
              aria-hidden="true"
            >
              {candidateInitials(candidate.name)}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-[#2D2061]">
                    {candidate.name}
                  </h3>
                  <p className="mt-0.5 text-sm text-[#6B6B80]">
                    {candidate.title} at {candidate.company}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  <IconAction
                    label={`View profile of ${candidate.name}`}
                    onClick={onViewProfile}
                  >
                    <IdCard className="size-4" strokeWidth={1.75} />
                  </IconAction>
                  <IconAction
                    label={`Message ${candidate.name}`}
                    onClick={onMessage}
                  >
                    <Mail className="size-4" strokeWidth={1.75} />
                  </IconAction>
                  <IconAction
                    label={`Add ${candidate.name}`}
                    onClick={onAdd}
                    solid
                  >
                    <Plus className="size-4" strokeWidth={2.25} />
                  </IconAction>
                </div>
              </div>

              <ul className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#6B6B80]">
                <li className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-[#8B8B9E]" aria-hidden="true" />
                  {candidate.location}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Timer className="size-3.5 text-[#8B8B9E]" aria-hidden="true" />
                  {candidate.noticePeriod}
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <Briefcase
                    className="size-3.5 text-[#8B8B9E]"
                    aria-hidden="true"
                  />
                  {candidate.experienceYears}+ Years of Experience
                </li>
                <li className="inline-flex max-w-full items-center gap-1.5">
                  <Mail className="size-3.5 shrink-0 text-[#8B8B9E]" aria-hidden="true" />
                  <span className="truncate">{candidate.email}</span>
                  {candidate.emailLocked ? (
                    <Lock
                      className="size-3 shrink-0 text-[#A0A0B2]"
                      aria-label="Email locked"
                    />
                  ) : null}
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-[#F0EEF5] pt-3.5 sm:grid-cols-3">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#8B8B9E]">
                Experience
              </p>
              <p className="mt-1 text-sm leading-snug text-[#2A2740]">
                {candidate.latestRole}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#8B8B9E]">
                Education
              </p>
              <p className="mt-1 text-sm leading-snug text-[#2A2740]">
                {candidate.education}
              </p>
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#8B8B9E]">
                Skills
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {visibleSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex h-6 items-center rounded-full border border-[#E4E1EE] bg-[#F7F6FA] px-2.5 text-xs font-medium text-[#2D2061]"
                  >
                    {skill}
                  </span>
                ))}
                {extraSkills > 0 ? (
                  <span className="inline-flex h-6 items-center rounded-full border border-[#E4E1EE] bg-white px-2.5 text-xs font-semibold text-[#6B6B80]">
                    +{extraSkills}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function IconAction({
  label,
  onClick,
  solid,
  children,
}: {
  label: string
  onClick?: () => void
  solid?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        'inline-flex size-9 items-center justify-center rounded-md border transition-colors',
        solid
          ? 'border-[#2D2061] bg-[#2D2061] text-white hover:bg-[#241a52]'
          : 'border-[#E0DDEA] bg-white text-[#2D2061] hover:bg-[#F7F6FA]',
      )}
    >
      {children}
    </button>
  )
}
