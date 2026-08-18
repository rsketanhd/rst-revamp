import { useEffect, useState, type ReactNode } from 'react'
import { Globe } from 'lucide-react'
import { Button, SidePanel, toast } from '../ui'
import { cn } from '../../lib/cn'

export type GetPublicLinkPanelProps = {
  open: boolean
  onClose: () => void
  /** Interview title for messaging */
  interviewTitle: string
  /** Public share URL */
  publicUrl?: string
}

/**
 * One-Way Interview detail → Get Public Link drawer.
 */
export function GetPublicLinkPanel({
  open,
  onClose,
  interviewTitle,
  publicUrl,
}: GetPublicLinkPanelProps) {
  const resolvedUrl =
    publicUrl ??
    (typeof window !== 'undefined'
      ? `${window.location.origin}/share/interview`
      : 'https://share.example.com/ht')

  const [link, setLink] = useState(resolvedUrl)

  useEffect(() => {
    if (!open) return
    setLink(resolvedUrl)
  }, [open, resolvedUrl])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(link)
      toast.success('Public link copied to clipboard.', {
        title: 'Copy Link',
      })
    } catch {
      toast.success(`Link ready: ${link}`, { title: 'Copy Link' })
    }
  }

  function handleShare(channel: string) {
    const encoded = encodeURIComponent(link)
    const text = encodeURIComponent(interviewTitle)
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      twitter: `https://twitter.com/intent/tweet?url=${encoded}&text=${text}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${interviewTitle} ${link}`)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
      youtube: 'https://www.youtube.com',
      web: link,
    }
    const target = urls[channel]
    if (target) {
      window.open(target, '_blank', 'noopener,noreferrer')
    }
    toast.success(`Shared via ${channel}.`, { title: 'Share link' })
  }

  return (
    <SidePanel
      open={open}
      onClose={onClose}
      title="Get Public Link"
      widthClassName="w-full max-w-[28rem]"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="public-link-input"
            className="text-xs font-medium text-[#6B6B80]"
          >
            Copy Link
          </label>
          <input
            id="public-link-input"
            type="text"
            readOnly
            value={link}
            onFocus={(e) => e.currentTarget.select()}
            className={cn(
              'h-11 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061]',
              'outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
            )}
          />
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => void handleCopy()}
              className="!h-10 !rounded-md !bg-[#2D2061] px-4 text-sm font-semibold text-white hover:!bg-[#241a52]"
            >
              Copy Link
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium text-[#6B6B80]">
            Share this link via
          </p>
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#E4E1EE] bg-white px-3 py-3">
            <ShareIconButton
              label="Facebook"
              onClick={() => handleShare('facebook')}
            >
              <BrandIcon kind="facebook" />
            </ShareIconButton>
            <ShareIconButton
              label="X"
              onClick={() => handleShare('twitter')}
            >
              <BrandIcon kind="twitter" />
            </ShareIconButton>
            <ShareIconButton
              label="WhatsApp"
              onClick={() => handleShare('whatsapp')}
            >
              <BrandIcon kind="whatsapp" />
            </ShareIconButton>
            <ShareIconButton
              label="YouTube"
              onClick={() => handleShare('youtube')}
            >
              <BrandIcon kind="youtube" />
            </ShareIconButton>
            <ShareIconButton
              label="LinkedIn"
              onClick={() => handleShare('linkedin')}
            >
              <BrandIcon kind="linkedin" />
            </ShareIconButton>
            <ShareIconButton label="Web" onClick={() => handleShare('web')}>
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#5B9BC6] text-white">
                <Globe className="size-4" strokeWidth={2} aria-hidden="true" />
              </span>
            </ShareIconButton>
          </div>
        </div>
      </div>
    </SidePanel>
  )
}

function ShareIconButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex size-9 items-center justify-center outline-none transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-[#2D2061]/30"
    >
      {children}
    </button>
  )
}

type BrandKind =
  | 'facebook'
  | 'twitter'
  | 'whatsapp'
  | 'youtube'
  | 'linkedin'

function BrandIcon({ kind }: { kind: BrandKind }) {
  switch (kind) {
    case 'facebook':
      return (
        <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#1877F2" />
          <path
            d="M17.8 25v-8.1h2.7l.4-3.2h-3.1v-2c0-.9.3-1.6 1.6-1.6h1.7V7.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4h-2.8v3.2h2.8V25h3.4z"
            fill="#fff"
          />
        </svg>
      )
    case 'twitter':
      return (
        <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
          <circle cx="16" cy="16" r="16" fill="#0F1419" />
          <path
            fill="#fff"
            d="M18.9 14.3 25.2 7h-1.5l-5.5 6.3L13.8 7H8l6.6 9.6L8 25h1.5l5.8-6.6L19.2 25H25l-6.1-10.7zm-2 2.3-.7-1L10 8.1h2.3l4.3 6.1.7 1 5.7 8.1h-2.3l-4.8-6.7z"
          />
        </svg>
      )
    case 'whatsapp':
      return (
        <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
          <path
            fill="#25D366"
            d="M16.1 4C9.6 4 4.3 9.3 4.3 15.8c0 2.1.5 4 1.5 5.7L4 28l6.7-1.7c1.6.9 3.5 1.4 5.4 1.4 6.5 0 11.8-5.3 11.8-11.8S22.6 4 16.1 4z"
          />
          <path
            fill="#fff"
            d="M21.7 18.6c-.3-.1-1.6-.8-1.8-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-1-.9-1.6-1.9-1.8-2.2-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 1 .4 1.8.7 2.5.9 1 .3 1.9.3 2.6.2.8-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3 0-.1-.2-.2-.5-.3z"
          />
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="#FF0000" />
          <path fill="#fff" d="M13 10.5v11l9-5.5-9-5.5z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
          <rect width="32" height="32" rx="4" fill="#0A66C2" />
          <path
            fill="#fff"
            d="M9.4 12.9H6.2V25h3.2V12.9zM7.8 7a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8zM25.8 18.1c0-3.5-1.9-5.2-4.4-5.2-2 0-2.9 1.1-3.4 1.9v-1.6h-3.1c0 .8 0 12 0 12h3.1v-6.7c0-.4 0-.7.1-1 .3-.7.9-1.5 2-1.5 1.4 0 2 1.1 2 2.6V25h3.2v-6.9z"
          />
        </svg>
      )
    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }
}
