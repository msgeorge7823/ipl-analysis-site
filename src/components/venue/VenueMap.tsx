import { Navigation, MapPin } from 'lucide-react'

/**
 * VenueMap
 * --------
 * A small map embed plus action buttons for getting directions to a cricket
 * venue. Used by both the LiveMatch page and MatchDetail page so the
 * navigation experience is uniform across the app.
 *
 * Implementation notes
 * --------------------
 * - The embed uses Google Maps' query-based embed URL
 *     https://maps.google.com/maps?q=<query>&output=embed
 *   which works without an API key for basic embedding (no Maps Embed API
 *   billing required). The URL searches by venue name + city, so we don't
 *   need lat/lon coordinates per venue — Google Maps resolves the name.
 *
 * - "Get Directions" opens Google Maps with the venue as the destination.
 *   On mobile, this prompts the user to use the native Google Maps app.
 *   On desktop, it opens maps.google.com in a new tab. Source for the
 *   query parameter format:
 *     https://developers.google.com/maps/documentation/urls/get-started
 *
 * - "View on Google Maps" opens the venue's search page so the user can
 *   browse the surroundings, photos, reviews, etc.
 *
 * - The iframe uses `loading="lazy"` so the map only loads when the user
 *   actually scrolls to it (avoids burning bandwidth for users who never
 *   open the Info tab).
 */
interface VenueMapProps {
  venue: string
  city?: string
  /** Map height in pixels. Defaults to 260 (a comfortable card-friendly size). */
  height?: number
}

export default function VenueMap({ venue, city, height = 260 }: VenueMapProps) {
  if (!venue) return null

  // Encode venue + city into a single query string. Google Maps is good at
  // resolving "Stadium Name, City, Country"-style queries.
  const queryText = city ? `${venue}, ${city}` : venue
  const query = encodeURIComponent(queryText)

  const embedSrc = `https://maps.google.com/maps?q=${query}&hl=en&z=15&output=embed`
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${query}`
  const searchHref = `https://www.google.com/maps/search/?api=1&query=${query}`

  return (
    <div className="space-y-3">
      {/* Map iframe */}
      <div
        className="relative w-full overflow-hidden rounded-xl border border-[#1e1e3a] bg-[#0a0a0f]"
        style={{ height }}
      >
        <iframe
          src={embedSrc}
          className="absolute inset-0 w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map of ${venue}${city ? `, ${city}` : ''}`}
          // Allow Google Maps to set its own scrolling behavior; the iframe
          // is bordered and rounded by the parent so it always reads as a
          // contained card element.
          allowFullScreen
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <a
          href={directionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-500/15 border border-indigo-500/30 rounded-lg text-sm font-semibold text-indigo-300 hover:bg-indigo-500/25 hover:text-white hover:border-indigo-500/50 transition-colors"
        >
          <Navigation size={14} />
          Get Directions
        </a>
        <a
          href={searchHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0f]/60 border border-[#1e1e3a] rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:border-indigo-500/40 transition-colors"
        >
          <MapPin size={14} />
          View on Google Maps
        </a>
      </div>
    </div>
  )
}
