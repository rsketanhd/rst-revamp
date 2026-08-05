import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AuthLayout,
  BrandLogo,
  CheckYourMail,
  ForgotPasswordForm,
  LoginForm,
  MarketingPanel,
  RoleToggle,
  SignUpForm,
  type LoginFormValues,
  type SignUpFormValues,
  type UserRole,
} from '../components/auth'
import { HelpButton, HelpFeedbackModal } from '../components/ui'
import {
  authenticate,
  INVALID_CREDENTIALS_MESSAGE,
  setAuthenticated,
  validateEmail,
} from '../lib/auth'

type AuthView = 'sign-in' | 'sign-up' | 'forgot-password' | 'check-mail'

export function LoginPage() {
  const navigate = useNavigate()
  const [view, setView] = useState<AuthView>('sign-in')
  const [role, setRole] = useState<UserRole>('recruiter')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const showRoleChrome = view === 'sign-in' || view === 'sign-up'

  async function handleSubmit(values: LoginFormValues) {
    setIsSubmitting(true)
    setFormError(null)

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 350))

      if (!authenticate(values.email, values.password)) {
        setFormError(INVALID_CREDENTIALS_MESSAGE)
        return
      }

      setAuthenticated(true)
      navigate('/dashboard', { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSignUp(values: SignUpFormValues) {
    setIsSubmitting(true)
    setFormError(null)

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 350))
      console.info('candidate sign up', values)
      // After successful registration, return to sign-in as candidate
      setView('sign-in')
      setRole('candidate')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResetPassword(email: string) {
    setIsSubmitting(true)
    setFormError(null)

    try {
      const emailError = validateEmail(email)
      if (emailError) {
        setFormError(emailError)
        return
      }

      await new Promise((resolve) => window.setTimeout(resolve, 350))

      console.info('password reset requested', { email })
      setView('check-mail')
    } finally {
      setIsSubmitting(false)
    }
  }

  function showSignIn() {
    setView('sign-in')
    setFormError(null)
  }

  function showForgotPassword() {
    setView('forgot-password')
    setFormError(null)
  }

  function showSignUp() {
    setRole('candidate')
    setView('sign-up')
    setFormError(null)
  }

  function handleRoleChange(nextRole: UserRole) {
    setRole(nextRole)
    setFormError(null)

    // Sign up is candidate-only; recruiter toggle returns to sign-in
    if (view === 'sign-up' && nextRole === 'recruiter') {
      setView('sign-in')
    }
  }

  return (
    <>
      <AuthLayout marketing={<MarketingPanel />}>
        <div className="flex min-h-full flex-col px-6 py-5 sm:px-10 lg:px-16">
          <div className="flex items-start justify-end">
            <HelpButton onClick={() => setIsHelpOpen(true)} />
          </div>

          <div className="mx-auto flex w-full max-w-[22.5rem] flex-1 flex-col justify-center py-8">
            {showRoleChrome ? (
              <div className="mb-8 flex flex-col items-center gap-6">
                <RoleToggle value={role} onChange={handleRoleChange} />
                <BrandLogo />
              </div>
            ) : null}

            {view === 'sign-in' ? (
              <LoginForm
                role={role}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                formError={formError}
                onForgotPassword={showForgotPassword}
                onSignUp={showSignUp}
              />
            ) : null}

            {view === 'sign-up' ? (
              <SignUpForm
                onSubmit={handleSignUp}
                onSignIn={showSignIn}
                isSubmitting={isSubmitting}
                formError={formError}
              />
            ) : null}

            {view === 'forgot-password' ? (
              <ForgotPasswordForm
                onSubmit={handleResetPassword}
                onBackToSignIn={showSignIn}
                isSubmitting={isSubmitting}
                formError={formError}
                onClearMessages={() => setFormError(null)}
              />
            ) : null}

            {view === 'check-mail' ? (
              <CheckYourMail onBackToSignIn={showSignIn} />
            ) : null}
          </div>
        </div>
      </AuthLayout>

      <HelpFeedbackModal
        open={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onSubmit={async (payload) => {
          console.info('feedback submit', payload)
        }}
      />
    </>
  )
}
