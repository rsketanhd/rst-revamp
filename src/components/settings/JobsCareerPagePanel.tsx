import { useRef, useState, type ReactNode } from 'react'
import {
  CircleHelp,
  Copy,
  ExternalLink,
  Eye,
  Lock,
  Monitor,
  Plus,
  Smartphone,
} from 'lucide-react'
import {
  Button,
  Checkbox,
  SegmentedControl,
  Select,
  StatusPillBadge,
  Switch,
  toast,
  Tooltip,
  type StatusPillOption,
} from '../ui'
import { cn } from '../../lib/cn'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'
import { SettingsUnderlineTabs } from './SettingsUnderlineTabs'

type CareerTab =
  | 'page-link'
  | 'header'
  | 'hero'
  | 'search'
  | 'listing'
  | 'appearance'
  | 'talent'

type HostMode = 'hosted' | 'embed'
type PreviewMode = 'desktop' | 'mobile'

const CAREER_TABS: Array<{ value: CareerTab; label: string }> = [
  { value: 'page-link', label: 'Page Link' },
  { value: 'header', label: 'Header' },
  { value: 'hero', label: 'Hero Banner' },
  { value: 'search', label: 'Search & Filters' },
  { value: 'listing', label: 'Job Listing' },
  { value: 'appearance', label: 'Appearance' },
  { value: 'talent', label: 'Talent Community' },
]

const HOSTED_BADGE: StatusPillOption = {
  value: 'hosted',
  label: 'Hosted by Recruitment Smart',
  className: 'bg-[#E6F6EC] text-[#15803D]',
  dotClassName: 'bg-[#15803D]',
}

const SAVED_BADGE: StatusPillOption = {
  value: 'saved',
  label: 'Saved',
  className: 'bg-[#E6F6EC] text-[#15803D]',
  dotClassName: 'bg-[#15803D]',
}

const CAREERS_URL = 'https://rst10-test.sniperai.com/careers'
const ACCENT = '#E83E6A'

const PREVIEW_JOBS = [
  {
    id: 'JOB-1042',
    title: 'Senior Frontend Engineer',
    experience: '5–8 yrs',
    location: 'London, UK',
    date: '2d ago',
    selected: true,
  },
  {
    id: 'JOB-1038',
    title: 'Product Designer',
    experience: '3–5 yrs',
    location: 'Remote',
    date: '5d ago',
    selected: false,
  },
  {
    id: 'JOB-1031',
    title: 'Data Analyst',
    experience: '2–4 yrs',
    location: 'Manchester',
    date: '1w ago',
    selected: false,
  },
]

function InfoTip({ content }: { content: string }) {
  return (
    <Tooltip content={content}>
      <span className="inline-flex text-[#8B8B9E] hover:text-[#2D2061]">
        <CircleHelp className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
        <span className="sr-only">{content}</span>
      </span>
    </Tooltip>
  )
}

