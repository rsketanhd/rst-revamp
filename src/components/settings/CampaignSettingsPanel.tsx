import { useState, type ReactNode } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Button, ConfirmDeleteModal, toast } from '../ui'
import { SettingsPanel } from './SettingsPanel'
import { SettingsUnderlineTabs } from './SettingsUnderlineTabs'
import { SettingsPointerTabs } from './SettingsPointerTabs'
import {
  AddSmsPhonePanel,
  type AddSmsPhonePayload,
} from './AddSmsPhonePanel'
import {
  AddEmailAddressPanel,
  type AddEmailAddressPayload,
  type EmailAddressKind,
} from './AddEmailAddressPanel'
import { cn } from '../../lib/cn'

type CampaignTab =
  | 'sender'
  | 'personalization'
  | 'unsubscribe'
  | 'templates'

type Channel = 'email' | 'sms'

type EmailAddressRow = {
  id: string
  address: string
  name: string
  status: 'verified'
}

type PhoneNumberRow = {
  id: string
  phone: string
  description: string
}

type AddSection = 'from' | 'reply' | 'phone'

type EmailPanelState = {
  kind: EmailAddressKind
  row: EmailAddressRow | null
}

type PendingDelete = {
  kind: AddSection
  id: string
  label: string
}

const CAMPAIGN_TABS: Array<{ value: CampaignTab; label: string }> = [
  { value: 'sender', label: 'Sender Configuration' },
  { value: 'personalization', label: 'Personalization' },
  { value: 'unsubscribe', label: 'Unsubscribe' },
  { value: 'templates', label: 'Template Library' },
]

const CHANNEL_OPTIONS: Array<{ value: Channel; label: string }> = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
]

const DELETE_TITLES: Record<AddSection, string> = {
  from: 'Delete From Address',
  reply: 'Delete Reply to Address',
  phone: 'Delete Phone Number',
}

const DELETE_MESSAGES: Record<AddSection, string> = {
  from: 'From address removed.',
  reply: 'Reply-to address removed.',
  phone: 'Phone number removed.',
}

const TH_CLASS =
  'px-4 py-3 text-xs font-medium uppercase tracking-[0.04em] text-[#8B8B9E]'

const TD_CLASS = 'px-4 py-3.5 text-[#2A2740]'

const INITIAL_FROM_ADDRESSES: EmailAddressRow[] = [
  {
    id: 'from-1',
    address: 'ashik@sniperai.uk',
    name: 'Ashik',
    status: 'verified',
  },
  {
    id: 'from-2',
    address: 'noreply@sniperai.uk',
    name: 'Recruitment SMART',
    status: 'verified',
  },
  {
    id: 'from-3',
    address: 'careers@sniperai.uk',
    name: 'Careers Team',
    status: 'verified',
  },
]

const INITIAL_REPLY_ADDRESSES: EmailAddressRow[] = [
  {
    id: 'reply-1',
    address: 'reply@sniperai.uk',
    name: 'Recruitment SMART',
    status: 'verified',
  },
  {
    id: 'reply-2',
    address: 'support@sniperai.uk',
    name: 'Support',
    status: 'verified',
  },
]

const INITIAL_PHONE_NUMBERS: PhoneNumberRow[] = [
  { id: 'phone-1', phone: '+447455754437', description: '-' },
  { id: 'phone-2', phone: '+15067052090', description: 'ytsyr' },
  { id: 'phone-3', phone: '+447414134527', description: 'Beta' },
]

function withoutId<T extends { id: string }>(rows: T[], id: string): T[] {
  return rows.filter((row) => row.id !== id)
}

/**
 * Settings → Talent CRM → Campaign Settings.
 */
