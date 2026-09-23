import type { Page } from '@mighty-meats/shared/payload-types'

import { ContactFormBlock } from './ContactForm/Component'
import { ContentBlock } from './Content/Component'
import { FeaturedProductsBlock } from './FeaturedProducts/Component'
import { GalleryBlock } from './Gallery/Component'
import { HeroBlock } from './Hero/Component'
import { LocationBlock } from './Location/Component'
import { PartnerListBlock } from './PartnerList/Component'
import { ProductListBlock } from './ProductList/Component'
import { ShortsBlock } from './Shorts/Component'
import { StepsBlock } from './Steps/Component'
import { TestimonialsBlock } from './Testimonials/Component'
import { VideoGalleryBlock } from './VideoGallery/Component'

type PageBlock = NonNullable<Page['layout']>[number]

const renderBlock = (block: PageBlock, index: number) => {
  switch (block.blockType) {
    case 'hero':
      return <HeroBlock {...block} isFirst={index === 0} />
    case 'content':
      return <ContentBlock {...block} />
    case 'steps':
      return <StepsBlock {...block} />
    case 'gallery':
      return <GalleryBlock {...block} />
    case 'videoGallery':
      return <VideoGalleryBlock {...block} />
    case 'shorts':
      return <ShortsBlock {...block} />
    case 'productList':
      return <ProductListBlock {...block} />
    case 'featuredProducts':
      return <FeaturedProductsBlock {...block} />
    case 'partnerList':
      return <PartnerListBlock {...block} />
    case 'testimonials':
      return <TestimonialsBlock {...block} />
    case 'contactForm':
      return <ContactFormBlock {...block} />
    case 'location':
      return <LocationBlock {...block} />
  }
}

export const RenderBlocks = ({ blocks }: { blocks: Page['layout'] }) =>
  blocks?.map((block, index) => (
    <div key={block.id ?? index} data-block={block.blockType}>
      {renderBlock(block, index)}
    </div>
  ))
