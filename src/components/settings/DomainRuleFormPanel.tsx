import { useEffect, useState } from 'react'
import { Button, Input, Select, SidePanel } from '../ui'
import {
  DOMAIN_RULE_REASON_OPTIONS,
  DOMAIN_RULE_STATUS_OPTIONS,
  emptyDomainRuleForm,
  formFromDomainRule,
  isValidDomainName,
  normalizeDomain,
  type DomainRule,
  type DomainRuleFormValues,
} from '../../data/domainRules'

export type DomainRuleFormPanelProps = {
  open: boolean
  rule: DomainRule | null
  existingDomains: string[]
  onClose: () => void
  onSave: (form: DomainRuleFormValues) => void
}

export function DomainRuleFormPanel({
  open,
  rule,
  existingDomains,
  onClose,
  onSave,
}: DomainRuleFormPanelProps) {
  const [form, setForm] = useState<DomainRuleFormValues>(emptyDomainRuleForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(rule)

  useEffect(() => {
    if (!open) return
    setForm(rule ? formFromDomainRule(rule) : emptyDomainRuleForm())
    setErrors({})
  }, [open, rule])

  function updateField<K extends keyof DomainRuleFormValues>(
    key: K,
    value: DomainRuleFormValues[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function validate() {
    const next: Record<string, string> = {}
    if (!form.domain.trim()) {
      next.domain = 'Domain name is required'
    } else if (!isValidDomainName(form.domain)) {
      next.domain = 'Enter a valid domain (e.g. acme.com)'
    } else if (existingDomains.includes(normalizeDomain(form.domain))) {
      next.domain = 'A rule already exists for this domain'
    }
    if (!form.status) next.status = 'Status is required'
    if (!form.reason) next.reason = 'Reason is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onSave(form)
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Domain Rule' : 'Create New Domain Rule'}
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {isEdit ? 'Save' : 'Create New'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Input
          id="domain-rule-name"
          label="Domain Name"
          placeholder="Enter Domain Name"
          value={form.domain}
          error={errors.domain}
          onChange={(event) => updateField('domain', event.target.value)}
        />

        <Select
          id="domain-rule-status"
          label="Status"
          options={DOMAIN_RULE_STATUS_OPTIONS}
          placeholder="Select Status"
          value={form.status}
          error={errors.status}
          onChange={(event) =>
            updateField('status', event.target.value as DomainRuleFormValues['status'])
          }
        />

        <Select
          id="domain-rule-reason"
          label="Reason"
          options={DOMAIN_RULE_REASON_OPTIONS}
          placeholder="Enter Reason"
          value={form.reason}
          error={errors.reason}
          onChange={(event) => updateField('reason', event.target.value)}
        />
      </div>
    </SidePanel>
  )
}
