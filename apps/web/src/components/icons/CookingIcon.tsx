import type { CookingMethod } from '@mighty-meats/shared/cooking'
import type { ReactNode } from 'react'

/** Line icons, 48×48, drawn with currentColor. */
const paths: Record<CookingMethod, ReactNode> = {
  bbq: (
    <>
      <path d="M8 20h32a16 12 0 0 1-32 0Z" />
      <path d="M17 31 12 42M31 31l5 11M24 32v10" />
      <path d="M18 6c-2 3 2 5 0 8M24 5c-2 3 2 5 0 8M30 6c-2 3 2 5 0 8" />
    </>
  ),
  grilling: (
    <>
      <rect x="8" y="10" width="32" height="24" rx="3" />
      <path d="M14 10v24M20 10v24M26 10v24M32 10v24M24 34v8M18 42h12" />
    </>
  ),
  frying: (
    <>
      <path d="M6 22h28a14 10 0 0 1-28 0Z" />
      <path d="M34 24h10" />
      <path d="M14 16c-1-2 1-4 0-6M20 16c-1-2 1-4 0-6M26 16c-1-2 1-4 0-6" />
    </>
  ),
  roasting: (
    <>
      <rect x="8" y="8" width="32" height="32" rx="3" />
      <path d="M8 16h32M13 12h2M19 12h2" />
      <rect x="14" y="22" width="20" height="12" rx="2" />
    </>
  ),
  'slow-cooking': (
    <>
      <path d="M10 20h28v14a6 6 0 0 1-6 6H16a6 6 0 0 1-6-6Z" />
      <path d="M6 20h36M20 16h8" />
      <circle cx="24" cy="30" r="5" />
      <path d="M24 27v3l2 1" />
    </>
  ),
  stewing: (
    <>
      <path d="M8 22h32v10a8 8 0 0 1-8 8H16a8 8 0 0 1-8-8Z" />
      <path d="M4 22h4M40 22h4" />
      <path d="M18 16c-1-3 2-4 1-8M24 16c-1-3 2-4 1-8M30 16c-1-3 2-4 1-8" />
    </>
  ),
}

export const CookingIcon = ({ method, className }: { method: CookingMethod; className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 48 48"
    width="48"
    height="48"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    {paths[method]}
  </svg>
)
