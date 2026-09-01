import {
  CANDIDATE_DEMO_CREDENTIALS,
  DEMO_CREDENTIALS,
  validateConfirmPassword,
  validatePassword,
} from '../lib/auth'

export type AccountStatus = 'active' | 'deactivated'

export type AccountSettingsState = {
  email: string
  emailVerified: boolean
  twoFactorEnabled: boolean
  accountStatus: AccountStatus
  /** Local demo password override after a successful change. */
  passwordOverride: string | null
  pendingVerificationCode: string | null
}

export type ChangePasswordFieldErrors = {
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

const STORAGE_KEY = 'rst_account_settings'
const DEMO_VERIFICATION_CODE = '123456'

const DEFAULT_STATE: AccountSettingsState = {
  email: CANDIDATE_DEMO_CREDENTIALS.email,
  emailVerified: false,
  twoFactorEnabled: false,
  accountStatus: 'active',
  passwordOverride: null,
  pendingVerificationCode: null,
}

function readState(): AccountSettingsState {
  if (typeof sessionStorage === 'undefined') {
    return { ...DEFAULT_STATE }
  }

  const raw = sessionStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return { ...DEFAULT_STATE }
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AccountSettingsState>
    return {
      ...DEFAULT_STATE,
      ...parsed,
    }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

function writeState(state: AccountSettingsState) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function getAccountSettings(): AccountSettingsState {
  return readState()
}

export function updateAccountSettings(
  patch: Partial<AccountSettingsState>,
): AccountSettingsState {
  const next = { ...readState(), ...patch }
  writeState(next)
  return next
}

export function getAccountPassword(): string {
  const state = readState()
  return state.passwordOverride ?? DEMO_CREDENTIALS.password
}

export function sendEmailVerificationCode(): AccountSettingsState {
  return updateAccountSettings({ pendingVerificationCode: DEMO_VERIFICATION_CODE })
}

export function verifyEmailWithCode(code: string): {
  ok: boolean
  error?: string
} {
  const trimmed = code.trim()
  if (!trimmed) {
    return { ok: false, error: 'Verification code is required.' }
  }

  const state = readState()
  if (!state.pendingVerificationCode) {
    return {
      ok: false,
      error: 'Send a verification code to your email first.',
    }
  }

  if (trimmed !== state.pendingVerificationCode) {
    return { ok: false, error: 'Invalid verification code. Please try again.' }
  }

  updateAccountSettings({
    emailVerified: true,
    pendingVerificationCode: null,
  })

  return { ok: true }
}

export function changeAccountPassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
): { ok: boolean; errors?: ChangePasswordFieldErrors } {
  const errors: ChangePasswordFieldErrors = {}

  if (!currentPassword.trim()) {
    errors.currentPassword = 'Current password is required.'
  } else if (currentPassword !== getAccountPassword()) {
    errors.currentPassword = 'Current password is incorrect.'
  }

  const newPasswordError = validatePassword(newPassword)
  if (newPasswordError) errors.newPassword = newPasswordError

  const confirmPasswordError = validateConfirmPassword(
    newPassword,
    confirmPassword,
  )
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  updateAccountSettings({ passwordOverride: newPassword })
  return { ok: true }
}

export function setTwoFactorEnabled(enabled: boolean): AccountSettingsState {
  return updateAccountSettings({ twoFactorEnabled: enabled })
}

export function deactivateAccount(): AccountSettingsState {
  return updateAccountSettings({ accountStatus: 'deactivated' })
}

export function reactivateAccountOnLogin(): AccountSettingsState {
  const state = readState()
  if (state.accountStatus !== 'deactivated') return state
  return updateAccountSettings({ accountStatus: 'active' })
}

export function deleteAccountData(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}
