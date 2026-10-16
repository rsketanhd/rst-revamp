import { useState, type ReactNode } from 'react'
import { ChevronDown, Pencil, Trash2 } from 'lucide-react'
import {
  Button,
  ConfirmDeleteModal,
  Switch,
  toast,
} from '../ui'
import { cn } from '../../lib/cn'
import { SettingsPanel } from './SettingsPanel'

type SubCategory = {
  id: string
  name: string
  masterList: boolean
  jobsCount: number
  active: boolean
}

type IndustryCategory = {
  id: string
  name: string
  masterList: boolean
  jobsCount: number
  active: boolean
  subCategories: SubCategory[]
}

type Industry = {
  id: string
  name: string
  categories: IndustryCategory[]
}

type PendingDelete =
  | { kind: 'category'; category: IndustryCategory }
  | { kind: 'sub'; categoryId: string; subCategory: SubCategory }

const CONTROL_CLASS = cn(
  'h-11 rounded-lg border border-[#D5D2E2] bg-white text-sm text-[#2D2061]',
  'outline-none transition-colors focus:border-[#2D2061] focus:ring-2 focus:ring-[#2D2061]/10',
)

function sub(
  id: string,
  name: string,
  jobsCount = 0,
  active = true,
  masterList = true,
): SubCategory {
  return { id, name, jobsCount, active, masterList }
}

function category(
  id: string,
  name: string,
  subCategories: SubCategory[],
  jobsCount = 0,
  active = true,
  masterList = true,
): IndustryCategory {
  return { id, name, subCategories, jobsCount, active, masterList }
}

const INITIAL_INDUSTRIES: Industry[] = [
  {
    id: 'it-software',
    name: 'Information Technology & Software',
    categories: [
      category('cloud', 'Cloud & Infrastructure', [
        sub('cloud-1', 'Cloud Architecture'),
        sub('cloud-2', 'Cloud Engineering'),
        sub('cloud-3', 'DevOps'),
        sub('cloud-4', 'Site Reliability Engineering'),
      ]),
      category('cyber', 'Cybersecurity', [
        sub('cyber-1', 'Application Security'),
        sub('cyber-2', 'Network Security'),
        sub('cyber-3', 'Governance & Compliance'),
      ]),
      category('data', 'Data & Analytics', [
        sub('data-1', 'Data Engineering'),
        sub('data-2', 'Data Science'),
        sub('data-3', 'Business Intelligence'),
        sub('data-4', 'Analytics Engineering'),
        sub('data-5', 'Machine Learning'),
        sub('data-6', 'Data Governance'),
        sub('data-7', 'Data Analytics'),
      ]),
      category('qe', 'Quality Engineering', [
        sub('qe-1', 'Manual QA'),
        sub('qe-2', 'Test Automation'),
        sub('qe-3', 'Performance Testing'),
      ]),
      category('swe', 'Software Development', [
        sub('swe-1', 'Frontend'),
        sub('swe-2', 'Backend'),
        sub('swe-3', 'Full Stack'),
        sub('swe-4', 'Mobile'),
        sub('swe-5', 'Platform Engineering'),
        sub('swe-6', 'Embedded Systems'),
      ], 1),
    ],
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Life Sciences',
    categories: [
      category('clinical', 'Clinical Operations', [
        sub('clinical-1', 'Clinical Research'),
        sub('clinical-2', 'Patient Care'),
        sub('clinical-3', 'Medical Affairs'),
      ], 2),
      category('pharma', 'Pharmaceuticals', [
        sub('pharma-1', 'Drug Development'),
        sub('pharma-2', 'Regulatory Affairs'),
      ]),
      category('health-tech', 'Health Tech', [
        sub('ht-1', 'Digital Health'),
        sub('ht-2', 'Medical Devices'),
        sub('ht-3', 'Health Informatics'),
        sub('ht-4', 'Telemedicine'),
      ], 1),
    ],
  },
]

function jobsLabel(count: number): string {
  return count === 1 ? '1 job' : `${count} jobs`
}

function IconButton({
  label,
  onClick,
  danger = false,
  children,
}: {
  label: string
  onClick: () => void
  danger?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        'inline-flex size-8 items-center justify-center rounded-md text-[#8B8B9E] transition-colors hover:bg-[#F5F4FA]',
        danger ? 'hover:text-[#E53935]' : 'hover:text-[#2D2061]',
      )}
    >
      {children}
    </button>
  )
}

