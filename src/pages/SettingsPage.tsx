import { Navigate, useParams } from 'react-router-dom'
import { PageContainer, PageHeader } from '../components/layout'
import {
  DEFAULT_SETTINGS_SECTION,
  isSettingsSectionId,
  AdminPanel,
  CompanyBrandingPanel,
  EmailConfigPanel,
  NotificationConfigPanel,
  RecruiterProfilePanel,
  RoleManagementPanel,
  SettingsNav,
  UserManagementPanel,
  type SettingsSectionId,
} from '../components/settings'

/**
 * Authenticated Settings page shell: secondary nav + active section panel.
 */
export function SettingsPage() {
  const { sectionId = DEFAULT_SETTINGS_SECTION } = useParams()

  if (!isSettingsSectionId(sectionId)) {
    return (
      <Navigate to={`/settings/${DEFAULT_SETTINGS_SECTION}`} replace />
    )
  }

  return (
    <PageContainer contentClassName="gap-5">
      <PageHeader
        title="Settings"
        subtitle="Track credit balance, usage, and purchase history."
      />

      <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
        <aside className="w-full shrink-0 lg:sticky lg:top-0 lg:w-[15.5rem] xl:w-[16.5rem]">
          <SettingsNav activeId={sectionId} />
        </aside>

        <div className="min-w-0 flex-1">
          <SettingsSectionContent sectionId={sectionId} />
        </div>
      </div>
    </PageContainer>
  )
}

function SettingsSectionContent({
  sectionId,
}: {
  sectionId: SettingsSectionId
}) {
  switch (sectionId) {
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
    default: {
      const _exhaustive: never = sectionId
      return _exhaustive
    }
  }
}
