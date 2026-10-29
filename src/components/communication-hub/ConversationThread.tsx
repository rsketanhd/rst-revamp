import { MessageSquare } from 'lucide-react'
import type { HubConversation } from '../../data/communicationHub'
import { cn } from '../../lib/cn'
import { ConversationHeader } from './ConversationHeader'
import { MessageBubble } from './MessageBubble'
import { MessageComposer, type ComposerMode } from './MessageComposer'

export type ConversationThreadProps = {
  conversation: HubConversation | null
  tagOptions: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  onResolveClose: () => void
  onAssignToMe: () => void
  onMarkUnread: () => void
  onReopen: () => void
  onSend: (mode: ComposerMode, body: string) => void
  onBack?: () => void
  className?: string
}

export function ConversationThread({
  conversation,
  tagOptions,
  onAddTag,
  onRemoveTag,
  onResolveClose,
  onAssignToMe,
  onMarkUnread,
  onReopen,
  onSend,
  onBack,
  className,
}: ConversationThreadProps) {
  if (!conversation) {
    return (
      <section
        className={cn(
          'hidden min-h-0 min-w-0 flex-1 flex-col items-center justify-center rounded-none border-0 bg-white px-6 text-center lg:flex lg:rounded-xl lg:border lg:border-[#E8E6F0]',
          className,
        )}
      >
        <span className="mb-3 inline-flex size-12 items-center justify-center rounded-full bg-[#F4F2F8] text-[#2D2061]">
          <MessageSquare className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h2 className="text-[15px] font-semibold text-[#1A1A2E]">
          Select a conversation
        </h2>
        <p className="mt-1 max-w-sm text-sm text-[#8B8B9E]">
          Choose a candidate thread from the list to view messages, reply, or add
          an internal note.
        </p>
      </section>
    )
  }

  const firstName =
    conversation.candidateName.split(/\s+/)[0] ?? conversation.candidateName

  return (
    <section
      className={cn(
        'flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-none border-0 bg-white lg:rounded-xl lg:border lg:border-[#E8E6F0]',
        className,
      )}
    >
      <ConversationHeader
        conversation={conversation}
        tagOptions={tagOptions}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onResolveClose={onResolveClose}
        onAssignToMe={onAssignToMe}
        onMarkUnread={onMarkUnread}
        onReopen={onReopen}
        onBack={onBack}
      />

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain bg-[#FAFAFC] px-3 py-3 sm:space-y-4 sm:px-5 sm:py-4">
        {conversation.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      <MessageComposer
        candidateFirstName={firstName}
        activeTopic={conversation.activeTopic}
        disabled={conversation.status === 'closed'}
        onSend={onSend}
      />
    </section>
  )
}
