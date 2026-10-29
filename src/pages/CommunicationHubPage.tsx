import { useEffect, useMemo, useState } from 'react'
import {
  ConversationList,
  ConversationThread,
  ManageTagsPanel,
  NewConversationPanel,
  type ComposerMode,
  type NewConversationInput,
} from '../components/communication-hub'
import { PageContainer, PageHeader } from '../components/layout'
import { Button, toast } from '../components/ui'
import {
  CURRENT_RECRUITER,
  HUB_CONVERSATIONS,
  HUB_TAG_CATALOG,
  filterHubConversations,
  type HubConversation,
  type HubListFilter,
  type HubMessage,
} from '../data/communicationHub'
import { cn } from '../lib/cn'

const DESKTOP_MQ = '(min-width: 1024px)'

function nowLabel(): string {
  return new Date().toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function createSystemMessage(body: string): HubMessage {
  return {
    id: `sys-${Date.now()}`,
    kind: 'system',
    senderName: 'System',
    timestampLabel: nowLabel(),
    body,
  }
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(DESKTOP_MQ).matches : true,
  )

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_MQ)
    function sync() {
      setIsDesktop(media.matches)
    }
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return isDesktop
}

export function CommunicationHubPage() {
  const isDesktop = useIsDesktop()
  const [conversations, setConversations] =
    useState<HubConversation[]>(HUB_CONVERSATIONS)
  const [tagCatalog, setTagCatalog] = useState<string[]>([...HUB_TAG_CATALOG])
  const [selectedId, setSelectedId] = useState<string | null>(
    HUB_CONVERSATIONS[0]?.id ?? null,
  )
  /** WhatsApp-style: on mobile, thread is a separate full-screen view. */
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [listFilter, setListFilter] = useState<HubListFilter>('all')
  const [unassignedOnly, setUnassignedOnly] = useState(false)
  const [tagFilter, setTagFilter] = useState<string | null>(null)
  const [manageTagsOpen, setManageTagsOpen] = useState(false)
  const [newConversationOpen, setNewConversationOpen] = useState(false)

  const filtered = useMemo(
    () =>
      filterHubConversations(conversations, {
        query,
        listFilter,
        unassignedOnly,
        tag: tagFilter,
        recruiter: CURRENT_RECRUITER,
      }),
    [conversations, query, listFilter, unassignedOnly, tagFilter],
  )

  const selected = conversations.find((item) => item.id === selectedId) ?? null
  const showThread = isDesktop || mobileThreadOpen
  const showList = isDesktop || !mobileThreadOpen

  useEffect(() => {
    if (isDesktop) setMobileThreadOpen(false)
  }, [isDesktop])

  function updateConversation(
    id: string,
    updater: (current: HubConversation) => HubConversation,
  ) {
    setConversations((current) =>
      current.map((item) => (item.id === id ? updater(item) : item)),
    )
  }

  function selectConversation(id: string) {
    setSelectedId(id)
    setMobileThreadOpen(true)
    updateConversation(id, (item) =>
      item.unreadCount > 0 ? { ...item, unreadCount: 0 } : item,
    )
  }

  function backToList() {
    setMobileThreadOpen(false)
  }

  function handleSend(mode: ComposerMode, body: string) {
    if (!selected) return

    const message: HubMessage = {
      id: `msg-${Date.now()}`,
      kind: mode === 'internal' ? 'internal' : 'recruiter',
      senderName: CURRENT_RECRUITER,
      timestampLabel: nowLabel(),
      body,
    }

    updateConversation(selected.id, (item) => {
      let status = item.status
      if (mode === 'reply') {
        status = item.status === 'closed' ? 'open' : 'awaiting'
      }

      return {
        ...item,
        status,
        preview: body,
        timestampLabel: 'Just now',
        messages: [...item.messages, message],
      }
    })

    toast.success(mode === 'internal' ? 'Internal note added' : 'Reply sent')
  }

  function handleAddTag(tag: string) {
    if (!selected) return
    updateConversation(selected.id, (item) => ({
      ...item,
      tags: item.tags.includes(tag) ? item.tags : [...item.tags, tag],
    }))
    toast.success('Tag added', { description: tag })
  }

  function handleRemoveTag(tag: string) {
    if (!selected) return
    updateConversation(selected.id, (item) => ({
      ...item,
      tags: item.tags.filter((value) => value !== tag),
    }))
  }

  function handleResolveClose() {
    if (!selected) return
    const body = `Conversation resolved & closed by ${CURRENT_RECRUITER}`
    const systemMessage = createSystemMessage(body)
    updateConversation(selected.id, (item) => ({
      ...item,
      status: 'closed',
      unreadCount: 0,
      timestampLabel: 'Just now',
      preview: body,
      messages: [...item.messages, systemMessage],
    }))
    toast.success('Conversation closed')
  }

  function handleReopen() {
    if (!selected) return
    const body = `Conversation reopened by ${CURRENT_RECRUITER}`
    const systemMessage = createSystemMessage(body)
    updateConversation(selected.id, (item) => ({
      ...item,
      status: 'open',
      timestampLabel: 'Just now',
      preview: body,
      messages: [...item.messages, systemMessage],
    }))
    toast.success('Conversation reopened')
  }

  function handleAssignToMe() {
    if (!selected) return
    updateConversation(selected.id, (item) => ({
      ...item,
      assignedTo: CURRENT_RECRUITER,
    }))
    toast.success('Assigned to you')
  }

  function handleMarkUnread() {
    if (!selected) return
    updateConversation(selected.id, (item) => ({
      ...item,
      unreadCount: Math.max(1, item.unreadCount),
    }))
    toast.success('Marked as unread')
  }

  function handleTagCatalogChange(nextTags: string[]) {
    const nextSet = new Set(nextTags)
    setTagCatalog(nextTags)
    if (tagFilter && !nextSet.has(tagFilter)) {
      setTagFilter(null)
    }
    setConversations((current) =>
      current.map((item) => {
        const tags = item.tags.filter((tag) => nextSet.has(tag))
        return tags.length === item.tags.length ? item : { ...item, tags }
      }),
    )
  }

  function handleCreateConversation({
    candidateId,
    candidateName,
    jobTitle,
    topic,
    category,
    tag,
    firstMessage,
  }: NewConversationInput) {
    const id = `hub-${Date.now()}`
    const messages: HubMessage[] = firstMessage
      ? [
          {
            id: `msg-${Date.now()}`,
            kind: 'recruiter',
            senderName: CURRENT_RECRUITER,
            timestampLabel: nowLabel(),
            body: firstMessage,
          },
        ]
      : []

    const created: HubConversation = {
      id,
      candidateId,
      candidateName,
      jobTitle,
      company: '',
      matchPercent: null,
      preview: firstMessage || topic,
      timestampLabel: 'Just now',
      status: 'open',
      topicCount: 1,
      unreadCount: 0,
      assignedTo: CURRENT_RECRUITER,
      tags: tag ? [tag] : [],
      activeTopic: category || topic,
      messages,
    }

    setConversations((current) => [created, ...current])
    setSelectedId(id)
    setMobileThreadOpen(true)
    toast.success('Conversation started', { description: candidateName })
  }

  const mobileChatMode = mobileThreadOpen && !isDesktop

  return (
    <PageContainer
      showTopBar={!mobileChatMode}
      contentClassName={cn(
        'flex h-full min-h-0 flex-1 flex-col !overflow-y-hidden',
        mobileChatMode
          ? '!gap-0 !p-0'
          : 'gap-3 !p-3 sm:gap-4 sm:!p-5 lg:!p-6',
      )}
    >
      <PageHeader
        className={cn('shrink-0', mobileChatMode && 'hidden')}
        title="Communication Hub"
        subtitle={
          <span className="line-clamp-2 sm:line-clamp-none">
            Manage candidate conversation threads, multi-topic history, recruiter
            assignments, and document verification.
          </span>
        }
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setManageTagsOpen(true)}
              className="!h-9 w-full !rounded-md border-[#D5D2E2] px-3 text-[13px] font-semibold text-[#2D2061] sm:!h-10 sm:w-auto sm:px-4"
            >
              Manage Tags
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setNewConversationOpen(true)}
              className="!h-9 w-full !rounded-md bg-[#2D2061] px-3 text-[13px] font-semibold text-white hover:bg-[#241a4e] sm:!h-10 sm:w-auto sm:px-4"
            >
              New Conversations
            </Button>
          </>
        }
      />

      <div
        className={cn(
          'grid min-h-0 flex-1 grid-cols-1',
          isDesktop &&
            'gap-4 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)]',
        )}
      >
        <ConversationList
          conversations={filtered}
          allConversations={conversations}
          selectedId={selected?.id ?? null}
          query={query}
          listFilter={listFilter}
          unassignedOnly={unassignedOnly}
          tagFilter={tagFilter}
          tagOptions={tagCatalog}
          onQueryChange={setQuery}
          onListFilterChange={setListFilter}
          onUnassignedOnlyChange={setUnassignedOnly}
          onTagFilterChange={setTagFilter}
          onSelect={selectConversation}
          className={cn(!showList && 'hidden')}
        />

        <ConversationThread
          conversation={showThread ? selected : null}
          tagOptions={tagCatalog}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onResolveClose={handleResolveClose}
          onAssignToMe={handleAssignToMe}
          onMarkUnread={handleMarkUnread}
          onReopen={handleReopen}
          onSend={handleSend}
          onBack={backToList}
          className={cn(!showThread && 'hidden')}
        />
      </div>

      <ManageTagsPanel
        open={manageTagsOpen}
        onClose={() => setManageTagsOpen(false)}
        tags={tagCatalog}
        onChange={handleTagCatalogChange}
      />

      <NewConversationPanel
        open={newConversationOpen}
        onClose={() => setNewConversationOpen(false)}
        tagOptions={tagCatalog}
        onCreate={handleCreateConversation}
      />
    </PageContainer>
  )
}
