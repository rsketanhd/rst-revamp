import type { ReactNode } from 'react'
import { Pencil } from 'lucide-react'
import type {
  CompensationEntry,
  EducationEntry,
  JobInfoEntry,
} from '../../data/myProfile'
import {
  formatCompensationSummary,
  formatEducationDegreeLine,
  formatEducationYears,
  formatExperienceLabel,
  formatJobTimeline,
} from '../../data/myProfile'
import { ProfileEmptySection, ProfileSectionHeader, PROFILE_SECTION_CLASS } from './ProfileSectionBlocks'

function CurrentlyWorkingBadge() {
  return (
    <span className="inline-flex shrink-0 rounded-full bg-[#EEF0F6] px-3 py-1 text-xs font-medium text-[#5C5878]">
      Currently Working
    </span>
  )
}

function ProfileEntryEditButton({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-[#8B8B9E] transition-colors hover:bg-[#F5F6FF] hover:text-[#2D2061]"
    >
      <Pencil className="size-4" strokeWidth={1.75} aria-hidden="true" />
    </button>
  )
}

function ProfileEntryCard({
  children,
  badge,
  editLabel,
  onEdit,
}: {
  children: ReactNode
  badge?: ReactNode
  editLabel: string
  onEdit?: () => void
}) {
  return (
    <article className="flex items-start justify-between gap-3 rounded-lg border border-[#E8E6F0] bg-white px-4 py-4">
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex shrink-0 items-center gap-2">
        {badge}
        <ProfileEntryEditButton label={editLabel} onClick={onEdit} />
      </div>
    </article>
  )
}

const SECTION_CLASS = PROFILE_SECTION_CLASS

export type ProfileJobInfoSectionProps = {
  entries: JobInfoEntry[]
  onAdd: () => void
  onEdit?: (entry: JobInfoEntry) => void
}

export function ProfileJobInfoSection({
  entries,
  onAdd,
  onEdit,
}: ProfileJobInfoSectionProps) {
  return (
    <section className={SECTION_CLASS}>
      <ProfileSectionHeader
        title="Job Information"
        action="add"
        onAction={onAdd}
        actionLabel="Add job information"
      />

      {!entries.length ? (
        <div className="mt-4">
          <ProfileEmptySection message="No Job Information" onAction={onAdd} />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {entries.map((entry) => (
            <ProfileEntryCard
              key={entry.id}
              editLabel={`Edit ${entry.currentTitle}`}
              onEdit={onEdit ? () => onEdit(entry) : undefined}
              badge={entry.currentlyWorking ? <CurrentlyWorkingBadge /> : null}
            >
              <h4 className="text-base font-bold leading-snug text-[#2D2061]">
                {entry.currentTitle}
              </h4>
              <p className="mt-1 text-sm font-medium text-[#5B6BBF]">
                {entry.currentCompany}
              </p>
              <p className="mt-1 text-sm text-[#8B8B9E]">{formatJobTimeline(entry)}</p>
            </ProfileEntryCard>
          ))}
        </div>
      )}
    </section>
  )
}

export type ProfileCompensationSectionProps = {
  entries: CompensationEntry[]
  onAdd: () => void
  onEdit?: (entry: CompensationEntry) => void
}

export function ProfileCompensationSection({
  entries,
  onAdd,
  onEdit,
}: ProfileCompensationSectionProps) {
  return (
    <section className={SECTION_CLASS}>
      <ProfileSectionHeader
        title="Compensation"
        action="add"
        onAction={onAdd}
        actionLabel="Add compensation"
      />

      {!entries.length ? (
        <div className="mt-4">
          <ProfileEmptySection message="No Compensation" onAction={onAdd} />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {entries.map((entry) => (
            <ProfileEntryCard
              key={entry.id}
              editLabel="Edit compensation"
              onEdit={onEdit ? () => onEdit(entry) : undefined}
              badge={entry.currentlyWorking ? <CurrentlyWorkingBadge /> : null}
            >
              <p className="text-sm font-semibold text-[#2D2061]">
                {formatExperienceLabel(entry)}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[#8B8B9E]">
                {formatCompensationSummary(entry)}
              </p>
            </ProfileEntryCard>
          ))}
        </div>
      )}
    </section>
  )
}

export type ProfileEducationSectionProps = {
  entries: EducationEntry[]
  onAdd: () => void
  onEdit?: (entry: EducationEntry) => void
}

export function ProfileEducationSection({
  entries,
  onAdd,
  onEdit,
}: ProfileEducationSectionProps) {
  return (
    <section className={SECTION_CLASS}>
      <ProfileSectionHeader
        title="Education"
        action="add"
        onAction={onAdd}
        actionLabel="Add education"
      />

      {!entries.length ? (
        <div className="mt-4">
          <ProfileEmptySection message="No Education" onAction={onAdd} />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {entries.map((entry) => (
            <ProfileEntryCard
              key={entry.id}
              editLabel={`Edit ${entry.institution || 'education entry'}`}
              onEdit={onEdit ? () => onEdit(entry) : undefined}
            >
              <h4 className="text-base font-bold leading-snug text-[#2D2061]">
                {entry.institution || '-'}
              </h4>
              <p className="mt-1 text-sm font-medium text-[#5B6BBF]">
                {formatEducationDegreeLine(entry)}
              </p>
              <p className="mt-1 text-sm text-[#8B8B9E]">
                {formatEducationYears(entry)}
              </p>
            </ProfileEntryCard>
          ))}
        </div>
      )}
    </section>
  )
}
