import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn'
import {
  SETTINGS_NAV_GROUPS,
  getSettingsSectionPath,
  type SettingsNavGroup,
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
 * Supports route links and in-page hash bookmark links (`/path#section-id`).
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
              const path = resolvePath(item.id)
              const hashTarget = path.includes('#')
                ? path.slice(path.indexOf('#'))
                : ''
              const isFirst = index === 0
              const isLast = index === group.items.length - 1
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
