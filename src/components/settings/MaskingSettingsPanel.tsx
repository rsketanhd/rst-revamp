import { useMemo, useState } from 'react'
import { Checkbox, Select, Switch } from '../ui'
import { cn } from '../../lib/cn'
import { InfoHint } from './OneWaySettingsChrome'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'

type ApplyScope = 'all-candidates' | 'all-jobs' | 'specific-jobs'

type HideMode = 'hide-all' | 'hide-email-keep-domain'

type MaskField = {
  id: string
  label: string
  hidden: boolean
  mode: HideMode
  sample: string
}

const MASK_CHAR_OPTIONS = [
  { value: '*', label: '*' },
  { value: '•', label: '•' },
  { value: 'X', label: 'X' },
  { value: '-', label: '-' },
]

const REVEAL_WHEN_OPTIONS = [
  { value: 'stage', label: 'When they reach stage' },
  { value: 'never', label: 'Never auto-reveal' },
]

const STAGE_OPTIONS = [
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'hired', label: 'Hired' },
]

const INITIAL_FIELDS: MaskField[] = [
  { id: 'name', label: 'Name', hidden: true, mode: 'hide-all', sample: 'John Huber' },
  {
    id: 'email',
    label: 'Email',
    hidden: true,
    mode: 'hide-email-keep-domain',
    sample: 'johnhuber@gmail.com',
  },
  { id: 'phone', label: 'Contact No', hidden: true, mode: 'hide-all', sample: '+1 555 014 8821' },
  {
    id: 'linkedin',
    label: 'LinkedIn URL',
    hidden: true,
    mode: 'hide-all',
    sample: 'linkedin.com/in/johnhuber',
  },
  { id: 'city', label: 'City', hidden: true, mode: 'hide-all', sample: 'Austin' },
  { id: 'state', label: 'State', hidden: true, mode: 'hide-all', sample: 'Texas' },
  { id: 'country', label: 'Country', hidden: true, mode: 'hide-all', sample: 'USA' },
  { id: 'zip', label: 'Zip', hidden: true, mode: 'hide-all', sample: '78701' },
  {
    id: 'preferred-location',
    label: 'Job Preferred Location',
    hidden: true,
    mode: 'hide-all',
    sample: 'Remote / Austin',
  },
  { id: 'address', label: 'Address', hidden: true, mode: 'hide-all', sample: '1200 Congress Ave' },
  {
    id: 'current-employer',
    label: 'Current Employer',
    hidden: true,
    mode: 'hide-all',
    sample: 'Acme Corp',
  },
  { id: 'salary', label: 'Expected Salary', hidden: true, mode: 'hide-all', sample: '$120,000' },
  { id: 'notice', label: 'Notice Period', hidden: true, mode: 'hide-all', sample: '30 days' },
  { id: 'source', label: 'Source', hidden: false, mode: 'hide-all', sample: 'LinkedIn' },
  { id: 'skills', label: 'Skills', hidden: false, mode: 'hide-all', sample: 'React, TypeScript' },
]

/**
 * Settings → Module Configuration → Candidates → Masking.
 */
