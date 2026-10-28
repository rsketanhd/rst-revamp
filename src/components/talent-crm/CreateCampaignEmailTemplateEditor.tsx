import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'
import type { CampaignMessageTemplate } from './createCampaignData'

export type CreateCampaignEmailTemplateEditorProps = {
  open: boolean
  onClose: () => void
  onSave: (template: CampaignMessageTemplate) => void
  /** When set, the editor opens in edit mode with this template loaded. */
  template?: CampaignMessageTemplate | null
}

const EDITOR_SRC = '/email-template-editor/index.html?fresh=1'
const MESSAGE_SOURCE = 'rst-email-template-editor'
const HOST_SOURCE = 'rst-email-template-editor-host'

type EditorSavePayload = {
  type: 'save'
  template: {
    name: string
    subject: string
    preheader?: string
    body: string[]
    html?: string
    editorState?: Record<string, unknown>
  }
}

type EditorClosePayload = {
  type: 'close'
}

type EditorReadyPayload = {
  type: 'ready'
}

type EditorMessage =
  | EditorSavePayload
  | EditorClosePayload
  | EditorReadyPayload

function isEditorMessage(data: unknown): data is EditorMessage & {
  source: string
} {
  if (!data || typeof data !== 'object') return false
  const msg = data as { source?: unknown; type?: unknown }
  return (
    msg.source === MESSAGE_SOURCE &&
    (msg.type === 'save' || msg.type === 'close' || msg.type === 'ready')
  )
}

/**
 * Full-page email template editor (create or edit) via iframe.
 */
export function CreateCampaignEmailTemplateEditor({
  open,
  onClose,
  onSave,
  template = null,
}: CreateCampaignEmailTemplateEditorProps) {
  const titleId = useId()
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const templateRef = useRef(template)
  const [mounted, setMounted] = useState(open)
  /** Remount iframe each open so the HTML editor boots fresh. */
  const [frameKey, setFrameKey] = useState(0)
  const isEdit = Boolean(template)

  useEffect(() => {
    templateRef.current = template
  }, [template])

  useEffect(() => {
    if (open) {
      setMounted(true)
      setFrameKey((current) => current + 1)
      return
    }
    const timer = window.setTimeout(() => setMounted(false), 180)
    return () => window.clearTimeout(timer)
  }, [open])

  function postLoadToEditor() {
    const win = iframeRef.current?.contentWindow
    if (!win) return
    const current = templateRef.current
    win.postMessage(
      {
        source: HOST_SOURCE,
        type: 'load',
        mode: current ? 'edit' : 'create',
        template: current
          ? {
              name: current.name,
              subject: current.subject,
              preheader: current.preheader ?? '',
              body: current.body,
              editorState: current.editorState ?? null,
            }
          : null,
      },
      '*',
    )
  }

  useEffect(() => {
    if (!mounted) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onMessage(event: MessageEvent) {
      if (!isEditorMessage(event.data)) return
      if (event.data.type === 'ready') {
        postLoadToEditor()
        return
      }
      if (event.data.type === 'close') {
        onClose()
        return
      }
      const saved = event.data.template
      const current = templateRef.current
      const body =
        saved.body?.length > 0
          ? saved.body
          : ['Hi {{FirstName}},', saved.subject]
      onSave({
        id: current?.id ?? `tpl-custom-${Date.now()}`,
        name: saved.name,
        updatedAgo: 'Just now',
        subject: saved.subject,
        body,
        preheader: saved.preheader,
        editorState: saved.editorState,
      })
      onClose()
    }

    window.addEventListener('message', onMessage)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('message', onMessage)
    }
  }, [mounted, onClose, onSave])

  if (!mounted || typeof document === 'undefined') return null

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-[60] bg-[#f5f4f9] transition-opacity duration-180',
        open ? 'opacity-100' : 'pointer-events-none opacity-0',
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <h2 id={titleId} className="sr-only">
        {isEdit ? 'Edit email template' : 'Create email template'}
      </h2>
      <iframe
        key={frameKey}
        ref={iframeRef}
        title={isEdit ? 'Edit Email Template' : 'Email Template Editor'}
        src={EDITOR_SRC}
        className="h-full w-full border-0 bg-[#f5f4f9]"
        onLoad={postLoadToEditor}
      />
    </div>,
    document.body,
  )
}
