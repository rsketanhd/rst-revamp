import { useEffect, useState } from 'react'
import { Button, Input, RadioGroup, Select, SidePanel } from '../ui'
import {
  TEMPLATE_CHANNEL_OPTIONS,
  TEMPLATE_MODULE_OPTIONS,
  TEMPLATE_NAME_OPTIONS,
  TEMPLATE_TYPE_OPTIONS,
  emptyTemplateForm,
  formFromTemplate,
  type CorrespondenceTemplate,
  type TemplateChannel,
  type TemplateFormValues,
} from '../../data/templates'
import { MessageBodyEditor } from './MessageBodyEditor'

export type TemplateFormPanelProps = {
  open: boolean
  template: CorrespondenceTemplate | null
  onClose: () => void
  onSave: (form: TemplateFormValues) => void
}

export function TemplateFormPanel({
  open,
  template,
  onClose,
  onSave,
}: TemplateFormPanelProps) {
  const [form, setForm] = useState<TemplateFormValues>(emptyTemplateForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(template)

  useEffect(() => {
    if (!open) return
    setForm(template ? formFromTemplate(template) : emptyTemplateForm())
    setErrors({})
  }, [open, template])

  function updateField<K extends keyof TemplateFormValues>(
    key: K,
    value: TemplateFormValues[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function validate() {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Template name is required'
    if (!form.module) next.module = 'Template module is required'
    if (!form.type) next.type = 'Type is required'
    if (form.channel === 'email' && !form.subject.trim()) {
      next.subject = 'Email subject is required'
    }
    if (!form.body.trim()) next.body = 'Message body is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onSave(form)
    onClose()
  }

  const isEmail = form.channel === 'email'

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Template' : 'Create New Template'}
      widthClassName="w-full max-w-[36rem]"
      footer={
        <>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            {isEdit ? 'Save' : 'Create New'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <RadioGroup
          label="Template Type"
          name="template-channel"
          value={form.channel}
          options={TEMPLATE_CHANNEL_OPTIONS}
          onChange={(channel) => updateField('channel', channel as TemplateChannel)}
        />

        <Select
          id="template-name"
          label="Template Name"
          requiredMark
          options={TEMPLATE_NAME_OPTIONS}
          placeholder="Enter Template Name"
          value={form.name}
          error={errors.name}
          onChange={(event) => updateField('name', event.target.value)}
        />

        <Select
          id="template-module"
          label="Template Module"
          requiredMark
          options={TEMPLATE_MODULE_OPTIONS}
          placeholder="Select Template Module"
          value={form.module}
          error={errors.module}
          onChange={(event) => updateField('module', event.target.value)}
        />

        <Select
          id="template-type"
          label={isEmail ? 'Email Type' : 'SMS Type'}
          requiredMark
          options={TEMPLATE_TYPE_OPTIONS}
          placeholder={isEmail ? 'Select Email Type' : 'Select SMS Type'}
          value={form.type}
          error={errors.type}
          onChange={(event) => updateField('type', event.target.value)}
        />

        {isEmail ? (
          <Input
            id="template-subject"
            label="Email Subject"
            requiredMark
            placeholder="Enter Email Subject"
            value={form.subject}
            error={errors.subject}
            onChange={(event) => updateField('subject', event.target.value)}
          />
        ) : null}

        <MessageBodyEditor
          id="template-body"
          label={isEmail ? 'Email Body' : 'SMS Body'}
          value={form.body}
          error={errors.body}
          onChange={(body) => updateField('body', body)}
        />
      </div>
    </SidePanel>
  )
}
