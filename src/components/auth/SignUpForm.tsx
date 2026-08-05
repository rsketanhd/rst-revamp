import type { FormEvent } from 'react'
import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import {
  Button,
  Checkbox,
  DEFAULT_COUNTRIES,
  Input,
  PhoneInput,
} from '../ui'
import {
  generateCaptchaCode,
  validateSignUpFields,
} from '../../lib/auth'
import { cn } from '../../lib/cn'

export type SignUpFormValues = {
  fullName: string
  email: string
  countryCode: string
  phone: string
  password: string
  confirmPassword: string
  captcha: string
  consent: boolean
}

export type SignUpFormProps = {
  onSubmit?: (values: SignUpFormValues) => void | Promise<void>
  onSignIn?: () => void
  isSubmitting?: boolean
  formError?: string | null
  className?: string
}

export function SignUpForm({
  onSubmit,
  onSignIn,
  isSubmitting = false,
  formError = null,
  className,
}: SignUpFormProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [captcha, setCaptcha] = useState('')
  const [captchaCode, setCaptchaCode] = useState(() => generateCaptchaCode())
  const [consent, setConsent] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    fullName?: string
    email?: string
    phone?: string
    password?: string
    confirmPassword?: string
    captcha?: string
    consent?: string
  }>({})
  const [showFormError, setShowFormError] = useState(true)

  const authError = showFormError ? formError : null
  const selectedCountry =
    DEFAULT_COUNTRIES.find((country) => country.dialCode === countryCode) ??
    DEFAULT_COUNTRIES[0]

  function refreshCaptcha() {
    setCaptchaCode(generateCaptchaCode())
    setCaptcha('')
    clearFieldError('captcha')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const errors = validateSignUpFields({
      fullName,
      email,
      phone,
      phoneExpectedLength: selectedCountry?.phoneLength,
      password,
      confirmPassword,
      captcha,
      captchaCode,
      consent,
    })
    setFieldErrors(errors)
    setShowFormError(true)

    if (Object.keys(errors).length > 0) {
      if (errors.captcha && captcha.trim()) {
        setCaptchaCode(generateCaptchaCode())
        setCaptcha('')
      }
      return
    }

    await onSubmit?.({
      fullName: fullName.trim(),
      email: email.trim(),
      countryCode,
      phone: phone.trim(),
      password,
      confirmPassword,
      captcha: captcha.trim(),
      consent,
    })
  }

  function clearAuthError() {
    if (formError) {
      setShowFormError(false)
    }
  }

  function clearFieldError(field: keyof typeof fieldErrors) {
    if (fieldErrors[field]) {
      setFieldErrors((current) => ({ ...current, [field]: undefined }))
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      noValidate
      aria-label="Candidate sign up"
    >
      <div className="mb-8 text-center">
        <h1 className="text-[2rem] font-bold tracking-tight text-brand-800">
          Sign Up
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Create your Candidate account to get started.
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
          name="fullName"
          type="text"
          autoComplete="name"
          label="Full Name"
          placeholder="Full Name"
          requiredMark
          value={fullName}
          error={fieldErrors.fullName}
          onChange={(event) => {
            setFullName(event.target.value)
            clearFieldError('fullName')
            clearAuthError()
          }}
        />

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
            clearFieldError('email')
            clearAuthError()
          }}
        />

        <PhoneInput
          name="phone"
          requiredMark
          countryCode={countryCode}
          value={phone}
          error={fieldErrors.phone}
          onCountryCodeChange={(dialCode) => {
            setCountryCode(dialCode)
            clearFieldError('phone')
            clearAuthError()
          }}
          onValueChange={(next) => {
            setPhone(next)
            clearFieldError('phone')
            clearAuthError()
          }}
        />

        <Input
          name="password"
          type="password"
          autoComplete="new-password"
          label="Password"
          placeholder="Password"
          requiredMark
          value={password}
          error={fieldErrors.password}
          onChange={(event) => {
            setPassword(event.target.value)
            clearFieldError('password')
            clearAuthError()
          }}
        />

        <Input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          label="Confirm Password"
          placeholder="Confirm Password"
          requiredMark
          value={confirmPassword}
          error={fieldErrors.confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value)
            clearFieldError('confirmPassword')
            clearAuthError()
          }}
        />

        {/* Captcha */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-ink">
            Captcha
            <span className="ml-0.5 text-accent-500" aria-hidden="true">
              *
            </span>
          </label>
          <div className="flex items-stretch gap-2">
            <div
              className="flex h-11 min-w-[7.5rem] items-center justify-center rounded-control border border-line bg-surface-soft px-3 select-none"
              aria-hidden="true"
            >
              <span className="font-mono text-lg font-bold tracking-[0.2em] text-brand-800 line-through decoration-brand-800/30">
                {captchaCode}
              </span>
            </div>
            <button
              type="button"
              onClick={refreshCaptcha}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-control border border-line text-brand-800 transition-colors hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-800/20"
              aria-label="Refresh captcha"
            >
              <RefreshCw className="size-4" aria-hidden="true" />
            </button>
            <input
              name="captcha"
              type="text"
              autoComplete="off"
              value={captcha}
              placeholder="Enter Captcha"
              aria-label="Enter captcha"
              aria-invalid={fieldErrors.captcha ? true : undefined}
              aria-describedby={
                fieldErrors.captcha ? 'captcha-error' : undefined
              }
              onChange={(event) => {
                setCaptcha(event.target.value)
                clearFieldError('captcha')
                clearAuthError()
              }}
              className={cn(
                'h-11 w-full rounded-control border border-line bg-surface px-3.5 text-sm text-ink',
                'placeholder:text-subtle',
                'transition-colors focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/10',
                fieldErrors.captcha &&
                  'border-accent-500 focus:border-accent-500 focus:ring-accent-500/15',
              )}
            />
          </div>
          {fieldErrors.captcha ? (
            <p id="captcha-error" className="text-xs text-accent-500">
              {fieldErrors.captcha}
            </p>
          ) : null}
        </div>

        <Checkbox
          name="consent"
          checked={consent}
          error={fieldErrors.consent}
          onChange={(event) => {
            setConsent(event.target.checked)
            clearFieldError('consent')
            clearAuthError()
          }}
          label={
            <>
              I have carefully read and agree to the{' '}
              <a
                href="/terms"
                className="font-medium text-brand-800 underline underline-offset-2 hover:text-brand-900"
                onClick={(event) => event.stopPropagation()}
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                className="font-medium text-brand-800 underline underline-offset-2 hover:text-brand-900"
                onClick={(event) => event.stopPropagation()}
              >
                Privacy Policy
              </a>
              .
            </>
          }
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          disabled={isSubmitting || !consent}
          className={cn('mt-1')}
        >
          {isSubmitting ? 'Creating account…' : 'Sign Up'}
        </Button>

        <p className="text-center text-sm text-ink">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSignIn}
            className="font-medium text-accent-500 underline underline-offset-2 transition-colors hover:text-accent-400"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  )
}
