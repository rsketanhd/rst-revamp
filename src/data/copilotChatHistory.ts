import type { UserRole } from '../lib/auth'
import { COPILOT_MATCHES, COPILOT_PROFILE } from './copilotInterview'
import type { CopilotBotContent } from './copilotScenarios'
import { scenarioPickerContent } from './copilotScenarios'

export type CopilotChatThread = {
  id: string
  title: string
  preview: string
  updatedAt: string
  pinned?: boolean
}

export type CopilotHistoryMessage =
  | { id: string; role: 'me'; text: string }
  | { id: string; role: 'bot'; content: CopilotBotContent }

export function newCopilotChatThread(
  id: string,
  title: string,
  preview = 'Start a new conversation with Copilot',
): CopilotChatThread {
  return { id, title, preview, updatedAt: 'Just now', pinned: false }
}

/** Seed history shown in the maximized Copilot sidebar (candidate). */
export const COPILOT_CHAT_THREADS: CopilotChatThread[] = [
  {
    id: 'current',
    title: 'What can I help with?',
    preview: 'Profile, resume, jobs, and application status',
    updatedAt: 'Just now',
    pinned: true,
  },
  {
    id: 'matches',
    title: 'Job recommendations',
    preview: '3 new matches above 80%',
    updatedAt: 'Yesterday',
  },
  {
    id: 'interview',
    title: 'Interview prep — Tamkeen',
    preview: 'Mock interview and tips for Thursday',
    updatedAt: '2 days ago',
    pinned: true,
  },
  {
    id: 'resume',
    title: 'Resume update Sep 2026',
    preview: 'Parsed CV and confirmed Noor Telecom dates',
    updatedAt: 'Last week',
  },
  {
    id: 'salary',
    title: 'Salary insights — Riyadh',
    preview: 'Senior UI/UX band SAR 18k–28k',
    updatedAt: 'Last week',
  },
]

/** Seed history for recruiter Copilot (from Claude end-to-end flow HTML). */
export const RECRUITER_CHAT_THREADS: CopilotChatThread[] = [
  {
    id: 'java-hire',
    title: 'Hire a Java Developer — Pune',
    preview: 'JR-1061 · Create job → Close job',
    updatedAt: 'Just now',
    pinned: true,
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst pipeline review',
    preview: 'JR-1044 · 31 in pipeline · 8 in Screening',
    updatedAt: 'Yesterday',
  },
  {
    id: 'riyadh-designers',
    title: 'Riyadh designers campaign',
    preview: '126 reached · 38 replied · 12 added',
    updatedAt: '2 days ago',
    pinned: true,
  },
  {
    id: 'q3-summary',
    title: 'Q3 hiring summary',
    preview: '41 hires · median 26 days to hire',
    updatedAt: 'Last week',
  },
]

export function getCopilotChatThreads(role: UserRole): CopilotChatThread[] {
  return role === 'recruiter' ? RECRUITER_CHAT_THREADS : COPILOT_CHAT_THREADS
}

