import {
  useEffect,
  useId,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Check,
  CircleDot,
  Download,
  FileText,
  ImagePlus,
  Maximize2,
  Mic,
  Minimize2,
  Paperclip,
  Pin,
  Plus,
  Search,
  Send,
  Sparkles,
  Table2,
  Trash2,
  X,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { getUserRole } from '../../lib/auth'
import { AreaLineChart, VerticalBarChart } from '../reports'
import {
  filterCopilotThreads,
  getCopilotChatThreads,
  getThreadMessages,
  newCopilotChatThread,
  sortCopilotThreads,
  type CopilotChatThread,
  type CopilotHistoryMessage,
} from '../../data/copilotChatHistory'
import { copilotChatReply } from '../../data/copilotInterview'
import {
  createScenarioState,
  freeTextScenarioHint,
  handleScenarioAction,
  recruiterFreeTextStart,
  scenarioPickerContent,
  startScenario,
  type CopilotBotContent,
  type CopilotChip,
  type CopilotFormField,
  type CopilotScenarioState,
} from '../../data/copilotScenarios'
import { Modal, ThreeDotsMenu, Tooltip, toast } from '../ui'

export type CopilotChatPanelProps = {
  open: boolean
  onClose: () => void
  onMaximizedChange?: (maximized: boolean) => void
}

type ChatMessage = CopilotHistoryMessage

type PendingAttachment = {
  id: string
  name: string
  kind: 'photo' | 'file'
}

type ThreadSnapshot = {
  messages: ChatMessage[]
  scenarioState: CopilotScenarioState
}

const headerIconClass =
  'inline-flex size-8 items-center justify-center rounded-md text-[#4B4A66] transition-colors hover:bg-[#F4F4FB]'

function showCopilotToast(message: string) {
  toast.success(message, { title: 'AI Copilot' })
}

function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function clearTimer(timer: MutableRefObject<number | null>) {
  if (timer.current == null) return
  window.clearTimeout(timer.current)
  timer.current = null
}

function welcomeMessages(role: ReturnType<typeof getUserRole>): ChatMessage[] {
  return [
    { id: 'welcome', role: 'bot', content: scenarioPickerContent(role) },
  ]
}

function buildInitialSnapshots(
  role: ReturnType<typeof getUserRole>,
): Record<string, ThreadSnapshot> {
  return Object.fromEntries(
    getCopilotChatThreads(role).map((thread) => [
      thread.id,
      {
        messages: getThreadMessages(thread.id, role),
        scenarioState: createScenarioState(),
      },
    ]),
  )
}

function previewFromMessages(messages: ChatMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const message = messages[i]
    if (!message) continue
    if (message.role === 'me') return message.text
    if (message.content.text) return message.content.text
    if (message.content.title) return message.content.title
  }
  return 'Start a new conversation with Copilot'
}

