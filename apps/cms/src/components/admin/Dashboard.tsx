import { HOME_SLUG } from '@mighty-meats/shared/constants'
import { Gutter } from '@payloadcms/ui'
import type { CollectionSlug, ServerProps } from 'payload'

import { env } from '../../env'
import { Icon, type IconName } from './icons'

type Task = { title: string; hint: string; href: string; icon: IconName }

type RecentItem = { key: string; title: string; kind: string; href: string; updatedAt: string }

const RECENT_LIMIT = 6

const timeAgo = (date: string) => {
  const minutes = Math.round((Date.now() - new Date(date).getTime()) / 60_000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  return days === 1 ? 'yesterday' : `${days} days ago`
}

/** Replaces the default dashboard: shop summary, everyday tasks and the latest edits. */
export const Dashboard = async ({ payload, user }: ServerProps) => {
  const admin = payload.config.routes.admin
  const count = async (collection: CollectionSlug, where?: Parameters<typeof payload.count>[0]['where']) =>
    (await payload.count({ collection, where })).totalDocs

  const recentOf = async (collection: 'pages' | 'products' | 'product-categories', kind: string) => {
    const { docs } = await payload.find({ collection, sort: '-updatedAt', limit: RECENT_LIMIT, depth: 0 })
    return docs.map<RecentItem>((doc) => ({
      key: `${collection}-${doc.id}`,
      title: 'name' in doc ? doc.name : doc.title,
      kind,
      href: `${admin}/collections/${collection}/${doc.id}`,
      updatedAt: doc.updatedAt,
    }))
  }

  const [products, hidden, categories, videos, homePages, ...recentLists] = await Promise.all([
    count('products'),
    count('products', { isAvailable: { not_equals: true } }),
    count('product-categories'),
    count('videos'),
    payload.find({ collection: 'pages', where: { slug: { equals: HOME_SLUG } }, limit: 1, depth: 0 }),
    recentOf('products', 'Product'),
    recentOf('pages', 'Page'),
    recentOf('product-categories', 'Category'),
  ])
  const homePage = homePages.docs[0]
  const recent = recentLists
    .flat()
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, RECENT_LIMIT)

  const stats = [
    { label: 'Products on the site', value: products - hidden, href: `${admin}/collections/products` },
    {
      label: 'Hidden products',
      value: hidden,
      href: `${admin}/collections/products?where[isAvailable][not_equals]=true`,
    },
    { label: 'Categories', value: categories, href: `${admin}/collections/product-categories` },
    { label: 'Videos', value: videos, href: `${admin}/collections/videos` },
  ]

  const tasks: Task[] = [
    { icon: 'tag', title: 'Change a price', hint: 'Find a product and edit its price', href: `${admin}/collections/products` },
    { icon: 'plus', title: 'Add a product', hint: 'Name, price, photo and category', href: `${admin}/collections/products/create` },
    { icon: 'clock', title: 'Opening hours', hint: 'Hours, phone and address', href: `${admin}/globals/site-settings` },
    {
      icon: 'home',
      title: 'Home page',
      hint: 'Texts, photos and videos',
      href: homePage ? `${admin}/collections/pages/${homePage.id}` : `${admin}/collections/pages`,
    },
    { icon: 'play', title: 'Videos', hint: 'YouTube links and clips', href: `${admin}/collections/videos` },
    { icon: 'grid', title: 'Categories', hint: 'Sections of the Products page', href: `${admin}/collections/product-categories` },
  ]

  const name = typeof user?.email === 'string' ? user.email.split('@')[0] : ''

  return (
    <Gutter className="mm-dashboard">
      <header className="mm-dashboard__head">
        <div>
          <p className="mm-dashboard__eyebrow">Mighty Meats and Deli</p>
          <h1 className="mm-dashboard__title">Hello{name ? `, ${name}` : ''}</h1>
        </div>
        <a className="mm-button" href={env.webUrl} target="_blank" rel="noreferrer">
          View website
          <Icon name="external" />
        </a>
      </header>

      <ul className="mm-stats">
        {stats.map((stat) => (
          <li key={stat.label}>
            <a className="mm-stat" href={stat.href}>
              <span className="mm-stat__value">{stat.value}</span>
              <span className="mm-stat__label">{stat.label}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="mm-dashboard__columns">
        <section>
          <h2 className="mm-section-title">Quick actions</h2>
          <ul className="mm-tasks">
            {tasks.map((task) => (
              <li key={task.title}>
                <a className="mm-task" href={task.href}>
                  <span className="mm-task__icon">
                    <Icon name={task.icon} />
                  </span>
                  <span>
                    <span className="mm-task__title">{task.title}</span>
                    <span className="mm-task__hint">{task.hint}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <p className="mm-note">
            <Icon name="info" />
            After you press Save, the website updates by itself in 2–3 minutes.
          </p>
        </section>

        <section>
          <h2 className="mm-section-title">Recently edited</h2>
          <ul className="mm-recent">
            {recent.map((item) => (
              <li key={item.key}>
                <a className="mm-recent__item" href={item.href}>
                  <span className="mm-recent__title">{item.title}</span>
                  <span className="mm-recent__meta">
                    {item.kind} · {timeAgo(item.updatedAt)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Gutter>
  )
}
