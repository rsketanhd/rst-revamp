import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import { CampaignDetailDetailsTab } from '../components/talent-crm/campaign-detail/CampaignDetailDetailsTab'
import { CampaignDetailPerformanceTab } from '../components/talent-crm/campaign-detail/CampaignDetailPerformanceTab'
import {
  getCampaignDetail,
  type CampaignDetailTab,
} from '../data/campaignDetail'
import { cn } from '../lib/cn'

const LIST_PATH = '/talent-crm/campaigns'

const TAB_OPTIONS: Array<{ value: CampaignDetailTab; label: string }> = [
  { value: 'performance', label: 'Performance' },
  { value: 'details', label: 'Details' },
]

/**
 * Campaign detail — Performance analytics + Details / message preview.
 */
export function CampaignDetailPage() {
  const { campaignId = '' } = useParams()
  const detail = getCampaignDetail(campaignId)
  const [tab, setTab] = useState<CampaignDetailTab>('performance')

  if (!detail) {
    return <Navigate to={LIST_PATH} replace />
  }

  return (
    <PageContainer contentClassName="gap-4">
      <div className="flex flex-col gap-3">
        <Link
          to={LIST_PATH}
          className="inline-flex w-fit items-center gap-1 text-[13px] font-medium text-[#6B6B80] transition-colors hover:text-[#2D2061]"
        >
          <ArrowLeft
            className="size-3.5 shrink-0"
            strokeWidth={2}
            aria-hidden="true"
          />
          Go Back
        </Link>

        <PageHeader title={detail.campaign.name} />

        <div
          role="tablist"
          aria-label="Campaign views"
          className="flex flex-wrap gap-2"
        >
          {TAB_OPTIONS.map((option) => {
            const active = tab === option.value
            return (
              <button
                key={option.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(option.value)}
                className={cn(
                  'relative inline-flex h-10 min-w-[7.5rem] items-center justify-center rounded-lg px-4 text-sm font-semibold transition-colors',
                  active
                    ? 'bg-[#2D2061] text-white'
                    : 'border border-[#D5D2E2] bg-white text-[#2D2061] hover:bg-[#F7F6FB]',
                )}
              >
                {option.label}
                {active ? (
                  <span
                    className="absolute -bottom-1.5 left-1/2 size-0 -translate-x-1/2 border-x-[6px] border-t-[7px] border-x-transparent border-t-[#2D2061]"
                    aria-hidden="true"
                  />
                ) : null}
              </button>
            )
          })}
        </div>
      </div>

      {tab === 'performance' ? (
        <CampaignDetailPerformanceTab detail={detail} />
      ) : (
        <CampaignDetailDetailsTab detail={detail} />
      )}
    </PageContainer>
  )
}
