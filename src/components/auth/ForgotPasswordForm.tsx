import type { FormEvent } from 'react'
import { useState } from 'react'
import { Button, Input } from '../ui'
import { validateEmail } from '../../lib/auth'

export type ForgotPasswordFormProps = {
  onSubmit?: (email: string) => void | Promise<void>
  onBackToSignIn?: () => void
  isSubmitting?: boolean
  formError?: string | null
  onClearMessages?: () => void
  className?: string
}

export function ForgotPasswordForm({
  onSubmit,
  onBackToSignIn,
  isSubmitting = false,
  formError = null,
  onClearMessages,
  className,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | undefined>()
  const [showFormError, setShowFormError] = useState(true)

  const authError = showFormError ? formError : null
  const canSubmit = email.trim().length > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const error = validateEmail(email)
    setEmailError(error ?? undefined)
    setShowFormError(true)

    if (error) {
      return
    }

    await onSubmit?.(email.trim())
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      noValidate
      aria-label="Reset password"
    >
      <div className="mb-8 text-center">
        <h1 className="text-[2rem] font-bold tracking-tight text-brand-800">
          Reset password
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      {authError ? (
        <div
          role="alert"
          className="mb-5 rounded-control border border-accent-500/30 bg-accent-500/10 px-3.5 py-3 text-sm text-accent-500"
        >
          {authError}
        </div>
      ) : null}

      <div className="flex flex-col gap-5">
        <Input
          name="email"
          type="email"
          autoComplete="email"
          label="Email Address"
          placeholder="Email Address"
          requiredMark
          value={email}
          error={emailError}
          onChange={(event) => {
            setEmail(event.target.value)
            if (emailError) setEmailError(undefined)
            if (formError) setShowFormError(false)
            if (formError) onClearMessages?.()
          }}
          onBlur={() => {
            setEmailError(validateEmail(email) ?? undefined)
          }}
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting || !canSubmit}
          className="mt-1"
        >
          {isSubmitting ? 'Sending…' : 'Reset Password'}
        </Button>

        {onBackToSignIn ? (
          <button
            type="button"
            onClick={onBackToSignIn}
            className="text-center text-sm font-medium text-brand-800 transition-colors hover:text-brand-900"
          >
            Back to Sign in
          </button>
        ) : null}
      </div>
    </form>
  )
}
