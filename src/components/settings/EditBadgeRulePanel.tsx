import { useEffect, useState } from 'react'
import { CalendarDays, CircleHelp, X } from 'lucide-react'
import {
  Button,
  Input,
  MultiSelect,
  Select,
  SidePanel,
  toast,
} from '../ui'
import { cn } from '../../lib/cn'
import {
  APPLICATION_STAGE_OPTIONS,
  BADGE_RULE_TYPE_OPTIONS,
  JOB_STATUS_OPTIONS,
  type BadgeRule,
  type BadgeRuleType,
} from '../../data/talentCrmSettings'

export type EditBadgeRulePanelProps = {
  open: boolean
  rule: BadgeRule | null
  onClose: () => void
  onSave: (rule: BadgeRule) => void
}

type Draft = {
  badge: string
  ruleType: BadgeRuleType | ''
  applicationStages: string[]
  jobStatus: string
  appliedOnOrAfter: string
  appliedBefore: string
}

function toDraft(rule: BadgeRule | null): Draft {
  if (!rule) {
    return {
      badge: '',
      ruleType: '',
      applicationStages: [],
      jobStatus: '',
      appliedOnOrAfter: '',
      appliedBefore: '',
    }
  }
  return {
    badge: rule.badge,
    ruleType: rule.ruleType,
    applicationStages: [...rule.applicationStages],
    jobStatus: rule.jobStatus,
    appliedOnOrAfter: rule.appliedOnOrAfter,
    appliedBefore: rule.appliedBefore,
  }
}

/**
 * Talent CRM → Badge Rules → Edit rule side panel.
 */
export function EditBadgeRulePanel({
  open,
  rule,
  onClose,
  onSave,
}: EditBadgeRulePanelProps) {
  const [draft, setDraft] = useState<Draft>(() => toDraft(rule))

  useEffect(() => {
    if (!open) return
    setDraft(toDraft(rule))
  }, [open, rule])

  function updateField<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function handleSave() {
    if (!rule) return
    if (!draft.badge.trim()) {
      toast.error('Badge name is required')
      return
    }
    if (!draft.ruleType) {
      toast.error('Rule type is required')
      return
    }

    const stagesLabel =
      draft.applicationStages.length > 0
        ? draft.applicationStages.join(', ')
        : 'any stage'
    const afterLabel = draft.appliedOnOrAfter
      ? `, applied on/after ${draft.appliedOnOrAfter}`
      : ''
    const beforeLabel = draft.appliedBefore
      ? `, applied before ${draft.appliedBefore}`
      : ''

    onSave({
      ...rule,
      badge: draft.badge.trim(),
      ruleType: draft.ruleType,
      applicationStages: draft.applicationStages,
      jobStatus: draft.jobStatus || 'Any status',
      appliedOnOrAfter: draft.appliedOnOrAfter,
      appliedBefore: draft.appliedBefore,
      description: `Application stages: ${stagesLabel} on jobs that are ${draft.jobStatus || 'Any status'}${afterLabel}${beforeLabel}.`,
    })
    toast.success(`“${draft.badge.trim()}” was updated.`, {
      title: 'Badge rule saved',
    })
    onClose()
  }

  const panelTitle = `Edit rule — ${rule?.badge || draft.badge || 'Badge'}`

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={panelTitle}
      widthClassName="w-full max-w-[28rem]"
      headerClassName="border-b border-[#ECEAF3] bg-white"
      titleClassName="font-bold text-[#2D2061]"
      closeButtonClassName="text-[#6B6B80] hover:bg-[#F2F1F6] hover:text-[#2D2061]"
      headerActions={
        <button
          type="button"
          aria-label="Help"
          className="inline-flex size-8 items-center justify-center rounded-full text-[#6B6B80] transition-colors hover:bg-[#F2F1F6] hover:text-[#2D2061]"
        >
          <CircleHelp className="size-5" strokeWidth={1.75} />
        </button>
      }
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="!h-10 !rounded-md !px-4 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          id="badge-rule-name"
          label="Badge"
          value={draft.badge}
          onChange={(e) => updateField('badge', e.target.value)}
        />

        <Select
          id="badge-rule-type"
          label="Rule type"
          options={BADGE_RULE_TYPE_OPTIONS}
          value={draft.ruleType}
          onChange={(e) =>
            updateField('ruleType', e.target.value as BadgeRuleType)
          }
        />

        <MultiSelect
          label="Application stages"
          options={APPLICATION_STAGE_OPTIONS}
          value={draft.applicationStages}
          onChange={(next) => updateField('applicationStages', next)}
          placeholder="Select stages"
        />

        <Select
          id="badge-rule-job-status"
          label="On jobs that are..."
          options={JOB_STATUS_OPTIONS}
          value={draft.jobStatus}
          onChange={(e) => updateField('jobStatus', e.target.value)}
        />

        <DateField
          label="Applied on/after"
          value={draft.appliedOnOrAfter}
          onChange={(v) => updateField('appliedOnOrAfter', v)}
          onClear={() => updateField('appliedOnOrAfter', '')}
        />

        <DateField
          label="Applied before"
          value={draft.appliedBefore}
          onChange={(v) => updateField('appliedBefore', v)}
          onClear={() => updateField('appliedBefore', '')}
          placeholder="Select date"
        />

        <div className="rounded-md border border-[#E4E1EE] bg-[#F7F7F9] px-3.5 py-3 text-sm text-[#5C5878]">
          This rule matches ~{rule?.badgedCount ?? 0} candidates
        </div>
      </div>
    </SidePanel>
  )
}

function DateField({
  label,
  value,
  onChange,
  onClear,
  placeholder = 'Select date',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onClear: () => void
  placeholder?: string
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-[#2D2061]">{label}</span>
      <div className="relative">
        <CalendarDays
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
          aria-hidden="true"
        />
        <input
          type={value ? 'date' : 'text'}
          value={value}
          placeholder={placeholder}
          onFocus={(event) => {
            event.currentTarget.type = 'date'
          }}
          onBlur={(event) => {
            if (!event.currentTarget.value) {
              event.currentTarget.type = 'text'
            }
          }}
          onChange={(event) => onChange(event.target.value)}
          className={cn(
            'h-11 w-full rounded-md border border-[#ddd9e8] bg-white py-2 pl-10 pr-9 text-sm text-[#2D2061]',
            'outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
          )}
        />
        {value ? (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            onClick={onClear}
            className="absolute right-2.5 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-[#8B8B9E] hover:bg-[#F2F1F6] hover:text-[#2D2061]"
          >
            <X className="size-3.5" strokeWidth={2} />
          </button>
        ) : null}
      </div>
    </div>
  )
}
