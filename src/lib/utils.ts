// Tiny class-name helper used everywhere in JSX. Combines clsx's
// conditional-class syntax with tailwind-merge's last-wins conflict
// resolution so `cn("p-2", isLg && "p-4")` collapses correctly.
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
