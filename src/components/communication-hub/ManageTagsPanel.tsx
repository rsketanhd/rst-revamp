import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, SidePanel, toast } from '../ui'

export type ManageTagsPanelProps = {
  open: boolean
  onClose: () => void
  tags: string[]
  onChange: (tags: string[]) => void
}

export function ManageTagsPanel({
  open,
  onClose,
  tags,
  onChange,
}: ManageTagsPanelProps) {
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (!open) setDraft('')
  }, [open])

  function addTag() {
    const next = draft.trim()
    if (!next) {
      toast.error('Enter a tag name')
      return
    }

    const exists = tags.some(
      (tag) => tag.toLowerCase() === next.toLowerCase(),
    )
    if (exists) {
      toast.warning('Tag already exists')
      return
    }

    onChange([...tags, next])
    setDraft('')
    toast.success('Tag added', { description: next })
  }

  function removeTag(tag: string) {
    onChange(tags.filter((item) => item !== tag))
    toast.success('Tag removed', { description: tag })
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Manage Tags"
      widthClassName="w-full max-w-[26rem]"
    >
      <div className="space-y-4">
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault()
            addTag()
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Create a new tag"
            aria-label="Create a new tag"
            className="h-11 min-w-0 flex-1 rounded-md border border-[#E0DDEA] bg-white px-3.5 text-sm text-[#1A1A2E] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
          <Button
            type="submit"
            className="!h-11 shrink-0 !rounded-md bg-[#2D2061] px-5 text-[13px] font-semibold text-white hover:bg-[#241a4e]"
          >
            Add
          </Button>
        </form>

        <ul className="overflow-hidden rounded-md border border-[#E8E6F0] bg-white">
          {tags.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm text-[#8B8B9E]">
              No tags yet. Create a new tag above.
            </li>
          ) : (
            tags.map((tag) => (
              <li
                key={tag}
                className="flex items-center justify-between gap-3 border-b border-[#F0EEF5] px-4 py-3.5 last:border-b-0"
              >
                <span className="min-w-0 truncate text-[14px] text-[#1A1A2E]">
                  {tag}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  onClick={() => removeTag(tag)}
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[#2D2061] transition-colors hover:bg-[#F4F2F8]"
                >
                  <X className="size-4" strokeWidth={2} aria-hidden="true" />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </SidePanel>
  )
}