function SectionTitle({
  title,
  tip,
  description,
  trailing,
}: {
  title: string
  tip?: string
  description?: string
  trailing?: ReactNode
}) {
  return (
    <div className="mb-3.5 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-sm font-bold text-[#2D2061]">{title}</h3>
          {tip ? <InfoTip content={tip} /> : null}
        </div>
        {description ? (
          <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-[#8B8B9E]">
            {description}
          </p>
        ) : null}
      </div>
      {trailing}
    </div>
  )
}

function HostOption({
  title,
  description,
  selected,
  onSelect,
  children,
}: {
  title: string
  description: string
  selected: boolean
  onSelect: () => void
  children?: ReactNode
}) {
  return (
    <div
      className={cn(
        'rounded-[8px] border px-4 py-3.5 transition-colors',
        selected
          ? 'border-[#2D2061] bg-white'
          : 'border-[#E4E1EE] bg-white hover:border-[#2D2061]/40',
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-start gap-3 text-left"
      >
        <span
          className={cn(
            'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border',
            selected
              ? 'border-[#2D2061] bg-[#2D2061]'
              : 'border-[#C8C5D6] bg-white',
          )}
          aria-hidden="true"
        >
          {selected ? (
            <span className="size-1.5 rounded-full bg-white" />
          ) : null}
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-[#2D2061]">
            {title}
          </span>
          <span className="mt-0.5 block text-xs leading-relaxed text-[#8B8B9E]">
            {description}
          </span>
        </span>
      </button>
      {selected && children ? <div className="mt-3 pl-7">{children}</div> : null}
    </div>
  )
}

function CareersLivePreview({ mode }: { mode: PreviewMode }) {
  const isMobile = mode === 'mobile'

  return (
    <div
      className={cn(
        'overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-[#F3F2F7]',
        isMobile && 'mx-auto max-w-[22rem]',
      )}
    >
      <div className="flex items-center gap-2 border-b border-[#E4E1EE] bg-white px-3 py-2">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#F5A5A5]" />
          <span className="size-2.5 rounded-full bg-[#F5D78E]" />
          <span className="size-2.5 rounded-full bg-[#A8DDB5]" />
        </div>
        <div className="min-w-0 flex-1 truncate rounded-md bg-[#F5F4FA] px-2.5 py-1 text-[11px] text-[#6B6B80]">
          {CAREERS_URL}
        </div>
      </div>

      <div className="max-h-[34rem] overflow-y-auto bg-[#F7F6FA]">
        <header className="flex items-center justify-between gap-3 bg-white px-4 py-3">
          <span className="text-sm font-bold text-[#2D2061]">
            Recruitment Smart
          </span>
          <button
            type="button"
            className="rounded-md px-3 py-1.5 text-[11px] font-semibold text-white"
            style={{ backgroundColor: ACCENT }}
          >
            Join Our Talent Community
          </button>
        </header>

        <section className="bg-[#2D2061] px-5 py-8 text-white">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/70">
            We&apos;re hiring
          </p>
          <h4 className="mt-1 text-lg font-bold leading-snug sm:text-xl">
            Build your career with us
          </h4>
          <p className="mt-1.5 max-w-md text-xs text-white/80">
            Explore open roles and grow with a team that values craft and
            curiosity.
          </p>
          <button
            type="button"
            className="mt-4 rounded-md px-3.5 py-2 text-xs font-semibold text-white"
            style={{ backgroundColor: ACCENT }}
          >
            Upload your Resume
          </button>
        </section>

        <div className="space-y-2 bg-[#ECEAF3] px-3 py-3">
          <div className="flex flex-wrap gap-2 rounded-lg bg-white p-2.5 shadow-sm">
            <span className="h-8 min-w-[7rem] flex-1 rounded-md border border-[#E4E1EE] bg-[#FAFAFC] px-2 text-[11px] leading-8 text-[#8B8B9E]">
              Job title or keyword
            </span>
            <span className="h-8 min-w-[5rem] rounded-md border border-[#E4E1EE] bg-[#FAFAFC] px-2 text-[11px] leading-8 text-[#8B8B9E]">
              Location
            </span>
            <span className="inline-flex h-8 items-center rounded-md bg-[#2D2061] px-3 text-[11px] font-semibold text-white">
              Search Jobs
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Job Type', 'Work Mode', 'Location', 'All Filters'].map(
              (filter) => (
                <span
                  key={filter}
                  className="rounded-full border border-[#D5D2E2] bg-white px-2.5 py-1 text-[10px] font-medium text-[#5C5878]"
                >
                  {filter}
                </span>
              ),
            )}
          </div>
        </div>

        <div
          className={cn(
            'grid gap-3 p-3',
            isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]',
          )}
        >
          <ul className="space-y-2">
            {PREVIEW_JOBS.map((job) => (
              <li
                key={job.id}
                className={cn(
                  'rounded-lg border px-3 py-2.5',
                  job.selected
                    ? 'border-[#2D2061] bg-[#2D2061] text-white'
                    : 'border-[#E4E1EE] bg-white text-[#2A2740]',
                )}
              >
                <p className="text-xs font-semibold">{job.title}</p>
                <p
                  className={cn(
                    'mt-1 text-[10px]',
                    job.selected ? 'text-white/75' : 'text-[#8B8B9E]',
                  )}
                >
                  {job.id} · {job.experience} · {job.location}
                </p>
                <p
                  className={cn(
                    'mt-0.5 text-[10px]',
                    job.selected ? 'text-white/60' : 'text-[#A0A0B2]',
                  )}
                >
                  {job.date}
                </p>
              </li>
            ))}
          </ul>

          {!isMobile ? (
            <div className="rounded-lg border border-[#E4E1EE] bg-white p-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="text-sm font-bold text-[#2D2061]">
                    Senior Frontend Engineer
                  </h5>
                  <p className="mt-0.5 text-[11px] text-[#8B8B9E]">
                    JOB-1042 · London, UK · Full-time
                  </p>
                </div>
                <button
                  type="button"
                  className="shrink-0 rounded-md bg-[#2D2061] px-2.5 py-1.5 text-[11px] font-semibold text-white"
                >
                  Apply Now
                </button>
              </div>
              <div className="mt-3 space-y-2 text-[11px] leading-relaxed text-[#4A4A5A]">
                <p>
                  You will own product-facing UI, partner with design, and raise
                  the bar for frontend quality.
                </p>
                <p className="font-semibold text-[#2D2061]">
                  Key Responsibilities
                </p>
                <ul className="list-disc space-y-0.5 pl-4">
                  <li>Ship accessible React experiences</li>
                  <li>Collaborate across product and design</li>
                  <li>Improve performance and reliability</li>
                </ul>
                <p className="font-semibold text-[#2D2061]">Requirements</p>
                <ul className="list-disc space-y-0.5 pl-4">
                  <li>5+ years frontend experience</li>
                  <li>Strong TypeScript and React skills</li>
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        <footer className="border-t border-[#E4E1EE] bg-white px-4 py-4">
          <div className="rounded-lg bg-[#F5F3FB] px-3 py-3 text-center">
            <p className="text-xs font-semibold text-[#2D2061]">
              Join our talent community
            </p>
            <p className="mt-0.5 text-[10px] text-[#8B8B9E]">
              Get updates when new roles open.
            </p>
            <button
              type="button"
              className="mt-2 rounded-md px-3 py-1.5 text-[11px] font-semibold text-white"
              style={{ backgroundColor: ACCENT }}
            >
              Join now
            </button>
          </div>
          <p className="mt-3 text-center text-[10px] text-[#A0A0B2]">
            Powered by Recruitment Smart
          </p>
        </footer>
      </div>
    </div>
  )
}

function LivePreviewPanel({
  previewMode,
  onPreviewModeChange,
}: {
  previewMode: PreviewMode
  onPreviewModeChange: (mode: PreviewMode) => void
}) {
  return (
    <aside className="rounded-[8px] border border-[#E4E1EE] bg-white p-4 sm:p-5 xl:sticky xl:top-4 xl:self-start">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-bold text-[#2D2061]">Live Preview</h3>
          <StatusPillBadge option={SAVED_BADGE} />
        </div>
        <SegmentedControl
          aria-label="Preview device"
          value={previewMode}
          onChange={onPreviewModeChange}
          options={[
            { value: 'desktop', label: 'Desktop' },
            { value: 'mobile', label: 'Mobile' },
          ]}
        />
      </div>
      <div className="mb-2 flex items-center gap-1.5 text-[11px] text-[#8B8B9E]">
        {previewMode === 'desktop' ? (
          <Monitor className="size-3.5" strokeWidth={1.75} />
        ) : (
          <Smartphone className="size-3.5" strokeWidth={1.75} />
        )}
        Preview updates as you change settings.
      </div>
      <CareersLivePreview mode={previewMode} />
    </aside>
  )
}

function PageLinkTab() {
  const [hostMode, setHostMode] = useState<HostMode>('hosted')
  const [published, setPublished] = useState(true)

  function handleCopy() {
    void navigator.clipboard?.writeText(CAREERS_URL)
    toast.success('Careers page link copied.', { title: 'Copied' })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[8px] bg-[#F8F9FB] px-5 py-4 sm:px-6 sm:py-5">
        <SectionTitle
          title="Where candidates find your jobs"
          tip="Choose whether candidates use the Recruitment Smart hosted careers page or an embed on your site."
          description="Pick a hosted page or embed careers into your own website."
        />
        <div className="flex flex-col gap-3">
          <HostOption
            title="Hosted careers page"
            description="A ready-to-use careers site on a Recruitment Smart link."
            selected={hostMode === 'hosted'}
            onSelect={() => setHostMode('hosted')}
          >
            <div className="flex items-center gap-2 rounded-lg border border-[#D5D2E2] bg-white px-3 py-2">
              <input
                readOnly
                value={CAREERS_URL}
                aria-label="Careers page URL"
                className="min-w-0 flex-1 bg-transparent text-sm text-[#2D2061] outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex size-8 items-center justify-center rounded-md text-[#6B6B80] hover:bg-[#F5F4FA] hover:text-[#2D2061]"
                aria-label="Copy careers page link"
              >
                <Copy className="size-4" strokeWidth={1.75} />
              </button>
              <a
                href={CAREERS_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex size-8 items-center justify-center rounded-md text-[#6B6B80] hover:bg-[#F5F4FA] hover:text-[#2D2061]"
                aria-label="Open careers page"
              >
                <ExternalLink className="size-4" strokeWidth={1.75} />
              </a>
            </div>
          </HostOption>
          <HostOption
            title="Integrate into your website"
            description="Embed the careers experience on your own domain."
            selected={hostMode === 'embed'}
            onSelect={() => setHostMode('embed')}
          >
            <p className="text-xs text-[#8B8B9E]">
              Embed snippet and domain mapping will appear here once
              integration is enabled.
            </p>
          </HostOption>
        </div>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] px-5 py-4 sm:px-6 sm:py-5">
        <SectionTitle
          title="Publishing"
          tip="When off, the careers page is hidden from candidates."
        />
        <div className="flex items-center justify-between gap-4 rounded-[8px] border border-[#E4E1EE] bg-white px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#2D2061]">
              Publish careers page
            </p>
            <p className="mt-0.5 text-xs text-[#8B8B9E]">
              Make the page visible to candidates on the public link.
            </p>
          </div>
          <Switch
            checked={published}
            onCheckedChange={setPublished}
            aria-label="Publish careers page"
            className="!gap-0"
          />
        </div>
      </div>

      <div className="rounded-[8px] bg-[#F8F9FB] px-5 py-4 sm:px-6 sm:py-5">
        <SectionTitle
          title="Activity from your careers page"
          description="Applications and visits from this careers page will show here."
        />
        <div className="rounded-[8px] border border-dashed border-[#D5D2E2] bg-white px-4 py-8 text-center">
          <p className="text-sm font-medium text-[#6B6B80]">
            No activity yet
          </p>
          <p className="mt-1 text-xs text-[#8B8B9E]">
            Publish your page and share the link to start seeing visits and
            applications.
          </p>
        </div>
      </div>
    </div>
  )
}

function PlaceholderTab({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <SettingsBlock title={title} description={description}>
      {children ?? (
        <p className="text-sm text-[#6B6B80]">
          Configure {title.toLowerCase()} options here. Details follow the same
          careers settings pattern as Page link.
        </p>
      )}
    </SettingsBlock>
  )
}

const COMPANY_NAME_MAX = 40
const LOGO_HEIGHT_MIN = 20
const LOGO_HEIGHT_MAX = 80

function SettingRow({
  label,
  tip,
  description,
  children,
  className,
}: {
  label: string
  tip?: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 border-b border-[#ECEAF3] py-3.5 last:border-b-0 last:pb-0 first:pt-0',
        className,
      )}
    >
      <div className="min-w-0 max-w-md">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-[#2D2061]">{label}</p>
          {tip ? <InfoTip content={tip} /> : null}
        </div>
        {description ? (
          <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
            {description}
          </p>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 sm:max-w-md">
        {children}
      </div>
    </div>
  )
}

function CountedInput({
  value,
  onChange,
  maxLength,
  multiline = false,
  rows = 3,
  placeholder,
  'aria-label': ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  maxLength: number
  multiline?: boolean
  rows?: number
  placeholder?: string
  'aria-label'?: string
}) {
  const count = value.length
  const sharedClass = cn(
    'w-full rounded-lg border border-[#D5D2E2] bg-white text-sm text-[#2D2061]',
    'outline-none placeholder:text-[#A0A0B2]',
    'focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
  )

  return (
    <div className="relative w-full max-w-md">
      {multiline ? (
        <textarea
          value={value}
          maxLength={maxLength}
          rows={rows}
          placeholder={placeholder}
          aria-label={ariaLabel}
          onChange={(event) => onChange(event.target.value)}
          className={cn(sharedClass, 'resize-y px-3 py-2.5 pb-7')}
        />
      ) : (
        <input
          type="text"
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-label={ariaLabel}
          onChange={(event) => onChange(event.target.value)}
          className={cn(sharedClass, 'h-10 py-2 pl-3 pr-16')}
        />
      )}
      <span
        className={cn(
          'pointer-events-none absolute right-3 text-[11px] tabular-nums text-[#8B8B9E]',
          multiline ? 'bottom-2.5' : 'top-1/2 -translate-y-1/2',
        )}
      >
        {count} / {maxLength}
      </span>
    </div>
  )
}

function HeroBannerTab() {
  const bgInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('Find Your Perfect Job with AI Intellige')
  const [subtitle, setSubtitle] = useState('')
  const [alignment, setAlignment] = useState<'left' | 'centre'>('centre')
  const [bannerHeight, setBannerHeight] = useState<
    'compact' | 'standard' | 'tall'
  >('standard')
  const [bgImageName, setBgImageName] = useState('')
  const [overlayColour, setOverlayColour] = useState('#25225E')
  const [overlayStrength, setOverlayStrength] = useState(75)
  const [aiResumeOn, setAiResumeOn] = useState(true)
  const [aiHeading, setAiHeading] = useState('AI Resume Analysis')
  const [aiDescription, setAiDescription] = useState(
    'Upload your resume and our AI will analyse your skills and experience, then suggest the best matching roles for you.',
  )
  const [aiButtonLabel, setAiButtonLabel] = useState('Upload your Resume')

  return (
    <div className="flex flex-col gap-4">
      <SettingsBlock
        title="Header content"
        description="The first thing candidates read."
      >
        <SettingRow
          label="Header title"
          tip="Main headline shown in the careers hero banner."
        >
          <CountedInput
            value={title}
            onChange={setTitle}
            maxLength={50}
            aria-label="Header title"
          />
        </SettingRow>

        <SettingRow
          label="Subtitle"
          tip="Supporting line under the hero headline."
        >
          <CountedInput
            value={subtitle}
            onChange={setSubtitle}
            maxLength={140}
            multiline
            rows={3}
            placeholder="Add a short supporting message"
            aria-label="Subtitle"
          />
        </SettingRow>

        <SettingRow label="Text alignment">
          <SegmentedControl
            aria-label="Text alignment"
            value={alignment}
            onChange={setAlignment}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'centre', label: 'Centre' },
            ]}
          />
        </SettingRow>

        <SettingRow
          label="Banner height"
          tip="Controls how tall the hero banner appears on desktop."
        >
          <SegmentedControl
            aria-label="Banner height"
            value={bannerHeight}
            onChange={setBannerHeight}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'standard', label: 'Standard' },
              { value: 'tall', label: 'Tall' },
            ]}
          />
        </SettingRow>
      </SettingsBlock>

      <SettingsBlock title="Background">
        <SettingRow
          label="Background image"
          tip="Full-width image behind the hero text and overlay."
          description="Size: width 100% and height 400px"
        >
          <div className="flex w-full max-w-xs flex-col items-end gap-1.5">
            <input
              ref={bgInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) setBgImageName(file.name)
              }}
            />
            <button
              type="button"
              onClick={() => bgInputRef.current?.click()}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-dashed border-[#C8C5D6] bg-white px-4 text-sm font-semibold text-[#2D2061] transition-colors hover:border-[#2D2061] hover:bg-[#F7F6FA]"
            >
              <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
              Upload
            </button>
            <p className="text-right text-[11px] text-[#8B8B9E]">
              {bgImageName
                ? bgImageName
                : 'No file chosen — using the default background'}
            </p>
          </div>
        </SettingRow>

        <SettingRow
          label="Overlay colour"
          tip="Colour layered over the background image for text contrast."
        >
          <label className="inline-flex items-center gap-2">
            <span
              className="size-8 shrink-0 overflow-hidden rounded-md border border-[#D5D2E2]"
              style={{ backgroundColor: overlayColour }}
            >
              <input
                type="color"
                value={overlayColour}
                onChange={(event) => setOverlayColour(event.target.value)}
                className="size-full cursor-pointer opacity-0"
                aria-label="Overlay colour picker"
              />
            </span>
            <input
              type="text"
              value={overlayColour}
              onChange={(event) => setOverlayColour(event.target.value)}
              className="h-10 w-28 rounded-lg border border-[#D5D2E2] bg-white px-3 text-sm uppercase text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
              aria-label="Overlay colour hex"
            />
          </label>
        </SettingRow>

        <SettingRow
          label="Overlay strength"
          tip="How strongly the overlay colour covers the background image."
        >
          <div className="flex w-full max-w-xs items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              value={overlayStrength}
              onChange={(event) =>
                setOverlayStrength(Number(event.target.value))
              }
              aria-label="Overlay strength"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-[#2D2061]"
              style={{
                background: `linear-gradient(to right, #2D2061 0%, #2D2061 ${overlayStrength}%, #E4E1EE ${overlayStrength}%, #E4E1EE 100%)`,
              }}
            />
            <span className="w-10 shrink-0 text-right text-sm font-medium tabular-nums text-[#2D2061]">
              {overlayStrength}%
            </span>
          </div>
        </SettingRow>
      </SettingsBlock>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-[#1F1F2E]">
                AI resume section
              </h3>
              <span className="text-xs text-[#8B8B9E]">
                Shown inside the banner.
              </span>
            </div>
          </div>
          <Switch
            checked={aiResumeOn}
            onCheckedChange={setAiResumeOn}
            aria-label="AI resume section"
            className="!gap-0"
          />
        </div>

        {aiResumeOn ? (
          <div className="flex flex-col gap-1">
            <div
              role="status"
              className="mb-3 rounded-lg border border-[#C9D8F5] bg-[#EAF1FE] px-3.5 py-3 text-xs leading-relaxed text-[#2F5AA8]"
            >
              On. Candidates upload a resume from the banner; it starts the
              application to the newest job (or the job they&apos;re viewing)
              with the form pre-filled from the CV. Match scores and
              recommendations show in the candidate portal after signup.
            </div>

            <SettingRow label="Heading">
              <CountedInput
                value={aiHeading}
                onChange={setAiHeading}
                maxLength={40}
                aria-label="AI resume heading"
              />
            </SettingRow>

            <SettingRow label="Description">
              <CountedInput
                value={aiDescription}
                onChange={setAiDescription}
                maxLength={140}
                multiline
                rows={3}
                aria-label="AI resume description"
              />
            </SettingRow>

            <SettingRow label="Button label">
              <CountedInput
                value={aiButtonLabel}
                onChange={setAiButtonLabel}
                maxLength={24}
                aria-label="AI resume button label"
              />
            </SettingRow>
          </div>
        ) : (
          <p className="text-sm text-[#6B6B80]">
            Turn on to show the AI resume upload block inside the hero banner.
          </p>
        )}
      </div>
    </div>
  )
}

type FilterToggle = {
  id: string
  label: string
  tip: string
  enabled: boolean
}

const DEFAULT_FILTERS: FilterToggle[] = [
  {
    id: 'job-type',
    label: 'Job Type',
    tip: 'Full-time, part-time, contract, and similar employment types.',
    enabled: true,
  },
  {
    id: 'work-mode',
    label: 'Work Mode',
    tip: 'On-site, hybrid, and remote options.',
    enabled: true,
  },
  {
    id: 'location',
    label: 'Location',
    tip: 'City, region, or country filter for open roles.',
    enabled: true,
  },
  {
    id: 'category',
    label: 'Category',
    tip: 'Job category from your Categories settings.',
    enabled: true,
  },
  {
    id: 'experience',
    label: 'Experience',
    tip: 'Years of experience or seniority band.',
    enabled: false,
  },
]

type ListingLayout = 'split' | 'grid' | 'compact'
type JobsPerPage = '10' | '20' | '30'

type CardDetailOption = {
  id: string
  label: string
  tip?: string
  checked: boolean
}

const DEFAULT_CARD_DETAILS: CardDetailOption[] = [
  {
    id: 'job-type-tags',
    label: 'Job type tags',
    tip: 'Full-time, part-time, contract, and similar tags on each job card.',
    checked: true,
  },
  {
    id: 'client-name',
    label: 'Client name',
    tip: 'Shows the client or hiring company name on the card.',
    checked: true,
  },
  {
    id: 'experience',
    label: 'Experience range',
    checked: true,
  },
  {
    id: 'location',
    label: 'Location',
    checked: true,
  },
  {
    id: 'posted-date',
    label: 'Posted date',
    checked: true,
  },
]

function LayoutIcon({ layout }: { layout: ListingLayout }) {
  switch (layout) {
    case 'split':
      return (
        <svg
          viewBox="0 0 56 40"
          className="h-10 w-14 text-[#2D2061]"
          aria-hidden="true"
          fill="none"
        >
          <rect
            x="2"
            y="2"
            width="20"
            height="36"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect
            x="6"
            y="7"
            width="12"
            height="3"
            rx="1"
            fill="currentColor"
            opacity="0.35"
          />
          <rect
            x="6"
            y="13"
            width="12"
            height="3"
            rx="1"
            fill="currentColor"
            opacity="0.35"
          />
          <rect
            x="6"
            y="19"
            width="12"
            height="3"
            rx="1"
            fill="currentColor"
            opacity="0.35"
          />
          <rect
            x="26"
            y="2"
            width="28"
            height="36"
            rx="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <rect
            x="30"
            y="8"
            width="20"
            height="4"
            rx="1"
            fill="currentColor"
            opacity="0.4"
          />
          <rect
            x="30"
            y="16"
            width="16"
            height="2.5"
            rx="1"
            fill="currentColor"
            opacity="0.25"
          />
          <rect
            x="30"
            y="22"
            width="18"
            height="2.5"
            rx="1"
            fill="currentColor"
            opacity="0.25"
          />
        </svg>
      )
    case 'grid':
      return (
        <svg
          viewBox="0 0 56 40"
          className="h-10 w-14 text-[#2D2061]"
          aria-hidden="true"
          fill="none"
        >
          {[0, 1, 2].map((row) =>
            [0, 1].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={4 + col * 26}
                y={3 + row * 12}
                width="22"
                height="9"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            )),
          )}
        </svg>
      )
    case 'compact':
      return (
        <svg
          viewBox="0 0 56 40"
          className="h-10 w-14 text-[#2D2061]"
          aria-hidden="true"
          fill="none"
        >
          {[0, 1, 2, 3].map((row) => (
            <rect
              key={row}
              x="4"
              y={4 + row * 9}
              width="48"
              height="6"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          ))}
        </svg>
      )
    default: {
      const _exhaustive: never = layout
      return _exhaustive
    }
  }
}

function LayoutOptionCard({
  layout,
  label,
  selected,
  onSelect,
}: {
  layout: ListingLayout
  label: string
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        'flex flex-col items-center gap-2.5 rounded-[8px] border-2 bg-white px-3 py-4 transition-colors',
        selected
          ? 'border-[#2D2061]'
          : 'border-[#E4E1EE] hover:border-[#2D2061]/40',
      )}
    >
      <LayoutIcon layout={layout} />
      <span className="text-sm font-semibold text-[#2D2061]">{label}</span>
    </button>
  )
}

