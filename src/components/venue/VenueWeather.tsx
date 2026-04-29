import {
  CloudRain,
  Droplets,
  Wind,
  Thermometer,
  Cloud,
  Sun,
  CloudSnow,
  CloudFog,
  CloudLightning,
} from 'lucide-react'
import { useMatchWeather } from '@/hooks/useData'
import {
  weatherCodeCategory,
  dewLikelihood,
  rainRisk,
  type MatchWeather,
} from '@/services/weatherService'

/**
 * VenueWeather
 * ------------
 * Live or historical weather snapshot for a venue at the match's kickoff
 * hour. Used in the Info tab on both the Live and MatchDetail pages.
 *
 * Props:
 *   - date:         match date (YYYY-MM-DD)
 *   - city:         venue city, used for geocoding
 *   - kickoffHour:  IST hour (15 or 19) — passed in from the page so we
 *                   only encode the convention in one place
 *
 * Behaviour:
 *   - Historical matches (>14 days old): one-shot fetch, cached forever
 *   - Current/upcoming matches: 15-min auto-refresh, refetch on focus
 *   - Failure mode: hidden entirely (no error UI cluttering the venue card)
 */
interface Props {
  date: string
  city?: string
  kickoffHour: number
}

export default function VenueWeather({ date, city, kickoffHour }: Props) {
  const { data, isLoading, isError, dataUpdatedAt } = useMatchWeather(
    date,
    city,
    kickoffHour
  )

  if (!city) return null
  if (isLoading) return <WeatherSkeleton />
  if (isError || !data) return null

  return <WeatherCard weather={data} dataUpdatedAt={dataUpdatedAt} />
}

// ── Skeleton ──────────────────────────────────────────────────────────────

function WeatherSkeleton() {
  return (
    <div className="bg-[#0a0a0f]/40 border border-[#1e1e3a] rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3 w-32 bg-[#1e1e3a] rounded animate-pulse" />
        <div className="h-3 w-16 bg-[#1e1e3a] rounded animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-[#1e1e3a]/50 rounded animate-pulse" />
        ))}
      </div>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────

