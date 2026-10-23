import type { CopilotBotContent, CopilotChip } from './copilotScenarios'

function chip(
  id: string,
  label: string,
  extras: Omit<CopilotChip, 'id' | 'label'> = {},
): CopilotChip {
  return { id, label, ...extras }
}

const PAUSED_CHIP = chip('toast', 'Not now', {
  variant: 'skip',
  toast: 'Paused — nothing changed',
})

/** End-to-end hire steps from Claude-Response-EndtoEnd-Flow.html */
export const RECRUITER_HIRE_STEPS = [
  'Create job',
  'Source & add',
  'Review & shortlist',
  'Jeeves',
  'One-Way',
  'Panel interview',
  'Offer',
  'Documents',
  'Close job',
] as const

export type RecruiterHireStep = (typeof RECRUITER_HIRE_STEPS)[number]

const STEP_DESC = [
  'Starting with the job itself — drafting it from your brief so it can be published.',
  'Job published. Sourcing candidates from your database and external profiles.',
  'Reviewing everyone in the pipeline and picking a shortlist.',
  'Screening the shortlist with Jeeves before any calls are booked.',
  'Taking the screened candidates into the one-way video interview.',
  'Moving the strongest performers to a panel interview.',
  'Panel done — preparing the offer for the selected candidate.',
  'Offer accepted — collecting pre-joining documents.',
  'Documents verified — closing the job and informing everyone else.',
] as const

function hireStepShell(stepIndex: number, body: string): Pick<CopilotBotContent, 'title' | 'text'> {
  return {
    title: `Step ${stepIndex + 1} · ${RECRUITER_HIRE_STEPS[stepIndex]}`,
    text: `${STEP_DESC[stepIndex]}\n\n${body}`,
  }
}

const HIRE_FLOW_IDS = new Set([
  'hire-start',
  'hire-confirm-0-next',
  'hire-fetch-ai',
  'hire-fetch-upload',
  'hire-fetch-db',
  'hire-continue-pipeline',
  'hire-shortlist',
  'hire-screen-jeeves',
  'hire-screen-oneway',
  'hire-screen-twoway',
])

const PIPELINE_STAGES = [
  'Applied · New',
  'Applied · Under review',
  'Screening',
  'VScreen',
  'Interview',
  'Offer',
  'Rejected',
] as const

const AI_SEARCH_CANDIDATES = [
  {
    id: 'sm',
    name: 'Sofia Malik',
    initials: 'SM',
    title: 'Senior Java Developer · Manila',
    score: 95,
    why: [
      'Java 17, Spring Boot, microservices on AWS',
      '6 yrs fintech · open to relocate',
    ],
    source: 'LinkedIn · via RS Plus',
    contact: 'sofia.malik@mail.com · +63 917 220 4411',
    gap: '—',
  },
  {
    id: 'rm',
    name: 'Rahul Mehta',
    initials: 'RM',
    title: 'Backend Lead · Pune',
    score: 93,
    why: ['Spring Boot lead, Kafka', 'Pune-based · 7 yrs'],
    source: 'Naukri · via RS Plus',
    contact: 'rahul.mehta@mail.com · +91 98200 11822',
    gap: 'No PostgreSQL',
  },
  {
    id: 'ar',
    name: 'Aditya Rao',
    initials: 'AR',
    title: 'Software Engineer · Hyderabad',
    score: 91,
    why: [
      'Microservices migration lead',
      '7 yrs · willing to relocate to Pune',
    ],
    source: 'GitHub + LinkedIn · via RS Plus',
    contact: 'aditya.rao@mail.com · +91 98860 33441',
    gap: 'Java 8 only',
  },
  {
    id: 'cw',
    name: 'Chen Wei',
    initials: 'CW',
    title: 'Backend Engineer · Shanghai',
    score: 88,
    why: ['Strong backend, AWS certified', 'Relocation needed'],
    source: 'LinkedIn · via RS Plus',
    contact: 'chen.wei@mail.com · +86 138 0013 9921',
    gap: 'Relocation needed',
  },
  {
    id: 'pn',
    name: 'Priya Nair',
    initials: 'PN',
    title: 'Java Developer · Pune',
    score: 87,
    why: [
      'Spring Boot + PostgreSQL',
      '4.5 yrs · in your database (applied 2024)',
    ],
    source: 'Your database',
    contact: 'priya.nair@gmail.com · +91 98450 22011',
    gap: '4.5 yrs (band is 5+)',
  },
  {
    id: 'do',
    name: 'Daniel Osei',
    initials: 'DO',
    title: 'Java Engineer · Bengaluru',
    score: 85,
    why: ['Microservices, Kafka', 'Notice 90 days'],
    source: 'LinkedIn · via RS Plus',
    contact: 'daniel.osei@gmail.com · +91 97310 50933',
    gap: 'Notice 90 days',
  },
] as const

