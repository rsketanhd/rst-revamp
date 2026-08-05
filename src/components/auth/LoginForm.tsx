import type { FormEvent } from 'react'
import { useState } from 'react'
import { Button, Checkbox, Input } from '../ui'
import { validateLoginFields } from '../../lib/auth'
import { cn } from '../../lib/cn'
import type { UserRole } from './RoleToggle'

export type LoginFormValues = {
  email: string
  password: string
  rememberMe: boolean
  role: UserRole
}

export type LoginFormProps = {
  role: UserRole
  onSubmit?: (values: LoginFormValues) => void | Promise<void>
  onForgotPassword?: () => void
  onSignUp?: () => void
  isSubmitting?: boolean
  formError?: string | null
  className?: string
}

export function LoginForm({
  role,
  onSubmit,
  onForgotPassword,
  onSignUp,
  isSubmitting = false,
  formError = null,
  className,
}: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
  }>({})
  const [showFormError, setShowFormError] = useState(true)

  const roleLabel = role === 'recruiter' ? 'Recruiter' : 'Candidate'
  const authError = showFormError ? formError : null
  const canSubmit = email.trim().length > 0 || password.length > 0

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors = validateLoginFields(email, password)
    setFieldErrors(errors)
    setShowFormError(true)

    if (Object.keys(errors).length > 0) {
      return
    }

    await onSubmit?.({
      email: email.trim(),
      password,
      rememberMe,
      role,
    })
  }

  function clearAuthError() {
    if (formError) {
      setShowFormError(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      noValidate
      aria-label={`${roleLabel} sign in`}
    >
      <div className="mb-8 text-center">
        <h1 className="text-[2rem] font-bold tracking-tight text-brand-800">
          Sign in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Please sign in to continue to your {roleLabel} account.
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
          error={fieldErrors.email}
          onChange={(event) => {
            setEmail(event.target.value)
            if (fieldErrors.email) {
              setFieldErrors((current) => ({ ...current, email: undefined }))
            }
            clearAuthError()
          }}
          onBlur={() => {
            const emailError = validateLoginFields(email, password).email
            if (email) {
              setFieldErrors((current) => ({ ...current, email: emailError }))
            }
          }}
        />

        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          label="Password"
          placeholder="Password"
          requiredMark
          value={password}
          error={fieldErrors.password}
          onChange={(event) => {
            setPassword(event.target.value)
            if (fieldErrors.password) {
              setFieldErrors((current) => ({
                ...current,
                password: undefined,
              }))
            }
            clearAuthError()
          }}
          onBlur={() => {
            const passwordError = validateLoginFields(email, password).password
            if (password) {
              setFieldErrors((current) => ({
                ...current,
                password: passwordError,
              }))
            }
          }}
        />

        <div className="flex items-center justify-between gap-3">
          <Checkbox
            name="rememberMe"
            label="Remember Me"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-medium text-brand-800 transition-colors hover:text-brand-900"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting || !canSubmit}
          className={cn('mt-1')}
        >
          {isSubmitting ? 'Signing in…' : 'Sign In'}
        </Button>

        {role === 'candidate' ? (
          <p className="text-center text-sm text-ink">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              onClick={onSignUp}
              className="font-medium text-accent-500 underline underline-offset-2 transition-colors hover:text-accent-400"
            >
              Sign Up
            </button>
          </p>
        ) : null}
      </div>
    </form>
  )
}
