'use client'

import type { Media, Video } from '@mighty-meats/shared/payload-types'
import { parseVideoUrl } from '@mighty-meats/shared/video'
import { type PointerEvent, useCallback, useEffect, useRef, useState } from 'react'

import { EmbeddedVideo } from '@/components/EmbeddedVideo'
import { mediaUrl } from '@/lib/media'

import styles from './Shorts.module.css'

const SWIPE_THRESHOLD_PX = 60

const asMedia = (value: Media | number | null | undefined): Media | null =>
  value && typeof value === 'object' ? value : null

const fileUrl = (video: Video) => {
  const file = asMedia(video.file)
  return file?.url ? mediaUrl(file.url) : null
}

const posterUrl = (video: Video) => {
  const poster = asMedia(video.poster)
  if (poster?.url) return mediaUrl(poster.url)
  const parsed = video.url ? parseVideoUrl(video.url) : null
  return parsed?.provider === 'youtube' ? `https://i.ytimg.com/vi/${parsed.id}/hqdefault.jpg` : null
}

/** Card preview: first frame of an uploaded clip (plays silently on hover) or a poster image. */
const Thumbnail = ({ video }: { video: Video }) => {
  const ref = useRef<HTMLVideoElement>(null)
  const src = video.source === 'upload' ? fileUrl(video) : null
  const poster = posterUrl(video)

  if (src) {
    return (
      <video
        ref={ref}
        className={styles.thumb}
        // #t=0.1 makes browsers paint the first frame instead of a blank box
        src={`${src}#t=0.1`}
        poster={poster ?? undefined}
        muted
        loop
        playsInline
        preload="metadata"
        onMouseEnter={() => ref.current?.play().catch(() => {})}
        onMouseLeave={() => ref.current?.pause()}
      />
    )
  }
  // eslint-disable-next-line @next/next/no-img-element
  return poster ? <img className={styles.thumb} src={poster} alt="" loading="lazy" /> : <span className={styles.thumb} />
}

/** Full-screen vertical player with previous/next by buttons, swipe and arrow keys. */
const Viewer = ({ videos, index, onChange, onClose }: {
  videos: Video[]
  index: number
  onChange: (index: number) => void
  onClose: () => void
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const swipeStartY = useRef<number | null>(null)
  const video = videos[index]
  const src = video.source === 'upload' ? fileUrl(video) : null

  const go = useCallback(
    (step: 1 | -1) => onChange((index + step + videos.length) % videos.length),
    [index, onChange, videos.length],
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
      aria-label={video.title}
      onClose={onClose}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.stage} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
        {src ? (
          <video key={video.id} className={styles.player} src={src} autoPlay controls loop playsInline />
        ) : video.url ? (
          <div key={video.id} className={styles.player}>
            <EmbeddedVideo url={video.url} title={video.title} />
          </div>
        ) : null}
        <div className={styles.overlay}>
          <p className={styles.viewerTitle}>{video.title}</p>
          {video.description && <p className={styles.viewerText}>{video.description}</p>}
        </div>
      </div>

      <button type="button" className={`${styles.viewerButton} ${styles.close}`} onClick={onClose} aria-label="Close">
        ✕
      </button>
      {videos.length > 1 && (
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

export const ShortsShelf = ({ videos }: { videos: Video[] }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <>
      <ul className={styles.shelf}>
        {videos.map((video, index) => (
          <li key={video.id} className={styles.card}>
            <button type="button" className={styles.cardButton} onClick={() => setOpenIndex(index)}>
              <Thumbnail video={video} />
              <span className={styles.title}>{video.title}</span>
              {video.description && <span className={styles.meta}>{video.description}</span>}
            </button>
          </li>
        ))}
      </ul>
      {openIndex !== null && (
        <Viewer videos={videos} index={openIndex} onChange={setOpenIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  )
}
