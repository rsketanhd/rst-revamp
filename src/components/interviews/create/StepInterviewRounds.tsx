import { useState, type DragEvent } from 'react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Info,
  Layers,
  Pencil,
  Plus,
  SquarePen,
  Trash2,
} from 'lucide-react'
import { cn } from '../../../lib/cn'
import {
  Button,
  ConfirmDeleteModal,
  ThreeDotsMenu,
  Tooltip,
  toast,
} from '../../ui'
import { CreateTemplatePanel } from './CreateTemplatePanel'
import { RoundDetailsPanel, type RoundDetails } from './RoundDetailsPanel'
import {
  formatTemplateDate,
  templateSummary,
  type InterviewTemplateOption,
} from './templates'
import {
  createRound,
  type CreateOneWayInterviewForm,
  type InterviewRound,
} from './types'

type Props = {
  value: CreateOneWayInterviewForm
  onChange: (patch: Partial<CreateOneWayInterviewForm>) => void
  templates: InterviewTemplateOption[]
  onTemplatesChange: (next: InterviewTemplateOption[]) => void
}

type DetailsState = { mode: 'add' } | { mode: 'edit'; roundId: string }

/** Starting values for the Add Round panel. */
const NEW_ROUND_DETAILS: RoundDetails = {
  name: '',
  interviewType: '',
  difficulty: '',
  avatarEnabled: true,
}

/**
 * Step 02 — Interview Rounds. Collapsible round rows; each round has a
 * default template (first invite) and a drag-ordered resend list.
 */
