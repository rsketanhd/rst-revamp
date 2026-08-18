import { useId, useRef, useState, type ReactNode } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button, Input, Select } from '../ui'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'

const LANGUAGE_OPTIONS = [
  'English (Default)',
  'Spanish',
  'French',
  'German',
  'Hindi',
  'Arabic',
]

/**
 * Company & Branding settings — enterprise metadata, domain, language, branding, theme, vacancy page.
 */
export function CompanyBrandingPanel() {
  const [domainHost, setDomainHost] = useState('careers.recruitmentsmart.com')
  const [language, setLanguage] = useState('English (Default)')
  const [logoName, setLogoName] = useState('rs_Logo_preferred.png')
  const [videoName, setVideoName] = useState('intro_company_v1.mp4')
  const [facebookUrl, setFacebookUrl] = useState(
    'https://www.facebook.com/recruitmentsmart',
  )
  const [twitterUrl, setTwitterUrl] = useState(
    'https://x.com/recruitmentsmart',
  )
  const [youtubeUrl, setYoutubeUrl] = useState(
    'https://www.youtube.com/@recruitmentsmart',
  )
  const [linkedinUrl, setLinkedinUrl] = useState(
    'https://www.linkedin.com/company/recruitmentsmart',
  )
  const [termsPage, setTermsPage] = useState(
    'https://recruitmentsmart.com/terms',
  )
  const [tenantId, setTenantId] = useState('123456')
  const [gradientStart, setGradientStart] = useState('#0080FF')
  const [gradientStop, setGradientStop] = useState('#0080FF')
  const [vacancyMode, setVacancyMode] = useState<'generated' | 'own'>(
    'generated',
  )
  const vacancyUrl =
    'https://recruitagent.ai/application/company/recruitmentsmart'
  const [copied, setCopied] = useState(false)

  const logoInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  function handleCopyVacancy() {
    void navigator.clipboard?.writeText(vacancyUrl)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <SettingsPanel
      title="Company & Branding"
      description="Maintain your core enterprise metadata parameters, specify product language localization, check live license count, and tweak branding criteria."
    >
      {/* A. Company Details */}
      <SettingsBlock
        title="Company Details"
        footer={
          <Button
            type="button"
            className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
            onClick={() => console.info('purchase seats')}
          >
            Purchase Seats
          </Button>
        }
      >
        <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetailField
            label="Company Phone Contact"
            value="+44 760 196 4563"
          />
          <DetailField label="Domain Identifier" value="design" />
          <DetailField
            label="Corporate Website"
            value="www.recruitmentsmart.com"
          />
          <DetailField label="Registered on Date" value="12/03/2026" />
          <DetailField
            label="Total Active License Registered"
            value="223 Seats"
          />
        </dl>
      </SettingsBlock>

      {/* B. Custom Domain */}
      <SettingsBlock title="Custom Domain Config">
        <div className="max-w-2xl">
          <PrefixedUrlField
            label="Platform Custom Domain Host"
            requiredMark
            prefix="https://"
            value={domainHost}
            onChange={setDomainHost}
          />
          <p className="mt-2 text-xs leading-relaxed text-[#8B8B9E]">
            Note: Setting a custom domain requires your network administrator to
            map the CNAME resource records over DNS.
          </p>
        </div>
      </SettingsBlock>

      {/* C. Region & Language */}
      <SettingsBlock title="Region & Product Language">
        <div className="max-w-xl">
          <Select
            label="Default Product Language Localization"
            requiredMark
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
          <p className="mt-2 text-xs leading-relaxed text-[#8B8B9E]">
            The selected language governs AI powered scribing alerts, dashboard
            navigation tables, and default client side notification templates.
          </p>
        </div>
      </SettingsBlock>

      {/* D. Manage Branding */}
      <SettingsBlock
        title="Manage Branding"
        footer={
          <Button
            type="button"
            className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
            onClick={() =>
              console.info('save branding', {
                logoName,
                videoName,
                facebookUrl,
                twitterUrl,
                youtubeUrl,
                linkedinUrl,
                termsPage,
                tenantId,
              })
            }
          >
            Save Branding
          </Button>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FileUploadCard
              label="Company Logo"
              fileName={logoName}
              inputRef={logoInputRef}
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onPick={(file) => setLogoName(file.name)}
              notes={[
                'Maximum 5MB file size',
                'Transparent image file is preferred',
                'Recommended size 400×120 px',
              ]}
            />
            <FileUploadCard
              label="Intro Video"
              fileName={videoName}
              inputRef={videoInputRef}
              accept="video/mp4,video/webm"
              onPick={(file) => setVideoName(file.name)}
              notes={[
                'Maximum 50MB file size',
                'MP4 or WEBM formats preferred',
                'Keep duration under 90 seconds',
              ]}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SocialUrlField
              label="Facebook URL"
              value={facebookUrl}
              onChange={setFacebookUrl}
              icon={<BrandIconFacebook />}
            />
            <SocialUrlField
              label="Twitter(X) URL"
              value={twitterUrl}
              onChange={setTwitterUrl}
              icon={<BrandIconX />}
            />
            <SocialUrlField
              label="YouTube URL"
              value={youtubeUrl}
              onChange={setYoutubeUrl}
              icon={<BrandIconYoutube />}
            />
            <SocialUrlField
              label="LinkedIn URL"
              value={linkedinUrl}
              onChange={setLinkedinUrl}
              icon={<BrandIconLinkedIn />}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Terms Page"
              value={termsPage}
              onChange={(e) => setTermsPage(e.target.value)}
            />
            <Input
              label="Tenant ID"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            />
          </div>
        </div>
      </SettingsBlock>

      {/* E. Theme */}
      <SettingsBlock
        title="Theme & Appearance"
        footer={
          <Button
            type="button"
            className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
            onClick={() =>
              console.info('save theme', { gradientStart, gradientStop })
            }
          >
            Save Changes
          </Button>
        }
      >
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ColorField
              label="Gradient Start Color"
              value={gradientStart}
              onChange={setGradientStart}
            />
            <ColorField
              label="Gradient Stop Color"
              value={gradientStop}
              onChange={setGradientStop}
            />
          </div>
          <ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed text-[#6B6B80]">
            <li>
              <span className="font-semibold text-[#2D2061]">
                Gradient Start Color
              </span>{' '}
              — primary brand gradient beginning for headers and CTA accents.
            </li>
            <li>
              <span className="font-semibold text-[#2D2061]">
                Gradient Stop Color
              </span>{' '}
              — secondary blend color used across cards and marketing surfaces.
            </li>
            <li>
              <span className="font-semibold text-[#2D2061]">UI Cohesion</span>{' '}
              — keep start/stop within the same family for accessible contrast.
            </li>
          </ul>
        </div>
      </SettingsBlock>

      {/* F. Vacancy Page */}
      <SettingsBlock title="Your Vacancy Page">
        <div className="flex flex-col gap-4">
          <label
            className={cn(
              'flex cursor-pointer flex-col gap-3 rounded-lg border bg-white p-4 transition-colors',
              vacancyMode === 'generated'
                ? 'border-[#2D2061]'
                : 'border-[#E5E7EB] hover:border-[#2D2061]/40',
            )}
          >
            <span className="inline-flex items-start gap-2.5">
              <input
                type="radio"
                name="vacancy-mode"
                checked={vacancyMode === 'generated'}
                onChange={() => setVacancyMode('generated')}
                className="mt-0.5 size-4 accent-[#2D2061]"
              />
              <span className="text-sm leading-relaxed text-[#2A2740]">
                We&apos;ve generated a vacancy page for you for free. You will
                receive applications via your email.
              </span>
            </span>
            {vacancyMode === 'generated' ? (
              <div className="relative pl-6 sm:pl-7">
                <input
                  type="text"
                  readOnly
                  value={vacancyUrl}
                  className="h-11 w-full rounded-md border border-[#E5E7EB] bg-white py-0 pl-3 pr-11 text-sm text-[#2D2061] outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyVacancy}
                  aria-label={copied ? 'Copied' : 'Copy vacancy URL'}
                  className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-[#2D2061] transition-colors hover:bg-[#F2F1F6]"
                >
                  {copied ? (
                    <Check className="size-4 text-[#15803D]" strokeWidth={2} />
                  ) : (
                    <Copy className="size-4" strokeWidth={1.75} />
                  )}
                </button>
              </div>
            ) : null}
          </label>

          <label
            className={cn(
              'flex cursor-pointer items-start gap-2.5 rounded-lg border bg-white p-4 transition-colors',
              vacancyMode === 'own'
                ? 'border-[#2D2061]'
                : 'border-[#E5E7EB] hover:border-[#2D2061]/40',
            )}
          >
            <input
              type="radio"
              name="vacancy-mode"
              checked={vacancyMode === 'own'}
              onChange={() => setVacancyMode('own')}
              className="mt-0.5 size-4 accent-[#2D2061]"
            />
            <span className="text-sm leading-relaxed text-[#2A2740]">
              I will use my own vacancy page for publishing.
            </span>
          </label>
        </div>
      </SettingsBlock>
    </SettingsPanel>
  )
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-[#8B8B9E]">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-[#1A1A2E]">{value}</dd>
    </div>
  )
}

function PrefixedUrlField({
  label,
  requiredMark,
  prefix,
  value,
  onChange,
}: {
  label: string
  requiredMark?: boolean
  prefix: string
  value: string
  onChange: (value: string) => void
}) {
  const id = useId()
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-[#2D2061]">
        {label}
        {requiredMark ? (
          <span className="ml-0.5 text-[#E53935]" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      <div className="flex h-11 overflow-hidden rounded-md border border-[#ddd9e8] bg-white focus-within:border-[#2D2061] focus-within:ring-2 focus-within:ring-[#2D2061]/10">
        <span className="inline-flex shrink-0 items-center border-r border-[#E5E7EB] bg-[#F3F2F7] px-3 text-sm font-medium text-[#6B6B80]">
          {prefix}
        </span>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 border-0 bg-white px-3 text-sm text-[#2D2061] outline-none"
        />
      </div>
    </div>
  )
}

function FileUploadCard({
  label,
  fileName,
  accept,
  notes,
  inputRef,
  onPick,
}: {
  label: string
  fileName: string
  accept: string
  notes: string[]
  inputRef: React.RefObject<HTMLInputElement | null>
  onPick: (file: File) => void
}) {
  const id = useId()
  return (
    <div className="rounded-lg border border-dashed border-[#C8C5D6] bg-white p-4">
      <p className="text-xs font-semibold text-[#2D2061]">{label}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onPick(file)
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="!h-9 !rounded-md border-[#2D2061] text-[#2D2061]"
          onClick={() => inputRef.current?.click()}
        >
          Choose File
        </Button>
        <span className="min-w-0 truncate text-sm text-[#6B6B80]">
          {fileName || 'No file chosen'}
        </span>
      </div>
      <ul className="mt-3 list-disc space-y-0.5 pl-4 text-[11px] leading-relaxed text-[#8B8B9E]">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  )
}

function SocialUrlField({
  label,
  value,
  onChange,
  icon,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  icon: ReactNode
}) {
  const id = useId()
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-[#2D2061]">
        {label}
      </label>
      <div className="flex h-11 overflow-hidden rounded-md border border-[#ddd9e8] bg-white focus-within:border-[#2D2061] focus-within:ring-2 focus-within:ring-[#2D2061]/10">
        <span className="inline-flex w-11 shrink-0 items-center justify-center border-r border-[#E5E7EB] bg-[#FAFAFC]">
          {icon}
        </span>
        <input
          id={id}
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 border-0 bg-white px-3 text-sm text-[#2D2061] outline-none"
        />
      </div>
    </div>
  )
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const id = useId()
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-[#2D2061]">
        {label}
      </label>
      <div className="flex h-11 items-stretch overflow-hidden rounded-md border border-[#ddd9e8] bg-white focus-within:border-[#2D2061] focus-within:ring-2 focus-within:ring-[#2D2061]/10">
        <label className="relative inline-flex w-11 shrink-0 cursor-pointer items-center justify-center border-r border-[#E5E7EB]">
          <span
            className="size-7 rounded border border-[#E5E7EB]"
            style={{ backgroundColor: value }}
            aria-hidden="true"
          />
          <input
            type="color"
            value={normalizeHex(value)}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={`${label} picker`}
          />
        </label>
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 border-0 bg-white px-3 font-mono text-sm uppercase text-[#2D2061] outline-none"
          spellCheck={false}
        />
      </div>
    </div>
  )
}

function normalizeHex(value: string) {
  const trimmed = value.trim()
  if (/^#[0-9A-Fa-f]{6}$/.test(trimmed)) return trimmed
  return '#0080FF'
}

function BrandIconFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1877F2" />
      <path
        fill="#fff"
        d="M13.2 18.5v-5.7h1.9l.3-2.2h-2.2V9.3c0-.6.2-1.1 1.1-1.1h1.2V6.1c-.2 0-.9-.1-1.8-.1-1.8 0-3 1.1-3 3v1.6H8.6v2.2h2.1v5.7h2.5z"
      />
    </svg>
  )
}

function BrandIconX() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-3.5 text-[#0F1419]"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"
      />
    </svg>
  )
}

function BrandIconYoutube() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#FF0000"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8z"
      />
      <path fill="#fff" d="M9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  )
}

function BrandIconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <rect width="24" height="24" rx="3" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M7.1 9.7H4.9V19h2.2V9.7zM6 5a1.3 1.3 0 1 0 0 2.6A1.3 1.3 0 0 0 6 5zm12.2 7.3c0-2.4-1.3-3.5-3-3.5-1.4 0-2 .8-2.3 1.3V9.7H11c0 .5 0 8.3 0 8.3h2.1v-4.6c0-.3 0-.5.1-.7.2-.5.6-1 1.4-1 1 0 1.4.7 1.4 1.8V19h2.2v-4.7z"
      />
    </svg>
  )
}

