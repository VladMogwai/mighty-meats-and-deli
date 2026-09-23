import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { Page } from '@mighty-meats/shared/payload-types'

/** Shared renderer for the home page and `/[slug]` pages. */
export const PageView = ({ page }: { page: Page }) => {
  const startsWithHero = page.layout?.[0]?.blockType === 'hero'

  return (
    <article>
      {!startsWithHero && <h1 className="container page-title">{page.title}</h1>}
      <RenderBlocks blocks={page.layout} />
    </article>
  )
}
