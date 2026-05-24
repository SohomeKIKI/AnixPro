# UI Design — Antigravity OS Style Guide

## Theme
- Background: `#0f172a` (deep navy-black)
- Surface/Card: `rgba(255,255,255,0.05)` with `backdrop-blur-xl`
- Border: `rgba(255,255,255,0.08)`
- Primary Accent: amber/gold gradient `#f59e0b → #d97706`
- Secondary Accent: violet `#8b5cf6`
- Success: `#10b981`
- Danger: `#ef4444`
- Text Primary: `#f8fafc`
- Text Secondary: `#94a3b8`

## Typography
- Font: **Inter** (Google Fonts, weights: 300, 400, 500, 600, 700)
- Headings: font-weight 600-700, tracking-tight
- Body: font-weight 400, line-height 1.6
- Mono: `JetBrains Mono` for data/code values

## Layout
- Sidebar: fixed left, 240px wide, glassmorphism
- Main area: scrollable, padded `px-6 py-8`
- Cards grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`, gap-4
- Max content width: 1400px, centered

## Core Components

### Card
```
rounded-2xl
bg-white/5
backdrop-blur-xl
border border-white/8
shadow-2xl
p-5
```

### Button (Primary)
```
bg-gradient-to-r from-amber-500 to-amber-600
text-black font-semibold
rounded-xl px-5 py-2.5
hover:shadow-amber-500/30 hover:shadow-lg
transition-all duration-200
```

### Button (Ghost)
```
bg-white/5 border border-white/10
text-white rounded-xl px-5 py-2.5
hover:bg-white/10
transition-all duration-200
```

### Input
```
bg-white/5 border border-white/10
text-white placeholder:text-slate-500
rounded-xl px-4 py-3
focus:outline-none focus:ring-2 focus:ring-amber-500/50
```

### Sidebar Nav Item
```
flex items-center gap-3 px-3 py-2.5
rounded-xl text-slate-400
hover:bg-white/8 hover:text-white
transition-all duration-150
Active: bg-amber-500/15 text-amber-400 border border-amber-500/20
```

## Animations (Framer Motion)

### Page / Section Fade-in
```js
initial: { opacity: 0, y: 20 }
animate: { opacity: 1, y: 0 }
transition: { duration: 0.4, ease: 'easeOut' }
```

### Card Hover Lift
```js
whileHover: { y: -4, scale: 1.01 }
transition: { duration: 0.2 }
```

### Stagger Children
```js
variants: {
  container: { staggerChildren: 0.07 },
  item: { opacity: 0 → 1, y: 20 → 0 }
}
```

## Dashboard Widget Cards
Reference the shared UI images:
- Dark card with subtle glow gradient in top-left corner
- Metric displayed large (e.g. "1h 25m", "88%")
- Small label in bottom-right corner
- Bar charts: dark bars with amber/gold highlight on active bar
- Timeline: horizontal scroll, floating pill-style task items

## Sidebar Structure
```
[Logo / Brand]
─────────────
Overview       (active)
Planner
Projects
Goals / Bucket List
Journal
Notes
Habits
Schedule
─────────────
Settings
Profile
```

## Responsive Breakpoints
- Mobile: sidebar collapses to bottom nav
- Tablet (md): sidebar icon-only mode
- Desktop (lg+): full sidebar + content grid

## Icons
- Use `lucide-react` — consistent, minimal stroke icons
- Size: 18px in nav, 20px in cards, 24px in headings
