import { Copy, Plus, Sparkles } from 'lucide-react'
import { Textarea } from '../../ui'
import { cn } from '../../../lib/cn'
import type { CreateJobFormState, CreateMethod } from './types'
import { FieldInput, StepHeader } from './StepChrome'

type Props = {
  value: CreateJobFormState
  onChange: (patch: Partial<CreateJobFormState>) => void
}

const METHODS: Array<{
  id: CreateMethod
  title: string
  description: string
  icon: typeof Copy
}> = [
  {
    id: 'copy',
    title: 'Copy from Existing Jobs',
    description: 'Use an existing job as your starting point.',
    icon: Copy,
  },
  {
    id: 'scratch',
    title: 'Create From Scratch',
    description: 'Build a completely custom job from the ground up.',
    icon: Plus,
  },
]

export function StepCreateJob({ value, onChange }: Props) {
  return (
    <div>
      <StepHeader
        title="Create Job"
        description="Provide key information about the job."
      />

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {METHODS.map((method) => {
          const active = value.method === method.id
          const Icon = method.icon
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onChange({ method: method.id })}
              className={cn(
                'flex items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                active
                  ? 'border-[#2D2061] bg-[#2D2061] text-white'
                  : 'border-[#e0ddea] bg-white text-[#2D2061] hover:border-[#2D2061]/40',
              )}
            >
              <span
                className={cn(
                  'inline-flex size-10 shrink-0 items-center justify-center rounded-lg',
                  active ? 'bg-white/15' : 'bg-[#f5f4f9]',
                )}
              >
                <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold">{method.title}</span>
                <span
                  className={cn(
                    'mt-0.5 block text-xs leading-relaxed',
                    active ? 'text-white/80' : 'text-[#8B8B9E]',
                  )}
                >
                  {method.description}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-4">
        <FieldInput
          label="Job Req ID"
          requiredMark
          placeholder="Enter Job Req ID"
          value={value.jobReqId}
          onChange={(e) => onChange({ jobReqId: e.target.value })}
        />
        <FieldInput
          label="Job Title"
          requiredMark
          placeholder="Enter job title"
          value={value.jobTitle}
          onChange={(e) => onChange({ jobTitle: e.target.value })}
          helperText="Be specific and use standard industry titles."
        />
        <Textarea
          label="Job Descriptions"
          requiredMark
          rows={8}
          value={value.jobDescription}
          onChange={(e) => onChange({ jobDescription: e.target.value })}
          labelAction={
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2D2061] transition-colors hover:text-[#241a52]"
              onClick={() =>
                onChange({
                  jobDescription: `Job Title: ${value.jobTitle || 'Head of Engineering'}
Department: Engineering / Technology
Industry: SaaS / Software Technology
Employment Type: Full-Time
Number of Positions: 2
Hiring Priority: High

We are seeking a strategic leader to drive engineering excellence...`,
                })
              }
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              Use AI Generated Description
            </button>
          }
        />
      </div>
    </div>
  )
}
