const COPILOT_SETUP_KEY = 'rst_copilot_setup_done'
const AUTH_EMAIL_KEY = 'rst_auth_email'

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function setupStorageKey(email: string) {
  return `${COPILOT_SETUP_KEY}:${normalizeEmail(email)}`
}

function resolveEmail(email?: string) {
  return normalizeEmail(email ?? getAuthEmail())
}

export function setAuthEmail(email: string) {
  sessionStorage.setItem(AUTH_EMAIL_KEY, normalizeEmail(email))
}

export function getAuthEmail(): string {
  return sessionStorage.getItem(AUTH_EMAIL_KEY) ?? ''
}

export function clearAuthEmail() {
  sessionStorage.removeItem(AUTH_EMAIL_KEY)
}

export function hasCompletedCopilotSetup(email?: string): boolean {
  const resolved = resolveEmail(email)
  if (!resolved) return false
  return localStorage.getItem(setupStorageKey(resolved)) === '1'
}

export function markCopilotSetupComplete(email?: string) {
  const resolved = resolveEmail(email)
  if (!resolved) return
  localStorage.setItem(setupStorageKey(resolved), '1')
}

export function clearCopilotSetup(email?: string) {
  const resolved = resolveEmail(email)
  if (!resolved) return
  localStorage.removeItem(setupStorageKey(resolved))
}
