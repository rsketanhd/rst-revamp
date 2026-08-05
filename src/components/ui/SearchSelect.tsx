import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type SearchSelectOption = {
  value: string
  label: string
}

export type SearchSelectProps = {
  value: string[]
  onChange: (value: string[]) => void
  options: Array<SearchSelectOption | string>
  placeholder?: string
  disabled?: boolean
  className?: string
  /** Max height of the suggestion list */
  listClassName?: string
}

function normalizeOptions(
  options: Array<SearchSelectOption | string>,
): SearchSelectOption[] {
  return options.map((option) =>
    typeof option === 'string'
      ? { value: option, label: option }
      : option,
  )
}

/**
 * Multi-select search field: type to filter a list, pick items (click or Enter),
 * selected values render as removable tags inside the field.
 */
export function SearchSelect({
  value,
  onChange,
  options,
  placeholder = 'Search and select multiple',
  disabled = false,
  className,
  listClassName,
}: SearchSelectProps) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)

  const allOptions = useMemo(() => normalizeOptions(options), [options])

  const selectedSet = useMemo(() => new Set(value), [value])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allOptions.filter((option) => {
      if (selectedSet.has(option.value)) return false
      if (!q) return true
      return (
        option.label.toLowerCase().includes(q) ||
        option.value.toLowerCase().includes(q)
      )
    })
  }, [allOptions, query, selectedSet])

  useEffect(() => {
    setHighlightIndex(0)
  }, [query, open])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open])

  function addValue(next: string) {
    if (!next || selectedSet.has(next)) return
    onChange([...value, next])
    setQuery('')
    setHighlightIndex(0)
    inputRef.current?.focus()
  }

  function removeValue(target: string) {
    onChange(value.filter((item) => item !== target))
  }

  function selectHighlighted() {
    if (filtered.length === 0) return
    const index = Math.min(highlightIndex, filtered.length - 1)
    addValue(filtered[index].value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setHighlightIndex((current) =>
        filtered.length === 0 ? 0 : (current + 1) % filtered.length,
      )
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      setHighlightIndex((current) =>
        filtered.length === 0
          ? 0
          : (current - 1 + filtered.length) % filtered.length,
      )
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      if (!open) setOpen(true)
      selectHighlighted()
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      return
    }

    if (event.key === 'Backspace' && query === '' && value.length > 0) {
      event.preventDefault()
      removeValue(value[value.length - 1])
    }
  }

  const labelByValue = useMemo(() => {
    const map = new Map(allOptions.map((option) => [option.value, option.label]))
    return map
  }, [allOptions])

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <div
        className={cn(
          'flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-md border border-[#ddd9e8] bg-white px-2.5 py-1.5',
          'transition-colors focus-within:border-[#2D2061] focus-within:ring-2 focus-within:ring-[#2D2061]/10',
          disabled && 'cursor-not-allowed opacity-60',
        )}
        onClick={() => {
          if (disabled) return
          inputRef.current?.focus()
          setOpen(true)
        }}
      >
        <Search
          className="ml-0.5 size-4 shrink-0 text-[#A0A0B2]"
          aria-hidden="true"
        />

        {value.map((item) => (
          <span
            key={item}
            className="inline-flex max-w-full items-center gap-1 rounded-full bg-[#2D2061] px-2.5 py-0.5 text-xs font-medium text-white"
          >
            <span className="truncate">{labelByValue.get(item) ?? item}</span>
            <button
              type="button"
              disabled={disabled}
              aria-label={`Remove ${labelByValue.get(item) ?? item}`}
              className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15 hover:text-white"
              onClick={(event) => {
                event.stopPropagation()
                removeValue(item)
              }}
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={query}
          disabled={disabled}
          placeholder={value.length === 0 ? placeholder : ''}
          className="min-w-[7rem] flex-1 border-0 bg-transparent py-1 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2]"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {open && !disabled ? (
        <ul
          id={listboxId}
          role="listbox"
          className={cn(
            'absolute left-0 right-0 z-20 mt-1 max-h-48 overflow-y-auto rounded-md border border-[#ddd9e8] bg-white py-1 shadow-[0_8px_24px_rgba(26,22,56,0.12)]',
            listClassName,
          )}
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2.5 text-sm text-[#A0A0B2]">No results</li>
          ) : (
            filtered.map((option, index) => {
              const active = index === highlightIndex
              return (
                <li key={option.value} role="option" aria-selected={active}>
                  <button
                    type="button"
                    className={cn(
                      'flex w-full px-3 py-2 text-left text-sm transition-colors',
                      active
                        ? 'bg-[#2D2061] text-white'
                        : 'text-[#2D2061] hover:bg-[#f4f2fa]',
                    )}
                    onMouseEnter={() => setHighlightIndex(index)}
                    onClick={() => addValue(option.value)}
                  >
                    {option.label}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      ) : null}
    </div>
  )
}
