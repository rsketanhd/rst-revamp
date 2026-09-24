import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageContainer } from '../components/layout'
import { CandidateProfileBanner } from '../components/candidate-profile/CandidateProfileBanner'
import { CandidateDocumentsPanel } from '../components/candidate-profile/CandidateDocumentsPanel'
import { CandidateJourneyPanel } from '../components/candidate-profile/CandidateJourneyPanel'
import { CandidateNotesPanel } from '../components/candidate-profile/CandidateNotesPanel'
import { CandidateSummaryPanel } from '../components/candidate-profile/CandidateSummaryPanel'
import { MessagingHistoryPanel } from '../components/candidate-profile/MessagingHistoryPanel'
import { ResumePreview } from '../components/candidate-profile/ResumePreview'
import { ScoreSummaryPanel } from '../components/candidate-profile/ScoreSummaryPanel'
import { TalentTrackerPanel } from '../components/candidate-profile/TalentTrackerPanel'
import { VideoInterviewPanel } from '../components/candidate-profile/VideoInterviewPanel'
import {
  ProfileTabMenuButton,
  ProfileTabsPanel,
  type ProfileTabConfig,
} from '../components/candidate-profile/ProfileTabsPanel'
import { Button, toast } from '../components/ui'
import { cn } from '../lib/cn'
import { resolveProfileNavigation } from '../data/candidateProfile'

const PROFILE_TABS: Array<ProfileTabConfig & { applicationOnly?: boolean }> = [
  { id: 'summary', label: 'Candidate Summary', visible: true },
  { id: 'journey', label: 'Candidate Journey', visible: true },
  { id: 'score', label: 'Score Summary', visible: true, applicationOnly: true },
  { id: 'talent', label: 'Talent Tracker', visible: true },
  { id: 'video', label: 'Video Interview', visible: true },
  { id: 'messaging', label: 'Messaging History', visible: true },
  { id: 'documents', label: 'Documents', visible: true },
  { id: 'notes', label: 'Notes', visible: true },
]

function defaultProfileTabs(showScoreSummary: boolean): ProfileTabConfig[] {
  return PROFILE_TABS.filter((tab) => showScoreSummary || !tab.applicationOnly).map(
    ({ id, label, visible }) => ({ id, label, visible }),
  )
}

