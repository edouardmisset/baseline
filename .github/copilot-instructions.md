# Baseline Dashboard - Copilot Instructions

## Project Context

This is a dashboard for Web Platform Baseline feature statuses (`webstatus.dev`). It uses **React**, **Astro**, **Vite**, and **TypeScript**. Focus on performance, lightweight components, and using the established design tokens.

## Tech Stack & Conventions

- **Framework**: React (via `@astrojs/react`). Use `className` (React convention).
- **Styling**: **CSS Modules** (`*.module.css`) for components.
  - Use **Design Tokens** (variables) from `src/style.css` for colors, spacing, radius, fonts.
  - Example: `var(--space-4)`, `hsl(var(--color-bg-hsl))`.
  - Global styles are minimal; prefer scoped modules.
- **State Management**: **TanStack Query** (`@tanstack/react-query`) for server state.
  - Cached/Persisted state logic is in `src/hooks`.
- **Linting/Formatting**: **Biome**. Run `pnpm check` to validate.
  - Do not use ESLint or Prettier commands; use `biome check`.

## Architecture & Patterns

- **API Layer**: `src/api/` contains pure async functions returning typed objects.
  - **Pattern**: `fetchFeature` aggregates data from multiple endpoints (status + metadata) and normalizes it.
  - **Error Handling**: API functions catch errors internally and return a "fallback" object with error descriptions rather than throwing, to allow partial UI rendering.
- **Components**: `src/components/`.
  - Colocate `component.tsx` with `component.module.css`.
  - Base UI (`@base-ui/react`) is used for accessible primitives.
- **Hooks**: Isolate logic in `src/hooks/`.

## Development Workflows

- **Validation**: Run `pnpm check` before committing. This runs Biome (format/lint), Stylelint, and TypeScript verification.
- **SVG**: Inline SVGs are preferred for icons over specific icon libraries for this small scale.

## Key Files

- `src/style.css`: global CSS variables (Design System Source).
- `src/api/webstatus.ts`: Data normalization logic.
- `src/components/feature-dashboard.tsx`: Main view controller.
- `src/constants/web-features.ts`: Default feature ID list.