const PIPELINE_EXTRA_ROWS = [
  {
    id: 'hs',
    name: 'Hana Suzuki',
    title: 'Java Developer · Tokyo',
    match: 79,
    why: 'Good Java; little Spring',
    gap: 'Spring Boot missing',
    stage: 'Applied · New',
  },
  {
    id: 'am',
    name: 'Arjun Mehta',
    title: 'Senior Engineer · Mumbai',
    match: 76,
    why: 'Senior profile',
    gap: 'Salary above band',
    stage: 'Applied · New',
  },
] as const

function pipelineTableContent(): NonNullable<CopilotBotContent['pipelineTable']> {
  const rows = [
    ...AI_SEARCH_CANDIDATES.map((c) => ({
      id: c.id,
      name: c.name,
      title: c.title,
      match: c.score,
      why: c.why.join('; '),
      gap: c.gap,
      stage: 'Applied · New',
    })),
    ...PIPELINE_EXTRA_ROWS,
  ]
  return {
    heading: 'Pipeline · JR-1061',
    badge: `${rows.length} scored`,
    linkLabel: 'Open pipeline ↗',
    stages: [...PIPELINE_STAGES],
    rows,
    shortlistId: 'hire-shortlist',
  }
}

function screeningOptionsContent(): CopilotBotContent {
  return {
    text: 'How would you like to screen the shortlisted candidates?',
    optionCards: [
      {
        id: 'hire-screen-jeeves',
        icon: 'ai',
        title: 'Jeeves AI (Prescreening)',
        description:
          'Chat-based screening on WhatsApp or email — availability, notice, salary, work mode. No scheduling needed.',
        aiTag: true,
      },
      {
        id: 'hire-screen-oneway',
        icon: 'play',
        title: '1 Way Interview',
        description:
          'VScreen recorded video interview — candidates answer on their own time; AI ratings and summaries for you.',
      },
      {
        id: 'hire-screen-twoway',
        icon: 'call',
        title: '2 Way Interview',
        description:
          'Live interview booked through the scheduler with your panel.',
      },
    ],
  }
}

function screenOneWayContent(): CopilotBotContent {
  return {
    title: `Step 5 · ${RECRUITER_HIRE_STEPS[4]}`,
    text: 'Set up the one-way video interview — pick a round and template, then send invites. This demo continues with the VScreen path from Jeeves results.',
    chips: [
      chip('hire-confirm-4', 'Send VScreen invites', { variant: 'primary' }),
      chip('toast', 'Open round in SniperAI ↗', {
        toast: 'Opening 1-way round in SniperAI',
      }),
    ],
  }
}

function screenTwoWayContent(): CopilotBotContent {
  return {
    text: 'Setting up a 2-way (live) interview for the shortlisted candidates — this demo wires the Jeeves and 1-way paths; the 2-way path would open the scheduler next.',
    chips: [
      chip('hire-confirm-5', 'Open scheduler', { variant: 'primary' }),
    ],
  }
}

export function recruiterWelcomeContent(): CopilotBotContent {
  return {
    title: 'SniperAI connected',
    text: 'Hi Deepak — SniperAI is connected. I can look up jobs, candidates, campaigns, talent pools, evaluations and one-way interviews, and take actions you confirm. What would you like to do?',
    chips: [
      chip('hire-start', 'Hire a Java Developer — Pune', { variant: 'primary' }),
      chip('start-recCandidates', 'Data Analyst pipeline review'),
      chip('start-recInterviews', 'Riyadh designers campaign'),
      chip('start-recReports', 'Q3 hiring summary'),
    ],
  }
}

