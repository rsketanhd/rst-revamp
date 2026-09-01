import { useState, type DragEvent } from 'react'
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Modal, Switch, toast } from '../ui'
import { SettingsPanel } from './SettingsPanel'
import { SettingsUnderlineTabs } from './SettingsUnderlineTabs'
import { EditBadgeRulePanel } from './EditBadgeRulePanel'
import { cn } from '../../lib/cn'
import {
  ATS_STAGES,
  INITIAL_BADGE_RULES,
  TALENT_CRM_STAGES,
  formatBadgedCount,
  type AtsStage,
  type BadgeRule,
} from '../../data/talentCrmSettings'

type TalentCrmTab = 'stages' | 'badges'

/**
 * Settings → Module Configuration → Talent CRM → Talent Pool Settings.
 */
export function TalentCrmPanel() {
  const [tab, setTab] = useState<TalentCrmTab>('stages')
  const [atsStages, setAtsStages] = useState<AtsStage[]>(ATS_STAGES)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({})
  const [dragId, setDragId] = useState<string | null>(null)
  const [automaticBadging, setAutomaticBadging] = useState(true)
  const [rules, setRules] = useState<BadgeRule[]>(INITIAL_BADGE_RULES)
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<BadgeRule | null>(null)

  const editingRule =
    rules.find((rule) => rule.id === editingRuleId) ?? null

  function toggleExpanded(id: string) {
    setExpandedIds((current) => ({ ...current, [id]: !current[id] }))
  }

  function patchAtsStage(id: string, patch: Partial<AtsStage>) {
    setAtsStages((current) =>
      current.map((stage) =>
        stage.id === id ? { ...stage, ...patch } : stage,
      ),
    )
  }

  function toggleSubStage(
    stageId: string,
    subStageId: string,
    enabled: boolean,
  ) {
    setAtsStages((current) =>
      current.map((stage) => {
        if (stage.id !== stageId) return stage
        return {
          ...stage,
          subStages: stage.subStages.map((sub) =>
            sub.id === subStageId ? { ...sub, enabled } : sub,
          ),
        }
      }),
    )
  }

  function handleDragStart(id: string) {
    setDragId(id)
  }

  function handleDragOver(event: DragEvent, overId: string) {
    event.preventDefault()
    if (!dragId || dragId === overId) return
    setAtsStages((current) => {
      const from = current.findIndex((stage) => stage.id === dragId)
      const to = current.findIndex((stage) => stage.id === overId)
      if (from < 0 || to < 0 || from === to) return current
      const next = [...current]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }

  function handleDragEnd() {
    setDragId(null)
  }

  function handleSaveRule(next: BadgeRule) {
    setRules((current) =>
      current.map((rule) => (rule.id === next.id ? next : rule)),
    )
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setRules((current) =>
      current.filter((rule) => rule.id !== pendingDelete.id),
    )
    toast.success(`“${pendingDelete.badge}” was deleted.`, {
      title: 'Badge rule removed',
    })
    setPendingDelete(null)
  }

  return (
    <>
      <SettingsPanel
        title="Talent Pool Settings"
        description="Manage your user registration credentials and customize active recruiter daily digest parameters."
      >
        <SettingsUnderlineTabs
          aria-label="Talent CRM sections"
          value={tab}
          onChange={setTab}
          options={[
            { value: 'stages', label: 'Stage Configuration' },
            { value: 'badges', label: 'Badge Rules' },
          ]}
        />

        {tab === 'stages' ? (
          <div className="flex flex-col gap-8 pt-1">
            <section>
              <h3 className="mb-3 text-sm font-bold text-[#1F1F2E]">
                Talent CRM stages
              </h3>
              <ul className="divide-y divide-[#ECEAF3] rounded-lg border border-[#E8E6F0]">
                {TALENT_CRM_STAGES.map((stage) => (
                  <li
                    key={stage.id}
                    className="flex items-center justify-between gap-3 px-4 py-3.5"
                  >
                    <span className="text-sm font-medium text-[#2A2740]">
                      {stage.name}
                    </span>
                    {stage.alwaysShown ? (
                      <span className="inline-flex shrink-0 rounded-full bg-[#F0EEF5] px-2.5 py-1 text-[11px] font-medium text-[#6B6B80]">
                        Always shown
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h3 className="text-sm font-bold text-[#1F1F2E]">ATS stages</h3>
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#8B8B9E]">
                Enable a stage to count every candidate in it. Sub-stages are
                optional — candidates outside an enabled sub-stage still count
                at the stage.
              </p>

              <ul className="mt-3 divide-y divide-[#ECEAF3] rounded-lg border border-[#E8E6F0]">
                {atsStages.map((stage) => {
                  const expanded = Boolean(expandedIds[stage.id])
                  const hasSubs = stage.subStages.length > 0
                  const isDragging = dragId === stage.id
                  return (
                    <li
                      key={stage.id}
                      draggable
                      onDragStart={(event) => {
                        event.dataTransfer.effectAllowed = 'move'
                        handleDragStart(stage.id)
                      }}
                      onDragOver={(event) => handleDragOver(event, stage.id)}
                      onDragEnd={handleDragEnd}
                      className={cn(
                        'bg-white transition-shadow',
                        isDragging && 'opacity-70 ring-2 ring-inset ring-[#2D2061]/20',
                      )}
                    >
                      <div className="flex items-center gap-2 px-3 py-3.5 sm:px-4">
                        <span
                          className="inline-flex size-7 shrink-0 cursor-grab items-center justify-center text-[#B0ACC4] active:cursor-grabbing"
                          aria-hidden="true"
                        >
                          <GripVertical className="size-4" strokeWidth={1.75} />
                        </span>

                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${stage.name}`}
                          onClick={() => toggleExpanded(stage.id)}
                          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F2F1F6] hover:text-[#2D2061]"
                        >
                          {expanded ? (
                            <ChevronDown className="size-4" strokeWidth={2} />
                          ) : (
                            <ChevronRight className="size-4" strokeWidth={2} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => toggleExpanded(stage.id)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="text-sm font-semibold text-[#2A2740]">
                            {stage.name}{' '}
                            <span className="font-medium text-[#8B8B9E]">
                              ({stage.count})
                            </span>
                          </p>
                        </button>
                      </div>

                      {expanded ? (
                        <div className="border-t border-[#F0EEF5] bg-[#FAFAFC] px-4 py-3 sm:pl-16">
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-xs font-medium text-[#6B6B80]">
                              Count candidates in this stage
                            </span>
                            <Switch
                              checked={stage.enabled}
                              onCheckedChange={(checked) =>
                                patchAtsStage(stage.id, { enabled: checked })
                              }
                            />
                          </div>
                          {hasSubs ? (
                            <ul>
                              {stage.subStages.map((sub) => (
                                <li
                                  key={sub.id}
                                  className="flex items-center justify-between gap-3 py-2"
                                >
                                  <span className="text-sm text-[#3D3A52]">
                                    {sub.name}
                                  </span>
                                  <Switch
                                    checked={sub.enabled}
                                    onCheckedChange={(checked) =>
                                      toggleSubStage(stage.id, sub.id, checked)
                                    }
                                  />
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-[#8B8B9E]">
                              No sub-stages configured.
                            </p>
                          )}
                        </div>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </section>
          </div>
        ) : null}

        {tab === 'badges' ? (
          <div className="flex flex-col gap-5 pt-1">
            <div className="flex items-start justify-between gap-4 border-b border-[#ECEAF3] pb-4">
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#1F1F2E]">
                  Automatic Badging
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
                  When on, candidates are badged automatically based on the
                  rules below.
                </p>
              </div>
              <input
                type="checkbox"
                checked={automaticBadging}
                onChange={(e) => setAutomaticBadging(e.target.checked)}
                aria-label="Enable automatic badging"
                className="mt-0.5 size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
              />
            </div>

            <ul className="divide-y divide-[#ECEAF3]">
              {rules.map((rule) => (
                <li
                  key={rule.id}
                  className="flex items-start justify-between gap-4 py-4 first:pt-1"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1F1F2E]">
                        {rule.badge}
                      </h4>
                      <span className="inline-flex rounded-full bg-[#F0EEF5] px-2.5 py-0.5 text-[11px] font-medium text-[#6B6B80]">
                        {rule.ruleType}
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#8B8B9E]">
                      {rule.description}
                    </p>
                    <p className="mt-2 text-xs font-medium text-[#5C5878]">
                      {formatBadgedCount(rule.badgedCount)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Edit ${rule.badge}`}
                      onClick={() => setEditingRuleId(rule.id)}
                      className="inline-flex size-8 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F2F1F6] hover:text-[#2D2061]"
                    >
                      <Pencil className="size-4" strokeWidth={1.75} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${rule.badge}`}
                      onClick={() => setPendingDelete(rule)}
                      className="inline-flex size-8 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#FDF2F2] hover:text-[#E53935]"
                    >
                      <Trash2 className="size-4" strokeWidth={1.75} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </SettingsPanel>

      <EditBadgeRulePanel
        open={Boolean(editingRule)}
        rule={editingRule}
        onClose={() => setEditingRuleId(null)}
        onSave={handleSaveRule}
      />

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        title="Delete Badge Rule"
        className="max-w-md"
      >
        <p className="text-sm leading-relaxed text-[#4A4A5A]">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-[#2D2061]">
            “{pendingDelete?.badge}”
          </span>
          ? This action cannot be undone.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setPendingDelete(null)}
            className="inline-flex h-10 items-center justify-center rounded-md border border-[#2D2061] px-5 text-sm font-medium text-[#2D2061] hover:bg-[#F7F6FA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmDelete}
            className="inline-flex h-10 items-center justify-center rounded-md bg-[#E53935] px-5 text-sm font-semibold text-white hover:bg-[#C62828]"
          >
            Delete
          </button>
        </div>
      </Modal>
    </>
  )
}
