const EMAIL_PATTERN =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

/** Demo sign-in credentials for local auth check */
export const DEMO_CREDENTIALS = {
  email: 'ketan@recruitmentsmart.com',
  password: 'ketan@12345',
} as const

export function validateEmail(email: string): string | null {
  const value = email.trim()

  if (!value) {
    return 'Email address is required.'
  }

  if (!EMAIL_PATTERN.test(value)) {
    return 'Enter a valid email address (e.g. name@company.com).'
  }

  return null
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return 'Password is required.'
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters.'
  }

  if (!/[A-Za-z]/.test(password)) {
    return 'Password must include at least one letter.'
  }

  if (!/[0-9]/.test(password)) {
    return 'Password must include at least one number.'
  }

  return null
}

export type LoginFieldErrors = {
  email?: string
  password?: string
}

export function validateLoginFields(
  email: string,
  password: string,
): LoginFieldErrors {
  const errors: LoginFieldErrors = {}
  const emailError = validateEmail(email)
  const passwordError = validatePassword(password)

  if (emailError) errors.email = emailError
  if (passwordError) errors.password = passwordError

  return errors
}

export function validateFullName(fullName: string): string | null {
  const value = fullName.trim()

  if (!value) {
    return 'Full name is required.'
  }

  if (value.length < 2) {
    return 'Enter a valid full name.'
  }

  return null
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | null {
  if (!confirmPassword) {
    return 'Please confirm your password.'
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match.'
  }

  return null
}

export function validatePhoneNumber(
  phone: string,
  options?: { expectedLength?: number },
): string | null {
  const value = phone.trim()
  const expectedLength = options?.expectedLength

  if (!value) {
    return 'Phone number is required.'
  }

  if (!/^\d+$/.test(value)) {
    return 'Phone number can only contain digits.'
  }

  if (expectedLength != null && value.length !== expectedLength) {
    return `Enter a valid ${expectedLength}-digit phone number.`
  }

  if (expectedLength == null && (value.length < 6 || value.length > 15)) {
    return 'Enter a valid phone number (6–15 digits).'
  }

  return null
}

export function validateCaptcha(
  value: string,
  expected: string,
): string | null {
  if (!value.trim()) {
    return 'Captcha is required.'
  }

  if (value.trim().toLowerCase() !== expected.toLowerCase()) {
    return 'Captcha does not match. Please try again.'
  }

  return null
}

export function validateConsent(accepted: boolean): string | null {
  if (!accepted) {
    return 'Please accept the Terms of Service and Privacy Policy to continue.'
  }

  return null
}

export function generateCaptchaCode(length = 5): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < length; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return code
}

export type SignUpFieldErrors = {
  fullName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  captcha?: string
  consent?: string
}

export function validateSignUpFields(values: {
  fullName: string
  email: string
  phone: string
  phoneExpectedLength?: number
  password: string
  confirmPassword: string
  captcha: string
  captchaCode: string
  consent: boolean
}): SignUpFieldErrors {
  const errors: SignUpFieldErrors = {}
  const fullNameError = validateFullName(values.fullName)
  const emailError = validateEmail(values.email)
  const phoneError = validatePhoneNumber(values.phone, {
    expectedLength: values.phoneExpectedLength,
  })
  const passwordError = validatePassword(values.password)
  const confirmPasswordError = validateConfirmPassword(
    values.password,
    values.confirmPassword,
  )
  const captchaError = validateCaptcha(values.captcha, values.captchaCode)
  const consentError = validateConsent(values.consent)

  if (fullNameError) errors.fullName = fullNameError
  if (emailError) errors.email = emailError
  if (phoneError) errors.phone = phoneError
  if (passwordError) errors.password = passwordError
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError
  if (captchaError) errors.captcha = captchaError
  if (consentError) errors.consent = consentError

  return errors
}

export function authenticate(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email.toLowerCase() &&
    password === DEMO_CREDENTIALS.password
  )
}

const AUTH_STORAGE_KEY = 'rst_auth'

export function setAuthenticated(value: boolean) {
  if (value) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, '1')
  } else {
    sessionStorage.removeItem(AUTH_STORAGE_KEY)
  }
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_STORAGE_KEY) === '1'
}

export const INVALID_CREDENTIALS_MESSAGE =
  'Invalid email or password. Please check your credentials and try again.'
