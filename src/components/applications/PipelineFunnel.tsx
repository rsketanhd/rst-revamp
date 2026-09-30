import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { PipelineStage, PipelineStageId } from '../../data/applications'

export type PipelineFunnelProps = {
  stages: PipelineStage[]
  activeId: PipelineStageId
  onChange: (id: PipelineStageId) => void
  className?: string
}

/** Depth of each arrow point / notch, in px */
const ARROW = 16
/** White gap left between neighbouring arrows, in px */
const GAP = 4

/** Chevron outline: flat left on the first stage, flat right on the last. */
function chevronClip(first: boolean, last: boolean): CSSProperties {
  const right = last
    ? '100% 0, 100% 100%'
    : `calc(100% - ${ARROW}px) 0, 100% 50%, calc(100% - ${ARROW}px) 100%`
  const left = first ? '0 100%' : `0 100%, ${ARROW}px 50%`
  return { clipPath: `polygon(0 0, ${right}, ${left})` }
}

/**
 * Horizontal application-stage pipeline as joined chevrons. Every stage is as
 * wide as the widest one; stages that don't fit scroll horizontally — by
 * dragging, the mouse wheel, the ‹ › buttons, or Left/Right arrow keys.
 * The active stage is navy.
 */
export function PipelineFunnel({
  stages,
  activeId,
  onChange,
  className,
}: PipelineFunnelProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ left: false, right: false })

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const update = () =>
      setEdges({
        left: el.scrollLeft > 0,
        right: el.scrollLeft < el.scrollWidth - el.clientWidth - 1,
      })

    // Vertical mouse wheel scrolls the strip sideways while it can still move
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
      const max = el.scrollWidth - el.clientWidth
      const next = el.scrollLeft + event.deltaY
      if (max <= 0 || (next <= 0 && el.scrollLeft <= 0) || (next >= max && el.scrollLeft >= max)) {
        return
      }
      event.preventDefault()
      el.scrollLeft = next
    }

    update()
    el.addEventListener('scroll', update, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      el.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', update)
    }
  }, [stages.length])

  function scrollByPage(direction: -1 | 1) {
    const el = scrollerRef.current
    el?.scrollBy({ left: direction * el.clientWidth * 0.75, behavior: 'smooth' })
  }

  /* ----- drag to scroll (mouse) ----- */
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: false })
  const [dragging, setDragging] = useState(false)
  /** Movement (px) before a press counts as a drag rather than a click */
  const DRAG_THRESHOLD = 5

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const el = scrollerRef.current
    if (!el) return
    drag.current = {
      active: true,
      startX: event.clientX,
      startLeft: el.scrollLeft,
      moved: false,
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const el = scrollerRef.current
    if (!drag.current.active || !el) return
    const dx = event.clientX - drag.current.startX
    if (!drag.current.moved && Math.abs(dx) < DRAG_THRESHOLD) return
    if (!drag.current.moved) {
      drag.current.moved = true
      setDragging(true)
      el.setPointerCapture(event.pointerId)
    }
    el.scrollLeft = drag.current.startLeft - dx
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return
    drag.current.active = false
    setDragging(false)
    const el = scrollerRef.current
    if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
  }

  /** A drag shouldn't also select the stage under the pointer */
  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (drag.current.moved) {
      event.preventDefault()
      event.stopPropagation()
      drag.current.moved = false
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const el = scrollerRef.current
    el?.scrollBy({ left: event.key === 'ArrowLeft' ? -200 : 200, behavior: 'smooth' })
  }

  return (
    <section
      aria-label="Application pipeline"
      className={cn('relative w-full min-w-0', className)}
    >
      {edges.left ? (
        <ScrollButton side="left" onClick={() => scrollByPage(-1)} />
      ) : null}
      {edges.right ? (
        <ScrollButton side="right" onClick={() => scrollByPage(1)} />
      ) : null}
      <div
        ref={scrollerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={handleClickCapture}
        aria-label="Pipeline stages — use Left and Right arrow keys to scroll"
        className={cn(
          'w-full select-none overflow-x-auto overflow-y-hidden overscroll-x-contain rounded-lg outline-none scrollbar-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/30',
          dragging ? 'cursor-grabbing' : 'cursor-grab',
        )}
      >
        {/* Equal 1fr columns in a max-content grid = every stage as wide as the widest one */}
        <div className="grid min-w-full w-max auto-cols-fr grid-flow-col items-stretch">
          {stages.map((stage, index) => {
            const active = stage.id === activeId
            const first = index === 0
            const last = index === stages.length - 1

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onChange(stage.id)}
                aria-pressed={active}
                style={{
                  ...chevronClip(first, last),
                  marginLeft: first ? 0 : -(ARROW - GAP),
                }}
                className={cn(
                  'flex min-h-[5.5rem] flex-col justify-center py-3 pr-8 text-left transition-colors [cursor:inherit]',
                  first ? 'pl-5' : 'pl-9',
                  active
                    ? 'bg-[#2D2061] text-white'
                    : 'bg-[#F1F0F7] text-[#1A1A2E] hover:bg-[#E9E7F2]',
                )}
              >
                <span
                  className={cn(
                    'text-[1.625rem] font-bold tabular-nums leading-none tracking-tight',
                    active ? 'text-white' : 'text-[#1F1B4D]',
                  )}
                >
                  {stage.count}
                </span>
                <span
                  className={cn(
                    'mt-2 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.08em]',
                    active ? 'text-white' : 'text-[#1F1B4D]',
                  )}
                >
                  {stage.label}
                </span>
                <span
                  className={cn(
                    'mt-1.5 whitespace-nowrap text-[11px] font-medium leading-none',
                    stage.weeklyChange === null
                      ? active
                        ? 'text-white/70'
                        : 'text-[#9CA3AF]'
                      : active
                        ? 'text-[#5EE0A1]'
                        : 'text-[#22A35A]',
                  )}
                >
                  {stage.weeklyChange === null
                    ? 'No change'
                    : `+${stage.weeklyChange} this week`}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function ScrollButton({
  side,
  onClick,
}: {
  side: 'left' | 'right'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'left' ? 'Scroll stages left' : 'Scroll stages right'}
      className={cn(
        'absolute top-1/2 z-10 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#E4E1EE] bg-white text-[#2D2061] shadow-[0_2px_8px_rgba(45,32,97,0.18)] transition-colors hover:bg-[#F5F4FA]',
        side === 'left' ? '-left-3' : '-right-3',
      )}
    >
      {side === 'left' ? (
        <ChevronLeft className="size-4" strokeWidth={2.25} aria-hidden="true" />
      ) : (
        <ChevronRight className="size-4" strokeWidth={2.25} aria-hidden="true" />
      )}
    </button>
  )
}