/** Prior transcripts restored when a history item is opened. */
export const COPILOT_THREAD_MESSAGES: Record<string, CopilotHistoryMessage[]> = {
  current: [
    {
      id: 'current-1',
      role: 'bot',
      content: scenarioPickerContent('candidate'),
    },
  ],
  matches: [
    {
      id: 'matches-1',
      role: 'me',
      text: 'Show my job recommendations',
    },
    {
      id: 'matches-2',
      role: 'bot',
      content: {
        title: '3 new matches',
        text: 'Posted since yesterday and above your 80% threshold.',
        matches: COPILOT_MATCHES.map((match) => ({
          title: match.title,
          company: match.company,
          score: match.score,
          why:
            match.score >= 90
              ? '5 of 6 skills · Riyadh · in salary band'
              : match.score >= 84
                ? '3 of 4 skills · hybrid, as you prefer'
                : '3 of 4 skills · senior level',
        })),
        chips: [
          { id: 'job-why', label: 'Why the top one?' },
          { id: 'job-no', label: "One isn't for me" },
          { id: 'job-more', label: 'Show more' },
        ],
      },
    },
    {
      id: 'matches-3',
      role: 'me',
      text: 'Why the top one?',
    },
    {
      id: 'matches-4',
      role: 'bot',
      content: {
        title: 'Why 92% — Sr. Product Designer',
        why: [
          {
            ok: true,
            text: 'Figma, Design Systems, User Research, Prototyping, Arabic UI/RTL',
          },
          { ok: false, text: 'Motion Design — not on your profile' },
          { ok: true, text: 'Riyadh, on site — matches your preference' },
          { ok: true, text: 'SAR 22–28k — inside your band' },
        ],
        text: 'Adding Motion Design would take this to about 97%, if you have it.',
        chips: [
          {
            id: 'toast',
            label: 'I have Motion Design',
            variant: 'primary',
            toast: 'Motion Design added',
          },
          { id: 'jobs-start', label: 'Back to matches' },
        ],
      },
    },
  ],
  interview: [
    {
      id: 'interview-1',
      role: 'me',
      text: "What's next for Data Scientist?",
    },
    {
      id: 'interview-2',
      role: 'bot',
      content: {
        title: 'Data Scientist — Tamkeen Health',
        timeline: [
          { label: 'Applied', detail: '28 Aug', state: 'done' },
          { label: 'Screening call', detail: '4 Sep · passed', state: 'done' },
          {
            label: 'Technical interview',
            detail:
              'Thu 18 Sep, 2:00 PM · video, 45 min · with Lina Al-Harbi, Head of Data',
            state: 'now',
          },
          {
            label: 'Panel interview',
            detail: 'If successful, within a week',
            state: 'upcoming',
          },
        ],
        chips: [
          {
            id: 'st-prep',
            label: 'Prep for the interview',
            variant: 'primary',
          },
          {
            id: 'toast',
            label: 'Add to calendar',
            toast: 'Added to calendar',
          },
        ],
      },
    },
    {
      id: 'interview-3',
      role: 'me',
      text: 'Prep for the interview',
    },
    {
      id: 'interview-4',
      role: 'bot',
      content: {
        title: 'Interview prep',
        text: 'Lina usually asks about model evaluation, a project you led end-to-end, and how you handle messy data. I can run a 10-minute mock with those, then give feedback.',
        chips: [
          {
            id: 'toast',
            label: 'Start mock interview',
            variant: 'primary',
            toast: 'Mock interview started',
          },
          { id: 'toast', label: 'Just send me tips', toast: 'Tips sent' },
        ],
      },
    },
  ],
  resume: [
    {
      id: 'resume-1',
      role: 'me',
      text: 'Upload new resume',
    },
    {
      id: 'resume-2',
      role: 'bot',
      content: {
        title: "Here's what I read",
        parse: [
          {
            title: 'Senior Product Designer',
            detail: 'Current title · was "Senior UI Designer"',
            confidence: 'high',
          },
          {
            title: 'Riyadh Digital Bank · 2024–present',
            detail: 'New role added',
            confidence: 'high',
          },
          {
            title: 'Noor Telecom · 2019–2021?',
            detail: 'Dates were unclear in the PDF',
            confidence: 'low',
          },
        ],
        text: "Two things I'm not sure about. Let's confirm them, then I'll update your profile.",
        chips: [
          {
            id: 'res-check1',
            label: 'Confirm the dates',
            variant: 'primary',
          },
          {
            id: 'res-apply-partial',
            label: 'Skip checks, apply the rest',
            variant: 'skip',
          },
        ],
      },
    },
    {
      id: 'resume-3',
      role: 'me',
      text: 'Confirm the dates',
    },
    {
      id: 'resume-4',
      role: 'bot',
      content: {
        title: 'Noor Telecom',
        text: 'When were you at Noor Telecom?',
        form: [
          { id: 'r-from', label: 'From', value: '2019', half: true },
          { id: 'r-to', label: 'To', value: '2021', half: true },
        ],
        chips: [
          { id: 'res-check2', label: "That's right", variant: 'primary' },
        ],
      },
    },
  ],
  salary: [
    {
      id: 'salary-1',
      role: 'me',
      text: 'What salary should I expect in Riyadh?',
    },
    {
      id: 'salary-2',
      role: 'bot',
      content: {
        title: 'Salary insights',
        text: `Senior UI/UX roles in Riyadh listed recently: SAR 18k–28k/month, median 22k. Your target sits in the upper half for a ${COPILOT_PROFILE.title} with ${COPILOT_PROFILE.years}.`,
        chips: [
          { id: 'start-jobs', label: 'Job recommendations', variant: 'primary' },
          { id: 'start-profile', label: 'Update my preferences' },
        ],
      },
    },
  ],
}

