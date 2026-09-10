import { useMemo, useState } from 'react'
import { PageContainer, PageHeader } from '../components/layout'
import {
  DocumentFileRow,
  MyDocumentsDropzone,
  MyDocumentsFiltersBar,
} from '../components/my-documents'
import { toast } from '../components/ui'
import {
  documentFormatFromName,
  filterMyDocuments,
  formatDocumentFileSize,
  getMyDocuments,
  isAcceptedDocumentFile,
  MY_DOCUMENT_MAX_BYTES,
  type MyDocumentCategoryId,
  type MyDocumentFile,
} from '../data/myDocuments'

/**
 * Candidate portal — flat document list with type filter.
 */
export function MyDocumentsPage() {
  const [documents, setDocuments] = useState(getMyDocuments)
  const [typeId, setTypeId] = useState<MyDocumentCategoryId | ''>('')

  const filteredDocuments = useMemo(
    () => filterMyDocuments(documents, typeId),
    [documents, typeId],
  )

  function handleView(file: MyDocumentFile) {
    toast.success(`Opening ${file.name}.`, { title: 'My Documents' })
  }

  function handleDownload(file: MyDocumentFile) {
    toast.success(`Downloading ${file.name}.`, { title: 'My Documents' })
  }

  function handleSign(file: MyDocumentFile) {
    toast.success(`Signature started for ${file.name}.`, {
      title: 'Sign Now',
    })
  }

  function handleFiles(files: File[]) {
    const accepted: File[] = []

    for (const file of files) {
      if (!isAcceptedDocumentFile(file)) {
        toast.error(`${file.name} must be a PDF, JPG, or PNG.`, {
          title: 'My Documents',
        })
        continue
      }
      if (file.size > MY_DOCUMENT_MAX_BYTES) {
        toast.error(`${file.name} exceeds the 10 MB limit.`, {
          title: 'My Documents',
        })
        continue
      }
      accepted.push(file)
    }

    if (accepted.length === 0) return

    const uploadType: MyDocumentCategoryId = typeId === '' ? 'onboarding' : typeId
    const uploaded: MyDocumentFile[] = accepted.map((file, index) => ({
      id: `upload-${Date.now()}-${index}`,
      name: file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '),
      typeId: uploadType,
      status: 'available',
      format: documentFormatFromName(file.name),
      sizeLabel: formatDocumentFileSize(file.size),
      detail: 'Uploaded just now',
    }))

    setDocuments((current) => [...uploaded, ...current])
    toast.success(
      accepted.length === 1
        ? `${accepted[0].name} uploaded.`
        : `${accepted.length} files uploaded.`,
      { title: 'My Documents' },
    )
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        title="My Documents"
        subtitle="Store and download resumes, policies, and files attached to your applications."
      />

      <MyDocumentsDropzone onFiles={handleFiles} />
      <MyDocumentsFiltersBar typeId={typeId} onTypeChange={setTypeId} />

      {filteredDocuments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E0DDEA] bg-[#FAFAFC] px-6 py-12 text-center">
          <p className="text-sm font-semibold text-[#2D2061]">
            No documents found
          </p>
          <p className="mt-1 text-sm text-[#8B8B9E]">
            Try a different document type or upload a file.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {filteredDocuments.map((file) => (
            <li key={file.id}>
              <DocumentFileRow
                file={file}
                onView={handleView}
                onDownload={handleDownload}
                onSign={handleSign}
              />
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  )
}
