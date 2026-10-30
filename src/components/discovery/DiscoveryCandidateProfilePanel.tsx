import { useEffect, useRef, useState, type RefObject } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { CandidateProfileBanner } from '../candidate-profile/CandidateProfileBanner'
import { CandidateDocumentsPanel } from '../candidate-profile/CandidateDocumentsPanel'
import { CandidateJourneyPanel } from '../candidate-profile/CandidateJourneyPanel'
import { CandidateNotesPanel } from '../candidate-profile/CandidateNotesPanel'
import { CandidateSummaryPanel } from '../candidate-profile/CandidateSummaryPanel'
import { MessagingHistoryPanel } from '../candidate-profile/MessagingHistoryPanel'
import { ResumePreview } from '../candidate-profile/ResumePreview'
import { TalentTrackerPanel } from '../candidate-profile/TalentTrackerPanel'
import { VideoInterviewPanel } from '../candidate-profile/VideoInterviewPanel'
import {
  ProfileTabMenuButton,
  ProfileTabsPanel,
  type ProfileTabConfig,
} from '../candidate-profile/ProfileTabsPanel'
import { Button, toast } from '../ui'
import { cn } from '../../lib/cn'
import {
  resolveProfileNavigation,
  type ProfileNavigation,
} from '../../data/candidateProfile'

const PROFILE_TABS: ProfileTabConfig[] = [
  { id: 'summary', label: 'Candidate Summary', visible: true },
  { id: 'journey', label: 'Candidate Journey', visible: true },
  { id: 'talent', label: 'Talent Tracker', visible: true },
  { id: 'video', label: 'Video Interview', visible: true },
  { id: 'messaging', label: 'Messaging History', visible: true },
  { id: 'documents', label: 'Documents', visible: true },
  { id: 'notes', label: 'Notes', visible: true },
]

export type DiscoveryCandidateProfilePanelProps = {
  candidateId: string
  neighborIds: string[]
  onBack: () => void
  onSelectCandidate: (id: string) => void
}

/**
 * Candidate profile embedded in Discovery’s right pane (chat stays on the left).
 */
export function DiscoveryCandidateProfilePanel({
  candidateId,
  neighborIds,
  onBack,
  onSelectCandidate,
}: DiscoveryCandidateProfilePanelProps) {
  const navigation = resolveProfileNavigation({ candidateId })
  const [status, setStatus] = useState('New')
  const [tab, setTab] = useState('summary')
  const [tabsOpen, setTabsOpen] = useState(false)
  const [tabs, setTabs] = useState<ProfileTabConfig[]>(PROFILE_TABS)
  const tabListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setStatus('New')
    setTab('summary')
  }, [candidateId])

  useEffect(() => {
    const list = tabListRef.current
    if (!list) return
    function blockHorizontalScroll(event: WheelEvent) {
      if (event.deltaX !== 0) event.preventDefault()
    }
    list.addEventListener('wheel', blockHorizontalScroll, { passive: false })
    return () => list.removeEventListener('wheel', blockHorizontalScroll)
  }, [candidateId])

  if (!navigation) {
    return (
      <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#FAFAFC] p-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit items-center gap-1.5 text-[13px] font-medium text-[#5C5870] hover:text-[#2D2061]"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden="true" />
          Back to results
        </button>
        <p className="mt-6 text-sm text-[#5C5870]">
          This candidate profile could not be found.
        </p>
      </section>
    )
  }

  const index = neighborIds.indexOf(candidateId)
  const previousId = index > 0 ? neighborIds[index - 1] : null
  const nextId =
    index >= 0 && index < neighborIds.length - 1 ? neighborIds[index + 1] : null

  const visibleTabs = tabs.filter((item) => item.visible)
  const activeTab = visibleTabs.some((item) => item.id === tab)
    ? tab
    : (visibleTabs[0]?.id ?? '')

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#FAFAFC]">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-[#ECEAF3] bg-white px-4 py-3 sm:px-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5C5870] transition-colors hover:text-[#2D2061]"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden="true" />
          Back to results
        </button>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!previousId}
            onClick={() => {
              if (previousId) onSelectCandidate(previousId)
            }}
            className="!h-9 !rounded-md border-[#D5D2E2] px-3 text-[13px] font-semibold text-[#2D2061]"
          >
            <ChevronLeft className="size-4" strokeWidth={2} aria-hidden="true" />
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!nextId}
            onClick={() => {
              if (nextId) onSelectCandidate(nextId)
            }}
            className="!h-9 !rounded-md border-[#D5D2E2] px-3 text-[13px] font-semibold text-[#2D2061]"
          >
            Next
            <ChevronRight className="size-4" strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
        <ProfileBody
          navigation={navigation}
          status={status}
          onStatusChange={setStatus}
          visibleTabs={visibleTabs}
          activeTab={activeTab}
          onTabChange={setTab}
          tabListRef={tabListRef}
          tabs={tabs}
          tabsOpen={tabsOpen}
          onTabsOpen={() => setTabsOpen(true)}
          onTabsClose={() => setTabsOpen(false)}
          onTabsApply={setTabs}
        />
      </div>
    </section>
  )
}

