import { useMemo, useState } from 'react'
import { Copy, Files, Plus, Search, SquarePen, Trash2 } from 'lucide-react'
import { Button, Checkbox, ThreeDotsMenu, toast } from '../../ui'
import { cn } from '../../../lib/cn'
import type { TemplateQuestion } from './CreateTemplatePanel'
import type { CreateOneWayInterviewForm } from './types'

export type InterviewTemplateOption = {
  id: string
  name: string
  language: string
  type: string
  /** Display string e.g. "07 Dec 2024" */
  updatedOn: string
  isDefault: boolean
  isResend: boolean
  questions: TemplateQuestion[]
  /** Telephonic screening section enabled when created */
  screeningEnabled?: boolean
}

type Props = {
  value: CreateOneWayInterviewForm
  onChange: (patch: Partial<CreateOneWayInterviewForm>) => void
  templates: InterviewTemplateOption[]
  onTemplatesChange: (next: InterviewTemplateOption[]) => void
  onCreateTemplate?: () => void
}

/**
 * Step 02 — Select Template.
 * Empty state until templates are created; then full cards match product design.
 */
export function StepInterviewTemplate({
  value,
  onChange,
  templates,
  onTemplatesChange,
  onCreateTemplate,
}: Props) {
  const [query, setQuery] = useState('')
  const isEmpty = templates.length === 0

  const defaultLanguage =
    templates.find((t) => t.isDefault)?.language ??
    templates[0]?.language ??
    'English'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return templates
    return templates.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.language.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q),
    )
  }, [templates, query])

  function setDefault(id: string, checked: boolean) {
    onTemplatesChange(
      templates.map((t) => ({
        ...t,
        isDefault: checked ? t.id === id : t.id === id ? false : t.isDefault,
      })),
    )
  }

  function setResend(id: string, checked: boolean) {
    onTemplatesChange(
      templates.map((t) =>
        t.id === id ? { ...t, isResend: checked } : t,
      ),
    )
  }

  function handleMenu(id: string, action: string) {
    const template = templates.find((t) => t.id === id)
    if (!template) return

    if (action === 'edit') {
      toast.success(`Opening “${template.name}”.`, { title: 'Edit template' })
      return
    }
    if (action === 'duplicate') {
      const copy: InterviewTemplateOption = {
        ...template,
        id: `tpl-${Date.now()}`,
        name: `${template.name} (Copy)`,
        isDefault: false,
        isResend: false,
        updatedOn: formatTemplateDate(new Date()),
        questions: template.questions.map((q) => ({
          ...q,
          id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        })),
      }
      onTemplatesChange([copy, ...templates])
      toast.success(`Duplicated “${template.name}”.`, { title: 'Duplicate' })
      return
    }
    if (action === 'delete') {
      const next = templates.filter((t) => t.id !== id)
      onTemplatesChange(next)
      if (value.templateId === id) {
        onChange({ templateId: next[0]?.id ?? '' })
      }
      toast.success(`Removed “${template.name}”.`, { title: 'Delete' })
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[#2D2061]">Select Template</h2>
          <p className="mt-0.5 text-sm text-[#8B8B9E]">
            Set up the basics for your interview template
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onCreateTemplate}
          className="!h-10 shrink-0 !rounded-md border-[#2D2061] bg-white px-3.5 text-sm font-semibold text-[#2D2061] hover:bg-[#f7f6fb]"
        >
          <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
          Create New Template
        </Button>
      </div>

      {isEmpty ? (
        <div className="flex min-h-[18rem] flex-1 flex-col items-center justify-center px-4 py-12 text-center sm:min-h-[22rem]">
          <span
            className="mb-4 inline-flex size-14 items-center justify-center text-[#C5C5D2]"
            aria-hidden="true"
          >
            <Files className="size-12" strokeWidth={1.25} />
          </span>
          <p className="text-sm font-medium text-[#A0A0B2]">
            No Templates found in search
          </p>
          <button
            type="button"
            onClick={onCreateTemplate}
            className="mt-2 text-sm font-semibold text-[#2D2061] transition-colors hover:underline"
          >
            Create New Template
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <label className="relative block">
            <span className="sr-only">Search and Select Template</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search and Select Template"
              className="h-11 w-full rounded-md border border-[#ddd9e8] bg-white py-2 pl-3.5 pr-10 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
            />
            <Search
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#A0A0B2]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </label>

          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#8B8B9E]">
              No Templates found in search
            </p>
          ) : (
            <ul
              role="listbox"
              aria-label="Interview templates"
              className="flex flex-col gap-3"
            >
              {filtered.map((template) => {
                const selected = value.templateId === template.id
                const languageMismatch =
                  template.language !== defaultLanguage &&
                  Boolean(templates.some((t) => t.isDefault))

                return (
                  <li key={template.id}>
                    <div
                      role="option"
                      aria-selected={selected}
                      tabIndex={0}
                      onClick={() => onChange({ templateId: template.id })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onChange({ templateId: template.id })
                        }
                      }}
                      className={cn(
                        'flex flex-col gap-3 rounded-xl border bg-white px-4 py-3.5 transition-all sm:flex-row sm:items-center sm:justify-between sm:gap-4',
                        selected
                          ? 'border-[#2D2061] shadow-[0_0_0_1px_rgba(45,32,97,0.12)]'
                          : 'border-[#E4E1EE] hover:border-[#C8C2DE]',
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-[#2D2061]">
                            {template.name}
                          </p>
                          {template.isDefault ? (
                            <span className="inline-flex rounded-full bg-[#3A3D5C] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.03em] text-white">
                              Default
                            </span>
                          ) : null}
                          {template.isResend ? (
                            <span className="inline-flex rounded-full bg-[#5B8DEF] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.03em] text-white">
                              Resend
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-[#8B8B9E]">
                          Updated On: {template.updatedOn}
                          <span className="mx-1.5 text-[#C8C5D6]">•</span>
                          Language:{' '}
                          <span
                            className={cn(
                              languageMismatch
                                ? 'font-semibold text-[#D92D20]'
                                : 'text-[#8B8B9E]',
                            )}
                          >
                            {template.language}
                          </span>
                          {languageMismatch ? (
                            <span className="ml-1.5 font-medium text-[#D92D20]">
                              Different language than Default template.
                            </span>
                          ) : null}
                        </p>
                      </div>

                      <div
                        className="flex shrink-0 flex-wrap items-center gap-4 sm:gap-5"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          label="Default"
                          checked={template.isDefault}
                          onChange={(e) =>
                            setDefault(template.id, e.target.checked)
                          }
                          className="!gap-0 [&>label]:gap-2 [&>label>span]:text-xs [&>label>span]:font-medium [&>label>span]:text-[#2D2061]"
                        />
                        <Checkbox
                          label="Resend"
                          checked={template.isResend}
                          onChange={(e) =>
                            setResend(template.id, e.target.checked)
                          }
                          className="!gap-0 [&>label]:gap-2 [&>label>span]:text-xs [&>label>span]:font-medium [&>label>span]:text-[#2D2061]"
                        />
                        <ThreeDotsMenu
                          triggerLabel={`More actions for ${template.name}`}
                          side="left"
                          items={[
                            {
                              id: 'edit',
                              label: 'View / Edit',
                              icon: (
                                <SquarePen strokeWidth={1.75} aria-hidden="true" />
                              ),
                            },
                            {
                              id: 'duplicate',
                              label: 'Duplicate',
                              icon: (
                                <Copy strokeWidth={1.75} aria-hidden="true" />
                              ),
                            },
                            {
                              id: 'delete',
                              label: 'Delete',
                              destructive: true,
                              icon: (
                                <Trash2 strokeWidth={1.75} aria-hidden="true" />
                              ),
                            },
                          ]}
                          onItemSelect={(actionId) =>
                            handleMenu(template.id, actionId)
                          }
                        />
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export function formatTemplateDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return `${day} ${month} ${year}`
}
