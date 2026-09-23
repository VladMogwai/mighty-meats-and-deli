import Link from 'next/link'
import type { ReactNode } from 'react'

import { type CmsLink as CmsLinkData, resolveLinkHref } from '@/lib/links'

type Props = {
  link: CmsLinkData
  className?: string
  children?: ReactNode
}

export const CmsLink = ({ link, className, children }: Props) => {
  const href = resolveLinkHref(link)
  if (!href) return null
  const newTabProps = link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}

  return (
    <Link href={href} className={className} {...newTabProps}>
      {children ?? link.label}
    </Link>
  )
}
