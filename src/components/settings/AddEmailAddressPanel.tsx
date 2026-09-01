import { useEffect, useState } from 'react'
import { Button, Input, SidePanel, toast } from '../ui'

export type EmailAddressKind = 'from' | 'reply'

export type AddEmailAddressPayload = {
  address: string
  name: string
}

export type AddEmailAddressPanelProps = {
  open: boolean
  kind: EmailAddressKind
  /** When set, panel opens in edit mode with these values filled. */
  initialValues?: AddEmailAddressPayload | null
  onClose: () => void
  onSave?: (payload: AddEmailAddressPayload) => void
}

const KIND_COPY: Record<
  EmailAddressKind,
  {
    addTitle: string
    editTitle: string
    addressLabel: string
    addressPlaceholder: string
    nameLabel: string
    namePlaceholder: string
    addSuccessTitle: string
    editSuccessTitle: string
  }
> = {
  from: {
    addTitle: 'Add From Address',
    editTitle: 'Edit From Address',
    addressLabel: 'From Address',
    addressPlaceholder: 'Enter From Address',
    nameLabel: 'Sender Name',
    namePlaceholder: 'Enter Sender Name',
    addSuccessTitle: 'From address added',
    editSuccessTitle: 'From address updated',
  },
  reply: {
    addTitle: 'Add Reply to Address',
    editTitle: 'Edit Reply to Address',
    addressLabel: 'Reply to Address',
    addressPlaceholder: 'Enter Reply to Address',
    nameLabel: 'Reply to Name',
    namePlaceholder: 'Enter Reply to Name',
    addSuccessTitle: 'Reply-to address added',
    editSuccessTitle: 'Reply-to address updated',
  },
}

const EMPTY_DRAFT: AddEmailAddressPayload = {
  address: '',
  name: '',
}

/**
 * Campaign Settings → Email → Add / Edit From or Reply-to address side panel.
 */
export function AddEmailAddressPanel({
  open,
  kind,
  initialValues = null,
  onClose,
  onSave,
}: AddEmailAddressPanelProps) {
  const [draft, setDraft] = useState<AddEmailAddressPayload>(EMPTY_DRAFT)
  const copy = KIND_COPY[kind]
  const isEdit = Boolean(initialValues)

  useEffect(() => {
    if (!open) return
    setDraft(
      initialValues
        ? { address: initialValues.address, name: initialValues.name }
        : EMPTY_DRAFT,
    )
  }, [open, kind, initialValues?.address, initialValues?.name])

  function updateField<K extends keyof AddEmailAddressPayload>(
    key: K,
    value: AddEmailAddressPayload[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function closePanel() {
    setDraft(EMPTY_DRAFT)
    onClose()
  }

  function handleSave() {
    const address = draft.address.trim()
    const name = draft.name.trim()

    if (!address) {
      toast.error(`${copy.addressLabel} is required`)
      return
    }
    if (!name) {
      toast.error(`${copy.nameLabel} is required`)
      return
    }

    onSave?.({ address, name })
    toast.success(
      isEdit ? `${address} was updated.` : `${address} was added.`,
      {
        title: isEdit ? copy.editSuccessTitle : copy.addSuccessTitle,
      },
    )
    closePanel()
  }

  return (
    <SidePanel
      open={open}
      onClose={closePanel}
      title={isEdit ? copy.editTitle : copy.addTitle}
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
        <Input
          id={`email-address-${kind}`}
          label={copy.addressLabel}
          requiredMark
          placeholder={copy.addressPlaceholder}
          value={draft.address}
          onChange={(e) => updateField('address', e.target.value)}
        />
        <Input
          id={`email-name-${kind}`}
          label={copy.nameLabel}
          requiredMark
          placeholder={copy.namePlaceholder}
          value={draft.name}
          onChange={(e) => updateField('name', e.target.value)}
        />
      </div>
    </SidePanel>
  )
}
