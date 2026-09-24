import { CornerDownRight, FileText } from 'lucide-react'
import {
  Button,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableTd,
  DataTableTh,
  toast,
} from '../ui'
import { cn } from '../../lib/cn'
import { SettingsPanel } from './SettingsPanel'

type FeatureQuota = {
  id: string
  label: string
  /** Sub-allowance of the row above (rendered indented with ↳) */
  child?: boolean
  quota: number
  unit: string
  consumed: number
  monthlyCap: number
  perUser: number
}

const CONTRACT = {
  start: '2026-10-01',
  end: '2027-09-30',
  years: 1,
  licensesUsed: 1,
  licensesTotal: 150,
}

const FEATURE_QUOTAS: FeatureQuota[] = [
  { id: 'jobs', label: 'Create Jobs', quota: 4000, unit: 'jobs', consumed: 1240, monthlyCap: 333, perUser: 10 },
  { id: 'candidates', label: 'Candidate Database Limit', quota: 100000, unit: 'candidates', consumed: 41200, monthlyCap: 8333, perUser: 250 },
  { id: 'rs-plus', label: 'RS Plus Recommendations', quota: 50000, unit: 'recommendations', consumed: 23100, monthlyCap: 4167, perUser: 125 },
  { id: 'email-unlocks', label: 'Email Unlocks allowed', child: true, quota: 5000, unit: 'unlocks', consumed: 1980, monthlyCap: 417, perUser: 13 },
  { id: 'phone-unlocks', label: 'Phone Unlocks allowed', child: true, quota: 2500, unit: 'unlocks', consumed: 840, monthlyCap: 208, perUser: 6 },
  { id: 'jeeves', label: 'Jeeves AI Interview Limit', quota: 6000, unit: 'interviews', consumed: 2100, monthlyCap: 500, perUser: 15 },
  { id: 'one-way', label: '1-Way Interview Generations', quota: 3000, unit: 'interviews', consumed: 980, monthlyCap: 250, perUser: 8 },
  { id: 'two-way', label: '2-Way Interview Generations', quota: 1500, unit: 'interviews', consumed: 410, monthlyCap: 125, perUser: 4 },
  { id: 'scheduler', label: 'Interview Scheduler Generations', quota: 12000, unit: 'slots', consumed: 4890, monthlyCap: 1000, perUser: 30 },
  { id: 'email', label: 'Email Limit', quota: 250000, unit: 'emails', consumed: 78000, monthlyCap: 20833, perUser: 625 },
  { id: 'sms', label: 'SMS Limit', quota: 10000, unit: 'sms', consumed: 2900, monthlyCap: 833, perUser: 255 },
]

const fmt = (n: number) => n.toLocaleString('en-US')

const TH = 'bg-[#F7F7FA] !pt-2.5 !pb-2.5 !text-[10px] !font-semibold uppercase tracking-[0.06em] text-[#6B6B80]'

/**
 * Platform Administration → License & Limit Management.
 * Contract period, recruiter seats, and per-feature quota consumption.
 */
export function LicenseLimitsPanel() {
  return (
    <SettingsPanel
      title="License & Limit Management"
      description="Manage your user registration credentials and customize active recruiter daily digest parameters."
    >
      {/* Contract period */}
      <section className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-[#E4E1EE] bg-white p-5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7A86A8]">
            Current Contract Enrolment Period
          </p>
          <p className="mt-2 text-xl font-bold text-[#2D2061]">
            {CONTRACT.start} — {CONTRACT.end} ({CONTRACT.years} years)
          </p>
          <p className="mt-1.5 text-xs text-[#8B8B9E]">
            Contract active. Seat and feature quotas are in real-time
            synchronization.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex h-9 items-center gap-2 rounded-md border border-[#E4E1EE] bg-white px-3">
            <span className="text-[9px] font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
              Recruiter Licenses
            </span>
            <span className="text-sm font-bold tabular-nums text-[#2D2061]">
              {CONTRACT.licensesUsed} / {CONTRACT.licensesTotal}
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              toast.success('Opening usage log.', { title: 'Usage Log' })
            }
            className="!h-9 !rounded-md border-[#E4E1EE] bg-white px-3 text-xs font-medium text-[#2D2061] hover:bg-[#f7f6fb]"
          >
            <FileText className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
            View Usage Log
          </Button>
        </div>
      </section>

      {/* Feature quotas */}
      <section className="rounded-xl border border-[#E4E1EE] bg-white p-5">
        <h3 className="mb-4 text-[11px] font-bold uppercase tracking-[0.06em] text-[#2D2061]">
          Feature Quota Allocation &amp; Consumption
        </h3>
        <DataTable minWidthClassName="min-w-[48rem]">
          <DataTableHead className="!border-b-0">
            <DataTableTh className={cn(TH, 'rounded-l-md')}>Feature / Resource</DataTableTh>
            <DataTableTh className={TH}>Overall Quota</DataTableTh>
            <DataTableTh className={TH}>Consumed / Remaining</DataTableTh>
            <DataTableTh className={TH}>Monthly Cap</DataTableTh>
            <DataTableTh className={cn(TH, 'rounded-r-md')}>Per User Allowance</DataTableTh>
          </DataTableHead>
          <DataTableBody>
            {FEATURE_QUOTAS.map((row) => (
              <DataTableRow key={row.id} className="border-b border-[#EEEDF3]">
                <DataTableTd className="!py-3">
                  {row.child ? (
                    <span className="inline-flex items-center gap-2 pl-1.5">
                      <CornerDownRight
                        className="size-3.5 text-[#A0A0B2]"
                        strokeWidth={1.75}
                        aria-hidden="true"
                      />
                      {row.label}
                    </span>
                  ) : (
                    row.label
                  )}
                </DataTableTd>
                <DataTableTd className="!py-3">
                  {fmt(row.quota)} {row.unit}
                </DataTableTd>
                <DataTableTd className="!py-3">
                  <span className="font-semibold text-[#1A1A2E]">
                    {fmt(row.consumed)} consumed
                  </span>
                  <span className="text-[#15A05B]">
                    {' '}
                    · {fmt(row.quota - row.consumed)} left
                  </span>
                </DataTableTd>
                <DataTableTd className="!py-3">{fmt(row.monthlyCap)} / mo</DataTableTd>
                <DataTableTd className="!py-3">{fmt(row.perUser)} / user / mo</DataTableTd>
              </DataTableRow>
            ))}
          </DataTableBody>
        </DataTable>
      </section>
    </SettingsPanel>
  )
}
