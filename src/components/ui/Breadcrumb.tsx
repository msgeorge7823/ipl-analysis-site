// Breadcrumb — small "Home > … > current" trail rendered at the top of
// detail pages. Items with a `path` link out; the last (current) item is
// usually pathless and shown as plain text.
import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  path?: string
}

interface Props {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: Props) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
      <Link to="/" className="hover:text-[#6366f1] transition">Home</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" />
          </svg>
          {item.path ? (
            <Link to={item.path} className="hover:text-[#6366f1] transition">{item.label}</Link>
          ) : (
            <span className="text-gray-300 font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
