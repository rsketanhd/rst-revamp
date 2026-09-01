import type { PersonalInfo } from '../../data/myProfile'
import { formatProfileField } from '../../data/myProfile'
import { PROFILE_SECTION_CLASS, ProfileField, ProfileSectionHeader } from './ProfileSectionBlocks'

export type ProfilePersonalInfoSectionProps = {
  personalInfo: PersonalInfo
  onEdit: () => void
}

function formatContactNumber(personalInfo: PersonalInfo): string {
  const phone = personalInfo.contactNumber.trim()
  if (!phone) return '-'
  return `${personalInfo.countryCode.trim()} ${phone}`.trim()
}

export function ProfilePersonalInfoSection({
  personalInfo,
  onEdit,
}: ProfilePersonalInfoSectionProps) {
  return (
    <section className={PROFILE_SECTION_CLASS}>
      <ProfileSectionHeader
        title="Personal Information"
        action="edit"
        onAction={onEdit}
        actionLabel="Edit personal information"
      />

      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProfileField
          label="Full Name"
          value={formatProfileField(personalInfo.fullName)}
        />
        <ProfileField label="Email" value={formatProfileField(personalInfo.email)} />
        <ProfileField label="Gender" value={formatProfileField(personalInfo.gender)} />
        <ProfileField label="Contact Number" value={formatContactNumber(personalInfo)} />
        <ProfileField label="Country" value={formatProfileField(personalInfo.country)} />
        <ProfileField
          label="Province/State"
          value={formatProfileField(personalInfo.provinceState)}
        />
        <ProfileField label="City" value={formatProfileField(personalInfo.city)} />
        <ProfileField
          label="Nationality"
          value={formatProfileField(personalInfo.nationality)}
        />
      </dl>
    </section>
  )
}
