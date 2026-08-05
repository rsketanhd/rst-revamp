import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

export type CountryOption = {
  code: string
  dialCode: string
  label: string
  flag: string
  /** Expected national number length (digits) */
  phoneLength: number
}

export const DEFAULT_COUNTRIES: CountryOption[] = [
  { code: 'IN', dialCode: '+91', label: 'India', flag: '🇮🇳', phoneLength: 10 },
  { code: 'US', dialCode: '+1', label: 'United States', flag: '🇺🇸', phoneLength: 10 },
  { code: 'GB', dialCode: '+44', label: 'United Kingdom', flag: '🇬🇧', phoneLength: 10 },
  { code: 'AE', dialCode: '+971', label: 'UAE', flag: '🇦🇪', phoneLength: 9 },
  { code: 'SG', dialCode: '+65', label: 'Singapore', flag: '🇸🇬', phoneLength: 8 },
  { code: 'AU', dialCode: '+61', label: 'Australia', flag: '🇦🇺', phoneLength: 9 },
]

export type PhoneInputProps = {
  label?: string
  requiredMark?: boolean
  value: string
  countryCode: string
  onValueChange: (value: string) => void
  onCountryCodeChange: (dialCode: string) => void
  error?: string
  name?: string
  id?: string
  countries?: CountryOption[]
  className?: string
}

export function PhoneInput({
  label = 'Phone Number',
  requiredMark = false,
  value,
  countryCode,
  onValueChange,
  onCountryCodeChange,
  error,
  name = 'phone',
  id,
  countries = DEFAULT_COUNTRIES,
  className,
}: PhoneInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [open, setOpen] = useState(false)

  const selected =
    countries.find((country) => country.dialCode === countryCode) ??
    countries[0]

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <label htmlFor={inputId} className="text-sm font-medium text-ink">
        {label}
        {requiredMark ? (
          <span className="ml-0.5 text-accent-500" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      <div
        className={cn(
          'relative flex h-11 items-stretch overflow-hidden rounded-control border border-line bg-surface',
          'transition-colors focus-within:border-brand-800 focus-within:ring-2 focus-within:ring-brand-800/10',
          error &&
            'border-accent-500 focus-within:border-accent-500 focus-within:ring-accent-500/15',
        )}
      >
        <div className="relative flex shrink-0">
          <button
            type="button"
            aria-label="Select country code"
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex h-full items-center gap-1.5 border-r border-line bg-surface-soft px-2.5 text-sm text-ink transition-colors hover:bg-surface-soft/80"
          >
            <span className="text-base leading-none" aria-hidden="true">
              {selected?.flag}
            </span>
            <ChevronDown
              className={cn(
                'size-3.5 text-muted transition-transform',
                open && 'rotate-180',
              )}
              aria-hidden="true"
            />
            <span className="min-w-[2.25rem] font-medium text-ink">
              {selected?.dialCode}
            </span>
          </button>

          {open ? (
            <>
              <button
                type="button"
                className="fixed inset-0 z-10 cursor-default"
                aria-label="Close country list"
                onClick={() => setOpen(false)}
              />
              <ul
                role="listbox"
                className="absolute left-0 top-full z-20 mt-1 max-h-48 w-52 overflow-auto rounded-control border border-line bg-surface py-1 shadow-lg"
              >
                {countries.map((country) => (
                  <li key={country.code} role="option" aria-selected={country.dialCode === countryCode}>
                    <button
                      type="button"
                      className={cn(
                        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-surface-soft',
                        country.dialCode === countryCode && 'bg-brand-100 text-brand-800',
                      )}
                      onClick={() => {
                        onCountryCodeChange(country.dialCode)
                        setOpen(false)
                      }}
                    >
                      <span aria-hidden="true">{country.flag}</span>
                      <span className="flex-1 truncate">{country.label}</span>
                      <span className="text-muted">{country.dialCode}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>

        <input
          id={inputId}
          name={name}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="Phone Number"
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          onChange={(event) => {
            // Keep digits only in the national number field
            onValueChange(event.target.value.replace(/\D/g, ''))
          }}
          className="h-full w-full border-0 bg-transparent px-3.5 text-sm text-ink outline-none placeholder:text-subtle"
        />
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-accent-500">
          {error}
        </p>
      ) : null}
    </div>
  )
}
