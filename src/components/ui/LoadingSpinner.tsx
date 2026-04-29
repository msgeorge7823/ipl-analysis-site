// LoadingSpinner — centered spinner with an optional caption. Used by
// pages while React Query loads; sized via the `size` prop.
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

const SIZES = {
  sm: 'w-5 h-5 border-[1.5px]',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className={`${SIZES[size]} border-accent/30 border-t-accent rounded-full animate-spin`} />
      {text && (
        <p className="text-gray-500 text-sm mt-3">{text}</p>
      )}
    </div>
  )
}
