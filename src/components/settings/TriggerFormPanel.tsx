import { useEffect, useMemo, useState } from 'react'
import { Button, Input, RadioGroup, Select, SidePanel } from '../ui'
import {
  TRIGGER_CHANNEL_OPTIONS,
  TRIGGER_EVENT_OPTIONS,
  TRIGGER_EVENT_VALUE_OPTIONS,
  emptyTriggerForm,
  formFromTrigger,
  type NotificationTrigger,
  type TriggerFormValues,
} from '../../data/triggers'
import type { TemplateChannel } from '../../data/templates'

export type TriggerFormPanelProps = {
  open: boolean
  trigger: NotificationTrigger | null
  templateOptions: string[]
  onClose: () => void
  onSave: (form: TriggerFormValues) => void
}

export function TriggerFormPanel({
  open,
  trigger,
  templateOptions,
  onClose,
  onSave,
}: TriggerFormPanelProps) {
  const [form, setForm] = useState<TriggerFormValues>(emptyTriggerForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const isEdit = Boolean(trigger)

  const eventValues = useMemo(
    () => TRIGGER_EVENT_VALUE_OPTIONS[form.event] ?? [],
    [form.event],
  )

  useEffect(() => {
    if (!open) return
    setForm(trigger ? formFromTrigger(trigger) : emptyTriggerForm())
    setErrors({})
  }, [open, trigger])

  function updateField<K extends keyof TriggerFormValues>(
    key: K,
    value: TriggerFormValues[K],
  ) {
    setForm((current) => {
      if (key === 'event') {
        return { ...current, event: value as string, eventValue: '' }
      }
      return { ...current, [key]: value }
    })
    setErrors((current) => {
      const next = { ...current }
      delete next[key]
      if (key === 'event') delete next.eventValue
      return next
    })
  }

  function validate() {
    const next: Record<string, string> = {}
    if (!form.name.trim()) next.name = 'Trigger name is required'
    if (!form.event) next.event = 'Event is required'
    if (!form.eventValue) next.eventValue = 'Event value is required'
    if (!form.templateName) next.templateName = 'Template is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit() {
    if (!validate()) return
    onSave(form)
    onClose()
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Trigger' : 'Create New Trigger'}
      widthClassName="w-full max-w-[28rem]"
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
          label="Trigger For"
          name="trigger-channel"
          value={form.channel}
          options={TRIGGER_CHANNEL_OPTIONS}
          onChange={(channel) => updateField('channel', channel as TemplateChannel)}
        />

        <Input
          id="trigger-name"
          label="Trigger Name"
          requiredMark
          placeholder="Enter Trigger Name"
          value={form.name}
          error={errors.name}
          onChange={(event) => updateField('name', event.target.value)}
        />

        <Select
          id="trigger-event"
          label="Event"
          requiredMark
          options={TRIGGER_EVENT_OPTIONS}
          placeholder="Select Trigger Event"
          value={form.event}
          error={errors.event}
          helperText="Select the event to trigger your notification."
          onChange={(event) => updateField('event', event.target.value)}
        />

        <Select
          id="trigger-event-value"
          label="Event Value"
          requiredMark
          options={eventValues}
          placeholder="Select Event Value"
          value={form.eventValue}
          error={errors.eventValue}
          helperText="Choose the specific stage for this trigger."
          onChange={(event) => updateField('eventValue', event.target.value)}
        />

        <Select
          id="trigger-template"
          label="Template"
          requiredMark
          options={templateOptions}
          placeholder="Select Template"
          value={form.templateName}
          error={errors.templateName}
          helperText="Choose the template for seamless communication"
          onChange={(event) => updateField('templateName', event.target.value)}
        />
      </div>
    </SidePanel>
  )
}
