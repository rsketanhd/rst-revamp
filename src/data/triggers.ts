import type { TemplateChannel } from './templates'

export type NotificationTrigger = {
  id: string
  name: string
  channel: TemplateChannel
  event: string
  eventValue: string
  templateName: string
  enabled: boolean
}

export type TriggerFormValues = {
  channel: TemplateChannel
  name: string
  event: string
  eventValue: string
  templateName: string
}

export const TRIGGER_CHANNEL_OPTIONS: Array<{
  value: TemplateChannel
  label: string
}> = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
]

export const TRIGGER_EVENT_OPTIONS = [
  'Candidate Application Status',
  'Interview Schedule',
  'Offer Stage Approval',
]

export const TRIGGER_EVENT_VALUE_OPTIONS: Record<string, string[]> = {
  'Candidate Application Status': [
    'Shortlisted for Interview',
    'Rejected',
    'Hired',
  ],
  'Interview Schedule': [
    '24 Hours Before Start',
    '1 Hour Before Start',
    'Interview Completed',
  ],
  'Offer Stage Approval': [
    'Approved by Hiring Manager',
    'Offer Sent',
    'Offer Accepted',
  ],
}

export function emptyTriggerForm(): TriggerFormValues {
  return {
    channel: 'email',
    name: '',
    event: '',
    eventValue: '',
    templateName: '',
  }
}

export function formFromTrigger(trigger: NotificationTrigger): TriggerFormValues {
  return {
    channel: trigger.channel,
    name: trigger.name,
    event: trigger.event,
    eventValue: trigger.eventValue,
    templateName: trigger.templateName,
  }
}

export function applyTriggerForm(
  form: TriggerFormValues,
  existing?: NotificationTrigger | null,
): NotificationTrigger {
  return {
    id: existing?.id ?? `trg-${Date.now()}`,
    name: form.name.trim(),
    channel: form.channel,
    event: form.event,
    eventValue: form.eventValue,
    templateName: form.templateName,
    enabled: existing?.enabled ?? true,
  }
}

export const INITIAL_TRIGGERS: NotificationTrigger[] = [
  {
    id: 'trg-1',
    name: 'Immediate Invitation on Application Shortlist',
    channel: 'email',
    event: 'Candidate Application Status',
    eventValue: 'Shortlisted for Interview',
    templateName: 'Interview Invitation',
    enabled: true,
  },
  {
    id: 'trg-2',
    name: 'Automated 24h Reminder Dispatch',
    channel: 'sms',
    event: 'Interview Schedule',
    eventValue: '24 Hours Before Start',
    templateName: 'Interview Reminder',
    enabled: true,
  },
  {
    id: 'trg-3',
    name: 'Offer Letter Dispatch Trigger',
    channel: 'email',
    event: 'Offer Stage Approval',
    eventValue: 'Approved by Hiring Manager',
    templateName: 'Offer Letter Template',
    enabled: true,
  },
]
