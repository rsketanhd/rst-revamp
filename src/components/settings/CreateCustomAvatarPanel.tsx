import { useEffect, useRef, useState, type RefObject } from 'react'
import { Play } from 'lucide-react'
import { Button, Input, Select, SidePanel, StatusStepper } from '../ui'
import { cn } from '../../lib/cn'

const AVATAR_STEPS = [
  { id: 'upload', label: 'Upload Avatar' },
  { id: 'voice', label: 'Select Voice' },
  { id: 'preview', label: 'Preview Avatar' },
] as const

type AvatarStepId = (typeof AVATAR_STEPS)[number]['id']

const VOICES = [
  { id: 'natural-calm', name: 'Natural Calm', model: 'Male Voice Model' },
  { id: 'friendly-studio', name: 'Friendly Studio', model: 'Female Voice Model' },
  { id: 'deep-professional', name: 'Deep Professional', model: 'Male Voice Model' },
] as const

type VoiceId = (typeof VOICES)[number]['id']

const MAX_FILE_BYTES = 25 * 1024 * 1024
const AVATAR_ACCEPT = 'image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime,.mov'
const SEEDED_FILE_NAME = 'preview_video_target.mp4'

type FileKind = 'image' | 'video' | 'none'

type AvatarDraft = {
  name: string
  fileName: string
  fileUrl: string
  fileKind: FileKind
  voiceType: string
  accent: string
  voiceId: VoiceId
  customVoiceName: string
}

const INITIAL_DRAFT: AvatarDraft = {
  name: 'Sarah Johnson',
  fileName: SEEDED_FILE_NAME,
  fileUrl: '',
  fileKind: 'none',
  voiceType: 'female',
  accent: '',
  voiceId: 'natural-calm',
  customVoiceName: '',
}

export type CreatedAvatar = {
  name: string
  fileName: string
}

export type CreateCustomAvatarPanelProps = {
  open: boolean
  onClose: () => void
  onCreate: (avatar: CreatedAvatar) => void
}

const PRIMARY_FOOTER_CLASS =
  '!h-10 !min-w-[6.5rem] !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]'
const SECONDARY_FOOTER_CLASS =
  '!h-10 !min-w-[6.5rem] !rounded-md border-[#d5d2e2] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]'

/**
 * Avatar Settings → Create Custom Avatar.
 * Upload, voice, then preview, using the shared side panel and stepper.
 */
export function CreateCustomAvatarPanel({
  open,
  onClose,
  onCreate,
}: CreateCustomAvatarPanelProps) {
  const [step, setStep] = useState(0)
  const [maxReached, setMaxReached] = useState(0)
  const [draft, setDraft] = useState<AvatarDraft>(INITIAL_DRAFT)
  const [nameError, setNameError] = useState('')
  const [fileError, setFileError] = useState('')
  const avatarInputRef = useRef<HTMLInputElement>(null)
  const voiceInputRef = useRef<HTMLInputElement>(null)
  const fileUrlRef = useRef('')

  useEffect(() => {
    if (!open) return
    if (fileUrlRef.current) {
      URL.revokeObjectURL(fileUrlRef.current)
      fileUrlRef.current = ''
    }
    setDraft(INITIAL_DRAFT)
    setStep(0)
    setMaxReached(0)
    setNameError('')
    setFileError('')
  }, [open])

  useEffect(() => {
    return () => {
      if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current)
    }
  }, [])

  const stepId = AVATAR_STEPS[step]?.id ?? 'upload'

  function patch(next: Partial<AvatarDraft>) {
    setDraft((current) => ({ ...current, ...next }))
  }

  function goTo(next: number) {
    setStep(next)
    setMaxReached((max) => Math.max(max, next))
  }

  function pickAvatarFile(file: File) {
    const allowed = /^(image\/jpeg|image\/png|image\/webp|video\/mp4|video\/webm|video\/quicktime)$/.test(
      file.type,
    )
    if (!allowed) {
      setFileError('Only images (JPEG, PNG, WebP) or video (MP4, WebM, MOV) files are supported.')
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileError('Maximum 25MB file size is allowed.')
      return
    }
    if (fileUrlRef.current) URL.revokeObjectURL(fileUrlRef.current)
    const url = URL.createObjectURL(file)
    fileUrlRef.current = url
    const fileKind: FileKind = file.type.startsWith('video/') ? 'video' : 'image'
    setFileError('')
    patch({ fileName: file.name, fileUrl: url, fileKind })
  }

  function handleNext() {
    if (stepId === 'upload' && !draft.name.trim()) {
      setNameError('Enter an avatar name')
      return
    }
    setNameError('')
    if (step >= AVATAR_STEPS.length - 1) {
      onCreate({ name: draft.name.trim(), fileName: draft.fileName })
      onClose()
      return
    }
    goTo(step + 1)
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Create Custom Avatar"
      widthClassName="w-full max-w-[44rem]"
      footer={
        <>
          {step > 0 && stepId !== 'preview' ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              className={SECONDARY_FOOTER_CLASS}
            >
              Previous
            </Button>
          ) : null}
          <Button type="button" onClick={handleNext} className={PRIMARY_FOOTER_CLASS}>
            {stepId === 'preview' ? 'Create' : 'Next'}
          </Button>
        </>
      }
    >
      <StatusStepper
        className="mb-6"
        steps={[...AVATAR_STEPS]}
        currentStep={step}
        completedThrough={maxReached}
        onStepClick={(index) => {
          if (index <= maxReached) goTo(index)
        }}
      />
      <AvatarStepBody
        stepId={stepId}
        draft={draft}
        nameError={nameError}
        fileError={fileError}
        avatarInputRef={avatarInputRef}
        voiceInputRef={voiceInputRef}
        onPatch={patch}
        onNameChange={(name) => {
          setNameError('')
          patch({ name })
        }}
        onPickAvatar={pickAvatarFile}
        onPickVoice={(file) => patch({ customVoiceName: file.name })}
      />
    </SidePanel>
  )
}