function RowActions({
  name,
  masterList,
  jobsCount,
  active,
  onActiveChange,
  onEdit,
  onDelete,
}: {
  name: string
  masterList: boolean
  jobsCount: number
  active: boolean
  onActiveChange: (active: boolean) => void
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 sm:gap-4">
      {masterList ? (
        <span className="inline-flex rounded-full bg-[#E8E4F8] px-2.5 py-0.5 text-[11px] font-medium text-[#4C3D9A]">
          Master list
        </span>
      ) : (
        <span className="w-[4.75rem]" aria-hidden="true" />
      )}
      <span className="min-w-[3.5rem] text-right text-sm text-[#8B8B9E]">
        {jobsLabel(jobsCount)}
      </span>
      <Switch
        checked={active}
        onCheckedChange={onActiveChange}
        aria-label={`${name} active`}
        className="!gap-0"
      />
      <div className="flex items-center gap-0.5">
        <IconButton label={`Edit ${name}`} onClick={onEdit}>
          <Pencil className="size-4" strokeWidth={1.75} />
        </IconButton>
        <IconButton label={`Delete ${name}`} danger onClick={onDelete}>
          <Trash2 className="size-4" strokeWidth={1.75} />
        </IconButton>
      </div>
    </div>
  )
}

type CategoryRowProps = {
  item: IndustryCategory
  expanded: boolean
  newSubName: string
  onNewSubNameChange: (value: string) => void
  onToggle: () => void
  onActiveChange: (active: boolean) => void
  onEdit: () => void
  onDelete: () => void
  onSubActiveChange: (subId: string, active: boolean) => void
  onSubEdit: (sub: SubCategory) => void
  onSubDelete: (sub: SubCategory) => void
  onAddSub: () => void
}

