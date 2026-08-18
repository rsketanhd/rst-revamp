import { useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  Briefcase,
  Building2,
  CalendarDays,
  Info,
  LayoutDashboard,
  LayoutGrid,
  Rocket,
  Search,
  Sparkles,
  SquareUser,
  Users,
  UsersRound,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button, Switch, toast } from '../ui'
import { SettingsPanel } from './SettingsPanel'
import { ClientModuleConfigPanel } from './ClientModuleConfigPanel'
import { JeevesAiConfigPanel } from './JeevesAiConfigPanel'
import { TalentCrmConfigPanel } from './TalentCrmConfigPanel'

type SubFeature = {
  id: string
  title: string
  description: string
  enabled: boolean
}

type AdminModule = {
  id: string
  name: string
  description: string
  enabled: boolean
  /** Shows Configure > action */
  configurable?: boolean
  icon: ReactNode
  subFeatures?: SubFeature[]
  /**
   * Grid columns at large screens.
   * Jobs should render as 4 in one row.
   */
  subFeatureCols?: 3 | 4 | 5
}

const INITIAL_MODULES: AdminModule[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Toggle the Dashboard module availability',
    enabled: true,
    icon: <LayoutDashboard className="size-4" strokeWidth={1.75} />,
  },
  {
    id: 'jobs',
    name: 'Jobs',
    description: 'Toggle the Jobs module availability',
    enabled: true,
    icon: <Briefcase className="size-4" strokeWidth={1.75} />,
    subFeatureCols: 4,
    subFeatures: [
      {
        id: 'add-job',
        title: 'Add Job',
        description:
          'Allows recruitment team to draft and post new job vacancies to the internal and external career portals.',
        enabled: true,
      },
      {
        id: 'share-job',
        title: 'Share Job',
        description:
          'Enables social media distribution and candidate link generation for multi-channel reach.',
        enabled: true,
      },
      {
        id: 'edit-job',
        title: 'Edit Job',
        description:
          'Allows modification of published roles, core requirements, and salary bands after initial posting.',
        enabled: true,
      },
      {
        id: 'configure-stage',
        title: 'Configure Stage',
        description:
          'Enables custom candidate assessment pipeline routing and interview feedback form association.',
        enabled: true,
      },
    ],
  },
  {
    id: 'candidates',
    name: 'Candidates',
    description: 'Toggle the Candidates module availability',
    enabled: true,
    icon: <Users className="size-4" strokeWidth={1.75} />,
    subFeatureCols: 5,
    subFeatures: [
      {
        id: 'parse-candidate',
        title: 'Parse Candidate',
        description:
          'Automatically parse uploaded CVs and extract structured candidate profile data.',
        enabled: true,
      },
      {
        id: 'cv-score-generate',
        title: 'CV Score Generate',
        description:
          'Generate AI-based CV relevancy scores against job requirements.',
        enabled: true,
      },
      {
        id: 'merge-candidate',
        title: 'Merge Candidate',
        description:
          'Merge duplicate candidate records into a single consolidated profile.',
        enabled: true,
      },
      {
        id: 'auto-process',
        title: 'Auto Process',
        description:
          'Automatically advance candidates through workflow stages based on rules.',
        enabled: true,
      },
      {
        id: 'update-candidates',
        title: 'Update Candidates',
        description:
          'Bulk and individual candidate profile updates from imports or syncs.',
        enabled: true,
      },
    ],
  },
  {
    id: 'candidates-discovery',
    name: 'Candidates Discovery',
    description: 'Toggle the Candidates Discovery module availability',
    enabled: true,
    icon: <Search className="size-4" strokeWidth={1.75} />,
    subFeatureCols: 4,
    subFeatures: [
      {
        id: 'user-own-db',
        title: 'User Own DB',
        description:
          'Search and source candidates from your organization’s owned talent database.',
        enabled: true,
      },
      {
        id: 'rs-plus-discovery',
        title: 'RS Plus',
        description:
          'Discover candidates through RS Plus premium talent and contact channels.',
        enabled: true,
      },
      {
        id: 'linkedin',
        title: 'LinkedIn',
        description:
          'Source and engage professional profiles via LinkedIn integrations.',
        enabled: true,
      },
      {
        id: 'monster',
        title: 'Monster',
        description:
          'Access Monster job boards and candidate inventory for discovery.',
        enabled: true,
      },
    ],
  },
  {
    id: 'talent-crm',
    name: 'Talent CRM',
    description: 'Toggle the Talent CRM module availability',
    enabled: true,
    configurable: true,
    icon: <UsersRound className="size-4" strokeWidth={1.75} />,
    subFeatureCols: 3,
    subFeatures: [
      {
        id: 'stage-config',
        title: 'Stage Config',
        description:
          'Configure CRM pipeline stages, ownership rules, and progression criteria.',
        enabled: true,
      },
      {
        id: 'column-filter',
        title: 'Column + Filter',
        description:
          'Customize list columns and advanced filters for talent views.',
        enabled: true,
      },
      {
        id: 'email-sms-personalization',
        title: 'Email and SMS Personalization',
        description:
          'Personalize email and SMS templates with candidate and CRM tokens.',
        enabled: true,
      },
    ],
  },
  {
    id: 'rs-plus',
    name: 'RS Plus',
    description: 'Toggle the RS Plus module availability',
    enabled: true,
    icon: <LayoutGrid className="size-4" strokeWidth={1.75} />,
    subFeatureCols: 4,
    subFeatures: [
      {
        id: 'contact-out-crust',
        title: 'Contact Out + Crust Data',
        description:
          'Direct access to verified contact profiles and corporate intelligence.',
        enabled: true,
      },
      {
        id: 'rocketreach',
        title: 'RocketReach + Co.',
        description:
          'Seamless lookup of professional email addresses and phone numbers.',
        enabled: true,
      },
      {
        id: 'revelio-labs',
        title: 'Revelio Labs',
        description:
          'Workforce intelligence and public employment data maps.',
        enabled: true,
      },
      {
        id: 'rs-plus-backend',
        title: 'RS Plus Backend Data',
        description:
          'Enables sync of core talent directories and backlink updates.',
        enabled: true,
      },
      {
        id: 'upgrade-plan-toggle',
        title: 'Upgrade Plan',
        description:
          'Manage license tier parameters and premium search credits.',
        enabled: true,
      },
      {
        id: 'cv-fields-config',
        title: 'RS Plus CV Fields Config',
        description:
          'Configure map targets for parsed CV properties and fields.',
        enabled: true,
      },
      {
        id: 'search-field-config',
        title: 'RS Plus Search Field Config',
        description:
          'Customize facets and searchable fields for talent database.',
        enabled: true,
      },
    ],
  },
  {
    id: 'jeeves-ai',
    name: 'Jeeves AI',
    description: 'Toggle the Jeeves AI module availability',
    enabled: true,
    configurable: true,
    icon: <Sparkles className="size-4" strokeWidth={1.75} />,
  },
  {
    id: 'one-way',
    name: 'One Way Interview',
    description: 'Toggle the One Way Interview module availability',
    enabled: true,
    icon: <SquareUser className="size-4" strokeWidth={1.75} />,
  },
  {
    id: 'two-way',
    name: 'Two Way Interview',
    description: 'Toggle the Two Way Interview module availability',
    enabled: true,
    icon: <SquareUser className="size-4" strokeWidth={1.75} />,
  },
  {
    id: 'interview-scheduler',
    name: 'Interview Scheduler',
    description: 'Toggle the Interview Scheduler module availability',
    enabled: true,
    icon: <CalendarDays className="size-4" strokeWidth={1.75} />,
  },
  {
    id: 'client-module',
    name: 'Client Module',
    description: 'Toggle the Client Module availability',
    enabled: true,
    configurable: true,
    icon: <Building2 className="size-4" strokeWidth={1.75} />,
  },
]

