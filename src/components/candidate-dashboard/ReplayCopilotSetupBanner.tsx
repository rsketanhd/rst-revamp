import { CircleDot, RotateCcw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clearCopilotSetup, getAuthEmail } from '../../lib/copilot'
import { toast } from '../ui'

/**
 * TEMP — lets QA / design replay the first-login Copilot profile setup.
 * Remove once the setup flow is no longer first-run only.
 */
export function ReplayCopilotSetupBanner() {
  const navigate = useNavigate()

  function replaySetup() {
    clearCopilotSetup(getAuthEmail())
    toast.success('Copilot profile setup reset. Starting interview…', {
      title: 'Temp: Copilot setup',
    })
    navigate('/copilot-setup', { replace: true })
  }

  return (
    <aside className="flex flex-col gap-3 rounded-xl border border-dashed border-[#C8BFF0] bg-[#F7F4FF] px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-[#2D2061] text-white">
          <CircleDot className="size-4" strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#2D2061]">
            Temp: Replay Copilot profile setup
          </p>
          <p className="mt-0.5 text-xs leading-snug text-[#6B6B80]">
            First-login Copilot interview is stored as complete. Use this to clear
            that flag and walk through the setup flow again.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={replaySetup}
        className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#2D2061] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#241A52]"
      >
        <RotateCcw className="size-3.5" strokeWidth={2} aria-hidden="true" />
        Start setup flow
      </button>
    </aside>
  )
}
