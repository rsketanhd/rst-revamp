import { useEffect, useState } from 'react'
import { Button, Select, SidePanel, Textarea, toast } from '../ui'

export type AddSmsPhonePayload = {
  countryCode: string
  phone: string
  description: string
}

export type AddSmsPhonePanelProps = {
  open: boolean
  onClose: () => void
  onSave?: (payload: AddSmsPhonePayload) => void
}

const COUNTRY_CODE_OPTIONS = [
  { value: '+44', label: '+44 (UK)' },
  { value: '+1', label: '+1 (US/CA)' },
  { value: '+91', label: '+91 (IN)' },
  { value: '+971', label: '+971 (AE)' },
  { value: '+65', label: '+65 (SG)' },
  { value: '+61', label: '+61 (AU)' },
]

/** Demo numbers available after a country code is selected. */
const PHONES_BY_COUNTRY: Record<string, string[]> = {
  '+44': ['+447455754437', '+447414134527', '+447700900123'],
  '+1': ['+15067052090', '+14155552671', '+12125550123'],
  '+91': ['+919876543210', '+919811122233'],
  '+971': ['+971501234567', '+971552223344'],
  '+65': ['+6591234567', '+6587654321'],
  '+61': ['+61412345678', '+61487654321'],
}

const PHONE_OPTIONS_BY_COUNTRY: Record<
  string,
  Array<{ value: string; label: string }>
> = Object.fromEntries(
  Object.entries(PHONES_BY_COUNTRY).map(([code, phones]) => [
    code,
    phones.map((phone) => ({ value: phone, label: phone })),
  ]),
)

const EMPTY_DRAFT: AddSmsPhonePayload = {
  countryCode: '',
  phone: '',
  description: '',
}

/**
 * Campaign Settings → SMS → Add New phone number side panel.
 */
export function AddSmsPhonePanel({
  open,
  onClose,
  onSave,
}: AddSmsPhonePanelProps) {
  const [draft, setDraft] = useState<AddSmsPhonePayload>(EMPTY_DRAFT)

  useEffect(() => {
    if (!open) return
    setDraft(EMPTY_DRAFT)
  }, [open])

  const phoneOptions = draft.countryCode
    ? (PHONE_OPTIONS_BY_COUNTRY[draft.countryCode] ?? [])
    : []

  function updateField<K extends keyof AddSmsPhonePayload>(
    key: K,
    value: AddSmsPhonePayload[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function closePanel() {
    setDraft(EMPTY_DRAFT)
    onClose()
  }

  function handleCountryChange(countryCode: string) {
    setDraft((current) => ({
      ...current,
      countryCode,
      phone: '',
    }))
  }

  function handleSave() {
    if (!draft.countryCode) {
      toast.error('Country code is required')
      return
    }
    if (!draft.phone) {
      toast.error('Phone number is required')
      return
    }

    onSave?.({
      countryCode: draft.countryCode,
      phone: draft.phone,
      description: draft.description.trim() || '-',
    })
    toast.success(`${draft.phone} was added.`, {
      title: 'Phone number added',
    })
    closePanel()
  }

  return (
    <SidePanel
      open={open}
      onClose={closePanel}
      title="Add New"
      widthClassName="w-full max-w-[28rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={closePanel}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id="sms-country-code"
            label="Country code"
            options={COUNTRY_CODE_OPTIONS}
            value={draft.countryCode}
            placeholder="Code"
            onChange={(e) => handleCountryChange(e.target.value)}
          />
          <Select
            id="sms-phone-number"
            label="Phone number"
            options={phoneOptions}
            value={draft.phone}
            placeholder="Select country first"
            disabled={!draft.countryCode}
            onChange={(e) => updateField('phone', e.target.value)}
          />
        </div>
        <Textarea
          id="sms-phone-description"
          label="Description"
          placeholder="Enter description"
          rows={4}
          value={draft.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </div>
    </SidePanel>
  )
}
