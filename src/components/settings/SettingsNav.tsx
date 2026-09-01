import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  DEFAULT_TALENT_CRM_SECTION,
  SETTINGS_NAV_GROUPS,
  getSettingsSectionPath,
  type SettingsNavGroup,
  type SettingsNavItem,
  type SettingsSectionId,
} from './settingsNavConfig'

export type SettingsNavProps = {
  activeId?: string
  className?: string
  /** Defaults to Settings hub groups when omitted. */
  groups?: SettingsNavGroup[]
  ariaLabel?: string
  /** Path builder for each item. Defaults to settings section paths. */
  getItemPath?: (id: string) => string
}

/**
 * Secondary sidebar — grouped cards (Settings, Reports, and similar screens).
 * Supports nested items (e.g. Talent CRM sub-modules), route links, and hash bookmarks.
 */
export function SettingsNav({
  activeId,
  className,
  groups = SETTINGS_NAV_GROUPS,
  ariaLabel = 'Settings sections',
  getItemPath,
}: SettingsNavProps) {
  const { pathname, hash } = useLocation()
  const resolvePath =
    getItemPath ??
    ((id: string) => getSettingsSectionPath(id as SettingsSectionId))

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    initialOpenGroups(groups, activeId, pathname),
  )

  useEffect(() => {
    setOpenGroups((current) => {
      const next = { ...current }
      let changed = false
      for (const group of groups) {
        for (const item of group.items) {
          if (!item.children?.length) continue
          const childActive = item.children.some(
            (child) =>
              activeId === child.id ||
              pathname.endsWith(`/${child.id}`) ||
              pathname.includes(`/settings/${child.id}`),
          )
          if (childActive && !next[item.id]) {
            next[item.id] = true
            changed = true
          } else if (!childActive && next[item.id]) {
            next[item.id] = false
            changed = true
          }
        }
      }
      return changed ? next : current
    })
  }, [activeId, groups, pathname])

  return (
    <nav
      aria-label={ariaLabel}
      className={cn('flex w-full flex-col gap-6', className)}
    >
      {groups.map((group) => (
        <div key={group.id}>
          {group.title.trim() ? (
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9999A8]">
              {group.title}
            </p>
          ) : null}

          <ul className="overflow-hidden rounded-lg border border-[#E0DDEA] bg-white">
            {group.items.map((item, index) => {
              const isFirst = index === 0
              const isLast = index === group.items.length - 1
              const hasChildren = Boolean(item.children?.length)

              if (hasChildren) {
                return (
                  <NestedNavItem
                    key={`${group.id}-${item.id}`}
                    item={item}
                    isFirst={isFirst}
                    isLast={isLast}
                    activeId={activeId}
                    pathname={pathname}
                    resolvePath={resolvePath}
                    isOpen={Boolean(openGroups[item.id])}
                    onToggle={() =>
                      setOpenGroups((current) => ({
                        ...current,
                        [item.id]: !current[item.id],
                      }))
                    }
                  />
                )
              }

              const path = resolvePath(item.id)
              const hashTarget = path.includes('#')
                ? path.slice(path.indexOf('#'))
                : ''
              const isActive =
                activeId != null
                  ? activeId === item.id
                  : hashTarget
                    ? hash === hashTarget
                    : pathname === path || pathname.endsWith(`/${item.id}`)

              const itemClassName = cn(
                'flex w-full items-center px-3.5 py-3 text-sm transition-colors',
                isActive
                  ? 'bg-[#2D2061] font-semibold text-white'
                  : 'bg-white font-medium text-[#333340] hover:bg-[#F7F6FA]',
                isFirst && 'rounded-t-lg',
                isLast && 'rounded-b-lg',
              )

              return (
                <li
                  key={`${group.id}-${item.id}`}
                  className={cn(!isLast && 'border-b border-[#E8E6F0]')}
                >
                  <NavLink
                    to={path}
                    end={!hashTarget}
                    aria-current={isActive ? 'page' : undefined}
                    className={itemClassName}
                  >
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function NestedNavItem({
  item,
  isFirst,
  isLast,
  activeId,
  pathname,
  resolvePath,
  isOpen,
  onToggle,
}: {
  item: SettingsNavItem
  isFirst: boolean
  isLast: boolean
  activeId?: string
  pathname: string
  resolvePath: (id: string) => string
  isOpen: boolean
  onToggle: () => void
}) {
  const navigate = useNavigate()
  const childActive = item.children?.some(
    (child) =>
      activeId === child.id ||
      pathname.endsWith(`/${child.id}`) ||
      pathname.includes(`/settings/${child.id}`),
  )
  const groupSelected = Boolean(childActive)
  const defaultChildId =
    item.id === 'talent-crm'
      ? DEFAULT_TALENT_CRM_SECTION
      : item.children?.[0]?.id

  function handleParentClick() {
    if (!defaultChildId) {
      onToggle()
      return
    }

    const alreadyOnDefault =
      activeId === defaultChildId ||
      pathname.endsWith(`/${defaultChildId}`) ||
      pathname.includes(`/settings/${defaultChildId}`)

    if (alreadyOnDefault) {
      onToggle()
      return
    }

    if (!isOpen) onToggle()
    navigate(resolvePath(defaultChildId))
  }

  return (
    <li className={cn(!isLast && 'border-b border-[#E8E6F0]')}>
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={handleParentClick}
        className={cn(
          'flex w-full items-center gap-2 px-3.5 py-3 text-left text-sm transition-colors',
          groupSelected
            ? 'bg-[#2D2061] font-semibold text-white'
            : 'bg-white font-medium text-[#333340] hover:bg-[#F7F6FA]',
          isFirst && !isOpen && 'rounded-t-lg',
          isFirst && isOpen && 'rounded-t-lg',
          isLast && !isOpen && 'rounded-b-lg',
        )}
      >
        <span className="min-w-0 flex-1 truncate">{item.label}</span>
        <ChevronDown
          className={cn(
            'size-4 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      <div
        className={cn(
          'grid transition-all duration-200 ease-out',
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="bg-[#F7F6FA] pb-1.5 pt-0.5">
            {item.children?.map((child) => {
              const path = resolvePath(child.id)
              const isActive =
                activeId != null
                  ? activeId === child.id
                  : pathname === path || pathname.endsWith(`/${child.id}`)

              return (
                <li key={child.id}>
                  <NavLink
                    to={path}
                    end
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex w-full items-center px-3.5 py-2.5 pl-7 text-[13px] transition-colors',
                      isActive
                        ? 'font-semibold text-[#2D2061]'
                        : 'font-medium text-[#5C5878] hover:bg-white hover:text-[#2D2061]',
                    )}
                  >
                    {child.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </li>
  )
}

function initialOpenGroups(
  groups: SettingsNavGroup[],
  activeId: string | undefined,
  pathname: string,
): Record<string, boolean> {
  const open: Record<string, boolean> = {}
  for (const group of groups) {
    for (const item of group.items) {
      if (!item.children?.length) continue
      const childActive = item.children.some(
        (child) =>
          activeId === child.id ||
          pathname.endsWith(`/${child.id}`) ||
          pathname.includes(`/settings/${child.id}`),
      )
      if (childActive) open[item.id] = true
    }
  }
  return open
}