function AvatarStepBody({
  stepId,
  draft,
  nameError,
  fileError,
  avatarInputRef,
  voiceInputRef,
  onPatch,
  onNameChange,
  onPickAvatar,
  onPickVoice,
}: {
  stepId: AvatarStepId
  draft: AvatarDraft
  nameError: string
  fileError: string
  avatarInputRef: RefObject<HTMLInputElement | null>
  voiceInputRef: RefObject<HTMLInputElement | null>
  onPatch: (patch: Partial<AvatarDraft>) => void
  onNameChange: (name: string) => void
  onPickAvatar: (file: File) => void
  onPickVoice: (file: File) => void
}) {
  switch (stepId) {
    case 'upload':
      return (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[#5C5870]">Upload your avatar as a photo or video.</p>
          <Input
            id="custom-avatar-name"
            label="Avatar Name"
            value={draft.name}
            error={nameError}
            onChange={(event) => onNameChange(event.target.value)}
          />
          <div>
            <p className="text-sm font-medium text-[#2D2061]">Avatar Image / Video</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <input
                ref={avatarInputRef}
                type="file"
                accept={AVATAR_ACCEPT}
                className="sr-only"
                aria-label="Avatar image or video"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) onPickAvatar(file)
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="!h-9 !rounded-md border-[#2D2061] text-[#2D2061]"
                onClick={() => avatarInputRef.current?.click()}
              >
                Choose File
              </Button>
              <span className="min-w-0 truncate text-sm text-[#6B6B80]">{draft.fileName}</span>
            </div>
            {fileError ? <p className="mt-2 text-xs text-[#E53935]">{fileError}</p> : null}
            <ul className="mt-3 list-disc space-y-1 pl-4 text-xs leading-relaxed text-[#8B8B9E]">
              <li>Maximum 25MB file size is allowed.</li>
              <li>Only images (JPEG, PNG, WebP) or video (MP4, WebM, MOV) files are supported.</li>
            </ul>
          </div>
        </div>
      )
    case 'voice':
      return (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-[#5C5870]">
            Choose a predefined voice or upload a custom voice for your avatar.
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              <Select
                id="avatar-voice-type"
                label="Voice Type"
                options={[
                  { value: 'female', label: 'Female Voice Model' },
                  { value: 'male', label: 'Male Voice Model' },
                ]}
                value={draft.voiceType}
                onChange={(event) => onPatch({ voiceType: event.target.value })}
              />
              <Select
                id="avatar-accent"
                label="Accent"
                placeholder="Accent"
                options={['American', 'British', 'Australian', 'Indian']}
                value={draft.accent}
                onChange={(event) => onPatch({ accent: event.target.value })}
              />
            </div>
            <div>
              <input
                ref={voiceInputRef}
                type="file"
                accept="audio/*"
                className="sr-only"
                aria-label="Upload custom voice"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) onPickVoice(file)
                }}
              />
              <button
                type="button"
                onClick={() => voiceInputRef.current?.click()}
                className="mb-2 text-sm font-semibold text-[#2D2061] hover:underline"
              >
                Upload Custom Voice
              </button>
              {draft.customVoiceName ? (
                <p className="text-xs text-[#8B8B9E]">{draft.customVoiceName}</p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col gap-2" role="radiogroup" aria-label="Avatar voice">
            {VOICES.map((voice) => {
              const selected = draft.voiceId === voice.id
              return (
                <label
                  key={voice.id}
                  className={cn(
                    'flex cursor-pointer items-start gap-3 rounded-lg border bg-white px-3 py-3',
                    selected ? 'border-[#2D2061]' : 'border-[#E4E1EE]',
                  )}
                >
                  <input
                    type="radio"
                    name="avatar-voice"
                    value={voice.id}
                    checked={selected}
                    onChange={() => onPatch({ voiceId: voice.id })}
                    className="mt-1 accent-[#2D2061]"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#1A1A2E]">{voice.name}</span>
                    <span className="block text-xs text-[#8B8B9E]">{voice.model}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      )
    case 'preview':
      return (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-[#5C5870]">
            Preview your avatar with the selected voice before creating it.
          </p>
          <div className="overflow-hidden rounded-lg border border-[#E4E1EE] bg-white">
            <p className="border-b border-[#ECEAF3] px-3 py-2 text-xs text-[#6B6B80]">
              New Avatar Preview: {draft.fileName}
            </p>
            <div className="relative flex aspect-video items-center justify-center bg-[#1C1C1C]">
              {draft.fileKind === 'image' && draft.fileUrl ? (
                <img src={draft.fileUrl} alt="" className="size-full object-cover" />
              ) : null}
              {draft.fileKind === 'video' && draft.fileUrl ? (
                <video src={draft.fileUrl} controls className="size-full object-contain" />
              ) : null}
              {draft.fileKind === 'none' ? (
                <span className="inline-flex size-12 items-center justify-center rounded-full bg-white/90 text-[#2D2061]">
                  <Play className="size-5 translate-x-0.5" fill="currentColor" aria-hidden="true" />
                </span>
              ) : null}
            </div>
          </div>
        </div>
      )
    default: {
      const exhaustive: never = stepId
      return exhaustive
    }
  }
}
