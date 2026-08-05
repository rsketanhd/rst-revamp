import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { MoreVertical } from 'lucide-react'
import { cn } from '../../lib/cn'

export type ThreeDotsMenuItem = {
  id: string
  label: string
  /** Lucide icon node or any custom icon */
  icon?: ReactNode
  onSelect?: () => void
  disabled?: boolean
  /** Optional destructive styling for delete/remove actions */
  destructive?: boolean
}

export type ThreeDotsMenuProps = {
  items: ThreeDotsMenuItem[]
  /**
   * Accessible name for the ⋮ trigger (required for a11y).
   * Example: `"More actions for RST1345"`
   */
  triggerLabel: string
  /**
   * Called when an item is chosen (after item-level `onSelect`).
   * Useful when you map by `id` on the parent screen.
   */
  onItemSelect?: (id: string) => void
  /**
   * Overlay opens on this side of the trigger.
   * Jobs design: menu left of ⋮ with caret pointing right.
   */
  side?: 'left' | 'right'
  /** Vertical alignment relative to the trigger */
  align?: 'center' | 'start' | 'end'
  /** Show the caret pointing at the trigger (design default: true) */
  showCaret?: boolean
  /** Override default vertical ⋮ trigger (custom button content) */
  children?: ReactNode
  className?: string
  triggerClassName?: string
  menuClassName?: string
  /** Controlled open state (optional) */
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * App-wide 3-dots (⋮) menu overlay.
 *
 * Reuse on any list/card screen — pass different `items` only.
 * UI, animation-of-open, caret, and dismiss behavior stay the same.
 *
 * @example
 * ```tsx
 * <ThreeDotsMenu
 *   triggerLabel="More actions"
 *   side="left"
 *   items={[
 *     { id: 'edit', label: 'Edit', icon: <SquarePen />, onSelect: () => {} },
 *     { id: 'share', label: 'Share', icon: <Share2 /> },
 *   ]}
 *   onItemSelect={(id) => console.log(id)}
 * />
 * ```
 */
export function ThreeDotsMenu({
  items,
  triggerLabel,
  onItemSelect,
  side = 'left',
  align = 'center',
  showCaret = true,
  children,
  className,
  triggerClassName,
  menuClassName,
  open: openProp,
  onOpenChange,
}: ThreeDotsMenuProps) {
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)

  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : uncontrolledOpen

  function setOpen(next: boolean) {
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const alignClass =
    align === 'start'
      ? 'top-0'
      : align === 'end'
        ? 'bottom-0'
        : 'top-1/2 -translate-y-1/2'

  const sideClass = side === 'left' ? 'right-full mr-3' : 'left-full ml-3'

  const caretClass =
    side === 'left'
      ? 'left-full top-1/2 -translate-y-1/2 border-y-[7px] border-l-[8px] border-y-transparent border-l-white'
      : 'right-full top-1/2 -translate-y-1/2 border-y-[7px] border-r-[8px] border-y-transparent border-r-white'

  function handleItemClick(item: ThreeDotsMenuItem) {
    if (item.disabled) return
    item.onSelect?.()
    onItemSelect?.(item.id)
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn('relative inline-flex', className)}>
      <button
        type="button"
        aria-label={triggerLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className={cn(
          'inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[#2D2061] transition-colors hover:bg-[#f4f3f9]',
          triggerClassName,
        )}
        onClick={() => setOpen(!open)}
      >
        {children ?? (
          <MoreVertical className="size-5" strokeWidth={1.75} aria-hidden="true" />
        )}
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={triggerLabel}
          className={cn(
            'absolute z-40 min-w-[15.5rem] rounded-xl bg-white py-2.5',
            'shadow-[0_10px_32px_rgba(26,22,56,0.16)] ring-1 ring-black/5',
            sideClass,
            alignClass,
            menuClassName,
          )}
        >
          {showCaret ? (
            <span
              aria-hidden="true"
              className={cn('pointer-events-none absolute drop-shadow-sm', caretClass)}
            />
          ) : null}

          <ul className="flex flex-col">
            {items.map((item) => (
              <li key={item.id} role="none">
                <button
                  type="button"
                  role="menuitem"
                  disabled={item.disabled}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors',
                    item.destructive
                      ? 'text-[#c62828] hover:bg-[#fdecea]'
                      : 'text-[#3d3a4f] hover:bg-[#f6f5fa] hover:text-[#2D2061]',
                    'disabled:cursor-not-allowed disabled:opacity-45',
                  )}
                  onClick={() => handleItemClick(item)}
                >
                  {item.icon ? (
                    <span
                      className={cn(
                        'inline-flex size-5 shrink-0 items-center justify-center [&>svg]:size-[1.125rem]',
                        item.destructive ? 'text-[#c62828]' : 'text-[#4a4760]',
                      )}
                    >
                      {item.icon}
                    </span>
                  ) : null}
                  <span className="min-w-0 leading-snug">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  )
}

/** @deprecated Prefer `ThreeDotsMenu` — same component, kept for older imports. */
export const ActionMenu = ThreeDotsMenu
export type ActionMenuItem = ThreeDotsMenuItem
export type ActionMenuProps = ThreeDotsMenuProps
