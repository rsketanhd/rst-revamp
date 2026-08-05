import { cn } from '../../lib/cn'

export type UserRole = 'recruiter' | 'candidate'

export type RoleToggleProps = {
  value: UserRole
  onChange: (role: UserRole) => void
  className?: string
}

const roles: Array<{ id: UserRole; label: string }> = [
  { id: 'recruiter', label: 'Recruiter' },
  { id: 'candidate', label: 'Candidate' },
]

export function RoleToggle({ value, onChange, className }: RoleToggleProps) {
  return (
    <div
      role="tablist"
      aria-label="Sign in as"
      className={cn(
        'inline-flex rounded-pill border border-line bg-surface p-1 shadow-sm',
        className,
      )}
    >
      {roles.map((role) => {
        const active = value === role.id
        return (
          <button
            key={role.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(role.id)}
            className={cn(
              'min-w-[7.5rem] rounded-pill px-5 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-brand-800 text-white shadow-sm'
                : 'bg-transparent text-muted hover:text-ink',
            )}
          >
            {role.label}
          </button>
        )
      })}
    </div>
  )
}
