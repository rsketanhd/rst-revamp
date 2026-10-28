import { CAMPAIGNS, type Campaign, type CampaignChannel } from './campaigns'

export type CampaignDetailTab = 'performance' | 'details'

export type CampaignDetailMessage = {
  id: string
  label: string
  rule: string
  templateName: string
  subject?: string
  body: string[]
  /** SMS bubble text when channel is SMS. */
  smsText?: string
}

export type CampaignFunnelStage = {
  key: 'sent' | 'delivered' | 'opened' | 'clicked' | 'replied'
  label: string
  count: number
  color: string
}

export type CampaignFunnelMessage = {
  id: string
  label: string
  stages: CampaignFunnelStage[]
}

export type CampaignTrendPoint = {
  label: string
  deliveryRate: number
  openRate: number
  clickRate: number
  replyRate: number
}

export type CampaignActivityRow = {
  id: string
  name: string
  email: string
  delivered: number
  opened: number
  lastUpdated: string
}

export type CampaignDetail = {
  campaign: Campaign
  senderName: string
  fromAddress: string
  replyToAddress: string
  fromPhone: string
  audienceSummary: number
  whenToSend: string
  recurrenceInterval: string
  messages: CampaignDetailMessage[]
  performanceMetrics: Array<{ id: string; label: string; value: number }>
  funnels: CampaignFunnelMessage[]
  funnelBridgePercent: string
  funnelBridgeLabel: string
  trend: CampaignTrendPoint[]
  activity: CampaignActivityRow[]
}

const FUNNEL_COLORS = {
  sent: '#6B7280',
  delivered: '#3B59E9',
  opened: '#0EA5E9',
  clicked: '#8B5CF6',
  replied: '#10B981',
} as const

const FUNNEL_LABELS: Record<CampaignFunnelStage['key'], string> = {
  sent: 'SENT',
  delivered: 'DELIVERED',
  opened: 'OPENED',
  clicked: 'CLICKED',
  replied: 'REPLIED',
}

function funnelStages(
  counts: [number, number, number, number, number],
): CampaignFunnelStage[] {
  const keys: Array<CampaignFunnelStage['key']> = [
    'sent',
    'delivered',
    'opened',
    'clicked',
    'replied',
  ]
  return keys.map((key, index) => ({
    key,
    label: FUNNEL_LABELS[key],
    count: counts[index] ?? 0,
    color: FUNNEL_COLORS[key],
  }))
}

const WINTER_MESSAGES: CampaignDetailMessage[] = [
  {
    id: 'msg-1',
    label: 'Message 1',
    rule: "Send this message if 'No reply' to previous message, Wait 3 days",
    templateName: 'Initial Outreach Software Developers',
    subject: 'New Software Engineering Opportunity',
    body: [
      'Hi Sarah Johnson,',
      "We're reaching out from Infosys about Software Engineer roles. Your background in Java, Python, and Spring Boot looks like a strong fit for openings this quarter.",
      "If you're open to exploring, we'd love to share more details.",
    ],
    smsText:
      "To all ContactMonkey employees, We are currently initiating our fire alarm protocol. Please leave the building premises until you receive an 'all clear' message from our team.",
  },
  {
    id: 'msg-2',
    label: 'Message 2',
    rule: "Send this message if 'No reply' to previous message, Wait 3 days",
    templateName: 'Follow-up No Response',
    subject: 'Following up — opportunity at Infosys',
    body: [
      'Hi Sarah Johnson,',
      "Just checking in on my previous note. Happy to share role details whenever you're ready.",
    ],
    smsText:
      'Friendly follow-up: we still have openings that match your profile. Reply YES to learn more.',
  },
]

const WINTER_TREND: CampaignTrendPoint[] = [
  {
    label: '26 Oct 2025',
    deliveryRate: 68,
    openRate: 42,
    clickRate: 22,
    replyRate: 18,
  },
  {
    label: '03 Nov 2025',
    deliveryRate: 72,
    openRate: 48,
    clickRate: 28,
    replyRate: 24,
  },
  {
    label: '10 Nov 2025',
    deliveryRate: 75,
    openRate: 55,
    clickRate: 35,
    replyRate: 35,
  },
  {
    label: '17 Nov 2025',
    deliveryRate: 70,
    openRate: 50,
    clickRate: 30,
    replyRate: 28,
  },
  {
    label: '24 Nov 2025',
    deliveryRate: 74,
    openRate: 52,
    clickRate: 32,
    replyRate: 30,
  },
  {
    label: '01 Dec 2025',
    deliveryRate: 78,
    openRate: 58,
    clickRate: 36,
    replyRate: 32,
  },
  {
    label: '08 Dec 2025',
    deliveryRate: 76,
    openRate: 54,
    clickRate: 34,
    replyRate: 29,
  },
  {
    label: '15 Dec 2025',
    deliveryRate: 80,
    openRate: 60,
    clickRate: 38,
    replyRate: 33,
  },
]

