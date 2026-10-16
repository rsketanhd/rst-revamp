import { useState, type ChangeEvent, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { ChevronsUpDown } from 'lucide-react'
import {
  Checkbox,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableSortHeader,
  DataTableTd,
  DataTableTh,
  Select,
  Switch,
} from '../ui'
import { cn } from '../../lib/cn'
import { SettingsBlock, SettingsPanel } from './SettingsPanel'

const ROUND_COL_CLASS =
  'w-[8.5rem] min-w-[8.5rem] max-w-[8.5rem] !text-center'

type RoundId = 'technical' | 'hr' | 'first' | 'second'

type FeatureRow = {
  id: string
  label: string
  master?: boolean
  later?: boolean
}

type FlagMap = Record<string, Record<RoundId, boolean>>

type FeatureMatrixProps = {
  rows: FeatureRow[]
  flags: FlagMap
  onChange: (next: FlagMap) => void
}

const ROUNDS: ReadonlyArray<{ id: RoundId; label: string }> = [
  { id: 'technical', label: 'Technical' },
  { id: 'hr', label: 'HR' },
  { id: 'first', label: '1st Interview' },
  { id: 'second', label: '2nd Interview' },
]

const PLAN_ROWS: FeatureRow[] = [
  { id: 'interview-plan', label: 'Interview plan', master: true },
  { id: 'cv-summary', label: 'CV summary' },
  { id: 'cv-score', label: 'CV score' },
  { id: 'cv-score-rag', label: 'CV score summary (RAG)' },
  { id: 'strengths-weaknesses', label: 'Strengths & weaknesses' },
  { id: 'cv-skill-matching', label: 'CV skill matching' },
  { id: 'job-description', label: 'Job description' },
  { id: 'job-requirements', label: 'Job requirements' },
  { id: 'qualification', label: 'Qualification' },
  { id: 'technical-questions', label: 'Technical questions' },
  { id: 'behavioural-questions', label: 'Behavioural questions' },
  { id: 'ice-breakers', label: 'Ice breakers' },
  { id: 'vista-questions', label: 'VISTA questions' },
]

const SUMMARY_ROWS: FeatureRow[] = [
  { id: 'interview-summary', label: 'Interview summary', master: true },
  { id: 'bookmarks', label: 'Bookmarks' },
  { id: 'remarks-notes', label: 'Remarks & notes' },
  { id: 'transcript', label: 'Transcript' },
  { id: 'speaker-tracker', label: 'Speaker tracker' },
  { id: 'key-moments', label: 'Key moments' },
  { id: 'ai-behavioural', label: 'AI behavioural analysis', later: true },
  { id: 'ai-rating', label: 'AI rating', later: true },
  { id: 'ai-skill-matching', label: 'AI skill matching', later: true },
  { id: 'ai-fit-score', label: 'AI fit score' },
  { id: 'ratings-feedback', label: 'Ratings & feedback' },
]

const IDLE_TIME_OPTIONS = [
  { value: '5', label: '5 minutes' },
  { value: '10', label: '10 minutes' },
  { value: '15', label: '15 minutes' },
  { value: '20', label: '20 minutes' },
  { value: '30', label: '30 minutes' },
]

function emptyFlags(rows: FeatureRow[]): FlagMap {
  const map: FlagMap = {}
  for (const row of rows) {
    map[row.id] = {
      technical: false,
      hr: false,
      first: false,
      second: false,
    }
  }
  return map
}

function cloneFlags(flags: FlagMap, rows: FeatureRow[]): FlagMap {
  const next: FlagMap = { ...flags }
  for (const row of rows) {
    next[row.id] = { ...flags[row.id] }
  }
  return next
}

function patchChecked<T extends Record<string, boolean>>(
  setter: Dispatch<SetStateAction<T>>,
  key: keyof T,
) {
  return (event: ChangeEvent<HTMLInputElement>) => {
    setter((current) => ({ ...current, [key]: event.target.checked }))
  }
}

/**
 * Settings → Module Configuration → 2 Way Interview → Interview Plan & Summary.
 */
export function TwoWayPlanSummaryPanel() {
  const [planFlags, setPlanFlags] = useState(() => emptyFlags(PLAN_ROWS))
  const [summaryFlags, setSummaryFlags] = useState(() => emptyFlags(SUMMARY_ROWS))
  const [dashboard, setDashboard] = useState({
    analytics: false,
    interviewsOverview: false,
    calendarHeatMap: false,
  })
  const [languages, setLanguages] = useState({
    english: true,
    arabic: false,
    french: false,
  })
  const [idleMinutes, setIdleMinutes] = useState('15')

  return (
    <SettingsPanel
      eyebrow="2 WAY INTERVIEW"
      title="Interview Plan & Summary"
      description="Choose what the AI shows before and after each round, and how the Two-Way portal behaves."
    >
      <div
        role="status"
        className="rounded-lg border border-[#F5D78E] bg-[#FFF8E8] px-3.5 py-3 text-sm leading-relaxed text-[#5C4B1F] sm:px-4"
      >
        Locked: needs Microsoft Teams as the platform and at least one active
        round with the AI co-pilot on (Settings → Interviews → Rounds).
      </div>

      <SettingsBlock
        title="Interview plan (before the interview)"
        description="Built from the candidate's CV and the job description by the AI; shown to the panel in the portal and the Teams side panel."
      >
        <FeatureMatrix
          rows={PLAN_ROWS}
          flags={planFlags}
          onChange={setPlanFlags}
        />
      </SettingsBlock>

      <SettingsBlock
        title="Interview summary (after the interview)"
        description="What the portal shows once the meeting ends."
      >
        <FeatureMatrix
          rows={SUMMARY_ROWS}
          flags={summaryFlags}
          onChange={setSummaryFlags}
        />
      </SettingsBlock>

      <SettingsBlock
        title="Two-Way portal"
        description="What the Two Way Video Interview portal shows your team, and how long the AI co-pilot waits in a silent meeting."
      >
        <div className="flex flex-col gap-5">
          <PortalFieldset legend="Dashboard sections">
            <Checkbox
              id="portal-analytics"
              label="Analytics"
              checked={dashboard.analytics}
              onChange={patchChecked(setDashboard, 'analytics')}
            />
            <Checkbox
              id="portal-interviews-overview"
              label="Interviews overview"
              checked={dashboard.interviewsOverview}
              onChange={patchChecked(setDashboard, 'interviewsOverview')}
            />
            <Checkbox
              id="portal-calendar-heat-map"
              label="Calendar heat map"
              checked={dashboard.calendarHeatMap}
              onChange={patchChecked(setDashboard, 'calendarHeatMap')}
            />
          </PortalFieldset>

          <PortalFieldset legend="Languages">
            <Checkbox
              id="portal-lang-english"
              label="English (always)"
              checked={languages.english}
              disabled
            />
            <Checkbox
              id="portal-lang-arabic"
              label="Arabic"
              checked={languages.arabic}
              onChange={patchChecked(setLanguages, 'arabic')}
            />
            <Checkbox
              id="portal-lang-french"
              label="French"
              checked={languages.french}
              onChange={patchChecked(setLanguages, 'french')}
            />
          </PortalFieldset>

          <div className="max-w-xs">
            <Select
              id="jeeves-idle-time"
              label="Jeeves AI idle time"
              value={idleMinutes}
              onChange={(event) => setIdleMinutes(event.target.value)}
              options={IDLE_TIME_OPTIONS}
              placeholder=""
            />
            <p className="mt-1.5 text-xs leading-relaxed text-[#8B8B9E]">
              The co-pilot ends a meeting in which nobody has spoken for this
              long.
            </p>
          </div>
        </div>
      </SettingsBlock>
    </SettingsPanel>
  )
}

function PortalFieldset({
  legend,
  children,
}: {
  legend: string
  children: ReactNode
}) {
  return (
    <fieldset>
      <legend className="text-[13px] font-semibold text-[#2A2740]">
        {legend}
      </legend>
      <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-6">
        {children}
      </div>
    </fieldset>
  )
}

function FeatureMatrix({ rows, flags, onChange }: FeatureMatrixProps) {
  const childIds = rows.filter((row) => !row.master).map((row) => row.id)
  const masterId = rows.find((row) => row.master)?.id

  function setFlag(featureId: string, roundId: RoundId, checked: boolean) {
    const next = cloneFlags(flags, rows)

    if (masterId && featureId === masterId) {
      next[masterId][roundId] = checked
      for (const childId of childIds) {
        next[childId][roundId] = checked
      }
    } else {
      next[featureId][roundId] = checked
      if (masterId) {
        next[masterId][roundId] = childIds.every(
          (childId) => next[childId][roundId],
        )
      }
    }

    onChange(next)
  }

  const bodyRows = rows.filter((row) => !row.master)

  return (
    <DataTable minWidthClassName="min-w-[40rem]">
      <DataTableHead>
        <DataTableSortHeader
          label="Section"
          className="min-w-[12rem] align-top"
        />
        {ROUNDS.map((round) => (
          <DataTableTh
            key={round.id}
            className={cn(ROUND_COL_CLASS, '!pb-3 align-top')}
          >
            <div className="flex flex-col items-center gap-2.5">
              <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#6B6B80]">
                {round.label}
                <ChevronsUpDown
                  className="size-3.5 shrink-0 text-[#B0ACC4]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </span>
              {masterId ? (
                <Switch
                  checked={flags[masterId][round.id]}
                  onCheckedChange={(checked) =>
                    setFlag(masterId, round.id, checked)
                  }
                  aria-label={`Toggle all — ${round.label}`}
                  className="!gap-0"
                />
              ) : null}
            </div>
          </DataTableTh>
        ))}
      </DataTableHead>
      <DataTableBody>
        {bodyRows.map((row) => (
          <DataTableRow
            key={row.id}
            className="border-b border-[#F0EEF5] last:border-0"
          >
            <DataTableTd className="min-w-[12rem] font-normal text-[#3D3A52]">
              <span className="inline-flex flex-wrap items-center gap-2">
                {row.label}
                {row.later ? (
                  <span className="inline-flex h-5 items-center rounded-md bg-[#EEEDF5] px-1.5 text-[10px] font-semibold tracking-wide text-[#6B6B80] uppercase">
                    Later
                  </span>
                ) : null}
              </span>
            </DataTableTd>
            {ROUNDS.map((round) => (
              <DataTableTd key={round.id} className={ROUND_COL_CLASS}>
                <div className="flex w-full items-center justify-center">
                  <Switch
                    checked={flags[row.id][round.id]}
                    onCheckedChange={(checked) =>
                      setFlag(row.id, round.id, checked)
                    }
                    aria-label={`${row.label} — ${round.label}`}
                    className="!gap-0"
                  />
                </div>
              </DataTableTd>
            ))}
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  )
}
