export type TemplateChannel = 'email' | 'sms'

export type CorrespondenceTemplate = {
  id: string
  name: string
  channel: TemplateChannel
  module: string
  type: string
  subject: string
  body: string
  createdDate: string
}

export type TemplateFormValues = {
  channel: TemplateChannel
  name: string
  module: string
  type: string
  subject: string
  body: string
}

export const TEMPLATE_CHANNEL_OPTIONS: Array<{
  value: TemplateChannel
  label: string
}> = [
  { value: 'email', label: 'Email' },
  { value: 'sms', label: 'SMS' },
]

export const TEMPLATE_MODULE_OPTIONS = [
  '1 Way Interview',
  '2 Way Interview',
  'Offer Management',
]

export const TEMPLATE_TYPE_OPTIONS = ['Invitation', 'Reminder', 'Offer']

export const TEMPLATE_NAME_OPTIONS = [
  'Interview Invitation',
  'Interview Reminder',
  'Offer Letter Template',
]

export const DEFAULT_TEMPLATE_BODY =
  'Hi {{First Name}} thanks for your interest in {{Company Name}} 😊'

export const INITIAL_TEMPLATES: CorrespondenceTemplate[] = [
  {
    id: 'tpl-1',
    name: 'Interview Invitation',
    channel: 'email',
    module: '1 Way Interview',
    type: 'Invitation',
    subject: 'You are invited to interview',
    body: DEFAULT_TEMPLATE_BODY,
    createdDate: '15 Jan 2024',
  },
  {
    id: 'tpl-2',
    name: 'Interview Reminder',
    channel: 'sms',
    module: '2 Way Interview',
    type: 'Reminder',
    subject: '',
    body: 'Hi {{First Name}}, reminder: your interview with {{Company Name}} is coming up.',
    createdDate: '18 Jan 2024',
  },
  {
    id: 'tpl-3',
    name: 'Offer Letter Template',
    channel: 'email',
    module: 'Offer Management',
    type: 'Offer',
    subject: 'Your offer from {{Company Name}}',
    body: 'Hi {{First Name}}, congratulations — {{Company Name}} is pleased to share your offer.',
    createdDate: '22 Jan 2024',
  },
]

export function channelLabel(channel: TemplateChannel): string {
  switch (channel) {
    case 'email':
      return 'Email'
    case 'sms':
      return 'SMS'
    default: {
      const _exhaustive: never = channel
      throw new Error(`Unhandled template channel: ${_exhaustive}`)
    }
  }
}

export function emptyTemplateForm(): TemplateFormValues {
  return {
    channel: 'email',
    name: '',
    module: '',
    type: '',
    subject: '',
    body: DEFAULT_TEMPLATE_BODY,
  }
}

export function formFromTemplate(
  template: CorrespondenceTemplate,
): TemplateFormValues {
  return {
    channel: template.channel,
    name: template.name,
    module: template.module,
    type: template.type,
    subject: template.subject ?? '',
    body: template.body ?? '',
  }
}

export function applyTemplateForm(
  form: TemplateFormValues,
  existing?: CorrespondenceTemplate | null,
): CorrespondenceTemplate {
  return {
    id: existing?.id ?? `tpl-${Date.now()}`,
    name: form.name.trim(),
    channel: form.channel,
    module: form.module,
    type: form.type,
    subject: form.channel === 'email' ? form.subject.trim() : '',
    body: form.body,
    createdDate:
      existing?.createdDate ??
      new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
  }
}