export function CopilotChatPanel({
  open,
  onClose,
  onMaximizedChange,
}: CopilotChatPanelProps) {
  const navigate = useNavigate()
  const userRole = getUserRole()
  const seedThreads = getCopilotChatThreads(userRole)
  const defaultThreadId = seedThreads[0]?.id ?? 'current'
  const [maximized, setMaximized] = useState(false)
  const [threads, setThreads] = useState(() => sortCopilotThreads(seedThreads))
  const [activeThreadId, setActiveThreadId] = useState(defaultThreadId)
  const [threadSnapshots, setThreadSnapshots] = useState(() =>
    buildInitialSnapshots(userRole),
  )
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getThreadMessages(defaultThreadId, userRole),
  )
  const [scenarioState, setScenarioState] = useState<CopilotScenarioState>(
    createScenarioState,
  )
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const [attachments, setAttachments] = useState<PendingAttachment[]>([])
  const [listening, setListening] = useState(false)
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const followUpTimer = useRef<number | null>(null)
  const listenTimer = useRef<number | null>(null)
  const activeThreadIdRef = useRef(activeThreadId)
  const messagesRef = useRef(messages)
  const scenarioStateRef = useRef(scenarioState)

  useEffect(() => {
    activeThreadIdRef.current = activeThreadId
  }, [activeThreadId])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    scenarioStateRef.current = scenarioState
  }, [scenarioState])

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, typing, open, maximized, activeThreadId])

  useEffect(() => {
    return () => {
      clearTimer(followUpTimer)
      clearTimer(listenTimer)
    }
  }, [])

  useEffect(() => {
    if (open) return
    setMaximized(false)
    setListening(false)
    clearTimer(listenTimer)
  }, [open])

  function seedForm(content: CopilotBotContent) {
    if (!content.form?.length) return
    setFormValues(
      Object.fromEntries(content.form.map((field) => [field.id, field.value])),
    )
  }

  function clearDraft() {
    setFormValues({})
    setAttachments([])
    setInput('')
  }

  function persistActiveThread(
    nextMessages = messagesRef.current,
    nextScenario = scenarioStateRef.current,
  ) {
    const threadId = activeThreadIdRef.current
    setThreadSnapshots((current) => ({
      ...current,
      [threadId]: {
        messages: nextMessages,
        scenarioState: nextScenario,
      },
    }))
    setThreads((current) =>
      sortCopilotThreads(
        current.map((thread) =>
          thread.id === threadId
            ? {
                ...thread,
                preview: previewFromMessages(nextMessages),
                updatedAt: 'Just now',
              }
            : thread,
        ),
      ),
    )
  }

  function setMaximizedState(next: boolean) {
    setMaximized(next)
    onMaximizedChange?.(next)
  }

  function pushMe(text: string) {
    setMessages((current) => {
      const next = [...current, { id: nextId('me'), role: 'me' as const, text }]
      messagesRef.current = next
      persistActiveThread(next)
      return next
    })
  }

  function pushBot(content: CopilotBotContent) {
    seedForm(content)
    setMessages((current) => {
      const next = [
        ...current,
        { id: nextId('bot'), role: 'bot' as const, content },
      ]
      messagesRef.current = next
      persistActiveThread(next)
      return next
    })
  }

  function replaceLastBot(content: CopilotBotContent) {
    setMessages((current) => {
      const next = [...current]
      for (let i = next.length - 1; i >= 0; i -= 1) {
        if (next[i]?.role === 'bot') {
          next[i] = { id: nextId('bot'), role: 'bot', content }
          messagesRef.current = next
          persistActiveThread(next)
          return next
        }
      }
      const appended = [
        ...next,
        { id: nextId('bot'), role: 'bot' as const, content },
      ]
      messagesRef.current = appended
      persistActiveThread(appended)
      return appended
    })
  }

  function resetConversation(title = 'New chat') {
    persistActiveThread()
    const id = nextId('thread')
    const welcome = welcomeMessages(userRole)
    const scenario = createScenarioState()
    setMessages(welcome)
    setScenarioState(scenario)
    messagesRef.current = welcome
    scenarioStateRef.current = scenario
    clearDraft()
    setTyping(false)
    setThreadSnapshots((current) => ({
      ...current,
      [id]: { messages: welcome, scenarioState: scenario },
    }))
    setThreads((current) =>
      sortCopilotThreads([newCopilotChatThread(id, title), ...current]),
    )
    setActiveThreadId(id)
  }

  function selectThread(threadId: string) {
    if (threadId === activeThreadId) return
    persistActiveThread()
    const snapshot = threadSnapshots[threadId] ?? {
      messages: getThreadMessages(threadId, userRole),
      scenarioState: createScenarioState(),
    }
    setActiveThreadId(threadId)
    setMessages(snapshot.messages)
    setScenarioState(snapshot.scenarioState)
    messagesRef.current = snapshot.messages
    scenarioStateRef.current = snapshot.scenarioState
    clearDraft()
    setTyping(false)
  }

  function pinThread(threadId: string) {
    const current = threads.find((thread) => thread.id === threadId)
    const pinnedNext = !current?.pinned
    setThreads((items) =>
      sortCopilotThreads(
        items.map((thread) =>
          thread.id === threadId
            ? { ...thread, pinned: pinnedNext }
            : thread,
        ),
      ),
    )
    showCopilotToast(pinnedNext ? 'Chat pinned.' : 'Chat unpinned.')
  }

  function deleteThread(threadId: string) {
    const remaining = threads.filter((thread) => thread.id !== threadId)
    setThreadSnapshots((current) => {
      const next = { ...current }
      delete next[threadId]
      return next
    })

    if (!remaining.length) {
      const id = nextId('thread')
      const welcome = welcomeMessages(userRole)
      const scenario = createScenarioState()
      setThreads([newCopilotChatThread(id, 'New chat')])
      setThreadSnapshots({
        [id]: { messages: welcome, scenarioState: scenario },
      })
      setActiveThreadId(id)
      setMessages(welcome)
      setScenarioState(scenario)
      messagesRef.current = welcome
      scenarioStateRef.current = scenario
      clearDraft()
      showCopilotToast('Chat deleted.')
      return
    }

    setThreads(sortCopilotThreads(remaining))
    if (activeThreadId === threadId) {
      const nextActive = remaining[0]!
      const snapshot = threadSnapshots[nextActive.id] ?? {
        messages: getThreadMessages(nextActive.id, userRole),
        scenarioState: createScenarioState(),
      }
      setActiveThreadId(nextActive.id)
      setMessages(snapshot.messages)
      setScenarioState(snapshot.scenarioState)
      messagesRef.current = snapshot.messages
      scenarioStateRef.current = snapshot.scenarioState
      clearDraft()
    }

    showCopilotToast('Chat deleted.')
  }

  function runAction(chip: CopilotChip, asUserMessage = true) {
    const isSkillToggle = chip.id.startsWith('prof-skill-toggle:')
    // Chip CTAs stay clickable while the typing indicator is showing
    if (typing && isSkillToggle) return

    if (asUserMessage && !isSkillToggle) pushMe(chip.label)

    const result = handleScenarioAction(
      chip.id,
      scenarioState,
      chip,
      formValues,
    )
    if (!result) return

    setScenarioState(result.state)
    if (result.toast) showCopilotToast(result.toast)
    if (!result.content) return

    if (isSkillToggle) {
      replaceLastBot(result.content)
      return
    }

    setFormValues({})
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      if (result.content) pushBot(result.content)
      if (result.followUp) {
        followUpTimer.current = window.setTimeout(() => {
          pushBot(result.followUp!)
        }, result.delayMs ?? 1000)
      }
    }, 350)
  }

  function send(text: string) {
    const trimmed = text.trim()
    const pending = attachments
    if ((!trimmed && pending.length === 0) || typing) return

    const names = pending.map((item) => item.name).join(', ')
    const outgoing = trimmed
      ? `${trimmed}${pending.length ? ` (attached ${names})` : ''}`
      : `Shared ${names}`

    setInput('')
    setAttachments([])
    pushMe(outgoing)
    setTyping(true)

    window.setTimeout(() => {
      setTyping(false)
      if (pending.length > 0 && !trimmed) {
        pushBot({
          text: `Got ${pending.length === 1 ? 'your file' : 'your files'}. I can use ${names} with your ${userRole === 'recruiter' ? 'jobs or candidate records' : 'profile or applications'} — what should I do next?`,
          chips: scenarioPickerContent(userRole).chips,
        })
        return
      }
      if (userRole === 'recruiter') {
        const hireStart = recruiterFreeTextStart(trimmed, scenarioState)
        if (hireStart?.content) {
          setScenarioState(hireStart.state)
          pushBot(hireStart.content)
          return
        }
      }
      const hinted = freeTextScenarioHint(trimmed, userRole)
      if (hinted && scenarioState.scenario !== hinted) {
        const started = startScenario(hinted, scenarioState)
        setScenarioState(started.state)
        pushBot(started.content)
        return
      }
      pushBot({ text: copilotChatReply(trimmed, userRole) })
    }, 450)
  }

  function addFiles(fileList: FileList | null, kind: 'photo' | 'file') {
    if (!fileList?.length) return
    const next = Array.from(fileList).map((file) => ({
      id: nextId(kind),
      name: file.name,
      kind,
    }))
    setAttachments((current) => [...current, ...next].slice(0, 6))
    const plural = next.length > 1 ? 's' : ''
    showCopilotToast(
      kind === 'photo'
        ? `Added ${next.length} photo${plural}.`
        : `Added ${next.length} file${plural}.`,
    )
  }

  function toggleMic() {
    if (listening) {
      setListening(false)
      clearTimer(listenTimer)
      return
    }
    setListening(true)
    showCopilotToast('Listening… speak your message.')
    listenTimer.current = window.setTimeout(() => {
      setListening(false)
      setInput((current) =>
        current.trim() ? current : 'Show my latest job recommendations',
      )
      showCopilotToast('Voice captured. Review and send when ready.')
    }, 1800)
  }

  if (!open) return null

  return (
    <aside
      className={cn(
        'fixed right-0 bottom-0 top-shell-header z-40 flex overflow-hidden bg-white',
        'border-l border-[#E6E5F2] shadow-[-10px_0_30px_rgba(31,29,79,0.12)]',
        'transition-[width] duration-200 ease-out',
        maximized
          ? 'left-0 w-full border-l-0 shadow-none lg:left-[4.75rem] lg:w-auto'
          : 'w-[min(28.8rem,100vw)]',
      )}
      aria-label="AI Copilot"
    >
      {maximized ? (
        <ChatHistorySidebar
          threads={threads}
          activeThreadId={activeThreadId}
          onNewChat={() => resetConversation()}
          onSelectThread={selectThread}
          onPinThread={pinThread}
          onDeleteThread={deleteThread}
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2.5 border-b border-[#E6E5F2] px-3.5 py-3">
          <div className="grid size-9 place-items-center rounded-full bg-[#2D2061] text-white">
            <CircleDot className="size-4" strokeWidth={2} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[#1F1D4F]">AI Copilot</p>
            <p className="flex items-center gap-1.5 text-xs text-[#2F8F5B]">
              <span
                className="size-1.5 rounded-full bg-[#2F8F5B]"
                aria-hidden="true"
              />
              Watching your matches
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMaximizedState(!maximized)}
            aria-label={maximized ? 'Minimize AI Copilot' : 'Maximize AI Copilot'}
            className={headerIconClass}
          >
            {maximized ? (
              <Minimize2 className="size-4" strokeWidth={2} aria-hidden="true" />
            ) : (
              <Maximize2 className="size-4" strokeWidth={2} aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI Copilot"
            className={headerIconClass}
          >
            <X className="size-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </header>

        <div
          ref={bodyRef}
          className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white scrollbar-none"
        >
          <div
            className={cn(
              '@container mx-auto flex w-full min-w-0 flex-col gap-3 px-3.5 py-3',
              maximized && 'max-w-[62.4rem] px-5 py-5',
            )}
          >
            {messages.map((message) =>
              message.role === 'me' ? (
                <div
                  key={message.id}
                  className="max-w-[85%] self-end rounded-xl rounded-br-sm bg-[#2D2061] px-3.5 py-2.5 text-[13.5px] leading-relaxed text-white"
                >
                  {message.text}
                </div>
              ) : (
                <BotCard
                  key={message.id}
                  content={message.content}
                  formValues={formValues}
                  onFormChange={(id, value) =>
                    setFormValues((current) => ({ ...current, [id]: value }))
                  }
                  onChip={runAction}
                  onGapAdd={(key) =>
                    runAction({
                      id: `prof-${key}`,
                      label: 'Add',
                      variant: 'primary',
                    })
                  }
                  onOpenJob={(title) => {
                    showCopilotToast(`Opening ${title}.`)
                    onClose()
                    navigate(
                      userRole === 'recruiter' ? '/jobs' : '/my-applications',
                    )
                  }}
                />
              ),
            )}
            {typing ? (
              <div className="rounded-xl bg-[#F4F4FB] px-3.5 py-3 text-sm text-[#8A89A3]">
                Copilot is typing…
              </div>
            ) : null}
          </div>
        </div>

        <footer
          className={cn(
            'px-3.5 py-3',
            maximized && 'mx-auto w-full max-w-[62.4rem] px-5',
          )}
        >
          <Composer
            input={input}
            attachments={attachments}
            listening={listening}
            typing={typing}
            placeholder={
              userRole === 'recruiter'
                ? 'Ask SniperAI anything about jobs, candidates, campaigns or interviews…'
                : 'Ask about jobs, your profile, interviews…'
            }
            onInputChange={setInput}
            onSend={() => send(input)}
            onToggleMic={toggleMic}
            onRemoveAttachment={(id) =>
              setAttachments((current) =>
                current.filter((item) => item.id !== id),
              )
            }
            onAddFiles={addFiles}
          />
          <p className="mt-2 text-center text-[11.5px] text-[#8A89A3]">
            {userRole === 'recruiter'
              ? 'Copilot can look up and take confirmed actions in SniperAI. High-impact steps always ask first.'
              : 'Copilot can update your profile and alerts. It never applies to jobs for you.'}
          </p>
        </footer>
      </div>
    </aside>
  )
}

function ChatHistorySidebar({
  threads,
  activeThreadId,
  onNewChat,
  onSelectThread,
  onPinThread,
  onDeleteThread,
}: {
  threads: CopilotChatThread[]
  activeThreadId: string
  onNewChat: () => void
  onSelectThread: (id: string) => void
  onPinThread: (id: string) => void
  onDeleteThread: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const filtered = filterCopilotThreads(threads, query)
  const pinned = filtered.filter((thread) => thread.pinned)
  const recents = filtered.filter((thread) => !thread.pinned)

  return (
    <div className="flex w-[min(22.75rem,54.6vw)] shrink-0 flex-col border-r border-[#E6E5F2] bg-[#F7F7FA]">
      <div className="space-y-2 p-3">
        <button
          type="button"
          onClick={onNewChat}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#CFCDE3] bg-white text-sm font-semibold text-[#1F1D4F] transition-colors hover:bg-[#ECEAF7]"
        >
          <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
          New chat
        </button>
        <label className="flex h-10 items-center gap-2 rounded-lg border border-[#CFCDE3] bg-white px-2.5">
          <Search
            className="size-4 shrink-0 text-[#8A89A3]"
            strokeWidth={1.9}
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats…"
            aria-label="Search chat history"
            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#1F1D4F] outline-none placeholder:text-[#8A89A3]"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2 scrollbar-none">
        {pinned.length > 0 ? (
          <HistoryGroup
            label="Pinned"
            threads={pinned}
            activeThreadId={activeThreadId}
            onSelectThread={onSelectThread}
            onPinThread={onPinThread}
            onDeleteThread={onDeleteThread}
          />
        ) : null}
        <HistoryGroup
          label="Recents"
          threads={recents}
          activeThreadId={activeThreadId}
          onSelectThread={onSelectThread}
          onPinThread={onPinThread}
          onDeleteThread={onDeleteThread}
          emptyLabel={
            query.trim()
              ? 'No chats match your search.'
              : 'No recent chats yet.'
          }
        />
      </div>
    </div>
  )
}

function HistoryGroup({
  label,
  threads,
  activeThreadId,
  onSelectThread,
  onPinThread,
  onDeleteThread,
  emptyLabel,
}: {
  label: string
  threads: CopilotChatThread[]
  activeThreadId: string
  onSelectThread: (id: string) => void
  onPinThread: (id: string) => void
  onDeleteThread: (id: string) => void
  emptyLabel?: string
}) {
  return (
    <div className="mb-2">
      <p className="px-2 pb-1.5 pt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A89A3]">
        {label}
      </p>
      {threads.length === 0 ? (
        <p className="px-2.5 py-2 text-xs text-[#8A89A3]">{emptyLabel}</p>
      ) : (
        <ul className="flex flex-col gap-0.5">
          {threads.map((thread) => {
            const active = thread.id === activeThreadId
            return (
              <li key={thread.id}>
                <div
                  className={cn(
                    'group flex items-start gap-1 rounded-lg px-1.5 py-1.5 transition-colors',
                    active
                      ? 'bg-white shadow-sm ring-1 ring-[#E6E5F2]'
                      : 'hover:bg-white/70',
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onSelectThread(thread.id)}
                    className="min-w-0 flex-1 rounded-md px-1 py-1 text-left"
                  >
                    <span className="flex items-center gap-1.5">
                      {thread.pinned ? (
                        <Pin
                          className="size-3 shrink-0 text-[#2D2061]"
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                      ) : null}
                      <span className="line-clamp-1 text-[13px] font-semibold text-[#1F1D4F]">
                        {thread.title}
                      </span>
                    </span>
                    <span className="mt-0.5 line-clamp-1 block text-[11.5px] text-[#8A89A3]">
                      {thread.preview}
                    </span>
                    <span className="mt-1 block text-[11px] text-[#A0A0B2]">
                      {thread.updatedAt}
                    </span>
                  </button>
                  <div className="pt-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                    <ThreeDotsMenu
                      triggerLabel={`More actions for ${thread.title}`}
                      side="right"
                      align="start"
                      showCaret={false}
                      triggerClassName="!size-7 !rounded-md text-[#8A89A3] hover:!bg-[#ECEAF7] hover:!text-[#1F1D4F]"
                      items={[
                        {
                          id: 'pin',
                          label: thread.pinned ? 'Unpin' : 'Pin',
                          icon: (
                            <Pin className="size-4" strokeWidth={1.75} />
                          ),
                          onSelect: () => onPinThread(thread.id),
                        },
                        {
                          id: 'delete',
                          label: 'Delete',
                          destructive: true,
                          icon: (
                            <Trash2 className="size-4" strokeWidth={1.75} />
                          ),
                          onSelect: () => onDeleteThread(thread.id),
                        },
                      ]}
                    />
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function Composer({
  input,
  attachments,
  listening,
  typing,
  placeholder,
  onInputChange,
  onSend,
  onToggleMic,
  onRemoveAttachment,
  onAddFiles,
}: {
  input: string
  attachments: PendingAttachment[]
  listening: boolean
  typing: boolean
  placeholder: string
  onInputChange: (value: string) => void
  onSend: () => void
  onToggleMic: () => void
  onRemoveAttachment: (id: string) => void
  onAddFiles: (files: FileList | null, kind: 'photo' | 'file') => void
}) {
  const photoInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canSend = Boolean(input.trim() || attachments.length) && !typing

  return (
    <div className="rounded-[14px] border border-[#CFCDE3] bg-white px-2.5 py-2 shadow-[0_1px_2px_rgba(31,29,79,0.04)]">
      {attachments.length > 0 ? (
        <ul className="mb-2 flex flex-wrap gap-1.5">
          {attachments.map((item) => (
            <li
              key={item.id}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#E6E5F2] bg-[#F4F4FB] py-1 pl-2.5 pr-1 text-xs text-[#1F1D4F]"
            >
              {item.kind === 'photo' ? (
                <ImagePlus className="size-3 shrink-0" strokeWidth={2} />
              ) : (
                <Paperclip className="size-3 shrink-0" strokeWidth={2} />
              )}
              <span className="truncate">{item.name}</span>
              <button
                type="button"
                onClick={() => onRemoveAttachment(item.id)}
                aria-label={`Remove ${item.name}`}
                className="inline-flex size-5 items-center justify-center rounded-full text-[#8A89A3] hover:bg-white hover:text-[#1F1D4F]"
              >
                <X className="size-3" strokeWidth={2} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <textarea
        value={input}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSend()
          }
        }}
        rows={textareaRows(input)}
        placeholder={listening ? 'Listening…' : placeholder}
        aria-label="Message AI Copilot"
        className="max-h-32 min-h-[2.5rem] w-full resize-none border-0 bg-transparent px-1.5 py-1.5 text-sm text-[#1F1D4F] outline-none placeholder:text-[#8A89A3]"
      />

      <div className="mt-1 flex items-center gap-1">
        <ComposerIconButton
          label="Add photos"
          onClick={() => photoInputRef.current?.click()}
          icon={<ImagePlus className="size-4" strokeWidth={1.9} />}
        />
        <ComposerIconButton
          label="Add files"
          onClick={() => fileInputRef.current?.click()}
          icon={<Paperclip className="size-4" strokeWidth={1.9} />}
        />
        <ComposerIconButton
          label={listening ? 'Stop microphone' : 'Use microphone'}
          onClick={onToggleMic}
          active={listening}
          icon={<Mic className="size-4" strokeWidth={1.9} />}
        />
        <div className="flex-1" />
        <button
          type="button"
          disabled={!canSend}
          onClick={onSend}
          aria-label="Send"
          className="inline-flex size-8 items-center justify-center rounded-lg bg-[#2D2061] text-white transition-opacity disabled:opacity-40"
        >
          <Send className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
        </button>
      </div>

      <input
        ref={photoInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          onAddFiles(e.target.files, 'photo')
          e.target.value = ''
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          onAddFiles(e.target.files, 'file')
          e.target.value = ''
        }}
      />
    </div>
  )
}

function textareaRows(input: string) {
  return Math.min(4, Math.max(1, input.split('\n').length))
}

function ComposerIconButton({
  label,
  onClick,
  icon,
  active,
}: {
  label: string
  onClick: () => void
  icon: ReactNode
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-lg text-[#4B4A66] transition-colors hover:bg-[#F4F4FB]',
        active && 'bg-[#E8EEF9] text-[#2D2061] hover:bg-[#E8EEF9]',
      )}
    >
      {icon}
    </button>
  )
}

const COPILOT_NAVY = '#2D2061'

const RICH_PANEL_BASE = 'mt-2.5 rounded-xl border border-[#E6E5F2] bg-white'
const RICH_PANEL = `${RICH_PANEL_BASE} overflow-hidden`

const CQ_ROW_28 = '@min-[28rem]:flex-row @min-[28rem]:items-center'
const CQ_STACK_ROW_28 = `flex flex-col gap-2 ${CQ_ROW_28} @min-[28rem]:gap-3`
const CQ_STACK_ROW_28_TIGHT = `flex flex-col gap-2 ${CQ_ROW_28}`
const CQ_STACK_ROW_32 =
  'flex flex-col gap-2 @min-[32rem]:flex-row @min-[32rem]:items-center @min-[32rem]:justify-between'
const CQ_STACK_ROW_40 =
  'flex flex-col gap-2 @min-[40rem]:flex-row @min-[40rem]:items-center @min-[40rem]:justify-between'
const CQ_SELF_CENTER_28 = 'self-end @min-[28rem]:self-center'

const BTN_SM =
  'inline-flex h-[30px] items-center justify-center rounded-[7px] border px-2.5 text-[12.5px] font-semibold transition-colors'
const BTN_SM_NAVY = `${BTN_SM} border-[#2D2061] bg-[#2D2061] text-white hover:bg-[#241A52] disabled:cursor-not-allowed disabled:opacity-40`
const BTN_SM_GHOST = `${BTN_SM} border-[#E6E5F2] bg-white text-[#1F1D4F] hover:bg-[#F4F4FB]`
const BTN_SM_SUCCESS = `${BTN_SM} border-[#BFE4CD] bg-[#E3F5EA] text-[#1F8F57]`
const BTN_SM_SOFT =
  `${BTN_SM} border-[#E6E5F2] bg-white text-[#1F1D4F] hover:bg-[#E8EEF9]`

const TABLE_TH =
  'border-b border-[#EEEBE4] px-3 py-2 text-left text-[11.5px] font-semibold text-[#8A89A3]'
const TABLE_TD = 'border-b border-[#F3F1EC] px-3 py-2'

function toggleSetMember(prev: Set<string>, key: string): Set<string> {
  const next = new Set(prev)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  return next
}

const BADGE_TONE_CLASS = {
  green: 'bg-[#E3F5EA] text-[#1F8F57]',
  amber: 'bg-[#FFF5E3] text-[#B56A00]',
  navy: 'bg-[#E8EEF9] text-[#2D2061]',
  grey: 'bg-[#EEEFF4] text-[#7A756C]',
} as const

const PILL_TONE_CLASS = {
  green: 'bg-[#E3F5EA] text-[#1F8F57]',
  amber: 'bg-[#FFF5E3] text-[#B56A00]',
  blue: 'bg-[#E5F0FB] text-[#1F5F9E]',
  grey: 'bg-[#EEEFF4] text-[#7A756C]',
} as const

const OPTION_ICON = {
  ai: { glyph: '✦', className: 'bg-[#2D2061] text-white' },
  upload: { glyph: '⇧', className: 'bg-[#E8EEF9] text-[#2D2061]' },
  db: { glyph: '▤', className: 'bg-[#E3F5EA] text-[#1F8F57]' },
  play: { glyph: '▶', className: 'bg-[#E8EEF9] text-[#2D2061]' },
  call: { glyph: '☎', className: 'bg-[#FFF5E3] text-[#B56A00]' },
} as const

function BotCard({
  content,
  formValues,
  onFormChange,
  onChip,
  onGapAdd,
  onOpenJob,
}: {
  content: CopilotBotContent
  formValues: Record<string, string>
  onFormChange: (id: string, value: string) => void
  onChip: (chip: CopilotChip) => void
  onGapAdd: (key: 'exp' | 'skills' | 'prefs') => void
  onOpenJob: (title: string) => void
}) {
  return (
    <div className="@container min-w-0 overflow-hidden rounded-xl border border-[#E6E5F2] bg-white px-3.5 py-3 text-[13.5px] leading-relaxed text-[#1F1D4F] shadow-[0_1px_2px_rgba(31,29,79,0.04)]">
      {content.title ? (
        <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8A89A3]">
          <Sparkles className="size-3" strokeWidth={2} aria-hidden="true" />
          {content.title}
        </p>
      ) : null}

      {content.successBanner ? (
        <div className="mb-2.5 rounded-[10px] border border-[#BFE4CD] bg-[#E3F5EA] px-3 py-2.5 text-[13.5px] font-medium text-[#1F8F57]">
          {content.successBanner}
        </div>
      ) : null}

      {content.actionNotice ? (
        <ActionNoticeBlock notice={content.actionNotice} onChip={onChip} />
      ) : null}

      {content.ring ? <ProfileRing ring={content.ring} /> : null}

      {content.text
        ? content.text.split('\n\n').map((para) => (
            <p key={para} className="mt-1.5 first:mt-0 text-[#2B2823]">
              {para}
            </p>
          ))
        : null}

      {content.jobBanner ? <JobBanner banner={content.jobBanner} /> : null}

      {content.detailCard ? (
        <DetailCard card={content.detailCard} onChip={onChip} />
      ) : null}

      {content.kpis?.length ? <KpiStrip items={content.kpis} /> : null}

      {content.optionCards?.length ? (
        <OptionCards options={content.optionCards} onChip={onChip} />
      ) : null}

      {content.personCards?.length ? (
        <PersonCards
          cards={content.personCards}
          continueBar={content.continueBar}
          onChip={onChip}
        />
      ) : null}

      {content.checklist ? <ChecklistBlock checklist={content.checklist} /> : null}

      {content.bars?.length ? <BarChart items={content.bars} /> : null}

      {content.table ? <DataTableBlock table={content.table} /> : null}

      {content.pipelineTable ? (
        <PipelineTableBlock table={content.pipelineTable} onChip={onChip} />
      ) : null}

      {content.rankedApplicants ? (
        <RankedApplicantsBlock
          block={content.rankedApplicants}
          onChip={onChip}
        />
      ) : null}

      {content.emailPreview ? (
        <EmailPreviewBlock preview={content.emailPreview} onChip={onChip} />
      ) : null}

      {content.activityReport ? (
        <ActivityReportBlock
          report={content.activityReport}
          onChip={onChip}
        />
      ) : null}

      {content.masterDashboard ? (
        <MasterDashboardBlock dashboard={content.masterDashboard} />
      ) : null}

      {content.gaps?.length ? (
        <GapList gaps={content.gaps} onGapAdd={onGapAdd} />
      ) : null}

      {content.matches?.length ? (
        <MatchList matches={content.matches} onOpenJob={onOpenJob} />
      ) : null}

      {content.fileCard ? (
        <div className="mt-2.5 rounded-lg border border-[#E6E5F2] bg-[#FBFAF7] px-3 py-2.5">
          <p className="text-[13px] font-semibold text-[#1F1D4F]">
            {content.fileCard.name}
          </p>
          <p className="text-xs text-[#8A89A3]">{content.fileCard.detail}</p>
        </div>
      ) : null}

      {content.upload ? <UploadBlock upload={content.upload} /> : null}

      {content.parse?.length ? <ParseList items={content.parse} /> : null}

      {content.form?.length ? (
        <MiniForm
          fields={content.form}
          values={formValues}
          onChange={onFormChange}
        />
      ) : null}

      {content.apps?.length ? <AppList apps={content.apps} /> : null}

      {content.timeline?.length ? (
        <Timeline steps={content.timeline} />
      ) : null}

      {content.why?.length ? <WhyList items={content.why} /> : null}

      {content.confirmBox ? (
        <ConfirmBox box={content.confirmBox} onChip={onChip} />
      ) : null}

      {content.chips?.length ? (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {content.chips.map((chipItem, index) => (
            <ActionChip
              key={`${chipItem.id}-${chipItem.label}-${index}`}
              chip={chipItem}
              onChip={onChip}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}

function JobBanner({
  banner,
}: {
  banner: NonNullable<CopilotBotContent['jobBanner']>
}) {
  return (
    <div className="mt-2.5 grid gap-3 rounded-xl border border-[#E6E5F2] bg-white px-3.5 py-3 @min-[22rem]:grid-cols-[minmax(0,1fr)_auto]">
      <div className="min-w-0 break-words">
        <p className="text-[15px] font-semibold text-[#1F1D4F]">{banner.title}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-[#E3F5EA] px-2 py-0.5 text-[11px] font-semibold text-[#1F8F57]">
            {banner.status}
          </span>
        </div>
        <p className="mt-1 text-xs text-[#8A89A3]">{banner.meta}</p>
      </div>
      <div className="self-start text-left @min-[22rem]:self-center @min-[22rem]:text-center">
        <p className="text-base font-semibold text-[#1F1D4F]">{banner.apps}</p>
        <p className="text-[11px] text-[#8A89A3]">applications</p>
      </div>
    </div>
  )
}

function DetailCard({
  card,
  onChip,
}: {
  card: NonNullable<CopilotBotContent['detailCard']>
  onChip: (chip: CopilotChip) => void
}) {
  const toneClass = BADGE_TONE_CLASS[card.badgeTone ?? 'grey']

  return (
    <div className={RICH_PANEL}>
      <div className="flex items-center gap-2 border-b border-[#EEEBE4] px-3.5 py-2.5">
        <p className="min-w-0 flex-1 text-sm font-semibold text-[#1F1D4F]">
          {card.heading}
        </p>
        {card.badge ? (
          <span
            className={cn(
              'rounded-full px-2 py-0.5 text-[11px] font-semibold',
              toneClass,
            )}
          >
            {card.badge}
          </span>
        ) : null}
        {card.linkLabel ? (
          <button
            type="button"
            onClick={() =>
              onChip({
                id: 'toast',
                label: card.linkLabel!,
                toast: `Opening ${card.heading}`,
              })
            }
            className="text-xs font-semibold text-[#2D2061] hover:underline"
          >
            {card.linkLabel}
          </button>
        ) : null}
      </div>
      <dl className="grid gap-x-3 gap-y-2 px-3.5 py-3 text-[13px] @min-[22rem]:grid-cols-[minmax(6rem,8.5rem)_1fr]">
        {card.rows.map((row) => (
          <div key={row.label} className="grid gap-0.5 @min-[22rem]:contents">
            <dt className="text-[#8A89A3]">{row.label}</dt>
            <dd className="min-w-0 break-words font-semibold text-[#1F1D4F]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function OptionCards({
  options,
  onChip,
}: {
  options: NonNullable<CopilotBotContent['optionCards']>
  onChip: (chip: CopilotChip) => void
}) {
  return (
    <div className="mt-2.5 grid gap-2 @min-[36rem]:grid-cols-3">
      {options.map((option) => {
        const icon = OPTION_ICON[option.icon]
        return (
          <button
            key={option.id}
            type="button"
            onClick={() =>
              onChip({
                id: option.id,
                label: option.title,
                variant: option.aiTag ? 'primary' : 'default',
              })
            }
            className={cn(
              'grid gap-1.5 rounded-xl border bg-white p-3 text-left transition-colors hover:border-[#2D2061]',
              option.aiTag
                ? 'border-[#C8D0E8] bg-gradient-to-b from-[#F5F7FC] to-white'
                : 'border-[#E6E5F2]',
            )}
          >
            <span
              className={cn(
                'grid size-9 place-items-center rounded-[9px] text-sm font-bold',
                icon.className,
              )}
            >
              {icon.glyph}
            </span>
            <span className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-[#1F1D4F]">
              {option.title}
              {option.aiTag ? (
                <span className="rounded-full bg-[#2D2061] px-1.5 py-0.5 text-[10px] font-bold text-white">
                  AI
                </span>
              ) : null}
            </span>
            <span className="text-[12.5px] leading-snug text-[#8A89A3]">
              {option.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function PersonCards({
  cards,
  continueBar,
  onChip,
}: {
  cards: NonNullable<CopilotBotContent['personCards']>
  continueBar?: CopilotBotContent['continueBar']
  onChip: (chip: CopilotChip) => void
}) {
  const [added, setAdded] = useState<Set<string>>(() => new Set())
  const [revealed, setRevealed] = useState<Set<string>>(() => new Set())
  const selectable = Boolean(continueBar)
  const count = added.size

  return (
    <div className="mt-2.5 grid gap-2">
      <div className="grid gap-2 @min-[26rem]:grid-cols-2">
        {cards.map((card) => {
          const key = card.id ?? card.name
          const isAdded = added.has(key)
          const isRevealed = revealed.has(key)
          return (
            <div
              key={key}
              className={cn(
                'grid gap-2 rounded-xl border bg-white p-3',
                isAdded
                  ? 'border-[#B8C0DC] bg-[#F7F8FC]'
                  : 'border-[#E6E5F2]',
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-full bg-[#E8EEF9] text-xs font-bold text-[#2D2061]">
                  {card.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[#1F1D4F]">
                    {card.name}
                  </p>
                  <p className="text-xs text-[#8A89A3]">{card.title}</p>
                </div>
                <span
                  className="grid size-11 place-items-center rounded-full text-[11.5px] font-bold text-[#1F8F57]"
                  style={{
                    background: `conic-gradient(#1F8F57 ${card.score * 3.6}deg, #EEEBE4 0)`,
                  }}
                >
                  <span className="grid size-8 place-items-center rounded-full bg-white">
                    {card.score}%
                  </span>
                </span>
              </div>
              <ul className="grid gap-0.5 text-[12.5px] text-[#4B4A66]">
                {card.why.map((line) => (
                  <li key={line}>
                    <span className="text-[#2D2061]">✦ </span>
                    {line}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-[11.5px] text-[#8A89A3]">
                <span className="min-w-0 flex-1 truncate">{card.source}</span>
                <button
                  type="button"
                  onClick={() =>
                    onChip({
                      id: 'toast',
                      label: 'View CV',
                      toast: `Opening CV for ${card.name}`,
                    })
                  }
                  className="font-semibold text-[#2D2061] hover:underline"
                >
                  View CV ↗
                </button>
              </div>
              {card.contact ? (
                <p
                  className={cn(
                    'rounded-lg border border-dashed border-[#E6E5F2] px-2.5 py-1.5 text-[12.5px]',
                    isRevealed
                      ? 'text-[#1F1D4F]'
                      : 'bg-[#FBFAF7] text-[#8A89A3]',
                  )}
                >
                  {isRevealed
                    ? card.contact
                    : 'Contact details hidden — reveal uses 1 credit'}
                </p>
              ) : null}
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (isRevealed) return
                    setRevealed((prev) => new Set(prev).add(key))
                    onChip({
                      id: 'toast',
                      label: 'Reveal Contact',
                      toast: `Contact revealed for ${card.name}`,
                    })
                  }}
                  className={cn(
                    'flex-1',
                    isRevealed ? BTN_SM_SUCCESS : BTN_SM_SOFT,
                  )}
                >
                  {isRevealed ? '✓ Contact revealed' : 'Reveal Contact'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (selectable) {
                      setAdded((prev) => toggleSetMember(prev, key))
                      return
                    }
                    onChip({
                      id: 'toast',
                      label: 'Add to Job',
                      variant: 'primary',
                      toast: `${card.name} added to JR-1061`,
                    })
                  }}
                  className={cn('flex-1', isAdded ? BTN_SM_SUCCESS : BTN_SM_NAVY)}
                >
                  {isAdded ? '✓ Added to job' : 'Add to Job'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {continueBar ? (
        <PersonContinueBar
          count={count}
          bar={continueBar}
          onChip={onChip}
        />
      ) : null}
    </div>
  )
}

function PersonContinueBar({
  count,
  bar,
  onChip,
}: {
  count: number
  bar: NonNullable<CopilotBotContent['continueBar']>
  onChip: (chip: CopilotChip) => void
}) {
  const { emptyLabel, showMoreLabel, showMoreToast, continueLabel, continueId } =
    bar

  return (
    <div
      className={cn(
        CQ_STACK_ROW_28,
        'rounded-xl border border-[#DCD3FF] bg-[#F3EEFF] px-3.5 py-2.5',
      )}
    >
      <p className="min-w-0 flex-1 text-[13.5px] text-[#1F1D4F]">
        {count > 0 ? (
          <>
            <span className="font-semibold">{count}</span>
            {` candidate${count === 1 ? '' : 's'} added to JR-1061 at `}
            <span className="font-semibold">Applied · New</span>.
          </>
        ) : (
          emptyLabel
        )}
      </p>
      <div className="flex shrink-0 flex-wrap gap-1.5">
        {showMoreLabel ? (
          <button
            type="button"
            onClick={() =>
              onChip({
                id: 'toast',
                label: showMoreLabel,
                toast: showMoreToast ?? showMoreLabel,
              })
            }
            className={BTN_SM_GHOST}
          >
            {showMoreLabel}
          </button>
        ) : null}
        <button
          type="button"
          disabled={count === 0}
          onClick={() =>
            onChip({
              id: continueId,
              label: continueLabel,
              variant: 'primary',
            })
          }
          className={BTN_SM_NAVY}
        >
          {continueLabel}
        </button>
      </div>
    </div>
  )
}

function ChecklistBlock({
  checklist,
}: {
  checklist: NonNullable<CopilotBotContent['checklist']>
}) {
  return (
    <div className={RICH_PANEL}>
      {checklist.heading ? (
        <div className="border-b border-[#EEEBE4] px-3.5 py-2.5 text-sm font-semibold text-[#1F1D4F]">
          {checklist.heading}
        </div>
      ) : null}
      <ul className="grid gap-2 px-3.5 py-3">
        {checklist.items.map((item) => (
          <li
            key={item.label}
            className="flex items-start gap-2.5 text-[13px] text-[#1F1D4F]"
          >
            <span
              className={cn(
                'mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-[5px] border-2 text-[11px]',
                item.done
                  ? 'border-[#1F8F57] bg-[#1F8F57] text-white'
                  : 'border-[#D2CFC6]',
              )}
            >
              {item.done ? '✓' : ''}
            </span>
            <span className="min-w-0 flex-1">
              {item.label}
              {item.detail ? (
                <span className="mt-0.5 block text-xs text-[#8A89A3]">
                  {item.detail}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function KpiStrip({ items }: { items: NonNullable<CopilotBotContent['kpis']> }) {
  return (
    <div className={cn(RICH_PANEL, 'grid grid-cols-2 @min-[36rem]:grid-cols-4')}>
      {items.map((item) => (
        <div
          key={item.label}
          className="border-b border-r border-[#EEEBE4] px-3 py-2.5 last:border-r-0 @min-[36rem]:border-b-0"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#8A89A3]">
            {item.label}
          </p>
          <p className="text-lg font-semibold text-[#1F1D4F]">{item.value}</p>
          <p className="text-xs text-[#8A89A3]">{item.hint}</p>
        </div>
      ))}
    </div>
  )
}

function BarChart({ items }: { items: NonNullable<CopilotBotContent['bars']> }) {
  return (
    <div className={cn(RICH_PANEL_BASE, 'grid gap-2 px-3.5 py-3')}>
      {items.map((item) => (
        <div
          key={item.label}
          className="grid grid-cols-[minmax(4.5rem,7.5rem)_minmax(0,1fr)_2rem] items-center gap-2 text-[12.5px]"
        >
          <span className="truncate font-semibold text-[#1F1D4F]">
            {item.label}
          </span>
          <span className="h-2 overflow-hidden rounded bg-[#EEEBE4]">
            <span
              className="block h-full rounded"
              style={{
                width: `${item.pct}%`,
                backgroundColor: COPILOT_NAVY,
              }}
            />
          </span>
          <span className="text-right text-[#8A89A3]">{item.score}</span>
        </div>
      ))}
    </div>
  )
}

function DataTableBlock({
  table,
}: {
  table: NonNullable<CopilotBotContent['table']>
}) {
  const showStatus = table.rows.some((row) => row.pill)

  return (
    <div className={RICH_PANEL}>
      {table.heading ? (
        <div className="flex items-center gap-2 border-b border-[#EEEBE4] px-3.5 py-2.5">
          <p className="flex-1 text-sm font-semibold text-[#1F1D4F]">
            {table.heading}
          </p>
          {table.badge ? (
            <span className="rounded-full bg-[#EEEFF4] px-2 py-0.5 text-[11px] font-semibold text-[#7A756C]">
              {table.badge}
            </span>
          ) : null}
        </div>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-[12.5px]">
          <thead>
            <tr>
              {table.columns.map((column) => (
                <th key={column} className={TABLE_TH}>
                  {column}
                </th>
              ))}
              {showStatus ? <th className={TABLE_TH}>Status</th> : null}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, index) => (
              <tr key={`${row.cells[0]}-${index}`}>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={`${cell}-${cellIndex}`}
                    className={cn(
                      TABLE_TD,
                      'text-[#1F1D4F]',
                      cellIndex === 0 && 'font-semibold',
                      cell.endsWith('%') && 'font-bold text-[#1F8F57]',
                    )}
                  >
                    {cell}
                  </td>
                ))}
                {showStatus ? (
                  <td className={TABLE_TD}>
                    {row.pill ? <StatusPill pill={row.pill} /> : null}
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PipelineTableBlock({
  table,
  onChip,
}: {
  table: NonNullable<CopilotBotContent['pipelineTable']>
  onChip: (chip: CopilotChip) => void
}) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set())
  const [stages, setStages] = useState<Record<string, string>>(() =>
    Object.fromEntries(table.rows.map((row) => [row.id, row.stage])),
  )
  const [done, setDone] = useState(false)
  const count = selected.size
  const allSelected =
    table.rows.length > 0 && table.rows.every((row) => selected.has(row.id))
  const tdClass = `${TABLE_TD} text-[12.5px]`

  function setSelection(ids: Iterable<string>) {
    if (done) return
    setSelected(new Set(ids))
  }

  function shortlistSelected() {
    if (!count || done) return
    setStages((prev) => {
      const next = { ...prev }
      for (const id of selected) next[id] = 'Screening'
      return next
    })
    setDone(true)
    onChip({
      id: table.shortlistId,
      label: `Shortlist ${count}`,
      variant: 'primary',
      toast: `${count} shortlisted`,
    })
  }

  return (
    <div className={RICH_PANEL}>
      <div className="flex items-center gap-2 border-b border-[#EEEBE4] px-3.5 py-2.5">
        <p className="flex-1 text-sm font-semibold text-[#1F1D4F]">
          {table.heading}
        </p>
        {table.badge ? (
          <span className="rounded-full bg-[#EEEFF4] px-2 py-0.5 text-[11px] font-semibold text-[#7A756C]">
            {table.badge}
          </span>
        ) : null}
        {table.linkLabel ? (
          <button
            type="button"
            onClick={() =>
              onChip({
                id: 'toast',
                label: table.linkLabel!,
                toast: 'Opening pipeline in SniperAI',
              })
            }
            className="text-xs font-semibold text-[#2D2061] hover:underline"
          >
            {table.linkLabel}
          </button>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse">
          <thead>
            <tr>
              <th className={cn(TABLE_TH, 'w-9')}>
                <input
                  type="checkbox"
                  aria-label="Select all"
                  checked={allSelected}
                  disabled={done}
                  onChange={(event) =>
                    setSelection(
                      event.target.checked
                        ? table.rows.map((row) => row.id)
                        : [],
                    )
                  }
                  className="size-4 accent-[#2D2061]"
                />
              </th>
              <th className={TABLE_TH}>Candidate</th>
              <th className={TABLE_TH}>Match</th>
              <th className={TABLE_TH}>Why</th>
              <th className={TABLE_TH}>Gap</th>
              <th className={TABLE_TH}>Stage</th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => {
              const isSel = selected.has(row.id)
              return (
                <tr
                  key={row.id}
                  className={cn(isSel && !done && 'bg-[#F6F3FF]')}
                >
                  <td className={tdClass}>
                    <input
                      type="checkbox"
                      aria-label={`Select ${row.name}`}
                      checked={isSel}
                      disabled={done}
                      onChange={(event) => {
                        if (done) return
                        setSelected((prev) => {
                          const next = new Set(prev)
                          if (event.target.checked) next.add(row.id)
                          else next.delete(row.id)
                          return next
                        })
                      }}
                      className="size-4 accent-[#2D2061]"
                    />
                  </td>
                  <td className={tdClass}>
                    <p className="font-semibold text-[#1F1D4F]">{row.name}</p>
                    <p className="text-[11.5px] text-[#8A89A3]">{row.title}</p>
                  </td>
                  <td
                    className={cn(
                      tdClass,
                      'font-bold',
                      row.match < 85 ? 'text-[#B56A00]' : 'text-[#1F8F57]',
                    )}
                  >
                    {row.match}%
                  </td>
                  <td className={cn(tdClass, 'text-[#4B4A66]')}>{row.why}</td>
                  <td className={cn(tdClass, 'text-[#4B4A66]')}>{row.gap}</td>
                  <td className={tdClass}>
                    <select
                      value={stages[row.id] ?? row.stage}
                      disabled={done}
                      onChange={(event) => {
                        const value = event.target.value
                        setStages((prev) => ({ ...prev, [row.id]: value }))
                        onChip({
                          id: 'toast',
                          label: value,
                          toast: `${row.name} moved to ${value}`,
                        })
                      }}
                      className="h-[30px] min-w-[8.5rem] rounded-[7px] border border-[#E6E5F2] bg-white px-2 text-[12.5px] text-[#1F1D4F] outline-none disabled:opacity-50"
                    >
                      {table.stages.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div
        className={cn(
          CQ_STACK_ROW_28_TIGHT,
          'border-t border-[#EEEBE4] px-3.5 py-2.5',
        )}
      >
        {done ? (
          <p className="flex-1 text-[13px] font-semibold text-[#1F8F57]">
            ✓ {count} shortlisted
          </p>
        ) : (
          <>
            <p className="min-w-0 flex-1 text-[13px] text-[#8A89A3]">
              {count
                ? `${count} selected — they'll move to Screening.`
                : 'Select candidates to enable Shortlist.'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setSelection(
                    table.rows
                      .filter((row) => row.match >= 85)
                      .map((row) => row.id),
                  )
                }
                className={BTN_SM_GHOST}
              >
                Select all above 85%
              </button>
              <button
                type="button"
                disabled={!count}
                onClick={shortlistSelected}
                className={BTN_SM_NAVY}
              >
                {count ? `Shortlist ${count}` : 'Shortlist'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function resolveNoticeChip(chip: CopilotChip): CopilotChip {
  const label = chip.label.toLowerCase()
  if (
    chip.id === 'toast' &&
    /email shortlisted candidates/.test(label)
  ) {
    return { ...chip, id: 'rc-jr1042-email' }
  }
  if (chip.id === 'toast' && label === 'undo') {
    return {
      ...chip,
      id: 'rc-jr1042-undo',
      toast: chip.toast ?? 'Shortlist undone for JR-1042',
    }
  }
  return chip
}

function ActionNoticeBlock({
  notice,
  onChip,
}: {
  notice: NonNullable<CopilotBotContent['actionNotice']>
  onChip: (chip: CopilotChip) => void
}) {
  return (
    <div className="mt-1.5 grid gap-2">
      <div className="flex gap-2.5 rounded-[10px] border border-[#BFDBFE] bg-[#EFF6FF] px-3.5 py-3">
        <span
          className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#3B82F6] text-[11px] font-bold text-white"
          aria-hidden="true"
        >
          ✓
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[13.5px] leading-relaxed text-[#1E293B]">
            {notice.message}
          </p>
          {notice.meta.length ? (
            <p className="mt-1.5 text-[12px] text-[#64748B]">
              {notice.meta.join(' · ')}
            </p>
          ) : null}
        </div>
      </div>
      {notice.undo || notice.primary ? (
        <div className="flex flex-wrap gap-1.5">
          {notice.undo ? (
            <button
              type="button"
              onClick={() => onChip(resolveNoticeChip(notice.undo!))}
              className="inline-flex h-[30px] items-center rounded-[7px] border border-[#E6E5F2] bg-white px-2.5 text-[12.5px] font-semibold text-[#C44B7A] hover:bg-[#FDF2F5]"
            >
              {notice.undo.label}
            </button>
          ) : null}
          {notice.primary ? (
            <button
              type="button"
              onClick={() => onChip(resolveNoticeChip(notice.primary!))}
              className="inline-flex h-[30px] items-center rounded-[7px] border border-[#E6E5F2] bg-white px-2.5 text-[12.5px] font-semibold text-[#2D2061] hover:bg-[#E8EEF9]"
            >
              {notice.primary.label}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function MasterDashboardBlock({
  dashboard,
}: {
  dashboard: NonNullable<CopilotBotContent['masterDashboard']>
}) {
  const [tabId, setTabId] = useState(dashboard.tabs[0]?.id ?? '')
  const [period, setPeriod] = useState(dashboard.defaultPeriod)
  const [view, setView] = useState<'chart' | 'table'>('chart')
  const [chartMaximized, setChartMaximized] = useState(false)
  const activeTab =
    dashboard.tabs.find((tab) => tab.id === tabId) ?? dashboard.tabs[0]

  if (!activeTab) return null

  const yMax = Math.ceil(
    Math.max(
      80,
      ...activeTab.points.flatMap((point) => Object.values(point.values)),
    ) / 20,
  ) * 20

  const chartTitle = `Time-to-hire trend · ${activeTab.label} · ${period}`

  const chartPanel = (
    <div className="w-full">
      <p className="mb-2 text-[12px] text-[#8A89A3]">{chartTitle}</p>
      <AreaLineChart
        series={activeTab.series}
        points={activeTab.points}
        yMax={yMax}
        className="w-full"
      />
    </div>
  )

  return (
    <>
      <div className={RICH_PANEL}>
        <div
          className={cn(
            CQ_STACK_ROW_32,
            'border-b border-[#EEEBE4] bg-[#F7F7FA] px-3.5 py-2.5',
          )}
        >
          <p className="text-sm font-semibold text-[#1F1D4F]">
            {dashboard.heading}
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            <label className="inline-flex items-center gap-1.5 text-[12.5px] text-[#4B4A66]">
              Activity Period:
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="h-[30px] rounded-[7px] border border-[#E6E5F2] bg-white px-2 font-semibold text-[#1F1D4F] outline-none"
                aria-label="Activity period"
              >
                {dashboard.periods.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <div className="inline-flex rounded-[7px] border border-[#E6E5F2] bg-white p-0.5">
              <Tooltip content="Table View">
                <button
                  type="button"
                  onClick={() => setView('table')}
                  aria-label="Table View"
                  aria-pressed={view === 'table'}
                  className={cn(
                    'grid size-7 place-items-center rounded-[6px] transition-colors',
                    view === 'table'
                      ? 'bg-[#2D2061] text-white'
                      : 'text-[#4B4A66] hover:bg-[#F7F7FA]',
                  )}
                >
                  <Table2
                    className="size-3.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
              </Tooltip>
              <Tooltip content="Chart View">
                <button
                  type="button"
                  onClick={() => setView('chart')}
                  aria-label="Chart View"
                  aria-pressed={view === 'chart'}
                  className={cn(
                    'grid size-7 place-items-center rounded-[6px] transition-colors',
                    view === 'chart'
                      ? 'bg-[#2D2061] text-white'
                      : 'text-[#4B4A66] hover:bg-[#F7F7FA]',
                  )}
                >
                  <BarChart3
                    className="size-3.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
              </Tooltip>
            </div>
            <Tooltip content="Maximize chart">
              <button
                type="button"
                onClick={() => {
                  setView('chart')
                  setChartMaximized(true)
                }}
                aria-label="Maximize chart"
                className="grid size-8 place-items-center rounded-[7px] border border-[#E6E5F2] bg-white text-[#2D2061] transition-colors hover:bg-[#E8EEF9]"
              >
                <Maximize2
                  className="size-3.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>
            </Tooltip>
          </div>
        </div>

        <div className="border-b border-[#EEEBE4] bg-[#F7F7FA] px-3.5 py-2.5">
          <div className="inline-flex max-w-full flex-wrap rounded-[8px] border border-[#E6E5F2] bg-white p-0.5">
            {dashboard.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTabId(tab.id)}
                className={cn(
                  'h-8 rounded-[6px] px-2.5 text-[12px] font-semibold transition-colors',
                  tab.id === activeTab.id
                    ? 'bg-[#2D2061] text-white'
                    : 'text-[#4B4A66] hover:bg-[#F7F7FA]',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-2 border-b border-[#EEEBE4] bg-white p-3 @min-[24rem]:grid-cols-2 @min-[40rem]:grid-cols-4">
          {activeTab.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-[#E6E5F2] bg-white px-3 py-2.5"
            >
              <span className="min-w-0 truncate text-[12.5px] text-[#8A89A3]">
                {kpi.label}
              </span>
              <span className="shrink-0 text-base font-semibold text-[#2D2061]">
                {kpi.value}
              </span>
            </div>
          ))}
        </div>

        {view === 'chart' ? (
          <div className="bg-white px-3.5 py-3">{chartPanel}</div>
        ) : (
          <div className="overflow-x-auto bg-white">
            <table className="w-full min-w-[28rem] border-collapse text-[12.5px]">
              <thead>
                <tr>
                  <th className={TABLE_TH}>Period</th>
                  {activeTab.series.map((series) => (
                    <th key={series.key} className={TABLE_TH}>
                      {series.label} (days)
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeTab.points.map((point) => (
                  <tr key={point.label}>
                    <td className={cn(TABLE_TD, 'font-semibold text-[#1F1D4F]')}>
                      {point.label}
                    </td>
                    {activeTab.series.map((series) => (
                      <td
                        key={`${point.label}-${series.key}`}
                        className={cn(TABLE_TD, 'font-semibold text-[#2D2061]')}
                      >
                        {point.values[series.key] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={chartMaximized}
        onClose={() => setChartMaximized(false)}
        title={dashboard.heading}
        className="max-w-5xl"
        contentClassName="space-y-3"
        zClassName="z-[80]"
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex max-w-full flex-wrap rounded-[8px] border border-[#E6E5F2] bg-[#F7F7FA] p-0.5">
            {dashboard.tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTabId(tab.id)}
                className={cn(
                  'h-8 rounded-[6px] px-2.5 text-[12px] font-semibold transition-colors',
                  tab.id === activeTab.id
                    ? 'bg-[#2D2061] text-white'
                    : 'text-[#4B4A66] hover:bg-white',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <label className="ml-auto inline-flex items-center gap-1.5 text-[12.5px] text-[#4B4A66]">
            Activity Period:
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="h-[30px] rounded-[7px] border border-[#E6E5F2] bg-white px-2 font-semibold text-[#1F1D4F] outline-none"
              aria-label="Activity period"
            >
              {dashboard.periods.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {activeTab.kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="flex min-w-0 items-center justify-between gap-2 rounded-xl border border-[#E6E5F2] bg-[#F7F7FA] px-3 py-2.5"
            >
              <span className="text-[12.5px] text-[#8A89A3]">{kpi.label}</span>
              <span className="text-base font-semibold text-[#2D2061]">
                {kpi.value}
              </span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-[#E6E5F2] bg-white px-3 py-3">
          {chartPanel}
        </div>
      </Modal>
    </>
  )
}

function ActivityReportBlock({
  report,
  onChip,
}: {
  report: NonNullable<CopilotBotContent['activityReport']>
  onChip: (chip: CopilotChip) => void
}) {
  const [position, setPosition] = useState('all')
  const [skill, setSkill] = useState('all')
  const [source, setSource] = useState('all')
  const [view, setView] = useState<'table' | 'chart'>('table')

  const filtered = report.rows.filter((row) => {
    if (position !== 'all' && row.position !== position) return false
    if (source !== 'all' && row.source !== source) return false
    if (skill !== 'all' && !row.skills.includes(skill)) return false
    return true
  })

  const barsByPosition = report.positions
    .map((pos) => {
      const rows = filtered.filter((row) => row.position === pos)
      if (!rows.length) return null
      const avg = Math.round(
        rows.reduce((sum, row) => sum + row.skillMatch, 0) / rows.length,
      )
      return { id: pos, label: pos, value: avg }
    })
    .filter((item): item is { id: string; label: string; value: number } =>
      Boolean(item),
    )

  const selectClass =
    'h-[30px] min-w-0 max-w-full flex-1 basis-[8.5rem] rounded-[7px] border border-[#E6E5F2] bg-white px-2 text-[12.5px] text-[#1F1D4F] outline-none @min-[28rem]:flex-none @min-[28rem]:basis-auto'

  return (
    <div className={RICH_PANEL}>
      <div
        className={cn(
          CQ_STACK_ROW_28,
          'border-b border-[#EEEBE4] bg-[#F7F7FA] px-3.5 py-2.5',
        )}
      >
        <p className="min-w-0 flex-1 text-sm font-semibold text-[#1F1D4F]">
          {report.heading}
        </p>
        <span className="w-fit rounded-full bg-[#E8EEF9] px-2 py-0.5 text-[11px] font-semibold text-[#2D2061]">
          {filtered.length} records
        </span>
      </div>

      <div
        className={cn(
          CQ_STACK_ROW_40,
          'border-b border-[#EEEBE4] bg-[#F7F7FA] px-3.5 py-2.5',
        )}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className={selectClass}
            aria-label="Filter by position"
          >
            <option value="all">All positions</option>
            {report.positions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className={selectClass}
            aria-label="Filter by skills"
          >
            <option value="all">All skills</option>
            {report.skills.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className={selectClass}
            aria-label="Filter by source"
          >
            <option value="all">All sources</option>
            {report.sources.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1">
          <div className="inline-flex rounded-[7px] border border-[#E6E5F2] bg-white p-0.5">
            <Tooltip content="Table View">
              <button
                type="button"
                onClick={() => setView('table')}
                aria-label="Table View"
                aria-pressed={view === 'table'}
                className={cn(
                  'grid size-7 place-items-center rounded-[6px] transition-colors',
                  view === 'table'
                    ? 'bg-[#2D2061] text-white'
                    : 'text-[#4B4A66] hover:bg-[#F7F7FA]',
                )}
              >
                <Table2 className="size-3.5" strokeWidth={2} aria-hidden="true" />
              </button>
            </Tooltip>
            <Tooltip content="Chart View">
              <button
                type="button"
                onClick={() => setView('chart')}
                aria-label="Chart View"
                aria-pressed={view === 'chart'}
                className={cn(
                  'grid size-7 place-items-center rounded-[6px] transition-colors',
                  view === 'chart'
                    ? 'bg-[#2D2061] text-white'
                    : 'text-[#4B4A66] hover:bg-[#F7F7FA]',
                )}
              >
                <BarChart3
                  className="size-3.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>
            </Tooltip>
          </div>
          <Tooltip content="Download reports">
            <button
              type="button"
              onClick={() =>
                onChip({
                  id: 'toast',
                  label: 'Download reports',
                  toast: `Downloading Recruiterwise Activity Report (${filtered.length} rows)`,
                })
              }
              aria-label="Download reports"
              className="grid size-8 place-items-center rounded-[7px] border border-[#2D2061] bg-[#2D2061] text-white transition-colors hover:bg-[#241A52]"
            >
              <Download className="size-3.5" strokeWidth={2} aria-hidden="true" />
            </button>
          </Tooltip>
        </div>
      </div>

      {view === 'table' ? (
        <div className="overflow-x-auto bg-white">
          <table className="w-full min-w-[32rem] border-collapse text-[12.5px]">
            <thead>
              <tr>
                <th className={TABLE_TH}>Candidate</th>
                <th className={TABLE_TH}>Position</th>
                <th className={TABLE_TH}>City</th>
                <th className={TABLE_TH}>Skill Match(%)</th>
                <th className={TABLE_TH}>Source</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length ? (
                filtered.map((row) => (
                  <tr key={`${row.candidate}-${row.position}-${row.source}`}>
                    <td className={cn(TABLE_TD, 'font-semibold text-[#1F1D4F]')}>
                      {row.candidate}
                    </td>
                    <td className={cn(TABLE_TD, 'text-[#1F1D4F]')}>
                      {row.position}
                    </td>
                    <td className={cn(TABLE_TD, 'text-[#4B4A66]')}>
                      {row.city}
                    </td>
                    <td
                      className={cn(
                        TABLE_TD,
                        'font-bold',
                        row.skillMatch >= 90
                          ? 'text-[#1F8F57]'
                          : 'text-[#2D2061]',
                      )}
                    >
                      {row.skillMatch}%
                    </td>
                    <td className={cn(TABLE_TD, 'text-[#4B4A66]')}>
                      {row.source}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-[13px] text-[#8A89A3]"
                  >
                    No records match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white px-3.5 py-3">
          {filtered.length === 0 || barsByPosition.length === 0 ? (
            <p className="py-4 text-center text-[13px] text-[#8A89A3]">
              No chart data for the selected filters.
            </p>
          ) : (
            <div className="w-full rounded-xl border border-[#EEEBE4] bg-[#F7F7FA] px-3 py-3">
              <p className="mb-2 text-[12.5px] font-semibold text-[#1F1D4F]">
                Avg skill match by position
              </p>
              <VerticalBarChart
                items={barsByPosition}
                yMax={100}
                yLabel="Skill match %"
                barColor={COPILOT_NAVY}
                className="w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EmailPreviewBlock({
  preview,
  onChip,
}: {
  preview: NonNullable<CopilotBotContent['emailPreview']>
  onChip: (chip: CopilotChip) => void
}) {
  return (
    <div className="mt-2.5 grid gap-2.5">
      <div className={RICH_PANEL}>
        <div className="flex items-center gap-2 border-b border-[#EEEBE4] px-3.5 py-2.5">
          <p className="min-w-0 flex-1 text-sm font-semibold text-[#1F1D4F]">
            {preview.recipientsHeading}
          </p>
          <span className="rounded-full bg-[#E8EEF9] px-2 py-0.5 text-[11px] font-semibold text-[#2D2061]">
            {preview.recipientsBadge}
          </span>
        </div>
        <ul className="grid gap-2 p-2.5">
          {preview.recipients.map((recipient) => (
            <li
              key={recipient.name}
              className={cn(
                CQ_STACK_ROW_28,
                'rounded-lg border border-[#E6E5F2] bg-white px-3 py-2.5',
              )}
            >
              <div className="flex min-w-0 flex-1 items-start gap-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#E8EEF9] text-xs font-bold text-[#2D2061]">
                  {recipient.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-semibold text-[#1F1D4F]">
                      {recipient.name}
                    </p>
                    <span className="rounded-full bg-[#E3F5EA] px-2 py-0.5 text-[11px] font-semibold text-[#1F8F57]">
                      {recipient.match}% match
                    </span>
                    <span className="text-[12px] text-[#8A89A3]">
                      · {recipient.experience}
                    </span>
                  </div>
                  <p className="mt-0.5 break-all text-[12.5px] text-[#8A89A3]">
                    Recipient Email: {recipient.email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  onChip({
                    id: recipient.sendId,
                    label: `Send email to ${recipient.name}`,
                  })
                }
                className={cn(
                  CQ_SELF_CENTER_28,
                  'text-[12.5px] font-semibold text-[#2D2061] hover:underline',
                )}
              >
                Action: Send Email
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className={RICH_PANEL}>
        <div className="border-b border-[#EEEBE4] bg-[#F7F7FA] px-3.5 py-2.5 text-[13px] text-[#1F1D4F]">
          Subject:{' '}
          <span className="font-semibold">{preview.subject}</span>
        </div>
        <div className="whitespace-pre-wrap px-3.5 py-3 text-[13.5px] leading-relaxed text-[#2B2823]">
          {preview.body}
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-1.5">
        <button
          type="button"
          onClick={() => onChip(preview.editChip)}
          className="inline-flex h-9 items-center rounded-lg border border-[#E6E5F2] bg-white px-3.5 text-[13px] font-semibold text-[#2D2061] hover:bg-[#E8EEF9]"
        >
          {preview.editChip.label}
        </button>
        <button
          type="button"
          onClick={() => onChip(preview.sendChip)}
          className="inline-flex h-9 items-center rounded-lg border border-[#2D2061] bg-[#2D2061] px-3.5 text-[13px] font-semibold text-white hover:bg-[#241A52]"
        >
          {preview.sendChip.label}
        </button>
      </div>
    </div>
  )
}

function RankedApplicantsBlock({
  block,
  onChip,
}: {
  block: NonNullable<CopilotBotContent['rankedApplicants']>
  onChip: (chip: CopilotChip) => void
}) {
  return (
    <div className={RICH_PANEL}>
      <div className="flex items-center gap-2 border-b border-[#EEEBE4] px-3.5 py-2.5">
        <p className="min-w-0 flex-1 text-sm font-semibold text-[#1F1D4F]">
          {block.heading}
        </p>
        <span className="rounded-full bg-[#E3F5EA] px-2 py-0.5 text-[11px] font-semibold text-[#1F8F57]">
          {block.badge}
        </span>
      </div>
      <ul>
        {block.applicants.map((applicant) => (
          <li
            key={applicant.name}
            className={cn(
              CQ_STACK_ROW_28,
              'border-b border-[#F3F1EC] px-3.5 py-3 last:border-b-0',
            )}
          >
            <div className="flex min-w-0 flex-1 items-start gap-2.5">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#E3F5EA] text-xs font-bold text-[#1F6B45]">
                {applicant.initials}
              </span>
              <div className="min-w-0 flex-1 break-words">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-sm font-semibold text-[#1F1D4F]">
                    {applicant.name}
                  </p>
                  <span className="rounded-full bg-[#E3F5EA] px-2 py-0.5 text-[11px] font-semibold text-[#1F8F57]">
                    {applicant.match}% match
                  </span>
                  <span className="rounded-full bg-[#FFF5E3] px-2 py-0.5 text-[11px] font-semibold text-[#B56A00]">
                    {applicant.experience}
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] text-[#4B4A66]">
                  <span className="font-semibold text-[#1F1D4F]">Skills:</span>{' '}
                  {applicant.skills}
                </p>
              </div>
            </div>
            <div
              className={cn(
                CQ_SELF_CENTER_28,
                'flex shrink-0 flex-wrap items-center gap-2.5',
              )}
            >
              <span className="text-[12.5px] font-semibold text-[#2D2061]">
                Status: {applicant.status}
              </span>
              <button
                type="button"
                onClick={() =>
                  onChip({
                    id: 'toast',
                    label: 'View CV',
                    toast: `Opening CV for ${applicant.name}`,
                  })
                }
                className={BTN_SM_GHOST}
              >
                View CV
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div
        className={cn(
          CQ_STACK_ROW_28,
          'border-t border-[#EEEBE4] px-3.5 py-2.5',
        )}
      >
        <p className="min-w-0 flex-1 text-[13px] text-[#4B4A66]">
          {block.footer}
        </p>
        <button
          type="button"
          onClick={() => onChip(block.primary)}
          className="inline-flex h-9 shrink-0 items-center rounded-lg border border-[#2D2061] bg-[#2D2061] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#241A52]"
        >
          {block.primary.label}
        </button>
      </div>
    </div>
  )
}

function StatusPill({
  pill,
}: {
  pill: { label: string; tone: keyof typeof PILL_TONE_CLASS }
}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold',
        PILL_TONE_CLASS[pill.tone],
      )}
    >
      {pill.label}
    </span>
  )
}

function ConfirmBox({
  box,
  onChip,
}: {
  box: NonNullable<CopilotBotContent['confirmBox']>
  onChip: (chip: CopilotChip) => void
}) {
  return (
    <div className="mt-2.5 grid gap-2 rounded-xl border border-[#F3DFB5] bg-[#FFF5E3] px-3.5 py-3">
      <p className="text-sm font-semibold text-[#1F1D4F]">{box.title}</p>
      {box.lines.map((line) => (
        <p key={line} className="text-[13px] text-[#4B4A66]">
          {line}
        </p>
      ))}
      <div className="mt-1 flex flex-wrap gap-2">
        <ActionChip chip={box.primary} onChip={onChip} />
        {box.secondary ? (
          <ActionChip chip={box.secondary} onChip={onChip} />
        ) : null}
      </div>
    </div>
  )
}

function GapList({
  gaps,
  onGapAdd,
}: {
  gaps: NonNullable<CopilotBotContent['gaps']>
  onGapAdd: (key: 'exp' | 'skills' | 'prefs') => void
}) {
  return (
    <ul className="mt-2.5 grid gap-1.5">
      {gaps.map((gap) => (
        <li
          key={gap.key}
          className="flex items-center justify-between gap-2 rounded-lg bg-white px-2.5 py-2"
        >
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#1F1D4F]">
              {gap.title}
            </p>
            <p className="text-xs text-[#8A89A3]">{gap.detail}</p>
          </div>
          <ChipButton
            chip={{
              id: `prof-${gap.key}`,
              label: 'Add',
              variant: 'primary',
            }}
            onClick={() => onGapAdd(gap.key)}
          />
        </li>
      ))}
    </ul>
  )
}

function MatchList({
  matches,
  onOpenJob,
}: {
  matches: NonNullable<CopilotBotContent['matches']>
  onOpenJob: (title: string) => void
}) {
  return (
    <ul className="mt-2.5 flex flex-col gap-2">
      {matches.map((match) => (
        <li key={match.title}>
          <button
            type="button"
            onClick={() => onOpenJob(match.title)}
            className="grid w-full grid-cols-[1fr_auto] gap-x-3 rounded-[10px] border border-[#E6E5F2] bg-white px-3 py-2.5 text-left transition-colors hover:border-[#5D5A8A]"
          >
            <span className="text-sm font-semibold text-[#1F1D4F]">
              {match.title}
            </span>
            <span className="row-span-2 self-center text-[15px] font-bold text-[#2F8F5B]">
              {match.score}%
            </span>
            <span className="text-xs text-[#8A89A3]">
              {match.company}
              {match.why ? (
                <>
                  <br />
                  {match.why}
                </>
              ) : null}
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}

function ParseList({
  items,
}: {
  items: NonNullable<CopilotBotContent['parse']>
}) {
  return (
    <ul className="mt-2.5 grid gap-1.5">
      {items.map((item) => (
        <li
          key={item.title}
          className={cn(
            'grid grid-cols-[1fr_auto] gap-x-2.5 rounded-lg bg-white px-2.5 py-2',
            item.confidence === 'low' && 'border border-dashed border-[#E0B45A]',
          )}
        >
          <p className="text-[13px] font-semibold text-[#1F1D4F]">
            {item.title}
          </p>
          <span
            className={cn(
              'row-span-2 self-center rounded-full px-2 py-0.5 text-[11px] font-semibold',
              item.confidence === 'high'
                ? 'bg-[#E7F6EE] text-[#2F8F5B]'
                : 'bg-[#F8EED8] text-[#8A5A0C]',
            )}
          >
            {item.confidence === 'high' ? 'Confident' : 'Check'}
          </span>
          <p className="text-[11.5px] text-[#8A89A3]">{item.detail}</p>
        </li>
      ))}
    </ul>
  )
}

function AppList({ apps }: { apps: NonNullable<CopilotBotContent['apps']> }) {
  return (
    <ul className="mt-2.5 grid gap-1.5">
      {apps.map((app) => (
        <li
          key={app.title}
          className="flex items-center justify-between gap-2 rounded-lg bg-white px-2.5 py-2"
        >
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#1F1D4F]">
              {app.title}
            </p>
            <p className="text-xs text-[#8A89A3]">
              {app.company} · {app.next}
            </p>
          </div>
          <span
            className={cn(
              'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold',
              app.statusTone === 'interview' && 'bg-[#E8EEF9] text-[#2D2061]',
              app.statusTone === 'review' && 'bg-[#FFF4E5] text-[#9A6700]',
              app.statusTone === 'submitted' && 'bg-[#E8EEF9] text-[#1F5F9E]',
            )}
          >
            {app.status}
          </span>
        </li>
      ))}
    </ul>
  )
}

function Timeline({
  steps,
}: {
  steps: NonNullable<CopilotBotContent['timeline']>
}) {
  return (
    <ol className="mt-2.5 ml-1.5 border-l-2 border-[#E6E5F2] pl-3">
      {steps.map((step) => (
        <li key={step.label} className="relative pb-2.5 last:pb-0">
          <span
            className={cn(
              'absolute -left-[1.2rem] top-1.5 size-2 rounded-full',
              step.state === 'done' && 'bg-[#2D2061]',
              step.state === 'now' &&
                'bg-[#2D2061] shadow-[0_0_0_3px_#E8EEF9]',
              step.state === 'upcoming' && 'bg-[#CFCDE3]',
            )}
            aria-hidden="true"
          />
          <p className="text-[13px] font-semibold text-[#1F1D4F]">
            {step.label}
          </p>
          <p className="text-xs text-[#8A89A3]">{step.detail}</p>
        </li>
      ))}
    </ol>
  )
}

function WhyList({ items }: { items: NonNullable<CopilotBotContent['why']> }) {
  return (
    <ul className="mt-2.5 grid gap-1.5">
      {items.map((item) => (
        <li
          key={item.text}
          className="flex items-start gap-2 text-[13px] text-[#1F1D4F]"
        >
          {item.ok ? (
            <Check
              className="mt-0.5 size-3.5 shrink-0 text-[#2F8F5B]"
              strokeWidth={2.4}
              aria-hidden="true"
            />
          ) : (
            <X
              className="mt-0.5 size-3.5 shrink-0 text-[#C44B7A]"
              strokeWidth={2.4}
              aria-hidden="true"
            />
          )}
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  )
}

function ProfileRing({
  ring,
}: {
  ring: { pct: number; summary: string }
}) {
  const angle = Math.round((ring.pct / 100) * 360)
  return (
    <div className="mt-1 flex items-center gap-3">
      <div
        className="relative grid size-14 shrink-0 place-items-center rounded-full text-[13px] font-bold text-[#1F1D4F]"
        style={{
          background: `conic-gradient(#2D2061 ${angle}deg, #E6E5F2 0deg)`,
        }}
      >
        <span className="grid size-10 place-items-center rounded-full bg-[#F4F4FB]">
          {ring.pct}%
        </span>
      </div>
      <p className="text-[#1F1D4F]">
        <span className="font-semibold">{ring.summary}</span>
      </p>
    </div>
  )
}

function UploadBlock({
  upload,
}: {
  upload: { name: string; detail: string }
}) {
  const [progress, setProgress] = useState(8)
  useEffect(() => {
    const id = window.setTimeout(() => setProgress(100), 80)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div className="mt-2.5 grid grid-cols-[auto_1fr] items-center gap-2.5 rounded-lg bg-white px-3 py-2.5">
      <div className="grid size-9 place-items-center rounded-lg bg-[#ECEAF7] text-[#2D2061]">
        <FileText className="size-4" strokeWidth={2} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-[#1F1D4F]">
          {upload.name}
        </p>
        <p className="text-xs text-[#8A89A3]">{upload.detail}</p>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#E6E5F2]">
          <div
            className="h-full rounded-full bg-[#2D2061] transition-[width] duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

function groupFormRows(fields: CopilotFormField[]): CopilotFormField[][] {
  const rows: CopilotFormField[][] = []
  for (let i = 0; i < fields.length; ) {
    const field = fields[i]!
    const next = fields[i + 1]
    if (field.half && next?.half) {
      rows.push([field, next])
      i += 2
    } else {
      rows.push([field])
      i += 1
    }
  }
  return rows
}

function MiniForm({
  fields,
  values,
  onChange,
}: {
  fields: CopilotFormField[]
  values: Record<string, string>
  onChange: (id: string, value: string) => void
}) {
  const baseId = useId()
  const rows = groupFormRows(fields)

  return (
    <div className="mt-2.5 grid gap-2">
      {rows.map((row) => {
        if (row.length === 2) {
          const [left, right] = row as [CopilotFormField, CopilotFormField]
          return (
            <div
              key={`${left.id}-${right.id}`}
              className="grid grid-cols-2 gap-2"
            >
              <Field
                baseId={baseId}
                field={left}
                value={values[left.id] ?? left.value}
                onChange={onChange}
              />
              <Field
                baseId={baseId}
                field={right}
                value={values[right.id] ?? right.value}
                onChange={onChange}
              />
            </div>
          )
        }
        const field = row[0]!
        return (
          <Field
            key={field.id}
            baseId={baseId}
            field={field}
            value={values[field.id] ?? field.value}
            onChange={onChange}
          />
        )
      })}
    </div>
  )
}

function Field({
  baseId,
  field,
  value,
  onChange,
}: {
  baseId: string
  field: CopilotFormField
  value: string
  onChange: (id: string, value: string) => void
}) {
  const id = `${baseId}-${field.id}`
  const controlClass =
    'rounded-lg border border-[#CFCDE3] bg-white px-2.5 text-[13px] font-normal text-[#1F1D4F] outline-none'
  const kind = field.kind ?? 'text'

  let control: ReactNode
  switch (kind) {
    case 'select':
      control = (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={cn(controlClass, 'h-9')}
        >
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )
      break
    case 'textarea':
      control = (
        <textarea
          id={id}
          value={value}
          rows={8}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={cn(controlClass, 'min-h-[9rem] resize-y py-2')}
        />
      )
      break
    case 'text':
      control = (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          className={cn(controlClass, 'h-9')}
        />
      )
      break
    default: {
      const _exhaustive: never = kind
      return _exhaustive
    }
  }

  return (
    <label className="grid gap-1 text-xs font-medium text-[#4B4A66]">
      {field.label}
      {control}
    </label>
  )
}

function ActionChip({
  chip,
  onChip,
}: {
  chip: CopilotChip
  onChip: (chip: CopilotChip) => void
}) {
  return <ChipButton chip={chip} onClick={() => onChip(chip)} />
}

function ChipButton({
  chip,
  onClick,
}: {
  chip: CopilotChip
  onClick: () => void
}) {
  const variant = chip.variant ?? 'default'
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-[30px] items-center rounded-[7px] border px-2.5 text-[12.5px] font-semibold transition-colors',
        variant === 'primary' &&
          'border-[#2D2061] bg-[#2D2061] text-white hover:bg-[#241A52]',
        variant === 'skip' &&
          'border-dashed border-[#CFCDE3] bg-white text-[#8A89A3] hover:bg-[#F4F4FB]',
        variant === 'danger' &&
          'border-[#C44B7A] bg-[#C44B7A] text-white hover:bg-[#B03F6C]',
        variant === 'default' &&
          'border-[#E6E5F2] bg-white text-[#1F1D4F] hover:bg-[#E8EEF9]',
      )}
    >
      {chip.label}
    </button>
  )
}
