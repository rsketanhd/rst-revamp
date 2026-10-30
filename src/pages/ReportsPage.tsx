import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageContainer, PageHeader } from '../components/layout'
import { ReportSection } from '../components/reports'
import { SettingsNav } from '../components/settings'
import { toast } from '../components/ui'
import {
  DEFAULT_REPORT_CATEGORY,
  REPORT_CATEGORIES,
  REPORT_NAV_GROUPS,
  getReportDetailPath,
  getReportSectionPath,
  isReportCategoryId,
  type ReportCategoryId,
  type ReportItem,
} from '../data/reports'

/** Distance from the top of the scroll area used to decide the active section. */
const SCROLL_SPY_OFFSET_PX = 140

function categoryFromHash(hash: string): ReportCategoryId | null {
  const id = hash.replace(/^#/, '')
  return isReportCategoryId(id) ? id : null
}

function getScrollParent(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null
  while (node) {
    const { overflowY } = window.getComputedStyle(node)
    if (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') {
      return node
    }
    node = node.parentElement
  }
  return null
}

function resolveActiveCategory(scrollRoot: HTMLElement): ReportCategoryId {
  const rootTop = scrollRoot.getBoundingClientRect().top
  let active: ReportCategoryId = REPORT_CATEGORIES[0]?.id ?? DEFAULT_REPORT_CATEGORY

  for (const category of REPORT_CATEGORIES) {
    const section = document.getElementById(category.id)
    if (!section) continue
    const sectionTop = section.getBoundingClientRect().top - rootTop
    if (sectionTop <= SCROLL_SPY_OFFSET_PX) {
      active = category.id
    }
  }

  return active
}

/**
 * Reports catalog — Settings-style left nav with hash bookmarks to sections.
 */
export function ReportsPage() {
  const { hash } = useLocation()
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)
  const skipSpyRef = useRef(false)
  const [activeCategory, setActiveCategory] = useState<ReportCategoryId>(
    () => categoryFromHash(hash) ?? DEFAULT_REPORT_CATEGORY,
  )

  // Bookmark link / direct URL hash → scroll to section (does not run on scroll spy).
  useEffect(() => {
    const fromHash = categoryFromHash(hash)
    if (!fromHash) return

    setActiveCategory(fromHash)
    skipSpyRef.current = true

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(fromHash)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      window.setTimeout(() => {
        skipSpyRef.current = false
      }, 700)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [hash])

  // Scroll position → active nav only (hash updates only from left-nav clicks).
  useEffect(() => {
    const scrollRoot =
      getScrollParent(contentRef.current) ??
      (document.scrollingElement as HTMLElement | null)

    if (!scrollRoot) return

    function syncActive() {
      if (skipSpyRef.current) return
      setActiveCategory(resolveActiveCategory(scrollRoot as HTMLElement))
    }

    syncActive()
    scrollRoot.addEventListener('scroll', syncActive, { passive: true })
    window.addEventListener('resize', syncActive)

    return () => {
      scrollRoot.removeEventListener('scroll', syncActive)
      window.removeEventListener('resize', syncActive)
    }
  }, [])

  function handleSelectReport(report: ReportItem) {
    const path = getReportDetailPath(report.id)
    if (path) {
      navigate(path)
      return
    }
    toast.success(`Opening “${report.title}”.`, {
      title: 'Reports',
      description: 'Detailed report view will open here.',
    })
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        title="Reports"
        subtitle="Select a report to view detailed analytics and insights."
        className="border-b border-[#ECEAF3] pb-4"
      />

      <label className="block lg:hidden">
        <span className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-[#8B8B9E]">
          Category
        </span>
        <select
          value={activeCategory}
          onChange={(event) => {
            const next = event.target.value
            if (!isReportCategoryId(next)) return
            setActiveCategory(next)
            navigate(getReportSectionPath(next))
          }}
          aria-label="Report category"
          className="h-11 w-full rounded-lg border border-[#E0DDEA] bg-white px-3 text-sm font-medium text-[#2D2061] outline-none focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
        >
          {REPORT_CATEGORIES.map((category) => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </label>

      <div
        ref={contentRef}
        className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:gap-8"
      >
        <aside className="hidden w-full shrink-0 lg:sticky lg:top-0 lg:block lg:w-[15.5rem] xl:w-[16.5rem]">
          <SettingsNav
            activeId={activeCategory}
            groups={REPORT_NAV_GROUPS}
            ariaLabel="Report categories"
            getItemPath={getReportSectionPath}
          />
        </aside>

        <div className="min-w-0 flex-1 rounded-xl border border-[#E4E1EE] bg-white p-4 sm:p-5 lg:p-6">
          <div className="flex flex-col gap-8">
            {REPORT_CATEGORIES.map((category) => (
              <ReportSection
                key={category.id}
                category={category}
                onSelectReport={handleSelectReport}
              />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
