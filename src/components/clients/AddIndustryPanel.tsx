import { useEffect, useState } from 'react'
import { Button, Input, SidePanel, toast } from '../ui'

export type AddIndustryPayload = {
  name: string
}

export type AddIndustryPanelProps = {
  open: boolean
  onClose: () => void
  onSave?: (payload: AddIndustryPayload) => void
}

/**
 * Add Industry side panel — Industry Name.
 */
export function AddIndustryPanel({
  open,
  onClose,
  onSave,
}: AddIndustryPanelProps) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (!open) return
    setName('')
  }, [open])

  function handleCancel() {
    setName('')
    onClose()
  }

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('Industry Name is required')
      return
    }

    onSave?.({ name: trimmed })
    toast.success(`“${trimmed}” was created.`, {
      title: 'Industry added',
    })
    setName('')
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={handleCancel}
      title="Add Industry"
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
          id="add-industry-name"
          label="Industry Name"
          placeholder="Industry Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </SidePanel>
  )
}
