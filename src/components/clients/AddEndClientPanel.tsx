import { useEffect, useState } from 'react'
import { Button, Input, Select, SidePanel, toast } from '../ui'
import { CLIENT_INDUSTRY_OPTIONS } from '../../data/clients'

export type AddEndClientPayload = {
  name: string
  industry: string
}

export type AddEndClientPanelProps = {
  open: boolean
  onClose: () => void
  onSave?: (payload: AddEndClientPayload) => void
}

/**
 * Add End Client side panel — End Client Name + Industry.
 */
export function AddEndClientPanel({
  open,
  onClose,
  onSave,
}: AddEndClientPanelProps) {
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')

  useEffect(() => {
    if (!open) return
    setName('')
    setIndustry('')
  }, [open])

  function handleCancel() {
    setName('')
    setIndustry('')
    onClose()
  }

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('End Client Name is required')
      return
    }
    if (!industry) {
      toast.error('Industry is required')
      return
    }

    onSave?.({ name: trimmed, industry })
    toast.success(`“${trimmed}” was created.`, {
      title: 'End client added',
    })
    setName('')
    setIndustry('')
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={handleCancel}
      title="Add End Client"
      widthClassName="w-full max-w-[28rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            Create
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Input
          id="add-end-client-name"
          label="End Client Name"
          placeholder="End Client Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Select
          id="add-end-client-industry"
          label="Industry"
          options={CLIENT_INDUSTRY_OPTIONS}
          value={industry}
          placeholder="Select"
          onChange={(e) => setIndustry(e.target.value)}
        />
      </div>
    </SidePanel>
  )
}
