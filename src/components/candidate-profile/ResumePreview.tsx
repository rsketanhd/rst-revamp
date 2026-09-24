import { useState, type ReactNode } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  RESUME_EXPERIENCES,
  RESUME_FILE_NAME,
} from '../../data/candidateProfile'

const PAGE_COUNT = 2

export function ResumePreview() {
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(100)

  function downloadResume() {
    const lines = [
      'Harsh D. Mistry',
      'harshald.mistry@gmail.com · +91 98765 43210',
      'Ahmedabad, Gujarat, India',
      '',
      'Software Developer',
      'Proactive full-stack developer with 6+ years delivering web applications for fintech and e-commerce clients. Comfortable across PHP, JavaScript and MySQL, with strong communication skills that keep stakeholders aligned from requirements to release.',
      '',
      ...RESUME_EXPERIENCES.flatMap((job) => [
        job.title,
        job.dates,
        ...job.bullets.map((bullet) => `- ${bullet}`),
        '',
      ]),
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = RESUME_FILE_NAME.replace(/\.pdf$/, '.txt')
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="flex min-h-[36rem] flex-col overflow-hidden rounded-lg border border-[#E6E3EF] bg-white">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#EFEAF5] px-3 py-2">
        <FileText className="size-4 shrink-0 text-[#E24B4B]" strokeWidth={2} aria-hidden="true" />
        <span className="min-w-0 truncate text-[13px] font-medium text-[#2A2740]">
          {RESUME_FILE_NAME}
        </span>
        <span className="text-[12px] text-[#8B8B9E]">{PAGE_COUNT} pages</span>
        <div className="ml-auto flex flex-wrap items-center gap-1">
          <ToolbarButton
            label="Previous page"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            <ChevronLeft className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
          <span className="px-1 text-[12px] tabular-nums text-[#5C5870]">
            {page} / {PAGE_COUNT}
          </span>
          <ToolbarButton
            label="Next page"
            disabled={page >= PAGE_COUNT}
            onClick={() => setPage((current) => Math.min(PAGE_COUNT, current + 1))}
          >
            <ChevronRight className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
          <span className="mx-1 h-4 w-px bg-[#E6E3EF]" aria-hidden="true" />
          <ToolbarButton
            label="Zoom out"
            disabled={zoom <= 80}
            onClick={() => setZoom((current) => Math.max(80, current - 10))}
          >
            <Minus className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
          <span className="w-10 text-center text-[12px] tabular-nums text-[#5C5870]">
            {zoom}%
          </span>
          <ToolbarButton
            label="Zoom in"
            disabled={zoom >= 140}
            onClick={() => setZoom((current) => Math.min(140, current + 10))}
          >
            <Plus className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton label="Reset zoom" onClick={() => setZoom(100)}>
            <RotateCcw className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton label="Fit width" onClick={() => setZoom(100)}>
            <Maximize2 className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton label="Download resume" onClick={downloadResume}>
            <Download className="size-3.5" strokeWidth={2} />
          </ToolbarButton>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto bg-[#F7F6F4] p-4">
        <article
          className="mx-auto origin-top rounded-sm bg-[#E7F0E4] px-6 py-8 text-[#1E2A22] shadow-[0_1px_3px_rgba(16,24,16,0.08)] sm:px-8"
          style={{
            width: 'min(100%, 34rem)',
            transform: `scale(${zoom / 100})`,
          }}
        >
          {page === 1 ? <ResumePageOne /> : <ResumePageTwo />}
        </article>
      </div>
    </section>
  )
}

function ResumePageOne() {
  return (
    <>
      <header className="border-b border-[#1E2A22]/10 pb-4">
        <h2 className="text-[28px] font-semibold tracking-tight text-[#243028]">
          Harsh D. Mistry
        </h2>
        <p className="mt-2 text-[12px] leading-5 text-[#3D4A40]">
          harshald.mistry@gmail.com · +91 98765 43210
          <br />
          Ahmedabad, Gujarat, India
        </p>
      </header>
      <section className="mt-5">
        <h3 className="text-[18px] font-semibold">Software Developer</h3>
        <p className="mt-2 text-[13px] leading-6 text-[#2C3A31]">
          Proactive full-stack developer with 6+ years delivering web applications
          for fintech and e-commerce clients. Comfortable across PHP, JavaScript
          and MySQL, with strong communication skills that keep stakeholders
          aligned from requirements to release.
        </p>
      </section>
      <section className="mt-6">
        <h3 className="text-[16px] font-semibold text-[#1F6B45]">Career Experience</h3>
        <div className="mt-4 flex flex-col gap-5">
          {RESUME_EXPERIENCES.slice(0, 2).map((job) => (
            <ExperienceBlock key={job.title} title={job.title} dates={job.dates} bullets={job.bullets} />
          ))}
        </div>
      </section>
    </>
  )
}

function ResumePageTwo() {
  const last = RESUME_EXPERIENCES[2]
  return (
    <>
      <h3 className="text-[16px] font-semibold text-[#1F6B45]">Career Experience</h3>
      {last ? (
        <div className="mt-4">
          <ExperienceBlock title={last.title} dates={last.dates} bullets={last.bullets} />
        </div>
      ) : null}
      <section className="mt-6">
        <h3 className="text-[16px] font-semibold text-[#1F6B45]">Education</h3>
        <p className="mt-3 text-[13px] font-semibold">Sinhgad Institute Of Management</p>
        <p className="text-[13px] text-[#2C3A31]">Master of Computer Applications – MCA · 2016 – 2018</p>
        <p className="mt-3 text-[13px] font-semibold">Saurashtra University</p>
        <p className="text-[13px] text-[#2C3A31]">Bachelor of Computer Applications – BCA · 2012 – 2015</p>
      </section>
    </>
  )
}

function ExperienceBlock({
  title,
  dates,
  bullets,
}: {
  title: string
  dates: string
  bullets: string[]
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[13px] font-semibold">{title}</p>
        <p className="text-[12px] text-[#4E5C52]">{dates}</p>
      </div>
      <ul className="mt-2 flex flex-col gap-1.5 pl-4">
        {bullets.map((bullet) => (
          <li key={bullet} className="list-disc text-[12.5px] leading-5 text-[#2C3A31]">
            {bullet}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ToolbarButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex size-7 items-center justify-center rounded-md text-[#5C5870] transition-colors hover:bg-[#F4F2F8] hover:text-[#2D2061]',
        'disabled:pointer-events-none disabled:opacity-40',
      )}
    >
      {children}
    </button>
  )
}
