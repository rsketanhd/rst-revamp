export type HubThreadStatus = 'open' | 'awaiting' | 'closed'

export type HubMessageKind = 'candidate' | 'recruiter' | 'internal' | 'system'

export type HubAttachment = {
  id: string
  name: string
  sizeLabel: string
  typeLabel: string
}

export type HubMessage = {
  id: string
  kind: HubMessageKind
  body: string
  senderName: string
  timestampLabel: string
  dateDivider?: string
  attachment?: HubAttachment
}

export type HubConversation = {
  id: string
  candidateId: string
  candidateName: string
  jobTitle: string
  company: string
  matchPercent: number | null
  preview: string
  timestampLabel: string
  status: HubThreadStatus
  topicCount: number
  unreadCount: number
  assignedTo: string | null
  tags: string[]
  activeTopic: string
  messages: HubMessage[]
}

export type HubListFilter = 'all' | 'assigned' | 'open' | 'unread'

export const HUB_TAG_CATALOG = [
  'VIP Candidate',
  'Urgent Doc',
  'Salary Negotiation',
  'Offer Stage',
  'High Priority',
  'Notice Period Issue',
  'Relocation Support',
] as const

export const HUB_CONVERSATION_CATEGORIES = [
  'Document verification & pre-boarding',
  'Screening & interview',
  'Offer & negotiation',
  'Onboarding',
  'General inquiry',
] as const

export const CURRENT_RECRUITER = 'Deepak Singh'

export const HUB_CONVERSATIONS: HubConversation[] = [
  {
    id: 'hub-1',
    candidateId: 'C100124',
    candidateName: 'Folayemi Awodeyi',
    jobTitle: 'Software Developer',
    company: 'CMARIX Technolabs Pvt. Ltd.',
    matchPercent: 93,
    preview:
      "I've uploaded my passport scan for the background check. Let me know if you need anything else.",
    timestampLabel: '10:15 AM',
    status: 'open',
    topicCount: 3,
    unreadCount: 2,
    assignedTo: 'Deepak Singh',
    tags: ['VIP Candidate'],
    activeTopic: 'Document verification & pre-boarding',
    messages: [
      {
        id: 'm1',
        kind: 'candidate',
        senderName: 'Folayemi Awodeyi',
        timestampLabel: '10:12 AM',
        body: "I've uploaded my passport scan for the background check. Let me know if you need anything else from my side.",
        attachment: {
          id: 'a1',
          name: 'Candidate_Passport_Scan.jpg',
          sizeLabel: '2.4 MB',
          typeLabel: 'JPG',
        },
      },
      {
        id: 'm2',
        kind: 'system',
        senderName: 'System',
        timestampLabel: '10:14 AM',
        body: 'Passport bio-page verified by Deepak Singh',
      },
      {
        id: 'm3',
        kind: 'recruiter',
        senderName: 'Deepak Singh',
        timestampLabel: '09:15 AM',
        dateDivider: '12 Sep 2023',
        body: "Thanks Folayemi — I've verified the passport bio-page. Please share your current address proof when you get a chance so we can complete pre-boarding.",
      },
      {
        id: 'm4',
        kind: 'internal',
        senderName: 'Deepak Singh',
        timestampLabel: '09:18 AM',
        body: 'Client wants a start date before 1 Nov. Flag if notice period looks longer than 30 days.',
      },
    ],
  },
  {
    id: 'hub-2',
    candidateId: 'C100126',
    candidateName: 'Julia Harris',
    jobTitle: 'Product Manager',
    company: 'Northwind Labs',
    matchPercent: 88,
    preview: 'Happy to jump on a call tomorrow afternoon if that works.',
    timestampLabel: 'Yesterday',
    status: 'awaiting',
    topicCount: 1,
    unreadCount: 1,
    assignedTo: 'Deepak Singh',
    tags: ['High Priority'],
    activeTopic: 'Screening call scheduling',
    messages: [
      {
        id: 'jh1',
        kind: 'recruiter',
        senderName: 'Deepak Singh',
        timestampLabel: '4:40 PM',
        body: 'Hi Julia — are you free for a 30-min screening call tomorrow?',
      },
      {
        id: 'jh2',
        kind: 'candidate',
        senderName: 'Julia Harris',
        timestampLabel: '5:02 PM',
        body: 'Happy to jump on a call tomorrow afternoon if that works.',
      },
    ],
  },
  {
    id: 'hub-3',
    candidateId: 'C100125',
    candidateName: 'Marcus Chen',
    jobTitle: 'UX Designer',
    company: 'Pixel & Co.',
    matchPercent: 81,
    preview: 'Thanks for the update. Closing this thread for now.',
    timestampLabel: 'Mon',
    status: 'closed',
    topicCount: 2,
    unreadCount: 0,
    assignedTo: 'Priya Kapoor',
    tags: ['Offer Stage'],
    activeTopic: 'Portfolio review',
    messages: [
      {
        id: 'mc1',
        kind: 'recruiter',
        senderName: 'Priya Kapoor',
        timestampLabel: '11:20 AM',
        body: 'Marcus, the hiring manager loved your case study. We will circle back next sprint.',
      },
      {
        id: 'mc2',
        kind: 'candidate',
        senderName: 'Marcus Chen',
        timestampLabel: '12:05 PM',
        body: 'Thanks for the update. Closing this thread for now.',
      },
      {
        id: 'mc3',
        kind: 'system',
        senderName: 'System',
        timestampLabel: '12:06 PM',
        body: 'Conversation resolved & closed by Priya Kapoor',
      },
    ],
  },
  {
    id: 'hub-4',
    candidateId: 'C100128',
    candidateName: 'Priya Patel',
    jobTitle: 'Data Analyst',
    company: 'Insight Analytics',
    matchPercent: 90,
    preview: 'Attached the signed NDA for your records.',
    timestampLabel: 'Mon',
    status: 'open',
    topicCount: 2,
    unreadCount: 1,
    assignedTo: null,
    tags: ['Urgent Doc'],
    activeTopic: 'Offer paperwork',
    messages: [
      {
        id: 'pp1',
        kind: 'candidate',
        senderName: 'Priya Patel',
        timestampLabel: '9:10 AM',
        body: 'Attached the signed NDA for your records.',
        attachment: {
          id: 'a2',
          name: 'Priya_Patel_NDA.pdf',
          sizeLabel: '420 KB',
          typeLabel: 'PDF',
        },
      },
    ],
  },
  {
    id: 'hub-5',
    candidateId: 'C100127',
    candidateName: 'Ethan Brooks',
    jobTitle: 'DevOps Engineer',
    company: 'CloudForge',
    matchPercent: 76,
    preview: 'Could you share the interview panel details?',
    timestampLabel: 'Sun',
    status: 'open',
    topicCount: 1,
    unreadCount: 0,
    assignedTo: null,
    tags: ['Salary Negotiation'],
    activeTopic: 'Interview logistics',
    messages: [
      {
        id: 'eb1',
        kind: 'candidate',
        senderName: 'Ethan Brooks',
        timestampLabel: '3:15 PM',
        body: 'Could you share the interview panel details?',
      },
    ],
  },
  {
    id: 'hub-6',
    candidateId: 'C100129',
    candidateName: 'Sofia Alvarez',
    jobTitle: 'Full Stack Engineer',
    company: 'BrightPath Soft',
    matchPercent: 85,
    preview: 'Internal: nudge hiring manager on feedback.',
    timestampLabel: 'Fri',
    status: 'awaiting',
    topicCount: 1,
    unreadCount: 0,
    assignedTo: 'Deepak Singh',
    tags: ['VIP Candidate', 'High Priority'],
    activeTopic: 'Onsite feedback',
    messages: [
      {
        id: 'sa1',
        kind: 'internal',
        senderName: 'Deepak Singh',
        timestampLabel: '2:00 PM',
        body: 'Internal: nudge hiring manager on feedback.',
      },
      {
        id: 'sa2',
        kind: 'recruiter',
        senderName: 'Deepak Singh',
        timestampLabel: '2:05 PM',
        body: 'Hi Sofia — still waiting on panel notes. I will update you by EOD Friday.',
      },
    ],
  },
]

