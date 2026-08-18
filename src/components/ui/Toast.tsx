import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Check, CircleAlert, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ToastVariant = 'success' | 'error' | 'warning'

export type ToastOptions = {
  /** Primary message line */
  title?: string
  /** Supporting detail (optional) */
  description?: string
  /** Auto-dismiss delay in ms (default 3500). Pass 0 to keep until closed. */
  duration?: number
}

export type ToastItem = ToastOptions & {
  id: string
  variant: ToastVariant
  message: string
}

type ToastContextValue = {
  toasts: ToastItem[]
  push: (variant: ToastVariant, message: string, options?: ToastOptions) => string
  dismiss: (id: string) => void
  clear: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const DEFAULT_DURATION_MS = 3500
const MAX_TOASTS = 5

let toastId = 0
function nextId() {
  toastId += 1
  return `toast-${toastId}`
}

/** Imperative API — call after ToastProvider is mounted. */
export const toast = {
  success(message: string, options?: ToastOptions) {
    return getToastApi()?.push('success', message, options) ?? ''
  },
  error(message: string, options?: ToastOptions) {
    return getToastApi()?.push('error', message, options) ?? ''
  },
  warning(message: string, options?: ToastOptions) {
    return getToastApi()?.push('warning', message, options) ?? ''
  },
  dismiss(id: string) {
    getToastApi()?.dismiss(id)
  },
  clear() {
    getToastApi()?.clear()
  },
}

let toastApi: ToastContextValue | null = null

function getToastApi() {
  return toastApi
}

export type ToastProviderProps = {
  children: ReactNode
  /** Viewport corner (default top-right) */
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'bottom-center'
}

/**
 * App-wide toast host. Mount once near the root (e.g. around router).
 */
export function ToastProvider({
  children,
  position = 'top-right',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id))
  }, [])

  const clear = useCallback(() => {
    setToasts([])
  }, [])

  const push = useCallback(
    (variant: ToastVariant, message: string, options?: ToastOptions) => {
      const id = nextId()
      const item: ToastItem = {
        id,
        variant,
        message,
        title: options?.title,
        description: options?.description,
        duration: options?.duration,
      }
      setToasts((current) => [item, ...current].slice(0, MAX_TOASTS))
      return id
    },
    [],
  )

  const value = useMemo(
    () => ({ toasts, push, dismiss, clear }),
    [toasts, push, dismiss, clear],
  )

  useEffect(() => {
    toastApi = value
    return () => {
      if (toastApi === value) toastApi = null
    }
  }, [value])

  const positionClass =
    position === 'top-center'
      ? 'top-4 left-1/2 -translate-x-1/2 items-center'
      : position === 'bottom-right'
        ? 'bottom-4 right-4 items-end'
        : position === 'bottom-center'
          ? 'bottom-4 left-1/2 -translate-x-1/2 items-center'
          : 'top-4 right-4 items-end'

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined'
        ? createPortal(
            <div
              className={cn(
                'pointer-events-none fixed z-[200] flex w-[min(24rem,calc(100vw-1.5rem))] flex-col gap-2',
                positionClass,
              )}
              aria-live="polite"
              aria-relevant="additions"
            >
              {toasts.map((item) => (
                <Toast
                  key={item.id}
                  item={item}
                  onDismiss={() => dismiss(item.id)}
                />
              ))}
            </div>,
            document.body,
          )
        : null}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return ctx
}

export type ToastProps = {
  item: ToastItem
  onDismiss: () => void
  className?: string
}

const VARIANT_STYLES: Record<
  ToastVariant,
  {
    shell: string
    iconWrap: string
    title: string
    message: string
    close: string
  }
