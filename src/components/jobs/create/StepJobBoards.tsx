import { useEffect, useState, type ReactNode } from 'react'
import { Calendar, Info, MapPin, Plus, Star } from 'lucide-react'
import {
  Button,
  Checkbox,
  MultiSelect,
  SearchSelect,
  Select,
  SidePanel,
  Tooltip,
} from '../../ui'
import type { CreateJobFormState, LinkedInAllFilters } from './types'
import { StepHeader } from './StepChrome'
import { cn } from '../../../lib/cn'

type Props = {
  value: CreateJobFormState
  onChange: (patch: Partial<CreateJobFormState>) => void
}

type FiltersTab = 'rsPlus' | 'linkedin'

const INDUSTRY_OPTIONS = [
  'Design & Creative Services',
  'Software Technology',
  'Healthcare',
  'Finance',
  'Education',
]
const COMPANY_OPTIONS = [
  'Google',
  'Microsoft',
  'Amazon',
  'Meta',
  'Apple',
  'TCS',
]
const LOCATION_OPTIONS = [
  'Ahmedabad, Gujarat, India',
  'Mumbai',
  'Bangalore',
  'Pune',
  'Remote',
  'London, UK',
]
const AI_LOCATION_SUGGESTIONS = ['Mumbai', 'Bangalore', 'Pune', 'Remote']

const CREDITS_INFO =
  'Credits are used when sourcing candidates via RS Plus. Available credits update after each campaign run.'

type LinkedInCandidate = {
  id: string
  name: string
  initials: string
  location: string
  experienceYears: number
}

const LINKEDIN_CANDIDATES: LinkedInCandidate[] = [
  {
    id: 'li-c1',
    name: 'Amirul Faiz Saiful Faiz',
    initials: 'AS',
    location: 'Mountain View, CA',
    experienceYears: 5,
  },
  {
    id: 'li-c2',
    name: 'Amirul Faiz Saiful Faiz',
    initials: 'AS',
    location: 'Mountain View, CA',
    experienceYears: 5,
  },
  {
    id: 'li-c3',
    name: 'Bella Tran',
    initials: 'BT',
    location: 'Austin, TX',
    experienceYears: 3,
  },
  {
    id: 'li-c4',
    name: 'Carlos Jimenez',
    initials: 'CJ',
    location: 'Seattle, WA',
    experienceYears: 7,
  },
  {
    id: 'li-c5',
    name: 'Diana Huang',
    initials: 'DH',
    location: 'New York, NY',
    experienceYears: 4,
  },
]

