import { useState } from 'react'
import { JOB_CRITERIA, RADAR_AXES, SCORE_BARS } from '../../data/candidateProfileTabs'
import { ProfileFold } from './ProfileFold'

export function ScoreSummaryPanel() {
  const [jobOpen, setJobOpen] = useState(true)
  const [clientOpen, setClientOpen] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      <section className="@container rounded-xl border border-[#E8E6F0] bg-white p-4">
        <h3 className="text-[15px] font-semibold text-[#1A1A2E]">
          CV Quality Radar & Breakdown
        </h3>
        <div className="mt-3 grid items-center gap-4 @min-[40rem]:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <CvRadar />
          <ul className="flex flex-col gap-3">
            {SCORE_BARS.map((bar) => (
              <li key={bar.label}>
                <div className="mb-1 flex items-center justify-between gap-3 text-[12px]">
                  <span className="text-[#5C5870]">{bar.label}</span>
                  <span className="shrink-0 font-semibold text-[#6D5BD0]">
                    {bar.score}/10
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-[#EDEAF6]">
                  <div
                    className="h-full rounded-full bg-[#6D5BD0]"
                    style={{ width: `${bar.score * 10}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="flex items-center justify-center gap-3 rounded-lg bg-[#F4F0FC] px-4 py-3 text-[14px] font-semibold text-[#6D5BD0]">
        <span>CV Relevancy</span>
        <span>92%</span>
      </div>

      <ProfileFold title="Job Criteria" open={jobOpen} onToggle={() => setJobOpen((open) => !open)}>
        <div className="flex flex-col gap-2.5">
          {JOB_CRITERIA.map((item) => (
            <article
              key={item.title}
              className="rounded-lg border border-[#E8E6F0] bg-white px-3.5 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <h4 className="text-[13px] font-semibold text-[#1A1A2E]">{item.title}</h4>
                <span className="shrink-0 text-[13px] font-semibold text-[#6D5BD0]">
                  {item.percent}%
                </span>
              </div>
              <p className="mt-1 text-[12px] leading-relaxed text-[#8B8B9E]">{item.detail}</p>
            </article>
          ))}
        </div>
      </ProfileFold>

      <ProfileFold
        title="Client Criteria"
        open={clientOpen}
        onToggle={() => setClientOpen((open) => !open)}
      >
        <p className="text-[13px] text-[#8B8B9E]">No client criteria scored yet.</p>
      </ProfileFold>
    </div>
  )
}

function CvRadar() {
  const axes = RADAR_AXES
  const count = axes.length
  const cx = 180
  const cy = 168
  const radius = 78

  function point(index: number, scale: number) {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count
    return {
      x: cx + Math.cos(angle) * radius * scale,
      y: cy + Math.sin(angle) * radius * scale,
    }
  }

  const shape = axes
    .map((axis, index) => {
      const spot = point(index, axis.value / 10)
      return `${spot.x},${spot.y}`
    })
    .join(' ')

  return (
    <svg viewBox="0 0 360 340" className="mx-auto h-auto w-full max-w-[340px]" role="img" aria-label="CV quality radar">
      {[0.25, 0.5, 0.75, 1].map((scale) => (
        <polygon
          key={scale}
          points={axes
            .map((_, index) => {
              const spot = point(index, scale)
              return `${spot.x},${spot.y}`
            })
            .join(' ')}
          fill="none"
          stroke="#E6E2F2"
          strokeWidth="1"
        />
      ))}
      {axes.map((_, index) => {
        const outer = point(index, 1)
        return (
          <line
            key={index}
            x1={cx}
            y1={cy}
            x2={outer.x}
            y2={outer.y}
            stroke="#E6E2F2"
            strokeWidth="1"
          />
        )
      })}
      <polygon points={shape} fill="rgba(109, 91, 208, 0.28)" stroke="#6D5BD0" strokeWidth="1.6" />
      {axes.map((axis, index) => {
        const spot = point(index, axis.value / 10)
        return <circle key={axis.score + axis.lines[0]} cx={spot.x} cy={spot.y} r="3.2" fill="#6D5BD0" />
      })}
      {axes.map((axis, index) => {
        const label = point(index, 1.42)
        return (
          <text key={axis.lines.join('-')} x={label.x} y={label.y} textAnchor="middle" fontSize="10" fill="#5C5870">
            <tspan x={label.x} dy="-6">
              {axis.lines[0]}
            </tspan>
            <tspan x={label.x} dy="12">
              {axis.lines[1]}
            </tspan>
            <tspan x={label.x} dy="13" fill="#6D5BD0" fontWeight="600">
              {axis.score}
            </tspan>
          </text>
        )
      })}
    </svg>
  )
}
