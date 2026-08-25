export const CREATE_CLIENT_STEPS = [
  { id: 'clientDetails', label: 'Client Details' },
  { id: 'clientUserDetails', label: 'Client User Details' },
  { id: 'agencyPoc', label: 'Agency POC' },
  { id: 'attachments', label: 'Attachments' },
] as const

export type ClientUserRow = {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  locked?: boolean
}

export type ClientAttachment = {
  id: string
  documentName: string
  description: string
}

export type CreateClientFormState = {
  clientSubdomain: string
  fullName: string
  domain1: string
  domain2: string
  domain3: string
  location1: string
  location2: string
  location3: string
  websiteLink1: string
  websiteLink2: string
  clientIndustry: string
  status: string
  users: ClientUserRow[]
  draftUser: Omit<ClientUserRow, 'id' | 'locked'>
  agencyPoc: string
  leadRecruiter: string
  attachments: ClientAttachment[]
}

export const defaultCreateClientForm: CreateClientFormState = {
  clientSubdomain: '',
  fullName: '',
  domain1: '',
  domain2: '',
  domain3: '',
  location1: '',
  location2: '',
  location3: '',
  websiteLink1: '',
  websiteLink2: '',
  clientIndustry: '',
  status: 'Active',
  users: [
    {
      id: 'user-1',
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@sai.com',
      role: 'Admin',
      locked: false,
    },
  ],
  draftUser: {
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  },
  agencyPoc: '',
  leadRecruiter: '',
  attachments: [
    {
      id: 'att-1',
      documentName: 'CV Cover Letter.pdf',
      description: 'Cover Letter',
    },
  ],
}