function ExpandToggle({
  expanded,
  label,
  onToggle,
}: {
  expanded: boolean
  label: string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-label={`${expanded ? 'Collapse' : 'Expand'} ${label}`}
      onClick={onToggle}
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-[#6B6B80] transition-colors hover:bg-[#F2F1F6] hover:text-[#2D2061]"
    >
      <ChevronDown
        className={cn(
          'size-4 transition-transform duration-200',
          expanded && 'rotate-180',
        )}
        strokeWidth={2}
        aria-hidden="true"
      />
    </button>
  )
}

function CategoryRow({
  item,
  expanded,
  newSubName,
  onNewSubNameChange,
  onToggle,
  onActiveChange,
  onEdit,
  onDelete,
  onSubActiveChange,
  onSubEdit,
  onSubDelete,
  onAddSub,
}: CategoryRowProps) {
  const subCount = item.subCategories.length

  return (
    <li>
      <div className="flex flex-wrap items-center gap-3 px-4 py-3.5 sm:flex-nowrap sm:gap-4 sm:px-5">
        <button
          type="button"
          onClick={onToggle}
          className="min-w-0 flex-1 text-left text-sm font-semibold text-[#2A2740]"
        >
          {item.name}{' '}
          <span className="font-normal text-[#8B8B9E]">({subCount})</span>
        </button>

        <RowActions
          name={item.name}
          masterList={item.masterList}
          jobsCount={item.jobsCount}
          active={item.active}
          onActiveChange={onActiveChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />

        <ExpandToggle
          expanded={expanded}
          label={item.name}
          onToggle={onToggle}
        />
      </div>

      {expanded ? (
        <div className="border-t border-[#F0EEF5] bg-white">
          <ul>
            {item.subCategories.map((subCategory) => (
              <li
                key={subCategory.id}
                className="flex flex-wrap items-center gap-3 border-b border-[#F0EEF5] px-4 py-3.5 sm:flex-nowrap sm:gap-4 sm:px-5 sm:py-3 sm:pl-8"
              >
                <span className="min-w-0 flex-1 text-sm font-medium text-[#2A2740]">
                  {subCategory.name}
                </span>
                <RowActions
                  name={subCategory.name}
                  masterList={subCategory.masterList}
                  jobsCount={subCategory.jobsCount}
                  active={subCategory.active}
                  onActiveChange={(active) =>
                    onSubActiveChange(subCategory.id, active)
                  }
                  onEdit={() => onSubEdit(subCategory)}
                  onDelete={() => onSubDelete(subCategory)}
                />
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5 sm:pl-8">
            <input
              type="text"
              value={newSubName}
              onChange={(event) => onNewSubNameChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  onAddSub()
                }
              }}
              placeholder="Add a sub category"
              aria-label={`Add a sub category to ${item.name}`}
              className={cn(
                CONTROL_CLASS,
                'min-w-0 flex-1 px-3.5 placeholder:text-[#A0A0B2]',
              )}
            />
            <Button
              type="button"
              onClick={onAddSub}
              className="!h-11 shrink-0 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
            >
              Add
            </Button>
          </div>
        </div>
      ) : null}
    </li>
  )
}

/**
 * Settings → Module Configuration → Jobs → Categories.
 */
export function JobsJobCategoriesPanel() {
  const [industries, setIndustries] = useState(INITIAL_INDUSTRIES)
  const [selectedIndustryId, setSelectedIndustryId] = useState(
    INITIAL_INDUSTRIES[0]?.id ?? '',
  )
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newSubNames, setNewSubNames] = useState<Record<string, string>>({})
  const [industryExpanded, setIndustryExpanded] = useState(true)
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    cloud: true,
  })
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null)

  const selectedIndustry =
    industries.find((industry) => industry.id === selectedIndustryId) ??
    industries[0]

  function mapSelectedCategories(
    mapper: (categories: IndustryCategory[]) => IndustryCategory[],
  ) {
    if (!selectedIndustry) return
    const industryId = selectedIndustry.id
    setIndustries((current) =>
      current.map((industry) =>
        industry.id === industryId
          ? { ...industry, categories: mapper(industry.categories) }
          : industry,
      ),
    )
  }

  function patchCategory(
    categoryId: string,
    patch: Partial<IndustryCategory>,
  ) {
    mapSelectedCategories((categories) =>
      categories.map((item) =>
        item.id === categoryId ? { ...item, ...patch } : item,
      ),
    )
  }

  function patchSubCategory(
    categoryId: string,
    subId: string,
    patch: Partial<SubCategory>,
  ) {
    mapSelectedCategories((categories) =>
      categories.map((item) => {
        if (item.id !== categoryId) return item
        return {
          ...item,
          subCategories: item.subCategories.map((row) =>
            row.id === subId ? { ...row, ...patch } : row,
          ),
        }
      }),
    )
  }

  function toggleExpanded(categoryId: string) {
    setExpandedIds((current) => ({
      ...current,
      [categoryId]: !current[categoryId],
    }))
  }

  function handleAddCategory() {
    const name = newCategoryName.trim()
    if (!name || !selectedIndustry) {
      toast.error('Enter a category name to add.')
      return
    }

    mapSelectedCategories((categories) => [
      ...categories,
      category(`cat-${Date.now()}`, name, [], 0, true, false),
    ])
    setNewCategoryName('')
    toast.success(`“${name}” was added.`, { title: 'Category added' })
  }

  function handleAddSub(categoryId: string) {
    const name = (newSubNames[categoryId] ?? '').trim()
    if (!name) {
      toast.error('Enter a sub category name to add.')
      return
    }

    mapSelectedCategories((categories) =>
      categories.map((item) => {
        if (item.id !== categoryId) return item
        return {
          ...item,
          subCategories: [
            ...item.subCategories,
            sub(`sub-${Date.now()}`, name, 0, true, false),
          ],
        }
      }),
    )
    setNewSubNames((current) => ({ ...current, [categoryId]: '' }))
    toast.success(`“${name}” was added.`, { title: 'Sub category added' })
  }

  function confirmDelete() {
    if (!pendingDelete) return

    if (pendingDelete.kind === 'category') {
      mapSelectedCategories((categories) =>
        categories.filter((item) => item.id !== pendingDelete.category.id),
      )
      toast.success(`“${pendingDelete.category.name}” was deleted.`, {
        title: 'Category removed',
      })
    } else {
      const { categoryId, subCategory } = pendingDelete
      mapSelectedCategories((categories) =>
        categories.map((item) => {
          if (item.id !== categoryId) return item
          return {
            ...item,
            subCategories: item.subCategories.filter(
              (row) => row.id !== subCategory.id,
            ),
          }
        }),
      )
      toast.success(`“${subCategory.name}” was deleted.`, {
        title: 'Sub category removed',
      })
    }

    setPendingDelete(null)
  }

  const categories = selectedIndustry?.categories ?? []
  const deleteTitle =
    pendingDelete?.kind === 'sub' ? 'Delete Sub Category' : 'Delete Category'
  const deleteName =
    pendingDelete?.kind === 'sub'
      ? pendingDelete.subCategory.name
      : pendingDelete?.category.name

  return (
    <>
      <SettingsPanel
        eyebrow="JOBS"
        title="Categories"
        description="Select an industry and manage the categories and sub-categories used on jobs."
      >
        <section className="rounded-[8px] bg-[#F8F9FB] p-5 sm:p-6">
          <button
            type="button"
            aria-expanded={industryExpanded}
            onClick={() => setIndustryExpanded((open) => !open)}
            className="flex w-full items-center gap-3 text-left"
          >
            <h3 className="min-w-0 flex-1 text-sm font-bold text-[#1F1F2E]">
              Industry
            </h3>
            <ChevronDown
              className={cn(
                'size-4 shrink-0 text-[#6B6B80] transition-transform duration-200',
                industryExpanded && 'rotate-180',
              )}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>

          {industryExpanded ? (
            <div className="mt-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <div className="relative min-w-0 flex-1">
                  <select
                    id="job-categories-industry"
                    aria-label="Industry"
                    value={selectedIndustry?.id ?? ''}
                    onChange={(event) =>
                      setSelectedIndustryId(event.target.value)
                    }
                    className={cn(
                      CONTROL_CLASS,
                      'w-full appearance-none py-2 pl-3.5 pr-10',
                    )}
                  >
                    {industries.map((industry) => (
                      <option key={industry.id} value={industry.id}>
                        {industry.name} — {industry.categories.length}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#8B8B9E]"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </div>

                <input
                  id="job-categories-add-name"
                  type="text"
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleAddCategory()
                    }
                  }}
                  placeholder="Add a category to this industry"
                  className={cn(
                    CONTROL_CLASS,
                    'min-w-0 flex-[1.2] px-3.5 placeholder:text-[#A0A0B2]',
                  )}
                />

                <Button
                  type="button"
                  onClick={handleAddCategory}
                  className="!h-11 shrink-0 !rounded-md !bg-[#2D2061] !px-5 text-sm font-semibold text-white hover:!bg-[#241a52]"
                >
                  Add
                </Button>
              </div>

              <div className="mt-4 overflow-hidden rounded-[8px] border border-[#E4E1EE] bg-white">
                {categories.length > 0 ? (
                  <ul className="divide-y divide-[#ECEAF3]">
                    {categories.map((item) => (
                      <CategoryRow
                        key={item.id}
                        item={item}
                        expanded={Boolean(expandedIds[item.id])}
                        newSubName={newSubNames[item.id] ?? ''}
                        onNewSubNameChange={(value) =>
                          setNewSubNames((current) => ({
                            ...current,
                            [item.id]: value,
                          }))
                        }
                        onToggle={() => toggleExpanded(item.id)}
                        onActiveChange={(active) =>
                          patchCategory(item.id, { active })
                        }
                        onEdit={() =>
                          toast.success(`Opening edit for ${item.name}.`, {
                            title: 'Edit category',
                          })
                        }
                        onDelete={() =>
                          setPendingDelete({
                            kind: 'category',
                            category: item,
                          })
                        }
                        onSubActiveChange={(subId, active) =>
                          patchSubCategory(item.id, subId, { active })
                        }
                        onSubEdit={(subCategory) =>
                          toast.success(
                            `Opening edit for ${subCategory.name}.`,
                            { title: 'Edit sub category' },
                          )
                        }
                        onSubDelete={(subCategory) =>
                          setPendingDelete({
                            kind: 'sub',
                            categoryId: item.id,
                            subCategory,
                          })
                        }
                        onAddSub={() => handleAddSub(item.id)}
                      />
                    ))}
                  </ul>
                ) : (
                  <p className="px-5 py-10 text-center text-sm text-[#8B8B9E]">
                    No categories in this industry yet. Add one above.
                  </p>
                )}
              </div>
            </div>
          ) : null}
        </section>
      </SettingsPanel>

      <ConfirmDeleteModal
        open={Boolean(pendingDelete)}
        title={deleteTitle}
        itemName={deleteName}
        onClose={() => setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </>
  )
}
