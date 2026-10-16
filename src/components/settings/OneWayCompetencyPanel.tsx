import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import {
  Button,
  ConfirmDeleteModal,
  Input,
  SidePanel,
  Switch,
  Textarea,
  ThreeDotsMenu,
  toast,
} from '../ui'
import { cn } from '../../lib/cn'
import { OneWaySettingsShell } from './OneWaySettingsChrome'

type Competency = {
  id: string
  title: string
  description: string
  enabled: boolean
  isDefault: boolean
}

type CompetencyForm = {
  title: string
  description: string
}

const INITIAL_COMPETENCIES: Competency[] = [
  {
    id: 'ownership',
    title: 'Ownership',
    description:
      'Takes responsibility for outcomes, including problems outside their own remit.',
    enabled: true,
    isDefault: true,
  },
  {
    id: 'adaptability',
    title: 'Adaptability',
    description:
      'Adjusts approach quickly when plans, priorities or information change.',
    enabled: true,
    isDefault: true,
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    description:
      'Works across people and disagreement to reach shared decisions.',
    enabled: true,
    isDefault: true,
  },
  {
    id: 'communication',
    title: 'Communication',
    description:
      'Makes complex ideas clear to people without the same background.',
    enabled: true,
    isDefault: true,
  },
  {
    id: 'learning-agility',
    title: 'Learning agility',
    description:
      'Learns from mistakes and feedback, then applies it next time.',
    enabled: true,
    isDefault: true,
  },
]

const EMPTY_FORM: CompetencyForm = { title: '', description: '' }

/**
 * Settings → Module Configuration → 1 Way Interview → Competency.
 */
export function OneWayCompetencyPanel() {
  const [competencies, setCompetencies] = useState(INITIAL_COMPETENCIES)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Competency | null>(null)
  const [form, setForm] = useState<CompetencyForm>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<CompetencyForm>>({})
  const [pendingDelete, setPendingDelete] = useState<Competency | null>(null)

  useEffect(() => {
    if (!formOpen) return
    setForm(
      editing
        ? { title: editing.title, description: editing.description }
        : EMPTY_FORM,
    )
    setErrors({})
  }, [formOpen, editing])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(competency: Competency) {
    setEditing(competency)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
    setEditing(null)
    setErrors({})
  }

  function setEnabled(competency: Competency, enabled: boolean) {
    setCompetencies((current) =>
      current.map((item) =>
        item.id === competency.id ? { ...item, enabled } : item,
      ),
    )
    toast.success(
      enabled
        ? `“${competency.title}” enabled for jobs and rounds.`
        : `“${competency.title}” disabled.`,
      { title: 'Competency' },
    )
  }

  function validate(): boolean {
    const next: Partial<CompetencyForm> = {}
    if (!form.title.trim()) next.title = 'Title is required'
    if (!form.description.trim()) next.description = 'Description is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSaveForm() {
    if (!validate()) return
    const title = form.title.trim()
    const description = form.description.trim()

    if (editing) {
      setCompetencies((current) =>
        current.map((item) =>
          item.id === editing.id ? { ...item, title, description } : item,
        ),
      )
      toast.success(`“${title}” updated.`, { title: 'Competency' })
    } else {
      const competency: Competency = {
        id: `custom-${Date.now()}`,
        title,
        description,
        enabled: true,
        isDefault: false,
      }
      setCompetencies((current) => [...current, competency])
      toast.success(`“${title}” created.`, { title: 'Competency' })
    }
    closeForm()
  }

  function confirmDelete() {
    if (!pendingDelete) return
    setCompetencies((current) =>
      current.filter((item) => item.id !== pendingDelete.id),
    )
    toast.success(`Removed “${pendingDelete.title}”.`, {
      title: 'Competency',
    })
    setPendingDelete(null)
  }

  return (
    <OneWaySettingsShell
      title="Competency Settings"
      description="Create global competencies with a title and description, and turn default ones on or off. Enabled competencies can be used in every job and round."
    >
      <div className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-[#2D2061]">
                Global competencies
              </h3>
              <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#E8E7EE] px-2 py-0.5 text-[11px] font-bold text-[#6B6B80]">
                {competencies.length}
              </span>
            </div>
            <p className="mt-1 whitespace-nowrap text-xs leading-relaxed text-[#8B8B9E]">
              Available to every job and round. Rounds pick 3 to 6 of these; AI
              writes about two questions for each.
            </p>
          </div>
          <Button
            type="button"
            onClick={openCreate}
            className="!h-9 !rounded-[8px] !bg-[#2D2061] !px-3.5 text-sm font-semibold text-white hover:!bg-[#241a52]"
          >
            <Plus className="size-4" strokeWidth={2.25} aria-hidden="true" />
            Create New
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {competencies.map((competency) => (
            <CompetencyCard
              key={competency.id}
              competency={competency}
              onEnabledChange={(enabled) => setEnabled(competency, enabled)}
              onEdit={() => openEdit(competency)}
              onDelete={() => setPendingDelete(competency)}
            />
          ))}
        </div>
      </div>

      <SidePanel
        open={formOpen}
        onClose={closeForm}
        title={editing ? 'Edit Competency' : 'Create New Competency'}
        widthClassName="w-full max-w-[28rem]"
        footer={
          <>
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveForm}>
              {editing ? 'Save' : 'Create New'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            id="competency-title"
            label="Title"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="e.g. Problem solving"
            error={errors.title}
          />
          <Textarea
            id="competency-description"
            label="Description"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="What this competency looks like in practice."
            rows={4}
            error={errors.description}
          />
        </div>
      </SidePanel>

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
        itemName={pendingDelete?.title ?? 'competency'}
      />
    </OneWaySettingsShell>
  )
}

function CompetencyCard({
  competency,
  onEnabledChange,
  onEdit,
  onDelete,
}: {
  competency: Competency
  onEnabledChange: (enabled: boolean) => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <article
      className={cn(
        'flex w-full items-start justify-between gap-4 rounded-[8px] border border-[#E4E1EE] bg-white p-4',
        !competency.enabled && 'opacity-70',
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-bold text-[#1A1A2E]">{competency.title}</h4>
          {competency.isDefault ? (
            <span className="rounded-full bg-[#F0EFF4] px-2 py-0.5 text-[10px] font-semibold text-[#6B6B80]">
              Default
            </span>
          ) : (
            <ThreeDotsMenu
              triggerLabel={`More actions for ${competency.title}`}
              side="left"
              align="start"
              items={[
                {
                  id: 'edit',
                  label: 'Edit',
                  icon: <Pencil className="size-3.5" strokeWidth={2} />,
                  onSelect: onEdit,
                },
                {
                  id: 'delete',
                  label: 'Delete',
                  icon: <Trash2 className="size-3.5" strokeWidth={2} />,
                  destructive: true,
                  onSelect: onDelete,
                },
              ]}
            />
          )}
        </div>
        <p className="text-xs leading-relaxed text-[#6B6B80]">
          {competency.description}
        </p>
      </div>

      <Switch
        checked={competency.enabled}
        onCheckedChange={onEnabledChange}
        aria-label={`${competency.title} enabled`}
        className="!gap-0 shrink-0"
      />
    </article>
  )
}