function JobListingTab() {
  const [layout, setLayout] = useState<ListingLayout>('split')
  const [defaultSort, setDefaultSort] = useState('latest')
  const [jobsPerPage, setJobsPerPage] = useState<JobsPerPage>('10')
  const [totalJobCount, setTotalJobCount] = useState(true)
  const [sortRefreshButtons, setSortRefreshButtons] = useState(true)
  const [cardDetails, setCardDetails] = useState(DEFAULT_CARD_DETAILS)
  const [applyLabel, setApplyLabel] = useState('Apply Now')
  const [shareJobOn, setShareJobOn] = useState(false)
  const [fontFamily, setFontFamily] = useState('inherit')
  const [noResultsMessage, setNoResultsMessage] = useState(
    'No jobs match your search yet. Try different keywords or clear the filters.',
  )

  function patchCardDetail(id: string, checked: boolean) {
    setCardDetails((current) =>
      current.map((item) => (item.id === id ? { ...item, checked } : item)),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <SettingsBlock
        title="Layout"
        description="How jobs are arranged on the page."
      >
        <div
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
          role="radiogroup"
          aria-label="Job listing layout"
        >
          <LayoutOptionCard
            layout="split"
            label="Split view"
            selected={layout === 'split'}
            onSelect={() => setLayout('split')}
          />
          <LayoutOptionCard
            layout="grid"
            label="Card grid"
            selected={layout === 'grid'}
            onSelect={() => setLayout('grid')}
          />
          <LayoutOptionCard
            layout="compact"
            label="Compact list"
            selected={layout === 'compact'}
            onSelect={() => setLayout('compact')}
          />
        </div>

        <Tooltip content="Split view suits browsing with job details open. Card grid works well for many roles. Compact list fits high-volume listings.">
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#6B6B80] transition-colors hover:text-[#2D2061]"
          >
            <CircleHelp
              className="size-3.5"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            Which layout should I choose?
          </button>
        </Tooltip>

        <div className="mt-4 border-t border-[#ECEAF3] pt-1">
          <SettingRow
            label="Default sort"
            tip="Initial sort order when candidates open the careers page."
          >
            <div className="w-full max-w-xs">
              <Select
                id="listing-default-sort"
                label=""
                options={[
                  { value: 'latest', label: 'Latest' },
                  { value: 'oldest', label: 'Oldest' },
                  { value: 'title-asc', label: 'Job title A–Z' },
                  { value: 'title-desc', label: 'Job title Z–A' },
                ]}
                value={defaultSort}
                onChange={(event) => setDefaultSort(event.target.value)}
                aria-label="Default sort"
              />
            </div>
          </SettingRow>

          <SettingRow
            label="Jobs per page"
            tip="How many jobs load before candidates paginate or load more."
          >
            <SegmentedControl
              aria-label="Jobs per page"
              value={jobsPerPage}
              onChange={setJobsPerPage}
              options={[
                { value: '10', label: '10' },
                { value: '20', label: '20' },
                { value: '30', label: '30' },
              ]}
            />
          </SettingRow>

          <SettingRow
            label="Total job count"
            tip="Shows the total number of open roles above the listing."
          >
            <Switch
              checked={totalJobCount}
              onCheckedChange={setTotalJobCount}
              aria-label="Total job count"
              className="!gap-0"
            />
          </SettingRow>

          <SettingRow
            label="Sort & refresh buttons"
            tip="Lets candidates change sort order and refresh the job list."
          >
            <Switch
              checked={sortRefreshButtons}
              onCheckedChange={setSortRefreshButtons}
              aria-label="Sort and refresh buttons"
              className="!gap-0"
            />
          </SettingRow>
        </div>
      </SettingsBlock>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <SectionTitle
          title="Job card details"
          tip="Choose which fields appear on each job card in the listing."
        />
        <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
          {cardDetails.map((detail) => (
            <Checkbox
              key={detail.id}
              id={`card-detail-${detail.id}`}
              checked={detail.checked}
              onChange={(event) =>
                patchCardDetail(detail.id, event.target.checked)
              }
              label={
                <span className="inline-flex items-center gap-1.5">
                  {detail.label}
                  {detail.tip ? <InfoTip content={detail.tip} /> : null}
                </span>
              }
            />
          ))}
        </div>
      </div>

      <SettingsBlock
        title="Job detail"
        description="What candidates see when they open a job."
      >
        <SettingRow
          label="Apply button label"
          tip="Label on the primary apply action in job detail."
        >
          <CountedInput
            value={applyLabel}
            onChange={setApplyLabel}
            maxLength={20}
            aria-label="Apply button label"
          />
        </SettingRow>

        <SettingRow
          label="Share job button"
          tip="Lets candidates share the job link from the detail view."
        >
          <Switch
            checked={shareJobOn}
            onCheckedChange={setShareJobOn}
            aria-label="Share job button"
            className="!gap-0"
          />
        </SettingRow>

        <SettingRow
          label="Job description font family"
          tip="Font used for the job description body text."
        >
          <div className="w-full max-w-xs">
            <Select
              id="listing-job-font"
              label=""
              options={[
                { value: 'inherit', label: 'Inherit page font' },
                { value: 'system', label: 'System UI' },
                { value: 'serif', label: 'Serif' },
                { value: 'mono', label: 'Monospace' },
              ]}
              value={fontFamily}
              onChange={(event) => setFontFamily(event.target.value)}
              aria-label="Job description font family"
            />
          </div>
        </SettingRow>

        <SettingRow
          label="No results message"
          tip="Shown when search or filters return no matching jobs."
        >
          <CountedInput
            value={noResultsMessage}
            onChange={setNoResultsMessage}
            maxLength={120}
            multiline
            rows={3}
            aria-label="No results message"
          />
        </SettingRow>
      </SettingsBlock>
    </div>
  )
}

function SearchFiltersTab() {
  const [keywordSearchOn, setKeywordSearchOn] = useState(true)
  const [keywordPlaceholder, setKeywordPlaceholder] = useState(
    'Job title or keyword',
  )
  const [locationSearchOn, setLocationSearchOn] = useState(true)
  const [locationPlaceholder, setLocationPlaceholder] = useState('Location')
  const [filtersOn, setFiltersOn] = useState(true)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [showAllFilters, setShowAllFilters] = useState(true)
  const [showResultCount, setShowResultCount] = useState(true)
  const [defaultSort, setDefaultSort] = useState('newest')

  function patchFilter(id: string, enabled: boolean) {
    setFilters((current) =>
      current.map((item) => (item.id === id ? { ...item, enabled } : item)),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <SettingsBlock
        title="Search Bar"
        description="Keyword and location fields at the top of the careers jobs list."
      >
        <SettingRow
          label="Keyword search"
          tip="Lets candidates search by job title or keyword."
        >
          <Switch
            checked={keywordSearchOn}
            onCheckedChange={setKeywordSearchOn}
            aria-label="Keyword search"
            className="!gap-0"
          />
        </SettingRow>

        <SettingRow
          label="Keyword placeholder"
          tip="Hint text inside the keyword search field."
        >
          <CountedInput
            value={keywordPlaceholder}
            onChange={setKeywordPlaceholder}
            maxLength={40}
            aria-label="Keyword placeholder"
          />
        </SettingRow>

        <SettingRow
          label="Location search"
          tip="Separate field for searching by city or region."
        >
          <Switch
            checked={locationSearchOn}
            onCheckedChange={setLocationSearchOn}
            aria-label="Location search"
            className="!gap-0"
          />
        </SettingRow>

        <SettingRow
          label="Location placeholder"
          tip="Hint text inside the location search field."
        >
          <CountedInput
            value={locationPlaceholder}
            onChange={setLocationPlaceholder}
            maxLength={40}
            aria-label="Location placeholder"
          />
        </SettingRow>
      </SettingsBlock>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-[#1F1F2E]">Filters</h3>
              <InfoTip content="Filter chips shown under the search bar on the careers page." />
            </div>
            <p className="mt-0.5 text-xs text-[#8B8B9E]">
              Choose which filters candidates can use to narrow open roles.
            </p>
          </div>
          <Switch
            checked={filtersOn}
            onCheckedChange={setFiltersOn}
            aria-label="Filters"
            className="!gap-0"
          />
        </div>

        <div
          className={cn(
            'flex flex-col',
            !filtersOn && 'pointer-events-none opacity-50',
          )}
          aria-disabled={!filtersOn}
        >
          {filters.map((filter) => (
            <SettingRow
              key={filter.id}
              label={filter.label}
              tip={filter.tip}
            >
              <Switch
                checked={filter.enabled}
                onCheckedChange={(enabled) => patchFilter(filter.id, enabled)}
                aria-label={filter.label}
                className="!gap-0"
              />
            </SettingRow>
          ))}

          <SettingRow
            label="All Filters"
            tip="Opens an expanded panel with every available filter."
            description="Shows an All Filters control beside the filter chips."
          >
            <Switch
              checked={showAllFilters}
              onCheckedChange={setShowAllFilters}
              aria-label="All Filters"
              className="!gap-0"
            />
          </SettingRow>
        </div>
      </div>

      <SettingsBlock
        title="Results Behaviour"
        description="How search results appear after candidates apply filters."
      >
        <SettingRow
          label="Show result count"
          tip="Displays how many jobs match the current search and filters."
        >
          <Switch
            checked={showResultCount}
            onCheckedChange={setShowResultCount}
            aria-label="Show result count"
            className="!gap-0"
          />
        </SettingRow>

        <SettingRow
          label="Default sort"
          tip="Initial sort order when candidates open the careers page."
        >
          <div className="w-full max-w-xs">
            <Select
              id="careers-default-sort"
              label=""
              options={[
                { value: 'newest', label: 'Newest first' },
                { value: 'oldest', label: 'Oldest first' },
                { value: 'title-asc', label: 'Job title A–Z' },
                { value: 'title-desc', label: 'Job title Z–A' },
              ]}
              value={defaultSort}
              onChange={(event) => setDefaultSort(event.target.value)}
              aria-label="Default sort"
            />
          </div>
        </SettingRow>
      </SettingsBlock>
    </div>
  )
}

function HeaderTab() {
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [logoName, setLogoName] = useState('')
  const [companyName, setCompanyName] = useState('rst10')
  const [logoHeight, setLogoHeight] = useState(34)
  const [logoLink, setLogoLink] = useState('')
  const [navLinksOn, setNavLinksOn] = useState(false)
  const [navLinks, setNavLinks] = useState<Array<{ id: string; label: string; url: string }>>(
    [],
  )
  const [talentButtonOn, setTalentButtonOn] = useState(true)
  const [secondButtonOn, setSecondButtonOn] = useState(false)
  const [stickyHeader, setStickyHeader] = useState(true)
  const [headerBg, setHeaderBg] = useState('#FFFFFF')

  const heightPercent =
    ((logoHeight - LOGO_HEIGHT_MIN) / (LOGO_HEIGHT_MAX - LOGO_HEIGHT_MIN)) * 100

  function handleAddNavLink() {
    setNavLinksOn(true)
    setNavLinks((current) => [
      ...current,
      {
        id: `link-${Date.now()}`,
        label: 'New link',
        url: 'https://',
      },
    ])
  }

  return (
    <div className="flex flex-col gap-4">
      <SettingsBlock
        title="Logo"
        description="Shown at the top-left of every careers page."
      >
        <SettingRow
          label="Account logo image"
          tip="Upload a transparent PNG or SVG for best results on light and dark headers."
          description="Size: width 100% and height 50px"
        >
          <div className="flex w-full max-w-xs flex-col items-end gap-1.5">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) setLogoName(file.name)
              }}
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-dashed border-[#C8C5D6] bg-white px-4 text-sm font-semibold text-[#2D2061] transition-colors hover:border-[#2D2061] hover:bg-[#F7F6FA]"
            >
              <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
              Upload
            </button>
            <p className="text-right text-[11px] text-[#8B8B9E]">
              {logoName
                ? logoName
                : 'No file chosen — company name is shown as text'}
            </p>
          </div>
        </SettingRow>

        <SettingRow
          label="Company name"
          tip="Shown as text when no logo image is uploaded."
        >
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              value={companyName}
              maxLength={COMPANY_NAME_MAX}
              onChange={(event) => setCompanyName(event.target.value)}
              className="h-10 w-full rounded-lg border border-[#D5D2E2] bg-white py-2 pl-3 pr-14 text-sm text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
              aria-label="Company name"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] tabular-nums text-[#8B8B9E]">
              {companyName.length} / {COMPANY_NAME_MAX}
            </span>
          </div>
        </SettingRow>

        <SettingRow
          label="Logo height"
          tip="Controls how tall the logo appears in the careers header."
        >
          <div className="flex w-full max-w-xs items-center gap-3">
            <input
              type="range"
              min={LOGO_HEIGHT_MIN}
              max={LOGO_HEIGHT_MAX}
              value={logoHeight}
              onChange={(event) => setLogoHeight(Number(event.target.value))}
              aria-label="Logo height"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#E4E1EE] accent-[#2D2061]"
              style={{
                background: `linear-gradient(to right, #2D2061 0%, #2D2061 ${heightPercent}%, #E4E1EE ${heightPercent}%, #E4E1EE 100%)`,
              }}
            />
            <span className="w-10 shrink-0 text-right text-sm font-medium tabular-nums text-[#2D2061]">
              {logoHeight}px
            </span>
          </div>
        </SettingRow>

        <SettingRow
          label="Logo links to"
          tip="URL opened when candidates click the logo."
        >
          <input
            type="url"
            value={logoLink}
            onChange={(event) => setLogoLink(event.target.value)}
            placeholder="https://www.yourcompany.com"
            className="h-10 w-full max-w-xs rounded-lg border border-[#D5D2E2] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
            aria-label="Logo link URL"
          />
        </SettingRow>
      </SettingsBlock>

      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-[#1F1F2E]">
                Navigation links
              </h3>
              <InfoTip content="Turn on to show custom navigation links in the careers header." />
            </div>
            <p className="mt-0.5 text-xs text-[#8B8B9E]">
              Keep the careers page feeling like part of your website.
            </p>
          </div>
          <Switch
            checked={navLinksOn}
            onCheckedChange={setNavLinksOn}
            aria-label="Navigation links"
            className="!gap-0"
          />
        </div>
        {navLinksOn && navLinks.length > 0 ? (
          <ul className="mb-3 divide-y divide-[#ECEAF3]">
            {navLinks.map((link) => (
              <li
                key={link.id}
                className="flex flex-wrap items-center gap-2 py-2.5 first:pt-0"
              >
                <input
                  type="text"
                  value={link.label}
                  onChange={(event) =>
                    setNavLinks((current) =>
                      current.map((item) =>
                        item.id === link.id
                          ? { ...item, label: event.target.value }
                          : item,
                      ),
                    )
                  }
                  className="h-9 min-w-[8rem] flex-1 rounded-lg border border-[#D5D2E2] bg-white px-3 text-sm text-[#2D2061] outline-none focus:border-[#2D2061]"
                  aria-label="Link label"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(event) =>
                    setNavLinks((current) =>
                      current.map((item) =>
                        item.id === link.id
                          ? { ...item, url: event.target.value }
                          : item,
                      ),
                    )
                  }
                  className="h-9 min-w-[10rem] flex-[1.4] rounded-lg border border-[#D5D2E2] bg-white px-3 text-sm text-[#2D2061] outline-none focus:border-[#2D2061]"
                  aria-label="Link URL"
                />
              </li>
            ))}
          </ul>
        ) : null}
        <button
          type="button"
          onClick={handleAddNavLink}
          className="inline-flex items-center gap-1 text-sm font-semibold text-[#2D2061] transition-colors hover:text-[#241a52]"
        >
          <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
          Add link
        </button>
      </div>

      <SettingsBlock title="Header buttons & behaviour">
        <SettingRow
          label="Talent community button"
          tip="Shows a join talent community call-to-action in the header."
          description="Showing 'Join Our Talent Community'"
        >
          <button
            type="button"
            onClick={() =>
              toast.success('Opening talent community settings.', {
                title: 'Careers Page',
              })
            }
            className="text-sm font-semibold text-[#2D2061] hover:underline"
          >
            Manage
          </button>
          <Switch
            checked={talentButtonOn}
            onCheckedChange={setTalentButtonOn}
            aria-label="Talent community button"
            className="!gap-0"
          />
        </SettingRow>

        <SettingRow
          label="Second button"
          tip="Optional secondary header action button."
        >
          <Switch
            checked={secondButtonOn}
            onCheckedChange={setSecondButtonOn}
            aria-label="Second button"
            className="!gap-0"
          />
        </SettingRow>

        <SettingRow
          label="Keep header visible on scroll"
          tip="Pins the careers header to the top while candidates scroll."
        >
          <Switch
            checked={stickyHeader}
            onCheckedChange={setStickyHeader}
            aria-label="Keep header visible on scroll"
            className="!gap-0"
          />
        </SettingRow>

        <SettingRow
          label="Header background"
          tip="Background color behind the careers page header."
        >
          <label className="inline-flex items-center gap-2">
            <span
              className="size-8 shrink-0 overflow-hidden rounded-md border border-[#D5D2E2]"
              style={{ backgroundColor: headerBg }}
            >
              <input
                type="color"
                value={headerBg}
                onChange={(event) => setHeaderBg(event.target.value)}
                className="size-full cursor-pointer opacity-0"
                aria-label="Header background color picker"
              />
            </span>
            <input
              type="text"
              value={headerBg}
              onChange={(event) => setHeaderBg(event.target.value)}
              className="h-10 w-28 rounded-lg border border-[#D5D2E2] bg-white px-3 text-sm uppercase text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
              aria-label="Header background hex"
            />
          </label>
        </SettingRow>
      </SettingsBlock>
    </div>
  )
}

type CornerStyle = 'sharp' | 'soft' | 'round'

type PlacementOption = {
  id: string
  label: string
  tip?: string
  checked: boolean
  seeIt?: boolean
}

type OptionalFieldOption = {
  id: string
  label: string
  checked: boolean
}

const REQUIRED_SIGNUP_FIELDS = ['First name', 'Last name', 'Email'] as const

const DEFAULT_PLACEMENTS: PlacementOption[] = [
  { id: 'header', label: 'Header', checked: true },
  { id: 'hero', label: 'Hero banner', checked: false },
  { id: 'below-list', label: 'Below job list', checked: true },
  {
    id: 'no-results',
    label: 'When a search has no results',
    tip: 'Shows the talent community CTA on the empty search results state.',
    checked: true,
    seeIt: true,
  },
]

const DEFAULT_OPTIONAL_FIELDS: OptionalFieldOption[] = [
  { id: 'mobile', label: 'Mobile number', checked: true },
  { id: 'resume', label: 'Resume / CV', checked: true },
  { id: 'location', label: 'Location', checked: false },
  { id: 'category', label: 'Job category', checked: false },
  { id: 'skills', label: 'Skills', checked: false },
  { id: 'linkedin', label: 'LinkedIn profile', checked: true },
]

const BRAND_PRIMARY = '#25225E'
const BRAND_ACCENT = '#B04A6F'
const BRAND_FONT = 'dm-sans'
const BRAND_CORNER: CornerStyle = 'soft'

function parseHexColor(value: string): { r: number; g: number; b: number } | null {
  const hex = value.trim().replace(/^#/, '')
  if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  }
}

function relativeLuminance(hex: string): number | null {
  const rgb = parseHexColor(hex)
  if (!rgb) return null
  const channel = (value: number) => {
    const srgb = value / 255
    return srgb <= 0.03928
      ? srgb / 12.92
      : ((srgb + 0.055) / 1.055) ** 2.4
  }
  return (
    0.2126 * channel(rgb.r) +
    0.7152 * channel(rgb.g) +
    0.0722 * channel(rgb.b)
  )
}

/** White text on colour — warn when contrast is below WCAG AA (~4.5:1). */
function isTooLightForWhiteText(hex: string): boolean {
  const luminance = relativeLuminance(hex)
  if (luminance == null) return false
  const contrast = (1 + 0.05) / (luminance + 0.05)
  return contrast < 4.5
}

function ColorField({
  value,
  onChange,
  ariaLabel,
}: {
  value: string
  onChange: (value: string) => void
  ariaLabel: string
}) {
  const normalized =
    value.startsWith('#') || value.length === 0 ? value : `#${value}`
  const pickerValue = parseHexColor(normalized)
    ? normalized.toUpperCase()
    : '#000000'

  return (
    <label className="inline-flex items-center gap-2">
      <span
        className="size-8 shrink-0 overflow-hidden rounded-md border border-[#D5D2E2]"
        style={{ backgroundColor: pickerValue }}
      >
        <input
          type="color"
          value={pickerValue}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="size-full cursor-pointer opacity-0"
          aria-label={`${ariaLabel} picker`}
        />
      </span>
      <input
        type="text"
        value={normalized.toUpperCase()}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-28 rounded-lg border border-[#D5D2E2] bg-white px-3 text-sm uppercase text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
        aria-label={`${ariaLabel} hex`}
      />
    </label>
  )
}

function InfoCallout({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="rounded-[8px] border border-[#C9D8F5] bg-[#EAF1FE] px-4 py-3 text-xs leading-relaxed text-[#2F5AA8]"
    >
      {children}
    </div>
  )
}

function TalentCommunityTab() {
  const [enabled, setEnabled] = useState(true)
  const [buttonLabel, setButtonLabel] = useState('Join Our Talent Community')
  const [placements, setPlacements] = useState(DEFAULT_PLACEMENTS)
  const [invitationHeading, setInvitationHeading] = useState(
    "Didn't find the right role?",
  )
  const [invitationText, setInvitationText] = useState(
    "Join our talent community and we'll contact you when opportunities matching your profile open up.",
  )
  const [optionalFields, setOptionalFields] = useState(DEFAULT_OPTIONAL_FIELDS)
  const [consentText, setConsentText] = useState(
    'I agree that rst10 may store and process my details to contact me about relevant job opportunities.',
  )
  const [emailOptIn, setEmailOptIn] = useState(true)
  const [smsOptIn, setSmsOptIn] = useState(false)
  const [privacyUrl, setPrivacyUrl] = useState(
    'https://www.yourcompany.com/privacy',
  )
  const [confirmTitle, setConfirmTitle] = useState("You're in!")
  const [confirmMessage, setConfirmMessage] = useState(
    "Your profile has been added to our Talent Community. We'll contact you when opportunities matching your skills open up.",
  )
  const [welcomeEmail, setWelcomeEmail] = useState(true)

  function patchPlacement(id: string, checked: boolean) {
    setPlacements((current) =>
      current.map((item) => (item.id === id ? { ...item, checked } : item)),
    )
  }

  function patchOptionalField(id: string, checked: boolean) {
    setOptionalFields((current) =>
      current.map((item) => (item.id === id ? { ...item, checked } : item)),
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-3.5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-[#2D2061]">
                Talent community
              </h3>
              <InfoTip content="Capture interested candidates who want to hear about future roles." />
            </div>
            <p className="mt-0.5 max-w-xl text-xs leading-relaxed text-[#8B8B9E]">
              Capture interested candidates even when no job fits today.
            </p>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            aria-label="Talent community"
            className="!gap-0"
          />
        </div>

        <div
          className={cn(!enabled && 'pointer-events-none opacity-50')}
          aria-disabled={!enabled}
        >
          <SettingRow
            label="Button label"
            tip="Label on the join talent community CTA."
          >
            <CountedInput
              value={buttonLabel}
              onChange={setButtonLabel}
              maxLength={32}
              aria-label="Button label"
            />
          </SettingRow>

          <div className="border-b border-[#ECEAF3] py-3.5">
            <div className="mb-3 flex items-center gap-1.5">
              <p className="text-sm font-semibold text-[#2D2061]">
                Where the button appears
              </p>
              <InfoTip content="Choose which surfaces show the talent community CTA." />
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {placements.map((placement) => (
                <div
                  key={placement.id}
                  className="flex flex-wrap items-center gap-2"
                >
                  <Checkbox
                    id={`talent-placement-${placement.id}`}
                    checked={placement.checked}
                    onChange={(event) =>
                      patchPlacement(placement.id, event.target.checked)
                    }
                    label={
                      <span className="inline-flex items-center gap-1.5">
                        {placement.label}
                        {placement.tip ? (
                          <InfoTip content={placement.tip} />
                        ) : null}
                      </span>
                    }
                  />
                  {placement.seeIt ? (
                    <button
                      type="button"
                      onClick={() =>
                        toast.success(
                          'Empty search results will show the talent community CTA in preview.',
                          { title: 'See it' },
                        )
                      }
                      className="text-xs font-semibold text-[#2D2061] underline-offset-2 hover:underline"
                    >
                      See it
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <SettingRow
            label="Invitation heading"
            tip="Headline above the talent community CTA below the job list."
          >
            <CountedInput
              value={invitationHeading}
              onChange={setInvitationHeading}
              maxLength={45}
              aria-label="Invitation heading"
            />
          </SettingRow>

          <SettingRow
            label="Invitation text"
            tip="Supporting copy next to the join button."
          >
            <CountedInput
              value={invitationText}
              onChange={setInvitationText}
              maxLength={150}
              multiline
              rows={3}
              aria-label="Invitation text"
            />
          </SettingRow>
        </div>
      </div>

      <div
        className={cn(
          'rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6',
          !enabled && 'pointer-events-none opacity-50',
        )}
      >
        <SectionTitle
          title="Signup form"
          tip="Fields collected when a candidate joins the talent community."
          description="Keep it short — every extra field lowers signups."
        />

        <div className="border-b border-[#ECEAF3] pb-3.5">
          <p className="mb-2.5 text-sm font-semibold text-[#2D2061]">
            Always required
          </p>
          <div className="flex flex-wrap gap-2">
            {REQUIRED_SIGNUP_FIELDS.map((field) => (
              <span
                key={field}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#F0D9C8] bg-[#FFF7F0] px-2.5 py-1 text-xs font-medium text-[#9A5B2E]"
              >
                <Lock className="size-3" strokeWidth={2.25} aria-hidden="true" />
                {field}
              </span>
            ))}
          </div>
        </div>

        <div className="py-3.5">
          <p className="mb-2.5 text-sm font-semibold text-[#2D2061]">
            Optional fields
          </p>
          <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {optionalFields.map((field) => (
              <Checkbox
                key={field.id}
                id={`talent-field-${field.id}`}
                checked={field.checked}
                onChange={(event) =>
                  patchOptionalField(field.id, event.target.checked)
                }
                label={field.label}
              />
            ))}
          </div>
        </div>

        <InfoCallout>
          Uploaded CVs are parsed by Recruitment Smart AI after signup, so
          skills, experience and location fill the candidate profile
          automatically.
        </InfoCallout>
      </div>

      <div
        className={cn(
          'rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6',
          !enabled && 'pointer-events-none opacity-50',
        )}
      >
        <SectionTitle title="Where members go" />

        <SettingRow
          label="Source recorded as"
          tip="How talent community signups are tagged in candidate source."
        >
          <div className="w-full max-w-md rounded-lg border border-[#E4E1EE] bg-white px-3 py-2.5 text-sm text-[#6B6B80]">
            Career Site / Talent Community
          </div>
        </SettingRow>

        <SettingRow label="Existing candidates">
          <p className="max-w-md text-right text-sm leading-relaxed text-[#6B6B80] sm:text-left">
            Enriched, not duplicated. Repeat signups are skipped and the
            candidate sees a friendly confirmation.
          </p>
        </SettingRow>

        <div className="pt-1">
          <InfoCallout>
            Talent pool assignment arrives with Talent CRM. Until then every
            member carries the tag{' '}
            <span className="font-semibold">Talent Community</span>.
          </InfoCallout>
        </div>
      </div>

      <div
        className={cn(
          'rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6',
          !enabled && 'pointer-events-none opacity-50',
        )}
      >
        <SectionTitle
          title="Consent & communication"
          tip="Legal and marketing opt-in controls shown on the signup form."
        />

        <SettingRow
          label="Consent text"
          tip="Shown above the submit button"
          description="Shown above the submit button"
        >
          <CountedInput
            value={consentText}
            onChange={setConsentText}
            maxLength={300}
            multiline
            rows={4}
            aria-label="Consent text"
          />
        </SettingRow>

        <SettingRow
          label="Ask for email opt-in"
          tip="Adds a checkbox for email marketing consent."
        >
          <Switch
            checked={emailOptIn}
            onCheckedChange={setEmailOptIn}
            aria-label="Ask for email opt-in"
            className="!gap-0"
          />
        </SettingRow>

        <SettingRow
          label="Ask for SMS opt-in"
          tip="Adds a checkbox for SMS marketing consent."
        >
          <Switch
            checked={smsOptIn}
            onCheckedChange={setSmsOptIn}
            aria-label="Ask for SMS opt-in"
            className="!gap-0"
          />
        </SettingRow>

        <SettingRow
          label="Privacy policy link"
          tip="URL linked from the consent text on the signup form."
        >
          <input
            type="url"
            value={privacyUrl}
            onChange={(event) => setPrivacyUrl(event.target.value)}
            aria-label="Privacy policy link"
            className="h-10 w-full max-w-md rounded-lg border border-[#D5D2E2] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
          />
        </SettingRow>
      </div>

      <div
        className={cn(
          'rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6',
          !enabled && 'pointer-events-none opacity-50',
        )}
      >
        <SectionTitle title="After signup" />

        <SettingRow
          label="Confirmation title"
          tip="Headline shown after a successful talent community signup."
        >
          <CountedInput
            value={confirmTitle}
            onChange={setConfirmTitle}
            maxLength={30}
            aria-label="Confirmation title"
          />
        </SettingRow>

        <SettingRow
          label="Confirmation message"
          tip="Body copy on the success screen after signup."
        >
          <CountedInput
            value={confirmMessage}
            onChange={setConfirmMessage}
            maxLength={200}
            multiline
            rows={3}
            aria-label="Confirmation message"
          />
        </SettingRow>

        <SettingRow
          label="Send a welcome email"
          tip="Emails the candidate a welcome message after they join."
        >
          <Switch
            checked={welcomeEmail}
            onCheckedChange={setWelcomeEmail}
            aria-label="Send a welcome email"
            className="!gap-0"
          />
        </SettingRow>
      </div>
    </div>
  )
}

function AppearanceTab() {
  const [primaryColour, setPrimaryColour] = useState(BRAND_PRIMARY)
  const [accentColour, setAccentColour] = useState(BRAND_ACCENT)
  const [pageFont, setPageFont] = useState(BRAND_FONT)
  const [cornerStyle, setCornerStyle] = useState<CornerStyle>(BRAND_CORNER)

  const lightColourWarning =
    isTooLightForWhiteText(primaryColour) || isTooLightForWhiteText(accentColour)

  function handleResetToBrand() {
    setPrimaryColour(BRAND_PRIMARY)
    setAccentColour(BRAND_ACCENT)
    setPageFont(BRAND_FONT)
    setCornerStyle(BRAND_CORNER)
    toast.success('Theme reset to brand defaults.', { title: 'Reset' })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <SectionTitle
          title="Theme & appearance"
          tip="Colours, type, and corner radius applied across the careers page."
          trailing={
            <Button
              type="button"
              variant="outline"
              onClick={handleResetToBrand}
              className="!h-9 !rounded-md !border-[#D5D2E2] !px-3.5 !text-sm !font-semibold !text-[#2D2061] hover:!bg-white"
            >
              Reset to brand
            </Button>
          }
        />

        <SettingRow
          label="Primary colour"
          tip="Used for headers, links, and primary actions on the careers page."
        >
          <ColorField
            value={primaryColour}
            onChange={setPrimaryColour}
            ariaLabel="Primary colour"
          />
        </SettingRow>

        <SettingRow
          label="Accent colour"
          tip="Highlight colour for secondary CTAs and accents."
        >
          <ColorField
            value={accentColour}
            onChange={setAccentColour}
            ariaLabel="Accent colour"
          />
        </SettingRow>

        <SettingRow
          label="Page font"
          tip="Typeface used for body text across the careers page."
        >
          <div className="w-full max-w-xs">
            <Select
              id="careers-page-font"
              label=""
              options={[
                { value: 'dm-sans', label: 'DM Sans' },
                { value: 'inter', label: 'Inter' },
                { value: 'system', label: 'System UI' },
                { value: 'georgia', label: 'Georgia' },
              ]}
              value={pageFont}
              onChange={(event) => setPageFont(event.target.value)}
              aria-label="Page font"
            />
          </div>
        </SettingRow>

        <SettingRow
          label="Corner style"
          tip="How rounded cards, inputs, and buttons appear on the careers page."
        >
          <SegmentedControl
            aria-label="Corner style"
            value={cornerStyle}
            onChange={setCornerStyle}
            options={[
              { value: 'sharp', label: 'Sharp' },
              { value: 'soft', label: 'Soft' },
              { value: 'round', label: 'Round' },
            ]}
          />
        </SettingRow>
      </div>

      <div
        role="status"
        className={cn(
          'rounded-[8px] px-4 py-3 text-xs leading-relaxed',
          lightColourWarning
            ? 'border border-[#F5D0D0] bg-[#FEF2F2] text-[#B42318]'
            : 'border border-[#C9D8F5] bg-[#EAF1FE] text-[#2F5AA8]',
        )}
      >
        {lightColourWarning
          ? 'One of your colours is too light for white button text. Darken Primary or Accent before saving so labels stay readable.'
          : "Button text is always white. If a colour is too light for white text to be readable, we'll warn you here before you save."}
      </div>
    </div>
  )
}

/**
 * Settings → Module Configuration → Jobs → Career Page.
 */
export function JobsCareerPagePanel() {
  const [tab, setTab] = useState<CareerTab>('page-link')
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop')

  return (
    <SettingsPanel
      eyebrow="JOBS"
      title="Careers Page"
      titleAside={<StatusPillBadge option={HOSTED_BADGE} />}
      description="Configure your public careers experience and preview it live."
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              toast.success('Opening full-page preview.', {
                title: 'Careers Page',
              })
            }
            className="!h-10 !rounded-md !border-[#2D2061] !px-4 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            <Eye className="size-4" strokeWidth={1.75} aria-hidden="true" />
            Preview Full Page
          </Button>
          <Button
            type="button"
            onClick={() => window.open(CAREERS_URL, '_blank', 'noopener')}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            <ExternalLink
              className="size-4"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            Open Live Page
          </Button>
        </>
      }
    >
      <SettingsUnderlineTabs
        aria-label="Careers page sections"
        value={tab}
        onChange={setTab}
        options={CAREER_TABS}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.95fr)]">
        <div className="min-w-0">
          {tab === 'page-link' ? <PageLinkTab /> : null}
          {tab === 'header' ? <HeaderTab /> : null}
          {tab === 'hero' ? <HeroBannerTab /> : null}
          {tab === 'search' ? <SearchFiltersTab /> : null}
          {tab === 'listing' ? <JobListingTab /> : null}
          {tab === 'appearance' ? <AppearanceTab /> : null}
          {tab === 'talent' ? <TalentCommunityTab /> : null}
        </div>

        <LivePreviewPanel
          previewMode={previewMode}
          onPreviewModeChange={setPreviewMode}
        />
      </div>
    </SettingsPanel>
  )
}
