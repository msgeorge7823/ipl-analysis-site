/**
 * Weather Service (Open-Meteo)
 * ----------------------------
 *
 * Fetches weather data for a venue + date + kickoff hour. Used by the
 * VenueWeather component on both the Live and MatchDetail pages.
 *
 * Why Open-Meteo
 * --------------
 * - No API key required (free, browser-callable, CORS-enabled)
 * - Has a historical archive going back to 1940
 * - Has a forecast endpoint extending ~16 days into the future
 * - Returns hourly granularity, which we need to pin the kickoff hour
 *
 * Endpoint choice
 * ---------------
 * Open-Meteo's archive (ERA5 reanalysis) typically lags real-time by ~5
 * days, so for matches within the last 14 days we use the FORECAST
 * endpoint (which serves recent past + near future). For older matches
 * we use the ARCHIVE endpoint.
 *
 * Timezone handling
 * -----------------
 * We pass `timezone=auto`, so Open-Meteo returns the hourly time array in
 * the venue's local clock. For Indian venues that's IST and we look up
 * the kickoff hour directly. For foreign venues (UAE, South Africa) we
 * convert the IST kickoff hour into the venue's local hour using the
 * `utc_offset_seconds` field that comes back in every response.
 */

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const ARCHIVE_URL = 'https://archive-api.open-meteo.com/v1/archive'

// ── Types ─────────────────────────────────────────────────────────────────

export interface GeocodeResult {
  latitude: number
  longitude: number
  name: string
  country: string
  timezone?: string
}

/**
 * Where the match sits relative to "now", computed purely from the match
 * date — independent of which Open-Meteo endpoint we end up calling.
 *
 *   past   = match date is before today (UTC) → show recorded weather
 *            AT KICKOFF on that day
 *   live   = match date is today (UTC) → show CURRENT weather conditions
 *            (the user is most likely watching it now)
 *   future = match date is after today (UTC) → show forecast AT KICKOFF
 *            on the match day
 *
 * This is the field the UI uses to choose its label/badge ("Recorded" vs
 * "Live" vs "Forecast"). The previous version conflated the endpoint
 * choice (archive vs forecast) with the semantic phase, which caused
 * recent past matches to display a misleading "Live forecast" pill.
 */
export type MatchPhase = 'past' | 'live' | 'future'

export interface MatchWeather {
  /** Where this match sits relative to today. Drives all UI labeling. */
  matchPhase: MatchPhase
  /** Temperature (°C). At kickoff for past/future, current for live. */
  temperature: number
  /** Relative humidity (%). */
  humidity: number
  /** Wind speed (km/h, 10m above ground). */
  windSpeed: number
  /** Cloud cover (%). */
  cloudCover: number
  /**
   * Precipitation in the relevant hour.
   * - past:   mm recorded in the kickoff hour
   * - live:   mm in the current observation window
   * - future: mm forecast for the kickoff hour
   */
  precipitationMm: number
  /**
   * Precipitation probability (%).
   * - past:   100 if precipitationMm ≥ 0.1, else 0 (binary — it either
   *           rained or it didn't)
   * - live:   probability of rain in the current/next hour
   * - future: model precipitation probability at kickoff
   */
  precipChance: number
  /**
   * Maximum precipitation probability across the match window
   * (kickoff hour through +4 hours). Lets the UI warn "rain may
   * interrupt play later". 0 for past matches.
   */
  precipChanceMatchWindow: number
  /** WMO weather code (see weatherCodeToDescription). */
  weatherCode: number
  /** Human-readable description of the weather code. */
  description: string
  /**
   * @deprecated Use `matchPhase === 'past'` instead. Kept for backward
   * compatibility with the existing VenueWeather render code.
   */
  isHistorical: boolean
  /** When this snapshot was taken (UTC ISO string), for "updated X ago" UI. */
  fetchedAt: string
  /**
   * Venue-local time of the data point in 24h "HH:00" format.
   * - past/future: kickoff time
   * - live: time the current observation was recorded
   */
  venueLocalKickoff: string
}

// ── WMO weather code → text ───────────────────────────────────────────────
// Reference: https://open-meteo.com/en/docs (WMO Weather interpretation codes)

const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
}

export function weatherCodeToDescription(code: number): string {
  return WEATHER_CODES[code] ?? 'Unknown'
}

/** Maps a WMO code into a coarse category we can colour-tint. */
export function weatherCodeCategory(
  code: number
): 'clear' | 'cloudy' | 'rain' | 'storm' | 'snow' | 'fog' {
  if (code === 0 || code === 1) return 'clear'
  if (code === 2 || code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 51 && code <= 67) return 'rain'
  if (code >= 71 && code <= 77) return 'snow'
  if (code >= 80 && code <= 82) return 'rain'
  if (code >= 85 && code <= 86) return 'snow'
  if (code >= 95) return 'storm'
  return 'cloudy'
}

