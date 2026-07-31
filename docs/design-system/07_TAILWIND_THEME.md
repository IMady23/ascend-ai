# Tailwind Theme Specification

This document translates the Design Tokens, Colors, Typography, and Spacing into a concrete `tailwind.config.ts` specification. This ensures developers do not invent new utility classes or arbitrary values.

## Why this translation?

Tailwind allows infinite flexibility (e.g. `w-[17px]`), which is the enemy of a consistent design system. By explicitly defining the `theme.extend` and overriding defaults where necessary, we enforce the "Premium Intelligence" aesthetic at the compiler level.

---

## 1. Color Configuration

We map our semantic and accent tokens into Tailwind's color object.

```typescript
// tailwind.config.ts snippet
colors: {
  // Base Palette (Dark-mode first)
  background: '#0F172A',
  surface: '#1E293B',
  surfaceElevated: '#273449',
  border: '#334155',
  
  // Text
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    disabled: '#64748B',
  },
  
  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',

  // Accents
  accent: {
    dashboard: '#3B82F6', // Blue
    mission: '#4F46E5',   // Indigo
    workout: '#A855F7',   // Purple
    nutrition: '#22C55E', // Green
    ai: '#06B6D4',        // Cyan
    hall: '#EAB308',      // Gold
    reports: '#F97316',   // Orange
    settings: '#64748B',  // Slate
  }
}
```

## 2. Typography Configuration

We override the default sans family to enforce Inter, and define our specific scales.

```typescript
fontFamily: {
  sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
},
fontSize: {
  xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
  sm: ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem', { lineHeight: '1.5rem' }],
  lg: ['1.125rem', { lineHeight: '1.75rem' }],
  xl: ['1.25rem', { lineHeight: '1.75rem' }],
  '2xl': ['1.5rem', { lineHeight: '2rem' }],
  '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em' }],
  '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
}
```

## 3. Spacing & Radius

Tailwind's default spacing is already an 8-point grid, so we mostly rely on it (`p-4` = 16px). However, we must explicitly define our constrained border radii.

```typescript
borderRadius: {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  '2xl': '24px',
  full: '9999px',
}
```

## 4. Shadows & Animations

```typescript
boxShadow: {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.6)',
  modal: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
  'glow-ai': '0 0 15px -3px rgba(6, 182, 212, 0.3)',
  'glow-gold': '0 0 20px -5px rgba(234, 179, 8, 0.4)',
},
transitionTimingFunction: {
  'ui': 'cubic-bezier(0.83, 0, 0.17, 1)',
  'pop': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
},
transitionDuration: {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
}
```

## Plugin Considerations
- Recommend `tailwindcss-animate` for standard enter/exit animations (dialogs, tooltips).
- Ensure `darkMode: 'class'` (or strictly media if we never offer a light theme, though 'class' is safer for forced contexts).