> = {
  success: {
    shell: 'border-[#B7E4C7] bg-white shadow-[0_8px_24px_rgba(22,101,52,0.12)]',
    iconWrap: 'bg-[#E7F8ED] text-[#15803D]',
    title: 'text-[#14532D]',
    message: 'text-[#166534]',
    close: 'text-[#15803D]/70 hover:bg-[#E7F8ED] hover:text-[#14532D]',
  },
  error: {
    shell: 'border-[#FECACA] bg-white shadow-[0_8px_24px_rgba(185,28,28,0.12)]',
    iconWrap: 'bg-[#FEE2E2] text-[#DC2626]',
    title: 'text-[#7F1D1D]',
    message: 'text-[#B91C1C]',
    close: 'text-[#DC2626]/70 hover:bg-[#FEE2E2] hover:text-[#7F1D1D]',
  },
  warning: {
    shell: 'border-[#FDE68A] bg-white shadow-[0_8px_24px_rgba(180,83,9,0.12)]',
    iconWrap: 'bg-[#FEF3C7] text-[#D97706]',
    title: 'text-[#78350F]',
    message: 'text-[#B45309]',
    close: 'text-[#D97706]/80 hover:bg-[#FEF3C7] hover:text-[#78350F]',
  },
}

/**
 * Single toast card — Success / Error / Warning variants.
 * Prefer `toast.success()` etc. via ToastProvider for app usage.
 */
export function Toast({ item, onDismiss, className }: ToastProps) {
  const styles = VARIANT_STYLES[item.variant]
  const duration =
    item.duration === undefined ? DEFAULT_DURATION_MS : item.duration

  useEffect(() => {
    if (duration <= 0) return
    const timer = window.setTimeout(onDismiss, duration)
    return () => window.clearTimeout(timer)
  }, [duration, onDismiss])

  return (
    <div
      role={item.variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'pointer-events-auto flex w-full items-start gap-3 rounded-lg border px-3.5 py-3',
        'animate-[toast-in_220ms_ease-out]',
        styles.shell,
        className,
      )}
    >
      <span
        className={cn(
          'mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full',
          styles.iconWrap,
        )}
        aria-hidden="true"
      >
        <ToastIcon variant={item.variant} />
      </span>

      <div className="min-w-0 flex-1 pt-0.5">
        {item.title ? (
          <p className={cn('text-sm font-semibold leading-snug', styles.title)}>
            {item.title}
          </p>
        ) : null}
        <p
          className={cn(
            'text-sm leading-snug',
            item.title ? 'mt-0.5 text-[#4B5563]' : styles.message,
            item.title && 'font-medium',
            !item.title && 'font-medium',
          )}
        >
          {item.message}
        </p>
        {item.description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-[#6B7280]">
            {item.description}
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className={cn(
          'inline-flex size-7 shrink-0 items-center justify-center rounded-md transition-colors',
          styles.close,
        )}
      >
        <X className="size-4" strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  )
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  switch (variant) {
    case 'success':
      return <Check className="size-4" strokeWidth={2.5} />
    case 'error':
      return <CircleAlert className="size-4" strokeWidth={2} />
    case 'warning':
      return <AlertTriangle className="size-4" strokeWidth={2} />
    default: {
      const _exhaustive: never = variant
      return _exhaustive
    }
  }
}

/** Named exports for direct composition if needed. */
export function SuccessToast(
  props: Omit<ToastProps, 'item'> & {
    message: string
    title?: string
    description?: string
  },
) {
  return (
    <Toast
      item={{
        id: 'success',
        variant: 'success',
        message: props.message,
        title: props.title,
        description: props.description,
        duration: 0,
      }}
      onDismiss={props.onDismiss}
      className={props.className}
    />
  )
}

export function ErrorToast(
  props: Omit<ToastProps, 'item'> & {
    message: string
    title?: string
    description?: string
  },
) {
  return (
    <Toast
      item={{
        id: 'error',
        variant: 'error',
        message: props.message,
        title: props.title,
        description: props.description,
        duration: 0,
      }}
      onDismiss={props.onDismiss}
      className={props.className}
    />
  )
}

export function WarningToast(
  props: Omit<ToastProps, 'item'> & {
    message: string
    title?: string
    description?: string
  },
) {
  return (
    <Toast
      item={{
        id: 'warning',
        variant: 'warning',
        message: props.message,
        title: props.title,
        description: props.description,
        duration: 0,
      }}
      onDismiss={props.onDismiss}
      className={props.className}
    />
  )
}
