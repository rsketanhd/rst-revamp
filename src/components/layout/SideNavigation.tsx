import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileBarChart2,
  LayoutGrid,
  LogOut,
  Search,
  Settings,
  Sparkles,
  SquareUser,
  UserRoundCog,
  Users,
} from 'lucide-react'
import logo from '../../assets/Logo.png'
import { cn } from '../../lib/cn'

export type SideNavigationProps = {
  className?: string
  defaultCollapsed?: boolean
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

type NavItem = {
  id: string
  label: string
  to: string
  icon: ReactNode
  badge?: string
  children?: Array<{ id: string; label: string; to: string }>
}

type NavSection = {
  id: string
  title?: string
  items: NavItem[]
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        to: '/dashboard',
        icon: <LayoutGrid className="size-[1.15rem]" strokeWidth={1.75} />,
      },
    ],
  },
  {
    id: 'recruitment-hub',
    title: 'Recruitment Hub',
    items: [
      {
        id: 'jobs',
        label: 'Jobs',
        to: '/jobs',
        icon: <Briefcase className="size-[1.15rem]" strokeWidth={1.75} />,
      },
      {
        id: 'candidates',
        label: 'Candidates',
        to: '/candidates',
        icon: <Users className="size-[1.15rem]" strokeWidth={1.75} />,
      },
      {
        id: 'candidate-discovery',
        label: 'Candidate Discovery',
        to: '/candidate-discovery',
        icon: <Search className="size-[1.15rem]" strokeWidth={1.75} />,
      },
      {
        id: 'client-management',
        label: 'Client Management',
        to: '/client-management',
        icon: <Building2 className="size-[1.15rem]" strokeWidth={1.75} />,
      },
    ],
  },
  {
    id: 'talent',
    title: 'Talent Engagement / Operations',
    items: [
      {
        id: 'talent-crm',
        label: 'Talent CRM',
        to: '/talent-crm',
        icon: <UserRoundCog className="size-[1.15rem]" strokeWidth={1.75} />,
      },
      {
        id: 'jeeves-ai',
        label: 'Jeeves AI',
        to: '/jeeves-ai',
        icon: <Sparkles className="size-[1.15rem]" strokeWidth={1.75} />,
        badge: 'PRO',
      },
      {
        id: 'e2e-interviews',
        label: 'E2E Interviews',
        to: '/e2e-interviews',
        icon: <SquareUser className="size-[1.15rem]" strokeWidth={1.75} />,
        children: [
          {
            id: 'one-way',
            label: 'One-Way Interviews',
            to: '/e2e-interviews/one-way',
          },
          {
            id: 'two-way',
            label: 'Two-Way Interviews',
            to: '/e2e-interviews/two-way',
          },
          {
            id: 'interview-scheduler',
            label: 'Interview Scheduler & Analytics',
            to: '/e2e-interviews/scheduler',
          },
        ],
      },
    ],
  },
  {
    id: 'admin',
    title: 'Administration / Platform Management',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        to: '/reports',
        icon: <FileBarChart2 className="size-[1.15rem]" strokeWidth={1.75} />,
      },
      {
        id: 'settings',
        label: 'Settings',
        to: '/settings/recruiter-profile',
        icon: <Settings className="size-[1.15rem]" strokeWidth={1.75} />,
      },
    ],
  },
]