export function recruiterHireStepContent(stepIndex: number): CopilotBotContent {
  switch (stepIndex) {
    case 0:
      return {
        ...hireStepShell(
          0,
          "I've read your Java Developer brief and built it as a draft so you can check it before it goes live:",
        ),
        detailCard: {
          heading: 'Java Developer – Pune',
          badge: 'Draft · JR-1061',
          badgeTone: 'amber',
          linkLabel: 'Edit in SniperAI ↗',
          rows: [
            { label: 'Experience', value: '5–8 years' },
            { label: 'Work mode', value: 'Hybrid · Pune' },
            {
              label: 'Must-have skills',
              value: 'Java 11+ (30%) · Spring Boot (25%) · Microservices (15%)',
            },
            { label: 'Nice to have', value: 'PostgreSQL · AWS · Kafka' },
            {
              label: 'Pipeline workflow',
              value:
                'Default hiring workflow (Applied → Screening → VScreen → Interview → Offer → Joined)',
            },
            { label: 'Salary band', value: '₹18–26 L (from the approved band)' },
          ],
        },
        confirmBox: {
          title: 'Publish this job?',
          lines: [
            'Publishes to the careers site and opens the pipeline. You can still edit it afterwards.',
          ],
          primary: chip('hire-confirm-0', 'Publish JR-1061', {
            variant: 'primary',
          }),
          secondary: PAUSED_CHIP,
        },
      }
    case 1:
      return {
        ...hireStepShell(
          1,
          'How would you like to add candidates to Java Developer (JR-1061)?',
        ),
        optionCards: [
          {
            id: 'hire-fetch-upload',
            icon: 'upload',
            title: 'Upload resumes',
            description:
              'Add candidates manually from files — single or bulk, parsed and scored on arrival.',
          },
          {
            id: 'hire-fetch-ai',
            icon: 'ai',
            title: 'Fetch with AI Global Search',
            description:
              'SniperAI reads the job and recommends the closest profiles from 750M+ across job boards, your talent pool and past applicants.',
            aiTag: true,
          },
          {
            id: 'hire-fetch-db',
            icon: 'db',
            title: 'Fetch within Candidate Database',
            description:
              'Search the 12,480 profiles already in your Recruitment SMART database.',
          },
        ],
      }
    case 2:
      return {
        ...hireStepShell(
          2,
          "Here's everyone in the pipeline for JR-1061, scored against the job. Tick the candidates you want to shortlist:",
        ),
        pipelineTable: pipelineTableContent(),
      }
    case 3:
      return {
        ...hireStepShell(
          3,
          'Jeeves will run the screening questions by chat — availability, notice period, salary expectation, work mode:',
        ),
        checklist: {
          heading: 'Jeeves screening · 5 questions',
          items: [
            { label: 'Are you open to a hybrid role based in Pune?', done: true },
            { label: 'What is your current notice period?', done: true },
            {
              label: 'What salary range are you expecting?',
              done: true,
              detail: 'compared with the ₹18–26 L band',
            },
            {
              label: 'Years of hands-on Spring Boot experience?',
              done: true,
            },
            {
              label: 'Any upcoming interviews or offers we should know about?',
              done: true,
            },
          ],
        },
        confirmBox: {
          title: 'Send Jeeves to the 6 shortlisted?',
          lines: [
            'WhatsApp where opted in, otherwise email. Jeeves follows up once after 24 h. Answers land on each candidate’s profile; nothing moves stage until you say so.',
          ],
          primary: chip('hire-confirm-3', 'Start Jeeves screening', {
            variant: 'primary',
          }),
          secondary: PAUSED_CHIP,
        },
      }
    case 4:
      return {
        ...hireStepShell(
          4,
          'Jeeves results are in — 5 of 6 replied within a day:',
        ),
        table: {
          heading: 'Jeeves results · JR-1061',
          columns: ['Candidate', 'Pune', 'Notice', 'Expectation', 'Verdict'],
          rows: [
            {
              cells: ['Sofia Malik', 'Yes', '30 days', '₹24 L'],
              pill: { label: 'Fit', tone: 'green' },
            },
            {
              cells: ['Rahul Mehta', 'Yes', '60 days', '₹25 L'],
              pill: { label: 'Fit', tone: 'green' },
            },
            {
              cells: ['Aditya Rao', 'Yes', '45 days', '₹22 L'],
              pill: { label: 'Fit', tone: 'green' },
            },
            {
              cells: ['Chen Wei', 'Relocate 3 mo', '60 days', '₹26 L'],
              pill: { label: 'Fit', tone: 'green' },
            },
            {
              cells: ['Priya Nair', 'Yes', '30 days', '₹30 L'],
              pill: { label: 'Above band', tone: 'amber' },
            },
            {
              cells: ['Daniel Osei', '—', '—', '—'],
              pill: { label: 'No response', tone: 'grey' },
            },
          ],
        },
        confirmBox: {
          title: 'Send VScreen invites to 4 candidates?',
          lines: [
            'Sofia, Rahul, Aditya, Chen · template "Java Developer – Skills screen" · link expires in 7 days · reminder on day 4.',
          ],
          primary: chip('hire-confirm-4', 'Send 4 invites', {
            variant: 'primary',
          }),
          secondary: PAUSED_CHIP,
        },
      }
    case 5:
      return {
        ...hireStepShell(
          5,
          'All four completed VScreen within five days. AI ratings and a one-line summary each:',
        ),
        bars: [
          { label: 'Sofia Malik', pct: 92, score: '4.6' },
          { label: 'Rahul Mehta', pct: 84, score: '4.2' },
          { label: 'Aditya Rao', pct: 78, score: '3.9' },
          { label: 'Chen Wei', pct: 64, score: '3.2' },
        ],
        table: {
          heading: 'Proposed panel slots',
          columns: ['Candidate', 'Proposed slot', 'Panel', 'Format'],
          rows: [
            {
              cells: [
                'Sofia Malik',
                'Tue 7 Oct · 11:00–11:45',
                'Lina, Deepak',
                'Video · technical + culture',
              ],
            },
            {
              cells: [
                'Rahul Mehta',
                'Tue 7 Oct · 14:00–14:45',
                'Lina, Deepak',
                'Video',
              ],
            },
            {
              cells: [
                'Aditya Rao',
                'Wed 8 Oct · 10:00–10:45',
                'Lina, Deepak',
                'Video',
              ],
            },
          ],
        },
        confirmBox: {
          title: 'Book the 3 panel interviews?',
          lines: [
            'Sends calendar invites to the panel and booking emails to the candidates. Moves the three to Interview.',
          ],
          primary: chip('hire-confirm-5', 'Book 3 interviews', {
            variant: 'primary',
          }),
          secondary: chip('toast', 'Watch recordings', {
            toast: 'Opening recordings',
          }),
        },
      }
    case 6:
      return {
        ...hireStepShell(
          6,
          'Interviews happened on 7–8 October. Panel feedback is in:',
        ),
        table: {
          heading: 'Panel feedback',
          columns: ['Candidate', 'Technical', 'Culture', 'Decision'],
          rows: [
            {
              cells: ['Sofia Malik', '4.5 · would hire', '4.0'],
              pill: { label: 'Selected', tone: 'green' },
            },
            {
              cells: ['Rahul Mehta', '4.0', '3.5'],
              pill: { label: 'Backup', tone: 'blue' },
            },
            {
              cells: ['Aditya Rao', '3.0 · needs upskilling', '4.0'],
              pill: { label: 'Not selected', tone: 'grey' },
            },
          ],
        },
        detailCard: {
          heading: 'Offer pre-filled · Sofia Malik',
          badge: 'Ready to review',
          badgeTone: 'navy',
          rows: [
            { label: 'Position', value: 'Java Developer – Pune · JR-1061' },
            { label: 'Package', value: '₹24,00,000 per year + 10% variable' },
            { label: 'Joining', value: '3 Nov 2026 (30-day notice)' },
            { label: 'Template', value: 'Standard offer letter · India' },
            { label: 'Approver', value: 'Lina Al-Harbi (hiring manager)' },
          ],
        },
        chips: [
          chip('hire-confirm-6', 'Open offer in SniperAI ↗', {
            variant: 'primary',
          }),
          chip('toast', 'Edit terms', { toast: 'Opening offer editor' }),
        ],
      }
    case 7:
      return {
        ...hireStepShell(
          7,
          'Offer sent 10 Oct, accepted and signed 12 Oct. Pre-joining documents are next:',
        ),
        checklist: {
          heading: 'Document request · Sofia Malik · due 27 Oct',
          items: [
            { label: 'Government ID (Aadhaar or passport)' },
            { label: 'Degree certificate' },
            { label: "Last 3 months' payslips" },
            { label: 'Relieving / experience letters' },
          ],
        },
        confirmBox: {
          title: 'Send the document request?',
          lines: [
            'Email + candidate-portal upload link. Reminders on day 7 and day 12; I’ll flag anything missing on day 14.',
          ],
          primary: chip('hire-confirm-7', 'Send request', {
            variant: 'primary',
          }),
          secondary: PAUSED_CHIP,
        },
      }
    case 8:
      return {
        ...hireStepShell(
          8,
          'Documents came in over the next ten days:',
        ),
        checklist: {
          heading: 'Documents · Sofia Malik',
          items: [
            { label: 'Government ID', done: true, detail: 'received 15 Oct' },
            {
              label: 'Degree certificate',
              done: true,
              detail: 'received 15 Oct',
            },
            { label: 'Payslips', done: true, detail: 'received 20 Oct' },
            {
              label: 'Experience letters',
              done: true,
              detail: 'received 22 Oct · verified',
            },
          ],
        },
        confirmBox: {
          title: 'Close JR-1061?',
          lines: [
            'Marks the job Filled and Sofia Hired.',
            'Sends the “position filled” email to the 22 other candidates still open in the pipeline.',
            'Unpublishes from the careers site.',
          ],
          primary: chip('hire-confirm-8', 'Close job and notify 22', {
            variant: 'primary',
          }),
          secondary: PAUSED_CHIP,
        },
      }
    default:
      return recruiterHireSummary()
  }
}