function subFeatureGridClass(cols: 3 | 4 | 5 = 4) {
  switch (cols) {
    case 3:
      return 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3'
    case 5:
      return 'grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
    case 4:
    default:
      return 'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'
  }
}

/**
 * Settings → Admin Panel — module on/off toggles with expandable sub-features.
 *
 * Enabled modules (and their sub-features) are visible for the account.
 * Disabling a module hides it and all of its sub-features from the account.
 */
export function AdminPanel() {
  const [modules, setModules] = useState<AdminModule[]>(() =>
    INITIAL_MODULES.map((module) => ({
      ...module,
      subFeatures: module.subFeatures?.map((sub) => ({ ...sub })),
    })),
  )

  /** All modules that have sub-features start expanded while enabled. */
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        INITIAL_MODULES.filter((m) => Boolean(m.subFeatures?.length)).map(
          (m) => [m.id, true],
        ),
      ),
  )

  const enabledModules = modules.filter((module) => module.enabled)
  const disabledModules = modules.filter((module) => !module.enabled)
  const [configPanel, setConfigPanel] = useState<
    'talent-crm' | 'jeeves-ai' | 'client-module' | null
  >(null)

  function setModuleEnabled(moduleId: string, enabled: boolean) {
    setModules((current) =>
      current.map((module) =>
        module.id === moduleId ? { ...module, enabled } : module,
      ),
    )

    setExpandedIds((current) => {
      if (!enabled) {
        // Hide sub-features for this account when the parent module is off
        return { ...current, [moduleId]: false }
      }
      const module = modules.find((m) => m.id === moduleId)
      if (!module?.subFeatures?.length) return current
      // Re-enable → show sub-features again
      return { ...current, [moduleId]: true }
    })

    if (!enabled) {
      const module = modules.find((m) => m.id === moduleId)
      toast.success(
        `${module?.name ?? 'Module'} is disabled and no longer visible for this account.`,
        { title: 'Module disabled' },
      )
    }
  }

  function setSubFeatureEnabled(
    moduleId: string,
    subId: string,
    enabled: boolean,
  ) {
    setModules((current) =>
      current.map((module) => {
        if (module.id !== moduleId || !module.subFeatures) return module
        return {
          ...module,
          subFeatures: module.subFeatures.map((sub) =>
            sub.id === subId ? { ...sub, enabled } : sub,
          ),
        }
      }),
    )
  }

  function toggleExpanded(moduleId: string) {
    const module = modules.find((m) => m.id === moduleId)
    // Collapsing / expanding only applies while the feature is enabled
    if (!module?.enabled) return
    setExpandedIds((current) => ({
      ...current,
      [moduleId]: !current[moduleId],
    }))
  }

  /** Opens the matching design side panel — never a toast. */
  function openConfigurePanel(moduleId: string) {
    switch (moduleId) {
      case 'talent-crm':
      case 'jeeves-ai':
      case 'client-module':
        setConfigPanel(moduleId)
        return
      default:
        return
    }
  }

  return (
    <SettingsPanel
      title="Admin Panel"
      description="Configure your portal and sourcing channel preferences"
      className="bg-[#F7F6FA]"
    >
      {/* Administrative warning */}
      <div
        role="alert"
        className="flex items-start gap-3 rounded-lg border border-[#F5D78E] bg-[#FFF8E8] px-3.5 py-3 sm:px-4"
      >
        <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center text-[#D97706]">
          <AlertTriangle className="size-4" strokeWidth={2.25} aria-hidden="true" />
        </span>
        <p className="text-sm leading-relaxed text-[#5C4B1F]">
          <span className="font-bold uppercase tracking-[0.02em] text-[#B45309]">
            Administrative Warning
          </span>
          <span className="text-[#6B5A2E]">
            {' '}
            – Modifying these settings will immediately change the system
            architecture and available modules.
          </span>
        </p>
      </div>

      {/* Active (enabled) modules — visible for this account */}
      <ul className="flex flex-col gap-3">
        {enabledModules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            isExpanded={Boolean(
              module.subFeatures?.length && expandedIds[module.id],
            )}
            onToggleExpanded={() => toggleExpanded(module.id)}
            onEnabledChange={(checked) => setModuleEnabled(module.id, checked)}
            onSubFeatureChange={(subId, checked) =>
              setSubFeatureEnabled(module.id, subId, checked)
            }
            onConfigure={() => openConfigurePanel(module.id)}
          />
        ))}
      </ul>

      {/* Disabled modules — hidden for the account; toggle on to restore */}
      {disabledModules.length > 0 ? (
        <div className="mt-2 border-t border-[#ECEAF3] pt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.04em] text-[#8B8B9E]">
            Disabled modules ({disabledModules.length})
          </p>
          <p className="mb-3 text-xs leading-relaxed text-[#8B8B9E]">
            These modules and their sub-features are not visible for this
            account. Re-enable a module to restore access.
          </p>
          <ul className="flex flex-col gap-2">
            {disabledModules.map((module) => (
              <li
                key={module.id}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-[#E0DDEA] bg-white px-4 py-4 sm:flex-nowrap sm:gap-4 sm:px-5"
              >
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#2D2061]/45 text-white">
                  {module.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-bold text-[#6B6B80]">
                    {module.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#A0A0B2]">
                    Hidden for this account
                    {module.subFeatures?.length
                      ? ` · ${module.subFeatures.length} sub-features hidden`
                      : null}
                  </p>
                </div>
                <Switch
                  checked={false}
                  onCheckedChange={(checked) =>
                    setModuleEnabled(module.id, checked)
                  }
                  id={`admin-module-disabled-${module.id}`}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* Configure drawers — portal via SidePanel; open from Configure > */}
      <TalentCrmConfigPanel
        open={configPanel === 'talent-crm'}
        onClose={() => setConfigPanel(null)}
      />
      <JeevesAiConfigPanel
        open={configPanel === 'jeeves-ai'}
        onClose={() => setConfigPanel(null)}
      />
      <ClientModuleConfigPanel
        open={configPanel === 'client-module'}
        onClose={() => setConfigPanel(null)}
      />
    </SettingsPanel>
  )
}

function ModuleCard({
  module,
  isExpanded,
  onToggleExpanded,
  onEnabledChange,
  onSubFeatureChange,
  onConfigure,
}: {
  module: AdminModule
  isExpanded: boolean
  onToggleExpanded: () => void
  onEnabledChange: (enabled: boolean) => void
  onSubFeatureChange: (subId: string, enabled: boolean) => void
  onConfigure: () => void
}) {
  const hasSubFeatures = Boolean(module.subFeatures?.length)
  const isRsPlus = module.id === 'rs-plus'
  /** Only enabled modules reach this card; sub-features only when expanded. */
  const showSubFeatures = module.enabled && isExpanded && hasSubFeatures

  return (
    <li className="overflow-hidden rounded-xl border border-[#E8E6F0] bg-white shadow-[0_1px_3px_rgba(45,32,97,0.04)]">
      {/* Main feature header — pure white */}
      <div className="flex flex-wrap items-center gap-3 bg-white px-4 py-4 sm:flex-nowrap sm:gap-4 sm:px-5">
        <button
          type="button"
          disabled={!hasSubFeatures}
          onClick={() => {
            if (hasSubFeatures) onToggleExpanded()
          }}
          className={cn(
            'inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#2D2061] text-white',
            hasSubFeatures &&
              'cursor-pointer transition-colors hover:bg-[#241a52]',
            !hasSubFeatures && 'cursor-default',
          )}
          aria-label={
            hasSubFeatures
              ? `${isExpanded ? 'Collapse' : 'Expand'} ${module.name} sub-features`
              : undefined
          }
        >
          {module.icon}
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold leading-snug text-[#2D2061]">
            {module.name}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-[#8B8B9E]">
            {module.description}
          </p>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2.5">
          {module.configurable ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onConfigure}
              className="!h-9 !rounded-md border-[#D5D2E2] bg-white px-3 text-xs font-semibold text-[#2D2061] hover:bg-[#FAFAFC]"
            >
              Configure &gt;
            </Button>
          ) : null}
          <Switch
            checked={module.enabled}
            onCheckedChange={onEnabledChange}
            id={`admin-module-${module.id}`}
          />
        </div>
      </div>

      {/* Sub-features — light recessed section inside pure-white card */}
      {showSubFeatures && module.subFeatures ? (
        <div className="border-t border-[#ECEAF3] bg-[#F5F5F8] px-4 py-4 sm:px-5">
          <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-[#4A4760]">
            {isRsPlus ? (
              <>
                <Rocket
                  className="size-3.5 text-[#2D2061]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                RS Plus Sub-Features
              </>
            ) : (
              `${module.name} Sub-Features`
            )}
          </p>

          <div className={subFeatureGridClass(module.subFeatureCols ?? 4)}>
            {module.subFeatures.map((sub) => (
              <div
                key={sub.id}
                className="rounded-lg border border-[#E8E6F0] bg-white p-3.5 shadow-[0_1px_2px_rgba(45,32,97,0.03)] sm:p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p className="min-w-0 text-sm font-bold leading-snug text-[#2D2061]">
                    {sub.title}
                  </p>
                  <Switch
                    checked={sub.enabled}
                    onCheckedChange={(checked) =>
                      onSubFeatureChange(sub.id, checked)
                    }
                    id={`admin-sub-${module.id}-${sub.id}`}
                  />
                </div>
                <p className="text-xs leading-relaxed text-[#8B8B9E]">
                  {sub.description}
                </p>
              </div>
            ))}
          </div>

          {isRsPlus ? <RsPlusUpgradePlanSection /> : null}
        </div>
      ) : null}
    </li>
  )
}

type CreditFieldState = {
  unlimited: boolean
  value: string
  availableLabel: string
}

/**
 * RS Plus Upgrade Plan form — plan name, dates, and credit pools.
 */
function RsPlusUpgradePlanSection() {
  const [planName, setPlanName] = useState('Testing Plan')
  const [startDate, setStartDate] = useState('2026-05-01')
  const [endDate, setEndDate] = useState('2033-05-31')
  const [contactCredits, setContactCredits] = useState<CreditFieldState>({
    unlimited: false,
    value: '',
    availableLabel: '236',
  })
  const [viewProfileCredits, setViewProfileCredits] =
    useState<CreditFieldState>({
      unlimited: true,
      value: '',
      availableLabel: 'Unlimited',
    })
  const [jobCredits, setJobCredits] = useState<CreditFieldState>({
    unlimited: true,
    value: '',
    availableLabel: 'Unlimited',
  })

  function handleDeactivate() {
    toast.warning('Plan deactivation requested.', {
      title: 'Deactivate Plan',
      description: 'Confirm with your administrator to complete deactivation.',
    })
  }

  function handleUpgrade() {
    toast.success('Upgrade plan preferences saved.', {
      title: 'Upgrade Plan',
    })
  }

  return (
    <div className="mt-5 rounded-xl border border-[#E8E6F0] bg-white p-4 shadow-[0_1px_2px_rgba(45,32,97,0.03)] sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1.5">
          <h4 className="text-sm font-bold text-[#2D2061]">Upgrade Plan</h4>
          <span
            className="inline-flex size-4 items-center justify-center rounded-full text-[#5B8DEF]"
            title="Manage license tier parameters and premium search credits"
          >
            <Info className="size-3.5" strokeWidth={2.25} aria-hidden="true" />
          </span>
        </div>
        <Button
          type="button"
          onClick={handleDeactivate}
          className="!h-9 !rounded-md bg-[#2D2061] px-3.5 text-xs font-semibold text-white hover:bg-[#241a52]"
        >
          Deactivate Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <FieldLabel required label="Plan Name">
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className={fieldInputClass}
          />
        </FieldLabel>
        <FieldLabel required label="Start Date">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={fieldInputClass}
          />
        </FieldLabel>
        <FieldLabel required label="End Date">
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={fieldInputClass}
          />
        </FieldLabel>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <CreditCreditField
          label="Contact Credits"
          state={contactCredits}
          onChange={setContactCredits}
          placeholder="Contact Credits*"
        />
        <CreditCreditField
          label="View Profile Credits"
          state={viewProfileCredits}
          onChange={setViewProfileCredits}
          placeholder="View Profile Credits*"
        />
        <CreditCreditField
          label="Job Credits"
          state={jobCredits}
          onChange={setJobCredits}
          placeholder="Job Credits*"
        />
      </div>

      <div className="mt-5">
        <Button
          type="button"
          onClick={handleUpgrade}
          className="!h-10 !rounded-md bg-[#2D2061] px-5 text-sm font-semibold text-white hover:bg-[#241a52]"
        >
          Upgrade Plan
        </Button>
      </div>
    </div>
  )
}

const fieldInputClass =
  'h-10 w-full rounded-md border border-[#ddd9e8] bg-white px-3 text-sm text-[#2D2061] outline-none transition-colors placeholder:text-[#A0A0B2] focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10 disabled:cursor-not-allowed disabled:bg-[#F5F5F8] disabled:text-[#8B8B9E]'

function FieldLabel({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#6B6B80]">
        {label}
        {required ? (
          <span className="text-[#E53935]" aria-hidden="true">
            *
          </span>
        ) : null}
      </span>
      {children}
    </label>
  )
}

function CreditCreditField({
  label,
  state,
  onChange,
  placeholder,
}: {
  label: string
  state: CreditFieldState
  onChange: (next: CreditFieldState) => void
  placeholder: string
}) {
  const available = state.unlimited ? 'Unlimited' : state.availableLabel
  const unlimitedId = `unlimited-${label.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className="rounded-lg border border-[#E8E6F0] bg-[#FAFAFC] p-3.5">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#6B6B80]">
          {label}
          <span className="text-[#E53935]" aria-hidden="true">
            *
          </span>
        </span>
        <label
          htmlFor={unlimitedId}
          className="inline-flex cursor-pointer items-center gap-1.5"
        >
          <input
            id={unlimitedId}
            type="checkbox"
            checked={state.unlimited}
            onChange={(e) =>
              onChange({
                ...state,
                unlimited: e.target.checked,
                availableLabel: e.target.checked
                  ? 'Unlimited'
                  : state.availableLabel === 'Unlimited'
                    ? '0'
                    : state.availableLabel,
              })
            }
            className="size-3.5 rounded border-[#C8C5D6] accent-[#2D2061]"
          />
          <span className="text-xs font-medium text-[#2D2061]">Unlimited</span>
        </label>
      </div>
      <p className="mb-2 text-xs font-semibold text-[#E67E22]">
        Total Available Credits : {available}
      </p>
      <input
        type="text"
        value={state.unlimited ? '' : state.value}
        disabled={state.unlimited}
        placeholder={placeholder}
        onChange={(e) => onChange({ ...state, value: e.target.value })}
        className={fieldInputClass}
      />
    </div>
  )
}
