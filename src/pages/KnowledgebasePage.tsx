import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  Download,
  FileText,
  Lightbulb,
  Search,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { WhatsNewPanel } from '../components/knowledgebase/WhatsNewPanel'
import { PageContainer } from '../components/layout'
import { Button, toast } from '../components/ui'
import { getKnowledgeArticleIdByTitle } from '../data/knowledgebase'
import { markKnowledgeReleaseSeen } from '../data/releaseNotes'
import { cn } from '../lib/cn'

type KnowledgeTab = 'guides' | 'whats-new'

type KnowledgeCategory = {
  id: string
  title: string
  icon: LucideIcon
  iconClassName: string
  articles: string[]
  totalCount: number
}

const POPULAR_TAGS = ['Jobs', 'Jeeves AI', 'Offers', 'Interviews', 'Candidates'] as const

const POPULAR_ARTICLES = [
  { id: 'create-job', title: 'Create and edit a job', readMins: 14 },
  { id: 'import-candidates', title: 'Import Candidates', readMins: 12 },
  { id: 'candidate-page', title: 'Candidate page', readMins: 15 },
  {
    id: 'candidate-discovery',
    title: 'Candidate Discovery (RS Plus)',
    readMins: 14,
  },
  {
    id: 'messaging',
    title: 'Messaging (Email Sender, Email Templates, SMS, Unsubscribes)',
    readMins: 17,
  },
  {
    id: 'offer-management',
    title: 'Offer Management: list and Create Offer',
    readMins: 14,
  },
] as const

const TRAINING_MANUALS = [
  { id: 'user', title: 'User Training Manual', sizeMb: 40 },
  { id: 'settings', title: 'Settings Training Manual', sizeMb: 20 },
] as const

const CATEGORIES: KnowledgeCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Lightbulb,
    iconClassName: 'bg-[#E8F1FE] text-[#2F6FD6]',
    totalCount: 10,
    articles: [
      'Welcome to Recruitment SMART',
      'Set up your recruiter profile',
      'Create and edit a job',
      'Invite your team members',
      'Navigate Settings & modules',
    ],
  },
  {
    id: 'candidates-jobs',
    title: 'Candidates & Jobs',
    icon: Users,
    iconClassName: 'bg-[#FEE8E8] text-[#C44B4B]',
    totalCount: 12,
    articles: [
      'Import Candidates',
      'Candidate Discovery (RS Plus)',
      'Manage application pipelines',
      'Candidate page',
      'Share jobs with hiring managers',
    ],
  },
  {
    id: 'interviews-ai',
    title: 'Interviews & AI',
    icon: Sparkles,
    iconClassName: 'bg-[#E6F6EC] text-[#15803D]',
    totalCount: 9,
    articles: [
      'Build a Jeeves AI chat prescreen',
      'One-way interview avatar settings',
      'Schedule two-way interviews',
      'Review interview feedback',
      'Configure question sets',
    ],
  },
  {
    id: 'offers-reports',
    title: 'Offers & Reports',
    icon: Briefcase,
    iconClassName: 'bg-[#FEF3C7] text-[#B45309]',
    totalCount: 8,
    articles: [
      'Offer Management: list and Create Offer',
      'Using reports and analytics',
      'Messaging (Email Sender, Email Templates, SMS, Unsubscribes)',
      'Hiring stage time analytics',
      'Offer hired distribution',
    ],
  },
]

/**
 * Help center / knowledge base opened from the app top bar.
 * Tabs: Guides (articles) and What's new (release notes).
 */
