import { WEEK_DAYS, type WeekDay } from '@mighty-meats/shared/constants'
import type { SiteSetting } from '@mighty-meats/shared/payload-types'

export const formatAddress = (address: SiteSetting['address']): string =>
  [address?.street, address?.city, address?.region, address?.postalCode]
    .filter(Boolean)
    .join(', ')

export const mapSearchUrl = (address: SiteSetting['address']): string | null => {
  const query = formatAddress(address)
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null
}

/** Keyless Google Maps embed. */
export const mapEmbedUrl = (address: SiteSetting['address']): string | null => {
  const query = formatAddress(address)
  return query ? `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed` : null
}

export const phoneHref = (phone: string): string => `tel:${phone.replace(/[^\d+]/g, '')}`

export type DaySchedule = { day: WeekDay; hours: string | null }

/** One row per weekday; `hours` is null for days the shop is closed. */
export const weeklySchedule = (openingHours: SiteSetting['openingHours']): DaySchedule[] =>
  WEEK_DAYS.map((day) => {
    const slot = openingHours?.find((entry) => entry.days.includes(day))
    return { day, hours: slot ? `${slot.opens} – ${slot.closes}` : null }
  })

export type ScheduleRange = { days: string; hours: string | null }

/** Consecutive days with the same hours merged: "Monday – Friday 10:00 – 18:00". */
export const groupedSchedule = (openingHours: SiteSetting['openingHours']): ScheduleRange[] => {
  const ranges: { first: WeekDay; last: WeekDay; hours: string | null }[] = []
  for (const { day, hours } of weeklySchedule(openingHours)) {
    const current = ranges.at(-1)
    if (current && current.hours === hours) current.last = day
    else ranges.push({ first: day, last: day, hours })
  }
  return ranges.map(({ first, last, hours }) => ({
    days: first === last ? first : `${first} – ${last}`,
    hours,
  }))
}
