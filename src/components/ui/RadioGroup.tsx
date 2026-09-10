import { cn } from '../../lib/cn'

export type RadioOption = {
  value: string
  label: string
}

export type RadioGroupProps = {
  label?: string
  name: string
  value: string
  onChange: (value: string) => void
  options: Array<RadioOption | string>
  className?: string
}

export function RadioGroup({
  label,
  name,
  value,
  onChange,
  options,
  className,
}: RadioGroupProps) {
  return (
    <fieldset className={cn('flex min-w-0 flex-col gap-2', className)}>
      {label ? (
        <legend className="text-sm font-medium text-[#2D2061]">{label}</legend>
      ) : null}
      <div className="flex flex-wrap items-center gap-6">
        {options.map((option) => {
          const item =
            typeof option === 'string' ? { value: option, label: option } : option
          const checked = value === item.value

          return (
            <label
              key={item.value}
              className="inline-flex cursor-pointer items-center gap-2"
            >
              <input
                type="radio"
                name={name}
                value={item.value}
                checked={checked}
                onChange={() => onChange(item.value)}
                className="size-4 accent-[#2D2061]"
              />
              <span className="text-sm font-medium text-[#2D2061]">{item.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
