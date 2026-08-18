import { SettingsPanel } from './SettingsPanel'
import { getSettingsSectionLabel, type SettingsSectionId } from './settingsNavConfig'

/**
 * Placeholder for settings sections not yet fully built.
 */
export function SettingsPlaceholderPanel({
  sectionId,
}: {
  sectionId: SettingsSectionId
}) {
  const title = getSettingsSectionLabel(sectionId)

  return (
    <SettingsPanel
      title={title}
      description="This settings module is ready for content. Configuration will appear here."
    >
      <p className="text-sm text-[#6B6B80]">
        Configure {title.toLowerCase()} options from this panel. Details will be
        added in a future iteration.
      </p>
    </SettingsPanel>
  )
}
