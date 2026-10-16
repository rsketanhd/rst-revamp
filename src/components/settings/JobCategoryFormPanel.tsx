import { useEffect, useState } from 'react'
import { Button, Input, Select, SidePanel } from '../ui'

export type JobCategoryFormValues = {
  categoryId: string
  name: string
  /** Comma-separated tags in the input; parsed on save. */
  tagsText: string
}

export type JobCategoryFormPanelProps = {
  open: boolean
  mode: 'create' | 'edit'
  categoryOptions: Array<{ value: string; label: string }>
  initialValues?: JobCategoryFormValues | null
  onClose: () => void
  onSubmit: (values: JobCategoryFormValues) => void
}

type FieldErrorKey = 'categoryId' | 'name'

const EMPTY: JobCategoryFormValues = {
  categoryId: '',
  name: '',
  tagsText: '',
}

/**
 * Add / Edit subcategory side panel for Jobs → Categories.
 */
export function JobCategoryFormPanel({
  open,
  mode,
  categoryOptions,
  initialValues = null,
  onClose,
  onSubmit,
}: JobCategoryFormPanelProps) {
  const [form, setForm] = useState<JobCategoryFormValues>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<FieldErrorKey, string>>>(
    {},
  )
  const isEdit = mode === 'edit'

  useEffect(() => {
    if (!open) return
    setForm(
      initialValues
        ? { ...EMPTY, ...initialValues }
        : { ...EMPTY, categoryId: categoryOptions[0]?.value ?? '' },
    )
    setErrors({})
  }, [open, initialValues, categoryOptions])

  function updateField<K extends keyof JobCategoryFormValues>(
    key: K,
    value: JobCategoryFormValues[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function validate(): boolean {
    const next: Partial<Record<FieldErrorKey, string>> = {}
    if (!form.categoryId) next.categoryId = 'Category is required'
    if (!form.name.trim()) next.name = 'Sub category name is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onSubmit({
      ...form,
      name: form.name.trim(),
      tagsText: form.tagsText.trim(),
    })
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Sub Category' : 'Add Sub Category'}
      widthClassName="w-full max-w-[28rem]"
      footerClassName="justify-end gap-3 border-t border-[#ECEAF3]"
      footer={
        <>
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
            onClick={handleSubmit}
            className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            {isEdit ? 'Save' : 'Add'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <Select
          id="job-cat-form-category"
          label="Category"
          requiredMark
          options={categoryOptions}
          value={form.categoryId}
          onChange={(event) => updateField('categoryId', event.target.value)}
          error={errors.categoryId}
        />
        <Input
          id="job-cat-form-name"
          label="Sub Category"
          requiredMark
          placeholder="e.g. Frontend"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          error={errors.name}
        />
        <Input
          id="job-cat-form-tags"
          label="Tags"
          placeholder="Comma-separated, e.g. React, TypeScript"
          value={form.tagsText}
          onChange={(event) => updateField('tagsText', event.target.value)}
        />
      </div>
    </SidePanel>
  )
}
