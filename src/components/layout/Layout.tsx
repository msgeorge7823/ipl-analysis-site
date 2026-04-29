// Layout — the app's persistent chrome. Wraps every route with the Navbar,
// renders the active page through <Outlet/>, and pins the global footer.
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg text-textPrimary">
      <Navbar />
      {/* id="main" is the target of the skip-to-content link in index.html.
          tabIndex=-1 lets the link land focus here so screen-reader users
          start reading from the page content, not the navbar. */}
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Outlet />
      </main>
      <footer className="border-t border-border py-6 md:py-8 mt-12 md:mt-16" role="contentinfo">
        <div className="max-w-7xl mx-auto px-3 md:px-4 text-center text-xs md:text-sm text-textSecondary">
          <p className="break-words">IPL Analytics Platform &mdash; Data sourced from CricSheet (open-source)</p>
          <p className="mt-1 break-words">Not affiliated with BCCI, IPL, or any franchise</p>
        </div>
      </footer>
    </div>
  )
}
