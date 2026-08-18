import { useEffect, useState } from 'react'
import { Button, SidePanel, Textarea } from '../ui'
import { cn } from '../../lib/cn'

export type TalentCrmConfigPanelProps = {
  open: boolean
  onClose: () => void
}

const DEFAULTS = {
  generalConfig: `{"footer_banner": "false", "global_primary": "#750D95", "footer_branding": "false", "button_text_color": "#ffc107", "secondary_brand_transparent": "#FFF7EF"}`,
  formConfig: `{"social_profile": { "fb": true, "linkedin": true } }`,
  logoBackground: `{"default_url": "https://rs-in-assets.s3.amazonaws.com/logo/default.png", "border_url": "https://rs-in-assets.s3.amazonaws.com/logo/border.png"}`,
  invoiceTemplate: `<div class="invoice">
  <header>
    <h1>INVOICE</h1>
    <p>{{company_name}}</p>
  </header>
  <section>
    <p>Bill To: {{client_name}}</p>
    <p>Amount: {{amount}}</p>
  </section>
</div>`,
  address: 'London',
  city: 'London',
  state: 'GB',
  zip: 'W1B2',
  country: 'United Kingdom',
  twilioConfig: `{"url": "https://api.twilio.com/2010-04-01/Accounts/ACXXXXXXXX/Messages.json"}`,
  sendingMediumConfig: '',
  sendingFromEmail: '',
  sendingApiKey: '',
  sendingAccountId: '',
  sendingAuthToken: '',
}

/**
 * Admin Panel → Talent CRM → Configure side panel.
 * Layout matches the Talent CRM Configuration design.
 */
export function TalentCrmConfigPanel({
  open,
  onClose,
}: TalentCrmConfigPanelProps) {
  const [form, setForm] = useState(DEFAULTS)

  useEffect(() => {
    if (!open) return
    setForm({ ...DEFAULTS })
  }, [open])

  function updateField<K extends keyof typeof DEFAULTS>(
    key: K,
    value: (typeof DEFAULTS)[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleSave() {
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Talent CRM Configuration"
      widthClassName="w-full max-w-[52rem]"
      bodyClassName="bg-[#F0F0F4] px-4 py-4 sm:px-5"
    >
      <section className="rounded-xl border border-[#E4E1EE] bg-white p-4 shadow-sm sm:p-5">
        <header className="mb-5">
          <h3 className="text-base font-bold text-[#2A2740]">
            Talent CRM Branding & Templates
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[#8B8B9E]">
            These settings are specific configurations and updates regarding
            public Talent CRM.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          <CodeField
            label="General Config"
            value={form.generalConfig}
            onChange={(v) => updateField('generalConfig', v)}
            rows={4}
          />
          <CodeField
            label="Form Config"
            value={form.formConfig}
            onChange={(v) => updateField('formConfig', v)}
            rows={3}
          />
          <CodeField
            label="Company Logo Background"
            value={form.logoBackground}
            onChange={(v) => updateField('logoBackground', v)}
            rows={3}
          />
          <CodeField
            label="Invoice Template Details"
            value={form.invoiceTemplate}
            onChange={(v) => updateField('invoiceTemplate', v)}
            rows={6}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <TextField
              label="Address"
              value={form.address}
              onChange={(v) => updateField('address', v)}
            />
            <TextField
              label="City"
              value={form.city}
              onChange={(v) => updateField('city', v)}
            />
            <TextField
              label="State"
              value={form.state}
              onChange={(v) => updateField('state', v)}
            />
            <TextField
              label="Zip"
              value={form.zip}
              onChange={(v) => updateField('zip', v)}
            />
            <TextField
              label="Country"
              value={form.country}
              onChange={(v) => updateField('country', v)}
            />
          </div>

          <CodeField
            label="Twilio Configuration Details"
            value={form.twilioConfig}
            onChange={(v) => updateField('twilioConfig', v)}
            rows={3}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <TextField
              label="Sending Medium Config"
              value={form.sendingMediumConfig}
              onChange={(v) => updateField('sendingMediumConfig', v)}
            />
            <TextField
              label="Sending Medium Config (From Email)"
              value={form.sendingFromEmail}
              onChange={(v) => updateField('sendingFromEmail', v)}
            />
            <TextField
              label="Sending API Key"
              value={form.sendingApiKey}
              onChange={(v) => updateField('sendingApiKey', v)}
            />
            <TextField
              label="Sending Account ID"
              value={form.sendingAccountId}
              onChange={(v) => updateField('sendingAccountId', v)}
            />
            <TextField
              label="Sending Auth Token"
              value={form.sendingAuthToken}
              onChange={(v) => updateField('sendingAuthToken', v)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 !rounded-md bg-[#2D2061] px-6 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Save
          </Button>
        </div>
      </section>
    </SidePanel>
  )
}

function CodeField({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  rows?: number
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#6B6B80]">
        {label}
      </span>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="!bg-[#FAFAFC] font-mono text-[12px] leading-relaxed"
      />
    </label>
  )
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#6B6B80]">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-10 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061]',
          'outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
        )}
      />
    </label>
  )
}