export function StepInterviewRounds({
  value,
  onChange,
  templates,
  onTemplatesChange,
}: Props) {
  const rounds = value.rounds
  const [expanded, setExpanded] = useState<string[]>(() =>
    rounds[0] ? [rounds[0].id] : [],
  )
  const [details, setDetails] = useState<DetailsState | null>(null)
  const [templateRoundId, setTemplateRoundId] = useState<string | null>(null)
  const [pendingRemove, setPendingRemove] = useState<InterviewRound | null>(
    null,
  )
  const [dragRoundId, setDragRoundId] = useState<string | null>(null)
  const [dragTemplate, setDragTemplate] = useState<{
    roundId: string
    templateId: string
  } | null>(null)

  const byId = (id: string) => templates.find((t) => t.id === id)
  const templateRound = rounds.find((r) => r.id === templateRoundId)
  const templateRoundNumber = rounds.findIndex((r) => r.id === templateRoundId) + 1

  function setRounds(next: InterviewRound[]) {
    onChange({ rounds: next })
  }

  function updateRound(roundId: string, patch: Partial<InterviewRound>) {
    setRounds(rounds.map((r) => (r.id === roundId ? { ...r, ...patch } : r)))
  }

  function toggleExpanded(roundId: string) {
    setExpanded((current) =>
      current.includes(roundId)
        ? current.filter((id) => id !== roundId)
        : [...current, roundId],
    )
  }

  /* ----- rounds ----- */

  const detailsRound =
    details?.mode === 'edit'
      ? rounds.find((r) => r.id === details.roundId)
      : undefined
  const detailsNumber =
    details?.mode === 'edit'
      ? rounds.findIndex((r) => r.id === details.roundId) + 1
      : rounds.length + 1

  function saveDetails(values: RoundDetails) {
    if (!details) return
    if (details.mode === 'add') {
      setRounds([...rounds, { ...createRound(rounds.length + 1), ...values }])
      toast.success(`“${values.name}” added.`, { title: 'Round added' })
    } else {
      updateRound(details.roundId, values)
      toast.success(`“${values.name}” updated.`, { title: 'Round updated' })
    }
    setDetails(null)
  }

  function duplicateRound(round: InterviewRound) {
    const index = rounds.findIndex((r) => r.id === round.id)
    const copy = { ...round, id: `round-${Date.now()}`, name: `${round.name} (Copy)` }
    setRounds([...rounds.slice(0, index + 1), copy, ...rounds.slice(index + 1)])
    toast.success(`Duplicated “${round.name}”.`, { title: 'Duplicate' })
  }

  function confirmRemoveRound() {
    if (!pendingRemove) return
    setRounds(rounds.filter((r) => r.id !== pendingRemove.id))
    setExpanded((current) => current.filter((id) => id !== pendingRemove.id))
    toast.success(`Removed “${pendingRemove.name}”.`, { title: 'Round removed' })
    setPendingRemove(null)
  }

  function handleRoundDragOver(event: DragEvent, overId: string) {
    if (!dragRoundId) return
    event.preventDefault()
    if (dragRoundId === overId) return
    const from = rounds.findIndex((r) => r.id === dragRoundId)
    const to = rounds.findIndex((r) => r.id === overId)
    if (from < 0 || to < 0) return
    const next = [...rounds]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    setRounds(next)
  }

  /* ----- templates within a round ----- */

  function makeDefault(round: InterviewRound, templateId: string) {
    const previous = round.defaultTemplateId
    updateRound(round.id, {
      defaultTemplateId: templateId,
      resendTemplateIds: previous
        ? round.resendTemplateIds.map((id) => (id === templateId ? previous : id))
        : round.resendTemplateIds.filter((id) => id !== templateId),
    })
  }

  function removeTemplate(round: InterviewRound, templateId: string) {
    if (round.defaultTemplateId === templateId) {
      const [nextDefault = '', ...rest] = round.resendTemplateIds
      updateRound(round.id, {
        defaultTemplateId: nextDefault,
        resendTemplateIds: rest,
      })
    } else {
      updateRound(round.id, {
        resendTemplateIds: round.resendTemplateIds.filter((id) => id !== templateId),
      })
    }
  }

  function handleTemplateMenu(
    round: InterviewRound,
    templateId: string,
    action: string,
  ) {
    const template = byId(templateId)
    if (!template) return
    if (action === 'edit') {
      toast.success(`Opening “${template.name}”.`, { title: 'Edit template' })
    }
    if (action === 'remove') {
      removeTemplate(round, templateId)
      toast.success(`Removed “${template.name}” from ${round.name}.`, {
        title: 'Template removed',
      })
    }
  }

  function handleResendDragOver(
    event: DragEvent,
    round: InterviewRound,
    overId: string,
  ) {
    if (!dragTemplate || dragTemplate.roundId !== round.id) return
    event.preventDefault()
    event.stopPropagation()
    if (dragTemplate.templateId === overId) return
    const list = [...round.resendTemplateIds]
    const from = list.indexOf(dragTemplate.templateId)
    const to = list.indexOf(overId)
    if (from < 0 || to < 0) return
    const [moved] = list.splice(from, 1)
    list.splice(to, 0, moved)
    updateRound(round.id, { resendTemplateIds: list })
  }

  return (
    <>
      <div className="flex min-h-full flex-col">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-[#2D2061]">Interview Rounds</h2>
            <p className="mt-0.5 text-sm text-[#8B8B9E]">
              Create and configure rounds and assign a template to each round.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setDetails({ mode: 'add' })}
            className="!h-10 shrink-0 !rounded-md !bg-[#2D2061] px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
            Add Round
          </Button>
        </div>

        {rounds.length === 0 ? (
          <div className="flex min-h-[14rem] flex-col items-center justify-center rounded-xl border border-dashed border-[#DAD6E6] px-4 py-12 text-center">
            <Layers
              className="mb-3 size-10 text-[#C5C5D2]"
              strokeWidth={1.25}
              aria-hidden="true"
            />
            <p className="text-sm font-medium text-[#A0A0B2]">No rounds added yet</p>
            <p className="mt-1 text-xs text-[#A0A0B2]">
              Click Add Round to create the first round.
            </p>
          </div>
        ) : (
          <ol aria-label="Interview rounds" className="flex flex-col gap-3">
            {rounds.map((round, index) => {
              const defaultTemplate = byId(round.defaultTemplateId)
              const resendTemplates = round.resendTemplateIds.flatMap(
                (id) => byId(id) ?? [],
              )
              const templateCount =
                (defaultTemplate ? 1 : 0) + resendTemplates.length
              const isOpen = templateCount > 0 && expanded.includes(round.id)
              const roundName = round.name.trim() || `Round ${index + 1}`

              return (
                <li
                  key={round.id}
                  onDragOver={(e) => handleRoundDragOver(e, round.id)}
                  className={cn(
                    'overflow-hidden rounded-xl border border-[#E4E1EE] bg-white',
                    dragRoundId === round.id && 'opacity-70 ring-2 ring-[#2D2061]/20',
                  )}
                >
                  {/* Round row */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-3 py-3 lg:flex-nowrap">
                    <div className="flex min-w-[14rem] flex-1 items-center gap-3">
                      <span
                        draggable
                        onDragStart={() => setDragRoundId(round.id)}
                        onDragEnd={() => setDragRoundId(null)}
                        title="Drag to reorder"
                        className="inline-flex cursor-grab text-[#C5C2D3] active:cursor-grabbing"
                      >
                        <GripVertical className="size-4" strokeWidth={2} aria-hidden="true" />
                      </span>
                      <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#2D2061] text-sm font-bold tabular-nums text-white">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold text-[#1F1B4D]">
                          {roundName}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-[#8B8B9E]">
                          {round.interviewType || 'Interview type not set'}
                        </p>
                      </div>
                    </div>

                    <p className="w-40 shrink-0 text-sm text-[#6B6B80]">
                      Difficulty Level{' '}
                      <span className="font-bold text-[#1F1B4D]">
                        {round.difficulty || '—'}
                      </span>
                    </p>

                    <p className="flex w-36 shrink-0 items-center gap-2 text-sm text-[#6B6B80]">
                      Avatar
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold',
                          round.avatarEnabled
                            ? 'bg-[#E6F6EC] text-[#15803D]'
                            : 'bg-[#EEEEF2] text-[#6B6B80]',
                        )}
                      >
                        {round.avatarEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </p>

                    <div className="ml-auto flex shrink-0 items-center gap-2">
                      <div className="flex min-w-36 justify-end">
                        {templateCount > 0 ? (
                          <span className="text-sm text-[#6B6B80]">
                            {templateCount}{' '}
                            {templateCount === 1 ? 'template' : 'templates'}
                          </span>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setTemplateRoundId(round.id)}
                            className="!h-8 !gap-1.5 !rounded-md !border-[#5B4B9A] bg-white !px-3.5 !text-[13px] !font-medium whitespace-nowrap !text-[#2D2061] hover:bg-[#f7f6fb]"
                          >
                            <Plus className="size-3.5" strokeWidth={2} aria-hidden="true" />
                            Create Template
                          </Button>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setDetails({ mode: 'edit', roundId: round.id })}
                        aria-label={`Edit ${roundName}`}
                        className="inline-flex size-9 items-center justify-center rounded-md text-[#2D2061] transition-colors hover:bg-[#F5F4FA]"
                      >
                        <Pencil className="size-4" strokeWidth={1.75} aria-hidden="true" />
                      </button>
                      <ThreeDotsMenu
                        triggerLabel={`More actions for ${roundName}`}
                        side="left"
                        items={[
                          {
                            id: 'duplicate',
                            label: 'Duplicate',
                            icon: <Copy strokeWidth={1.75} aria-hidden="true" />,
                          },
                          {
                            id: 'remove',
                            label: 'Remove',
                            destructive: true,
                            icon: <Trash2 strokeWidth={1.75} aria-hidden="true" />,
                          },
                        ]}
                        onItemSelect={(id) => {
                          if (id === 'duplicate') duplicateRound(round)
                          if (id === 'remove') setPendingRemove(round)
                        }}
                      />
                      {/* Fixed slot so actions line up whether or not a round can expand */}
                      <span className="inline-flex size-9 items-center justify-center">
                        {templateCount > 0 ? (
                          <button
                            type="button"
                            onClick={() => toggleExpanded(round.id)}
                            aria-expanded={isOpen}
                            aria-label={`${isOpen ? 'Hide' : 'Show'} templates for ${roundName}`}
                            className="inline-flex size-9 items-center justify-center rounded-md border border-[#E4E1EE] bg-[#F7F7FA] text-[#2D2061] transition-colors hover:bg-[#EFEEF5]"
                          >
                            {isOpen ? (
                              <ChevronUp className="size-4" strokeWidth={2} aria-hidden="true" />
                            ) : (
                              <ChevronDown className="size-4" strokeWidth={2} aria-hidden="true" />
                            )}
                          </button>
                        ) : null}
                      </span>
                    </div>
                  </div>

                  {/* Templates */}
                  {isOpen ? (
                    <div className="border-t border-[#E4E1EE] bg-[#F7F7FA] p-4">
                      <header className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="text-sm font-bold text-[#1F1B4D]">Templates</h3>
                        <button
                          type="button"
                          onClick={() => setTemplateRoundId(round.id)}
                          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-[#4A4760] transition-colors hover:bg-white hover:text-[#2D2061]"
                        >
                          <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
                          Create New Template
                        </button>
                      </header>

                      <div className="flex flex-col gap-3">
                        {/* Default */}
                        <div className="rounded-xl border border-[#E4E1EE] bg-white p-3">
                          <SectionHeader
                            badge="Default"
                            badgeClassName="bg-[#F3EEF9] text-[#5B3E8F]"
                            title="Sent with every first invite"
                            tooltip="This template is sent the first time a candidate is invited to this round."
                          />
                          {defaultTemplate ? (
                            <div className="flex items-center gap-3 rounded-lg border border-[#E4E1EE] bg-white px-3 py-3">
                              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#2D2061] text-white">
                                <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                              </span>
                              <TemplateText template={defaultTemplate} />
                              <TemplateMenu
                                template={defaultTemplate}
                                onSelect={(action) =>
                                  handleTemplateMenu(round, defaultTemplate.id, action)
                                }
                              />
                            </div>
                          ) : (
                            <p className="rounded-lg border border-dashed border-[#D5D2E2] px-4 py-3 text-sm text-[#8B8B9E]">
                              No default template yet. Use Make Default on a template below.
                            </p>
                          )}
                        </div>

                        {/* Resend */}
                        <div className="rounded-xl border border-[#E4E1EE] bg-white p-3">
                          <SectionHeader
                            badge="Resend"
                            badgeClassName="bg-[#EEEEF2] text-[#6B6B80]"
                            title={`Used when you invite a candidate to ${roundName} again`}
                            tooltip="When you invite a candidate to this round again, the next template in this order is used."
                          />
                          {resendTemplates.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-[#D5D2E2] px-4 py-3 text-sm text-[#8B8B9E]">
                              No resend templates. Re-invites will use the default template.
                            </p>
                          ) : (
                            <ol className="flex flex-col gap-2">
                              {resendTemplates.map((template, i) => {
                                const mismatch =
                                  Boolean(defaultTemplate) &&
                                  template.language !== defaultTemplate?.language
                                const dragging =
                                  dragTemplate?.roundId === round.id &&
                                  dragTemplate.templateId === template.id
                                return (
                                  <li
                                    key={template.id}
                                    draggable
                                    onDragStart={(e) => {
                                      e.stopPropagation()
                                      setDragTemplate({
                                        roundId: round.id,
                                        templateId: template.id,
                                      })
                                    }}
                                    onDragOver={(e) =>
                                      handleResendDragOver(e, round, template.id)
                                    }
                                    onDragEnd={() => setDragTemplate(null)}
                                    className={cn(
                                      'flex flex-wrap items-center gap-3 rounded-lg border border-[#E4E1EE] bg-white py-3 pl-2 pr-3 sm:flex-nowrap',
                                      dragging && 'opacity-70 ring-2 ring-[#2D2061]/20',
                                    )}
                                  >
                                    <span
                                      className="inline-flex cursor-grab text-[#B8B5C9] active:cursor-grabbing"
                                      aria-hidden="true"
                                    >
                                      <GripVertical className="size-4" strokeWidth={2} />
                                    </span>
                                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#15122E] text-[10px] font-bold text-white">
                                      {ordinal(i + 1)}
                                    </span>
                                    <TemplateText
                                      template={template}
                                      warning={
                                        mismatch
                                          ? 'Different language than Default template'
                                          : undefined
                                      }
                                    />
                                    <div className="ml-auto flex shrink-0 items-center gap-3">
                                      <button
                                        type="button"
                                        onClick={() => makeDefault(round, template.id)}
                                        className="rounded-md px-2 py-1.5 text-sm font-semibold text-[#1F1B4D] transition-colors hover:bg-[#F5F4FA]"
                                      >
                                        Make Default
                                      </button>
                                      <TemplateMenu
                                        template={template}
                                        onSelect={(action) =>
                                          handleTemplateMenu(round, template.id, action)
                                        }
                                      />
                                    </div>
                                  </li>
                                )
                              })}
                            </ol>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </li>
              )
            })}
          </ol>
        )}
      </div>

      <RoundDetailsPanel
        open={details !== null}
        mode={details?.mode ?? 'add'}
        roundLabel={`Round ${detailsNumber}`}
        initial={detailsRound ?? NEW_ROUND_DETAILS}
        onClose={() => setDetails(null)}
        onSave={saveDetails}
      />

      <CreateTemplatePanel
        open={templateRoundId !== null}
        onClose={() => setTemplateRoundId(null)}
        interviewType={templateRound?.interviewType}
        difficulty={templateRound?.difficulty}
        round={
          templateRound
            ? { label: `Round ${templateRoundNumber}`, name: templateRound.name }
            : undefined
        }
        onCreated={(template) => {
          if (!templateRound) return
          const next: InterviewTemplateOption = {
            id: template.id,
            name: template.name,
            language: template.language,
            type: template.type,
            updatedOn: formatTemplateDate(new Date()),
            isDefault: template.type === 'Default',
            isResend: template.type === 'Resend',
            questions: template.questions,
            screeningEnabled: template.screeningEnabled,
          }
          onTemplatesChange([...templates, next])
          updateRound(
            templateRound.id,
            templateRound.defaultTemplateId
              ? {
                  resendTemplateIds: [
                    ...templateRound.resendTemplateIds,
                    template.id,
                  ],
                }
              : { defaultTemplateId: template.id },
          )
          setExpanded((current) =>
            current.includes(templateRound.id)
              ? current
              : [...current, templateRound.id],
          )
        }}
      />

      <ConfirmDeleteModal
        open={Boolean(pendingRemove)}
        title="Remove Round"
        itemName={pendingRemove?.name}
        onClose={() => setPendingRemove(null)}
        onConfirm={confirmRemoveRound}
      />
    </>
  )
}

function ordinal(n: number): string {
  const tens = n % 100
  if (tens >= 11 && tens <= 13) return `${n}th`
  const suffix = { 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th'
  return `${n}${suffix}`
}

function InfoTip({ label, content }: { label: string; content: string }) {
  return (
    <Tooltip content={content} side="top" align="start" maxWidth={288}>
      <button
        type="button"
        aria-label={`About ${label}`}
        className="inline-flex text-[#8B8B9E] outline-none transition-colors hover:text-[#2D2061] focus-visible:text-[#2D2061]"
      >
        <Info className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </Tooltip>
  )
}

function SectionHeader({
  badge,
  badgeClassName,
  title,
  tooltip,
}: {
  badge: string
  badgeClassName: string
  title: string
  tooltip: string
}) {
  return (
    <header className="mb-3 flex items-center gap-2.5">
      <span
        className={cn(
          'inline-flex shrink-0 rounded-md px-2 py-0.5 text-xs font-medium',
          badgeClassName,
        )}
      >
        {badge}
      </span>
      <h4 className="min-w-0 flex-1 text-sm font-semibold text-[#1F1B4D]">
        {title}
      </h4>
      <InfoTip label={badge} content={tooltip} />
    </header>
  )
}

function TemplateText({
  template,
  warning,
}: {
  template: InterviewTemplateOption
  warning?: string
}) {
  return (
    <div className="min-w-0 flex-1">
      <p dir="auto" className="truncate text-sm font-bold text-[#1F1B4D]">
        {template.name}
      </p>
      <p className="mt-0.5 text-xs text-[#8B8B9E]">{templateSummary(template)}</p>
      {warning ? (
        <p className="mt-0.5 text-xs font-medium text-[#D92D20]">{warning}</p>
      ) : null}
    </div>
  )
}

function TemplateMenu({
  template,
  onSelect,
}: {
  template: InterviewTemplateOption
  onSelect: (action: string) => void
}) {
  return (
    <ThreeDotsMenu
      triggerLabel={`More actions for ${template.name}`}
      side="left"
      items={[
        {
          id: 'edit',
          label: 'View / Edit',
          icon: <SquarePen strokeWidth={1.75} aria-hidden="true" />,
        },
        {
          id: 'remove',
          label: 'Remove from round',
          destructive: true,
          icon: <Trash2 strokeWidth={1.75} aria-hidden="true" />,
        },
      ]}
      onItemSelect={onSelect}
    />
  )
}