function aiSearchResultsContent(): CopilotBotContent {
  return {
    title: 'AI Global Search',
    text: 'SniperAI found 42 profiles at 80% match or above. The top six, with the reasons behind each score:',
    kpis: [
      { label: 'Found', value: '42', hint: 'profiles ≥ 80% match' },
      { label: 'Your database', value: '9', hint: 'incl. 4 past applicants' },
      { label: 'RS Plus', value: '33', hint: 'LinkedIn, Naukri, GitHub' },
      { label: 'Already applied', value: '6', hint: 'in the last 24 h' },
    ],
    personCards: AI_SEARCH_CANDIDATES.map(({ gap: _gap, why, ...card }) => ({
      ...card,
      why: [...why],
    })),
    continueBar: {
      emptyLabel:
        'Add the candidates you want — nothing is added until you click.',
      showMoreLabel: 'Show more',
      showMoreToast: 'Showing next 6 of 42',
      continueLabel: 'Continue to Add Job',
      continueId: 'hire-continue-pipeline',
    },
  }
}

export function recruiterHireConfirmContent(stepIndex: number): {
  ack: CopilotBotContent
  next?: CopilotBotContent
} {
  const AFTER: Record<number, string> = {
    0: 'Published JR-1061 to the careers site. Pipeline open.',
    1: '18 candidates added at Applied · New. Invites sent; 6 self-applicants already in.',
    2: '6 candidates shortlisted and moved to Screening.',
    3: "Jeeves screening started for 6 candidates. I'll bring the answers here when they arrive.",
    4: '4 VScreen invites sent · expire in 7 days. Priya and Daniel held in Screening with notes.',
    5: '3 interviews booked for 7–8 Oct. Candidates and panel notified.',
    6: 'Offer OFR-2026-1203 reviewed, approved by Lina and sent to Sofia from SniperAI.',
    7: "Document request sent. Upload link live in Sofia's portal; reminders scheduled.",
    8: 'JR-1061 closed as Filled. 22 candidates notified; job unpublished.',
  }

  if (stepIndex === 0) {
    return {
      ack: {
        successBanner: '✓ Job created and published.',
        jobBanner: {
          title: 'Java Developer',
          meta: 'JR-1061 · Engineering · Pune, IN · Hybrid',
          status: 'Published · Careers site',
          apps: '0',
        },
        chips: [
          chip('hire-confirm-0-next', 'Add/Fetch Candidates', {
            variant: 'primary',
          }),
          chip('toast', 'Edit · Share · Unpublish', {
            toast: 'Opening job actions',
          }),
        ],
      },
    }
  }

  if (stepIndex >= 8) {
    return { ack: recruiterHireSummary() }
  }

  const nextIndex = stepIndex + 1
  return {
    ack: {
      successBanner: `✓ ${AFTER[stepIndex]}`,
    },
    next: recruiterHireStepContent(nextIndex),
  }
}

