import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button, ConfirmDeleteModal, Input, Select, SidePanel, Textarea, toast } from '../ui'

export type AddNewFieldFormValues = {
  name: string
  category: string
  description: string
  values: string[]
}

export type AddNewFieldPanelProps = {
  open: boolean
  onClose: () => void
  /** When set, panel opens in edit mode with these values. */
  initialValues?: AddNewFieldFormValues | null
  onSubmit?: (values: AddNewFieldFormValues) => void
}

const NAME_MAX = 240
const DESCRIPTION_MAX = 5000
const VALUE_MAX = 120

const CATEGORIES_WITH_VALUES = new Set(['dropdown', 'multiselect'])

const CATEGORY_OPTIONS = [
  { value: 'text', label: 'Text' },
  { value: 'long-text', label: 'Long text' },
  { value: 'date', label: 'Date' },
  { value: 'number', label: 'Number' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'dropdown', label: 'Dropdown' },
  { value: 'multiselect', label: 'Multiselect' },
  { value: 'phone-number', label: 'Phone Number' },
  { value: 'email', label: 'Email' },
  { value: 'url', label: 'URL' },
  { value: 'radio', label: 'Radio Buttons' },
  { value: 'file-upload', label: 'File Upload' },
  { value: 'currency', label: 'Currency' },
  { value: 'percentage', label: 'Percentage' },
]

const EMPTY_FORM: AddNewFieldFormValues = {
  name: '',
  category: '',
  description: '',
  values: [],
}

function needsValues(category: string): boolean {
  return CATEGORIES_WITH_VALUES.has(category)
}

/**
 * Settings → Jobs → Add / Edit Field side panel.
 * Dropdown / Multiselect also collect option values; other categories show Description only.
 */
export function AddNewFieldPanel({
  open,
  onClose,
  initialValues = null,
  onSubmit,
}: AddNewFieldPanelProps) {
  const isEdit = Boolean(initialValues)
  const [form, setForm] = useState<AddNewFieldFormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<
    Partial<Record<'name' | 'category' | 'description' | 'values', string>>
  >({})
  const [pendingValue, setPendingValue] = useState<number | null>(null)

  useEffect(() => {
    if (!open) return
    setForm(
      initialValues
        ? {
            ...EMPTY_FORM,
            ...initialValues,
            values: initialValues.values ?? [],
          }
        : EMPTY_FORM,
    )
    setErrors({})
    setPendingValue(null)
  }, [open, initialValues])

  const showValues = needsValues(form.category)
  const showDescription = Boolean(form.category)

  function updateField<K extends keyof AddNewFieldFormValues>(
    key: K,
    value: AddNewFieldFormValues[K],
  ) {
    setForm((current) => {
      if (key === 'category' && typeof value === 'string') {
        return {
          ...current,
          category: value,
          values: needsValues(value) ? current.values : [],
        }
      }
      return { ...current, [key]: value }
    })
    setErrors((current) => {
      if (!current[key as keyof typeof current]) return current
      const next = { ...current }
      delete next[key as keyof typeof next]
      return next
    })
  }

  function addValue() {
    setForm((current) => ({
      ...current,
      values: [...current.values, ''],
    }))
    setErrors((current) => {
      if (!current.values) return current
      const next = { ...current }
      delete next.values
      return next
    })
  }

  function updateValue(index: number, value: string) {
    setForm((current) => ({
      ...current,
      values: current.values.map((entry, i) =>
        i === index ? value.slice(0, VALUE_MAX) : entry,
      ),
    }))
  }

  function removeValue(index: number) {
    setForm((current) => ({
      ...current,
      values: current.values.filter((_, i) => i !== index),
    }))
  }

  function validate(): boolean {
    const next: Partial<
      Record<'name' | 'category' | 'description' | 'values', string>
    > = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.category) next.category = 'Category is required'
    if (needsValues(form.category)) {
      const filled = form.values.map((v) => v.trim()).filter(Boolean)
      if (filled.length === 0) {
        next.values = 'Add at least one value'
      } else if (form.values.some((v) => !v.trim())) {
        next.values = 'Remove empty values or fill them in'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    const payload: AddNewFieldFormValues = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      values: needsValues(form.category)
        ? form.values.map((v) => v.trim()).filter(Boolean)
        : [],
    }
    onSubmit?.(payload)
    toast.success(
      isEdit
        ? `“${payload.name}” was updated.`
        : `“${payload.name}” was created.`,
      { title: isEdit ? 'Field updated' : 'Field created' },
    )
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Field' : 'Add New Field'}
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
            {isEdit ? 'Save' : 'Create'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Input
            id="add-field-name"
            label="Name"
            placeholder="Enter Name"
            value={form.name}
            maxLength={NAME_MAX}
            error={errors.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
          <p className="text-xs text-[#8B8B9E]">
            {form.name.length}/{NAME_MAX}
          </p>
        </div>

        <Select
          id="add-field-category"
          label="Category"
          options={CATEGORY_OPTIONS}
          value={form.category}
          placeholder="Select"
          error={errors.category}
          onChange={(e) => updateField('category', e.target.value)}
        />

        {showValues ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-sm font-medium text-ink">Values</label>
              <button
                type="button"
                onClick={addValue}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D2061] transition-colors hover:text-[#241a52]"
              >
                <Plus className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                Add value
              </button>
            </div>

            {form.values.length === 0 ? (
              <p className="rounded-md border border-dashed border-[#E0DDEA] bg-[#FAFAFC] px-3 py-3 text-xs text-[#8B8B9E]">
                No values yet. Click “Add value” to create dropdown options.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {form.values.map((value, index) => (
                  <div key={`value-${index}`} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={value}
                      maxLength={VALUE_MAX}
                      placeholder={`Enter value ${index + 1}`}
                      onChange={(e) => updateValue(index, e.target.value)}
                      className="h-11 min-w-0 flex-1 rounded-md border border-[#ddd9e8] bg-white px-3.5 text-sm text-[#2D2061] outline-none transition-colors placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                    />
                    <button
                      type="button"
                      aria-label={`Remove value ${index + 1}`}
                      onClick={() => setPendingValue(index)}
                      className="inline-flex size-9 shrink-0 items-center justify-center rounded-md text-[#8B8B9E] transition-colors hover:bg-[#F7F6FA] hover:text-[#E53935]"
                    >
                      <Trash2 className="size-4" strokeWidth={1.75} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.values ? (
              <p className="text-xs text-[#E53935]">{errors.values}</p>
            ) : null}
          </div>
        ) : null}

        {showDescription ? (
          <div className="flex flex-col gap-1.5">
            <Textarea
              id="add-field-description"
              label="Descriptions"
              placeholder="Enter Descriptions"
              rows={4}
              maxLength={DESCRIPTION_MAX}
              value={form.description}
              error={errors.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="min-h-[6.5rem] resize-y"
            />
            <p className="text-xs text-[#8B8B9E]">
              {form.description.length}/{DESCRIPTION_MAX}
            </p>
          </div>
        ) : null}
      </div>
      <ConfirmDeleteModal
        open={pendingValue !== null}
        title="Delete Value"
        itemName={pendingValue === null ? undefined : form.values[pendingValue]}
        onClose={() => setPendingValue(null)}
        onConfirm={() => {
          if (pendingValue === null) return
          removeValue(pendingValue)
          setPendingValue(null)
        }}
      />
    </SidePanel>
  )
}
