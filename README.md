# FaithDate

**Date by faith, not by sight.**

A no-swipe Christian dating app where you hear who someone is before you ever see them. Voice intros first, photos only after both people choose to exchange them, and she always makes the first move.

This repository is the **Phase 1 clickable prototype**: every screen runs on mock data, from one Expo codebase that targets iOS and Android (Expo Go) and the web (PWA). No backend, payments, real calls, or real AI are wired up yet. Everything the UI needs goes through `data/adapter.ts`, so Phase 2 swaps `data/mock/` for a real backend without touching the screens.

Product behaviour is defined in [`SPEC.md`](./SPEC.md); the visual design lives in [`design/`](./design) (mockups 01 to 14). When they disagree, SPEC wins on behaviour and the design wins on look.

## Run it

Requirements: Node 20+ and npm. For phones, install the Expo Go app.

```bash
npm install
npm run web      # opens http://localhost:8081 (or use `npx expo start --web --port 47831`)
npm start        # Expo dev server; scan the QR code with Expo Go, or press w for web
```

Other scripts:

```bash
npm run typecheck   # tsc --noEmit (strict, no `any`)
npm run lint        # expo lint
npm test            # jest: mock adapter rules
```

## Try the demo account

On the welcome screen tap **I already have an account** to sign in as **Grace** (29, Atlanta, verified, seeking a spouse). Her account is pre-seeded with:

- three likes waiting (one is a Lily, pinned to the top),
- three matches in different states: Marcus (fast-lane chat, exchange ready), Jonathan (voice date booked for tomorrow 7 pm), Daniel (waiting on her first move, 31 hours left),
- 105 Talents in the wallet.

Tap **Create your profile** instead to walk the 10-step onboarding; quitting part-way and reopening the app resumes on the step you left.

## Dev panel

In development builds, **Profile → Developer panel** opens the simulator. It drives the "other side" of every flow so you can test alone:

- someone likes you, sends a Lily, likes you back, replies, requests or accepts a Photo Exchange,
- a voice date starts or finishes, a date plan gets confirmed,
- toggle verified, dating intent, gender, add Talents, reset today's batch,
- turn simulated replies on or off (when on, matches answer about 2.5 s after you message),
- **Reset everything** returns the mock database to its seed.

Mock state is persisted to AsyncStorage (`localStorage` on web) under `faithdate.mock.v1`.

## Project layout

```
app/              expo-router routes (thin; each renders a feature screen)
features/         one folder per feature: onboarding, discover, likes, saved, chats, profile, dev-panel
components/ui     primitives: Text, Button, Chip, Card, Avatar, IconButton, Screen, TabBar, ...
components/media  Waveform, VoicePlayer (expo-audio), BlurredPhotoFrame
theme/            Royal Covenant tokens (light + dark), typography (Sora + Inter), ThemeProvider
config/           every number and string the product depends on: rules, currency, faiths, prompts, Aunt Martha
data/adapter.ts   the DataAdapter interface and view models the UI consumes
data/mock/        MockAdapter + MockStore + seed data (40 profiles, demo account)
store/            Zustand session store (hydrates from the adapter)
hooks/            useAdapterQuery (re-runs when the adapter changes)
lib/              contact-info filter, profile strength, time formatting, analytics stub
assets/audio      generated placeholder clips so voice players actually play
__tests__/        jest tests for the adapter's rules
```

## Rules the code enforces

- No swipe gestures anywhere. Cards advance by tap, pagers by dots and arrows.
- Daily batch of 10, ranked (verified +2, voice intro +3, ghosting −1.5), 8 free likes a day.
- Women first: a match opens only when she sends the first message, within 48 h (one 24 h extension).
- Photo Exchange: full photos never leave the adapter before `exchanged_at` is set. Fast lane when both are verified spouse-seekers; otherwise 10 messages each (a voice note counts as 2) or a 5-minute voice date.
- Contact info (phone, email, handles) is blocked in chat until photos are exchanged.
- Aunt Martha: 5 free questions a week, then 1 Talent each; profile coaching is always free.
- Gold (`#E3B04B`) appears at most once per screen.
- Accessible by default: labelled icon buttons, 44 px touch targets, readable contrast in both themes.
