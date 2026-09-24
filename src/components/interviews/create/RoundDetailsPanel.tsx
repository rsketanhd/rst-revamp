import { useState } from 'react'
import { Button, Input, RadioGroup, Select, SidePanel } from '../../ui'
import {
  DIFFICULTY_OPTIONS,
  INTERVIEW_TYPE_OPTIONS,
  type InterviewRound,
} from './types'

export type RoundDetails = Pick<
  InterviewRound,
  'name' | 'interviewType' | 'difficulty' | 'avatarEnabled'
>

type Errors = Partial<Record<'name' | 'interviewType' | 'difficulty', string>>

export type RoundDetailsPanelProps = {
  open: boolean
  mode: 'add' | 'edit'
  /** "Round 2" — used for labels */
  roundLabel: string
  initial: RoundDetails
  onClose: () => void
  onSave: (details: RoundDetails) => void
}

/**
 * Add / Edit Round side panel — name, interview type, difficulty and avatar.
 */
export function RoundDetailsPanel({
  open,
  mode,
  roundLabel,
  initial,
  onClose,
  onSave,
}: RoundDetailsPanelProps) {
  const [values, setValues] = useState<RoundDetails>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [openedWith, setOpenedWith] = useState<RoundDetails | null>(null)

  // Reset the form each time the panel opens
  const key = open ? initial : null
  if (key !== openedWith) {
    setOpenedWith(key)
    if (key) {
      setValues(key)
      setErrors({})
    }
  }

  function patch(next: Partial<RoundDetails>) {
    setValues((current) => ({ ...current, ...next }))
    setErrors((current) => {
      const cleared = { ...current }
      for (const k of Object.keys(next)) delete cleared[k as keyof Errors]
      return cleared
    })
  }

  function handleSave() {
    const nextErrors: Errors = {}
    if (!values.name.trim()) nextErrors.name = 'Round name is required.'
    if (!values.interviewType) nextErrors.interviewType = 'Select an interview type.'
    if (!values.difficulty) nextErrors.difficulty = 'Select a difficulty level.'
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    onSave({ ...values, name: values.name.trim() })
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={mode === 'add' ? 'Add Round' : `Edit ${roundLabel}`}
      widthClassName="w-full max-w-[30rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            {mode === 'add' ? 'Add Round' : 'Save'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Input
          label={`${roundLabel} Name`}
          requiredMark
          placeholder={roundLabel}
          value={values.name}
          onChange={(e) => patch({ name: e.target.value })}
          error={errors.name}
        />
        <Select
          id="round-interview-type"
          label="Interview Type"
          requiredMark
          labelTooltip="Sets the interview format for this round."
          options={INTERVIEW_TYPE_OPTIONS}
          value={values.interviewType}
          onChange={(e) => patch({ interviewType: e.target.value })}
          placeholder="Select type"
          error={errors.interviewType}
        />
        <Select
          id="round-difficulty"
          label="Difficulty Level"
          requiredMark
          labelTooltip="AI generates template questions at this level when you create a new template."
          options={[...DIFFICULTY_OPTIONS]}
          value={values.difficulty}
          onChange={(e) =>
            patch({ difficulty: e.target.value as RoundDetails['difficulty'] })
          }
          placeholder="Select level"
          error={errors.difficulty}
        />
        <RadioGroup
          label="Avatar"
          name="round-avatar"
          value={values.avatarEnabled ? 'enable' : 'disable'}
          onChange={(v) => patch({ avatarEnabled: v === 'enable' })}
          options={[
            { value: 'enable', label: 'Enable' },
            { value: 'disable', label: 'Disable' },
          ]}
        />
      </div>
    </SidePanel>
  )
}