export function StepJobBoards({ value, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<FiltersTab>(() =>
    value.rsPlusEnabled ? 'rsPlus' : 'linkedin',
  )
  const [connectPanelOpen, setConnectPanelOpen] = useState(false)

  const showRsPlus = value.rsPlusEnabled
  const showLinkedIn = value.linkedInEnabled
  const hasAnySource = showRsPlus || showLinkedIn

  // Keep the active tab valid when sources are toggled
  useEffect(() => {
    if (activeTab === 'rsPlus' && !showRsPlus && showLinkedIn) {
      setActiveTab('linkedin')
      return
    }
    if (activeTab === 'linkedin' && !showLinkedIn && showRsPlus) {
      setActiveTab('rsPlus')
    }
  }, [activeTab, showRsPlus, showLinkedIn])

  function handleSourceChange(
    source: 'rsPlus' | 'linkedin',
    checked: boolean,
  ) {
    if (source === 'rsPlus') {
      onChange({ rsPlusEnabled: checked })
      if (checked) setActiveTab('rsPlus')
      return
    }
    onChange({ linkedInEnabled: checked })
    if (checked) setActiveTab('linkedin')
  }

  function addLocationSuggestion(city: string) {
    if (value.locations.includes(city)) return
    if (value.locations.length >= 5) return
    onChange({ locations: [...value.locations, city] })
  }

  function applyAutoDetectIndustry() {
    const detected = 'Design & Creative Services'
    if (value.industries.includes(detected)) return
    if (value.industries.length >= 5) return
    onChange({ industries: [...value.industries, detected] })
  }

  return (
    <div>
      <StepHeader
        title="Job Boards"
        description="Select job boards and define sourcing strategy."
      />

      {/* Sources */}
      <div className="mb-5">
        <p className="mb-2.5 text-xs font-semibold text-[#2D2061]">Sources</p>
        <div className="flex flex-wrap items-center gap-6">
          <Checkbox
            label="RS Plus"
            checked={value.rsPlusEnabled}
            onChange={(e) => handleSourceChange('rsPlus', e.target.checked)}
            className="[&_span]:text-sm [&_span]:font-medium [&_span]:text-[#2D2061]"
          />
          <div className="inline-flex items-center gap-2">
            <Checkbox
              label="LinkedIn"
              checked={value.linkedInEnabled}
              onChange={(e) => handleSourceChange('linkedin', e.target.checked)}
              className="[&_span]:text-sm [&_span]:font-medium [&_span]:text-[#2D2061]"
            />
            <span
              className={cn(
                'text-xs font-medium',
                value.linkedInConnected
                  ? 'text-[#1B9E4B]'
                  : 'text-[#E08A00]',
              )}
            >
              {value.linkedInConnected ? 'Connected' : 'Not Connected'}
            </span>
          </div>
        </div>
      </div>

      {!hasAnySource ? (
        <div className="rounded-xl border border-dashed border-[#E4E3EC] bg-[#FAFAFC] px-5 py-8 text-center">
          <p className="text-sm text-[#8B8B9E]">
            Select at least one source to configure job boards.
          </p>
        </div>
      ) : (
        <div className="relative pt-0">
          {/* Tabs: RS Plus Filters | LinkedIn Filters */}
          <div className="relative z-10 mb-[-1px] flex flex-wrap items-end gap-1">
            {showRsPlus ? (
              <TabButton
                active={activeTab === 'rsPlus'}
                onClick={() => setActiveTab('rsPlus')}
              >
                RS Plus Filters
              </TabButton>
            ) : null}
            {showLinkedIn ? (
              <TabButton
                active={activeTab === 'linkedin'}
                onClick={() => setActiveTab('linkedin')}
              >
                LinkedIn Filters
              </TabButton>
            ) : null}
          </div>

          <div className="rounded-b-xl rounded-t-none border border-[#E4E3EC] bg-white p-5 sm:p-6">
            {activeTab === 'rsPlus' && showRsPlus ? (
              <RsPlusFiltersContent
                value={value}
                onChange={onChange}
                addLocationSuggestion={addLocationSuggestion}
                applyAutoDetectIndustry={applyAutoDetectIndustry}
              />
            ) : null}

            {activeTab === 'linkedin' && showLinkedIn ? (
              <LinkedInFiltersContent
                value={value}
                onChange={onChange}
                locked={!value.linkedInConnected}
                onConnect={() => setConnectPanelOpen(true)}
              />
            ) : null}
          </div>
        </div>
      )}

      <ConnectLinkedInPanel
        open={connectPanelOpen}
        onClose={() => setConnectPanelOpen(false)}
        onAuthorize={() => {
          onChange({
            linkedInConnected: true,
            linkedInEnabled: true,
            linkedInKeywords:
              value.linkedInKeywords ||
              'New IT Application Developer Position',
            linkedInLocations:
              value.linkedInLocations.length > 0
                ? value.linkedInLocations
                : ['London, UK'],
            linkedInJobTitles:
              value.linkedInJobTitles.length > 0
                ? value.linkedInJobTitles
                : ['QA Manager'],
            linkedInLastSynced: formatLinkedInSyncTime(new Date()),
          })
          setConnectPanelOpen(false)
          setActiveTab('linkedin')
        }}
      />
    </div>
  )
}

function ConnectLinkedInPanel({
  open,
  onClose,
  onAuthorize,
}: {
  open: boolean
  onClose: () => void
  onAuthorize: () => void
}) {
  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Connect to LinkedIn"
      widthClassName="w-full max-w-[34rem]"
      bodyClassName="flex flex-col gap-4"
    >
      {/* How to link */}
      <section className="rounded-xl border border-[#E4E8EE] bg-[#F4F7FA] p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#2B6CB0] text-white">
            <Info className="size-3" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <h3 className="text-[11px] font-bold uppercase tracking-wide text-[#1A365D]">
            How to Link Your LinkedIn Session
          </h3>
        </div>

        <p className="mb-3 text-sm leading-relaxed text-[#4A5568]">
          Background indexing crawls LinkedIn using your recruiter session so we
          can push matching applicants into this job pipeline.
        </p>

        <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#4A5568]">
          <li>
            Open LinkedIn.com and verify you are logged in to your professional
            Recruiter account.
          </li>
          <li>
            Press <strong className="font-semibold text-[#2D3748]">F12</strong>{' '}
            or right-click and click{' '}
            <strong className="font-semibold text-[#2D3748]">Inspect</strong>.
          </li>
          <li>
            Under the DevTools tab header list, click{' '}
            <strong className="font-semibold text-[#2D3748]">Application</strong>{' '}
            (or{' '}
            <strong className="font-semibold text-[#2D3748]">Storage</strong> on
            Firefox).
          </li>
          <li>
            Expand the{' '}
            <strong className="font-semibold text-[#2D3748]">Cookies</strong>{' '}
            subsection on the sidebar and click on{' '}
            <code className="rounded bg-white/80 px-1 text-[12px] text-[#2D3748]">
              https://www.linkedin.com
            </code>
            .
          </li>
          <li>
            Search for the registry element called{' '}
            <code className="rounded bg-white/80 px-1 text-[12px] text-[#2D3748]">
              li_at
            </code>{' '}
            and copy its entire string value, then paste it below.
          </li>
        </ol>

        <label
          htmlFor="linkedin-li-at"
          className="mb-1.5 block text-xs font-medium text-[#4A5568]"
        >
          LinkedIn session cookie (<code className="text-[11px]">li_at</code>)
        </label>
        <input
          id="linkedin-li-at"
          type="password"
          autoComplete="off"
          placeholder="Paste li_at cookie value"
          className="mb-4 h-10 w-full rounded-md border border-[#D0D7E2] bg-white px-3 text-sm text-[#2D3748] outline-none placeholder:text-[#A0AEC0] focus:border-[#2B6CB0] focus:ring-2 focus:ring-[#2B6CB0]/15"
        />

        <div className="rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-3">
          <p className="text-xs font-semibold text-[#C05621]">
            Auto-Deactivation Warning
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#718096]">
            Session tokens typically expire every 30 days. If indexing stops,
            reconnect your profile or contact{' '}
            <a
              href="mailto:heli@recruitmentsmart.com"
              className="font-medium text-[#2B6CB0] underline-offset-2 hover:underline"
            >
              heli@recruitmentsmart.com
            </a>
            .
          </p>
        </div>
      </section>

      {/* Authorization */}
      <section className="flex flex-col items-center rounded-xl border border-[#F0E6D8] bg-[#FDFAF2] px-5 py-8 text-center sm:px-8">
        <span className="mb-4 inline-flex size-11 items-center justify-center rounded-md bg-[#0A66C2] text-white shadow-sm">
          <LinkedInMark className="size-6" />
        </span>
        <h3 className="text-base font-bold text-[#1A202C] sm:text-lg">
          Authorization Required for LinkedIn Sourcing
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-[#718096]">
          To utilize advanced applicant sourcing filter pipelines directly linked
          to passive professional profiles, authorize your profile identity first.
        </p>
        <Button
          type="button"
          onClick={onAuthorize}
          className="mt-6 h-11 gap-2 rounded-full !bg-[#0A66C2] px-6 shadow-md hover:!bg-[#004182]"
        >
          <LinkedInMark className="size-4" />
          Authorize LinkedIn Profile
        </Button>
      </section>
    </SidePanel>
  )
}

function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const LINKEDIN_CONNECTION_OPTIONS = [
  '1st degree',
  '2nd degree',
  '3rd+ degree',
  'Group members',
]
const LINKEDIN_FOLLOWERS_OPTIONS = [
  'Acme Corp',
  'Globex',
  'Initech',
  'Umbrella Inc',
  'Wayne Enterprises',
]
const LINKEDIN_LANGUAGE_OPTIONS = [
  'English',
  'Spanish',
  'French',
  'German',
  'Hindi',
  'Mandarin',
]
const LINKEDIN_DEGREE_OPTIONS = [
  '1st',
  '2nd',
  '3rd+',
]
const LINKEDIN_OPEN_TO_OPTIONS = [
  'Opportunities',
  'Career advice',
  'Hiring',
  'Finding a new job',
  'Volunteering',
]
const LINKEDIN_NAME_OPTIONS = [
  'Sarah',
  'Michael',
  'Priya',
  'David',
  'Aisha',
  'James',
  'Johnson',
  'Chen',
  'Shah',
]
const LINKEDIN_TITLE_OPTIONS = [
  'Recruiter',
  'Talent Specialist',
  'Engineering Manager',
  'QA Manager',
  'Product Manager',
  'Software Engineer',
]
const LINKEDIN_COMPANY_KEYWORD_OPTIONS = [
  'FinTech',
  'SaaS',
  'Healthcare',
  'Consulting',
  'Startups',
]
const LINKEDIN_SCHOOL_OPTIONS = [
  'Stanford',
  'MIT',
  'Harvard',
  'IIT Bombay',
  'Oxford',
  'Cambridge',
]

function LinkedInAllFiltersPanel({
  open,
  onClose,
  value,
  onApply,
}: {
  open: boolean
  onClose: () => void
  value: LinkedInAllFilters
  onApply: (value: LinkedInAllFilters) => void
}) {
  const [draft, setDraft] = useState<LinkedInAllFilters>(value)

  useEffect(() => {
    if (open) setDraft(value)
  }, [open, value])

  function update<K extends keyof LinkedInAllFilters>(
    key: K,
    next: LinkedInAllFilters[K],
  ) {
    setDraft((current) => ({ ...current, [key]: next }))
  }

  function handleCancel() {
    setDraft(value)
    onClose()
  }

  function handleApply() {
    onApply(draft)
  }

  return (
    <SidePanel
      open={open}
      onClose={handleCancel}
      title="All Filters"
      widthClassName="w-full max-w-[34rem]"
      footer={
        <>
          <button
            type="button"
            onClick={handleCancel}
            className="inline-flex h-10 min-w-[5.5rem] items-center justify-center rounded-md border border-[#d5d2e2] bg-white px-4 text-sm font-medium text-[#2D2061] transition-colors hover:bg-[#f7f6fb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="inline-flex h-10 min-w-[6.5rem] items-center justify-center rounded-md bg-[#2D2061] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#241a52]"
          >
            Apply Now
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <LinkedInFilterField label="Connections">
          <SearchSelect
            value={draft.connections}
            onChange={(connections) => update('connections', connections)}
            options={LINKEDIN_CONNECTION_OPTIONS}
            placeholder="Search & Select Connection"
          />
        </LinkedInFilterField>

        <LinkedInFilterField label="Followers Of">
          <SearchSelect
            value={draft.followersOf}
            onChange={(followersOf) => update('followersOf', followersOf)}
            options={LINKEDIN_FOLLOWERS_OPTIONS}
            placeholder="Search & Select Followers"
          />
        </LinkedInFilterField>

        <LinkedInFilterField label="Profile Language">
          <SearchSelect
            value={draft.profileLanguage}
            onChange={(profileLanguage) =>
              update('profileLanguage', profileLanguage)
            }
            options={LINKEDIN_LANGUAGE_OPTIONS}
            placeholder="Search & Select Categories"
          />
        </LinkedInFilterField>

        <Select
          label="Connection Degree"
          value={draft.connectionDegree}
          onChange={(e) => update('connectionDegree', e.target.value)}
          options={LINKEDIN_DEGREE_OPTIONS}
          placeholder="Connection Degree"
        />

        <Select
          label="Open To"
          value={draft.openTo}
          onChange={(e) => update('openTo', e.target.value)}
          options={LINKEDIN_OPEN_TO_OPTIONS}
          placeholder="Open To"
        />

        <LinkedInFilterField label="First Name (Advanced)">
          <SearchSelect
            value={draft.firstName}
            onChange={(firstName) => update('firstName', firstName)}
            options={LINKEDIN_NAME_OPTIONS}
            placeholder="Search & Select Categories"
          />
        </LinkedInFilterField>

        <LinkedInFilterField label="Last Name (Advanced)">
          <SearchSelect
            value={draft.lastName}
            onChange={(lastName) => update('lastName', lastName)}
            options={LINKEDIN_NAME_OPTIONS}
            placeholder="Search & Select Categories"
          />
        </LinkedInFilterField>

        <LinkedInFilterField label="Title (Advanced)">
          <SearchSelect
            value={draft.titleAdvanced}
            onChange={(titleAdvanced) => update('titleAdvanced', titleAdvanced)}
            options={LINKEDIN_TITLE_OPTIONS}
            placeholder="Search & Select Categories"
          />
        </LinkedInFilterField>

        <LinkedInFilterField label="Company Keyword (Advanced)">
          <SearchSelect
            value={draft.companyKeyword}
            onChange={(companyKeyword) =>
              update('companyKeyword', companyKeyword)
            }
            options={LINKEDIN_COMPANY_KEYWORD_OPTIONS}
            placeholder="Search & Select Categories"
          />
        </LinkedInFilterField>

        <LinkedInFilterField label="School Keyword (Advanced)">
          <SearchSelect
            value={draft.schoolKeyword}
            onChange={(schoolKeyword) => update('schoolKeyword', schoolKeyword)}
            options={LINKEDIN_SCHOOL_OPTIONS}
            placeholder="Search & Select Categories"
          />
        </LinkedInFilterField>
      </div>
    </SidePanel>
  )
}

function LinkedInFilterField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-[#2D2061]">{label}</span>
      {children}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex rounded-t-md px-4 py-2 text-xs font-semibold tracking-wide transition-colors',
        active
          ? 'bg-[#2D2061] text-white'
          : 'border border-b-0 border-[#E4E3EC] bg-[#F2F1F6] text-[#6B6B80] hover:bg-[#ebe9f2] hover:text-[#2D2061]',
      )}
    >
      {children}
    </button>
  )
}

