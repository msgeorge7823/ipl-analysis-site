import { useState, useEffect } from 'react'

type AvatarKind = 'player' | 'coach'

export type AvatarProps = {
  /** Entity ID used to locate the image file on disk. */
  id: string
  /** Display name — used to derive initials for the fallback. */
  name: string
  /** Determines the photo folder: /photos/players or /photos/coaches. */
  kind?: AvatarKind
  /**
   * Exact pixel size of the rendered square. Always pass the same value
   * the letter-icon had (Players grid = 64, CoachDetail header = 112, etc.)
   * so this is a drop-in replacement.
   */
  sizePx: number
  /**
   * Base color for the fallback gradient (team primary color when available).
   * Falls back to accent indigo if not provided.
   */
  color?: string
  /** Optional font-size override for initials. Defaults to ~sizePx * 0.36. */
  initialsFontSizePx?: number
  /** Extra classes applied to the outer square. */
  className?: string
  /**
   * Optional explicit photo URL override. Lowest priority after local files —
   * used as a fallback when no local jersey-specific photo exists.
   */
  photo?: string | null
  /**
   * Optional IPL season ("2024", "2025", "2026"). When provided, the component
   * first looks for a season-tagged file at `/photos/{folder}/{id}_{season}.{ext}`.
   * This is the mechanism for season-accurate IPL-jersey photos.
   */
  season?: string
}

function getInitials(name: string): string {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const FOLDER: Record<AvatarKind, string> = {
  player: 'players',
  coach: 'coaches',
}

// Local files must use a single extension (.jpg) by convention — this keeps
// 404-probing predictable: max 2 requests per Avatar (season-specific → generic).
// If you need .png / .webp, supply the URL via the `photo` prop instead.
function buildCandidateUrls(id: string, kind: AvatarKind, season?: string): string[] {
  const folder = FOLDER[kind]
  const urls: string[] = []
  if (season) {
    urls.push(`/photos/${folder}/${id}_${season}.jpg`)
  }
  urls.push(`/photos/${folder}/${id}.jpg`)
  return urls
}

/** Normalise a URL: protocol-relative `//...` becomes `https://...`. */
function normaliseUrl(url: string | null | undefined): string | null {
  if (!url) return null
  if (url.startsWith('//')) return 'https:' + url
  return url
}

/**
 * Drop-in Avatar component.
 *
 * - If a photo file exists at `/public/photos/{players|coaches}/{id}.{jpg,jpeg,png,webp}`
 *   it renders that image.
 * - If no file exists (or all candidates 404), renders a polished
 *   colored-initials fallback that matches the visual style used elsewhere
 *   in the app.
 *
 * Size is controlled via `sizePx` so this replaces letter-icons one-for-one.
 */
export default function Avatar({
  id,
  name,
  kind = 'player',
  sizePx,
  color = '#6366f1',
  initialsFontSizePx,
  className = '',
  photo,
  season,
}: AvatarProps) {
  // Priority chain:
  // 1. Season-specific local file `/photos/{folder}/{id}_{season}.{ext}` — IPL-jersey-accurate.
  // 2. Generic local file `/photos/{folder}/{id}.{ext}` — non-season-specific player photo.
  // 3. Explicit `photo` prop (e.g., from a mapping JSON) — final URL fallback.
  // 4. Colored initials (handled when `failed` becomes true).
  const normalisedPhoto = normaliseUrl(photo)
  const localCandidates = id ? buildCandidateUrls(id, kind, season) : []
  const candidates = normalisedPhoto
    ? [...localCandidates, normalisedPhoto]
    : localCandidates

  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(candidates.length === 0)

  useEffect(() => {
    // Reset when the entity changes
    setIdx(0)
    setFailed(candidates.length === 0)
  }, [id, photo, season])

  const initials = getInitials(name)
  const fontSize = initialsFontSizePx ?? Math.max(10, Math.round(sizePx * 0.36))

  const style: React.CSSProperties = {
    width: sizePx,
    height: sizePx,
    background: `linear-gradient(135deg, ${color}, ${color}cc)`,
    fontSize,
  }

  if (failed) {
    return (
      <div
        className={`rounded-full flex items-center justify-center text-white font-bold shrink-0 ${className}`}
        style={style}
        aria-label={name}
      >
        {initials}
      </div>
    )
  }

  const src = candidates[idx]

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      className={`rounded-full object-cover shrink-0 ${className}`}
      style={{ width: sizePx, height: sizePx }}
      onError={() => {
        if (idx + 1 < candidates.length) {
          setIdx(idx + 1)
        } else {
          setFailed(true)
        }
      }}
    />
  )
}
