import type { PendingItem, PendingItemId } from '../../data/myProfile'

export type ProfilePendingItemsProps = {
  items: PendingItem[]
  onAdd: (id: PendingItemId) => void
}

export function ProfilePendingItems({ items, onAdd }: ProfilePendingItemsProps) {
  return (
    <section className="rounded-xl border border-[#E8E6F0] bg-white px-4 py-4 shadow-[0_2px_12px_rgba(45,32,97,0.04)]">
      <h3 className="text-base font-bold text-[#2D2061]">Pending Items</h3>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-[#8B8B9E]">
          You&apos;re all caught up. Your profile looks great.
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-[#EEF0F6]">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span className="text-sm font-medium text-[#2D2061]">{item.label}</span>
              <button
                type="button"
                onClick={() => onAdd(item.id)}
                className="text-sm font-semibold text-[#2563EB] transition-colors hover:text-[#1D4ED8]"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
