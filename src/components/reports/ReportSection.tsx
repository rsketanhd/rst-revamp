import { ReportCard } from './ReportCard'
import type { ReportCategory, ReportItem } from '../../data/reports'
import { cn } from '../../lib/cn'

export type ReportSectionProps = {
  category: ReportCategory
  onSelectReport?: (report: ReportItem) => void
  className?: string
}

/**
 * One report category block — title, description, and report cards grid.
 */
export function ReportSection({
  category,
  onSelectReport,
  className,
}: ReportSectionProps) {
  return (
    <section
      id={category.id}
      className={cn('scroll-mt-6', className)}
    >
      <header className="border-b border-[#ECEAF3] pb-3">
        <h2 className="text-base font-bold text-[#2D2061]">{category.title}</h2>
        <p className="mt-0.5 text-sm text-[#8B8B9E]">{category.description}</p>
      </header>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {category.reports.map((report) => (
          <ReportCard
            key={report.id}
            report={report}
            onSelect={onSelectReport}
          />
        ))}
      </div>
    </section>
  )
}
