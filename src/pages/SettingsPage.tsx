import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { PageContainer, PageHeader } from '../components/layout'
import { getUserRole } from '../lib/auth'
import {
  AccountSettingsPanel,
  AdminPanel,
  ApprovalsPanel,
  CampaignSettingsPanel,
  CandidatesGeneralPanel,
  CandidateDiscoveryGeneralPanel,
  ColumnFilterVisibilityPanel,
  CompanyBrandingPanel,
  DEFAULT_CANDIDATES_SECTION,
  DEFAULT_CANDIDATE_DISCOVERY_SECTION,
  DEFAULT_OFFER_MANAGEMENT_SECTION,
  DEFAULT_JOBS_SECTION,
  DEFAULT_JEEVES_AI_SECTION,
  DEFAULT_COMMUNICATION_HUB_SECTION,
  DEFAULT_ONE_WAY_INTERVIEW_SECTION,
  DEFAULT_TWO_WAY_INTERVIEW_SECTION,
  DEFAULT_TALENT_CRM_SECTION,
  DocumentsSettingsPanel,
  DomainRulesPanel,
  getDefaultSettingsSectionForRole,
  getSettingsNavGroupsForRole,
  isSettingsSectionIdForRole,
  JobsGeneralPanel,
  JobsCareerPagePanel,
  JobsIndustriesPanel,
  JobsJobCategoriesPanel,
  JobsModulePanel,
  JobsPipelinePanel,
  JeevesAiGeneralPanel,
  JeevesAiQuestionSetsPanel,
  LicenseLimitsPanel,
  MaskingSettingsPanel,
  OneWayAvatarSettingsPanel,
  OneWayCompetencyPanel,
  OneWayDefaultSettingsPanel,
  OneWayPipelineSyncPanel,
  TwoWayConfigurationPanel,
  TwoWayRoundsPanel,
  TwoWayPlanSummaryPanel,
  NotificationConfigPanel,
  NotificationPreferencesPanel,
  OfferManagementPanel,
  RecruiterProfilePanel,
  resolveSettingsSectionId,
  RoleManagementPanel,
  SettingsNav,
  SettingsPlaceholderPanel,
  TalentCrmPanel,
  TemplatesPanel,
  TriggersPanel,
  UserManagementPanel,
  type SettingsSectionId,
} from '../components/settings'

/**
 * Authenticated Settings page shell: secondary nav + active section panel.
 */
