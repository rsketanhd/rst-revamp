import type { FormEvent, MouseEvent } from 'react'
import { useState } from 'react'
import { MousePointer2 } from 'lucide-react'
import { Button } from './Button'
import { Modal } from './Modal'
import { cn } from '../../lib/cn'

export type HelpFeedbackModalProps = {
  open: boolean
  onClose: () => void
  onSubmit?: (payload: {
    feedback: string
    highlight: { x: number; y: number } | null
  }) => void | Promise<void>
}

export function HelpFeedbackModal({
  open,
  onClose,
  onSubmit,
}: HelpFeedbackModalProps) {
  const [feedback, setFeedback] = useState('')
  const [highlight, setHighlight] = useState<{ x: number; y: number } | null>(
    null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleClose() {
    setFeedback('')
    setHighlight(null)
    onClose()
  }

  function handleHighlightClick(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100
    setHighlight({ x, y })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!feedback.trim()) return

    setIsSubmitting(true)
    try {
      await onSubmit?.({ feedback: feedback.trim(), highlight })
      handleClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Help - Send Feedback"
      className="max-w-2xl"
      contentClassName="p-0"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
        <textarea
          name="feedback"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          placeholder="Enter feedback"
          rows={5}
          required
          className={cn(
            'w-full resize-y rounded-control border border-line bg-surface px-3.5 py-3 text-sm text-ink',
            'placeholder:text-subtle',
            'transition-colors focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/10',
          )}
        />

        <div className="flex justify-center">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting || !feedback.trim()}
            className="min-w-[10.5rem] rounded-control px-6"
          >
            {isSubmitting ? 'Sending…' : 'Send Feedback'}
          </Button>
        </div>

        <div className="overflow-hidden rounded-control border border-line bg-surface-soft">
          <button
            type="button"
            onClick={handleHighlightClick}
            className="relative block aspect-[16/10] w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-800/30"
            aria-label="Click on the preview to highlight an area"
          >
            <ScreenPreview />

            {highlight ? (
              <span
                className="pointer-events-none absolute size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent-500 bg-accent-500/20 shadow-sm"
                style={{ left: `${highlight.x}%`, top: `${highlight.y}%` }}
              />
            ) : null}

            <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-brand-950/25">
              <span className="inline-flex items-center gap-2 rounded-full bg-surface/95 px-3.5 py-2 text-sm font-semibold text-brand-800 shadow-md ring-1 ring-line">
                <MousePointer2
                  className="size-4 text-accent-500"
                  aria-hidden="true"
                />
                Click to highlight
              </span>
            </span>
          </button>
        </div>
      </form>
    </Modal>
  )
}

function ScreenPreview() {
  return (
    <div
      aria-hidden="true"
      className="grid h-full w-full grid-cols-1 sm:grid-cols-2"
    >
      <div className="relative hidden overflow-hidden bg-brand-900 p-4 text-white sm:block">
        <div className="absolute -left-8 top-6 size-40 rounded-full border border-white/10" />
        <div className="absolute left-6 top-2 size-48 rounded-full border border-white/10" />
        <p className="relative text-[11px] font-bold leading-snug">
          Unleashing the Power of
          <span className="mt-0.5 block">Data-Driven Recruitment</span>
        </p>
        <div className="relative mt-4 rounded-lg bg-white/10 p-2">
          <div className="h-16 rounded-md bg-white/90" />
          <div className="mt-1.5 h-20 rounded-md bg-white/90" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2 bg-surface p-4">
        <div className="h-6 w-24 rounded-full bg-brand-100" />
        <div className="h-4 w-28 rounded bg-brand-100" />
        <p className="text-sm font-bold text-brand-800">Sign in</p>
        <div className="mt-1 w-full max-w-[9rem] space-y-1.5">
          <div className="h-6 rounded border border-line bg-surface" />
          <div className="h-6 rounded border border-line bg-surface" />
          <div className="h-6 rounded-md bg-brand-800" />
        </div>
      </div>
    </div>
  )
}
