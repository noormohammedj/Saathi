# Saathi

A community app for ISKCON Coimbatore (iOS and Android). It matches devotees by skill so they can serve together, tracks sadhana streaks and credits, and lets them redeem credits and donate to sevas. The interaction model is a swipe deck, as in social discovery apps, but the brand is original: never use another company's name, logo, colours, copy or screenshots.

The product brief, design language and production architecture are in `docs/ARCHITECTURE.md`. The production schema and row-level security are in `supabase/migrations/`.

## Layout
- `apps/mobile` – Expo (React Native) app using Expo Router, with routes in `src/app`. Ships native iOS/Android builds through EAS.
  - `src/data` – typed mock data. Temple facts, sevas and donation tiers come from iskconcoimbatore.com.
  - `src/store/app-store.ts` – Zustand store persisted to AsyncStorage. The prototype stands in for Supabase here.
  - `src/lib/match.ts` – seva-match scoring.
  - `src/components` – swipe deck, japa ring, tab bar, avatar, mandala and other shared UI.
- `apps/web` – Next.js (App Router, Tailwind) for the landing page and, later, the admin console.
- `packages/shared` – design tokens (`tokens.js`) and shared types.
- `supabase/` – SQL migrations.

## Commands
- iOS: `cd apps/mobile && npx expo run:ios` (native dev build). Then `npx expo start` for JS-only changes.
- Android: `npx expo run:android` (needs the Android SDK and an emulator).
- Typecheck and lint: `npx tsc --noEmit && npx expo lint`
- Web: `cd apps/web && npm run dev`

## Conventions
- TypeScript strict.
- Use `npx expo install` for native packages.
- Gestures and animations run on the UI thread: Reanimated 4 worklets and Gesture Handler 3 hooks (`usePanGesture`).
- Use colours from `@/theme` (`C`, `TONE`, `usePalette()`). Never hard-code hex values in new screens.
- Every screen supports dark mode, labels icon-only buttons, and keeps touch targets at 44 pt or larger.
- Private contact data is read only through `contactFor()`, which returns null for non-admins. Production mirrors this with row-level security on `member_private`.