export function hubInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

const AVATAR_TONES = [
  'bg-[#F3D5C4] text-[#6B3A4A]',
  'bg-[#D7E7FF] text-[#1A4F8C]',
  'bg-[#E4F5E8] text-[#1B6B3A]',
  'bg-[#F3EEFF] text-[#5B3A9E]',
  'bg-[#FFF0D6] text-[#8A5A12]',
  'bg-[#FFE4EC] text-[#9B2C4A]',
] as const

export function hubAvatarTone(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash + seed.charCodeAt(i) * (i + 1)) % AVATAR_TONES.length
  }
  return AVATAR_TONES[hash] ?? AVATAR_TONES[0]
}

export type HubStatusMeta = {
  label: string
  className: string
  dotClassName: string
}

export function hubStatusMeta(
  status: HubThreadStatus,
  topicCount: number,
): HubStatusMeta {
  switch (status) {
    case 'open':
      return {
        label: topicCount > 1 ? `Open · ${topicCount} topics` : 'Open',
        className: 'text-[#178A45]',
        dotClassName: 'bg-[#12B76A]',
      }
    case 'awaiting':
      return {
        label: 'Awaiting candidate',
        className: 'text-[#C2410C]',
        dotClassName: 'bg-[#F97316]',
      }
    case 'closed':
      return {
        label: 'Closed',
        className: 'text-[#8B8B9E]',
        dotClassName: 'bg-[#A0A0B2]',
      }
    default: {
      const exhaustive: never = status
      return exhaustive
    }
  }
}

export function filterHubConversations(
  conversations: HubConversation[],
  opts: {
    query: string
    listFilter: HubListFilter
    unassignedOnly: boolean
    tag: string | null
    recruiter: string
  },
): HubConversation[] {
  const q = opts.query.trim().toLowerCase()
  return conversations.filter((item) => {
    if (opts.unassignedOnly && item.assignedTo) return false
    if (opts.tag && !item.tags.includes(opts.tag)) return false

    switch (opts.listFilter) {
      case 'all':
        break
      case 'assigned':
        if (item.assignedTo !== opts.recruiter) return false
        break
      case 'open':
        if (item.status === 'closed') return false
        break
      case 'unread':
        if (item.unreadCount <= 0) return false
        break
      default: {
        const exhaustive: never = opts.listFilter
        return exhaustive
      }
    }

    if (!q) return true
    const haystack = [
      item.candidateName,
      item.jobTitle,
      item.company,
      item.preview,
      item.activeTopic,
      ...item.tags,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(q)
  })
}

export function countUnassigned(conversations: HubConversation[]): number {
  return conversations.filter((item) => !item.assignedTo).length
}
