// Top-level app shell: wires up React Query, the router, the shared Layout,
// and code-split page routes. Every URL the user can hit is registered here.
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense } from 'react'
import Layout from '@/components/layout/Layout'

// React Query client. 30-min staleTime keeps the heavy IPL JSON shards in
// memory across navigations; retry=1 avoids long failure cascades on flaky data fetches.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30,
      retry: 1,
    },
  },
})

// Lazy-loaded pages. Each page is its own chunk so the initial bundle stays
// small and a user landing on /home doesn't pay for /analytics or /matches.
const Home = lazy(() => import('@/pages/Home'))
const Players = lazy(() => import('@/pages/Players'))
const PlayerDetail = lazy(() => import('@/pages/PlayerDetail'))
const Coaches = lazy(() => import('@/pages/Coaches'))
const CoachDetail = lazy(() => import('@/pages/CoachDetail'))
const Teams = lazy(() => import('@/pages/Teams'))
const TeamDetail = lazy(() => import('@/pages/TeamDetail'))
const Seasons = lazy(() => import('@/pages/Seasons'))
const SeasonDetail = lazy(() => import('@/pages/SeasonDetail'))
const Matches = lazy(() => import('@/pages/Matches'))
const MatchDetail = lazy(() => import('@/pages/MatchDetail'))
const Records = lazy(() => import('@/pages/Records'))
const Ratings = lazy(() => import('@/pages/Ratings'))
const Venues = lazy(() => import('@/pages/Venues'))
const VenueDetail = lazy(() => import('@/pages/VenueDetail'))
const Schedule = lazy(() => import('@/pages/Schedule'))
const Analytics = lazy(() => import('@/pages/Analytics'))
const Auctions = lazy(() => import('@/pages/Auctions'))
const ScoutDetail = lazy(() => import('@/pages/ScoutDetail'))
const Education = lazy(() => import('@/pages/Education'))
const Sponsors = lazy(() => import('@/pages/Sponsors'))
const LiveMatch = lazy(() => import('@/pages/LiveMatch'))
const News = lazy(() => import('@/pages/News'))

// Spinner shown while a lazy page chunk is downloading.
function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

// Root component. Mounts providers and the route table. Layout is the shared
// chrome (navbar/footer/etc.) wrapping every route.
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/players" element={<Players />} />
              <Route path="/players/:id" element={<PlayerDetail />} />
              <Route path="/coaches" element={<Coaches />} />
              <Route path="/coaches/:id" element={<CoachDetail />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamDetail />} />
              <Route path="/seasons" element={<Seasons />} />
              <Route path="/seasons/:year" element={<SeasonDetail />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/matches/:id" element={<MatchDetail />} />
              <Route path="/records" element={<Records />} />
              <Route path="/ratings" element={<Ratings />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/venues/:name" element={<VenueDetail />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/schedule/:year" element={<Schedule />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/auctions" element={<Auctions />} />
              <Route path="/scout/:id" element={<ScoutDetail />} />
              <Route path="/education" element={<Education />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/live" element={<LiveMatch />} />
              <Route path="/news" element={<News />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