export function CandidateProfilePage() {
  const navigate = useNavigate()
  const { jobCode, applicantId, candidateId } = useParams()
  const navigation = resolveProfileNavigation({
    jobCode,
    applicantId,
    candidateId,
  })
  const [status, setStatus] = useState('New')
  const [tab, setTab] = useState('summary')
  const [tabsOpen, setTabsOpen] = useState(false)
  const tabListRef = useRef<HTMLDivElement>(null)
  const [tabs, setTabs] = useState<ProfileTabConfig[]>(() =>
    defaultProfileTabs(Boolean(navigation?.showScoreSummary)),
  )
  const profileId = navigation?.identity.id
  const showScoreSummary = navigation?.showScoreSummary

  useEffect(() => {
    setStatus('New')
    setTab('summary')
  }, [profileId])

  useEffect(() => {
    setTabs(defaultProfileTabs(Boolean(showScoreSummary)))
  }, [showScoreSummary])

  useEffect(() => {
    const list = tabListRef.current
    if (!list) return
    function blockHorizontalScroll(event: WheelEvent) {
      if (event.deltaX !== 0) event.preventDefault()
    }
    list.addEventListener('wheel', blockHorizontalScroll, { passive: false })
    return () => list.removeEventListener('wheel', blockHorizontalScroll)
  }, [profileId, showScoreSummary])

  if (!navigation) {
    return (
      <PageContainer>
        <p className="text-sm text-[#5C5870]">This candidate profile could not be found.</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-4 !rounded-md"
          onClick={() => navigate('/candidates')}
        >
          Back to Candidates
        </Button>
      </PageContainer>
    )
  }

  const visibleTabs = tabs.filter((item) => item.visible)
  const activeTab = visibleTabs.some((item) => item.id === tab)
    ? tab
    : (visibleTabs[0]?.id ?? '')

  return (
    <PageContainer contentClassName="gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => navigate(navigation.backTo)}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#5C5870] transition-colors hover:text-[#2D2061]"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden="true" />
          {navigation.backLabel}
        </button>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!navigation.previousTo}
            onClick={() => {
              if (navigation.previousTo) navigate(navigation.previousTo)
            }}
            className="!h-9 !rounded-md border-[#D5D2E2] px-3 text-[13px] font-semibold text-[#2D2061]"
          >
            <ChevronLeft className="size-4" strokeWidth={2} aria-hidden="true" />
            Previous Candidate
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!navigation.nextTo}
            onClick={() => {
              if (navigation.nextTo) navigate(navigation.nextTo)
            }}
            className="!h-9 !rounded-md border-[#D5D2E2] px-3 text-[13px] font-semibold text-[#2D2061]"
          >
            Next Candidate
            <ChevronRight className="size-4" strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </div>

      <CandidateProfileBanner
        identity={navigation.identity}
        status={status}
        onStatusChange={setStatus}
        onSendMail={() =>
          toast.success('Mail composer opened', {
            description: `Ready to email ${navigation.identity.name}.`,
          })
        }
      />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(18rem,0.9fr)_minmax(20rem,1.1fr)]">
        <ResumePreview />
        <section className="min-w-0">
          <div className="flex items-center gap-1 border-b border-[#E8E6F0]">
            <button
              type="button"
              aria-label="Previous tab"
              disabled={!visibleTabs.some((item, index) => item.id === activeTab && index > 0)}
              onClick={() => moveProfileTab(tabListRef.current, activeTab, -1, setTab)}
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
                  setTab,
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
                    onClick={() => setTab(item.id)}
                    className={cn(
                      'inline-flex shrink-0 items-center border-b-2 px-3 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors',
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
                  (item, index) => item.id === activeTab && index < visibleTabs.length - 1,
                )
              }
              onClick={() => moveProfileTab(tabListRef.current, activeTab, 1, setTab)}
              className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F4F2F8] hover:text-[#2D2061] disabled:pointer-events-none disabled:opacity-35"
            >
              <ChevronRight className="size-4" strokeWidth={2} aria-hidden="true" />
            </button>
            <ProfileTabMenuButton onClick={() => setTabsOpen(true)} />
          </div>
          <div className="pt-4" role="tabpanel">
            {activeTab
              ? renderProfileTab(
                  activeTab,
                  visibleTabs.find((item) => item.id === activeTab)?.label ?? activeTab,
                )
              : (
                <ProfileTabPlaceholder label="No tabs selected" />
              )}
          </div>
          <ProfileTabsPanel
            open={tabsOpen}
            onClose={() => setTabsOpen(false)}
            tabs={tabs}
            onApply={setTabs}
          />
        </section>
      </div>
    </PageContainer>
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
    (tab) => tab.getAttribute('aria-selected') === 'true' || tab.dataset.tabId === activeId,
  )
  const next = tabs[index + direction]
  const nextId = next?.dataset.tabId
  if (!next || !nextId) return
  onSelect(nextId)
  next.focus({ preventScroll: true })
  next.scrollIntoView({ inline: 'nearest', block: 'nearest' })
}

function renderProfileTab(tabId: string, label: string) {
  switch (tabId) {
    case 'summary':
      return <CandidateSummaryPanel />
    case 'journey':
      return <CandidateJourneyPanel />
    case 'score':
      return <ScoreSummaryPanel />
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
      return <ProfileTabPlaceholder label={label} />
  }
}

function ProfileTabPlaceholder({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#E6E3EF] bg-white px-6 py-16 text-center">
      <p className="text-sm font-semibold text-[#2D2061]">{label}</p>
      <p className="mt-1 text-[13px] text-[#6B6B80]">No records in this section yet.</p>
    </div>
  )
}
