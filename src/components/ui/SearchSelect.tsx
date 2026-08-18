import {
  useEffect,
  useId,
  useLayoutEffect,
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
  /**
   * When selected chips exceed available width, collapse extras into `+N more`
   * with a click-to-expand overlay. Default: true.
   */
  collapseOverflow?: boolean
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

/** Approximate width for the `+N more` chip used when measuring fit. */
const MORE_CHIP_MIN_WIDTH = 72
const TAG_GAP = 6
const INPUT_MIN_WIDTH = 96

/**
 * Multi-select search field: type to filter a list, pick items (click or Enter),
 * selected values render as removable tags. Overflow chips collapse to `+N more`.
 */
export function SearchSelect({
  value,
  onChange,
  options,
  placeholder = 'Search and select multiple',
  disabled = false,
  className,
  listClassName,
  collapseOverflow = true,
}: SearchSelectProps) {
  const listboxId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<HTMLDivElement>(null)
  const tagsMeasureRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const moreBtnRef = useRef<HTMLButtonElement>(null)
  const morePanelRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(value.length)
  const [moreOpen, setMoreOpen] = useState(false)

  const allOptions = useMemo(() => normalizeOptions(options), [options])

  const selectedSet = useMemo(() => new Set(value), [value])

  const labelByValue = useMemo(() => {
    const map = new Map(allOptions.map((option) => [option.value, option.label]))
    return map
  }, [allOptions])

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

  const overflowCount = Math.max(0, value.length - visibleCount)
  const visibleValues = collapseOverflow
    ? value.slice(0, visibleCount)
    : value
  const overflowValues = collapseOverflow ? value.slice(visibleCount) : []

  useLayoutEffect(() => {
    if (!collapseOverflow || value.length === 0) {
      setVisibleCount(value.length)
      return
    }

    function measure() {
      const field = fieldRef.current
      const measureRoot = tagsMeasureRef.current
      if (!field || !measureRoot) {
        setVisibleCount(value.length)
        return
      }

      const fieldStyle = window.getComputedStyle(field)
      const padX =
        parseFloat(fieldStyle.paddingLeft) + parseFloat(fieldStyle.paddingRight)
      const searchIconWidth = 22
      const available =
        field.clientWidth -
        padX -
        searchIconWidth -
        INPUT_MIN_WIDTH -
        TAG_GAP * 2

      if (available <= 0) {
        setVisibleCount(0)
        return
      }

      const chips = Array.from(
        measureRoot.querySelectorAll<HTMLElement>('[data-measure-chip]'),
      )
      const widths = chips.map((el) => el.offsetWidth)

      let count = value.length
      for (let n = value.length; n >= 0; n -= 1) {
        let used = 0
        for (let i = 0; i < n; i += 1) {
          used += widths[i] ?? 0
          if (i > 0) used += TAG_GAP
        }
        const needMore = n < value.length
        if (needMore) {
          used += (n > 0 ? TAG_GAP : 0) + MORE_CHIP_MIN_WIDTH
        }
        if (used <= available || n === 0) {
          count = n
          break
        }
      }

      // Prefer at least one chip when there is room for none only if empty
      if (count === 0 && value.length > 0 && available > MORE_CHIP_MIN_WIDTH) {
        // keep 0 — only +N more
      }
      setVisibleCount(count)
    }

    measure()

    const observer = new ResizeObserver(() => measure())
    if (fieldRef.current) observer.observe(fieldRef.current)
    return () => observer.disconnect()
  }, [collapseOverflow, value, labelByValue])

  useEffect(() => {
    setHighlightIndex(0)
  }, [query, open])

  useEffect(() => {
    if (!open && !moreOpen) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (rootRef.current?.contains(target)) return
      if (morePanelRef.current?.contains(target)) return
      setOpen(false)
      setMoreOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [open, moreOpen])

  useEffect(() => {
    if (overflowCount === 0) setMoreOpen(false)
  }, [overflowCount])

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
      setMoreOpen(false)
      return
    }

    if (event.key === 'Backspace' && query === '' && value.length > 0) {
      event.preventDefault()
      removeValue(value[value.length - 1])
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      {/* Off-screen measure row — full chips for width calculation */}
      {collapseOverflow && value.length > 0 ? (
        <div
          ref={tagsMeasureRef}
          aria-hidden="true"
          className="pointer-events-none absolute -left-[9999px] top-0 flex items-center gap-1.5 whitespace-nowrap opacity-0"
        >
          {value.map((item) => (
            <span
              key={item}
              data-measure-chip
              className="inline-flex max-w-[12rem] items-center gap-1 rounded-full bg-[#2D2061] px-2.5 py-0.5 text-xs font-medium text-white"
            >
              <span className="truncate">{labelByValue.get(item) ?? item}</span>
              <span className="inline-flex size-4 shrink-0" />
            </span>
          ))}
        </div>
      ) : null}

      <div
        ref={fieldRef}
        className={cn(
          'flex min-h-11 w-full items-center gap-1.5 rounded-md border border-[#ddd9e8] bg-white px-2.5 py-1.5',
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

        <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-hidden">
          {visibleValues.map((item) => (
            <span
              key={item}
              className="inline-flex max-w-[10rem] shrink-0 items-center gap-1 rounded-full bg-[#2D2061] px-2.5 py-0.5 text-xs font-medium text-white"
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

          {overflowCount > 0 ? (
            <div className="relative shrink-0">
              <button
                ref={moreBtnRef}
                type="button"
                disabled={disabled}
                aria-expanded={moreOpen}
                aria-label={`${overflowCount} more selected`}
                className="inline-flex h-[1.375rem] items-center rounded-full bg-[#EDEAF8] px-2 text-xs font-semibold text-[#2D2061] transition-colors hover:bg-[#E0DCF0]"
                onClick={(event) => {
                  event.stopPropagation()
                  setMoreOpen((current) => !current)
                  setOpen(false)
                }}
              >
                +{overflowCount} more
              </button>

              {moreOpen ? (
                <div
                  ref={morePanelRef}
                  role="list"
                  className="absolute left-0 top-full z-30 mt-1.5 min-w-[14rem] max-w-[18rem] overflow-hidden rounded-lg border border-[#E4E1EE] bg-white py-1 shadow-[0_8px_24px_rgba(26,22,56,0.14)]"
                  onClick={(event) => event.stopPropagation()}
                >
                  <p className="border-b border-[#F0EEF5] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.05em] text-[#8B8B9E]">
                    {overflowCount} more selected
                  </p>
                  <ul className="max-h-48 overflow-y-auto py-0.5">
                    {overflowValues.map((item) => {
                      const label = labelByValue.get(item) ?? item
                      return (
                        <li
                          key={item}
                          role="listitem"
                          className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-[#F7F6FA]"
                        >
                          <span className="min-w-0 flex-1 truncate text-xs font-medium text-[#2D2061]">
                            {label}
                          </span>
                          <button
                            type="button"
                            disabled={disabled}
                            aria-label={`Remove ${label}`}
                            className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[#8B8B9E] hover:bg-[#EDEAF8] hover:text-[#2D2061]"
                            onClick={() => removeValue(item)}
                          >
                            <X className="size-3" strokeWidth={2.25} />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          <input
            ref={inputRef}
            type="text"
            value={query}
            disabled={disabled}
            placeholder={value.length === 0 ? placeholder : ''}
            className="min-w-[6rem] flex-1 border-0 bg-transparent py-1 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2]"
            role="combobox"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-autocomplete="list"
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
              setMoreOpen(false)
            }}
            onFocus={() => {
              setOpen(true)
              setMoreOpen(false)
            }}
            onKeyDown={handleKeyDown}
          />
        </div>
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
