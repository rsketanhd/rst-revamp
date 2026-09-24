import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Mail, MapPin, X } from 'lucide-react'
import { Button } from '../ui'
import { cn } from '../../lib/cn'
import {
  PROFILE_MORE_TAGS,
  PROFILE_STATUS_OPTIONS,
  PROFILE_VISIBLE_TAGS,
  type ProfileIdentity,
} from '../../data/candidateProfile'

export type CandidateProfileBannerProps = {
  identity: ProfileIdentity
  status: string
  onStatusChange: (status: string) => void
  onSendMail: () => void
}

export function CandidateProfileBanner({
  identity,
  status,
  onStatusChange,
  onSendMail,
}: CandidateProfileBannerProps) {
  const [tagsOpen, setTagsOpen] = useState(false)
  const [tags, setTags] = useState<string[]>([
    ...PROFILE_VISIBLE_TAGS,
    ...PROFILE_MORE_TAGS,
  ])
  const [draftTag, setDraftTag] = useState('')
  const manageRef = useRef<HTMLButtonElement>(null)
  const shownTags = tags.slice(0, 2)
  const hiddenCount = Math.max(0, tags.length - shownTags.length)
  const initials = identity.name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()

  function addTag() {
    const next = draftTag.trim()
    if (!next) return
    setTags((current) =>
      current.some((tag) => tag.toLowerCase() === next.toLowerCase())
        ? current
        : [...current, next],
    )
    setDraftTag('')
  }

  function removeTag(tag: string) {
    setTags((current) => current.filter((item) => item !== tag))
  }

  return (
    <section className="overflow-hidden rounded-xl bg-[linear-gradient(100deg,#D45B86_0%,#8E3D78_38%,#3A2A6A_68%,#1B1744_100%)] text-white shadow-[0_8px_24px_rgba(45,32,97,0.12)]">
      <div className="flex flex-col gap-5 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <span
            className="inline-flex size-16 shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-[#F3D5C4] text-lg font-semibold text-[#6B3A4A]"
            aria-hidden="true"
          >
            {initials}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight">{identity.name}</h1>
              <span className="rounded-full bg-[#D7E7FF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1A6FD0]">
                New
              </span>
            </div>
            <p className="mt-0.5 text-sm text-white/90">{identity.headline}</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/85">
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-3.5" strokeWidth={2} aria-hidden="true" />
                {identity.email}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" strokeWidth={2} aria-hidden="true" />
                {identity.location}
              </span>
              <span>{identity.appliedAgo}</span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-white/70">
                Tags
              </span>
              {shownTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/15 px-2.5 py-1 text-[12px] font-medium text-white"
                >
                  {tag}
                </span>
              ))}
              <button
                ref={manageRef}
                type="button"
                aria-expanded={tagsOpen}
                onClick={() => setTagsOpen((current) => !current)}
                className="rounded-full bg-[#2A2158] px-3 py-1 text-[12px] font-semibold text-white hover:bg-[#241a4e]"
              >
                {hiddenCount > 0 ? `+${hiddenCount} more • Manage` : 'Manage'}
              </button>
            </div>
            <ManageTagsOverlay
              open={tagsOpen}
              anchorRef={manageRef}
              tags={tags}
              draft={draftTag}
              onDraftChange={setDraftTag}
              onAdd={addTag}
              onRemove={removeTag}
              onClose={() => setTagsOpen(false)}
            />
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-[11px] font-medium text-white/75">
            Current Status
            <select
              value={status}
              onChange={(event) => onStatusChange(event.target.value)}
              className="h-9 min-w-[11rem] appearance-none rounded-md border border-white/15 bg-white px-3 text-[13px] font-medium text-[#2A2740] outline-none"
            >
              {PROFILE_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSendMail}
            className="!h-9 !rounded-md border-white/20 bg-white px-4 text-[13px] font-semibold text-[#2D2061] hover:bg-[#F7F6FB]"
          >
            Send Mail
          </Button>
        </div>
      </div>
    </section>
  )
}

function ManageTagsOverlay({
  open,
  anchorRef,
  tags,
  draft,
  onDraftChange,
  onAdd,
  onRemove,
  onClose,
}: {
  open: boolean
  anchorRef: React.RefObject<HTMLButtonElement | null>
  tags: string[]
  draft: string
  onDraftChange: (value: string) => void
  onAdd: () => void
  onRemove: (tag: string) => void
  onClose: () => void
}) {
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null)

  function updatePosition() {
    const anchor = anchorRef.current
    const panel = panelRef.current
    if (!anchor || !panel) return
    const rect = anchor.getBoundingClientRect()
    const panelW = panel.offsetWidth || 280
    const panelH = panel.offsetHeight || 220
    let left = rect.left
    if (left + panelW > window.innerWidth - 8) {
      left = window.innerWidth - panelW - 8
    }
    left = Math.max(8, left)
    let top = rect.bottom + 8
    if (top + panelH > window.innerHeight - 8) {
      top = Math.max(8, rect.top - panelH - 8)
    }
    setCoords({ top, left })
  }

  useLayoutEffect(() => {
    if (!open) return
    updatePosition()
    const frame = window.requestAnimationFrame(updatePosition)
    return () => window.cancelAnimationFrame(frame)
  }, [open, tags, anchorRef])

  useEffect(() => {
    if (!open) return
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (panelRef.current?.contains(target)) return
      if (anchorRef.current?.contains(target)) return
      onClose()
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    function handleReposition() {
      updatePosition()
    }
    document.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleReposition)
    window.addEventListener('scroll', handleReposition, true)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleReposition)
      window.removeEventListener('scroll', handleReposition, true)
    }
  }, [open, onClose, anchorRef])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      ref={panelRef}
      id={panelId}
      role="dialog"
      aria-label="Manage tags"
      style={
        coords
          ? { top: coords.top, left: coords.left }
          : { top: -9999, left: -9999, visibility: 'hidden' }
      }
      className={cn(
        'fixed z-[110] w-[min(18rem,calc(100vw-1rem))] rounded-xl border border-[#E8E6F0] bg-white p-3',
        'shadow-[0_12px_40px_rgba(26,26,46,0.16)]',
      )}
    >
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-[#F3F0FA] px-2.5 py-1 text-[13px] font-medium text-[#6E6A86]"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onRemove(tag)}
              className="text-[#8B879E] hover:text-[#2D2061]"
            >
              <X className="size-3" strokeWidth={2} aria-hidden="true" />
            </button>
          </span>
        ))}
      </div>
      <form
        className="mt-3"
        onSubmit={(event) => {
          event.preventDefault()
          onAdd()
        }}
      >
        <input
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Add a tag and press Enter"
          aria-label="Add a tag"
          className="h-10 w-full rounded-lg border border-[#E4E1EC] px-3 text-[13px] text-[#2A2740] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061]"
        />
      </form>
    </div>,
    document.body,
  )
}