export function SettingsPage() {
  const { sectionId } = useParams()
  const role = getUserRole()
  const defaultSection = getDefaultSettingsSectionForRole(role)
  const activeSectionId = sectionId ?? defaultSection

  if (!isSettingsSectionIdForRole(activeSectionId, role)) {
    return <Navigate to={`/settings/${defaultSection}`} replace />
  }

  if (role === 'recruiter' && activeSectionId === 'jobs') {
    return <Navigate to={`/settings/${DEFAULT_JOBS_SECTION}`} replace />
  }

  if (role === 'recruiter' && activeSectionId === 'candidates') {
    return <Navigate to={`/settings/${DEFAULT_CANDIDATES_SECTION}`} replace />
  }

  if (role === 'recruiter' && activeSectionId === 'candidate-discovery') {
    return (
      <Navigate
        to={`/settings/${DEFAULT_CANDIDATE_DISCOVERY_SECTION}`}
        replace
      />
    )
  }

  if (role === 'recruiter' && activeSectionId === 'offer-management') {
    return (
      <Navigate
        to={`/settings/${DEFAULT_OFFER_MANAGEMENT_SECTION}`}
        replace
      />
    )
  }

  if (role === 'recruiter' && activeSectionId === 'talent-crm') {
    return (
      <Navigate to={`/settings/${DEFAULT_TALENT_CRM_SECTION}`} replace />
    )
  }

  if (role === 'recruiter' && activeSectionId === 'jeeves-ai') {
    return <Navigate to={`/settings/${DEFAULT_JEEVES_AI_SECTION}`} replace />
  }

  if (role === 'recruiter' && activeSectionId === 'communication-hub') {
    return (
      <Navigate
        to={`/settings/${DEFAULT_COMMUNICATION_HUB_SECTION}`}
        replace
      />
    )
  }

  if (role === 'recruiter' && activeSectionId === 'one-way-interview') {
    return (
      <Navigate
        to={`/settings/${DEFAULT_ONE_WAY_INTERVIEW_SECTION}`}
        replace
      />
    )
  }

  if (role === 'recruiter' && activeSectionId === 'two-way-interview') {
    return (
      <Navigate
        to={`/settings/${DEFAULT_TWO_WAY_INTERVIEW_SECTION}`}
        replace
      />
    )
  }

  const resolvedId = resolveSettingsSectionId(activeSectionId)
  const navGroups = getSettingsNavGroupsForRole(role)
  const pageSubtitle =
    role === 'candidate'
      ? 'Manage your account and notification preferences.'
      : 'Track credit balance, usage, and purchase history.'

  return (
    <PageContainer contentClassName="gap-5">
      {role === 'recruiter' ? (
        <Link
          to="/settings"
          className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[#6B6B80] transition-colors hover:text-[#2D2061]"
        >
          <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden="true" />
          Back to Settings
        </Link>
      ) : null}
      <PageHeader title="Settings" subtitle={pageSubtitle} />

      <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="w-full shrink-0 lg:sticky lg:top-0 lg:w-[15.5rem] xl:w-[16.5rem]">
          <SettingsNav activeId={resolvedId} groups={navGroups} />
        </aside>

        <div className="min-w-0 flex-1">
          <SettingsSectionContent sectionId={resolvedId} role={role} />
        </div>
      </div>
    </PageContainer>
  )
}

function SettingsSectionContent({
  sectionId,
  role,
}: {
  sectionId: SettingsSectionId
  role: ReturnType<typeof getUserRole>
}) {
  if (role === 'candidate') {
    switch (sectionId) {
      case 'account-settings':
        return <AccountSettingsPanel />

      case 'notification-preferences':
        return <NotificationPreferencesPanel />

      default:
        return (
          <Navigate
            to={`/settings/${getDefaultSettingsSectionForRole('candidate')}`}
            replace
          />
        )
    }
  }

  switch (sectionId) {
    case 'jobs-pipeline':
      return <JobsPipelinePanel />

    case 'jobs-field-customization':
      return <JobsModulePanel />

    case 'jobs':
    case 'jobs-general':
      return <JobsGeneralPanel />

    case 'jobs-job-categories':
      return <JobsJobCategoriesPanel />

    case 'jobs-industries':
      return <JobsIndustriesPanel />

    case 'jobs-career-page':
      return <JobsCareerPagePanel />

    case 'candidates':
    case 'candidates-general':
      return <CandidatesGeneralPanel />

    case 'candidates-documents':
      return <DocumentsSettingsPanel />

    case 'candidates-masking':
      return <MaskingSettingsPanel />

    case 'candidate-discovery':
    case 'candidate-discovery-general':
      return <CandidateDiscoveryGeneralPanel />

    case 'offer-management':
    case 'offer-management-stages-status':
    case 'offer-management-pipeline-sync':
    case 'offer-management-reasons':
    case 'offer-management-approval-rules':
    case 'offer-management-templates-emails':
    case 'offer-management-team-notifications':
    case 'offer-management-entities-compensation':
    case 'offer-management-lifecycle-signing':
    case 'offer-management-audit-log':
      return <OfferManagementPanel sectionId={sectionId} />

    case 'talent-crm':
    case 'talent-crm-talent-pool':
      return <TalentCrmPanel />

    case 'talent-crm-column-filter':
      return <ColumnFilterVisibilityPanel />

    case 'talent-crm-campaign':
      return <CampaignSettingsPanel />

    case 'one-way-interview':
    case 'one-way-interview-default':
      return <OneWayDefaultSettingsPanel />

    case 'one-way-interview-avatar':
      return <OneWayAvatarSettingsPanel />

    case 'one-way-interview-pipeline-sync':
      return <OneWayPipelineSyncPanel />

    case 'one-way-interview-competency':
      return <OneWayCompetencyPanel />

    case 'talent-crm-usage-limits':
    case 'talent-crm-candidate':
    case 'pipeline':
    case 'campaigns':
    case 'reports':
    case 'client-management':
    case 'two-way-interview':
    case 'two-way-interview-configuration':
      return <TwoWayConfigurationPanel />

    case 'two-way-interview-rounds':
      return <TwoWayRoundsPanel />

    case 'two-way-interview-plan-summary':
      return <TwoWayPlanSummaryPanel />

    case 'two-way-interview-notifications':
    case 'two-way-interview-connections':
    case 'two-way-interview-change-history':
    case 'jeeves-ai':
    case 'jeeves-ai-general':
      return <JeevesAiGeneralPanel />

    case 'jeeves-ai-question-sets':
      return <JeevesAiQuestionSetsPanel />

    case 'jeeves-ai-triggers':
    case 'jeeves-ai-change-history':
    case 'communication-hub':
    case 'communication-hub-assignment-handover':
    case 'communication-hub-unassigned-chats':
    case 'communication-hub-topic-status':
    case 'communication-hub-notes-priority':
    case 'communication-hub-document-requests':
    case 'communication-hub-retention-export':
    case 'candidate-privacy':
    case 'data-retention':
    case 'audit-activity':
      return <SettingsPlaceholderPanel sectionId={sectionId} />

    case 'recruiter-profile':
      return <RecruiterProfilePanel />

    case 'company-branding':
      return <CompanyBrandingPanel />

    case 'notification-config':
      return <NotificationConfigPanel />

    case 'templates':
      return <TemplatesPanel />

    case 'triggers':
      return <TriggersPanel />

    case 'approvals':
      return <ApprovalsPanel />

    case 'user-management':
      return <UserManagementPanel />

    case 'role-management':
      return <RoleManagementPanel />

    case 'admin-panel':
      return <AdminPanel />

    case 'license-limits':
      return <LicenseLimitsPanel />

    case 'domain-rules':
      return <DomainRulesPanel />

    case 'account-settings':
    case 'notification-preferences':
      return (
        <Navigate
          to={`/settings/${getDefaultSettingsSectionForRole('recruiter')}`}
          replace
        />
      )

    default: {
      const _exhaustive: never = sectionId
      return _exhaustive
    }
  }
}