const WINTER_ACTIVITY: CampaignActivityRow[] = [
  {
    id: 'act-1',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    delivered: 3,
    opened: 2,
    lastUpdated: '15 Nov 2025',
  },
  {
    id: 'act-2',
    name: 'John Doe',
    email: 'john.doe@email.com',
    delivered: 2,
    opened: 1,
    lastUpdated: '16 Nov 2025',
  },
  {
    id: 'act-3',
    name: 'Alice Johnson',
    email: 'alice.johnson@email.com',
    delivered: 4,
    opened: 3,
    lastUpdated: '18 Nov 2025',
  },
  {
    id: 'act-4',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    delivered: 1,
    opened: 0,
    lastUpdated: '19 Nov 2025',
  },
  {
    id: 'act-5',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    delivered: 3,
    opened: 2,
    lastUpdated: '20 Nov 2025',
  },
  {
    id: 'act-6',
    name: 'Chris Wilson',
    email: 'chris.wilson@email.com',
    delivered: 2,
    opened: 2,
    lastUpdated: '22 Nov 2025',
  },
]

function buildDetail(
  campaign: Campaign,
  overrides: Partial<Omit<CampaignDetail, 'campaign'>> = {},
): CampaignDetail {
  const isSms = campaign.channel === 'SMS'
  return {
    campaign,
    senderName: 'The Infosys Team',
    fromAddress: 'recruiting@infosys.com',
    replyToAddress: 'noreply@infosys.com',
    fromPhone: '+1 (650) 555-0123',
    audienceSummary: 491,
    whenToSend: 'Send Immediately',
    recurrenceInterval: campaign.frequency === 'Recurring' ? 'Every 1 Week' : 'Once',
    messages: WINTER_MESSAGES,
    performanceMetrics: [
      { id: 'sent', label: 'SENT', value: 1510 },
      { id: 'delivered', label: 'DELIVERED', value: 1420 },
      { id: 'opened', label: 'OPENED', value: 730 },
      { id: 'clicked', label: 'CLICKED', value: 317 },
      { id: 'replied', label: 'REPLIED', value: 157 },
      { id: 'failed', label: 'FAILED', value: 55 },
      { id: 'skipped', label: 'SKIPPED', value: 50 },
    ],
    funnels: [
      {
        id: 'msg-1',
        label: 'Message 1',
        stages: funnelStages([1200, 1150, 820, 310, 120]),
      },
      {
        id: 'msg-2',
        label: 'Message 2',
        stages: funnelStages([880, 850, 540, 190, 95]),
      },
    ],
    funnelBridgeLabel: 'If "no reply" to previous message',
    funnelBridgePercent: '72%',
    trend: WINTER_TREND,
    activity: WINTER_ACTIVITY,
    ...overrides,
    // Keep SMS sender focus when channel is SMS.
    ...(isSms
      ? {
          whenToSend: overrides.whenToSend ?? 'Send Immediately',
        }
      : {}),
  }
}

const DETAIL_BY_ID: Record<string, CampaignDetail> = {
  'cmp-1': buildDetail(
    {
      ...CAMPAIGNS[0]!,
      // Details mock shows SMS preview for this campaign.
      channel: 'SMS' as CampaignChannel,
      owners: ['Sarah Johnson', 'Matt Henry'],
      talentPool: 'Software Developer in Ahmedabad',
    },
  ),
}

export function getCampaignById(campaignId: string): Campaign | undefined {
  return CAMPAIGNS.find((item) => item.id === campaignId)
}

export function getCampaignDetail(campaignId: string): CampaignDetail | undefined {
  const cached = DETAIL_BY_ID[campaignId]
  if (cached) return cached
  const campaign = getCampaignById(campaignId)
  if (!campaign) return undefined
  return buildDetail(campaign)
}

export function campaignDetailPath(campaignId: string): string {
  return `/talent-crm/campaigns/${campaignId}`
}
