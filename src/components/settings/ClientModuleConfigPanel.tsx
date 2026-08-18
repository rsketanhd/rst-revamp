import { useEffect, useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { Button, Select, SidePanel } from '../ui'
import { cn } from '../../lib/cn'

export type ClientModuleConfigPanelProps = {
  open: boolean
  onClose: () => void
}

type FormFieldConfig = {
  id: string
  name: string
  display: boolean
  mandatory: boolean
}

const SUBMISSION_MAIL_OPTIONS = [
  'Enabled',
  'Disabled',
  'Notify Admin Only',
  'Notify Client Only',
]

const INITIAL_FIELDS: FormFieldConfig[] = [
  { id: 'rtw', name: 'Right to Work Status', display: true, mandatory: true },
  { id: 'pref-loc', name: 'Preferred Location', display: true, mandatory: true },
  { id: 'nationality', name: 'Nationality', display: true, mandatory: false },
  { id: 'notice', name: 'Notice Period', display: true, mandatory: true },
  {
    id: 'interview',
    name: 'Interview Availability',
    display: true,
    mandatory: false,
  },
  { id: 'currency', name: 'Currency', display: true, mandatory: false },
  {
    id: 'employment',
    name: 'Employment Preference',
    display: true,
    mandatory: false,
  },
  { id: 'current-sal', name: 'Current Salary', display: true, mandatory: false },
  {
    id: 'expected-sal',
    name: 'Expected Salary',
    display: true,
    mandatory: false,
  },
  {
    id: 'bill-rate',
    name: 'Expected Bill Rate',
    display: true,
    mandatory: false,
  },
  {
    id: 'pay-rate',
    name: 'Expected Pay Rate',
    display: true,
    mandatory: false,
  },
  {
    id: 'onsite',
    name: 'Willing to Work at Onsite',
    display: true,
    mandatory: false,
  },
  {
    id: 'relocate',
    name: 'Willing to Relocate',
    display: true,
    mandatory: false,
  },
  {
    id: 'rtr',
    name: 'Right to Represent',
    display: true,
    mandatory: false,
  },
  {
    id: 'work-auth',
    name: 'Work Authorisation',
    display: true,
    mandatory: false,
  },
  { id: 'location', name: 'Location', display: true, mandatory: false },
  { id: 'notes', name: 'Notes', display: true, mandatory: false },
]

const checkboxClass =
  'size-4 cursor-pointer rounded border-[#C8C5D6] accent-[#2563EB]'

/**
 * Admin Panel → Client Module → Configure side panel.
 * Layout matches the Client Module Configuration design.
 */
export function ClientModuleConfigPanel({
  open,
  onClose,
}: ClientModuleConfigPanelProps) {
  const [enableModule, setEnableModule] = useState(true)
  const [mailStatus, setMailStatus] = useState('')
  const [subdomainPrefix, setSubdomainPrefix] = useState('')
  const [showEndClientTab, setShowEndClientTab] = useState(false)
  const [fields, setFields] = useState(INITIAL_FIELDS)

  useEffect(() => {
    if (!open) return
    setEnableModule(true)
    setMailStatus('')
    setSubdomainPrefix('')
    setShowEndClientTab(false)
    setFields(INITIAL_FIELDS.map((f) => ({ ...f })))
  }, [open])

  function updateField(
    id: string,
    key: 'display' | 'mandatory',
    value: boolean,
  ) {
    setFields((current) =>
      current.map((field) => {
        if (field.id !== id) return field
        if (key === 'display') {
          return {
            ...field,
            display: value,
            mandatory: value ? field.mandatory : false,
          }
        }
        return {
          ...field,
          mandatory: value,
          display: value ? true : field.display,
        }
      }),
    )
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Client Module Configuration"
      widthClassName="w-full max-w-[44rem]"
      bodyClassName="bg-[#F0F0F4] px-4 py-4 sm:px-5"
    >
      <div className="flex flex-col gap-4">
        {/* Module configuration card */}
        <section className="rounded-xl border border-[#E4E1EE] bg-white p-4 shadow-sm sm:p-5">
          <h3 className="mb-4 text-sm font-bold text-[#2A2740]">
            Client Module Configuration
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <span className={labelClass}>Enable Client Module</span>
              <label className="inline-flex cursor-pointer items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={enableModule}
                  onChange={(e) => setEnableModule(e.target.checked)}
                  className={checkboxClass}
                />
                <span className="sr-only">Enable Client Module</span>
              </label>
            </div>

            <Select
              id="client-submission-mail"
              label="Submission Mail Status"
              options={SUBMISSION_MAIL_OPTIONS}
              value={mailStatus}
              placeholder="Select Submission Mail Status"
              onChange={(e) => setMailStatus(e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
              <span className={cn(labelClass, 'inline-flex items-center gap-1')}>
                Client Subdomain Prefix
                <HelpCircle
                  className="size-3.5 text-[#8B8B9E]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
              <input
                type="text"
                value={subdomainPrefix}
                onChange={(e) =>
                  setSubdomainPrefix(
                    e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''),
                  )
                }
                placeholder="Lowercase letters and numbers only"
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-5">
            <span className={labelClass}>Field Visibility Configuration</span>
            <div className="mt-2 rounded-lg border border-[#E4E1EE] bg-[#FAFAFC] px-3.5 py-3">
              <label className="inline-flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={showEndClientTab}
                  onChange={(e) => setShowEndClientTab(e.target.checked)}
                  className={checkboxClass}
                />
                <span className="text-sm font-medium text-[#2A2740]">
                  Show End Client Details Tab
                </span>
              </label>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Save
            </Button>
          </div>
        </section>

        {/* Form fields configuration card */}
        <section className="rounded-xl border border-[#E4E1EE] bg-white p-4 shadow-sm sm:p-5">
          <h3 className="mb-1 inline-flex items-center gap-1.5 text-sm font-bold text-[#2A2740]">
            Submission Form Fields Configuration
            <HelpCircle
              className="size-3.5 text-[#8B8B9E]"
              strokeWidth={2}
              aria-hidden="true"
            />
          </h3>

          <div className="mt-4 overflow-hidden rounded-lg border border-[#E8E6F0]">
            <div className="grid grid-cols-[minmax(0,1fr)_5rem_5.5rem] gap-2 border-b border-[#E8E6F0] bg-[#F7F6FA] px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_6rem_6.5rem]">
              <span className="text-xs font-semibold text-[#6B6B80]">
                Field Name
              </span>
              <span className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-[#6B6B80]">
                Display
                <HelpCircle className="size-3 text-[#A0A0B2]" aria-hidden="true" />
              </span>
              <span className="inline-flex items-center justify-center gap-1 text-xs font-semibold text-[#6B6B80]">
                Mandatory
                <HelpCircle className="size-3 text-[#A0A0B2]" aria-hidden="true" />
              </span>
            </div>

            <ul className="divide-y divide-[#F0EEF5]">
              {fields.map((field) => (
                <li
                  key={field.id}
                  className="grid grid-cols-[minmax(0,1fr)_5rem_5.5rem] items-center gap-2 px-3 py-2.5 sm:grid-cols-[minmax(0,1fr)_6rem_6.5rem]"
                >
                  <span className="truncate text-sm text-[#2A2740]">
                    {field.name}
                  </span>
                  <span className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={field.display}
                      onChange={(e) =>
                        updateField(field.id, 'display', e.target.checked)
                      }
                      aria-label={`Display ${field.name}`}
                      className={checkboxClass}
                    />
                  </span>
                  <span className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={field.mandatory}
                      onChange={(e) =>
                        updateField(field.id, 'mandatory', e.target.checked)
                      }
                      aria-label={`Mandatory ${field.name}`}
                      className={checkboxClass}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex justify-end">
            <Button
              type="button"
              onClick={onClose}
              className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
            >
              Save
            </Button>
          </div>
        </section>
      </div>
    </SidePanel>
  )
}

const labelClass =
  'text-[11px] font-bold uppercase tracking-[0.04em] text-[#6B6B80]'

const inputClass =
  'h-11 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10'
