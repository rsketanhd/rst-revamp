import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
  Volume2,
  VolumeX,
} from 'lucide-react'
import type { AssessmentVideoQuestion } from '../../../data/oneWayAssessment'
import { cn } from '../../../lib/cn'
import { Checkbox, toast } from '../../ui'

export type VideoResponsesSectionProps = {
  durationLabel: string
  questions: AssessmentVideoQuestion[]
  candidateName?: string
}

type QuestionNavButtonProps = {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}

const PLAYER_TOTAL_SECONDS = 4 * 60 + 5
const TICK_MS = 250
const SKIP_SECONDS = 10

function QuestionNavButton({
  label,
  disabled,
  onClick,
  children,
}: QuestionNavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid size-8 place-items-center rounded-md border border-[#E0DDEA] bg-white text-[#2D2061] hover:bg-[#F7F6FA] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  )
}

function parseDurationSeconds(value: string): number {
  const parts = value.split(':').map((part) => Number(part))
  if (parts.length === 2 && parts.every((n) => Number.isFinite(n))) {
    return parts[0]! * 60 + parts[1]!
  }
  if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
    return parts[0]! * 3600 + parts[1]! * 60 + parts[2]!
  }
  return 0
}

function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function downloadTranscript(
  questions: AssessmentVideoQuestion[],
  candidateName: string,
) {
  const lines = [
    `Video Interview Transcript`,
    `Candidate: ${candidateName}`,
    `Generated: ${new Date().toLocaleString()}`,
    '',
    ...questions.flatMap((item) => [
      `Q${item.number}. ${item.question}`,
      `Answer (${item.duration}, retakes: ${item.retakes}, skill: ${item.skillTag}):`,
      item.answer,
      '',
    ]),
  ]
  const blob = new Blob([lines.join('\n')], {
    type: 'text/plain;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${candidateName.replace(/\s+/g, '-').toLowerCase()}-transcript.txt`
  anchor.click()
  URL.revokeObjectURL(url)
}

/**
 * Video Interview — question list (left) + Que/Ans & player in one right panel.
 */
export function VideoResponsesSection({
  durationLabel,
  questions,
  candidateName = 'Candidate',
}: VideoResponsesSectionProps) {
  const playerRef = useRef<HTMLDivElement>(null)
  const [activeId, setActiveId] = useState(questions[0]?.id ?? '')
  const [autoPlayNext, setAutoPlayNext] = useState(true)
  const [playAllMode, setPlayAllMode] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSeconds, setCurrentSeconds] = useState(0)
  const [muted, setMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)

  const activeIndex = Math.max(
    0,
    questions.findIndex((item) => item.id === activeId),
  )
  const active = questions[activeIndex] ?? questions[0]
  const playAllDuration = formatDuration(
    questions.reduce(
      (total, item) => total + parseDurationSeconds(item.duration),
      0,
    ),
  )
  const progressPercent = Math.min(
    100,
    (currentSeconds / PLAYER_TOTAL_SECONDS) * 100,
  )

  function selectIndex(index: number, { keepPlaying = false } = {}) {
    const next = questions[index]
    if (!next) return
    setActiveId(next.id)
    setCurrentSeconds(0)
    if (!keepPlaying) {
      setIsPlaying(false)
      setPlayAllMode(false)
    }
  }

  function handlePlayCurrent() {
    if (!active) return
    setIsPlaying(true)
    toast.success(`Playing Q${active.number} video response.`, {
      title: 'Video',
    })
  }

  function handlePause() {
    setIsPlaying(false)
    setPlayAllMode(false)
  }

  function handlePlayAll() {
    selectIndex(0, { keepPlaying: true })
    setPlayAllMode(true)
    setIsPlaying(true)
    setCurrentSeconds(0)
    toast.success(
      autoPlayNext
        ? `Playing all ${questions.length} responses in sequence · ${playAllDuration}.`
        : `Playing from Q1 · ${playAllDuration}. Turn on Auto-play next to continue automatically.`,
      { title: 'Play All' },
    )
  }

  function skipBy(delta: number) {
    setCurrentSeconds((value) =>
      Math.min(PLAYER_TOTAL_SECONDS, Math.max(0, value + delta)),
    )
  }

  function handleSeek(ratio: number) {
    setCurrentSeconds(
      Math.min(PLAYER_TOTAL_SECONDS, Math.max(0, ratio * PLAYER_TOTAL_SECONDS)),
    )
  }

  async function toggleFullscreen() {
    const node = playerRef.current
    if (!node) return
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        toast.success('Exited fullscreen.', { title: 'Video' })
        return
      }
      await node.requestFullscreen()
      toast.success('Entered fullscreen.', { title: 'Video' })
    } catch {
      toast.error('Fullscreen is not available in this browser.', {
        title: 'Video',
      })
    }
  }

  function cyclePlaybackRate() {
    setPlaybackRate((rate) => {
      const next = rate >= 1.5 ? 1 : rate >= 1.25 ? 1.5 : 1.25
      toast.success(`Playback speed set to ${next}x.`, { title: 'Video' })
      return next
    })
  }

  useEffect(() => {
    if (!isPlaying) return

    const timer = window.setInterval(() => {
      setCurrentSeconds((value) => {
        const next = value + (TICK_MS / 1000) * playbackRate
        if (next < PLAYER_TOTAL_SECONDS) return next

        window.clearInterval(timer)
        setIsPlaying(false)

        if (autoPlayNext && activeIndex < questions.length - 1) {
          const upcoming = questions[activeIndex + 1]
          if (upcoming) {
            setActiveId(upcoming.id)
            setCurrentSeconds(0)
            setIsPlaying(true)
            toast.success(`Auto-playing Q${upcoming.number}.`, {
              title: 'Auto-play',
            })
          }
          return 0
        }

        if (playAllMode) {
          setPlayAllMode(false)
          toast.success('Finished playing all responses.', {
            title: 'Play All',
          })
        }
        return PLAYER_TOTAL_SECONDS
      })
    }, TICK_MS)

    return () => window.clearInterval(timer)
  }, [
    isPlaying,
    playbackRate,
    autoPlayNext,
    activeIndex,
    questions,
    playAllMode,
  ])

  if (!active) {
    return (
      <p className="text-sm text-[#8B8B9E]">No video responses available.</p>
    )
  }

  const isFirst = activeIndex <= 0
  const isLast = activeIndex >= questions.length - 1

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[15px] font-bold text-[#2D2061]">Video Responses</h3>
        <div className="flex flex-wrap items-center gap-3">
          <Checkbox
            id="video-auto-play-next"
            checked={autoPlayNext}
            onChange={(e) => {
              setAutoPlayNext(e.target.checked)
              toast.success(
                e.target.checked
                  ? 'Auto-play next enabled.'
                  : 'Auto-play next disabled.',
                { title: 'Video' },
              )
            }}
            label="Auto-play next"
            className="!gap-0 [&_label]:items-center [&_label]:gap-2 [&_span]:text-[13px] [&_span]:font-medium [&_span]:text-[#4B4A66] [&_input]:mt-0"
          />
          <button
            type="button"
            onClick={handlePlayAll}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#2D2061] px-3.5 text-[12px] font-semibold text-white hover:bg-[#241A52]"
          >
            <Play
              className="size-3.5 translate-x-px"
              strokeWidth={2}
              fill="currentColor"
              aria-hidden="true"
            />
            Play All · {playAllDuration}
          </button>
          <span
            className="hidden h-5 w-px bg-[#E0DDEA] sm:block"
            aria-hidden="true"
          />
          <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E0DDEA] bg-white px-3.5 text-[12px] font-medium text-[#4B4A66]">
            <Clock3 className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            Interview Duration: {durationLabel}
          </span>
          <button
            type="button"
            onClick={() => {
              downloadTranscript(questions, candidateName)
              toast.success('Transcript downloaded.', {
                title: 'Download Transcript',
              })
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#2D2061] bg-white px-3.5 text-[12px] font-semibold text-[#2D2061] hover:bg-[#F7F6FA]"
          >
            <FileText
              className="size-3.5"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            Download Transcript
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(15rem,20rem)_minmax(0,1fr)] lg:items-start">
        <ul className="flex flex-col gap-2.5">
          {questions.map((item, index) => {
            const selected = item.id === active.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    selectIndex(index)
                    toast.success(`Opened Q${item.number}.`, {
                      title: 'Video Responses',
                    })
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg border px-3 py-3 text-left transition-colors',
                    selected
                      ? 'border-[#2D2061] bg-[#2D2061] text-white'
                      : 'border-[#E8E6F0] bg-white text-[#1F1D4F] hover:border-[#C8C5D6]',
                  )}
                >
                  <span
                    className={cn(
                      'grid size-7 shrink-0 place-items-center rounded text-[11px] font-bold',
                      selected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#2D2061] text-white',
                    )}
                  >
                    Q{item.number}
                  </span>
                  <span className="min-w-0 flex-1 line-clamp-3 text-[12.5px] leading-snug">
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      'inline-flex shrink-0 flex-col items-end gap-1.5 text-[11px] font-semibold',
                      selected ? 'text-white/85' : 'text-[#8B8B9E]',
                    )}
                  >
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="size-3" strokeWidth={2} />
                      {item.duration}
                    </span>
                    <span
                      className={cn(
                        'grid size-6 place-items-center rounded-full',
                        selected
                          ? 'bg-white/15 text-white'
                          : 'bg-[#F0EEF5] text-[#2D2061]',
                      )}
                    >
                      <Play
                        className="size-3 translate-x-px"
                        strokeWidth={2}
                        fill="currentColor"
                      />
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="min-w-0 overflow-hidden rounded-xl border border-[#E8E6F0] bg-white">
          <div className="border-b border-[#F0EEF5] p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-2.5">
                <p className="text-[13px] leading-relaxed text-[#1F1D4F]">
                  <span className="font-bold">Que : </span>
                  {active.question}
                </p>
                <p className="text-[13px] leading-relaxed text-[#4B4A66]">
                  <span className="font-bold text-[#1F1D4F]">Ans : </span>
                  {active.answer}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <QuestionNavButton
                  label="Previous question"
                  disabled={isFirst}
                  onClick={() => selectIndex(activeIndex - 1)}
                >
                  <ChevronLeft className="size-4" strokeWidth={2} />
                </QuestionNavButton>
                <QuestionNavButton
                  label="Next question"
                  disabled={isLast}
                  onClick={() => selectIndex(activeIndex + 1)}
                >
                  <ChevronRight className="size-4" strokeWidth={2} />
                </QuestionNavButton>
              </div>
            </div>

            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#F4F5F8] px-2.5 py-1 text-[11px] font-semibold text-[#4B4A66]">
                Answer : {active.duration}
              </span>
              <span className="rounded-md bg-[#F4F5F8] px-2.5 py-1 text-[11px] font-semibold text-[#4B4A66]">
                Retakes : {active.retakes}
              </span>
              <span className="rounded-md bg-[#FFF1E8] px-2.5 py-1 text-[11px] font-semibold text-[#C2410C]">
                {active.skillTag}
              </span>
            </div>
          </div>

          <div
            ref={playerRef}
            className="relative bg-[#2D2061] text-white"
          >
            <button
              type="button"
              onClick={() => (isPlaying ? handlePause() : handlePlayCurrent())}
              className="flex min-h-[14rem] w-full flex-col items-center justify-center gap-2.5 px-4 py-12 transition-colors hover:bg-[#241A52] sm:min-h-[16rem]"
            >
              <span className="grid size-12 place-items-center rounded-full border-2 border-white">
                {isPlaying ? (
                  <Pause
                    className="size-5"
                    strokeWidth={1.75}
                    fill="currentColor"
                    aria-hidden="true"
                  />
                ) : (
                  <Play
                    className="size-5 translate-x-0.5"
                    strokeWidth={1.75}
                    fill="currentColor"
                    aria-hidden="true"
                  />
                )}
              </span>
              <span className="text-sm font-semibold">
                {isPlaying
                  ? muted
                    ? 'Playing (muted)'
                    : 'Playing video response'
                  : 'Click to play video response'}
              </span>
              {playbackRate !== 1 ? (
                <span className="text-[11px] font-medium text-white/75">
                  Speed {playbackRate}x
                </span>
              ) : null}
            </button>

            <div className="border-t border-white/10 bg-[#241A52] px-3 py-2.5">
              <button
                type="button"
                aria-label="Seek"
                className="mb-2 block h-1 w-full overflow-hidden rounded-full bg-white/20"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const ratio = (e.clientX - rect.left) / rect.width
                  handleSeek(ratio)
                }}
              >
                <span
                  className="block h-full rounded-full bg-[#E53935]"
                  style={{ width: `${Math.max(progressPercent, 1)}%` }}
                />
              </button>
              <div className="flex flex-wrap items-center gap-1.5 text-white">
                <button
                  type="button"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  onClick={() =>
                    isPlaying ? handlePause() : handlePlayCurrent()
                  }
                  className="grid size-7 place-items-center rounded hover:bg-white/10"
                >
                  {isPlaying ? (
                    <Pause className="size-3.5" fill="currentColor" />
                  ) : (
                    <Play
                      className="size-3.5 translate-x-px"
                      fill="currentColor"
                    />
                  )}
                </button>
                <button
                  type="button"
                  aria-label="Rewind 10 seconds"
                  onClick={() => skipBy(-SKIP_SECONDS)}
                  className="grid size-7 place-items-center rounded hover:bg-white/10"
                >
                  <RotateCcw className="size-3.5" strokeWidth={2} />
                </button>
                <button
                  type="button"
                  aria-label="Forward 10 seconds"
                  onClick={() => skipBy(SKIP_SECONDS)}
                  className="grid size-7 place-items-center rounded hover:bg-white/10"
                >
                  <RotateCw className="size-3.5" strokeWidth={2} />
                </button>
                <span className="ml-1 text-[11px] font-medium tabular-nums text-white/90">
                  {formatClock(currentSeconds)} /{' '}
                  {formatClock(PLAYER_TOTAL_SECONDS)}
                </span>
                <div className="ml-auto flex items-center gap-0.5">
                  <button
                    type="button"
                    aria-label={muted ? 'Unmute' : 'Mute'}
                    onClick={() => {
                      setMuted((value) => !value)
                      toast.success(muted ? 'Sound on.' : 'Sound muted.', {
                        title: 'Video',
                      })
                    }}
                    className="grid size-7 place-items-center rounded hover:bg-white/10"
                  >
                    {muted ? (
                      <VolumeX className="size-3.5" strokeWidth={2} />
                    ) : (
                      <Volume2 className="size-3.5" strokeWidth={2} />
                    )}
                  </button>
                  <button
                    type="button"
                    aria-label="Fullscreen"
                    onClick={() => void toggleFullscreen()}
                    className="grid size-7 place-items-center rounded hover:bg-white/10"
                  >
                    <Maximize2 className="size-3.5" strokeWidth={2} />
                  </button>
                  <button
                    type="button"
                    aria-label="Playback settings"
                    onClick={cyclePlaybackRate}
                    className="grid size-7 place-items-center rounded hover:bg-white/10"
                  >
                    <Settings className="size-3.5" strokeWidth={2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
