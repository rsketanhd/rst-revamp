export type MyApplicationMetaFieldProps = {
  label: string
  value: string
}

/**
 * Label + value pair used on My Applications cards.
 */
export function MyApplicationMetaField({
  label,
  value,
}: MyApplicationMetaFieldProps) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-medium text-[#8B8B9E]">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-[#2D2061]">{value}</p>
    </div>
  )
}