// ── Geocoding ─────────────────────────────────────────────────────────────

const geocodeCache = new Map<string, GeocodeResult | null>()

export async function geocodeCity(city: string): Promise<GeocodeResult | null> {
  if (!city) return null
  if (geocodeCache.has(city)) return geocodeCache.get(city)!

  const url = `${GEOCODE_URL}?${new URLSearchParams({
    name: city,
    count: '1',
    language: 'en',
    format: 'json',
  })}`
  const res = await fetch(url)
  if (!res.ok) {
    geocodeCache.set(city, null)
    return null
  }
  const data = await res.json()
  const r = data?.results?.[0]
  if (!r) {
    geocodeCache.set(city, null)
    return null
  }
  const result: GeocodeResult = {
    latitude: r.latitude,
    longitude: r.longitude,
    name: r.name,
    country: r.country,
    timezone: r.timezone,
  }
  geocodeCache.set(city, result)
  return result
}

// ── Date helpers ──────────────────────────────────────────────────────────

function todayIso(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(
    2,
    '0'
  )}-${String(d.getUTCDate()).padStart(2, '0')}`
}

function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00Z').getTime()
  const db = new Date(b + 'T00:00:00Z').getTime()
  return Math.round((db - da) / (24 * 60 * 60 * 1000))
}

// ── Match phase ───────────────────────────────────────────────────────────

/**
 * Classify a match relative to today purely from its date.
 * This is independent of which Open-Meteo endpoint we end up calling —
 * the endpoint choice is an implementation detail driven by archive lag,
 * NOT by what the UI should label the data as.
 */
export function getMatchPhase(date: string): MatchPhase {
  if (!date) return 'past'
  const today = todayIso()
  if (date < today) return 'past'
  if (date > today) return 'future'
  return 'live'
}

// ── Main entry: getMatchWeather ───────────────────────────────────────────

export async function getMatchWeather(
  date: string,
  city: string,
  kickoffHourIst: number
): Promise<MatchWeather | null> {
  if (!date || !city) return null

  const geo = await geocodeCity(city)
  if (!geo) return null

  const phase = getMatchPhase(date)
  const today = todayIso()
  const daysFromToday = daysBetween(date, today)

  // Endpoint choice (archive vs forecast) is purely about data freshness:
  //   - Archive (ERA5 reanalysis) is the gold standard for historical data
  //     but lags real-time by ~5 days.
  //   - Forecast endpoint also serves recent past dates and the next
  //     ~16 days; we use it whenever archive can't.
  // Threshold of 5 days keeps us safely inside the archive's coverage.
  const useArchive = phase === 'past' && daysFromToday > 5

  // Hourly variables we always want
  const hourlyVars = [
    'temperature_2m',
    'relative_humidity_2m',
    'precipitation',
    'wind_speed_10m',
    'weather_code',
    'cloud_cover',
  ]
  // Forecast endpoint also exposes precipitation_probability
  if (!useArchive) hourlyVars.push('precipitation_probability')

  const params = new URLSearchParams({
    latitude: String(geo.latitude),
    longitude: String(geo.longitude),
    start_date: date,
    end_date: date,
    hourly: hourlyVars.join(','),
    timezone: 'auto',
  })

  // For LIVE matches we ALSO request the `current` snapshot from Open-Meteo
  // so we can render right-now conditions instead of the kickoff hour.
  if (phase === 'live') {
    params.set(
      'current',
      'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code,cloud_cover'
    )
  }

  const baseUrl = useArchive ? ARCHIVE_URL : FORECAST_URL
  const res = await fetch(`${baseUrl}?${params}`)
  if (!res.ok) {
    throw new Error(`Open-Meteo ${res.status}: ${baseUrl}`)
  }
  const data = await res.json()

  // ── LIVE branch: prefer the `current` observation ──
  if (phase === 'live' && data?.current) {
    const cur = data.current
    const fetchedAt = new Date().toISOString()
    const code = Number(cur.weather_code ?? 0)
    const precipMm = Number(cur.precipitation ?? 0)

    // For the rain-window forecast, peek at the next ~4 hourly slots ahead
    // of "now" so we can warn about rain coming later in the match.
    let maxProb = precipMm >= 0.1 ? 100 : 0
    if (data.hourly?.precipitation_probability) {
      const nowHour = new Date().getHours()
      const startIdx = Math.max(
        0,
        data.hourly.time.findIndex((t: string) =>
          t.startsWith(`${date}T${String(nowHour).padStart(2, '0')}`)
        )
      )
      for (
        let i = startIdx;
        i < Math.min(startIdx + 4, data.hourly.precipitation_probability.length);
        i++
      ) {
        const p = Number(data.hourly.precipitation_probability[i] ?? 0)
        if (p > maxProb) maxProb = p
      }
    }

    return {
      matchPhase: 'live',
      temperature: Number(cur.temperature_2m ?? 0),
      humidity: Number(cur.relative_humidity_2m ?? 0),
      windSpeed: Number(cur.wind_speed_10m ?? 0),
      cloudCover: Number(cur.cloud_cover ?? 0),
      precipitationMm: precipMm,
      precipChance: precipMm >= 0.1 ? 100 : 0,
      precipChanceMatchWindow: maxProb,
      weatherCode: code,
      description: weatherCodeToDescription(code),
      isHistorical: false,
      fetchedAt,
      // Show the actual observation time so the user can tell at a glance
      // how recent "live" really is.
      venueLocalKickoff: typeof cur.time === 'string' ? cur.time.slice(11, 16) : 'now',
    }
  }

  // ── PAST / FUTURE branch: pick the kickoff hour from the hourly array ──
  const hourly = data?.hourly
  if (!hourly?.time?.length) return null

  // Convert IST kickoff hour → venue-local hour using Open-Meteo's offset.
  // For Indian venues this is a no-op (offset = IST). For UAE it's IST−1.5h.
  // For South Africa it's IST−3.5h.
  const venueOffsetSec = data.utc_offset_seconds ?? 0
  const istOffsetSec = 5 * 3600 + 30 * 60
  const venueLocalHourFloat =
    (kickoffHourIst - (istOffsetSec - venueOffsetSec) / 3600 + 24) % 24
  const venueLocalHour = Math.round(venueLocalHourFloat)

  const targetTime = `${date}T${String(venueLocalHour).padStart(2, '0')}:00`
  let idx = hourly.time.findIndex((t: string) => t === targetTime)
  if (idx === -1) idx = Math.min(venueLocalHour, hourly.time.length - 1)

  const precipMm = Number(hourly.precipitation?.[idx] ?? 0)
  // For the past we know exactly what happened (binary). For the future
  // we have a probability from the model.
  const precipProb =
    phase === 'past'
      ? precipMm >= 0.1
        ? 100
        : 0
      : Number(hourly.precipitation_probability?.[idx] ?? 0)

  // Match-window rain risk (next 4 hours). Past = binary; future = max prob.
  let maxProb = precipProb
  if (phase === 'future' && hourly.precipitation_probability) {
    for (
      let i = idx;
      i < Math.min(idx + 4, hourly.precipitation_probability.length);
      i++
    ) {
      const p = Number(hourly.precipitation_probability[i] ?? 0)
      if (p > maxProb) maxProb = p
    }
  } else if (phase === 'past') {
    // Sum across the next 4 hours — was there significant rain during play?
    let totalMm = 0
    for (let i = idx; i < Math.min(idx + 4, (hourly.precipitation || []).length); i++) {
      totalMm += Number(hourly.precipitation[i] ?? 0)
    }
    maxProb = totalMm >= 0.5 ? 100 : 0
  }

  const code = Number(hourly.weather_code?.[idx] ?? 0)
  return {
    matchPhase: phase,
    temperature: Number(hourly.temperature_2m?.[idx] ?? 0),
    humidity: Number(hourly.relative_humidity_2m?.[idx] ?? 0),
    windSpeed: Number(hourly.wind_speed_10m?.[idx] ?? 0),
    cloudCover: Number(hourly.cloud_cover?.[idx] ?? 0),
    precipitationMm: precipMm,
    precipChance: precipProb,
    precipChanceMatchWindow: maxProb,
    weatherCode: code,
    description: weatherCodeToDescription(code),
    isHistorical: phase === 'past',
    fetchedAt: new Date().toISOString(),
    venueLocalKickoff: targetTime.slice(11),
  }
}

// ── Derived helpers (used by chips/UI) ────────────────────────────────────

/**
 * Heuristic dew likelihood based on weather conditions.
 * Dew forms when humidity is high, temperature is moderate-cool, wind is
 * low and skies are mostly clear. Returns 'unlikely' | 'possible' | 'likely'.
 */
export function dewLikelihood(w: MatchWeather): 'unlikely' | 'possible' | 'likely' {
  // High humidity is the dominant factor.
  if (w.humidity >= 75 && w.windSpeed < 12 && w.cloudCover < 60 && w.temperature < 32)
    return 'likely'
  if (w.humidity >= 65 && w.windSpeed < 15) return 'possible'
  return 'unlikely'
}

/** Simple rain risk bucket based on precipitation chance + recorded mm. */
export function rainRisk(w: MatchWeather): 'none' | 'low' | 'moderate' | 'high' {
  const p = w.precipChanceMatchWindow ?? w.precipChance
  if (w.precipitationMm >= 1) return 'high'
  if (p >= 60) return 'high'
  if (p >= 30) return 'moderate'
  if (p >= 10) return 'low'
  return 'none'
}