export function CampaignSettingsPanel() {
  const [tab, setTab] = useState<CampaignTab>('sender')
  const [channel, setChannel] = useState<Channel>('email')
  const [fromAddresses, setFromAddresses] = useState(INITIAL_FROM_ADDRESSES)
  const [replyAddresses, setReplyAddresses] = useState(INITIAL_REPLY_ADDRESSES)
  const [phoneNumbers, setPhoneNumbers] = useState(INITIAL_PHONE_NUMBERS)
  const [addSmsOpen, setAddSmsOpen] = useState(false)
  const [emailPanel, setEmailPanel] = useState<EmailPanelState | null>(null)
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)

  function handleAddNew(section: AddSection) {
    switch (section) {
      case 'phone':
        setAddSmsOpen(true)
        return
      case 'from':
      case 'reply':
        setEmailPanel({ kind: section, row: null })
        return
      default: {
        const _exhaustive: never = section
        return _exhaustive
      }
    }
  }

  function handleSaveSmsPhone(payload: AddSmsPhonePayload) {
    setPhoneNumbers((current) => [
      ...current,
      {
        id: `phone-${Date.now()}`,
        phone: payload.phone,
        description: payload.description,
      },
    ])
  }

  function handleSaveEmailAddress(payload: AddEmailAddressPayload) {
    if (!emailPanel) return

    if (emailPanel.row) {
      const updateRows = (current: EmailAddressRow[]) =>
        current.map((row) =>
          row.id === emailPanel.row?.id
            ? { ...row, address: payload.address, name: payload.name }
            : row,
        )
      if (emailPanel.kind === 'from') {
        setFromAddresses(updateRows)
      } else {
        setReplyAddresses(updateRows)
      }
      return
    }

    const row: EmailAddressRow = {
      id: `${emailPanel.kind}-${Date.now()}`,
      address: payload.address,
      name: payload.name,
      status: 'verified',
    }
    if (emailPanel.kind === 'from') {
      setFromAddresses((current) => [...current, row])
      return
    }
    setReplyAddresses((current) => [...current, row])
  }

  function handleEditEmail(kind: EmailAddressKind, row: EmailAddressRow) {
    setEmailPanel({ kind, row })
  }

  function requestDelete(kind: AddSection, id: string, label: string) {
    setPendingDelete({ kind, id, label })
  }

  function confirmDelete() {
    if (!pendingDelete) return
    const { kind, id, label } = pendingDelete

    switch (kind) {
      case 'from':
        setFromAddresses((current) => withoutId(current, id))
        break
      case 'reply':
        setReplyAddresses((current) => withoutId(current, id))
        break
      case 'phone':
        setPhoneNumbers((current) => withoutId(current, id))
        break
      default: {
        const _exhaustive: never = kind
        return _exhaustive
      }
    }

    setPendingDelete(null)
    toast.success(`“${label}” was removed.`, {
      title: DELETE_MESSAGES[kind],
    })
  }

  const activeTabLabel = CAMPAIGN_TABS.find(
    (option) => option.value === tab,
  )?.label

  return (
    <>
      <SettingsPanel
        title="Campaign Settings"
        description="Choose which fields to show in columns and enable for filtering."
      >
        <SettingsUnderlineTabs
          aria-label="Campaign settings sections"
          value={tab}
          onChange={setTab}
          options={CAMPAIGN_TABS}
        />

        {tab === 'sender' ? (
          <SenderTab
            channel={channel}
            onChannelChange={setChannel}
            fromAddresses={fromAddresses}
            replyAddresses={replyAddresses}
            phoneNumbers={phoneNumbers}
            onAdd={handleAddNew}
            onEditEmail={handleEditEmail}
            onRequestDelete={requestDelete}
          />
        ) : (
          <ComingSoonTab label={activeTabLabel} />
        )}
      </SettingsPanel>

      <AddSmsPhonePanel
        open={addSmsOpen}
        onClose={() => setAddSmsOpen(false)}
        onSave={handleSaveSmsPhone}
      />
      <AddEmailAddressPanel
        open={emailPanel !== null}
        kind={emailPanel?.kind ?? 'from'}
        initialValues={
          emailPanel?.row
            ? {
                address: emailPanel.row.address,
                name: emailPanel.row.name,
              }
            : null
        }
        onClose={() => setEmailPanel(null)}
        onSave={handleSaveEmailAddress}
      />

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title={pendingDelete ? DELETE_TITLES[pendingDelete.kind] : 'Delete'}
        itemName={pendingDelete?.label}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}

type SenderTabProps = {
  channel: Channel
  onChannelChange: (channel: Channel) => void
  fromAddresses: EmailAddressRow[]
  replyAddresses: EmailAddressRow[]
  phoneNumbers: PhoneNumberRow[]
  onAdd: (section: AddSection) => void
  onEditEmail: (kind: EmailAddressKind, row: EmailAddressRow) => void
  onRequestDelete: (kind: AddSection, id: string, label: string) => void
}

function SenderTab({
  channel,
  onChannelChange,
  fromAddresses,
  replyAddresses,
  phoneNumbers,
  onAdd,
  onEditEmail,
  onRequestDelete,
}: SenderTabProps) {
  return (
    <div className="flex flex-col gap-6 pt-1">
      <SettingsPointerTabs
        aria-label="Sender channel"
        value={channel}
        onChange={onChannelChange}
        options={CHANNEL_OPTIONS}
      />

      {channel === 'email' ? (
        <div className="flex flex-col gap-8">
          <AddressSection
            title="From Address"
            addressHeader="From Address"
            nameHeader="Sender Name"
            rows={fromAddresses}
            onAdd={() => onAdd('from')}
            onEdit={(row) => onEditEmail('from', row)}
            onDelete={(row) => onRequestDelete('from', row.id, row.address)}
          />
          <AddressSection
            title="Reply to Address"
            addressHeader="Reply to Address"
            nameHeader="Reply to Name"
            rows={replyAddresses}
            onAdd={() => onAdd('reply')}
            onEdit={(row) => onEditEmail('reply', row)}
            onDelete={(row) => onRequestDelete('reply', row.id, row.address)}
          />
        </div>
      ) : (
        <PhoneNumbersSection
          rows={phoneNumbers}
          onAdd={() => onAdd('phone')}
          onDelete={(row) => onRequestDelete('phone', row.id, row.phone)}
        />
      )}
    </div>
  )
}

