import { Navigate, useParams } from 'react-router-dom'

import { PageContainer, PageHeader } from '../components/layout'

import { getUserRole } from '../lib/auth'

import {

  AccountSettingsPanel,

  AdminPanel,

  CampaignSettingsPanel,

  ColumnFilterVisibilityPanel,

  CompanyBrandingPanel,

  DEFAULT_TALENT_CRM_SECTION,

  EmailConfigPanel,

  getDefaultSettingsSectionForRole,

  getSettingsNavGroupsForRole,

  isSettingsSectionIdForRole,

  JobsModulePanel,

  NotificationConfigPanel,

  NotificationPreferencesPanel,

  RecruiterProfilePanel,

  resolveSettingsSectionId,

  RoleManagementPanel,

  SettingsNav,

  SettingsPlaceholderPanel,

  TalentCrmPanel,

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

    return (

      <Navigate to={`/settings/${defaultSection}`} replace />

    )

  }



  if (role === 'recruiter' && activeSectionId === 'talent-crm') {

    return (

      <Navigate to={`/settings/${DEFAULT_TALENT_CRM_SECTION}`} replace />

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

    case 'jobs':

      return <JobsModulePanel />

    case 'talent-crm':

    case 'talent-crm-talent-pool':

      return <TalentCrmPanel />

    case 'talent-crm-column-filter':

      return <ColumnFilterVisibilityPanel />

    case 'talent-crm-campaign':

      return <CampaignSettingsPanel />

    case 'talent-crm-usage-limits':

    case 'talent-crm-candidate':

    case 'candidates':

    case 'pipeline':

    case 'campaigns':

    case 'reports':

    case 'client-management':

    case 'one-way-interview':

    case 'two-way-interview':

      return <SettingsPlaceholderPanel sectionId={sectionId} />

    case 'recruiter-profile':

      return <RecruiterProfilePanel />

    case 'company-branding':

      return <CompanyBrandingPanel />

    case 'notification-config':

      return <NotificationConfigPanel />

    case 'email-config':

      return <EmailConfigPanel />

    case 'user-management':

      return <UserManagementPanel />

    case 'role-management':

      return <RoleManagementPanel />

    case 'admin-panel':

      return <AdminPanel />

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


