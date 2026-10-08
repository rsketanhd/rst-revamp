import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'

const MODAL_ANIMATION_MS = 200

export type ModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
  contentClassName?: string
  /** Overlay z-index class. Defaults to `z-50`. */
  zClassName?: string
}

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  contentClassName,
  zClassName = 'z-50',
}: ModalProps) {
  // Stay mounted briefly after closing so the exit animation can play
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(true)
      const frame = window.requestAnimationFrame(() => setVisible(true))
      return () => window.cancelAnimationFrame(frame)
    }
    setVisible(false)
    const timer = window.setTimeout(() => setMounted(false), MODAL_ANIMATION_MS)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!mounted || typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 flex items-center justify-center p-4',
        zClassName,
      )}
    >
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className={cn(
          'absolute inset-0 bg-brand-950/55 backdrop-blur-[2px] transition-opacity duration-200 ease-out',
          visible ? 'opacity-100' : 'opacity-0',
        )}
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          'relative z-10 flex max-h-[min(90vh,44rem)] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-surface shadow-2xl',
          'transition-[opacity,scale,translate] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
          visible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-[0.97] opacity-0',
          className,
        )}
      >
        <header className="flex items-center justify-between gap-4 bg-brand-800 px-5 py-3.5 text-white">
          <h2 id="modal-title" className="text-base font-semibold tracking-tight">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="inline-flex size-8 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        <div className={cn('overflow-y-auto p-5', contentClassName)}>{children}</div>
      </div>
    </div>,
    document.body,
  )
}
