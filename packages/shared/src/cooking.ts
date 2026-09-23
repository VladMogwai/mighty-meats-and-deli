/** Cooking methods a product is "perfect for". The website has an icon for each. */
export const COOKING_METHODS = [
  { value: 'bbq', label: 'BBQ' },
  { value: 'grilling', label: 'Grilling' },
  { value: 'frying', label: 'Frying' },
  { value: 'roasting', label: 'Roasting' },
  { value: 'slow-cooking', label: 'Slow cooking' },
  { value: 'stewing', label: 'Stewing' },
] as const

export type CookingMethod = (typeof COOKING_METHODS)[number]['value']