export function KnowledgebasePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab: KnowledgeTab =
    searchParams.get('tab') === 'whats-new' ? 'whats-new' : 'guides'

  useEffect(() => {
    if (tab === 'whats-new') markKnowledgeReleaseSeen()
  }, [tab])

  function setTab(next: KnowledgeTab): void {
    switch (next) {
      case 'guides':
        setSearchParams({}, { replace: true })
        return
      case 'whats-new':
        setSearchParams({ tab: 'whats-new' }, { replace: true })
        return
      default: {
        const _exhaustive: never = next
        return _exhaustive
      }
    }
  }

  return (
    <PageContainer contentClassName="!gap-0 !p-0">
      <header className="border-b border-[#ECEAF3] bg-white px-4 pt-5 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-[#1A1A2E] sm:text-2xl">
            Knowledge Base
          </h1>
          <p className="mt-1 text-sm text-[#6B6B80]">
            Guides for every module and what&apos;s new in Recruitment Smart.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Knowledge Base sections"
          className="mt-5 flex gap-6"
        >
          <TabButton
            active={tab === 'guides'}
            onClick={() => setTab('guides')}
            label="Guides"
          />
          <TabButton
            active={tab === 'whats-new'}
            onClick={() => setTab('whats-new')}
            label="What's new"
            icon={<Star className="size-3.5" strokeWidth={2} aria-hidden="true" />}
          />
        </div>
      </header>

      {tab === 'whats-new' ? (
        <div className="w-full p-4 sm:p-6 lg:p-8">
          <WhatsNewPanel />
        </div>
      ) : (
        <GuidesTab />
      )}
    </PageContainer>
  )
}

function TabButton({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon?: ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center gap-1.5 pb-3 text-sm font-semibold transition-colors',
        active ? 'text-[#2D2061]' : 'text-[#8B8B9E] hover:text-[#2D2061]',
      )}
    >
      {icon}
      {label}
      {active ? (
        <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#2D2061]" />
      ) : null}
    </button>
  )
}

