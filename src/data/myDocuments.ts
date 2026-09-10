export type DocumentFileStatus = 'available' | 'needs-signature'

export type MyDocumentCategoryId =
  | 'onboarding'
  | 'medical'
  | 'performance'
  | 'identity'
  | 'licenses'
  | 'education'
  | 'address'

export type MyDocumentFile = {
  id: string
  name: string
  typeId: MyDocumentCategoryId
  status: DocumentFileStatus
  format?: string
  sizeLabel?: string
  detail: string
}

export type MyDocumentCategory = {
  id: MyDocumentCategoryId
  label: string
  documents: MyDocumentFile[]
}

export const MY_DOCUMENT_ACCEPT = '.pdf,.jpg,.jpeg,.png'
export const MY_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024

export const DOCUMENT_TYPE_OPTIONS: Array<{
  id: MyDocumentCategoryId
  label: string
}> = [
  { id: 'onboarding', label: 'Onboarding Documents' },
  { id: 'medical', label: 'Medical Reports' },
  { id: 'performance', label: 'Performance Appraisal' },
  { id: 'identity', label: 'Identity Documents' },
  { id: 'licenses', label: 'Licenses' },
  { id: 'education', label: 'Education Documents' },
  { id: 'address', label: 'Address Proof' },
]

export const MY_DOCUMENTS: MyDocumentFile[] = [
  {
    id: 'doc-offer-letter',
    name: 'Signed Offer Letter',
    typeId: 'onboarding',
    status: 'available',
    format: 'PDF',
    sizeLabel: '0.8 MB',
    detail: 'Signed Mar 1',
  },
  {
    id: 'doc-visa-form',
    name: 'Visa Application Form',
    typeId: 'onboarding',
    status: 'available',
    format: 'PDF',
    sizeLabel: '2.7 MB',
    detail: 'Submitted Mar 1',
  },
  {
    id: 'doc-medical-clearance',
    name: 'Medical Clearance',
    typeId: 'medical',
    status: 'available',
    format: 'PDF',
    sizeLabel: '1.1 MB',
    detail: 'Uploaded Mar 13',
  },
  {
    id: 'doc-passport',
    name: 'Passport Copy',
    typeId: 'identity',
    status: 'available',
    format: 'PDF',
    sizeLabel: '2.1 MB',
    detail: 'Uploaded Mar 2',
  },
  {
    id: 'doc-national-id',
    name: 'National ID',
    typeId: 'identity',
    status: 'available',
    format: 'PDF',
    sizeLabel: '1.4 MB',
    detail: 'Uploaded Mar 2',
  },
  {
    id: 'doc-academic',
    name: 'Academic Certificates',
    typeId: 'education',
    status: 'available',
    format: 'PDF',
    sizeLabel: '3.8 MB',
    detail: 'Uploaded Mar 14',
  },
]

export function documentTypeLabel(typeId: MyDocumentCategoryId): string {
  switch (typeId) {
    case 'onboarding':
      return 'Onboarding Documents'
    case 'medical':
      return 'Medical Reports'
    case 'performance':
      return 'Performance Appraisal'
    case 'identity':
      return 'Identity Documents'
    case 'licenses':
      return 'Licenses'
    case 'education':
      return 'Education Documents'
    case 'address':
      return 'Address Proof'
    default: {
      const _exhaustive: never = typeId
      return _exhaustive
    }
  }
}

export function getMyDocuments(): MyDocumentFile[] {
  return MY_DOCUMENTS.map((document) => ({ ...document }))
}

export function getMyDocumentCategories(): MyDocumentCategory[] {
  const documents = getMyDocuments()
  return DOCUMENT_TYPE_OPTIONS.map((option) => ({
    id: option.id,
    label: option.label,
    documents: documents.filter((document) => document.typeId === option.id),
  }))
}

export function filterMyDocuments(
  documents: MyDocumentFile[],
  typeId: MyDocumentCategoryId | '',
): MyDocumentFile[] {
  if (!typeId) return documents
  return documents.filter((document) => document.typeId === typeId)
}

export function parseDocumentTypeFilter(
  value: string,
): MyDocumentCategoryId | '' {
  if (DOCUMENT_TYPE_OPTIONS.some((option) => option.id === value)) {
    return value as MyDocumentCategoryId
  }
  return ''
}

export function documentFileMetaLine(file: MyDocumentFile): string {
  const typeLabel = documentTypeLabel(file.typeId)

  switch (file.status) {
    case 'available': {
      const parts = [typeLabel, file.format, file.sizeLabel, file.detail].filter(
        (part): part is string => Boolean(part),
      )
      return parts.join(' • ')
    }
    case 'needs-signature':
      return `${typeLabel} • ${file.detail}`
    default: {
      const _exhaustive: never = file.status
      return _exhaustive
    }
  }
}

export function isAcceptedDocumentFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return (
    name.endsWith('.pdf') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg') ||
    name.endsWith('.png')
  )
}

export function formatDocumentFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    const kb = Math.max(0.1, bytes / 1024)
    return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function documentFormatFromName(fileName: string): string {
  const extension = fileName.split('.').pop()?.toUpperCase()
  if (extension === 'JPEG') return 'JPG'
  return extension ?? 'FILE'
}
