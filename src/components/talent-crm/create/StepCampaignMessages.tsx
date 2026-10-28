import { useId, useState } from 'react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react'
import { Button, ThreeDotsMenu, type ThreeDotsMenuItem } from '../../ui'
import { CreateCampaignEmailTemplateEditor } from '../CreateCampaignEmailTemplateEditor'
import { CreateCampaignRulePanel } from '../CreateCampaignRulePanel'
import { SelectCampaignTemplatePanel } from '../SelectCampaignTemplatePanel'
import {
  formatCampaignMessageRuleBadge,
  type CampaignChannel,
  type CampaignMessageRule,
  type CampaignMessageTemplate,
  type CampaignSequenceMessage,
} from '../createCampaignData'

export type StepCampaignMessagesProps = {
  channel: CampaignChannel
  messages: CampaignSequenceMessage[]
  onChange: (messages: CampaignSequenceMessage[]) => void
}

const PREVIEW_PARAGRAPH_COUNT = 2

function channelLabel(channel: CampaignChannel): string {
  switch (channel) {
    case 'email':
      return 'Email'
    case 'sms':
      return 'SMS'
    case 'telephonic':
      return 'Telephonic'
    case '':
      return 'Email'
    default: {
      const exhaustive: never = channel
      return exhaustive
    }
  }
}

function newMessageId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Create Campaign — Messages step: outreach sequence with template picker.
 */
