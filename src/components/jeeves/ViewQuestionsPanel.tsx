import { Info } from 'lucide-react'
import { Button, SidePanel } from '../ui'
import {
  getSetQuestions,
  kindLabel,
  viewQuestionSummary,
  type PreInterviewSet,
  type PreInterviewSetQuestions,
  type PreInterviewViewQuestion,
} from '../../data/jeevesPreInterviewSets'

export type ViewQuestionsPanelProps = {
  open: boolean
  set: PreInterviewSet | null
  onClose: () => void
}

/**
 * Read-only View Questions drawer for a Pre-Interview Set.
 */
export function ViewQuestionsPanel({
  open,
  set,
  onClose,
}: ViewQuestionsPanelProps) {
  const content = set ? getSetQuestions(set.id) : undefined
  const enabledCount =
    content?.questions.filter((question) => question.enabled).length ?? 0
  const questionCount = content?.questions.length ?? set?.questionCount ?? 0

  return (
    <SidePanel
      open={open && Boolean(set)}
      onClose={onClose}
      title={set?.name ?? 'Questions'}
      widthClassName="w-full max-w-[36rem]"
      footerClassName="justify-end border-t border-[#ECEAF3]"
      footer={
        <Button
          type="button"
          onClick={onClose}
          className="!h-10 !rounded-md !bg-[#2D2061] px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
        >
          Close
        </Button>
      }
    >
      {set ? (
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-2.5 rounded-lg border border-[#D4DCF0] bg-[#EEF2FA] px-3.5 py-3">
            <Info
              className="mt-0.5 size-4 shrink-0 text-[#3B6BC4]"
              strokeWidth={2}
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-[#3A4A6B]">
              View only. To change questions, use{' '}
              <span className="font-semibold">Edit Set</span>. Saving creates a
              new version; chats already sent keep theirs.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <MetaField label="Type" value={kindLabel(set.kind)} />
            <MetaField label="Version" value={String(set.version)} />
            <MetaField
              label="Questions"
              value={`${questionCount} (${enabledCount} switched on)`}
            />
            <MetaField
              label="Ends with"
              value={endsWithLabel(content)}
            />
          </dl>

          {content ? (
            <>
              <p className="text-sm leading-relaxed text-[#2D2061]">
                <span className="font-semibold">Intro:</span> {content.intro}
              </p>

              <ul className="flex flex-col gap-3">
                {content.questions.map((question, index) => (
                  <li key={question.id}>
                    <QuestionCard question={question} index={index + 1} />
                  </li>
                ))}
              </ul>

              <p className="text-sm leading-relaxed text-[#2D2061]">
                <span className="font-semibold">Closing:</span>{' '}
                {content.closing}
              </p>
            </>
          ) : (
            <p className="rounded-lg border border-dashed border-[#DAD6E6] px-4 py-8 text-center text-sm text-[#8B8B9E]">
              No questions saved for this set yet.
            </p>
          )}
        </div>
      ) : null}
    </SidePanel>
  )
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-[#8B8B9E]">{label}</dt>
      <dd className="mt-0.5 text-sm font-semibold text-[#2D2061]">{value}</dd>
    </div>
  )
}

function QuestionCard({
  question,
  index,
}: {
  question: PreInterviewViewQuestion
  index: number
}) {
  return (
    <div className="rounded-lg border border-[#E4E1EE] bg-white px-4 py-3.5">
      <p className="text-sm font-semibold text-[#2D2061]">
        {index}. {question.text}
      </p>
      <p className="mt-1 text-sm text-[#8B8B9E]">
        {viewQuestionSummary(question)}
      </p>
    </div>
  )
}

function endsWithLabel(content: PreInterviewSetQuestions | undefined): string {
  if (!content) return '—'
  const count = content.closingMessageCount
  return `${count} closing message${count === 1 ? '' : 's'}`
}
