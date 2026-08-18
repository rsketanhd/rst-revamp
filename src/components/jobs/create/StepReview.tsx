import type { ReactNode } from 'react'
import { Switch } from '../../ui'
import type { CreateJobFormState, LinkedInAllFilters } from './types'
import { ReviewField, SectionTitle, StepHeader } from './StepChrome'

type Props = {
  value: CreateJobFormState
  onChange: (patch: Partial<CreateJobFormState>) => void
  /**
   * Read-only view of all step data (no career-page toggle).
   * Used by the Jobs View/Edit side panel.
   */
  readOnly?: boolean
  /** Hide the Review step header (e.g. panel that already has a title). */
  hideHeader?: boolean
}

function text(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

function yesNo(value: boolean) {
  return value ? 'Yes' : 'No'
}

function list(values: string[]) {
  return values.length > 0 ? values.join(', ') : '—'
}

function formatLocation(city: string, state: string, country: string) {
  return [city, state, country].filter(Boolean).join(', ') || '—'
}

function methodLabel(method: CreateJobFormState['method']) {
  return method === 'copy'
    ? 'Copy from Existing Jobs'
    : 'Create From Scratch'
}

function criteriaText(item: CreateJobFormState['criteria'][number]) {
  if (item.tags && item.tags.length > 0) return item.tags.join(', ')
  return text(item.value)
}

function hasAllFilterValues(filters: LinkedInAllFilters) {
  return (
    filters.connections.length > 0 ||
    filters.followersOf.length > 0 ||
    filters.profileLanguage.length > 0 ||
    Boolean(filters.connectionDegree) ||
    Boolean(filters.openTo) ||
    filters.firstName.length > 0 ||
    filters.lastName.length > 0 ||
    filters.titleAdvanced.length > 0 ||
    filters.companyKeyword.length > 0 ||
    filters.schoolKeyword.length > 0
  )
}

export function StepReview({
  value,
  onChange,
  readOnly = false,
  hideHeader = false,
}: Props) {
  const secondaryLocation = value.sameAsPrimary
    ? formatLocation(
        value.primaryCity,
        value.primaryState,
        value.primaryCountry,
      )
    : formatLocation(
        value.secondaryCity,
        value.secondaryState,
        value.secondaryCountry,
      )

  const sources = [
    value.rsPlusEnabled ? 'RS Plus' : null,
    value.linkedInEnabled ? 'LinkedIn' : null,
  ].filter(Boolean) as string[]

  const companyScope = [
    value.companyCurrent ? 'Current' : null,
    value.companyPast ? 'Past' : null,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div>
      {!hideHeader ? (
        <StepHeader
          title="Review"
          description="Review everything you entered across each step before creating the job."
        />
      ) : null}

      {readOnly ? (
        <div className="mb-6">
          <ReviewField
            label="Visible on Career Page"
            value={yesNo(value.visibleOnCareerPage)}
          />
        </div>
      ) : (
        <div className="mb-6 rounded-xl border border-[#e4e1ee] px-4 py-3.5">
          <Switch
            label="Visible on Career Page"
            description="When enabled, this job will appear on your public careers page and candidates can apply."
            checked={value.visibleOnCareerPage}
            onCheckedChange={(visibleOnCareerPage) =>
              onChange({ visibleOnCareerPage })
            }
          />
        </div>
      )}

      {/* 1. Create Job */}
      <ReviewSection title="Create Job">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReviewField label="Creation Method" value={methodLabel(value.method)} />
          <ReviewField label="Job Req. ID" value={text(value.jobReqId)} />
          <ReviewField label="Job Title" value={text(value.jobTitle)} />
        </div>
        <div className="mt-4">
          <p className="text-xs text-[#8B8B9E]">Job Description</p>
          <p className="mt-1 whitespace-pre-wrap text-sm font-semibold leading-relaxed text-[#1a1a2e]">
            {text(value.jobDescription)}
          </p>
        </div>
      </ReviewSection>

      {/* 2. Job Details */}
      <ReviewSection title="Job Details">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8B8B9E]">
          Location & Eligibility
        </p>
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ReviewField
            label="Location (Primary)"
            value={formatLocation(
              value.primaryCity,
              value.primaryState,
              value.primaryCountry,
            )}
          />
          <ReviewField label="Location (Secondary)" value={secondaryLocation} />
          <ReviewField
            label="Same as Primary"
            value={yesNo(value.sameAsPrimary)}
          />
          <ReviewField label="Job Radius" value={text(value.jobRadius)} />
          <ReviewField
            label="Experience"
            value={`${value.experienceMin}–${value.experienceMax} Years`}
          />
          <ReviewField
            label="Location Requirement"
            value={text(value.locationRequirement)}
          />
          <ReviewField label="Job Type" value={text(value.jobType)} />
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8B8B9E]">
          Organization
        </p>
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ReviewField label="Client" value={text(value.client)} />
          <ReviewField label="Project" value={text(value.project)} />
          <ReviewField label="Department" value={text(value.department)} />
          <ReviewField label="Division" value={text(value.division)} />
          <ReviewField label="Band" value={text(value.band)} />
          <ReviewField
            label="Support Recruiter"
            value={text(value.supportRecruiter)}
          />
          <ReviewField label="Start Date" value={text(value.startDate)} />
          <ReviewField label="End Date" value={text(value.endDate)} />
          <ReviewField
            label="Mask Recruitment Details"
            value={yesNo(value.maskRecruitment)}
          />
        </div>

        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8B8B9E]">
          Classification
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ReviewField label="Industry" value={text(value.industry)} />
          <ReviewField label="Job Category" value={text(value.jobCategory)} />
          <ReviewField
            label="Job Sub Category"
            value={text(value.jobSubCategory)}
          />
          <ReviewField
            label="Mask Classification Details"
            value={yesNo(value.maskClassification)}
          />
        </div>
      </ReviewSection>

      {/* 3. Job Analyzer */}
      <ReviewSection title="Job Analyzer">
        {value.criteria.length === 0 ? (
          <p className="text-sm text-[#8B8B9E]">No analyzer criteria set.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {value.criteria.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-[#eceaf3] bg-[#FAFAFC] px-3.5 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-[#2D2061]">
                      {item.label}
                    </p>
                    {item.badge ? (
                      <span className="rounded bg-[#E8E4F5] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#5B4B9E]">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#6B6B80]">
                    <span>
                      Source:{' '}
                      <span className="font-semibold text-[#2D2061]">
                        {item.source === 'new' ? 'New' : 'Old'}
                      </span>
                    </span>
                    <span>
                      Weight:{' '}
                      <span className="font-semibold text-[#2D2061]">
                        {item.weight}%
                      </span>
                    </span>
                  </div>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-[#1a1a2e]">
                  {criteriaText(item)}
                </p>
              </div>
            ))}
          </div>
        )}
      </ReviewSection>

      {/* 4. Client Details */}
      <ReviewSection title="Client Details">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ReviewField label="Client" value={text(value.client)} />
          <ReviewField
            label="Client Contact"
            value={text(value.clientContact)}
          />
          <ReviewField
            label="Client Contact (Secondary)"
            value={text(value.clientContactSecondary)}
          />
          <ReviewField
            label="Client Industry"
            value={text(value.clientIndustry)}
          />
        </div>
      </ReviewSection>

      {/* 5. Job Boards */}
      <ReviewSection title="Job Boards">
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ReviewField label="Sources" value={list(sources)} />
          <ReviewField
            label="LinkedIn Status"
            value={
              value.linkedInEnabled
                ? value.linkedInConnected
                  ? 'Connected'
                  : 'Not Connected'
                : '—'
            }
          />
          {value.linkedInConnected ? (
            <ReviewField
              label="LinkedIn Last Synced"
              value={text(value.linkedInLastSynced)}
            />
          ) : null}
        </div>

        {value.rsPlusEnabled ? (
          <div className="mb-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8B8B9E]">
              RS Plus Filters
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <ReviewField label="Industry" value={list(value.industries)} />
              <ReviewField label="Company" value={list(value.companies)} />
              <ReviewField
                label="Company Scope"
                value={companyScope || '—'}
              />
              <ReviewField
                label="Exclude Company"
                value={list(value.excludeCompanies)}
              />
              <ReviewField label="Location" value={list(value.locations)} />
              <ReviewField
                label="RS Plus Candidates Count"
                value={text(value.rsPlusCandidatesCount)}
              />
            </div>
          </div>
        ) : null}

        {value.linkedInEnabled ? (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8B8B9E]">
              LinkedIn Filters
            </p>
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <ReviewField
                label="Keywords"
                value={text(value.linkedInKeywords)}
              />
              <ReviewField
                label="Location"
                value={list(value.linkedInLocations)}
              />
              <ReviewField
                label="Job Title"
                value={list(value.linkedInJobTitles)}
              />
            </div>

            {hasAllFilterValues(value.linkedInAllFilters) ? (
              <>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#8B8B9E]">
                  LinkedIn All Filters
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <ReviewField
                    label="Connections"
                    value={list(value.linkedInAllFilters.connections)}
                  />
                  <ReviewField
                    label="Followers Of"
                    value={list(value.linkedInAllFilters.followersOf)}
                  />
                  <ReviewField
                    label="Profile Language"
                    value={list(value.linkedInAllFilters.profileLanguage)}
                  />
                  <ReviewField
                    label="Connection Degree"
                    value={text(value.linkedInAllFilters.connectionDegree)}
                  />
                  <ReviewField
                    label="Open To"
                    value={text(value.linkedInAllFilters.openTo)}
                  />
                  <ReviewField
                    label="First Name (Advanced)"
                    value={list(value.linkedInAllFilters.firstName)}
                  />
                  <ReviewField
                    label="Last Name (Advanced)"
                    value={list(value.linkedInAllFilters.lastName)}
                  />
                  <ReviewField
                    label="Title (Advanced)"
                    value={list(value.linkedInAllFilters.titleAdvanced)}
                  />
                  <ReviewField
                    label="Company Keyword (Advanced)"
                    value={list(value.linkedInAllFilters.companyKeyword)}
                  />
                  <ReviewField
                    label="School Keyword (Advanced)"
                    value={list(value.linkedInAllFilters.schoolKeyword)}
                  />
                </div>
              </>
            ) : null}
          </div>
        ) : null}

        {!value.rsPlusEnabled && !value.linkedInEnabled ? (
          <p className="text-sm text-[#8B8B9E]">No job board sources selected.</p>
        ) : null}
      </ReviewSection>
    </div>
  )
}

function ReviewSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="mb-8 last:mb-2">
      <SectionTitle>{title}</SectionTitle>
      {children}
    </section>
  )
}
