import type { ReportKpi } from './jobStatisticsOverview'
import type { ReportHighlightStat } from './jobStatisticsOverview'
import type { OfferHiredMetric } from './offerHiredDistribution'

/** Deterministic scale factor from a date-range option id. */
export function getDateRangeFactor(rangeId: string): number {
  switch (rangeId) {
    case '2024-01':
      return 1
    case '2024-02':
      return 0.92
    case '2024-q1':
      return 1.18
    case '2024-ytd':
      return 1.45
    default:
      return 1
  }
}

/** How many trailing months an activity period should include. */
export function getActivityPeriodMonthCount(periodId: string): number {
  switch (periodId) {
    case 'last-3-months':
      return 3
    case 'last-6-months':
      return 6
    case 'last-12-months':
      return 12
    case 'ytd':
      return 11
    default:
      return 6
  }
}

/** Slight volume shift from activity period (longer windows → more volume). */
export function getActivityPeriodFactor(periodId: string): number {
  switch (periodId) {
    case 'last-3-months':
      return 0.72
    case 'last-6-months':
      return 1
    case 'last-12-months':
      return 1.28
    case 'ytd':
      return 1.15
    default:
      return 1
  }
}

export function scaleInteger(value: number, factor: number): number {
  return Math.max(0, Math.round(value * factor))
}

export function parseNumericLabel(value: string): {
  number: number
  suffix: string
  prefix: string
} {
  const trimmed = value.trim()
  const prefix = trimmed.startsWith('+') ? '+' : ''
  const suffixMatch = trimmed.match(/(%|d| Days)?$/i)
  const suffix = suffixMatch?.[1] ?? ''
  const number = Number(trimmed.replace(/[^0-9.]/g, ''))
  return {
    number: Number.isFinite(number) ? number : 0,
    suffix,
    prefix,
  }
}

export function formatScaledValue(
  raw: string,
  factor: number,
  options?: { decimals?: number },
): string {
  const adaptive = isDurationOrRateValue(raw)
    ? 1 + (factor - 1) * 0.22
    : factor
  const { number, suffix, prefix } = parseNumericLabel(raw)
  const decimals =
    options?.decimals ?? (raw.includes('%') || raw.includes('.') ? 1 : 0)
  const scaled =
    decimals > 0
      ? Number((number * adaptive).toFixed(decimals))
      : scaleInteger(number, adaptive)
  const withCommas = scaled.toLocaleString('en-US', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals > 0 && scaled % 1 !== 0 ? decimals : 0,
  })
  return `${prefix}${withCommas}${suffix}`
}

function isDurationOrRateValue(raw: string): boolean {
  return /%|days|\bd\b/i.test(raw)
}

export function scaleKpis(items: ReportKpi[], factor: number): ReportKpi[] {
  return items.map((item) => ({
    ...item,
    value: formatScaledValue(item.value, factor),
  }))
}

export function scaleHighlightStats(
  items: ReportHighlightStat[],
  factor: number,
): ReportHighlightStat[] {
  return items.map((item) => ({
    ...item,
    value: formatScaledValue(item.value, factor),
  }))
}

export function scaleOfferMetrics(
  items: OfferHiredMetric[],
  factor: number,
): OfferHiredMetric[] {
  return items.map((item) => ({
    ...item,
    value: formatScaledValue(item.value, factor),
    description: item.description.includes('out of')
      ? scaleRatioDescription(item.description, factor)
      : item.description,
  }))
}

function scaleRatioDescription(description: string, factor: number): string {
  // e.g. "771 out of 3,631 offers"
  const match = description.match(/([\d,]+)\s+out of\s+([\d,]+)\s*(.*)/i)
  if (!match) return description
  const left = scaleInteger(Number(match[1].replace(/,/g, '')), factor)
  const right = scaleInteger(Number(match[2].replace(/,/g, '')), factor)
  return `${left.toLocaleString('en-US')} out of ${right.toLocaleString('en-US')} ${match[3]}`.trim()
}

export function scaleBarValues<T extends { value: number }>(
  items: T[],
  factor: number,
): T[] {
  return items.map((item) => ({
    ...item,
    value: scaleInteger(item.value, factor),
  }))
}

export function takeTrailingMonths<T>(items: T[], count: number): T[] {
  if (count >= items.length) return items
  return items.slice(-count)
}

export function combineFilterFactor(
  dateFactorA: number,
  dateFactorB: number,
  activityFactor = 1,
  extraFactor = 1,
): number {
  // Blend the two date filters so both matter without exploding values.
  const dateBlend = (dateFactorA + dateFactorB) / 2
  return dateBlend * activityFactor * extraFactor
}
