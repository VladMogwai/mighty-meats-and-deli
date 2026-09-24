'use client'

import { type PointerEvent, useCallback, useEffect, useRef, useState } from 'react'

import { EmbeddedVideo } from '@/components/EmbeddedVideo'

import type { ShelfItem } from './items'
import styles from './Shorts.module.css'

const SWIPE_THRESHOLD_PX = 60
/** Wait before loading a YouTube preview, so sweeping the mouse across the row loads nothing. */
const HOVER_DELAY_MS = 300

const youtubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

const youtubeEmbed = (id: string, { preview }: { preview: boolean }) => {
  const params = new URLSearchParams({ autoplay: '1', playsinline: '1', rel: '0', modestbranding: '1' })
  if (preview) {
    params.set('mute', '1')
    params.set('controls', '0')
    params.set('loop', '1')
    params.set('playlist', id) // required by YouTube for looping a single video
  }
  return `https://www.youtube-nocookie.com/embed/${id}?${params}`
}

/** Uploaded clip: first frame at rest, plays silently while hovered — instantly. */
const FileThumbnail = ({ item }: { item: Extract<ShelfItem, { kind: 'file' }> }) => {
  const ref = useRef<HTMLVideoElement>(null)
  return (
    <video
      ref={ref}
      className={styles.thumb}
      // #t=0.1 makes browsers paint the first frame instead of a blank box
      src={`${item.src}#t=0.1`}
      poster={item.poster ?? undefined}
      muted
      loop
      playsInline
      preload="metadata"
      onMouseEnter={() => ref.current?.play().catch(() => {})}
      onMouseLeave={() => ref.current?.pause()}
    />
  )
}

/** YouTube video: cover image at rest; a muted YouTube player fades in over it after a short hover. */
const YouTubeThumbnail = ({ item }: { item: Extract<ShelfItem, { kind: 'youtube' }> }) => {
  const [isPreviewing, setIsPreviewing] = useState(false)
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start = () => {
    timer.current = setTimeout(() => setIsPreviewing(true), HOVER_DELAY_MS)
  }
  const stop = () => {
    if (timer.current) clearTimeout(timer.current)
    setIsPreviewing(false)
    setIsPlayerReady(false)
  }
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  return (
    <span className={styles.thumbFrame} onMouseEnter={start} onMouseLeave={stop}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={styles.thumb} src={youtubeThumbnail(item.youtubeId)} alt="" loading="lazy" />
      {isPreviewing && (
        <iframe
          className={styles.preview}
          data-vertical={item.isVertical}
          data-ready={isPlayerReady}
          src={youtubeEmbed(item.youtubeId, { preview: true })}
          title=""
          aria-hidden
          tabIndex={-1}
          allow="autoplay; encrypted-media"
          // The player needs a moment after load before the first frame shows
          onLoad={() => setTimeout(() => setIsPlayerReady(true), 600)}
        />
      )}
    </span>
  )
}

const Thumbnail = ({ item }: { item: ShelfItem }) => {
  if (item.kind === 'file') return <FileThumbnail item={item} />
  if (item.kind === 'youtube') return <YouTubeThumbnail item={item} />
  return <span className={styles.thumb} />
}

const Player = ({ item }: { item: ShelfItem }) => {
  if (item.kind === 'file') {
    return <video key={item.key} className={styles.player} src={item.src} autoPlay controls loop playsInline />
  }
  if (item.kind === 'youtube') {
    return (
      <iframe
        key={item.key}
        className={styles.player}
        src={youtubeEmbed(item.youtubeId, { preview: false })}
        title={item.title}
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
        allowFullScreen
      />
    )
  }
  return (
    <div key={item.key} className={styles.player}>
      <EmbeddedVideo url={item.url} title={item.title} />
    </div>
  )
}

/** Full-screen vertical player with previous/next by buttons, swipe and arrow keys. */
const Viewer = ({ items, index, onChange, onClose }: {
  items: ShelfItem[]
  index: number
  onChange: (index: number) => void
  onClose: () => void
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const swipeStartY = useRef<number | null>(null)
  const item = items[index]

  const go = useCallback(
    (step: 1 | -1) => onChange((index + step + items.length) % items.length),
    [index, onChange, items.length],
  )

  // No close() on cleanup: it fires the dialog's `close` event, which would immediately
  // unmount the viewer again (React re-runs effects in development). Removing the
  // element on unmount is enough to leave the modal state.
  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') go(1)
    if (event.key === 'ArrowUp') go(-1)
  }

  const handlePointerDown = (event: PointerEvent) => {
    swipeStartY.current = event.clientY
  }

  const handlePointerUp = (event: PointerEvent) => {
    if (swipeStartY.current === null) return
    const distance = event.clientY - swipeStartY.current
    swipeStartY.current = null
    if (Math.abs(distance) >= SWIPE_THRESHOLD_PX) go(distance < 0 ? 1 : -1)
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.viewer}
      aria-label={item.title}
      onClose={onClose}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.stage} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
        <Player item={item} />
        {/* YouTube shows its own title; our overlay would cover its controls */}
        {item.kind !== 'youtube' && (
          <div className={styles.overlay}>
            <p className={styles.viewerTitle}>{item.title}</p>
            {item.description && <p className={styles.viewerText}>{item.description}</p>}
          </div>
        )}
      </div>

      <button type="button" className={`${styles.viewerButton} ${styles.close}`} onClick={onClose} aria-label="Close">
        ✕
      </button>
      {items.length > 1 && (
        <div className={styles.nav}>
          <button type="button" className={styles.viewerButton} onClick={() => go(-1)} aria-label="Previous video">
            ↑
          </button>
          <button type="button" className={styles.viewerButton} onClick={() => go(1)} aria-label="Next video">
            ↓
          </button>
        </div>
      )}
    </dialog>
  )
}

export const ShortsShelf = ({ items }: { items: ShelfItem[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <ul className={styles.shelf}>
        {items.map((item, index) => (
          <li key={item.key} className={styles.card}>
            <button type="button" className={styles.cardButton} onClick={() => setOpenIndex(index)}>
              <Thumbnail item={item} />
              <span className={styles.title}>{item.title}</span>
              {item.description && <span className={styles.meta}>{item.description}</span>}
            </button>
          </li>
        ))}
      </ul>
      {openIndex !== null && (
        <Viewer items={items} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  )
}
