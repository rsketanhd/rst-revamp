import { useState } from 'react'
import { CircleHelp, Pencil, Trash2 } from 'lucide-react'
import { Button, ConfirmDeleteModal, Switch, toast } from '../ui'
import { cn } from '../../lib/cn'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'
import {
  OfferApprovalRulePanel,
  offerAppliesToLabel,
  offerChainLabel,
  type OfferApprovalRuleForm,
} from './OfferApprovalRulePanel'

type OfferApprovalRule = {
  id: string
  enabled: boolean
  inUseCount: number
  form: OfferApprovalRuleForm
}

type RuleEditor =
  | { mode: 'add' }
  | { mode: 'edit'; ruleId: string; form: OfferApprovalRuleForm }

/**
 * Settings → Module Configuration → Approvals → Offer Approvals.
 */
export function ApprovalsOfferApprovalsPanel() {
  const [useApprovals, setUseApprovals] = useState(true)
  const [rules, setRules] = useState<OfferApprovalRule[]>([])
  const [editor, setEditor] = useState<RuleEditor | null>(null)
  const [pendingDelete, setPendingDelete] = useState<OfferApprovalRule | null>(
    null,
  )

  function setRuleEnabled(id: string, enabled: boolean) {
    setRules((current) =>
      current.map((rule) => (rule.id === id ? { ...rule, enabled } : rule)),
    )
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setRules((current) =>
      current.filter((rule) => rule.id !== pendingDelete.id),
    )
    toast.success(`“${pendingDelete.form.name}” was deleted.`, {
      title: 'Offer Approvals',
    })
    setPendingDelete(null)
  }

  function handleSaveRule(form: OfferApprovalRuleForm) {
    if (editor?.mode === 'edit') {
      setRules((current) =>
        current.map((rule) =>
          rule.id === editor.ruleId ? { ...rule, form } : rule,
        ),
      )
      toast.success(`“${form.name}” was updated.`, { title: 'Offer Approvals' })
      return
    }

    const next: OfferApprovalRule = {
      id: `offer-rule-${Date.now()}`,
      enabled: true,
      inUseCount: 0,
      form,
    }
    setRules((current) => [...current, next])
    toast.success(`“${form.name}” was added.`, { title: 'Offer Approvals' })
  }

  return (
    <SettingsPanel
      eyebrow="Approvals"
      title="Offer Approvals"
      description="Who approves an offer before it can be sent. An offer waits in Pending approval, and can't be sent, until every level approves."
    >
      <div
        role="status"
        className="flex items-start gap-2.5 rounded-[8px] border border-[#C9D8F5] bg-[#EAF1FE] px-4 py-3 text-xs leading-relaxed text-[#2F5AA8]"
      >
        <CircleHelp
          className="mt-0.5 size-3.5 shrink-0"
          strokeWidth={1.75}
          aria-hidden="true"
        />
        <p>
          Changes apply to offers submitted from now on. Offers already waiting
          for approval keep the rule and approvers they were submitted with.
          Rules can test the legal entity, the total package, the department,
          the employment type, and the job&apos;s category, sub category and
          type, the hiring manager and the recruiter.
        </p>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-3xl">
            <h3 className="text-sm font-bold text-[#2D2061]">Use approvals</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
              When off, or when no rule matches, submitting an offer approves it
              straight away and the main action becomes &apos;Send Offer&apos;.
            </p>
          </div>
          <Switch
            checked={useApprovals}
            onCheckedChange={setUseApprovals}
            aria-label="Use approvals"
            className="!gap-0 shrink-0"
          />
        </div>
      </div>

      <SettingsBlock
        title="Approval rules"
        description={
          <>
            The most specific matching rule applies (most satisfied conditions);
            ties go to the most recently updated. &apos;All offers&apos; is the
            fallback.
          </>
        }
        className={cn(!useApprovals && 'opacity-60')}
        trailing={
          <Button
            type="button"
            variant="outline"
            disabled={!useApprovals}
            onClick={() => setEditor({ mode: 'add' })}
            className="shrink-0 !h-9 !rounded-md !border-[#2D2061] !px-3.5 !text-[#2D2061] hover:!bg-white disabled:!opacity-50"
          >
            Add rule
          </Button>
        }
      >
        {rules.length === 0 ? (
          <p className="rounded-[8px] border border-[#E4E1EE] bg-white px-4 py-8 text-center text-sm text-[#8B8B9E]">
            No rules yet — every submitted offer is approved automatically.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {rules.map((rule) => (
              <li
                key={rule.id}
                className="rounded-[8px] border border-[#E4E1EE] bg-white px-4 py-3.5 sm:px-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#2D2061]">
                    {rule.form.name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      aria-label={`Edit ${rule.form.name}`}
                      disabled={!useApprovals}
                      onClick={() =>
                        setEditor({
                          mode: 'edit',
                          ruleId: rule.id,
                          form: rule.form,
                        })
                      }
                      className="inline-flex size-8 items-center justify-center rounded-[8px] text-[#6B6B80] transition-colors hover:bg-[#F5F4FA] hover:text-[#2D2061] disabled:opacity-50"
                    >
                      <Pencil
                        className="size-4"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${rule.form.name}`}
                      disabled={!useApprovals}
                      onClick={() => setPendingDelete(rule)}
                      className="inline-flex size-8 items-center justify-center rounded-[8px] text-[#6B6B80] transition-colors hover:bg-[#F5F4FA] hover:text-[#C44B4B] disabled:opacity-50"
                    >
                      <Trash2
                        className="size-4"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                    </button>
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={(checked) =>
                        setRuleEnabled(rule.id, checked)
                      }
                      disabled={!useApprovals}
                      aria-label={`${rule.form.name} enabled`}
                      className="!gap-0"
                    />
                  </div>
                </div>

                <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[7.5rem_minmax(0,1fr)] sm:gap-x-3 sm:gap-y-1.5">
                  <RuleField
                    label="Applies to"
                    value={offerAppliesToLabel(rule.form)}
                  />
                  <RuleField
                    label="Chain"
                    value={offerChainLabel(rule.form)}
                  />
                  <RuleField
                    label="In use"
                    value={
                      rule.inUseCount === 1
                        ? '1 offer waiting for approval under this rule'
                        : `${rule.inUseCount} offers waiting for approval under this rule`
                    }
                  />
                </dl>
              </li>
            ))}
          </ul>
        )}
      </SettingsBlock>

      <OfferApprovalRulePanel
        open={Boolean(editor)}
        initial={editor?.mode === 'edit' ? editor.form : null}
        onClose={() => setEditor(null)}
        onSave={handleSaveRule}
      />

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title="Delete Rule"
        itemName={pendingDelete?.form.name}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </SettingsPanel>
  )
}

function RuleField({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-xs font-medium text-[#8B8B9E]">{label}</dt>
      <dd className="text-sm text-[#2D2061]">{value}</dd>
    </>
  )
}
