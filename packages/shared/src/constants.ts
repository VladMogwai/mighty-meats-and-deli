/** Slug of the page rendered at the site root. */
export const HOME_SLUG = 'home'

export const WEEK_DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

export type WeekDay = (typeof WEEK_DAYS)[number]