export function SideNavigation({
  className,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
}: SideNavigationProps) {
  const [uncontrolledCollapsed, setUncontrolledCollapsed] =
    useState(defaultCollapsed)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})
  const location = useLocation()
  const navigate = useNavigate()

  const collapsed = controlledCollapsed ?? uncontrolledCollapsed

  function setCollapsed(next: boolean) {
    if (controlledCollapsed === undefined) {
      setUncontrolledCollapsed(next)
    }
    onCollapsedChange?.(next)
  }

  useEffect(() => {
    for (const section of NAV_SECTIONS) {
      for (const item of section.items) {
        if (!item.children?.length) continue
        const onChildRoute = item.children.some((child) =>
          location.pathname.startsWith(child.to),
        )
        const onParentRoute =
          location.pathname === item.to ||
          location.pathname.startsWith(`${item.to}/`)

        if (onChildRoute || onParentRoute) {
          setOpenGroups((current) =>
            current[item.id] ? current : { ...current, [item.id]: true },
          )
        }
      }
    }
  }, [location.pathname])

  function handleLogout() {
    sessionStorage.removeItem('rst_auth')
    navigate('/login', { replace: true })
  }

  return (
    <aside
      className={cn(
        'relative flex h-full shrink-0 flex-col border-r border-line bg-[#f0f0f4]',
        'transition-[width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
        collapsed ? 'w-[4.75rem]' : 'w-[17.5rem]',
        className,
      )}
      aria-label="Side navigation"
      data-collapsed={collapsed}
    >
      <div
        className={cn(
          'relative flex h-shell-header shrink-0 items-center overflow-visible border-b border-[#e4e4ea] px-3',
          collapsed ? 'justify-center' : 'px-4',
        )}
      >
        <img
          src={logo}
          alt="Recruitment SMART"
          className={cn(
            'transition-all duration-300',
            collapsed
              ? 'h-9 w-9 object-cover object-left'
              : 'h-9 w-auto max-w-[11.5rem] object-contain object-left',
          )}
        />

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          className={cn(
            'absolute top-1/2 right-0 z-20 flex size-7 -translate-y-1/2 translate-x-1/2',
            'items-center justify-center rounded-full',
            'border border-line bg-surface text-brand-800 shadow-sm',
            'transition-all duration-300 hover:bg-surface-soft',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-800/20',
          )}
        >
          {collapsed ? (
            <ChevronRight className="size-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2.5 py-3">
        {NAV_SECTIONS.map((section, sectionIndex) => (
          <div key={section.id}>
            {sectionIndex > 0 ? (
              collapsed ? (
                <div
                  className="mx-auto my-2.5 h-px w-8 bg-[#d8d8e0]"
                  aria-hidden="true"
                />
              ) : (
                <div className="mt-3" />
              )
            ) : null}

            {section.title && !collapsed ? (
              <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-subtle">
                {section.title}
              </p>
            ) : null}

            <ul
              className={cn(
                'flex flex-col',
                collapsed ? 'items-center gap-1' : 'gap-0.5',
              )}
            >
              {section.items.map((item) => {
                const hasChildren = Boolean(item.children?.length)
                const isGroupOpen = Boolean(openGroups[item.id])
                const childActive = item.children?.some((child) =>
                  location.pathname.startsWith(child.to),
                )
                const parentRouteActive =
                  location.pathname === item.to ||
                  location.pathname.startsWith(`${item.to}/`)
                /** Selected look only when open (clicked) or a child/parent route is active */
                const groupSelected =
                  isGroupOpen || Boolean(childActive) || parentRouteActive

                return (
                  <li
                    key={item.id}
                    className={cn(collapsed && 'flex w-full justify-center')}
                  >
                    {hasChildren ? (
                      collapsed ? (
                        <button
                          type="button"
                          title={item.label}
                          onClick={() => navigate(item.children![0].to)}
                          className={cn(
                            navItemBaseClass(true),
                            groupSelected && navItemActiveClass(true),
                          )}
                        >
                          <span className="inline-flex size-[1.15rem] shrink-0 items-center justify-center">
                            {item.icon}
                          </span>
                        </button>
                      ) : (
                        <div className="overflow-hidden rounded-lg">
                          <button
                            type="button"
                            aria-expanded={isGroupOpen}
                            onClick={() => {
                              setOpenGroups((current) => ({
                                ...current,
                                [item.id]: !current[item.id],
                              }))
                            }}
                            className={cn(
                              'flex w-full min-h-10 items-center gap-2.5 px-2.5 py-2 text-[13px] font-medium transition-colors duration-200',
                              groupSelected
                                ? cn(
                                    'bg-[#2D2061] text-white hover:bg-[#2D2061]',
                                    isGroupOpen
                                      ? 'rounded-t-lg rounded-b-none'
                                      : 'rounded-lg',
                                  )
                                : cn(
                                    'rounded-lg text-[#2D2061]',
                                    'hover:bg-[#2D2061] hover:text-white',
                                  ),
                            )}
                          >
                            <span className="inline-flex size-[1.15rem] shrink-0 items-center justify-center">
                              {item.icon}
                            </span>
                            <span className="min-w-0 flex-1 truncate text-left">
                              {item.label}
                            </span>
                            <ChevronDown
                              className={cn(
                                'size-4 shrink-0 transition-transform duration-300',
                                isGroupOpen && 'rotate-180',
                              )}
                              aria-hidden="true"
                            />
                          </button>

                          <div
                            className={cn(
                              'grid transition-all duration-300 ease-out',
                              isGroupOpen
                                ? 'grid-rows-[1fr] opacity-100'
                                : 'grid-rows-[0fr] opacity-0',
                            )}
                          >
                            <div className="min-h-0 overflow-hidden">
                              <ul className="rounded-b-lg bg-white pb-1.5 pt-0.5">
                                {item.children?.map((child) => (
                                  <li key={child.id}>
                                    <NavLink
                                      to={child.to}
                                      title={child.label}
                                      className={({ isActive }) =>
                                        cn(
                                          'flex min-h-9 items-center truncate py-2 pl-10 pr-3 text-[13px] transition-colors',
                                          isActive
                                            ? 'font-semibold text-[#2D2061]'
                                            : 'font-medium text-[#6B7280] hover:text-[#2D2061]',
                                        )
                                      }
                                    >
                                      <span className="truncate">
                                        {child.label}
                                      </span>
                                    </NavLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )
                    ) : (
                      <NavLink
                        to={item.to}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) => {
                          const settingsActive =
                            item.id === 'settings' &&
                            location.pathname.startsWith('/settings')
                          return cn(
                            navItemBaseClass(collapsed),
                            (isActive || settingsActive) &&
                              navItemActiveClass(collapsed),
                          )
                        }}
                      >
                        <span className="inline-flex size-[1.15rem] shrink-0 items-center justify-center">
                          {item.icon}
                        </span>
                        {!collapsed ? (
                          <>
                            <span className="min-w-0 flex-1 truncate">
                              {item.label}
                            </span>
                            {item.badge ? (
                              <span className="rounded bg-[#C44FA8] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                                {item.badge}
                              </span>
                            ) : null}
                          </>
                        ) : null}
                      </NavLink>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div
        className={cn(
          'flex flex-col gap-2 p-2.5',
          collapsed && 'items-center px-0 pb-3',
        )}
      >
        {collapsed ? (
          <div className="mb-0.5 h-px w-8 bg-[#d8d8e0]" aria-hidden="true" />
        ) : null}
        <button
          type="button"
          title={collapsed ? 'AI Copilot' : undefined}
          className={cn(
            'inline-flex items-center text-sm font-semibold text-white shadow-sm',
            'rounded-lg bg-gradient-to-r from-[#7c5cff] to-[#3b82f6]',
            'transition-all duration-300 hover:brightness-105',
            collapsed
              ? 'size-10 justify-center gap-0 p-0'
              : 'h-11 w-full justify-center gap-2.5 px-3',
          )}
        >
          <span
            className={cn(
              'inline-flex shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold tracking-wide',
              collapsed ? 'size-5' : 'size-6',
            )}
          >
            AI
          </span>
          {!collapsed ? <span className="truncate">AI Copilot</span> : null}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? 'Logout' : undefined}
          className={cn(
            'inline-flex items-center text-sm font-semibold text-white',
            'rounded-lg bg-[#6b5b95] transition-all duration-300 hover:bg-[#5d4f84]',
            collapsed
              ? 'size-10 justify-center gap-0 p-0'
              : 'h-11 w-full justify-center gap-2.5 px-3',
          )}
        >
          <LogOut
            className={cn(
              'shrink-0',
              collapsed ? 'size-5' : 'size-[1.15rem]',
            )}
            strokeWidth={1.75}
            aria-hidden="true"
          />
          {!collapsed ? <span className="truncate">Logout</span> : null}
        </button>
      </div>
    </aside>
  )
}

function navItemBaseClass(collapsed: boolean) {
  return cn(
    'group flex items-center text-[13px] font-medium text-[#2D2061]',
    'transition-colors duration-200',
    'rounded-lg',
    'hover:bg-[#2D2061] hover:text-white',
    collapsed
      ? 'size-10 justify-center gap-0 p-0'
      : 'w-full min-h-10 gap-2.5 px-2.5 py-2',
  )
}

function navItemActiveClass(collapsed: boolean) {
  return cn(
    'bg-[#2D2061] text-white shadow-none',
    'hover:bg-[#2D2061] hover:text-white',
    collapsed && 'size-10',
  )
}
