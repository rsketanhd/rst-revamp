import { useId, useRef } from 'react'
import { Camera, Info, Mail, MapPin, Phone } from 'lucide-react'
import type { MyProfileState, PendingItem, PendingItemId } from '../../data/myProfile'
import {
  getProfileCompletionPercent,
  getProfileContactLabel,
  getProfileDisplayName,
  getProfileInitials,
  getProfileLocationLabel,
  setProfileAvatar,
} from '../../data/myProfile'

export type ProfileLeftSectionProps = {
  profile: MyProfileState
  pendingItems: PendingItem[]
  onProfileUpdate?: () => void
  onPendingAdd: (id: PendingItemId) => void
}

export function ProfileLeftSection({
  profile,
  pendingItems,
  onProfileUpdate,
  onPendingAdd,
}: ProfileLeftSectionProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const completion = getProfileCompletionPercent(profile)
  const displayName = getProfileDisplayName(profile)
  const location = getProfileLocationLabel(profile)
  const initials = getProfileInitials(profile)
  const email = profile.personalInfo.email.trim() || 'Add your email'
  const phone = getProfileContactLabel(profile)

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileAvatar(reader.result)
        onProfileUpdate?.()
      }
    }
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <div className="bg-gradient-to-br from-[#F06B5E] to-[#C84E89] px-5 pb-5 pt-5">
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleAvatarChange}
        />

        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="size-[4.75rem] overflow-hidden rounded-full border-[3px] border-white bg-white/15 shadow-[0_4px_14px_rgba(0,0,0,0.2)]">
              {profile.avatarDataUrl ? (
                <img
                  src={profile.avatarDataUrl}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <span className="flex size-full items-center justify-center text-xl font-bold text-white">
                  {initials}
                </span>
              )}
            </div>

            <button
              type="button"
              aria-label="Change profile photo"
              onClick={() => inputRef.current?.click()}
              className="absolute -bottom-0.5 -right-0.5 inline-flex size-7 items-center justify-center rounded-full border-2 border-white bg-[#F06B5E] text-white shadow-[0_2px_6px_rgba(0,0,0,0.2)] transition-transform hover:scale-105"
            >
              <Camera className="size-3.5" strokeWidth={2} aria-hidden="true" />
            </button>
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h2 className="truncate text-[1.35rem] font-bold leading-tight text-white">
              {displayName}
            </h2>

            <ul className="mt-3 space-y-2">
              <li className="flex items-center gap-2.5 text-sm font-medium text-white">
                <Mail className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <span className="truncate">{email}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm font-medium text-white">
                <Phone className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <span className="truncate">{phone}</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm font-medium text-white">
                <MapPin className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                <span className="truncate">{location}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-[#2D2061] px-4 py-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-white">Your Profile</span>
            <span className="text-sm font-medium text-white/75">
              {completion}% Complete
            </span>
          </div>

          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-[#E8E6F0]"
            role="progressbar"
            aria-valuenow={completion}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Profile completion"
          >
            <div
              className="h-full rounded-full bg-[#22C55E] transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
          </div>

          <p className="mt-3 flex items-start gap-2 text-xs leading-snug text-white/70">
            <Info className="mt-0.5 size-3.5 shrink-0 text-white/80" aria-hidden="true" />
            Complete your profile to increase visibility to recruiters
          </p>
        </div>
      </div>

      <div className="bg-white px-5 py-5">
        <h3 className="text-base font-bold text-[#2D2061]">Pending Items</h3>

        {pendingItems.length === 0 ? (
          <p className="mt-4 rounded-lg border border-[#E5E7EB] bg-[#FAFAFC] px-4 py-3.5 text-sm text-[#8B8B9E]">
            You&apos;re all caught up. Your profile looks great.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {pendingItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3.5"
              >
                <span className="text-sm font-medium text-[#2D2061]">{item.label}</span>
                <button
                  type="button"
                  onClick={() => onPendingAdd(item.id)}
                  className="text-sm font-semibold text-[#2D2061] transition-colors hover:text-[#241a52]"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
