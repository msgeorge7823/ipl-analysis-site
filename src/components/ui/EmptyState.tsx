// EmptyState — friendly placeholder shown when a list/table has no rows.
// Centered icon + headline, with optional description and an action CTA
// (e.g. "Clear filters", "Add first workspace").
interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: { label: string; onClick: () => void }
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-gray-500/10 border border-gray-500/20 flex items-center justify-center mb-4">
        {icon || (
          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        )}
      </div>
      <p className="text-gray-300 font-semibold text-sm mb-1">{title}</p>
      {description && (
        <p className="text-gray-500 text-sm text-center max-w-md mb-4">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2 rounded-lg bg-accent/10 border border-accent/20 text-accent text-sm font-medium hover:bg-accent/20 transition"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
