import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Info,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  copyRolePermissions,
  createDefaultRoleMatrix,
  DEFAULT_ROLES,
  PERMISSION_CATEGORIES,
  type PermissionCategory,
  type PlatformRole,
  type RolePermissionMatrix,
} from '../../data/rolePermissions'
import { Button, ThreeDotsMenu, Tooltip, toast } from '../ui'
import { SettingsPanel } from './SettingsPanel'

const PERM_COL_WIDTH = 17.5 // rem
const ROLE_COL_WIDTH = 7.75 // rem

/**
 * Settings → Role Management — collapsible permission matrix by role.
 */
export function RoleManagementPanel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const roleNameInputRefs = useRef<Record<string, HTMLInputElement | null>>({})
  const roleHeaderRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const [roles, setRoles] = useState<PlatformRole[]>(() =>
    DEFAULT_ROLES.map((role) => ({ ...role })),
  )
  const [matrix, setMatrix] = useState<RolePermissionMatrix>(() =>
    createDefaultRoleMatrix(),
  )
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(PERMISSION_CATEGORIES.map((c) => [c.id, true])),
  )
  const [pendingFocusRoleId, setPendingFocusRoleId] = useState<string | null>(
    null,
  )
  const [highlightRoleId, setHighlightRoleId] = useState<string | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return PERMISSION_CATEGORIES

    return PERMISSION_CATEGORIES.map((category) => {
      const categoryMatch = category.label.toLowerCase().includes(query)
      const permissions = category.permissions.filter(
        (permission) =>
          categoryMatch ||
          permission.label.toLowerCase().includes(query) ||
          permission.description.toLowerCase().includes(query),
      )
      return { ...category, permissions }
    }).filter((category) => category.permissions.length > 0)
  }, [search])

  function updateScrollControls() {
    const el = scrollRef.current
    if (!el) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(maxScroll > 2 && el.scrollLeft < maxScroll - 2)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    updateScrollControls()
    el.addEventListener('scroll', updateScrollControls, { passive: true })
    const observer = new ResizeObserver(() => updateScrollControls())
    observer.observe(el)
    window.addEventListener('resize', updateScrollControls)

    return () => {
      el.removeEventListener('scroll', updateScrollControls)
      observer.disconnect()
      window.removeEventListener('resize', updateScrollControls)
    }
  }, [roles.length, filteredCategories])

  // After adding / duplicating a role: scroll into view and focus name field.
  useLayoutEffect(() => {
    if (!pendingFocusRoleId) return

    const roleId = pendingFocusRoleId
    const scroller = scrollRef.current
    const header = roleHeaderRefs.current[roleId]
    const input = roleNameInputRefs.current[roleId]

    if (scroller && header) {
      const scrollerRect = scroller.getBoundingClientRect()
      const headerRect = header.getBoundingClientRect()
      const stickyPlusWidth = 44
      const stickyPermApprox = PERM_COL_WIDTH * 16
      const visibleLeft = scrollerRect.left + stickyPermApprox
      const visibleRight = scrollerRect.right - stickyPlusWidth

      if (headerRect.right > visibleRight || headerRect.left < visibleLeft) {
        const nextLeft =
          scroller.scrollLeft +
          (headerRect.left - visibleLeft) -
          (visibleRight - visibleLeft) / 2 +
          headerRect.width / 2
        scroller.scrollTo({
          left: Math.max(0, nextLeft),
          behavior: 'smooth',
        })
      }
    }

    const focusTimer = window.setTimeout(() => {
      input?.focus()
      input?.select()
      setHighlightRoleId(roleId)
      updateScrollControls()
    }, 180)

    const clearHighlight = window.setTimeout(() => {
      setHighlightRoleId((current) => (current === roleId ? null : current))
    }, 2600)

    setPendingFocusRoleId(null)

    return () => {
      window.clearTimeout(focusTimer)
      window.clearTimeout(clearHighlight)
    }
  }, [pendingFocusRoleId])

  function roleColumnStepPx() {
    const rootFont = Number.parseFloat(
      getComputedStyle(document.documentElement).fontSize || '16',
    )
    return ROLE_COL_WIDTH * rootFont * 2
  }

  function scrollRoles(direction: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const delta = roleColumnStepPx()
    el.scrollBy({
      left: direction === 'left' ? -delta : delta,
      behavior: 'smooth',
    })
  }

  function isGranted(permissionId: string, roleId: string) {
    return Boolean(matrix[permissionId]?.[roleId])
  }

  function setGranted(permissionId: string, roleId: string, value: boolean) {
    setMatrix((current) => ({
      ...current,
      [permissionId]: {
        ...current[permissionId],
        [roleId]: value,
      },
    }))
  }

  function getCategoryState(
    category: PermissionCategory,
    roleId: string,
  ): { checked: boolean; indeterminate: boolean } {
    const ids = category.permissions.map((p) => p.id)
    if (ids.length === 0) return { checked: false, indeterminate: false }
    const grantedCount = ids.filter((id) => isGranted(id, roleId)).length
    return {
      checked: grantedCount === ids.length,
      indeterminate: grantedCount > 0 && grantedCount < ids.length,
    }
  }

  function setCategoryGranted(
    category: PermissionCategory,
    roleId: string,
    value: boolean,
  ) {
    setMatrix((current) => {
      const next = { ...current }
      for (const permission of category.permissions) {
        next[permission.id] = {
          ...next[permission.id],
          [roleId]: value,
        }
      }
      return next
    })
  }

  function toggleExpanded(categoryId: string) {
    setExpanded((current) => ({
      ...current,
      [categoryId]: !current[categoryId],
    }))
  }

  function handleAddRole() {
    const id = `role-new-${Date.now()}`
    setRoles((current) => [
      ...current,
      { id, name: '', nameEditable: true },
    ])
    setMatrix((current) => {
      const next: RolePermissionMatrix = {}
      for (const [permissionId, roleMap] of Object.entries(current)) {
        next[permissionId] = { ...roleMap, [id]: false }
      }
      return next
    })
    setPendingFocusRoleId(id)
    toast.success('New role column added. Enter a name and set permissions.', {
      title: 'Role added',
    })
  }

  function handleRenameRole(roleId: string, name: string) {
    setRoles((current) =>
      current.map((role) =>
        role.id === roleId ? { ...role, name, nameEditable: true } : role,
      ),
    )
  }

  function handleDuplicateRole(role: PlatformRole) {
    const id = `role-dup-${Date.now()}`
    const baseName = role.name.trim() || 'Untitled Role'
    const nextRole: PlatformRole = {
      id,
      name: `${baseName} (Copy)`,
      nameEditable: true,
    }
    setRoles((current) => {
      const index = current.findIndex((entry) => entry.id === role.id)
      if (index < 0) return [...current, nextRole]
      const copy = [...current]
      copy.splice(index + 1, 0, nextRole)
      return copy
    })
    setMatrix((current) => copyRolePermissions(current, role.id, id))
    setPendingFocusRoleId(id)
    toast.success(`Duplicated “${baseName}”.`, { title: 'Role duplicated' })
  }

  function handleDeleteRole(role: PlatformRole) {
    if (role.locked) {
      toast.error('System roles cannot be deleted.', {
        title: 'Delete blocked',
      })
      return
    }
    setRoles((current) => current.filter((entry) => entry.id !== role.id))
    setMatrix((current) => {
      const next: RolePermissionMatrix = {}
      for (const [permissionId, roleMap] of Object.entries(current)) {
        const { [role.id]: _removed, ...rest } = roleMap
        next[permissionId] = rest
      }
      return next
    })
    delete roleNameInputRefs.current[role.id]
    delete roleHeaderRefs.current[role.id]
    toast.success(`Deleted “${role.name.trim() || 'Untitled Role'}”.`, {
      title: 'Role deleted',
    })
  }

  function handleSave() {
    const unnamed = roles.filter((role) => !role.name.trim())
    if (unnamed.length > 0) {
      const firstMissing = unnamed[0]
      setPendingFocusRoleId(firstMissing.id)
      toast.error('Please name every role column before saving.', {
        title: 'Missing role name',
      })
      return
    }
    toast.success('Role permissions saved successfully.', {
      title: 'Success',
      description: 'Your role matrix is ready for use.',
    })
  }

  return (
    <SettingsPanel
      title="Role Permissions"
      description="Assign granular permissions across roles. Expand categories, toggle access, and manage custom roles."
      className="relative pb-20"
    >
      {/* Horizontal scroll helpers */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-[#8B8B9E]">
          Scroll roles horizontally when more columns are outside the view.
        </p>
        <div className="inline-flex items-center gap-1 rounded-md border border-[#E4E1EE] bg-white p-0.5 shadow-[0_1px_2px_rgba(45,32,97,0.04)]">
          <button
            type="button"
            onClick={() => scrollRoles('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll roles left"
            title="Scroll left"
            className={cn(
              'inline-flex size-8 items-center justify-center rounded text-[#2D2061] transition-colors',
              canScrollLeft
                ? 'hover:bg-[#F2F1F6]'
                : 'cursor-not-allowed text-[#C4C1D4]',
            )}
          >
            <ChevronLeft className="size-4" strokeWidth={2.25} aria-hidden="true" />
          </button>
          <span className="h-4 w-px bg-[#E4E1EE]" aria-hidden="true" />
          <button
            type="button"
            onClick={() => scrollRoles('right')}
            disabled={!canScrollRight}
            aria-label="Scroll roles right"
            title="Scroll right"
            className={cn(
              'inline-flex size-8 items-center justify-center rounded text-[#2D2061] transition-colors',
              canScrollRight
                ? 'hover:bg-[#F2F1F6]'
                : 'cursor-not-allowed text-[#C4C1D4]',
            )}
          >
            <ChevronRight className="size-4" strokeWidth={2.25} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-[#E4E1EE] bg-white">
        {/* Floating edge scroll chips (desktop-friendly affordance) */}
        {canScrollLeft ? (
          <button
            type="button"
            onClick={() => scrollRoles('left')}
            aria-label="Scroll roles left"
            className="absolute left-[calc(var(--perm-col,17.5rem)+0.35rem)] top-1/2 z-50 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#E4E1EE] bg-white size-9 text-[#2D2061] shadow-[0_4px_14px_rgba(45,32,97,0.14)] transition-colors hover:bg-[#F7F6FA] md:inline-flex"
          >
            <ChevronLeft className="size-4" strokeWidth={2.25} aria-hidden="true" />
          </button>
        ) : null}
        {canScrollRight ? (
          <button
            type="button"
            onClick={() => scrollRoles('right')}
            aria-label="Scroll roles right"
            className="absolute right-12 top-1/2 z-50 hidden -translate-y-1/2 items-center justify-center rounded-full border border-[#E4E1EE] bg-white size-9 text-[#2D2061] shadow-[0_4px_14px_rgba(45,32,97,0.14)] transition-colors hover:bg-[#F7F6FA] md:inline-flex"
          >
            <ChevronRight className="size-4" strokeWidth={2.25} aria-hidden="true" />
          </button>
        ) : null}

        <div
          ref={scrollRef}
          className={cn(
            'max-h-[min(70vh,46rem)] overflow-x-auto overflow-y-auto scroll-smooth',
            /* Hide horizontal scrollbar; vertical bar stays for long permission lists */
            '[-ms-overflow-style:auto] [scrollbar-width:thin]',
            '[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar]:h-0',
            '[&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C8C5D6]',
          )}
        >
          <div
            className="min-w-max"
            style={
              {
                '--perm-col': `${PERM_COL_WIDTH}rem`,
                '--role-col': `${ROLE_COL_WIDTH}rem`,
              } as CSSProperties
            }
          >
            {/* Sticky header row */}
            <div className="sticky top-0 z-30 flex h-11 border-b border-[#E4E1EE] bg-white">
              <div
                className="sticky left-0 z-40 flex h-11 shrink-0 items-center border-r border-[#E4E1EE] bg-white px-2.5"
                style={{ width: 'var(--perm-col)' }}
              >
                <div className="relative w-full min-w-0">
                  <Search
                    className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#8B8B9E]"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search permissions..."
                    className="h-8 w-full rounded-md border border-[#ddd9e8] bg-white py-1 pl-8 pr-2.5 text-xs text-[#2D2061] outline-none placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10"
                    aria-label="Search permissions"
                  />
                </div>
              </div>

              {roles.map((role) => (
                <div
                  key={role.id}
                  ref={(el) => {
                    roleHeaderRefs.current[role.id] = el
                  }}
                  className={cn(
                    'relative flex h-11 shrink-0 items-center gap-0.5 border-r border-[#E4E1EE] bg-[#2D2061] px-1 transition-shadow',
                    highlightRoleId === role.id &&
                      'ring-2 ring-inset ring-[#8B7FE0]',
                  )}
                  style={{ width: 'var(--role-col)' }}
                >
                  {role.nameEditable ? (
                    <input
                      ref={(el) => {
                        roleNameInputRefs.current[role.id] = el
                      }}
                      type="text"
                      value={role.name}
                      placeholder="Role name"
                      onChange={(e) =>
                        handleRenameRole(role.id, e.target.value)
                      }
                      className={cn(
                        'h-7 min-w-0 flex-1 rounded bg-white/10 px-1 py-0.5 text-center text-[10px] font-semibold leading-tight text-white outline-none placeholder:text-white/55 focus:bg-white/15 focus:ring-1 focus:ring-white/50',
                        !role.name.trim() && 'ring-1 ring-white/40',
                      )}
                      aria-label="Role name"
                    />
                  ) : (
                    <p className="line-clamp-2 min-w-0 flex-1 px-0.5 text-center text-[10px] font-semibold leading-snug text-white">
                      {role.name}
                    </p>
                  )}
                  <div className="flex shrink-0 items-center self-center">
                    <ThreeDotsMenu
                      triggerLabel={`Actions for ${role.name || 'new role'}`}
                      side="left"
                      align="center"
                      triggerClassName="!size-6 text-white/85 hover:bg-white/10 hover:text-white"
                      items={[
                        {
                          id: 'duplicate',
                          label: 'Duplicate',
                          icon: <Copy className="size-3.5" />,
                          onSelect: () => handleDuplicateRole(role),
                        },
                        {
                          id: 'delete',
                          label: 'Delete Role',
                          icon: <Trash2 className="size-3.5" />,
                          destructive: true,
                          disabled: role.locked,
                          onSelect: () => handleDeleteRole(role),
                        },
                      ]}
                    />
                  </div>
                </div>
              ))}

              <div className="sticky right-0 z-40 flex h-11 w-11 shrink-0 items-center justify-center border-l border-[#E4E1EE] bg-white">
                <button
                  type="button"
                  onClick={handleAddRole}
                  aria-label="Add role"
                  title="Add role"
                  className="inline-flex size-7 items-center justify-center rounded-md bg-[#2D2061] text-white shadow-sm transition-colors hover:bg-[#241a52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/30"
                >
                  <Plus className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Body */}
            {filteredCategories.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-[#8B8B9E]">
                No permissions match your search.
              </div>
            ) : (
              filteredCategories.map((category) => {
                const isOpen = expanded[category.id] !== false
                return (
                  <div key={category.id}>
                    <div className="flex border-b border-[#E8E6F0] bg-[#F5F5F8]">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(category.id)}
                        aria-expanded={isOpen}
                        className="sticky left-0 z-20 flex shrink-0 items-center gap-2 border-r border-[#E4E1EE] bg-[#F5F5F8] px-3 py-2.5 text-left hover:bg-[#EEEFF4]"
                        style={{ width: 'var(--perm-col)' }}
                      >
                        <span className="min-w-0 flex-1 text-[11px] font-bold uppercase tracking-[0.04em] text-[#2D2061]">
                          {category.label}{' '}
                          <span className="font-semibold text-[#6B6B80]">
                            ({category.permissions.length})
                          </span>
                        </span>
                        <ChevronDown
                          className={cn(
                            'size-4 shrink-0 text-[#6B6B80] transition-transform duration-200',
                            isOpen && 'rotate-180',
                          )}
                          aria-hidden="true"
                        />
                      </button>

                      {roles.map((role) => {
                        const state = getCategoryState(category, role.id)
                        return (
                          <div
                            key={role.id}
                            className={cn(
                              'flex shrink-0 items-center justify-center border-r border-[#E8E6F0] bg-[#F5F5F8] px-1',
                              highlightRoleId === role.id && 'bg-[#EEEBF8]',
                            )}
                            style={{ width: 'var(--role-col)' }}
                          >
                            <MatrixCheckbox
                              checked={state.checked}
                              indeterminate={state.indeterminate}
                              aria-label={`${category.label} for ${role.name || 'role'}`}
                              onChange={(next) =>
                                setCategoryGranted(category, role.id, next)
                              }
                            />
                          </div>
                        )
                      })}

                      <div className="sticky right-0 z-20 w-11 shrink-0 border-l border-[#E8E6F0] bg-[#F5F5F8]" />
                    </div>

                    {isOpen
                      ? category.permissions.map((permission) => (
                          <div
                            key={permission.id}
                            className="flex border-b border-[#F0EEF5] bg-white hover:bg-[#FAFAFC]"
                          >
                            <div
                              className="sticky left-0 z-10 flex shrink-0 items-center gap-1.5 border-r border-[#E4E1EE] bg-white px-3 py-2.5 pl-8"
                              style={{ width: 'var(--perm-col)' }}
                            >
                              <span className="min-w-0 flex-1 truncate text-[13px] text-[#2A2740]">
                                {permission.label}
                              </span>
                              <Tooltip
                                content={permission.description}
                                side="top"
                                align="start"
                                maxWidth={280}
                              >
                                <button
                                  type="button"
                                  className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-[#5B8DEF] transition-colors hover:bg-[#EAF1FF] hover:text-[#2B6DE5]"
                                  aria-label={`About ${permission.label}`}
                                >
                                  <Info
                                    className="size-3.5"
                                    strokeWidth={2.25}
                                    aria-hidden="true"
                                  />
                                </button>
                              </Tooltip>
                            </div>

                            {roles.map((role) => (
                              <div
                                key={role.id}
                                className={cn(
                                  'flex shrink-0 items-center justify-center border-r border-[#F0EEF5] px-1 py-2',
                                  highlightRoleId === role.id && 'bg-[#F7F5FC]',
                                )}
                                style={{ width: 'var(--role-col)' }}
                              >
                                <MatrixCheckbox
                                  checked={isGranted(permission.id, role.id)}
                                  aria-label={`${permission.label} for ${role.name || 'role'}`}
                                  onChange={(next) =>
                                    setGranted(permission.id, role.id, next)
                                  }
                                />
                              </div>
                            ))}

                            <div className="sticky right-0 z-10 w-11 shrink-0 border-l border-[#F0EEF5] bg-white" />
                          </div>
                        ))
                      : null}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Sticky save CTA */}
      <div className="pointer-events-none sticky bottom-0 z-40 -mx-5 -mb-5 mt-4 border-t border-[#ECEAF3] bg-gradient-to-t from-white via-white to-white/90 px-5 py-4 sm:-mx-6 sm:-mb-6 sm:px-6">
        <div className="pointer-events-auto flex justify-end">
          <Button
            type="button"
            onClick={handleSave}
            className="!h-10 !rounded-md bg-[#2D2061] px-6 text-sm font-semibold text-white hover:bg-[#241a52]"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </SettingsPanel>
  )
}

function MatrixCheckbox({
  checked,
  indeterminate = false,
  onChange,
  'aria-label': ariaLabel,
}: {
  checked: boolean
  indeterminate?: boolean
  onChange: (next: boolean) => void
  'aria-label': string
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      ref={(el) => {
        if (el) el.indeterminate = indeterminate && !checked
      }}
      onChange={(e) => onChange(e.target.checked)}
      aria-label={ariaLabel}
      className={cn(
        'size-4 cursor-pointer rounded border-[#C8C5D6] accent-[#2D2061]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2D2061]/25',
      )}
    />
  )
}
