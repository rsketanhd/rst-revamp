import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ChevronDown,
  ThumbsDown,
  ThumbsUp,
  type LucideIcon,
} from 'lucide-react'
import { PageContainer } from '../components/layout'
import { Button, toast } from '../components/ui'
import {
  getKnowledgeArticle,
  getKnowledgeModuleForArticle,
  KNOWLEDGE_MODULE_NAV,
  type KnowledgeArticleBlock,
  type KnowledgeArticleDetail,
} from '../data/knowledgebase'
import { cn } from '../lib/cn'

const SCROLL_ROOT_SELECTOR = '[data-knowledge-scroll]'
const TOC_OFFSET_PX = 96
const SCROLL_PADDING_PX = 24

/**
 * Knowledgebase article detail — left module nav, article body, On this page TOC.
 */
export function KnowledgebaseArticlePage() {
  const { articleId = '' } = useParams()
  const article = getKnowledgeArticle(articleId)

  if (!article) {
    return <Navigate to="/knowledgebase" replace />
  }

  return <ArticleLayout article={article} />
}

type ArticleLayoutProps = {
  article: KnowledgeArticleDetail
}

function ArticleLayout({ article }: ArticleLayoutProps) {
  const [activeToc, setActiveToc] = useState(article.toc[0]?.id ?? '')
  const [openModules, setOpenModules] = useState(() =>
    buildOpenModules(article.id),
  )
  const [helpful, setHelpful] = useState<'yes' | 'no' | null>(null)

  const moduleForArticle = getKnowledgeModuleForArticle(article.id)
  const relatedArticles =
    moduleForArticle?.articles.filter((item) => item.id !== article.id) ?? []

  useEffect(() => {
    setActiveToc(article.toc[0]?.id ?? '')
    setHelpful(null)
    setOpenModules(buildOpenModules(article.id))
  }, [article.id, article.toc])

  useEffect(() => {
    const scrollRoot = getKnowledgeScrollRoot()
    if (!scrollRoot) return
    const root = scrollRoot

    function onScroll() {
      const rootTop = root.getBoundingClientRect().top
      let current = article.toc[0]?.id ?? ''
      for (const item of article.toc) {
        const el = document.getElementById(item.id)
        if (!el) continue
        if (el.getBoundingClientRect().top - rootTop <= TOC_OFFSET_PX) {
          current = item.id
        }
      }
      setActiveToc(current)
    }

    root.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => root.removeEventListener('scroll', onScroll)
  }, [article.id, article.toc])

  function scrollToSection(id: string) {
    const el = document.getElementById(id)
    const scrollRoot = getKnowledgeScrollRoot()
    if (!el || !scrollRoot) return

    const top =
      el.getBoundingClientRect().top -
      scrollRoot.getBoundingClientRect().top +
      scrollRoot.scrollTop -
      SCROLL_PADDING_PX
    scrollRoot.scrollTo({ top, behavior: 'smooth' })
    setActiveToc(id)
  }

  function toggleModule(moduleId: string) {
    setOpenModules((current) => ({
      ...current,
      [moduleId]: !current[moduleId],
    }))
  }

  return (
    <PageContainer contentClassName="!gap-0 !p-0" showTopBar>
      <div
        data-knowledge-scroll
        className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#F7F8FB]"
      >
        <div className="border-b border-[#ECEAF3] bg-white px-4 py-3 sm:px-6 lg:px-8">
          <Link
            to="/knowledgebase"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#6B6B80] transition-colors hover:text-[#2D2061]"
          >
            <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden="true" />
            Back to Knowledgebase
          </Link>
        </div>

        <div className="grid w-full flex-1 grid-cols-1 gap-0 lg:grid-cols-[15.5rem_minmax(0,1fr)_14.5rem]">
          <aside className="border-b border-[#ECEAF3] bg-white lg:border-b-0 lg:border-r">
            <div className="sticky top-0 p-4 sm:p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8B8B9E]">
                Browse By Module
              </p>
              <ul className="flex flex-col gap-0.5">
                {KNOWLEDGE_MODULE_NAV.map((module) => {
                  const open = openModules[module.id] ?? false
                  const containsActive = module.articles.some(
                    (item) => item.id === article.id,
                  )
                  return (
                    <li key={module.id}>
                      <button
                        type="button"
                        onClick={() => toggleModule(module.id)}
                        className={cn(
                          'flex w-full items-center justify-between gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-[#F7F8FB]',
                          containsActive
                            ? 'font-semibold text-[#2D2061]'
                            : 'font-medium text-[#4A4A60]',
                        )}
                      >
                        <span className="truncate">{module.title}</span>
                        <ChevronDown
                          className={cn(
                            'size-3.5 shrink-0 text-[#8B8B9E] transition-transform',
                            open && 'rotate-180',
                          )}
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </button>
                      {open ? (
                        <ul className="mb-1 ml-2 border-l border-[#E4E1EE] pl-1.5">
                          {module.articles.map((item) => {
                            const active = item.id === article.id
                            return (
                              <li key={item.id}>
                                <Link
                                  to={`/knowledgebase/${item.id}`}
                                  className={cn(
                                    'block rounded-md px-2.5 py-1.5 text-xs leading-snug transition-colors',
                                    active
                                      ? 'bg-[#2D2061] font-semibold text-white'
                                      : 'text-[#5A5A72] hover:bg-[#F7F8FB] hover:text-[#2D2061]',
                                  )}
                                >
                                  {item.title}
                                </Link>
                              </li>
                            )
                          })}
                        </ul>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>

          <article className="min-w-0 bg-white px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
            <header className="mb-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <nav
                    aria-label="Breadcrumb"
                    className="flex flex-wrap items-center gap-1.5 text-xs text-[#8B8B9E]"
                  >
                    <Link
                      to="/knowledgebase"
                      className="hover:text-[#2D2061]"
                    >
                      Knowledge Base
                    </Link>
                    <span aria-hidden="true">›</span>
                    <span className="font-medium text-[#5A5A72]">
                      {moduleForArticle?.title ?? article.module}
                    </span>
                  </nav>
                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#1A1A2E] sm:text-[1.875rem]">
                    {article.title}
                  </h1>
                  <p className="mt-2 text-xs text-[#8B8B9E]">
                    Last updated on {article.updatedAt}
                    <span className="mx-2 text-[#D5D2E2]" aria-hidden="true">
                      ·
                    </span>
                    {article.readMins} min read
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="!h-9 !rounded-lg !border-[#2D2061] !px-3.5 !text-xs !font-semibold !text-[#2D2061] hover:!bg-[#F0EEF8]"
                  onClick={() =>
                    toast.success('Support request noted.', {
                      title: 'Contact Support',
                    })
                  }
                >
                  Contact Support
                </Button>
              </div>
            </header>

            <div className="mb-6 rounded-[8px] border border-[#E4E1EE] bg-[#F8F9FB] px-4 py-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-[#8B8B9E]">
                Contents of this article
              </p>
              <ul className="flex flex-col gap-1">
                {article.toc.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="text-left text-sm font-medium text-[#2D2061] hover:underline"
                    >
                      {index + 1}. {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-5">
              {article.blocks.map((block, index) => (
                <ArticleBlock key={`${article.id}-${index}`} block={block} />
              ))}
            </div>

            <section className="mt-10 border-t border-[#ECEAF3] pt-6">
              <p className="text-sm font-semibold text-[#1A1A2E]">
                Was this article helpful?
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <HelpfulVoteButton
                  label="Yes"
                  icon={ThumbsUp}
                  selected={helpful === 'yes'}
                  onSelect={() => {
                    setHelpful('yes')
                    toast.success('Thanks for your feedback.', {
                      title: 'Knowledgebase',
                    })
                  }}
                />
                <HelpfulVoteButton
                  label="No"
                  icon={ThumbsDown}
                  selected={helpful === 'no'}
                  onSelect={() => {
                    setHelpful('no')
                    toast.warning('We will improve this article.', {
                      title: 'Knowledgebase',
                    })
                  }}
                />
              </div>
            </section>

            {relatedArticles.length > 0 ? (
              <section className="mt-8 border-t border-[#ECEAF3] pt-6">
                <h2 className="text-sm font-bold text-[#1A1A2E]">
                  Related articles
                </h2>
                <ul className="mt-3 flex flex-col gap-2">
                  {relatedArticles.map((item) => (
                    <li key={item.id}>
                      <Link
                        to={`/knowledgebase/${item.id}`}
                        className="text-sm font-medium text-[#2D2061] hover:underline"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>

          <aside className="border-t border-[#ECEAF3] bg-white lg:border-l lg:border-t-0">
            <div className="sticky top-0 p-4 sm:p-5">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8B8B9E]">
                On this page
              </p>
              <ul className="flex flex-col gap-0.5">
                {article.toc.map((item) => {
                  const active = item.id === activeToc
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className={cn(
                          'w-full rounded-md px-2 py-1.5 text-left text-xs leading-snug transition-colors',
                          active
                            ? 'border-l-2 border-[#2D2061] bg-[#F0EEF8] font-semibold text-[#2D2061]'
                            : 'border-l-2 border-transparent text-[#5A5A72] hover:bg-[#F7F8FB] hover:text-[#2D2061]',
                        )}
                      >
                        {item.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </PageContainer>
  )
}

type HelpfulVoteButtonProps = {
  label: string
  icon: LucideIcon
  selected: boolean
  onSelect: () => void
}

function HelpfulVoteButton({
  label,
  icon: Icon,
  selected,
  onSelect,
}: HelpfulVoteButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors',
        selected
          ? 'border-[#2D2061] bg-[#2D2061] text-white'
          : 'border-[#D5D2E2] bg-white text-[#2D2061] hover:border-[#2D2061] hover:bg-[#F7F8FB]',
      )}
    >
      <Icon className="size-3.5" strokeWidth={2} aria-hidden="true" />
      {label}
    </button>
  )
}

type ArticleBlockProps = {
  block: KnowledgeArticleBlock
}

function ArticleBlock({ block }: ArticleBlockProps) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-sm leading-relaxed text-[#4A4A60]">{block.text}</p>
      )
    case 'heading':
      return (
        <h2
          id={block.id}
          className="scroll-mt-6 pt-2 text-lg font-bold text-[#1A1A2E]"
        >
          {block.text}
        </h2>
      )
    case 'ordered-list':
      return (
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#4A4A60]">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      )
    case 'unordered-list':
      return (
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#4A4A60]">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    case 'callout':
      return (
        <div
          role="note"
          className={cn(
            'rounded-[8px] border-l-4 px-4 py-3 text-sm leading-relaxed',
            calloutToneClass(block.tone),
          )}
        >
          <p className="font-bold">{block.title}</p>
          <p className="mt-1">{block.text}</p>
        </div>
      )
    case 'table':
      return (
        <div className="overflow-x-auto rounded-[8px] border border-[#E4E1EE]">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-[#F0EEF8]">
              <tr>
                {block.headers.map((header) => (
                  <th
                    key={header}
                    className="border-b border-[#E4E1EE] px-3 py-2.5 font-semibold text-[#2D2061]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, rowIndex) => {
                const rowKey = row.join('-')
                return (
                  <tr
                    key={rowKey}
                    className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-[#F8F9FB]'}
                  >
                    {row.map((cell) => (
                      <td
                        key={`${rowKey}-${cell}`}
                        className="border-b border-[#EEEDF3] px-3 py-2.5 text-[#4A4A60]"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
    case 'figure':
      return (
        <figure className="overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-[#F8F9FB]">
          <div className="flex min-h-[11rem] items-center justify-center border-b border-[#E4E1EE] bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F1FA_100%)] px-4 py-8">
            <div className="w-full max-w-lg rounded-lg border border-[#E4E1EE] bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="size-8 rounded-full bg-[#E8E6F0]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-2.5 w-1/3 rounded bg-[#E8E6F0]" />
                  <div className="h-2 w-1/2 rounded bg-[#F0EEF8]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-8 rounded bg-[#F0EEF8]" />
                <div className="h-8 rounded bg-[#F7F8FB]" />
                <div className="h-8 rounded bg-[#F7F8FB]" />
              </div>
              <p className="mt-3 text-center text-[11px] font-semibold text-[#8B8B9E]">
                {block.label}
              </p>
            </div>
          </div>
          <figcaption className="px-4 py-2.5 text-xs leading-relaxed text-[#6B6B80]">
            {block.caption}
          </figcaption>
        </figure>
      )
    default: {
      const _exhaustive: never = block
      return _exhaustive
    }
  }
}

function buildOpenModules(articleId: string): Record<string, boolean> {
  return Object.fromEntries(
    KNOWLEDGE_MODULE_NAV.map((module) => [
      module.id,
      module.articles.some((item) => item.id === articleId),
    ]),
  )
}

function getKnowledgeScrollRoot(): HTMLElement | null {
  return document.querySelector(SCROLL_ROOT_SELECTOR)
}

function calloutToneClass(tone: 'info' | 'important'): string {
  switch (tone) {
    case 'important':
      return 'border-[#E11D48] bg-[#FFF1F2] text-[#9F1239]'
    case 'info':
      return 'border-[#7C6BB5] bg-[#F3F0FA] text-[#3D2F6B]'
    default: {
      const _exhaustive: never = tone
      return _exhaustive
    }
  }
}