function WeatherCard({
  weather,
  dataUpdatedAt,
}: {
  weather: MatchWeather
  dataUpdatedAt: number
}) {
  const cat = weatherCodeCategory(weather.weatherCode)
  const Icon = iconForCategory(cat)
  const { color, accentBg, accentBorder } = colorsForCategory(cat)

  const dew = dewLikelihood(weather)
  const rain = rainRisk(weather)
  const dewLabel: Record<typeof dew, string> = {
    unlikely: 'Dew unlikely',
    possible: 'Dew possible',
    likely: 'Dew likely',
  }
  const rainLabel: Record<typeof rain, string> = {
    none: 'No rain expected',
    low: 'Slight rain risk',
    moderate: 'Moderate rain risk',
    high: 'High rain risk',
  }
  const rainColor: Record<typeof rain, string> = {
    none: 'text-green-400 border-green-400/30 bg-green-400/10',
    low: 'text-yellow-300 border-yellow-300/30 bg-yellow-300/10',
    moderate: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
    high: 'text-red-400 border-red-400/30 bg-red-400/10',
  }

  // ── Phase-based copy and badges ──────────────────────────────────────
  // The card label/heading varies by whether we're showing recorded data
  // for a finished match, current conditions for a live one, or a
  // forecast for an upcoming one.
  const phase = weather.matchPhase
  const heading =
    phase === 'live'
      ? 'Current weather at the venue'
      : phase === 'future'
        ? 'Weather forecast for match day'
        : 'Weather on match day'
  const subline =
    phase === 'live'
      ? `${weather.description} \u00b7 observed at ${weather.venueLocalKickoff} local`
      : phase === 'future'
        ? `${weather.description} \u00b7 forecast at kickoff (${weather.venueLocalKickoff} local)`
        : `${weather.description} \u00b7 recorded at kickoff (${weather.venueLocalKickoff} local)`
  const badgeCopy =
    phase === 'live' ? 'Live' : phase === 'future' ? 'Forecast' : 'Recorded'
  const badgeClass =
    phase === 'live'
      ? 'text-green-400 bg-green-400/10 border-green-400/30'
      : phase === 'future'
        ? 'text-blue-300 bg-blue-300/10 border-blue-300/30'
        : 'text-gray-400 bg-white/5 border-[#1e1e3a]'

  return (
    <div
      className="rounded-xl border p-4 sm:p-5"
      style={{
        background: `linear-gradient(180deg, ${accentBg}, transparent 80%)`,
        borderColor: accentBorder,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <Icon className="shrink-0" size={28} style={{ color }} />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{heading}</h3>
            <p className="text-[11px] text-gray-400 truncate">{subline}</p>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border inline-flex items-center gap-1.5 ${badgeClass}`}
          >
            {phase === 'live' && (
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
              </span>
            )}
            {badgeCopy}
          </span>
          <span className="text-[10px] text-gray-500 mt-1 tabular-nums">
            Updated {timeAgo(dataUpdatedAt)}
          </span>
        </div>
      </div>

      {/* Metric grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Metric
          icon={<Thermometer size={14} />}
          label="Temperature"
          value={`${Math.round(weather.temperature)}°C`}
          tone="white"
        />
        <Metric
          icon={<CloudRain size={14} />}
          label={
            phase === 'past'
              ? 'Rainfall'
              : phase === 'live'
                ? 'Rain Now'
                : 'Rain Chance'
          }
          value={
            phase === 'past'
              ? `${weather.precipitationMm.toFixed(1)} mm`
              : phase === 'live'
                ? weather.precipitationMm > 0
                  ? `${weather.precipitationMm.toFixed(1)} mm`
                  : 'None'
                : `${weather.precipChance}%`
          }
          tone={
            (phase === 'past'
              ? weather.precipitationMm >= 0.1
              : phase === 'live'
                ? weather.precipitationMm > 0
                : weather.precipChance >= 30)
              ? 'red'
              : 'white'
          }
        />
        <Metric
          icon={<Droplets size={14} />}
          label="Humidity"
          value={`${Math.round(weather.humidity)}%`}
          tone={weather.humidity >= 75 ? 'blue' : 'white'}
        />
        <Metric
          icon={<Wind size={14} />}
          label="Wind"
          value={`${Math.round(weather.windSpeed)} km/h`}
          tone="white"
        />
      </div>

      {/* Computed condition chips */}
      <div className="mt-4 pt-4 border-t border-[#1e1e3a]/60 flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold border ${rainColor[rain]}`}
        >
          <CloudRain size={11} />
          {rainLabel[rain]}
          {!weather.isHistorical && weather.precipChanceMatchWindow > weather.precipChance && (
            <span className="opacity-70">
              {' '}&middot; up to {weather.precipChanceMatchWindow}% later
            </span>
          )}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold border bg-blue-400/10 border-blue-400/30 text-blue-300">
          <Droplets size={11} />
          {dewLabel[dew]}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold border bg-white/5 border-[#1e1e3a] text-gray-300">
          <Cloud size={11} />
          {Math.round(weather.cloudCover)}% cloud cover
        </span>
      </div>

      <p className="text-[10px] text-gray-500 mt-3">
        Source: Open-Meteo &middot;{' '}
        {phase === 'past'
          ? 'Recorded weather for the day of the match (does not change).'
          : phase === 'live'
            ? 'Current observations refresh every 5 minutes while the match is live.'
            : 'Forecast for the match day, refreshed every 15 minutes as the model updates.'}
      </p>
    </div>
  )
}

// ── Subcomponents ─────────────────────────────────────────────────────────

function Metric({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: 'white' | 'red' | 'blue'
}) {
  const valueClass =
    tone === 'red'
      ? 'text-red-400'
      : tone === 'blue'
        ? 'text-blue-300'
        : 'text-white'
  return (
    <div className="bg-[#0a0a0f]/60 border border-[#1e1e3a] rounded-lg px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">
        {icon}
        {label}
      </div>
      <div className={`text-lg font-extrabold tabular-nums ${valueClass}`}>{value}</div>
    </div>
  )
}

// ── Style helpers ─────────────────────────────────────────────────────────

function iconForCategory(cat: ReturnType<typeof weatherCodeCategory>) {
  switch (cat) {
    case 'clear':
      return Sun
    case 'cloudy':
      return Cloud
    case 'rain':
      return CloudRain
    case 'storm':
      return CloudLightning
    case 'snow':
      return CloudSnow
    case 'fog':
      return CloudFog
  }
}

function colorsForCategory(cat: ReturnType<typeof weatherCodeCategory>) {
  switch (cat) {
    case 'clear':
      return {
        color: '#facc15',
        accentBg: 'rgba(250, 204, 21, 0.06)',
        accentBorder: 'rgba(250, 204, 21, 0.25)',
      }
    case 'cloudy':
      return {
        color: '#94a3b8',
        accentBg: 'rgba(148, 163, 184, 0.06)',
        accentBorder: '#1e1e3a',
      }
    case 'rain':
      return {
        color: '#60a5fa',
        accentBg: 'rgba(96, 165, 250, 0.08)',
        accentBorder: 'rgba(96, 165, 250, 0.25)',
      }
    case 'storm':
      return {
        color: '#a78bfa',
        accentBg: 'rgba(167, 139, 250, 0.08)',
        accentBorder: 'rgba(167, 139, 250, 0.25)',
      }
    case 'snow':
      return {
        color: '#e0e7ff',
        accentBg: 'rgba(224, 231, 255, 0.06)',
        accentBorder: 'rgba(224, 231, 255, 0.25)',
      }
    case 'fog':
      return {
        color: '#cbd5e1',
        accentBg: 'rgba(203, 213, 225, 0.06)',
        accentBorder: '#1e1e3a',
      }
  }
}

function timeAgo(ms: number): string {
  if (!ms) return 'just now'
  const diff = Date.now() - ms
  const sec = Math.round(diff / 1000)
  if (sec < 60) return `${sec}s ago`
  const min = Math.round(sec / 60)
  if (min < 60) return `${min}m ago`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.round(hr / 24)
  return `${day}d ago`
}