function GuidesTab() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [activeArticle, setActiveArticle] = useState<string | null>(null)
  const [viewAllCategoryId, setViewAllCategoryId] = useState<string | null>(
    null,
  )

  function openArticleByTitle(title: string) {
    setActiveArticle(title)
    const id = getKnowledgeArticleIdByTitle(title)
    if (id) {
      navigate(`/knowledgebase/${id}`)
      return
    }
    toast.warning('This article is coming soon.', { title: 'Knowledgebase' })
  }

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase()
    const tag = activeTag?.toLowerCase() ?? ''

    return CATEGORIES.map((category) => {
      const categoryHit =
        (!!q && category.title.toLowerCase().includes(q)) ||
        (!!tag && category.title.toLowerCase().includes(tag))

      const articles = category.articles.filter((title) => {
        if (categoryHit && !q && !tag) return true
        if (categoryHit && q && category.title.toLowerCase().includes(q)) {
          return true
        }
        const matchesQuery = !q || title.toLowerCase().includes(q)
        const matchesTag = !tag || title.toLowerCase().includes(tag)
        return matchesQuery && matchesTag
      })

      return {
        ...category,
        articles: categoryHit && articles.length === 0 ? category.articles : articles,
      }
    }).filter((category) => category.articles.length > 0)
  }, [query, activeTag])

  const viewAllCategory = useMemo(() => {
    if (!viewAllCategoryId) return null
    return (
      filteredCategories.find((category) => category.id === viewAllCategoryId) ??
      CATEGORIES.find((category) => category.id === viewAllCategoryId) ??
      null
    )
  }, [filteredCategories, viewAllCategoryId])

  function applyTag(tag: string) {
    setViewAllCategoryId(null)
    setActiveTag((current) => (current === tag ? null : tag))
    setQuery(tag)
  }

  function handleSearchSubmit(event: FormEvent) {
    event.preventDefault()
  }

  return (
    <>
      <div className="border-b border-[#DDE5F5] bg-[#EEF4FC]">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-8 text-center sm:px-6 sm:py-10">
          <h2 className="text-xl font-bold tracking-tight text-[#1A1A2E] sm:text-2xl">
            You have questions? We have Answers!
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6B6B80]">
            Search guides, FAQs, and videos to get the most from Recruitment
            SMART.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="mt-6 flex w-full max-w-xl flex-col gap-2 sm:flex-row sm:gap-0"
          >
            <label className="sr-only" htmlFor="knowledgebase-search">
              Search for topics
            </label>
            <div className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#A0A0B2]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <input
                id="knowledgebase-search"
                type="search"
                placeholder="Search for Topics...."
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setActiveTag(null)
                  setViewAllCategoryId(null)
                }}
                className={cn(
                  'h-12 w-full border border-[#D5D2E2] bg-white pl-10 pr-3.5 text-sm text-[#2D2061]',
                  'rounded-[8px] sm:rounded-r-none sm:border-r-0',
                  'outline-none transition-colors placeholder:text-[#A0A0B2]',
                  'focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10 sm:focus:ring-0',
                )}
              />
            </div>
            <Button
              type="submit"
              className="!h-12 !rounded-[8px] !bg-[#2D2061] !px-6 text-sm font-semibold text-white hover:!bg-[#241a52] sm:!rounded-l-none"
            >
              Search
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium text-[#6B6B80]">Popular:</span>
            {POPULAR_TAGS.map((tag) => {
              const selected = activeTag === tag || query === tag
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => applyTag(tag)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                    selected
                      ? 'border-[#2D2061] bg-[#2D2061] text-white'
                      : 'border-[#C5CDDE] bg-white/70 text-[#2D2061] hover:border-[#2D2061] hover:bg-white',
                  )}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,20rem)] lg:items-start lg:gap-6 sm:p-6 lg:p-8">
        <div className="min-w-0">
          {viewAllCategory ? (
            <CategoryArticlesView
              category={viewAllCategory}
              activeArticle={activeArticle}
              onBack={() => setViewAllCategoryId(null)}
              onSelectArticle={openArticleByTitle}
            />
          ) : (
            <>
              <h2 className="mb-4 text-lg font-bold text-[#2D2061]">
                Browse By Module
              </h2>
              {filteredCategories.every(
                (category) => category.articles.length === 0,
              ) ? (
                <p className="rounded-[8px] border border-[#E4E1EE] bg-[#F8F9FB] px-4 py-8 text-center text-sm text-[#8B8B9E]">
                  No articles match “{query.trim()}”. Try another search.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
                  {filteredCategories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      activeArticle={activeArticle}
                      onSelectArticle={openArticleByTitle}
                      onViewAll={() => setViewAllCategoryId(category.id)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <aside className="flex w-full flex-col gap-4 lg:sticky lg:top-4">
          <PopularArticlesCard />
          <TrainingManualsCard />
        </aside>
      </div>
    </>
  )
}

function PopularArticlesCard() {
  return (
    <section className="rounded-[10px] border border-[#E8E6F0] bg-white p-4 shadow-[0_4px_18px_rgba(45,32,97,0.05)] sm:p-5">
      <h2 className="mb-3 text-[15px] font-bold text-[#2D2061]">
        Popular articles
      </h2>
      <ul className="flex flex-col gap-1">
        {POPULAR_ARTICLES.map((article) => (
          <li key={article.id}>
            <Link
              to={`/knowledgebase/${article.id}`}
              className="flex w-full items-start gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[#F7F8FB]"
            >
              <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-md bg-[#E8F1FE] text-[#2F6FD6]">
                <BookOpen className="size-3.5" strokeWidth={2} aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium leading-snug text-[#1A1A2E]">
                  {article.title}
                </span>
                <span className="mt-0.5 block text-xs text-[#8B8B9E]">
                  {article.readMins} min read
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

function TrainingManualsCard() {
  return (
    <section className="rounded-[10px] border border-[#E8E6F0] bg-white p-4 shadow-[0_4px_18px_rgba(45,32,97,0.05)] sm:p-5">
      <div className="mb-2 flex items-center gap-2.5">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-[#E8F1FE] text-[#2F6FD6]">
          <BookOpen className="size-4" strokeWidth={2} aria-hidden="true" />
        </span>
        <h2 className="text-[15px] font-bold text-[#2D2061]">Training manuals</h2>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-[#8B8B9E]">
        Every article comes from these manuals. Read them from the start or
        download the PDF. 50 articles.
      </p>
      <ul className="divide-y divide-[#EEEDF3] border-t border-[#EEEDF3]">
        {TRAINING_MANUALS.map((manual) => (
          <li
            key={manual.id}
            className="flex flex-wrap items-center justify-between gap-2 py-3"
          >
            <span className="text-sm font-semibold text-[#2D2061]">
              {manual.title}
            </span>
            <button
              type="button"
              onClick={() =>
                toast.success(`${manual.title} download started.`, {
                  title: 'Training manuals',
                })
              }
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#D5D2E2] bg-white px-3 text-xs font-semibold text-[#2D2061] transition-colors hover:border-[#2D2061] hover:bg-[#F7F8FB]"
            >
              <Download className="size-3.5" strokeWidth={2} aria-hidden="true" />
              Download PDF ({manual.sizeMb} MB)
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CategoryCard({
  category,
  activeArticle,
  onSelectArticle,
  onViewAll,
}: {
  category: KnowledgeCategory & { articles: string[] }
  activeArticle: string | null
  onSelectArticle: (title: string) => void
  onViewAll: () => void
}) {
  const Icon = category.icon
  const previewLimit = 5
  const visibleArticles = category.articles.slice(0, previewLimit)
  const displayCount = formatCount(
    Math.max(category.totalCount, category.articles.length),
  )

  return (
    <article className="flex flex-col rounded-[10px] border border-[#E8E6F0] bg-white p-5 shadow-[0_4px_18px_rgba(45,32,97,0.06)]">
      <div className="mb-4 flex items-center gap-2.5">
        <span
          className={cn(
            'inline-flex size-9 shrink-0 items-center justify-center rounded-lg',
            category.iconClassName,
          )}
        >
          <Icon className="size-[1.125rem]" strokeWidth={2} aria-hidden="true" />
        </span>
        <h2 className="min-w-0 flex-1 truncate text-[15px] font-bold text-[#1A1A2E]">
          {category.title}
        </h2>
        <span className="shrink-0 text-sm text-[#A0A0B2]">({displayCount})</span>
      </div>

      <ul className="flex flex-1 flex-col gap-2.5">
        {visibleArticles.map((title) => (
          <li key={title}>
            <ArticleTitleButton
              title={title}
              active={activeArticle === title}
              onSelect={onSelectArticle}
            />
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onViewAll}
        className={cn(
          'mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors',
          activeArticle && category.articles.includes(activeArticle)
            ? 'text-[#2F9BB5] hover:text-[#2489A1]'
            : 'text-[#2D2061] hover:text-[#241a52]',
        )}
      >
        View All
        <ArrowRight className="size-3.5" strokeWidth={2.25} aria-hidden="true" />
      </button>
    </article>
  )
}

function CategoryArticlesView({
  category,
  activeArticle,
  onBack,
  onSelectArticle,
}: {
  category: KnowledgeCategory & { articles: string[] }
  activeArticle: string | null
  onBack: () => void
  onSelectArticle: (title: string) => void
}) {
  const Icon = category.icon
  const source =
    CATEGORIES.find((item) => item.id === category.id) ?? category
  const articles = source.articles

  return (
    <section className="rounded-[10px] border border-[#E8E6F0] bg-white p-5 shadow-[0_4px_18px_rgba(45,32,97,0.06)] sm:p-6">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#6B6B80] transition-colors hover:text-[#2D2061]"
      >
        <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden="true" />
        Back to Browse By Module
      </button>

      <div className="mb-5 flex items-center gap-2.5">
        <span
          className={cn(
            'inline-flex size-9 shrink-0 items-center justify-center rounded-lg',
            category.iconClassName,
          )}
        >
          <Icon className="size-[1.125rem]" strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-[#1A1A2E]">{category.title}</h2>
          <p className="text-xs text-[#8B8B9E]">
            {articles.length} article{articles.length === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      <ul className="divide-y divide-[#EEEDF3] border-t border-[#EEEDF3]">
        {articles.map((title) => (
          <li key={title} className="py-3 first:pt-3">
            <ArticleTitleButton
              title={title}
              active={activeArticle === title}
              onSelect={onSelectArticle}
              showArrow
            />
          </li>
        ))}
      </ul>
    </section>
  )
}

function ArticleTitleButton({
  title,
  active,
  onSelect,
  showArrow = false,
}: {
  title: string
  active: boolean
  onSelect: (title: string) => void
  showArrow?: boolean
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(title)}
      className={cn(
        'group flex w-full items-start gap-2.5 text-left text-sm leading-snug transition-colors',
        active
          ? 'font-medium text-[#2F9BB5]'
          : 'text-[#5A5A72] hover:text-[#2D2061]',
      )}
    >
      <FileText
        className={cn(
          'mt-0.5 size-3.5 shrink-0',
          active
            ? 'text-[#2F9BB5]'
            : 'text-[#B8B5C9] group-hover:text-[#8B8B9E]',
        )}
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">{title}</span>
      {showArrow ? (
        <ArrowRight
          className="mt-0.5 size-3.5 shrink-0 text-[#B8B5C9] group-hover:text-[#2D2061]"
          strokeWidth={2}
          aria-hidden="true"
        />
      ) : null}
    </button>
  )
}

function formatCount(count: number): string {
  return count < 10 ? `0${count}` : String(count)
}