export function StepCampaignMessages({
  channel,
  messages,
  onChange,
}: StepCampaignMessagesProps) {
  const label = channelLabel(channel)
  const idPrefix = useId()
  const [templatePanelOpen, setTemplatePanelOpen] = useState(false)
  const [templateTargetId, setTemplateTargetId] = useState<string | null>(null)
  const [templateEditorOpen, setTemplateEditorOpen] = useState(false)
  /** When set, editor is edit mode for this template; null = create. */
  const [editingTemplate, setEditingTemplate] =
    useState<CampaignMessageTemplate | null>(null)
  const [editMessageId, setEditMessageId] = useState<string | null>(null)
  const [customTemplates, setCustomTemplates] = useState<
    CampaignMessageTemplate[]
  >([])
  const [rulePanelOpen, setRulePanelOpen] = useState(false)
  /** Index of the message whose rule is being created/edited (follow-up). */
  const [ruleTargetIndex, setRuleTargetIndex] = useState<number | null>(null)

  const templateTarget =
    messages.find((item) => item.id === templateTargetId) ?? null

  function openTemplatePicker(messageId: string) {
    setTemplateTargetId(messageId)
    setTemplatePanelOpen(true)
  }

  function applyTemplateToMessage(
    messageId: string,
    template: CampaignMessageTemplate,
  ) {
    onChange(
      messages.map((item) =>
        item.id === messageId ? { ...item, template, expanded: false } : item,
      ),
    )
  }

  function applyTemplateToTarget(template: CampaignMessageTemplate) {
    if (!templateTargetId) return
    applyTemplateToMessage(templateTargetId, template)
  }

  function handleSelectTemplate(template: CampaignMessageTemplate) {
    applyTemplateToTarget(template)
  }

  function openCreateTemplate() {
    setEditingTemplate(null)
    setEditMessageId(templateTargetId)
    setTemplateEditorOpen(true)
  }

  function openEditTemplate(
    messageId: string,
    template: CampaignMessageTemplate,
  ) {
    setEditingTemplate(template)
    setEditMessageId(messageId)
    setTemplateEditorOpen(true)
  }

  function handleSaveTemplate(template: CampaignMessageTemplate) {
    if (editingTemplate) {
      const targetId = editMessageId
      if (targetId) applyTemplateToMessage(targetId, template)
      setCustomTemplates((current) => {
        const exists = current.some((item) => item.id === template.id)
        if (exists) {
          return current.map((item) =>
            item.id === template.id ? template : item,
          )
        }
        return [template, ...current]
      })
      return
    }
    setCustomTemplates((current) => [template, ...current])
    const targetId = editMessageId ?? templateTargetId
    if (targetId) applyTemplateToMessage(targetId, template)
  }

  function handleRemoveMessage(messageId: string) {
    const index = messages.findIndex((item) => item.id === messageId)
    if (index <= 0) {
      onChange([
        {
          id: newMessageId(idPrefix),
          template: null,
          rule: null,
          expanded: false,
        },
      ])
      return
    }
    onChange(messages.slice(0, index))
  }

  function openCreateRule(afterIndex: number) {
    setRuleTargetIndex(afterIndex + 1)
    setRulePanelOpen(true)
  }

  function openEditRule(messageIndex: number) {
    setRuleTargetIndex(messageIndex)
    setRulePanelOpen(true)
  }

  function handleSetRule(rule: CampaignMessageRule) {
    if (ruleTargetIndex === null) return

    const next = [...messages]
    if (ruleTargetIndex < next.length) {
      next[ruleTargetIndex] = {
        ...next[ruleTargetIndex],
        rule,
      }
      onChange(next)
    } else {
      onChange([
        ...next,
        {
          id: newMessageId(idPrefix),
          template: null,
          rule,
          expanded: false,
        },
      ])
    }
    setRuleTargetIndex(null)
  }

  const rulePanelValue =
    ruleTargetIndex !== null && messages[ruleTargetIndex]
      ? messages[ruleTargetIndex].rule
      : null

  return (
    <div className="flex w-full flex-col gap-4 pb-8">
      <header className="border-b border-[#ECEAF3] pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-bold text-[#2D2061]">Messages</h2>
          <span className="inline-flex items-center rounded-full bg-[#EEF0F4] px-2.5 py-0.5 text-[11px] font-semibold text-[#5B6178]">
            {label}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-[#8B8B9E]">
          Build your outreach sequence
        </p>
      </header>

      <div className="flex w-full flex-col">
        {messages.map((message, index) => {
          const number = index + 1
          const isLast = index === messages.length - 1
          return (
            <div key={message.id} className="flex w-full flex-col">
              <MessageBlock
                number={number}
                message={message}
                onSelectTemplate={() => openTemplatePicker(message.id)}
                onRemove={() => handleRemoveMessage(message.id)}
                onChangeTemplate={() => openTemplatePicker(message.id)}
                onEditTemplate={() => {
                  if (message.template) {
                    openEditTemplate(message.id, message.template)
                  }
                }}
                onEditRule={() => openEditRule(index)}
                onToggleExpanded={() =>
                  onChange(
                    messages.map((item) =>
                      item.id === message.id
                        ? { ...item, expanded: !item.expanded }
                        : item,
                    ),
                  )
                }
              />

              <SequenceConnector
                onAdd={() => openCreateRule(index)}
                showCompleted={isLast}
              />
            </div>
          )
        })}
      </div>

      <SelectCampaignTemplatePanel
        open={templatePanelOpen}
        onClose={() => setTemplatePanelOpen(false)}
        selectedTemplateId={templateTarget?.template?.id ?? null}
        extraTemplates={customTemplates}
        onSelect={handleSelectTemplate}
        onCreateNew={openCreateTemplate}
      />

      <CreateCampaignEmailTemplateEditor
        open={templateEditorOpen}
        onClose={() => {
          setTemplateEditorOpen(false)
          setEditingTemplate(null)
          setEditMessageId(null)
        }}
        onSave={handleSaveTemplate}
        template={editingTemplate}
      />

      <CreateCampaignRulePanel
        open={rulePanelOpen}
        onClose={() => {
          setRulePanelOpen(false)
          setRuleTargetIndex(null)
        }}
        value={rulePanelValue}
        onSet={handleSetRule}
      />
    </div>
  )
}

function MessageBlock({
  number,
  message,
  onSelectTemplate,
  onRemove,
  onChangeTemplate,
  onEditTemplate,
  onEditRule,
  onToggleExpanded,
}: {
  number: number
  message: CampaignSequenceMessage
  onSelectTemplate: () => void
  onRemove: () => void
  onChangeTemplate: () => void
  onEditTemplate: () => void
  onEditRule: () => void
  onToggleExpanded: () => void
}) {
  if (!message.template) {
    return (
      <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F8F8F8] px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <p className="text-sm font-bold text-[#2D2061]">Message {number}</p>
          {message.rule ? (
            <button
              type="button"
              onClick={onEditRule}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#D5D2E2] bg-white px-2.5 py-1 text-left text-[12px] font-medium text-[#5B6178] transition-colors hover:border-[#C9C4D8]"
            >
              <span className="truncate">
                {formatCampaignMessageRuleBadge(message.rule, number - 1)}
              </span>
              <Pencil
                className="size-3 shrink-0 text-[#8B8B9E]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </button>
          ) : null}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onSelectTemplate}
          className="!h-9 shrink-0 !rounded-md !border-[#D5D2E2] !bg-white !px-3.5 !text-[13px] !font-semibold !text-[#2D2061] hover:!bg-white"
        >
          Select Template
        </Button>
      </div>
    )
  }

  const previewBody = message.expanded
    ? message.template.body
    : message.template.body.slice(0, PREVIEW_PARAGRAPH_COUNT)
  const canToggle = message.template.body.length > PREVIEW_PARAGRAPH_COUNT

  const menuItems: ThreeDotsMenuItem[] = [
    {
      id: 'change',
      label: 'Change Template',
      icon: <RefreshCw className="size-4" strokeWidth={1.75} aria-hidden="true" />,
      onSelect: onChangeTemplate,
    },
    {
      id: 'edit',
      label: 'Edit Template',
      icon: <Pencil className="size-4" strokeWidth={1.75} aria-hidden="true" />,
      onSelect: onEditTemplate,
    },
  ]

  return (
    <section className="flex w-full flex-col gap-3 rounded-xl bg-[#F8F8F8] p-4 sm:gap-3.5 sm:p-5">
      <div className="flex min-w-0 flex-wrap items-center gap-2.5">
        <p className="text-sm font-bold text-[#2D2061]">Message {number}</p>
        {message.rule ? (
          <button
            type="button"
            onClick={onEditRule}
            className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#D5D2E2] bg-white px-2.5 py-1 text-left text-[12px] font-medium text-[#5B6178] transition-colors hover:border-[#C9C4D8]"
          >
            <span className="truncate">
              {formatCampaignMessageRuleBadge(message.rule, number - 1)}
            </span>
            <Pencil
              className="size-3 shrink-0 text-[#8B8B9E]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>
        ) : null}
      </div>

      <article className="w-full rounded-xl border border-[#E4E1EE] bg-white">
        <div className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-5 sm:pt-5">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-[#8B8B9E]">
              Template Name
            </p>
            <p className="mt-0.5 text-[15px] font-semibold text-[#2D2061]">
              {message.template.name}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1 rounded-md bg-[#FDECEC] px-2.5 py-1.5 text-[13px] font-semibold text-[#E53935] transition-colors hover:bg-[#FAD4D4]"
            >
              <X className="size-3.5" strokeWidth={2.25} aria-hidden="true" />
              Remove
            </button>
            <ThreeDotsMenu
              triggerLabel={`Actions for ${message.template.name}`}
              side="left"
              items={menuItems}
              triggerClassName="text-[#6B6B80]"
            />
          </div>
        </div>

        <div className="mt-4 border-t border-[#ECEAF3] px-4 pt-4 pb-4 sm:px-5 sm:pb-5">
          <p className="text-sm font-bold text-[#1A1A2E]">
            {message.template.subject}
          </p>
          <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#4A4A5C]">
            {previewBody.map((paragraph, index) => (
              <p key={`${message.id}-p-${index}`}>{paragraph}</p>
            ))}
          </div>
          {canToggle ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={onToggleExpanded}
                className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2D2061] transition-colors hover:text-[#241a52]"
              >
                {message.expanded ? 'Show Less' : 'Show More'}
                {message.expanded ? (
                  <ChevronUp
                    className="size-3.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronDown
                    className="size-3.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          ) : null}
        </div>
      </article>
    </section>
  )
}

function SequenceConnector({
  onAdd,
  showCompleted,
}: {
  onAdd: () => void
  showCompleted: boolean
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-4 w-px bg-[#D5D2E2]" aria-hidden="true" />
      <button
        type="button"
        onClick={onAdd}
        aria-label="Create rule"
        className="inline-flex size-8 items-center justify-center rounded-md border border-[#D5D2E2] bg-white text-[#2D2061] shadow-sm transition-colors hover:bg-[#F7F6FB]"
      >
        <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
      </button>
      {showCompleted ? (
        <>
          <ChevronDown
            className="mt-1 size-4 text-[#A0A0B2]"
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="mt-1 inline-flex size-8 items-center justify-center rounded-md border border-[#D5D2E2] bg-[#EEF2FF] text-[#2D2061]">
            <Check className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <p className="mt-1.5 text-[13px] font-medium text-[#8B8B9E]">
            Completed
          </p>
        </>
      ) : (
        <div className="h-4 w-px bg-[#D5D2E2]" aria-hidden="true" />
      )}
    </div>
  )
}