function recruiterHireSummary(): CopilotBotContent {
  return {
    title: 'Hire complete',
    successBanner: '✓ JR-1061 is closed.',
    text: 'Java Developer – Pune · Filled · Sofia Malik joins 3 Nov.',
    kpis: [
      { label: 'Time to hire', value: '23 days', hint: '1 Oct → 24 Oct' },
      { label: 'Sourced', value: '42', hint: '24 entered pipeline' },
      { label: 'Interviewed', value: '3', hint: '4 one-way · 3 panel' },
      { label: 'Cost', value: '₹0 agency', hint: 'RS Plus + database' },
    ],
    bars: [
      { label: 'Applied', pct: 100, score: '24' },
      { label: 'Screening', pct: 65, score: '6' },
      { label: 'VScreen', pct: 50, score: '4' },
      { label: 'Interview', pct: 38, score: '3' },
      { label: 'Offer', pct: 20, score: '1' },
      { label: 'Hired', pct: 20, score: '1' },
    ],
    chips: [
      chip('toast', 'Export summary', { toast: 'Summary exported' }),
      chip('toast', 'Start onboarding', {
        toast: 'Opening onboarding in SniperAI',
      }),
      chip('hire-start', 'Run this flow again', { variant: 'skip' }),
    ],
  }
}