const RECRUITER_THREAD_MESSAGES: Record<string, CopilotHistoryMessage[]> = {
  'java-hire': [
    {
      id: 'java-hire-1',
      role: 'bot',
      content: scenarioPickerContent('recruiter'),
    },
  ],
  'data-analyst': [
    {
      id: 'data-analyst-1',
      role: 'me',
      text: 'Review the Data Analyst pipeline for Bengaluru',
    },
    {
      id: 'data-analyst-2',
      role: 'bot',
      content: {
        title: 'Data Analyst pipeline review',
        text: 'JR-1044 · Data Analyst – Bengaluru. 31 in pipeline · 8 in Screening · 3 waiting on panel feedback.',
        apps: [
          {
            title: 'Meera Kapoor',
            company: 'Data Analyst · Bengaluru',
            status: 'Panel',
            statusTone: 'interview',
            next: 'Feedback due today · 91% match',
          },
          {
            title: 'Vikram Shah',
            company: 'BI Analyst · Pune',
            status: 'Screen',
            statusTone: 'review',
            next: 'Jeeves complete · ready for VScreen',
          },
          {
            title: 'Ananya Iyer',
            company: 'Data Analyst · Hyderabad',
            status: 'New',
            statusTone: 'submitted',
            next: 'Applied yesterday · 86% match',
          },
        ],
        chips: [
          {
            id: 'toast',
            label: 'Open pipeline',
            variant: 'primary',
            toast: 'Opening Data Analyst pipeline',
          },
          { id: 'rc-shortlist', label: 'Suggest a shortlist' },
          { id: 'start-recReports', label: 'Compare to Q3 funnel' },
        ],
      },
    },
  ],
  'riyadh-designers': [
    {
      id: 'riyadh-1',
      role: 'me',
      text: 'How is the Riyadh designers campaign doing?',
    },
    {
      id: 'riyadh-2',
      role: 'bot',
      content: {
        title: 'Riyadh designers campaign',
        text: 'Active sourcing campaign for Sr. Product Designer roles in Riyadh. 126 reached · 38 replied · 12 added to jobs.',
        timeline: [
          {
            label: 'Campaign live',
            detail: 'LinkedIn + RS Plus · started 12 Sep',
            state: 'done',
          },
          {
            label: 'Best reply window',
            detail: 'Sun–Tue evenings · Arabic + English copy',
            state: 'now',
          },
          {
            label: 'Next nurture',
            detail: 'Follow-up to 26 warm leads tomorrow 10:00',
            state: 'upcoming',
          },
        ],
        chips: [
          {
            id: 'toast',
            label: 'Open campaign',
            variant: 'primary',
            toast: 'Opening Riyadh designers campaign',
          },
          { id: 'rc-discovery', label: 'Find more designers' },
          { id: 'ri-gaps', label: 'Book intro calls' },
        ],
      },
    },
  ],
  'q3-summary': [
    {
      id: 'q3-1',
      role: 'me',
      text: 'Give me the Q3 hiring summary',
    },
    {
      id: 'q3-2',
      role: 'bot',
      content: {
        title: 'Q3 hiring summary',
        text: 'Q3 closed with 41 hires. Time-to-hire 26 days median. Offer acceptance 74%. Strongest funnel: Engineering in Pune.',
        why: [
          { ok: true, text: '41 hires vs target 38' },
          { ok: true, text: 'Agency spend down 22% (RS Plus + database)' },
          { ok: false, text: 'Design roles averaged 34 days to hire' },
          { ok: false, text: '3 roles still open past SLA' },
        ],
        chips: [
          { id: 'rr-funnel', label: 'Show hiring funnel', variant: 'primary' },
          { id: 'rr-tth', label: 'Time-to-hire breakdown' },
          {
            id: 'toast',
            label: 'Export Q3 summary',
            toast: 'Q3 summary exported',
          },
        ],
      },
    },
  ],
}

export function getThreadMessages(
  threadId: string,
  role: UserRole = 'candidate',
): CopilotHistoryMessage[] {
  const catalog =
    role === 'recruiter' ? RECRUITER_THREAD_MESSAGES : COPILOT_THREAD_MESSAGES
  return (
    catalog[threadId] ?? [
      {
        id: `${threadId}-welcome`,
        role: 'bot',
        content: scenarioPickerContent(role),
      },
    ]
  )
}

export function sortCopilotThreads(
  threads: CopilotChatThread[],
): CopilotChatThread[] {
  return [...threads].sort((a, b) => {
    if (Boolean(a.pinned) !== Boolean(b.pinned)) {
      return a.pinned ? -1 : 1
    }
    return 0
  })
}

export function filterCopilotThreads(
  threads: CopilotChatThread[],
  query: string,
): CopilotChatThread[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return sortCopilotThreads(threads)
  return sortCopilotThreads(
    threads.filter(
      (thread) =>
        thread.title.toLowerCase().includes(normalized) ||
        thread.preview.toLowerCase().includes(normalized),
    ),
  )
}
