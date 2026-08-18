import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn'
import {
  SETTINGS_NAV_GROUPS,
  getSettingsSectionPath,
  type SettingsSectionId,
} from './settingsNavConfig'

export type SettingsNavProps = {
  activeId?: SettingsSectionId
  className?: string
}

/**
 * Settings secondary sidebar — grouped cards linking to each settings section.
 * Second Settings Hub item: Company & Branding → `/settings/company-branding`.
 */
export function SettingsNav({ activeId, className }: SettingsNavProps) {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label="Settings sections"
      className={cn('flex w-full flex-col gap-6', className)}
    >
      {SETTINGS_NAV_GROUPS.map((group) => (
        <div key={group.id}>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9999A8]">
            {group.title}
          </p>

          <ul className="overflow-hidden rounded-lg border border-[#E0DDEA] bg-white">
            {group.items.map((item, index) => {
              const path = getSettingsSectionPath(item.id)
              const isFirst = index === 0
              const isLast = index === group.items.length - 1
              const isActive =
                activeId === item.id ||
                pathname === path ||
                pathname.endsWith(`/${item.id}`)

              return (
                <li
                  key={item.id}
                  className={cn(!isLast && 'border-b border-[#E8E6F0]')}
                >
                  <NavLink
                    to={path}
                    end
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'flex w-full items-center px-3.5 py-3 text-sm transition-colors',
                      isActive
                        ? 'bg-[#2D2061] font-semibold text-white'
                        : 'bg-white font-medium text-[#333340] hover:bg-[#F7F6FA]',
                      isFirst && 'rounded-t-lg',
                      isLast && 'rounded-b-lg',
                    )}
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
