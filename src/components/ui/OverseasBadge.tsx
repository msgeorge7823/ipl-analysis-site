type Props = {
  /** Optional title tooltip shown on hover. */
  title?: string
  /** Tailwind class override for the container. */
  className?: string
  /** Icon size in px. */
  sizePx?: number
}

/**
 * Small pill-style badge with an aeroplane icon marking an overseas player.
 * Render conditionally — parent should only mount this when nationality is
 * known to be non-Indian (see `isOverseasPlayer`).
 */
export default function OverseasBadge({
  title = 'Overseas player',
  className = '',
  sizePx = 14,
}: Props) {
  return (
    <span
      title={title}
      aria-label={title}
      className={`inline-flex items-center justify-center rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 ${className}`}
      style={{ width: sizePx + 8, height: sizePx + 8 }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={sizePx}
        height={sizePx}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        {/* Paper-plane-ish aeroplane silhouette (tilted) */}
        <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5L21 16z" />
      </svg>
    </span>
  )
}