export function MaskingSettingsPanel() {
  const [maskingOn, setMaskingOn] = useState(true)
  const [applyTo, setApplyTo] = useState<ApplyScope>('all-candidates')
  const [recruiterCanDisable, setRecruiterCanDisable] = useState(true)
  const [maskChar, setMaskChar] = useState('*')
  const [fields, setFields] = useState(INITIAL_FIELDS)
  const [adminsUnmasked, setAdminsUnmasked] = useState(true)
  const [jobRecruiterUnmasked, setJobRecruiterUnmasked] = useState(false)
  const [revealWhen, setRevealWhen] = useState('stage')
  const [revealStage, setRevealStage] = useState('interview')
  const [hideInExports, setHideInExports] = useState(true)
  const [hideResume, setHideResume] = useState(true)

  const hiddenCount = useMemo(
    () => fields.filter((field) => field.hidden).length,
    [fields],
  )

  function patchField(id: string, patch: Partial<MaskField>) {
    setFields((current) =>
      current.map((field) => (field.id === id ? { ...field, ...patch } : field)),
    )
  }

  function setAllHidden(hidden: boolean) {
    setFields((current) => current.map((field) => ({ ...field, hidden })))
  }

  return (
    <SettingsPanel
      eyebrow="Candidates"
      title="Masking"
      description="Hide candidate details inside jobs. Only Super Users can change these settings."
    >
      <SettingsBlock
        title="Hide Candidate Details"
        trailing={
          <Switch
            checked={maskingOn}
            onCheckedChange={setMaskingOn}
            aria-label="Hide Candidate Details"
          />
        }
      >
        <div
          className={cn(
            'flex flex-col gap-5',
            !maskingOn && 'pointer-events-none opacity-50',
          )}
        >
          <fieldset>
            <legend className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2A2740]">
              Apply to
              <InfoHint label="Choose which candidates and jobs masking applies to." />
            </legend>
            <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
              <ApplyRadio
                name="mask-apply-to"
                value="all-candidates"
                checked={applyTo === 'all-candidates'}
                label="All Candidates"
                onChange={setApplyTo}
              />
              <ApplyRadio
                name="mask-apply-to"
                value="all-jobs"
                checked={applyTo === 'all-jobs'}
                label="Candidate details in all Jobs"
                onChange={setApplyTo}
              />
              <ApplyRadio
                name="mask-apply-to"
                value="specific-jobs"
                checked={applyTo === 'specific-jobs'}
                label="Candidate details in Specific Jobs"
                onChange={setApplyTo}
              />
            </div>
            <p className="mt-2 text-xs text-[#8B8B9E]">
              Jobs created from now on. Existing jobs are not changed.
            </p>
          </fieldset>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2A2740]">
                Let recruiters switch it off for a job
                <InfoHint label="Allow recruiters to turn masking off on individual jobs." />
              </p>
              <p className="mt-0.5 text-xs text-[#8B8B9E]">
                Useful when only some roles need blind hiring.
              </p>
            </div>
            <Switch
              checked={recruiterCanDisable}
              onCheckedChange={setRecruiterCanDisable}
              aria-label="Let recruiters switch it off for a job"
              className="!gap-0"
            />
          </div>

          <div className="max-w-[10rem]">
            <Select
              id="masking-character"
              label="Masking character"
              labelTooltip="Character used in place of hidden text."
              value={maskChar}
              onChange={(event) => setMaskChar(event.target.value)}
              options={MASK_CHAR_OPTIONS}
              placeholder=""
              helperText={`Used in place of hidden text, e.g. ${maskChar.repeat(4)}`}
            />
          </div>
        </div>
      </SettingsBlock>

      <SettingsBlock
        title="Fields to hide"
        description={`${hiddenCount} of ${fields.length} fields hidden`}
        trailing={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAllHidden(true)}
              disabled={!maskingOn}
              className="h-8 rounded-md border border-[#D5D2E2] bg-white px-3 text-xs font-semibold text-[#2D2061] hover:bg-[#F7F6FB] disabled:opacity-50"
            >
              Hide all
            </button>
            <button
              type="button"
              onClick={() => setAllHidden(false)}
              disabled={!maskingOn}
              className="h-8 rounded-md border border-[#D5D2E2] bg-white px-3 text-xs font-semibold text-[#2D2061] hover:bg-[#F7F6FB] disabled:opacity-50"
            >
              Show all
            </button>
          </div>
        }
      >
        <div
          className={cn(
            'overflow-x-auto',
            !maskingOn && 'pointer-events-none opacity-50',
          )}
        >
          <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[#E8E6F0] text-[11px] font-semibold tracking-wide text-[#8B8B9E] uppercase">
                <th className="w-16 px-2 pb-2.5 font-semibold">Hide</th>
                <th className="px-2 pb-2.5 font-semibold">Field</th>
                <th className="px-2 pb-2.5 font-semibold">How to hide</th>
                <th className="px-2 pb-2.5 font-semibold">Recruiter sees</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr
                  key={field.id}
                  className="border-b border-[#F0EEF5] last:border-0"
                >
                  <td className="px-2 py-3 align-middle">
                    <Switch
                      checked={field.hidden}
                      onCheckedChange={(hidden) => patchField(field.id, { hidden })}
                      aria-label={`Hide ${field.label}`}
                      className="!gap-0"
                    />
                  </td>
                  <td className="px-2 py-3 align-middle font-semibold text-[#2A2740]">
                    {field.label}
                  </td>
                  <td className="px-2 py-3 align-middle">
                    <select
                      aria-label={`How to hide ${field.label}`}
                      disabled={!field.hidden}
                      value={field.mode}
                      onChange={(event) =>
                        patchField(field.id, {
                          mode: event.target.value as HideMode,
                        })
                      }
                      className="h-9 w-full max-w-[14rem] rounded-md border border-[#ddd9e8] bg-white px-2.5 text-[13px] text-[#2D2061] outline-none focus:border-[#2D2061] disabled:opacity-50"
                    >
                      <option value="hide-all">Hide all</option>
                      {field.id === 'email' ? (
                        <option value="hide-email-keep-domain">
                          Hide all but @ and ending
                        </option>
                      ) : null}
                    </select>
                  </td>
                  <td className="px-2 py-3 align-middle font-mono text-[13px] text-[#6B6B80]">
                    {field.hidden
                      ? maskPreview(field, maskChar)
                      : field.sample}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsBlock>

      <SettingsBlock
        title="Who sees real details"
        description="Masking is lifted for these roles, and for a candidate once they reach the stage you choose."
      >
        <div
          className={cn(
            'flex flex-col gap-5',
            !maskingOn && 'pointer-events-none opacity-50',
          )}
        >
          <div>
            <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2A2740]">
              Always unmasked
              <InfoHint label="These roles always see real candidate details." />
            </p>
            <p className="mt-0.5 text-xs text-[#8B8B9E]">
              These roles see real details in every job.
            </p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
              <Checkbox
                id="mask-super-users"
                label="Super Users"
                checked
                disabled
              />
              <Checkbox
                id="mask-admins"
                label="Admins"
                checked={adminsUnmasked}
                onChange={(event) => setAdminsUnmasked(event.target.checked)}
              />
              <Checkbox
                id="mask-job-recruiter"
                label="The job's recruiter"
                checked={jobRecruiterUnmasked}
                onChange={(event) => setJobRecruiterUnmasked(event.target.checked)}
              />
            </div>
          </div>

          <div>
            <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2A2740]">
              Reveal details for a candidate
              <InfoHint label="Lift masking when a candidate reaches a chosen pipeline stage." />
            </p>
            <div className="mt-2.5 flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="w-full sm:max-w-[14rem]">
                <Select
                  id="mask-reveal-when"
                  aria-label="When to reveal details"
                  value={revealWhen}
                  onChange={(event) => setRevealWhen(event.target.value)}
                  options={REVEAL_WHEN_OPTIONS}
                  placeholder=""
                />
              </div>
              {revealWhen === 'stage' ? (
                <div className="w-full sm:max-w-[12rem]">
                  <Select
                    id="mask-reveal-stage"
                    aria-label="Reveal stage"
                    value={revealStage}
                    onChange={(event) => setRevealStage(event.target.value)}
                    options={STAGE_OPTIONS}
                    placeholder=""
                  />
                </div>
              ) : null}
            </div>
            <p className="mt-1.5 text-xs text-[#8B8B9E]">
              Real details show once a candidate reaches interview.
            </p>
          </div>

          <ToggleSettingRow
            label="Also hide in exports and downloads"
            hint="Keep masked fields masked in CSV, Excel and PDF exports."
            description="Masked fields stay masked in CSV, Excel and PDF exports."
            checked={hideInExports}
            onChange={setHideInExports}
          />

          <ToggleSettingRow
            label="Hide the resume file"
            hint="Hide the original CV file so recruiters only see the parsed profile."
            description="Recruiters see the parsed profile only — the original CV usually contains the name and contact details."
            checked={hideResume}
            onChange={setHideResume}
          />
        </div>
      </SettingsBlock>
    </SettingsPanel>
  )
}