function ComingSoonTab({ label }: { label?: string }) {
  return (
    <div className="rounded-lg border border-dashed border-[#E0DDEA] bg-[#FAFAFC] px-4 py-10 text-center">
      <p className="text-sm font-medium text-[#2D2061]">
        {label ?? 'This section'}
      </p>
      <p className="mt-1 text-sm text-[#8B8B9E]">Content coming soon.</p>
    </div>
  )
}

function AddNewButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={onClick}
      className="!h-9 !gap-1.5 !rounded-md !border-[#2D2061] !px-3.5 !text-sm !font-semibold !text-[#2D2061] hover:!bg-[#F7F6FA]"
    >
      <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
      Add New
    </Button>
  )
}

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-[#2D2061] px-2.5 py-0.5 text-[11px] font-semibold text-white">
      Verified
    </span>
  )
}

function IconActionButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-8 items-center justify-center rounded-md text-[#9A97AB] transition-colors hover:bg-[#F2F1F6] hover:text-[#2D2061]"
    >
      {children}
    </button>
  )
}

function SectionHeader({
  title,
  onAdd,
}: {
  title: string
  onAdd: () => void
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <h3 className="text-sm font-bold text-[#1F1F2E]">{title}</h3>
      <AddNewButton onClick={onAdd} />
    </div>
  )
}

function DataTable({
  minWidthClass,
  children,
}: {
  minWidthClass: string
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E8E6F0]">
      <div className="-mx-1 overflow-x-auto px-1">
        <table
          className={cn(
            'w-full border-collapse text-left text-sm',
            minWidthClass,
          )}
        >
          {children}
        </table>
      </div>
    </div>
  )
}

function stripedRowClass(index: number): string {
  return cn(
    'border-b border-[#ECEAF3] last:border-b-0',
    index % 2 === 1 ? 'bg-[#F7F7F9]' : 'bg-white',
  )
}

type AddressSectionProps = {
  title: string
  addressHeader: string
  nameHeader: string
  rows: EmailAddressRow[]
  onAdd: () => void
  onEdit: (row: EmailAddressRow) => void
  onDelete: (row: EmailAddressRow) => void
}

function AddressSection({
  title,
  addressHeader,
  nameHeader,
  rows,
  onAdd,
  onEdit,
  onDelete,
}: AddressSectionProps) {
  return (
    <section>
      <SectionHeader title={title} onAdd={onAdd} />
      <DataTable minWidthClass="min-w-[36rem]">
        <thead>
          <tr className="border-b border-[#E8E6F0] bg-white">
            <th className={TH_CLASS}>{addressHeader}</th>
            <th className={TH_CLASS}>{nameHeader}</th>
            <th className={TH_CLASS}>Status</th>
            <th className={cn(TH_CLASS, 'text-right')}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className={stripedRowClass(index)}>
              <td className={cn(TD_CLASS, 'font-medium')}>{row.address}</td>
              <td className={TD_CLASS}>{row.name}</td>
              <td className={TD_CLASS}>
                <VerifiedBadge />
              </td>
              <td className={TD_CLASS}>
                <div className="flex items-center justify-end gap-0.5">
                  <IconActionButton
                    label={`Edit ${row.address}`}
                    onClick={() => onEdit(row)}
                  >
                    <Pencil className="size-4" strokeWidth={1.75} />
                  </IconActionButton>
                  <IconActionButton
                    label={`Delete ${row.address}`}
                    onClick={() => onDelete(row)}
                  >
                    <Trash2 className="size-4" strokeWidth={1.75} />
                  </IconActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </section>
  )
}

type PhoneNumbersSectionProps = {
  rows: PhoneNumberRow[]
  onAdd: () => void
  onDelete: (row: PhoneNumberRow) => void
}

function PhoneNumbersSection({
  rows,
  onAdd,
  onDelete,
}: PhoneNumbersSectionProps) {
  return (
    <section>
      <SectionHeader title="Phone Number(s)" onAdd={onAdd} />
      <DataTable minWidthClass="min-w-[28rem]">
        <thead>
          <tr className="border-b border-[#E8E6F0] bg-white">
            <th className={TH_CLASS}>Phone Number(s)</th>
            <th className={TH_CLASS}>Description</th>
            <th className={cn(TH_CLASS, 'text-right')}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id} className={stripedRowClass(index)}>
              <td className={cn(TD_CLASS, 'font-medium')}>{row.phone}</td>
              <td className={TD_CLASS}>{row.description}</td>
              <td className={TD_CLASS}>
                <div className="flex items-center justify-end">
                  <IconActionButton
                    label={`Delete ${row.phone}`}
                    onClick={() => onDelete(row)}
                  >
                    <Trash2 className="size-4" strokeWidth={1.75} />
                  </IconActionButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </section>
  )
}
