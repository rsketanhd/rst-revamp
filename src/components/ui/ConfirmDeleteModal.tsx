import { Button } from './Button'
import { Modal } from './Modal'

export type ConfirmDeleteModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  itemName?: string
}

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title = 'Delete',
  itemName,
}: ConfirmDeleteModalProps) {
  const label = itemName?.trim()

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      className="max-w-md"
      zClassName="z-[70]"
    >
      <p className="text-sm leading-relaxed text-[#4A4A5A]">
        Are you sure you want to delete{' '}
        {label ? (
          <span className="font-semibold text-[#2D2061]">“{label}”</span>
        ) : (
          'this item'
        )}
        ? This action cannot be undone.
      </p>
      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          className="!h-10 !rounded-md !bg-[#E53935] !px-5 text-sm font-semibold text-white hover:!bg-[#C62828]"
        >
          Delete
        </Button>
      </div>
    </Modal>
  )
}
