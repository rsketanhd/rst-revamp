import { useState } from 'react'
import { Button, Checkbox, toast } from '../ui'
import { cn } from '../../lib/cn'
import { SettingsPanel } from './SettingsPanel'

const DEFAULT_CHECK_SIMILAR = true
const DEFAULT_DUPLICATE_THRESHOLD = 40

/**
 * Settings → Module Configuration → Jobs → General.
 */
export function JobsGeneralPanel() {
  const [checkSimilar, setCheckSimilar] = useState(DEFAULT_CHECK_SIMILAR)
  const [duplicateFrom, setDuplicateFrom] = useState(
    String(DEFAULT_DUPLICATE_THRESHOLD),
  )

  function handleSave() {
    toast.success('General settings saved.', { title: 'Jobs' })
  }

  function handleReset() {
    setCheckSimilar(DEFAULT_CHECK_SIMILAR)
    setDuplicateFrom(String(DEFAULT_DUPLICATE_THRESHOLD))
    toast.success('Settings reset to default.', { title: 'Jobs' })
  }

  return (
    <SettingsPanel
      eyebrow="JOBS"
      title="General"
      description="Configure how new jobs are checked for possible duplicates."
    >
      <div className="rounded-[8px] bg-[#F8F9FB] px-5 py-4 sm:px-6 sm:py-5">
        <Checkbox
          id="jobs-check-similar"
          checked={checkSimilar}
          onChange={(event) => setCheckSimilar(event.target.checked)}
          label={
            <span className="font-semibold text-[#2D2061]">
              Check for similar jobs when a job is created
            </span>
          }
        />
        <p className="mt-1.5 max-w-3xl pl-[1.625rem] text-xs leading-relaxed text-[#8B8B9E]">
          The AI finds the 3 existing jobs closest to the new description and
          each is rated as a possible duplicate from 0 to 100%. Matching jobs
          are shown as &apos;Similar Jobs Detected&apos; cards.
        </p>

        <div
          className={cn(
            'mt-4 flex flex-wrap items-center gap-2 pl-[1.625rem]',
            !checkSimilar && 'pointer-events-none opacity-50',
          )}
          aria-disabled={!checkSimilar}
        >
          <label
            htmlFor="jobs-duplicate-from"
            className="text-sm font-semibold text-[#2D2061]"
          >
            Show as a duplicate from
          </label>
          <input
            id="jobs-duplicate-from"
            type="number"
            min={0}
            max={100}
            value={duplicateFrom}
            disabled={!checkSimilar}
            onChange={(event) => setDuplicateFrom(event.target.value)}
            className={cn(
              'h-9 w-16 rounded-md border border-[#D5D2E2] bg-white px-2.5 text-center text-sm text-[#2D2061]',
              'outline-none transition-colors focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
              'disabled:cursor-not-allowed',
            )}
            aria-label="Duplicate threshold percentage"
          />
          <span className="text-sm text-[#8B8B9E]">
            % upwards (default {DEFAULT_DUPLICATE_THRESHOLD}%)
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="!h-10 !rounded-md !border-[#2D2061] !px-5 !text-[#2D2061] hover:!bg-[#F7F6FA]"
        >
          Reset to Default
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          className="!h-10 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
        >
          Save
        </Button>
      </div>
    </SettingsPanel>
  )
}
