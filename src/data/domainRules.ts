export type DomainRuleStatus = 'Active' | 'Inactive'

export type DomainRule = {
  id: string
  domain: string
  status: DomainRuleStatus
  reason: string
}

export type DomainRuleFormValues = {
  domain: string
  status: DomainRuleStatus | ''
  reason: string
}

export const DOMAIN_RULE_STATUS_OPTIONS: DomainRuleStatus[] = [
  'Active',
  'Inactive',
]

export const DOMAIN_RULE_REASON_OPTIONS = [
  'Existing Customer',
  'Restricted Customer',
  'Competitor',
]

export const INITIAL_DOMAIN_RULES: DomainRule[] = [
  {
    id: 'domain-acme',
    domain: 'acme.com',
    status: 'Active',
    reason: 'Existing Customer',
  },
  {
    id: 'domain-google',
    domain: 'google.com',
    status: 'Active',
    reason: 'Restricted Customer',
  },
  {
    id: 'domain-competitor',
    domain: 'competitor.com',
    status: 'Inactive',
    reason: 'Competitor',
  },
]

const DOMAIN_PATTERN =
  /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i

export function emptyDomainRuleForm(): DomainRuleFormValues {
  return {
    domain: '',
    status: '',
    reason: '',
  }
}

export function formFromDomainRule({
  domain,
  status,
  reason,
}: DomainRule): DomainRuleFormValues {
  return { domain, status, reason }
}

export function normalizeDomain(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '')
    .replace(/^@/, '')
}

export function isValidDomainName(value: string): boolean {
  return DOMAIN_PATTERN.test(normalizeDomain(value))
}

export function applyDomainRuleForm(
  form: DomainRuleFormValues,
  existing?: DomainRule | null,
): DomainRule {
  if (form.status === '') {
    throw new Error('Domain rule status is required')
  }

  return {
    id: existing?.id ?? `domain-${Date.now()}`,
    domain: normalizeDomain(form.domain),
    status: form.status,
    reason: form.reason,
  }
}
