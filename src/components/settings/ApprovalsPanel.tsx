import { SettingsPanel } from './SettingsPanel'
import type { SettingsSectionId } from './settingsNavConfig'

/**
 * Settings → Approvals placeholder for Offer Approvals.
 * General and Job Approvals use dedicated panels.
 */
export function ApprovalsPanel({
  sectionId: _sectionId,
}: {
  sectionId?: SettingsSectionId
}) {
  return (
    <SettingsPanel
      eyebrow="Approvals"
      title="Offer Approvals"
      description="Configure who must approve offers before they can be sent to candidates."
    >
      {null}
    </SettingsPanel>
  )
}
