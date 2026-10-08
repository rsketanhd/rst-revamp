/**
 * Two-Way scheduled interviews (demo data): every interview booked through
 * interview sets — Two-Way AI and standard panel interviews together.
 */

export type ScheduledInterviewType = 'twoWayAi' | 'standard'
export type ScheduledInterviewStatus = 'completed' | 'scheduled' | 'invited' | 'cancelled'
export type ScheduledInterviewResult = 'selected' | 'awaiting' | 'rejected'

export type ScheduledInterview = {
  id: string
  candidate: string
  email: string
  job: string
  /** 1-based current round */
  round: number
  totalRounds: number
  roundName: string
  type: ScheduledInterviewType
  platform: string
  /** null = not booked yet */
  slot: string | null
  rescheduleRequested?: boolean
  status: ScheduledInterviewStatus
  /** Shown under a cancelled status, e.g. "Technical Issue" */
  statusNote?: string
  /** Who cancelled the interview */
  cancelledBy?: string
  result: ScheduledInterviewResult | null
  /** e.g. "2 of 2 rated" */
  ratedSummary?: string
  /** AI fit score (Two-Way AI only) */
  aiFit?: number
  /** Average panel rating, 0–5 */
  rating?: number
}

const ROWS: ScheduledInterview[] = [
  { id: 'si-1', candidate: 'Alexandra Martinez', email: 'alexandra.martinez@email.com', job: 'Data Analyst', round: 1, totalRounds: 4, roundName: 'Technical Round', type: 'twoWayAi', platform: 'Microsoft Teams', slot: '05 Oct 2026 · 11:00 AM', status: 'completed', result: 'selected', ratedSummary: '2 of 2 rated', aiFit: 84, rating: 3.7 },
  { id: 'si-2', candidate: 'Rohan Mehta', email: 'rohan.mehta@email.com', job: 'Data Analyst', round: 1, totalRounds: 4, roundName: 'Technical Round', type: 'twoWayAi', platform: 'Microsoft Teams', slot: '02 Oct 2026 · 04:00 PM', status: 'completed', result: 'awaiting', ratedSummary: '0 of 2 rated', aiFit: 58, rating: 0 },
  { id: 'si-3', candidate: 'Aisha Khan', email: 'aisha.khan@email.com', job: 'Data Analyst', round: 1, totalRounds: 4, roundName: 'Technical Round', type: 'twoWayAi', platform: 'Microsoft Teams', slot: '01 Oct 2026 · 03:30 PM', status: 'completed', result: 'rejected', ratedSummary: '1 of 2 rated', aiFit: 47, rating: 2.3 },
  { id: 'si-4', candidate: 'James Wong', email: 'james.wong@email.com', job: 'Data Analyst', round: 3, totalRounds: 4, roundName: 'Hiring Manager Round', type: 'twoWayAi', platform: 'Microsoft Teams', slot: '07 Oct 2026 · 12:30 PM', status: 'scheduled', result: null },
  { id: 'si-5', candidate: 'Tom Becker', email: 'tom.becker@email.com', job: 'Data Analyst', round: 1, totalRounds: 4, roundName: 'Technical Round', type: 'twoWayAi', platform: 'Microsoft Teams', slot: '09 Oct 2026 · 10:00 AM', rescheduleRequested: true, status: 'scheduled', result: null },
  { id: 'si-6', candidate: 'Omar Haddad', email: 'omar.haddad@email.com', job: 'Data Analyst', round: 1, totalRounds: 4, roundName: 'Technical Round', type: 'twoWayAi', platform: 'Microsoft Teams', slot: null, status: 'invited', result: null },
  { id: 'si-7', candidate: 'Sara Ali', email: 'sara.ali@email.com', job: 'Data Analyst', round: 1, totalRounds: 4, roundName: 'Technical Round', type: 'twoWayAi', platform: 'Microsoft Teams', slot: '03 Oct 2026 · 11:00 AM', status: 'cancelled', statusNote: 'Technical Issue', cancelledBy: 'Heli Shah', result: null },
  { id: 'si-8', candidate: 'Priya Sharma', email: 'priya.sharma@email.com', job: 'Data Analyst', round: 2, totalRounds: 4, roundName: 'Case Study', type: 'standard', platform: 'Zoom', slot: '09 Oct 2026 · 02:30 PM', status: 'scheduled', result: null },
  { id: 'si-9', candidate: 'Lena Fischer', email: 'lena.fischer@email.com', job: 'Customer Service Associate', round: 1, totalRounds: 2, roundName: 'Screening Call', type: 'standard', platform: 'Microsoft Teams', slot: '03 Oct 2026 · 10:00 AM', status: 'completed', result: 'selected', ratedSummary: '1 of 1 rated' },
  { id: 'si-10', candidate: 'Marco Rossi', email: 'marco.rossi@email.com', job: 'Customer Service Associate', round: 2, totalRounds: 2, roundName: 'Hiring Manager Round', type: 'standard', platform: 'Microsoft Teams', slot: '10 Oct 2026 · 09:30 AM', status: 'scheduled', result: null },
  { id: 'si-11', candidate: 'Fatima Noor', email: 'fatima.noor@email.com', job: 'Customer Service Associate', round: 1, totalRounds: 2, roundName: 'Screening Call', type: 'standard', platform: 'Google Meet', slot: '04 Oct 2026 · 01:00 PM', status: 'completed', result: 'awaiting', ratedSummary: '0 of 1 rated' },
  { id: 'si-12', candidate: 'Daniel Costa', email: 'daniel.costa@email.com', job: 'Data Analyst', round: 1, totalRounds: 4, roundName: 'Technical Round', type: 'twoWayAi', platform: 'Microsoft Teams', slot: null, status: 'invited', result: null },
]

/** Who joins each interview with the candidate (shown as initials) */
export const INTERVIEW_PANEL = ['Hiring Manager', 'Recruiter']

export function getScheduledInterviews(): ScheduledInterview[] {
  return ROWS.map((row) => ({ ...row }))
}