export function isHireFlowAction(actionId: string): boolean {
  return HIRE_FLOW_IDS.has(actionId) || /^hire-confirm-\d+$/.test(actionId)
}

type HireFlowResult = {
  hireStep: number
  content: CopilotBotContent
  followUp?: CopilotBotContent
  delayMs?: number
  toast?: string
}

function fetchFallbackContent(viaDb: boolean): HireFlowResult {
  return {
    hireStep: 1,
    content: {
      text: viaDb
        ? 'Opening Candidate Database search for JR-1061 — this demo continues on the AI Global Search path.'
        : 'Opening the resume upload flow for JR-1061 — this demo continues on the AI Global Search path.',
      chips: [
        chip('hire-fetch-ai', 'Continue with AI Global Search', {
          variant: 'primary',
        }),
      ],
    },
  }
}

function hireConfirmResult(stepIndex: number): HireFlowResult {
  const result = recruiterHireConfirmContent(stepIndex)
  if (stepIndex === 0) return { hireStep: 0, content: result.ack }
  if (stepIndex >= 8) return { hireStep: 9, content: result.ack }
  return {
    hireStep: stepIndex + 1,
    content: result.ack,
    followUp: result.next,
    delayMs: 500,
  }
}

export function handleHireFlowAction(actionId: string): HireFlowResult | null {
  switch (actionId) {
    case 'hire-start':
      return { hireStep: 0, content: recruiterHireStepContent(0) }
    case 'hire-confirm-0-next':
      return { hireStep: 1, content: recruiterHireStepContent(1) }
    case 'hire-fetch-ai':
      return { hireStep: 1, content: aiSearchResultsContent() }
    case 'hire-fetch-upload':
      return fetchFallbackContent(false)
    case 'hire-fetch-db':
      return fetchFallbackContent(true)
    case 'hire-continue-pipeline':
      return {
        hireStep: 2,
        content: {
          successBanner:
            '✓ Selected candidates added at Applied · New. Invites sent where needed.',
          ...recruiterHireStepContent(2),
        },
      }
    case 'hire-shortlist':
      return {
        hireStep: 2,
        content: {
          successBanner:
            '✓ Selected candidates shortlisted and moved to Screening. The rest stay in Applied — nobody is rejected.',
        },
        followUp: screeningOptionsContent(),
        delayMs: 500,
      }
    case 'hire-screen-jeeves':
      return { hireStep: 3, content: recruiterHireStepContent(3) }
    case 'hire-screen-oneway':
      return { hireStep: 4, content: screenOneWayContent() }
    case 'hire-screen-twoway':
      return { hireStep: 5, content: screenTwoWayContent() }
    default: {
      const match = /^hire-confirm-(\d+)$/.exec(actionId)
      if (!match) return null
      return hireConfirmResult(Number(match[1]))
    }
  }
}
