import { StepHeader } from '../../jobs/create/StepChrome'

export type StepCampaignPlaceholderProps = {
  title: string
  description: string
  body: string
}

/**
 * Lightweight placeholder for Messages / Settings / Review until those
 * designs are implemented in full.
 */
export function StepCampaignPlaceholder({
  title,
  description,
  body,
}: StepCampaignPlaceholderProps) {
  return (
    <div>
      <StepHeader title={title} description={description} />
      <div className="max-w-2xl rounded-xl border border-dashed border-[#E0DDEA] bg-[#F8FAFC] px-5 py-8">
        <p className="text-sm text-[#5B6178]">{body}</p>
      </div>
    </div>
  )
}
