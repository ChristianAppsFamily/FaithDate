# FaithDate — Cursor Build Prompt

## How to use this kit

1. Create an empty folder for the app and open it in Cursor.
2. Copy everything from this kit into the folder root: `SPEC.md`, `design/`, `.cursor/rules/faithdate.mdc`, and this file.
3. Open Cursor Agent mode and paste the prompt below.
4. After each milestone, test it (Expo Go on your phone plus the browser), then reply "Approved, next milestone" or tell it what to fix.

---

## Paste this into Cursor (Agent mode)

You are building **FaithDate**, a no-swipe Christian dating app for people serious about finding a spouse. Tagline: "Date by faith, not by sight."

**Read these before writing any code:**
- `SPEC.md` is the source of truth for features, rules, data model, and phases. Read all of it.
- `design/` has 14 approved screen mockups (01 to 14). They are HTML files written for a design tool. Ignore `support.js`, `<x-dc>`, `<helmet>`, `{{ }}` placeholders, and `<sc-for>` / `<sc-if>` tags, and treat each file as a visual and copy reference. Rebuild every screen natively in React Native. Match the layout, spacing, colors, copy, and hierarchy as closely as you can.
- `.cursor/rules/faithdate.mdc` has standing rules. Follow them on every change.

**Scope: build Phase 1 only** (section 12 of SPEC.md). That is a clickable prototype on mock data, running in Expo Go and in the web browser from one codebase. Do not set up Supabase, payments, real calls, or real AI yet. Everything reads through the data adapter in `data/adapter.ts`, implemented by `data/mock/`, so Phase 3 can swap in Supabase without UI changes.

**Work in milestones. Stop after each one, summarize what you built and how to test it, and wait for my approval.**

**Milestone 0 — Plan.** Before any code, reply with: the file and folder tree you'll create, the libraries you'll install (with why), and any questions or conflicts you found between SPEC.md and the designs. Wait for my OK.

**Milestone 1 — Foundation**
- Expo (latest SDK), TypeScript, expo-router, Expo web enabled
- Theme tokens from SPEC.md section 3 (Royal Covenant, light and dark) in `theme/`. Fonts Sora (headings) and Inter (body) via `@expo-google-fonts`
- Shared components: Button (primary, secondary, ghost, gold), Chip, Card, BlurredPhotoFrame, VoicePlayer (play button + waveform), ProgressBar, Avatar (blurred and AM coach variants), TabBar
- Navigation shell: onboarding stack, then tabs Discover, Likes, Saved, Chats, Profile
- `config/` files: rules.ts, currency.ts, faiths.ts, auntMartha.ts with all numbers and copy from SPEC.md
- `data/adapter.ts` interface with every function listed in SPEC.md section 10, `data/mock/` implementation and seed data (40 Christian profiles per section 10)
- Dev panel (section 6, item 17) reachable from Profile in dev builds

**Milestone 2 — Onboarding** (SPEC.md section 5, designs 01 to 04)
- All 10 steps with a progress bar, saving and resuming, 18+ birthdate check
- Real voice recording, playback, and re-record with expo-audio (works on device and web)
- Finish screen with profile strength, card preview, Talents reward, and the "Have Aunt Martha review my profile" link

**Milestone 3 — Discover and likes** (designs 05, 06)
- Daily batch of 10, ranking rules, "You're caught up" screen, filter sheet with "Has voice intro"
- Like sheet targeting a specific prompt or the voice intro, with an optional text or voice comment
- Save (private bookmarks tab), Likes inbox, Lilies pinned with gold accent, Talents wallet (mock purchases)

**Milestone 4 — Match to Photo Exchange** (designs 07, 08, 09, 10, 14)
- Match moment ("You've made a match by faith!")
- Women-first chat start with the 48h window and one 24h extension
- Chats list with Aunt Martha pinned at the top
- Chat with text and voice notes, contact info blocking before exchange, Close kindly
- Photo Exchange: fast lane and standard rules, "Not yet," simultaneous reveal moment

**Milestone 5 — New features** (designs 11, 12, 13)
- Front Porch voice dates: invite, accept or schedule, call screen with 20-minute timer, +10 min (both agree), end, report, post-call prompt. Simulate the call (no real audio connection yet)
- Plan a date: form, date card in chat, accept / suggest changes / not yet, confirmed card, add-to-calendar (.ics), share with accountability partner, day-after check-in
- Aunt Martha: her thread with canned replies from mock data, starter chips, weekly free-question counter and Talent charge, all 4 entry points (profile, chat header, plan a date, check-in), "Share with Aunt Martha" consent step before any chat messages are included
- Notifications list and Settings (section 6, items 11 to 13)

**Milestone 6 — Acceptance pass**
- Go through the Phase 1 checklist in SPEC.md section 14 item by item and report pass or fail for each
- Test light and dark mode, phone-width web, and Expo Go on iOS and Android
- Fix anything failing, then give me a final summary and a list of known gaps for Phase 2

**Rules for every milestone**
- Never add a swipe gesture anywhere
- Never change copy that comes from SPEC.md or the designs without asking me first. If you think copy should change, suggest it and wait
- Gold (#E3B04B) appears at most once per screen
- Full photos are never returned by the adapter before `exchanged_at` is set
- Use real accessible elements: labels on icon buttons, 44px minimum touch targets, readable contrast
- Keep components small and typed. No `any`
- If SPEC.md and a design disagree, SPEC.md wins on behavior and the design wins on look. Tell me when this happens
- If something is unclear, ask instead of guessing
