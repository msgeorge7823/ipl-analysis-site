---
name: Responsive Mobile-First Design
description: All pages must be responsive and mobile-first. Never build desktop-only layouts.
type: feedback
---

All UI must be responsive and mobile-first design. The user has emphasized this multiple times.

**Why:** The application is used on mobile devices and must look good at all screen sizes. Desktop-only layouts are unacceptable.

**How to apply:**
- Always start with mobile layout, then add md: and lg: breakpoints
- Tables must be horizontally scrollable on mobile (overflow-x-auto)
- Grids: start with grid-cols-1, add sm:grid-cols-2, md:grid-cols-3, lg:grid-cols-4
- Sidebars should collapse to top filters on mobile
- Text sizes: smaller on mobile, scale up with md:/lg:
- Padding: px-4 on mobile, px-6 on md+
- Cards should stack vertically on mobile
- Navigation must work on mobile (hamburger menu)
- No fixed widths that break on small screens
- Test all layouts mentally at 375px, 768px, 1024px, 1440px