function ProfileBody({
  navigation,
  status,
  onStatusChange,
  visibleTabs,
  activeTab,
  onTabChange,
  tabListRef,
  tabs,
  tabsOpen,
  onTabsOpen,
  onTabsClose,
  onTabsApply,
}: {
  navigation: ProfileNavigation
  status: string
  onStatusChange: (value: string) => void
  visibleTabs: ProfileTabConfig[]
  activeTab: string
  onTabChange: (id: string) => void
  tabListRef: RefObject<HTMLDivElement | null>
  tabs: ProfileTabConfig[]
  tabsOpen: boolean
  onTabsOpen: () => void
  onTabsClose: () => void
  onTabsApply: (tabs: ProfileTabConfig[]) => void
}) {
  return (
    <>
      <CandidateProfileBanner
        identity={navigation.identity}
        status={status}
        onStatusChange={onStatusChange}
        onSendMail={() =>
          toast.success('Mail composer opened', {
            description: `Ready to email ${navigation.identity.name}.`,
          })
        }
      />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(16rem,0.85fr)_minmax(18rem,1.15fr)]">
        <ResumePreview />
        <section className="min-w-0 rounded-xl border border-[#E8E6F0] bg-white px-3 pb-4 pt-1 sm:px-4">
          <div className="flex items-center gap-1 border-b border-[#E8E6F0]">
            <button
              type="button"
              aria-label="Previous tab"
              disabled={
                !visibleTabs.some(
                  (item, index) => item.id === activeTab && index > 0,
                )
              }
              onClick={() =>
                moveProfileTab(tabListRef.current, activeTab, -1, onTabChange)
              }
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F4F2F8] hover:text-[#2D2061] disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronLeft className="size-4" strokeWidth={2} aria-hidden="true" />
            </button>
            <div
              ref={tabListRef}
              role="tablist"
              aria-label="Candidate profile"
              className="flex min-w-0 flex-1 touch-pan-y gap-1 overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              onKeyDown={(event) => {
                if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
                event.preventDefault()
                moveProfileTab(
                  tabListRef.current,
                  activeTab,
                  event.key === 'ArrowRight' ? 1 : -1,
                  onTabChange,
                )
              }}
            >
              {visibleTabs.map((item) => {
                const selected = item.id === activeTab
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    data-tab-id={item.id}
                    aria-selected={selected}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => onTabChange(item.id)}
                    className={cn(
                      'inline-flex shrink-0 items-center border-b-2 px-2.5 py-2.5 text-[12px] font-medium whitespace-nowrap transition-colors sm:px-3 sm:text-[13px]',
                      selected
                        ? 'border-[#2D2061] text-[#2D2061]'
                        : 'border-transparent text-[#8B8B9E] hover:text-[#2D2061]',
                    )}
                  >
                    {item.label}
                  </button>
                )
              })}
            </div>
            <button
              type="button"
              aria-label="Next tab"
              disabled={
                !visibleTabs.some(
                  (item, index) =>
                    item.id === activeTab && index < visibleTabs.length - 1,
                )
              }
              onClick={() =>
                moveProfileTab(tabListRef.current, activeTab, 1, onTabChange)
              }
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F4F2F8] hover:text-[#2D2061] disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronRight className="size-4" strokeWidth={2} aria-hidden="true" />
            </button>
            <ProfileTabMenuButton onClick={onTabsOpen} />
          </div>
          <div className="pt-4" role="tabpanel">
            {activeTab ? renderProfileTab(activeTab) : null}
          </div>
          <ProfileTabsPanel
            open={tabsOpen}
            onClose={onTabsClose}
            tabs={tabs}
            onApply={onTabsApply}
          />
        </section>
      </div>
    </>
  )
}

function moveProfileTab(
  list: HTMLDivElement | null,
  activeId: string,
  direction: -1 | 1,
  onSelect: (id: string) => void,
) {
  if (!list) return
  const tabs = [...list.querySelectorAll<HTMLButtonElement>('[role="tab"]')]
  const index = tabs.findIndex(
    (tab) =>
      tab.getAttribute('aria-selected') === 'true' || tab.dataset.tabId === activeId,
  )
  const next = tabs[index + direction]
  const nextId = next?.dataset.tabId
  if (!next || !nextId) return
  onSelect(nextId)
  next.focus({ preventScroll: true })
  next.scrollIntoView({ inline: 'nearest', block: 'nearest' })
}

function renderProfileTab(tabId: string) {
  switch (tabId) {
    case 'summary':
      return <CandidateSummaryPanel />
    case 'journey':
      return <CandidateJourneyPanel />
    case 'talent':
      return <TalentTrackerPanel />
    case 'video':
      return <VideoInterviewPanel />
    case 'messaging':
      return <MessagingHistoryPanel />
    case 'documents':
      return <CandidateDocumentsPanel />
    case 'notes':
      return <CandidateNotesPanel />
    default:
      return (
        <div className="rounded-lg border border-dashed border-[#E6E3EF] bg-white px-6 py-16 text-center">
          <p className="text-sm font-semibold text-[#2D2061]">No records yet</p>
        </div>
      )
  }
}
