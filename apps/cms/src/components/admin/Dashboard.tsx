import { HOME_SLUG } from '@mighty-meats/shared/constants'
import type { ServerProps } from 'payload'

import { env } from '../../env'

type Task = { title: string; hint: string; href: string; icon: string }

/** Everyday tasks at the top of the dashboard, so the owner never has to hunt through the menu. */
export const Dashboard = async ({ payload }: ServerProps) => {
  const admin = payload.config.routes.admin
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: HOME_SLUG } },
    limit: 1,
    depth: 0,
  })
  const homePage = docs[0]

  const tasks: Task[] = [
    { icon: '💲', title: 'Change a price', hint: 'Open the product list and click a product', href: `${admin}/collections/products` },
    { icon: '➕', title: 'Add a product', hint: 'Name, price, photo and category', href: `${admin}/collections/products/create` },
    { icon: '🕘', title: 'Opening hours', hint: 'Hours, phone and address — tab “Contacts & hours”', href: `${admin}/globals/site-settings` },
    {
      icon: '🏠',
      title: 'Home page',
      hint: 'Texts, photos and the videos on the home page',
      href: homePage ? `${admin}/collections/pages/${homePage.id}` : `${admin}/collections/pages`,
    },
    { icon: '🎬', title: 'Videos', hint: 'Add a YouTube link or upload a clip', href: `${admin}/collections/videos` },
    { icon: '🗂️', title: 'Categories', hint: 'Beef, pork, sausages… and their photos', href: `${admin}/collections/product-categories` },
  ]

  return (
    <section className="mm-dashboard">
      <div className="mm-dashboard__head">
        <h2>What would you like to do?</h2>
        <a className="mm-dashboard__site" href={env.webUrl} target="_blank" rel="noreferrer">
          View website ↗
        </a>
      </div>
      <ul className="mm-dashboard__tasks">
        {tasks.map((task) => (
          <li key={task.title}>
            <a className="mm-task" href={task.href}>
              <span className="mm-task__icon" aria-hidden>
                {task.icon}
              </span>
              <span className="mm-task__title">{task.title}</span>
              <span className="mm-task__hint">{task.hint}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mm-dashboard__note">
        After you press <b>Save</b>, the website updates by itself in 2–3 minutes. Everything else is in the menu on the left.
      </p>
    </section>
  )
}