function ApplyRadio({
  name,
  value,
  checked,
  label,
  onChange,
}: {
  name: string
  value: ApplyScope
  checked: boolean
  label: string
  onChange: (value: ApplyScope) => void
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-[#2A2740]">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="size-4 accent-[#2D2061]"
      />
      {label}
    </label>
  )
}

function ToggleSettingRow({
  label,
  hint,
  description,
  checked,
  onChange,
}: {
  label: string
  hint: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2A2740]">
          {label}
          <InfoHint label={hint} />
        </p>
        <p className="mt-0.5 text-xs text-[#8B8B9E]">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        aria-label={label}
        className="!gap-0"
      />
    </div>
  )
}

function maskPreview(field: MaskField, maskChar: string): string {
  switch (field.mode) {
    case 'hide-email-keep-domain': {
      const at = field.sample.indexOf('@')
      if (at < 0) return maskChar.repeat(Math.max(field.sample.length, 4))
      const local = field.sample.slice(0, at)
      const domain = field.sample.slice(at + 1)
      const ending = domain.includes('.')
        ? domain.slice(domain.lastIndexOf('.'))
        : ''
      return `${maskChar.repeat(Math.max(local.length, 4))}@${maskChar.repeat(3)}${ending}`
    }
    case 'hide-all': {
      if (field.id === 'name') {
        return field.sample
          .split(/\s+/)
          .map((part) => maskChar.repeat(Math.max(part.length, 4)))
          .join(' ')
      }
      return maskChar.repeat(Math.max(field.sample.replace(/\s/g, '').length, 5))
    }
    default: {
      const unreachable: never = field.mode
      return unreachable
    }
  }
}
