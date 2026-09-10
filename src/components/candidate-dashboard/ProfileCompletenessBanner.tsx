import { ArrowRight } from 'lucide-react'
import { Button } from '../ui'
import { getProfileInitials, type MyProfileState } from '../../data/myProfile'

export type ProfileCompletenessBannerProps = {
  profile: MyProfileState
  percent: number
  onDismiss: () => void
  onEditProfile: () => void
}

/**
 * Magenta completeness prompt on the candidate dashboard.
 */
export function ProfileCompletenessBanner({
  profile,
  percent,
  onDismiss,
  onEditProfile,
}: ProfileCompletenessBannerProps) {
  const initials = getProfileInitials(profile)

  return (
    <section className="flex flex-col gap-4 rounded-xl bg-[#C44B7A] px-4 py-3.5 text-white sm:flex-row sm:items-center sm:gap-5 sm:px-5">
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <span className="size-12 shrink-0 overflow-hidden rounded-full border-2 border-white/80 bg-white/20">
          {profile.avatarDataUrl ? (
            <img
              src={profile.avatarDataUrl}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span className="flex size-full items-center justify-center text-sm font-bold">
              {initials}
            </span>
          )}
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-bold tracking-tight sm:text-[17px]">
            Your profile is {percent}% complete
          </h2>
          <p className="mt-0.5 text-sm text-white/90">
            Add your work experience and skills to improve your fit rate
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onDismiss}
          className="text-sm font-medium text-white/90 transition-colors hover:text-white"
        >
          Dismiss
        </button>
        <Button
          type="button"
          onClick={onEditProfile}
          className="!h-9 !rounded-md !bg-white !px-3.5 text-sm font-semibold !text-[#C44B7A] hover:!bg-[#FDF2F6]"
        >
          Edit Profile
          <ArrowRight className="size-4" strokeWidth={2.25} aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}
