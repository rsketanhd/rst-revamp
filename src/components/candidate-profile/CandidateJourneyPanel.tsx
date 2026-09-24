import { JOURNEY_EVENTS } from '../../data/candidateProfileTabs'

export function CandidateJourneyPanel() {
  return (
    <ol className="relative ml-3 flex flex-col gap-0 border-l border-[#E4E0F2] py-1">
      {JOURNEY_EVENTS.map((event) => (
        <li key={event.id} className="relative pb-6 pl-6 last:pb-0">
          <span
            className="absolute top-1 -left-[5px] size-2.5 rounded-full bg-[#6D5BD0] ring-4 ring-white"
            aria-hidden="true"
          />
          <p className="text-[14px] font-semibold text-[#1A1A2E]">{event.title}</p>
          <p className="mt-0.5 text-[12px] text-[#8B8B9E]">By: {event.actor}</p>
          <p className="text-[12px] text-[#8B8B9E]">{event.at}</p>
        </li>
      ))}
    </ol>
  )
}
