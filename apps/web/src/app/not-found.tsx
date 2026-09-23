import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="container">
      <h1 className="page-title">Page not found</h1>
      <p>
        The page you are looking for does not exist. <Link href="/">Go to the home page</Link>.
      </p>
    </section>
  )
}
