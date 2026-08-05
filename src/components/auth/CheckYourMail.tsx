import { cn } from '../../lib/cn'

export type CheckYourMailProps = {
  onBackToSignIn?: () => void
  className?: string
}

export function CheckYourMail({ onBackToSignIn, className }: CheckYourMailProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center text-center',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="mb-8 flex size-[5.5rem] items-center justify-center rounded-2xl bg-surface-soft ring-1 ring-line">
        <MailInstructionIcon className="size-12" />
      </div>

      <h1 className="text-[1.75rem] font-bold tracking-tight text-ink sm:text-[2rem]">
        Check your mail
      </h1>
      <p className="mt-3 max-w-[20rem] text-sm leading-relaxed text-muted">
        We have sent a password recovery instructions to your email.
      </p>

      {onBackToSignIn ? (
        <button
          type="button"
          onClick={onBackToSignIn}
          className="mt-8 text-sm font-medium text-brand-800 transition-colors hover:text-brand-900"
        >
          Back to Sign in
        </button>
      ) : null}
    </div>
  )
}

function MailInstructionIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Envelope body */}
      <path
        d="M6 18.5c0-2.5 2-4.5 4.5-4.5h27c2.5 0 4.5 2 4.5 4.5v15c0 2.5-2 4.5-4.5 4.5h-27C8 38 6 36 6 33.5v-15Z"
        className="fill-brand-800"
      />
      {/* Envelope flap */}
      <path
        d="M8.2 16.2 24 27.2 39.8 16.2"
        className="stroke-brand-100"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Letter page */}
      <path
        d="M16 8.5c0-1.4 1.1-2.5 2.5-2.5h11c1.4 0 2.5 1.1 2.5 2.5V18H16V8.5Z"
        className="fill-surface stroke-brand-700"
        strokeWidth="1.5"
      />
      <path
        d="M20 11h8M20 14.5h6"
        className="stroke-brand-700"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
