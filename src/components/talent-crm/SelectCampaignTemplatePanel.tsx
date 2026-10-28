import { useEffect, useMemo, useState } from 'react'
import { Clock, Search } from 'lucide-react'
import { Button, SidePanel } from '../ui'
import { cn } from '../../lib/cn'
import {
  CAMPAIGN_MESSAGE_TEMPLATES,
  type CampaignMessageTemplate,
} from './createCampaignData'

export type SelectCampaignTemplatePanelProps = {
  open: boolean
  onClose: () => void
  selectedTemplateId?: string | null
  /** Extra templates created in this session (shown above defaults). */
  extraTemplates?: CampaignMessageTemplate[]
  onSelect: (template: CampaignMessageTemplate) => void
  onCreateNew: () => void
}

/**
 * Create Campaign → Messages → Select Template side panel.
 */
export function SelectCampaignTemplatePanel({
  open,
  onClose,
  selectedTemplateId = null,
  extraTemplates = [],
  onSelect,
  onCreateNew,
}: SelectCampaignTemplatePanelProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (open) setQuery('')
  }, [open])

  const allTemplates = useMemo(
    () => [...extraTemplates, ...CAMPAIGN_MESSAGE_TEMPLATES],
    [extraTemplates],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return allTemplates
    return allTemplates.filter((template) =>
      template.name.toLowerCase().includes(q),
    )
  }, [allTemplates, query])

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Select Template"
      widthClassName="w-full max-w-[28rem]"
      footerClassName="justify-stretch border-t border-[#ECEAF3]"
      footer={
        <Button
          type="button"
          onClick={() => {
            onClose()
            onCreateNew()
          }}
          className="!h-11 w-full !rounded-md !bg-[#2D2061] text-sm font-semibold text-white hover:!bg-[#241a52]"
        >
          Create New Template
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-[#8B8B9E]">
          Choose an existing template or Create new one
        </p>

        <div className="flex flex-col gap-3 rounded-xl bg-[#F5F5F8] p-3 sm:p-3.5">
          <label className="relative block">
            <span className="sr-only">Search and Select Template</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search and Select Template"
              className="h-11 w-full rounded-lg border border-[#E4E1EE] bg-white py-2.5 pr-10 pl-3.5 text-sm text-[#1A1A2E] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061]/40 focus:ring-2 focus:ring-[#2D2061]/15"
            />
            <Search
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#A0A0B2]"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </label>

          <ul className="flex flex-col gap-2.5" role="listbox" aria-label="Templates">
            {filtered.length === 0 ? (
              <li className="rounded-lg border border-dashed border-[#DAD6E6] bg-white px-4 py-8 text-center text-sm text-[#8B8B9E]">
                No templates match your search.
              </li>
            ) : (
              filtered.map((template) => {
                const selected = template.id === selectedTemplateId
                return (
                  <li key={template.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() => {
                        onSelect(template)
                        onClose()
                      }}
                      className={cn(
                        'flex w-full flex-col gap-1.5 rounded-lg border bg-white px-4 py-3.5 text-left transition-colors',
                        selected
                          ? 'border-[#2D2061] ring-1 ring-[#2D2061]/20'
                          : 'border-[#E4E1EE] hover:border-[#C9C4D8]',
                      )}
                    >
                      <span className="text-sm font-semibold text-[#1A1A2E]">
                        {template.name}
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs text-[#8B8B9E]">
                        <Clock
                          className="size-3.5 shrink-0"
                          strokeWidth={1.75}
                          aria-hidden="true"
                        />
                        {template.updatedAgo}
                      </span>
                    </button>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      </div>
    </SidePanel>
  )
}
