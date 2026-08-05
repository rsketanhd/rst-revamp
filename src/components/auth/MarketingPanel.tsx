import { useEffect, useState } from 'react'
import sliderImg01 from '../../assets/slider-img-01.png'
import sliderImg02 from '../../assets/slider-img-02.png'
import sliderImg03 from '../../assets/slider-img-03.png'
import { cn } from '../../lib/cn'

export type MarketingSlide = {
  id: string
  headline: string
  headlineAccent: string
  image: string
  imageAlt: string
}

const DEFAULT_SLIDES: MarketingSlide[] = [
  {
    id: 'sourcing',
    headline: 'Unleashing the Power of',
    headlineAccent: 'Data-Driven Recruitment',
    image: sliderImg01,
    imageAlt: 'Sourcing candidates from multiple job boards into Recruitment SMART',
  },
  {
    id: 'matching',
    headline: 'Next-Gen Automated Candidate',
    headlineAccent: 'Screening & Skill Scoring',
    image: sliderImg02,
    imageAlt: 'Auto-scoring and routing candidate match card',
  },
  {
    id: 'analytics',
    headline: 'Seamless Collaborative',
    headlineAccent: 'Hiring & Workforce Analytics',
    image: sliderImg03,
    imageAlt: 'Live recruitment velocity analytics dashboard',
  },
]

export type MarketingPanelProps = {
  slides?: MarketingSlide[]
  autoPlayMs?: number
  className?: string
}

export function MarketingPanel({
  slides = DEFAULT_SLIDES,
  autoPlayMs = 5000,
  className,
}: MarketingPanelProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const slideCount = slides.length

  useEffect(() => {
    if (slideCount <= 1 || isPaused || autoPlayMs <= 0) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slideCount)
    }, autoPlayMs)

    return () => window.clearInterval(timer)
  }, [autoPlayMs, isPaused, slideCount])

  if (slideCount === 0) {
    return null
  }

  return (
    <div
      className={cn(
        'relative flex h-full min-h-screen flex-col overflow-hidden bg-brand-900 px-10 py-12 text-white',
        className,
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false)
        }
      }}
    >
      <BackgroundOrbits />

      <div
        className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center"
        aria-roledescription="carousel"
        aria-label="Product highlights"
      >
        <div className="flex w-full flex-col items-center gap-5">
          {/* Headline carousel */}
          <div
            className="relative w-full min-h-[4.5rem] text-center"
            aria-live="polite"
          >
            {slides.map((slide, index) => {
              const isActive = index === activeIndex
              return (
                <h2
                  key={slide.id}
                  id={`marketing-slide-label-${slide.id}`}
                  className={cn(
                    'w-full text-center text-[2rem] font-bold leading-tight tracking-tight transition-all duration-500',
                    isActive
                      ? 'relative translate-y-0 opacity-100'
                      : 'pointer-events-none absolute inset-x-0 top-0 -translate-y-2 opacity-0',
                  )}
                  aria-hidden={!isActive}
                >
                  {slide.headline}{' '}
                  <span className="block w-full text-white/95">
                    {slide.headlineAccent}
                  </span>
                </h2>
              )
            })}
          </div>

          {/* Image carousel */}
          <div className="relative w-full max-w-[32rem]">
            <div className="relative aspect-[4/3] w-full">
              {slides.map((slide, index) => {
                const isActive = index === activeIndex
                return (
                  <div
                    key={slide.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-labelledby={`marketing-slide-label-${slide.id}`}
                    aria-hidden={!isActive}
                    className={cn(
                      'absolute inset-0 flex items-center justify-center transition-all duration-500 ease-out',
                      isActive
                        ? 'translate-x-0 opacity-100'
                        : 'pointer-events-none translate-x-6 opacity-0',
                    )}
                  >
                    <img
                      src={slide.image}
                      alt={slide.imageAlt}
                      className="h-full w-full object-contain drop-shadow-2xl"
                      draggable={false}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Dot controls */}
          <div
            className="relative z-10 flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Carousel controls"
          >
            {slides.map((slide, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show slide ${index + 1}: ${slide.headlineAccent}`}
                  aria-controls={`marketing-slide-label-${slide.id}`}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'size-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900',
                    isActive
                      ? 'w-5 bg-accent-400'
                      : 'bg-white/35 hover:bg-white/55',
                  )}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function BackgroundOrbits() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute -left-24 top-1/4 size-[28rem] rounded-full border border-white/10" />
      <div className="absolute -left-8 top-[18%] size-[34rem] rounded-full border border-white/10" />
      <div className="absolute left-10 top-[12%] size-[40rem] rounded-full border border-fuchsia-300/15" />
      <div className="absolute -right-32 bottom-0 size-[26rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
      <div className="absolute left-1/3 top-0 size-72 rounded-full bg-indigo-400/10 blur-3xl" />
    </div>
  )
}
