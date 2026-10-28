import { Globe, Pencil, Trash2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  formatOwners,
  formatPaddedCount,
  formatTalentMetric,
  type TalentPool,
  type TalentPoolVisibility,
} from '../../data/talentCrm'
import { ThreeDotsMenu, type ThreeDotsMenuItem } from '../ui'

export type TalentPoolCardProps = {
  pool: TalentPool
  className?: string
  onOpen?: (pool: TalentPool) => void
  onEdit?: (pool: TalentPool) => void
  onDelete?: (pool: TalentPool) => void
}

/**
 * Single talent pool row card — title, visibility, metrics, and actions.
 */
export function TalentPoolCard({
  pool,
  className,
  onOpen,
  onEdit,
  onDelete,
}: TalentPoolCardProps) {
  const menuItems: ThreeDotsMenuItem[] = [
    {
      id: 'edit',
      label: 'Edit',
      icon: <Pencil strokeWidth={1.75} aria-hidden="true" />,
      onSelect: () => onEdit?.(pool),
    },
    {
      id: 'delete',
      label: 'Delete',
      destructive: true,
      icon: <Trash2 strokeWidth={1.75} aria-hidden="true" />,
      onSelect: () => onDelete?.(pool),
    },
  ]

  return (
    <article
      className={cn(
        'rounded-xl border border-[#E8E6F0] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(45,32,97,0.04)] sm:px-5',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onOpen?.(pool)}
              className="truncate text-left text-[15px] font-bold text-[#2D2061] hover:underline"
            >
              {pool.name}
            </button>
            <VisibilityMark visibility={pool.visibility} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4 lg:gap-x-8">
            <MetaField
              label="Candidate Count"
              value={formatTalentMetric(pool.candidateCount)}
            />
            <MetaField label="Owners" value={formatOwners(pool.owners)} />
            <MetaField
              label="Active Campaigns"
              value={formatPaddedCount(pool.activeCampaigns)}
            />
            <MetaField label="Created On" value={pool.createdOn} />
          </div>
        </div>

        <ThreeDotsMenu
          triggerLabel={`Actions for ${pool.name}`}
          side="left"
          items={menuItems}
        />
      </div>
    </article>
  )
}

function VisibilityMark({ visibility }: { visibility: TalentPoolVisibility }) {
  switch (visibility) {
    case 'public':
      return (
        <span className="inline-flex items-center rounded-full bg-[#E8F1FE] px-2.5 py-0.5 text-[11px] font-semibold text-[#2F6FD6]">
          Public
        </span>
      )
    case 'shared':
      return (
        <span
          className="inline-flex size-6 items-center justify-center rounded-full bg-[#E8F1FE] text-[#2F6FD6]"
          title="Shared"
          aria-label="Shared pool"
        >
          <Globe className="size-3.5" strokeWidth={2} aria-hidden="true" />
        </span>
      )
    case 'private':
      return null
    default: {
      const exhaustive: never = visibility
      return exhaustive
    }
  }
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-[#8B8B9E]">{label}</p>
      <p className="mt-0.5 truncate text-[13px] font-semibold text-[#2D2061]">
        {value}
      </p>
    </div>
  )
}
