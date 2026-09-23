'use client'

import type { ContactFormBlock as ContactFormBlockData } from '@mighty-meats/shared/payload-types'
import { type FormEvent, useState } from 'react'

import { getPublicCmsUrl } from '@/lib/siteUrl'

import styles from './ContactForm.module.css'

type FieldErrors = Partial<Record<'name' | 'email' | 'message', string>>
type Status = 'idle' | 'sending' | 'success' | 'error'

/** Posts to the CMS contact endpoint; the site itself is static and has no server. */
export const ContactFormBlock = ({ heading, intro, successMessage }: ContactFormBlockData) => {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    try {
      const response = await fetch(`${getPublicCmsUrl()}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
      })
      const result = await response.json()
      setErrors(result.errors ?? {})
      setStatus(result.status === 'success' ? 'success' : 'error')
    } catch {
      setErrors({})
      setStatus('error')
    }
  }

  const isSending = status === 'sending'

  return (
    <section className={`container ${styles.contactForm}`}>
      {heading && <h2>{heading}</h2>}
      {intro && <p>{intro}</p>}

      {status === 'success' ? (
        <p role="status">{successMessage}</p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <label>
            Name
            <input name="name" autoComplete="name" required aria-invalid={Boolean(errors.name)} />
            {errors.name && <span className={styles.error}>{errors.name}</span>}
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </label>
          <label>
            Phone <small>(optional)</small>
            <input name="phone" type="tel" autoComplete="tel" />
          </label>
          <label>
            Message
            <textarea name="message" rows={5} required aria-invalid={Boolean(errors.message)} />
            {errors.message && <span className={styles.error}>{errors.message}</span>}
          </label>
          <input name="company" tabIndex={-1} autoComplete="off" className={styles.honeypot} aria-hidden />
          {status === 'error' && Object.keys(errors).length === 0 && (
            <p className={styles.error} role="alert">
              Could not send the message. Please call us or try again.
            </p>
          )}
          <button type="submit" className="button" disabled={isSending}>
            {/* The CMS may need up to a minute to wake up on the free plan */}
            {isSending ? 'Sending…' : 'Send'}
          </button>
        </form>
      )}
    </section>
  )
}
