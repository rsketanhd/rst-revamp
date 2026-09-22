export type ImportIntent = 'candidate' | 'application'

export type ImportResultStatus = 'needsReview' | 'success' | 'failed'

export type ImportParsedDetails = {
  fullName: string
  email: string
  mobile: string
  city: string
  state: string
  country: string
}

export type ImportFileItem = {
  id: string
  fileName: string
  status: ImportResultStatus
  message: string
  previewAvailable: boolean
  details: ImportParsedDetails
}

const DEFAULT_DETAILS: ImportParsedDetails = {
  fullName: 'John Hubber',
  email: '',
  mobile: '8905550401',
  city: 'New York',
  state: 'New York',
  country: 'New York',
}

function item(
  id: string,
  fileName: string,
  status: ImportResultStatus,
  message: string,
  extras?: Partial<ImportFileItem>,
): ImportFileItem {
  return {
    id,
    fileName,
    status,
    message,
    previewAvailable: status !== 'failed',
    details: { ...DEFAULT_DETAILS },
    ...extras,
  }
}

export function getBulkImportResults(): ImportFileItem[] {
  return [
    item(
      'nr-1',
      'Arun-Kumar-SoftwareEngineer.pdf',
      'needsReview',
      'Failed: Email address not found',
    ),
    item(
      'nr-2',
      'Vikram-Singh-CloudArchitect-Report.pdf',
      'needsReview',
      'Failed: Duplicate profile',
      { details: { ...DEFAULT_DETAILS, fullName: 'Vikram Singh', email: 'vikram.singh@email.com' } },
    ),
    item(
      'nr-3',
      'Priya-Nair-ProductManager.pdf',
      'needsReview',
      'Failed: Email address not found',
      { details: { ...DEFAULT_DETAILS, fullName: 'Priya Nair' } },
    ),
    item(
      'nr-4',
      'James-Okafor-BackendEngineer.pdf',
      'needsReview',
      'Failed: Duplicate profile',
      { details: { ...DEFAULT_DETAILS, fullName: 'James Okafor', email: 'james.okafor@email.com' } },
    ),
    item(
      'nr-5',
      'Sofia-Malik-DataAnalyst.pdf',
      'needsReview',
      'Failed: Email address not found',
      { details: { ...DEFAULT_DETAILS, fullName: 'Sofia Malik' } },
    ),
    item(
      'nr-6',
      'Chen-Wei-MobileDeveloper.pdf',
      'needsReview',
      'Failed: Duplicate profile',
      { details: { ...DEFAULT_DETAILS, fullName: 'Chen Wei', email: 'chen.wei@email.com' } },
    ),

    item(
      'ok-1',
      'Karna-Patel-UIUX-Resume.pdf',
      'success',
      'Success : File uploaded successfully',
      {
        details: {
          ...DEFAULT_DETAILS,
          fullName: 'Karna Patel',
          email: 'karna.patel@email.com',
        },
      },
    ),
    item(
      'ok-2',
      'Alexandra-Martinez-Resume.pdf',
      'success',
      'Success : File uploaded successfully',
      {
        details: {
          ...DEFAULT_DETAILS,
          fullName: 'Alexandra Martinez',
          email: 'alexandra.m@email.com',
        },
      },
    ),
    item(
      'ok-3',
      'Sarah-Johnson-Resume.pdf',
      'success',
      'Success : File uploaded successfully',
      {
        details: {
          ...DEFAULT_DETAILS,
          fullName: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
        },
      },
    ),
    item(
      'ok-4',
      'Henry-Walker-Resume.pdf',
      'success',
      'Success : File uploaded successfully',
      {
        details: {
          ...DEFAULT_DETAILS,
          fullName: 'Henry Walker',
          email: 'henry.walker@email.com',
        },
      },
    ),
    item(
      'ok-5',
      'Amelia-Brooks-Resume.pdf',
      'success',
      'Success : File uploaded successfully',
      {
        details: {
          ...DEFAULT_DETAILS,
          fullName: 'Amelia Brooks',
          email: 'amelia.brooks@email.com',
        },
      },
    ),
    item(
      'ok-6',
      'Daniel-Kim-Resume.pdf',
      'success',
      'Success : File uploaded successfully',
      {
        details: {
          ...DEFAULT_DETAILS,
          fullName: 'Daniel Kim',
          email: 'daniel.kim@email.com',
        },
      },
    ),
    item(
      'ok-7',
      'Laura-Jensen-Resume.pdf',
      'success',
      'Success : File uploaded successfully',
      {
        details: {
          ...DEFAULT_DETAILS,
          fullName: 'Laura Jensen',
          email: 'laura.jensen@email.com',
        },
      },
    ),
    item(
      'ok-8',
      'Noah-Ellis-Resume.pdf',
      'success',
      'Success : File uploaded successfully',
      {
        details: {
          ...DEFAULT_DETAILS,
          fullName: 'Noah Ellis',
          email: 'noah.ellis@email.com',
        },
      },
    ),
    item(
      'ok-9',
      'Aisha-Khan-Resume.pdf',
      'success',
      'Success : File uploaded successfully',
      {
        details: {
          ...DEFAULT_DETAILS,
          fullName: 'Aisha Khan',
          email: 'aisha.khan@email.com',
        },
      },
    ),
    item(
      'ok-10',
      'Leo-Martins-Resume.pdf',
      'success',
      'Success : File uploaded successfully',
      {
        details: {
          ...DEFAULT_DETAILS,
          fullName: 'Leo Martins',
          email: 'leo.martins@email.com',
        },
      },
    ),

    item(
      'fail-1',
      'John-Huber-UXDesigner.pdf',
      'failed',
      'Failed: File size limit exceeds',
      { previewAvailable: false },
    ),
    item(
      'fail-2',
      'Portfolio-Scan.bmp',
      'failed',
      'Failed: File type format not supported',
      { previewAvailable: false },
    ),
  ]
}

export function getSingleImportResult(fileName: string): ImportFileItem {
  return item(
    'single-1',
    fileName || 'JohnHuber.pdf',
    'needsReview',
    'Failed: Email address not found',
    { previewAvailable: true },
  )
}