function LinkedInFiltersContent({
  value,
  onChange,
  locked,
  onConnect,
}: {
  value: CreateJobFormState
  onChange: (patch: Partial<CreateJobFormState>) => void
  locked: boolean
  onConnect: () => void
}) {
  const [allFiltersOpen, setAllFiltersOpen] = useState(false)
  const [resultsVisible, setResultsVisible] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  function runSearch() {
    setResultsVisible(true)
    setSelectedIds([])
  }

  function toggleCandidate(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  function toggleSelectAll(checked: boolean) {
    setSelectedIds(checked ? LINKEDIN_CANDIDATES.map((c) => c.id) : [])
  }

  const allSelected =
    resultsVisible &&
    LINKEDIN_CANDIDATES.length > 0 &&
    selectedIds.length === LINKEDIN_CANDIDATES.length

  if (!locked) {
    return (
      <div className="flex flex-col gap-3">
        {/* Connected profile bar — light lavender per design */}
        <div className="flex flex-col gap-3 rounded-md border border-[#E4E3EC] bg-[#F0F1F8] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#2D2061] text-sm font-semibold text-white"
              aria-hidden="true"
            >
              SJ
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#2D2061]">
                Sarah Johnson
              </p>
              <p className="truncate text-xs text-[#6B6B80]">
                Lead IT Recruiter & Talent Specialist
              </p>
              <p className="mt-0.5 truncate text-xs font-medium text-[#1AA6B5]">
                Last Synced : {value.linkedInLastSynced || '—'}
              </p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex h-8 shrink-0 items-center justify-center self-start rounded-full border border-[#C9C3E8] bg-[#E8E4F5] px-4 text-[11px] font-bold uppercase tracking-wide text-[#5B4B9E] transition-colors hover:bg-[#ddd7f0] sm:self-center"
          >
            LinkedIn Classic
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-[#E4E3EC] bg-white p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[15px] font-bold text-[#2D2061]">
              LinkedIn Filters
            </h3>
            <button
              type="button"
              onClick={() => setAllFiltersOpen(true)}
              className="inline-flex h-8 items-center rounded-md border border-[#D5D2E2] bg-white px-3 text-xs font-medium text-[#2D2061] transition-colors hover:border-[#2D2061]/40 hover:bg-[#f7f6fb]"
            >
              More Filters
            </button>
          </div>

          {resultsVisible ? (
            <LinkedInInfoBanner className="mb-4">
              Search filters are auto-filled from the job description. Click
              &lsquo;Apply&rsquo; to search LinkedIn candidates.
            </LinkedInInfoBanner>
          ) : null}

          <div className="grid grid-cols-1 items-end gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
            <LinkedInField
              id="li-keywords"
              label="Keywords"
              placeholder="Enter Keywords"
              value={value.linkedInKeywords}
              onChange={(linkedInKeywords) => onChange({ linkedInKeywords })}
            />
            <LinkedInChipField
              id="li-location"
              label="Location"
              placeholder="Add Location"
              chips={value.linkedInLocations}
              onChange={(linkedInLocations) => onChange({ linkedInLocations })}
            />
            <LinkedInChipField
              id="li-job-title"
              label="Job Title"
              placeholder="Add Job Title"
              chips={value.linkedInJobTitles}
              onChange={(linkedInJobTitles) => onChange({ linkedInJobTitles })}
            />
            <Button
              type="button"
              onClick={runSearch}
              className="h-11 min-w-[5.5rem] !bg-[#2D2061] hover:!bg-[#241a52] sm:w-full xl:w-auto"
            >
              Apply
            </Button>
          </div>
        </div>

        {resultsVisible ? (
          <>
            {/* Bulk actions row */}
            <div className="flex flex-col gap-3 rounded-xl border border-[#E4E3EC] bg-white px-4 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-5">
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <Checkbox
                  id="li-select-all"
                  label="Select All"
                  checked={allSelected}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="[&_span]:text-sm [&_span]:font-medium [&_span]:text-[#2D2061]"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={selectedIds.length === 0}
                  className="h-9 gap-1 border-[#2D2061]/35 px-3 text-xs font-medium text-[#2D2061] hover:bg-[#f7f6fb] disabled:opacity-50"
                >
                  <Plus className="size-3.5" aria-hidden="true" />
                  Add to Job
                </Button>
              </div>
              <LinkedInInfoBanner className="min-w-0 flex-1">
                Click &lsquo;Add&rsquo; to select candidates for this job.
                Candidates will only be added after you complete both the Add and
                Update/Submit actions.
              </LinkedInInfoBanner>
            </div>

            {/* Candidate results */}
            <ul className="flex flex-col gap-2.5">
              {LINKEDIN_CANDIDATES.map((candidate) => {
                const selected = selectedIds.includes(candidate.id)
                return (
                  <li key={candidate.id}>
                    <article className="rounded-xl border border-[#E4E3EC] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(45,32,97,0.04)] sm:px-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleCandidate(candidate.id)}
                            aria-label={`Select ${candidate.name}`}
                            className="size-4 shrink-0 rounded border-line accent-[#2D2061]"
                          />
                          <span
                            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-[#D6E4F7] text-sm font-semibold text-[#2D2061]"
                            aria-hidden="true"
                          >
                            {candidate.initials}
                          </span>
                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-bold text-[#2D2061]">
                              {candidate.name}
                            </h4>
                            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#6B6B80]">
                              <span className="inline-flex items-center gap-1">
                                <MapPin
                                  className="size-3.5 shrink-0 text-[#8B8B9E]"
                                  aria-hidden="true"
                                />
                                {candidate.location}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <Calendar
                                  className="size-3.5 shrink-0 text-[#8B8B9E]"
                                  aria-hidden="true"
                                />
                                {candidate.experienceYears} years of experience
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          className="h-9 shrink-0 gap-1 self-start border-[#2D2061]/35 px-3 text-xs font-medium text-[#2D2061] hover:bg-[#f7f6fb] sm:self-center"
                        >
                          <Plus className="size-3.5" aria-hidden="true" />
                          Add to Job
                        </Button>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
          </>
        ) : null}

        <LinkedInAllFiltersPanel
          open={allFiltersOpen}
          onClose={() => setAllFiltersOpen(false)}
          value={value.linkedInAllFilters}
          onApply={(linkedInAllFilters) => {
            onChange({ linkedInAllFilters })
            setAllFiltersOpen(false)
            runSearch()
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Connect LinkedIn banner */}
      <div className="flex flex-col gap-4 rounded-xl border border-[#E8E6F2] bg-[#F7F6FB] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
        <div className="min-w-0">
          <h3 className="text-[15px] font-bold text-[#2D2061]">
            Find More Candidates with LinkedIn
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[#6B6B80]">
            Connect your LinkedIn account to search profiles, reach out via
            InMail, and add matched candidates straight to this job — without
            leaving SniperAI.
          </p>
        </div>
        <Button
          type="button"
          onClick={onConnect}
          className="h-10 shrink-0 !bg-[#2D2061] px-5 hover:!bg-[#241a52]"
        >
          Connect LinkedIn
        </Button>
      </div>

      {/* Locked filters preview */}
      <div className="rounded-xl border border-[#E4E3EC] bg-[#F5F5F5] p-4 sm:p-5">
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-[#E8E6F0] bg-white px-3.5 py-3">
          <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-[#F5A623] text-[11px] font-bold text-white">
            i
          </span>
          <p className="text-sm leading-snug text-[#E08A00]">
            Filters unlock once LinkedIn is connected. They&apos;re carried over
            from the Job Analyzer step and will run on your first search
          </p>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-[15px] font-bold text-[#2D2061]">
            LinkedIn Filters
          </h3>
          <button
            type="button"
            disabled
            className="inline-flex h-8 cursor-not-allowed items-center rounded-md border border-[#D5D2E2] bg-white px-3 text-xs font-medium text-[#6B6B80] opacity-50"
          >
            More Filters
          </button>
        </div>

        <div className="grid grid-cols-1 items-end gap-3 opacity-55 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
          <LinkedInField
            id="li-keywords-locked"
            label="Keywords"
            placeholder="Enter Keywords"
            value=""
            disabled
            onChange={() => undefined}
          />
          <LinkedInField
            id="li-location-locked"
            label="Location"
            placeholder="Add Location"
            value=""
            disabled
            onChange={() => undefined}
          />
          <LinkedInField
            id="li-job-title-locked"
            label="Job Title"
            placeholder="Add Job Title"
            value=""
            disabled
            onChange={() => undefined}
          />
          <Button
            type="button"
            disabled
            className="h-11 min-w-[5.5rem] cursor-not-allowed !bg-[#706BB0] opacity-70 sm:w-full xl:w-auto"
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  )
}

function LinkedInInfoBanner({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-md border border-[#F0E0B0] bg-[#FFF9E8] px-3 py-2.5',
        className,
      )}
    >
      <span className="mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[#E8A317] text-[10px] font-bold leading-none text-white">
        i
      </span>
      <p className="text-xs leading-relaxed text-[#8A6A1A] sm:text-sm">
        {children}
      </p>
    </div>
  )
}

function formatLinkedInSyncTime(date: Date) {
  return date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function LinkedInField({
  id,
  label,
  placeholder,
  value,
  disabled,
  onChange,
}: {
  id: string
  label: string
  placeholder: string
  value: string
  disabled?: boolean
  onChange: (value: string) => void
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-[#6B6B80]">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-11 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061]',
          'placeholder:text-[#A0A0B2] outline-none transition-colors',
          'focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
          disabled && 'cursor-not-allowed bg-[#fafafa]',
        )}
      />
    </div>
  )
}

function LinkedInChipField({
  id,
  label,
  placeholder,
  chips,
  onChange,
}: {
  id: string
  label: string
  placeholder: string
  chips: string[]
  onChange: (chips: string[]) => void
}) {
  const [draft, setDraft] = useState('')

  function commitDraft() {
    const next = draft.trim()
    if (!next || chips.includes(next)) {
      setDraft('')
      return
    }
    onChange([...chips, next])
    setDraft('')
  }

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-[#6B6B80]">
        {label}
      </label>
      <div
        className={cn(
          'flex min-h-11 w-full flex-wrap items-center gap-1.5 rounded-md border border-[#ddd9e8] bg-white px-2 py-1.5',
          'focus-within:border-[#2D2061] focus-within:ring-2 focus-within:ring-[#2D2061]/10',
        )}
      >
        {chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex max-w-full items-center gap-1 rounded bg-[#4A90D9] px-2 py-0.5 text-xs font-medium text-white"
          >
            <span className="truncate">{chip}</span>
            <button
              type="button"
              aria-label={`Remove ${chip}`}
              onClick={() => onChange(chips.filter((c) => c !== chip))}
              className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-full text-white/90 hover:bg-white/20 hover:text-white"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={draft}
          placeholder={chips.length === 0 ? placeholder : placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              commitDraft()
            } else if (e.key === 'Backspace' && !draft && chips.length > 0) {
              onChange(chips.slice(0, -1))
            }
          }}
          onBlur={commitDraft}
          className="min-w-[6rem] flex-1 border-0 bg-transparent px-1 py-0.5 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2]"
        />
      </div>
    </div>
  )
}

function RsPlusFiltersContent({
  value,
  onChange,
  addLocationSuggestion,
  applyAutoDetectIndustry,
}: {
  value: CreateJobFormState
  onChange: (patch: Partial<CreateJobFormState>) => void
  addLocationSuggestion: (city: string) => void
  applyAutoDetectIndustry: () => void
}) {
  return (
    <>
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        <MultiSelect
          label="Industry (Choose up to 5)"
          maxSelections={5}
          options={INDUSTRY_OPTIONS}
          value={value.industries}
          onChange={(industries) => onChange({ industries })}
          placeholder="Search for an industry."
          helperText={
            <button
              type="button"
              onClick={applyAutoDetectIndustry}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#AEC8F5] bg-[#E8F1FF] px-2.5 py-1 text-xs font-medium text-[#2B5FBF] transition-colors hover:bg-[#dceaff]"
            >
              <Star
                className="size-3.5 fill-[#2B5FBF] text-[#2B5FBF]"
                aria-hidden="true"
              />
              Auto-detect: Design & Creative Services
            </button>
          }
        />

        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-medium text-[#2D2061]">
              Company (Choose up to 5)
            </span>
            <div className="flex items-center gap-4">
              <InlineCheckbox
                label="Current"
                checked={value.companyCurrent}
                onChange={(checked) => onChange({ companyCurrent: checked })}
              />
              <InlineCheckbox
                label="Past"
                checked={value.companyPast}
                onChange={(checked) => onChange({ companyPast: checked })}
              />
            </div>
          </div>
          <MultiSelect
            maxSelections={5}
            options={COMPANY_OPTIONS}
            value={value.companies}
            onChange={(companies) => onChange({ companies })}
            placeholder="Search for companies to include."
          />
        </div>

        <MultiSelect
          label="Exclude Company (Choose up to 5)"
          maxSelections={5}
          options={COMPANY_OPTIONS}
          value={value.excludeCompanies}
          onChange={(excludeCompanies) => onChange({ excludeCompanies })}
          placeholder="Search for companies to exclude."
        />

        <div className="flex min-w-0 flex-col gap-1.5">
          <MultiSelect
            label="Location (Choose up to 5)"
            maxSelections={5}
            options={LOCATION_OPTIONS}
            value={value.locations}
            onChange={(locations) => onChange({ locations })}
            placeholder="Search for a location."
          />
          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-[#8B8B9E]">
              AI suggests:
            </span>
            {AI_LOCATION_SUGGESTIONS.map((city) => {
              const selected = value.locations.includes(city)
              return (
                <button
                  key={city}
                  type="button"
                  disabled={selected || value.locations.length >= 5}
                  onClick={() => addLocationSuggestion(city)}
                  className={cn(
                    'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
                    selected
                      ? 'border-[#2D2061] bg-[#2D2061]/8 text-[#2D2061]'
                      : 'border-[#C9C3E8] bg-white text-[#2D2061] hover:bg-[#f5f3fb]',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                  )}
                >
                  + {city}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-[#ECEAF3] pt-5">
        <div className="flex flex-wrap items-center gap-3">
          <label
            htmlFor="rs-plus-candidates-count"
            className="text-xs font-medium text-[#2D2061]"
          >
            RS Plus Candidates Count{' '}
            <span className="font-normal text-[#8B8B9E]">
              (Please add value ≤ 100)
            </span>
          </label>
          <input
            id="rs-plus-candidates-count"
            type="number"
            min={0}
            max={100}
            value={value.rsPlusCandidatesCount}
            onChange={(e) =>
              onChange({
                rsPlusCandidatesCount: Math.min(
                  100,
                  Math.max(0, Number(e.target.value) || 0),
                ),
              })
            }
            className="h-9 w-14 rounded-md border border-[#ddd9e8] bg-white px-2 text-center text-sm font-medium text-[#2D2061] outline-none transition-colors focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
        </div>

        <div className="mt-3 inline-flex items-center gap-1.5">
          <p className="text-xs font-semibold text-[#E53935]">
            Total Available Credits: 28
          </p>
          <Tooltip content={CREDITS_INFO} side="top" align="start" maxWidth={280}>
            <button
              type="button"
              aria-label="Credits information"
              className="inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-[#E53935] text-[10px] font-bold leading-none text-[#E53935] outline-none transition-colors hover:bg-[#fdecec] focus-visible:ring-2 focus-visible:ring-[#E53935]/25"
            >
              <span aria-hidden="true" className="translate-y-px">
                i
              </span>
            </button>
          </Tooltip>
        </div>
      </div>
    </>
  )
}

function InlineCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-1.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-3.5 rounded border-line accent-[#2D2061]"
      />
      <span className="text-xs font-medium text-[#2D2061]">{label}</span>
    </label>
  )
}
