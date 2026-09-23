import type { Block } from 'payload'

import { ContactFormBlock } from './ContactForm/config'
import { ContentBlock } from './Content/config'
import { FeaturedProductsBlock } from './FeaturedProducts/config'
import { GalleryBlock } from './Gallery/config'
import { HeroBlock } from './Hero/config'
import { LocationBlock } from './Location/config'
import { PartnerListBlock } from './PartnerList/config'
import { ProductListBlock } from './ProductList/config'
import { ShortsBlock } from './Shorts/config'
import { StepsBlock } from './Steps/config'
import { TestimonialsBlock } from './Testimonials/config'
import { VideoGalleryBlock } from './VideoGallery/config'

export const pageBlocks: Block[] = [
  HeroBlock,
  ContentBlock,
  StepsBlock,
  GalleryBlock,
  VideoGalleryBlock,
  ShortsBlock,
  ProductListBlock,
  FeaturedProductsBlock,
  PartnerListBlock,
  TestimonialsBlock,
  ContactFormBlock,
  LocationBlock,
]
