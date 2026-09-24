import { useEffect, useState } from 'react'
import { Move } from 'lucide-react'
import { Button, SidePanel } from '../ui'
import { cn } from '../../lib/cn'

export type ProfileTabConfig = {
  id: string
  label: string
  visible: boolean
}

export type ProfileTabsPanelProps = {
  open: boolean
  onClose: () => void
  tabs: ProfileTabConfig[]
  onApply: (tabs: ProfileTabConfig[]) => void
}

export function ProfileTabsPanel({
  open,
  onClose,
  tabs,
  onApply,
}: ProfileTabsPanelProps) {
  const [draft, setDraft] = useState<ProfileTabConfig[]>(tabs)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setDraft(tabs.map((tab) => ({ ...tab })))
    setDragId(null)
    setOverId(null)
  }, [open, tabs])

  function handleCancel() {
    onClose()
  }

  function handleApply() {
    onApply(draft.map((tab) => ({ ...tab })))
    onClose()
  }

  function toggleVisible(id: string) {
    setDraft((current) =>
      current.map((tab) =>
        tab.id === id ? { ...tab, visible: !tab.visible } : tab,
      ),
    )
  }

  function moveTab(fromId: string, toId: string) {
    if (fromId === toId) return
    setDraft((current) => {
      const fromIndex = current.findIndex((tab) => tab.id === fromId)
      const toIndex = current.findIndex((tab) => tab.id === toId)
      if (fromIndex < 0 || toIndex < 0) return current
      const next = [...current]
      const [removed] = next.splice(fromIndex, 1)
      if (!removed) return current
      next.splice(toIndex, 0, removed)
      return next
    })
  }

  return (
    <SidePanel
      open={open}
      onClose={handleCancel}
      title="Profile Tabs"
      widthClassName="w-full max-w-[26rem]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleCancel}
            className="!h-10 !min-w-[5.5rem] !rounded-md border-[#2D2061] bg-white px-4 text-sm font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleApply}
            className="!h-10 !min-w-[6.5rem] !rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Apply Now
          </Button>
        </>
      }
    >
      <ul className="flex flex-col gap-2.5" role="list">
        {draft.map((tab) => {
          const isDragging = dragId === tab.id
          const isOver = overId === tab.id && dragId !== tab.id
          return (
            <li
              key={tab.id}
              draggable
              onDragStart={(event) => {
                setDragId(tab.id)
                event.dataTransfer.effectAllowed = 'move'
                event.dataTransfer.setData('text/plain', tab.id)
              }}
              onDragEnd={() => {
                setDragId(null)
                setOverId(null)
              }}
              onDragOver={(event) => {
                event.preventDefault()
                event.dataTransfer.dropEffect = 'move'
                setOverId(tab.id)
              }}
              onDragLeave={() => {
                if (overId === tab.id) setOverId(null)
              }}
              onDrop={(event) => {
                event.preventDefault()
                const fromId = event.dataTransfer.getData('text/plain') || dragId
                if (fromId) moveTab(fromId, tab.id)
                setDragId(null)
                setOverId(null)
              }}
              className={cn(
                'flex cursor-grab items-center gap-3 rounded-md border border-[#E4E1EE] bg-white px-3 py-2.5 active:cursor-grabbing',
                isDragging && 'opacity-50',
                isOver && 'border-[#2D2061] bg-[#f7f6fb]',
              )}
            >
              <Move
                className="size-4 shrink-0 text-[#8B8B9E]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={tab.visible}
                  onChange={() => toggleVisible(tab.id)}
                  className="size-4 shrink-0 rounded border-[#C8C5D6] accent-[#2D2061]"
                  aria-label={`Show ${tab.label}`}
                />
                <span className="truncate text-sm font-medium text-[#2D2061]">
                  {tab.label}
                </span>
              </label>
            </li>
          )
        })}
      </ul>
    </SidePanel>
  )
}

export function ProfileTabMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Configure profile tabs"
      className="inline-flex size-8 shrink-0 items-center justify-center text-[#3A364C] transition-colors hover:text-[#2D2061]"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="1.1"
          y="1.1"
          width="19.8"
          height="19.8"
          rx="4.6"
          fill="#FFFFFF"
          stroke="#D5D2E2"
          strokeWidth="1.4"
        />
        <rect
          x="4.35"
          y="4.35"
          width="4.7"
          height="4.7"
          rx="1.35"
          stroke="currentColor"
          strokeWidth="1.45"
        />
        <rect
          x="12.95"
          y="4.35"
          width="4.7"
          height="4.7"
          rx="1.35"
          stroke="currentColor"
          strokeWidth="1.45"
        />
        <rect
          x="4.35"
          y="12.95"
          width="4.7"
          height="4.7"
          rx="1.35"
          stroke="currentColor"
          strokeWidth="1.45"
        />
        <rect
          x="12.95"
          y="12.95"
          width="4.7"
          height="4.7"
          rx="1.35"
          stroke="currentColor"
          strokeWidth="1.45"
        />
      </svg>
    </button>
  )
}
