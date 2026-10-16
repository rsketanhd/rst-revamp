import { useState, type ReactNode } from 'react'
import { Lock, X } from 'lucide-react'
import { Button, Switch, toast } from '../ui'
import { cn } from '../../lib/cn'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'

type JobTitleScope = 'current' | 'current-past' | 'ignore'
type PreferenceMode = 'strict' | 'flexible' | 'ignore'
type RankMode = 'required' | 'preferred'
type CompanyScope = 'current' | 'ever'
type ExcludeMode = 'current' | 'ever' | 'ignore'
type ContactMode = 'email' | 'phone' | 'both'

type ChoiceOption<T extends string> = {
  value: T
  title: string
  description: string
}

/**
 * Settings → Module Configuration → Candidate Discovery → General.
 */
export function CandidateDiscoveryGeneralPanel() {
  const [jobTitleScope, setJobTitleScope] =
    useState<JobTitleScope>('current-past')
  const [jobTitleRank, setJobTitleRank] = useState<RankMode>('required')
  const [industryMode, setIndustryMode] = useState<PreferenceMode>('flexible')
  const [locationFilterOn, setLocationFilterOn] = useState(true)
  const [experienceMode, setExperienceMode] = useState<PreferenceMode>('strict')
  const [skillsMode, setSkillsMode] = useState<PreferenceMode>('strict')
  const [requiredSkillsCount, setRequiredSkillsCount] = useState('5')
  const [includeCompanyScope, setIncludeCompanyScope] =
    useState<CompanyScope>('current')
  const [includeCompanies, setIncludeCompanies] = useState<string[]>([])
  const [companyDraft, setCompanyDraft] = useState('')
  const [excludeMode, setExcludeMode] = useState<ExcludeMode>('ignore')
  const [contactMode, setContactMode] = useState<ContactMode>('both')
  const [fetchLimit, setFetchLimit] = useState('25')

  function addCompany(raw: string) {
    const name = raw.trim()
    if (!name) return
    setIncludeCompanies((current) =>
      current.some((item) => item.toLowerCase() === name.toLowerCase())
        ? current
        : [...current, name],
    )
    setCompanyDraft('')
  }

  function removeCompany(name: string) {
    setIncludeCompanies((current) => current.filter((item) => item !== name))
  }

  function handleSave() {
    toast.success('Candidate Discovery settings saved.', {
      title: 'Candidate Discovery',
    })
  }

  return (
    <SettingsPanel
      title="Candidate Discovery"
      description="How Recruitment Smart sourcing searches are built. Your personal criteria apply to Candidate Discovery and to External Recommendations on jobs."
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(12rem,14.5rem)]">
        <div className="flex min-w-0 flex-col gap-4">
          <SettingsBlock
            title="Your search preferences"
            description={
              <>
                Just for you — each recruiter keeps their own.{' '}
                <span className="font-semibold text-[#2D2061]">Strict</span>{' '}
                excludes non-matching candidates,{' '}
                <span className="font-semibold text-[#2D2061]">Flexible</span>{' '}
                only ranks them,{' '}
                <span className="font-semibold text-[#2D2061]">Ignore</span>{' '}
                leaves the parameter out.
              </>
            }
          >
            <PreferenceField
              title="Job title"
              description="Which part of the career history the titles match against."
            >
              <ChoiceGroup
                ariaLabel="Job title scope"
                value={jobTitleScope}
                onChange={setJobTitleScope}
                options={[
                  {
                    value: 'current',
                    title: 'Current only',
                    description: 'Present role',
                  },
                  {
                    value: 'current-past',
                    title: 'Current + past',
                    description: 'Any role held',
                  },
                  {
                    value: 'ignore',
                    title: 'Ignore',
                    description: 'Not used',
                  },
                ]}
              />
              {jobTitleScope !== 'ignore' ? (
                <ChoiceGroup
                  ariaLabel="Job title rank"
                  value={jobTitleRank}
                  onChange={setJobTitleRank}
                  options={[
                    {
                      value: 'required',
                      title: 'Required',
                      description: 'Excludes non-matches',
                    },
                    {
                      value: 'preferred',
                      title: 'Preferred',
                      description: 'Ranks only',
                    },
                  ]}
                />
              ) : null}
            </PreferenceField>

            <PreferenceField
              title="Industry"
              description="Whether the searched industry filters or only ranks."
            >
              <ChoiceGroup
                ariaLabel="Industry mode"
                value={industryMode}
                onChange={setIndustryMode}
                options={PREFERENCE_OPTIONS}
              />
            </PreferenceField>

            <PreferenceField
              title="Location"
              description="Restrict results to the search location's radius."
            >
              <div className="flex flex-wrap items-center gap-3 rounded-[8px] border border-[#E4E1EE] bg-white px-4 py-3">
                <Switch
                  checked={locationFilterOn}
                  onCheckedChange={setLocationFilterOn}
                  aria-label="Filtering by location radius"
                  className="!gap-0"
                />
                <span className="text-sm font-medium text-[#2D2061]">
                  Filtering by location radius
                </span>
              </div>
            </PreferenceField>

            <PreferenceField
              title="Years of experience"
              description="Whether the experience range filters or only ranks."
            >
              <ChoiceGroup
                ariaLabel="Years of experience mode"
                value={experienceMode}
                onChange={setExperienceMode}
                options={PREFERENCE_OPTIONS}
              />
            </PreferenceField>

            <PreferenceField
              title="Must-have skills"
              description="Strict makes the top skills required; the rest still rank as preferences."
            >
              <ChoiceGroup
                ariaLabel="Must-have skills mode"
                value={skillsMode}
                onChange={setSkillsMode}
                options={PREFERENCE_OPTIONS}
              />
              {skillsMode === 'strict' ? (
                <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B6B80]">
                  <span>Top</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={requiredSkillsCount}
                    onChange={(event) =>
                      setRequiredSkillsCount(event.target.value)
                    }
                    aria-label="Number of required skills"
                    className="h-9 w-14 rounded-lg border border-[#D5D2E2] bg-white px-2 text-center text-sm font-semibold text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                  />
                  <span>skills are required — the rest rank as preferences</span>
                </div>
              ) : null}
            </PreferenceField>

            <PreferenceField
              title="Include companies"
              description="Source only from these companies. Remembered for you; the Candidate Discovery page pre-fills them and can save new ones here. Empty = any company."
            >
              <ChoiceGroup
                ariaLabel="Include companies scope"
                value={includeCompanyScope}
                onChange={setIncludeCompanyScope}
                options={[
                  {
                    value: 'current',
                    title: 'Current employer',
                    description: 'Works there now',
                  },
                  {
                    value: 'ever',
                    title: 'Ever worked there',
                    description: 'Now or before',
                  },
                ]}
              />
              <div className="flex flex-col gap-2">
                {includeCompanies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {includeCompanies.map((company) => (
                      <span
                        key={company}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E1EE] bg-white px-2.5 py-1 text-xs font-medium text-[#2D2061]"
                      >
                        {company}
                        <button
                          type="button"
                          aria-label={`Remove ${company}`}
                          onClick={() => removeCompany(company)}
                          className="text-[#8B8B9E] hover:text-[#2D2061]"
                        >
                          <X className="size-3" strokeWidth={2.5} />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : null}
                <input
                  type="text"
                  value={companyDraft}
                  onChange={(event) => setCompanyDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addCompany(companyDraft)
                    }
                  }}
                  placeholder="Add company + Enter"
                  aria-label="Add include company"
                  className="h-10 w-full max-w-md rounded-lg border border-[#D5D2E2] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                />
              </div>
            </PreferenceField>

            <PreferenceField
              title="Exclude companies"
              description="A standing blocklist, always applied on top of any companies a single search names."
            >
              <ChoiceGroup
                ariaLabel="Exclude companies mode"
                value={excludeMode}
                onChange={setExcludeMode}
                options={[
                  {
                    value: 'current',
                    title: 'Current employer',
                    description: 'Block if current',
                  },
                  {
                    value: 'ever',
                    title: 'Ever worked there',
                    description: 'Block if ever',
                  },
                  {
                    value: 'ignore',
                    title: 'Ignore',
                    description: 'Not applied',
                  },
                ]}
              />
            </PreferenceField>
          </SettingsBlock>

          <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-[#1F1F2E]">
                    Workspace policy
                  </h3>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#E8E4F8] px-2.5 py-1 text-[11px] font-semibold text-[#4C3A8A]">
                    <Lock className="size-3" strokeWidth={2.25} aria-hidden="true" />
                    Admin only — applies to everyone
                  </span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
                  Tenant-wide settings that affect sourcing cost and contact
                  usage for the whole workspace.
                </p>
              </div>
            </div>

            <PreferenceField
              title="Contact information to retrieve"
              description="When a sourced candidate is added, contact comes from Recruitment Smart's sourcing data first, then the contact provider fills in anything still missing — limited to the type(s) chosen here."
            >
              <ChoiceGroup
                ariaLabel="Contact information to retrieve"
                value={contactMode}
                onChange={setContactMode}
                options={[
                  {
                    value: 'email',
                    title: 'Email only',
                    description: 'Email addresses',
                  },
                  {
                    value: 'phone',
                    title: 'Phone only',
                    description: 'Phone numbers',
                  },
                  {
                    value: 'both',
                    title: 'Both',
                    description: 'Email & phone',
                  },
                ]}
              />
            </PreferenceField>

            <PreferenceField
              title="Fetch limit"
              description="Candidates returned per search — each returned profile spends a sourcing credit."
            >
              <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B6B80]">
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={fetchLimit}
                  onChange={(event) => setFetchLimit(event.target.value)}
                  aria-label="Candidates per search"
                  className="h-9 w-16 rounded-lg border border-[#D5D2E2] bg-white px-2 text-center text-sm font-semibold text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                />
                <span>candidates per search</span>
              </div>
            </PreferenceField>
          </div>
        </div>

        <aside className="h-fit rounded-[8px] border border-[#C9D8F5] bg-[#EAF1FE] p-5 xl:sticky xl:top-4">
          <h3 className="text-sm font-bold text-[#2D2061]">
            What your searches will do
          </h3>
          <p className="mt-0.5 text-xs text-[#5B7BB8]">
            A plain-language summary of the current settings.
          </p>
          <ul className="mt-4 space-y-2.5">
            {buildSummary({
              jobTitleScope,
              jobTitleRank,
              industryMode,
              locationFilterOn,
              experienceMode,
              skillsMode,
              requiredSkillsCount,
              includeCompanies,
              excludeMode,
              contactMode,
            }).map((item) => (
              <li
                key={item.label}
                className={cn(
                  'flex gap-2 text-xs leading-relaxed',
                  item.active ? 'text-[#2F5AA8]' : 'text-[#8BA0C8]',
                )}
              >
                <span
                  className={cn(
                    'mt-1.5 size-1.5 shrink-0 rounded-full',
                    item.active ? 'bg-[#2F5AA8]' : 'border border-[#8BA0C8] bg-transparent',
                  )}
                  aria-hidden="true"
                />
                <span>
                  <span className="font-semibold">{item.label}:</span>{' '}
                  {item.text}
                </span>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          onClick={handleSave}
          className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
        >
          Save Settings
        </Button>
      </div>
    </SettingsPanel>
  )
}

const PREFERENCE_OPTIONS: ChoiceOption<PreferenceMode>[] = [
  {
    value: 'strict',
    title: 'Strict',
    description: 'Excludes non-matches',
  },
  {
    value: 'flexible',
    title: 'Flexible',
    description: "Ranks, doesn't exclude",
  },
  {
    value: 'ignore',
    title: 'Ignore',
    description: 'Not used',
  },
]

function PreferenceField({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="border-b border-dashed border-[#E4E1EE] py-4 last:border-b-0 last:pb-0 first:pt-0">
      <p className="text-sm font-semibold text-[#2D2061]">{title}</p>
      <p className="mt-0.5 max-w-3xl text-xs leading-relaxed text-[#8B8B9E]">
        {description}
      </p>
      <div className="mt-3 flex flex-col gap-2.5">{children}</div>
    </div>
  )
}

function ChoiceGroup<T extends string>({
  ariaLabel,
  value,
  onChange,
  options,
}: {
  ariaLabel: string
  value: T
  onChange: (value: T) => void
  options: Array<ChoiceOption<T>>
}) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
    >
      {options.map((option) => {
        const selected = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'rounded-[8px] border px-3.5 py-3 text-left transition-colors',
              selected
                ? 'border-[#2D2061] bg-white'
                : 'border-[#E4E1EE] bg-white hover:border-[#2D2061]/40',
            )}
          >
            <span className="block text-sm font-semibold text-[#2D2061]">
              {option.title}
            </span>
            <span className="mt-0.5 block text-xs leading-relaxed text-[#8B8B9E]">
              {option.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function buildSummary({
  jobTitleScope,
  jobTitleRank,
  industryMode,
  locationFilterOn,
  experienceMode,
  skillsMode,
  requiredSkillsCount,
  includeCompanies,
  excludeMode,
  contactMode,
}: {
  jobTitleScope: JobTitleScope
  jobTitleRank: RankMode
  industryMode: PreferenceMode
  locationFilterOn: boolean
  experienceMode: PreferenceMode
  skillsMode: PreferenceMode
  requiredSkillsCount: string
  includeCompanies: string[]
  excludeMode: ExcludeMode
  contactMode: ContactMode
}): Array<{ label: string; text: string; active: boolean }> {
  const jobTitleText = (() => {
    switch (jobTitleScope) {
      case 'current':
        return jobTitleRank === 'required'
          ? 'candidates currently hold a searched title — required'
          : 'candidates currently hold a searched title — preferred'
      case 'current-past':
        return jobTitleRank === 'required'
          ? 'candidates currently or previously hold a searched title — required'
          : 'candidates currently or previously hold a searched title — preferred'
      case 'ignore':
        return 'job title is not used'
      default: {
        const _exhaustive: never = jobTitleScope
        return _exhaustive
      }
    }
  })()

  const industryText = (() => {
    switch (industryMode) {
      case 'strict':
        return 'searched industry is required'
      case 'flexible':
        return 'searched industry is preferred (ranked)'
      case 'ignore':
        return 'industry is not used'
      default: {
        const _exhaustive: never = industryMode
        return _exhaustive
      }
    }
  })()

  const experienceText = (() => {
    switch (experienceMode) {
      case 'strict':
        return 'must fall within the searched range'
      case 'flexible':
        return 'experience range is preferred (ranked)'
      case 'ignore':
        return 'experience is not used'
      default: {
        const _exhaustive: never = experienceMode
        return _exhaustive
      }
    }
  })()

  const skillsText = (() => {
    switch (skillsMode) {
      case 'strict':
        return `top ${requiredSkillsCount || '0'} required, the rest rank as preferences`
      case 'flexible':
        return 'skills rank as preferences'
      case 'ignore':
        return 'skills are not used'
      default: {
        const _exhaustive: never = skillsMode
        return _exhaustive
      }
    }
  })()

  const companiesText =
    includeCompanies.length === 0
      ? 'any company'
      : `only ${includeCompanies.join(', ')}`

  const exclusionsText = (() => {
    switch (excludeMode) {
      case 'current':
        return 'current employers blocked'
      case 'ever':
        return 'companies ever worked at blocked'
      case 'ignore':
        return 'no companies excluded'
      default: {
        const _exhaustive: never = excludeMode
        return _exhaustive
      }
    }
  })()

  const contactText = (() => {
    switch (contactMode) {
      case 'email':
        return 'emails retrieved when a candidate is added'
      case 'phone':
        return 'phone numbers retrieved when a candidate is added'
      case 'both':
        return 'emails & phone numbers retrieved when a candidate is added'
      default: {
        const _exhaustive: never = contactMode
        return _exhaustive
      }
    }
  })()

  return [
    {
      label: 'Job title',
      text: jobTitleText,
      active: jobTitleScope !== 'ignore',
    },
    {
      label: 'Industry',
      text: industryText,
      active: industryMode !== 'ignore',
    },
    {
      label: 'Location',
      text: locationFilterOn
        ? 'restricted to the search location radius'
        : 'location radius is not applied',
      active: locationFilterOn,
    },
    {
      label: 'Experience',
      text: experienceText,
      active: experienceMode !== 'ignore',
    },
    {
      label: 'Skills',
      text: skillsText,
      active: skillsMode !== 'ignore',
    },
    {
      label: 'Companies',
      text: companiesText,
      active: includeCompanies.length > 0,
    },
    {
      label: 'Exclusions',
      text: exclusionsText,
      active: excludeMode !== 'ignore',
    },
    {
      label: 'Contact',
      text: contactText,
      active: true,
    },
  ]
}
