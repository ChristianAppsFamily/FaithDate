# FaithDate — Design Prototype Spec (for Claude Code)

Save this in the repo root as `SPEC.md` and tell Claude Code: "Build the prototype described in SPEC.md, phase by phase. Stop after each phase so I can review."

---

## 1. What we're building

FaithDate is a no-swipe, Christian dating app for people who are serious about finding a spouse. You hear and read who someone is before you see them. Photos stay blurred until both people agree to a **Photo Exchange**, and then both sets of photos appear at the same moment.

Tagline: **"Date by faith, not by sight."**

**Launch scope: Christian only.** Faith is a config value, not hardcoded, so other faith rooms can be added later without a rebuild. Ship and show only the Christian room.

Positioning: Hinge-style profiles + Muzz-style photo privacy and marriage intent + Bumble-style women-first messaging + Coffee Meets Bagel-style daily batch. No swiping anywhere. Direct Christian comps to study: Higher Bond, Upward.

**This prototype must become the final build.** Use the production stack and real data model from day one. The only temporary part is the data source: everything reads through a data adapter that starts on mock data and later switches to Supabase with no UI changes.

## 2. Stack and platforms

- **One codebase, web + iOS + Android:** Expo (latest SDK), TypeScript, expo-router, with Expo web enabled so the same app runs as an installable web app (PWA) and as native apps
- expo-audio for recording and playback
- react-native-reanimated for motion
- Supabase (Postgres, Auth, Storage, Realtime, Edge Functions) in Phase 3
- Payments (Phase 4): Stripe on web, in-app purchases on iOS and Android via RevenueCat. Confirm current App Store and Google Play rules on digital currency before launch
- State: Zustand or React Query (keep it simple)
- Folder structure: `app/` (routes), `components/`, `features/` (one folder per feature), `data/` (adapter + mock + supabase), `theme/`, `config/`
- Every screen must work at phone width on web and native

## 3. Design direction — "Royal Covenant"

Looks like a premium consumer product (Hinge, Calm, Airbnb level polish). Not a template. Never use terracotta, cream, or beige.

### Color tokens (`theme/colors.ts`)

**Light mode**

| Token | Hex | Use |
|---|---|---|
| plumDeep | #3A1A5C | Headings, pressed states, text on gold |
| primary | #5B2A86 | Primary buttons, active tabs, links |
| lavender | #B9A3E3 | Borders, secondary accents, waveform |
| lavenderTint | #EEE8FA | Card backgrounds, chips, blurred photo frame |
| gold | #E3B04B | Spouse-seeker badge, Photo Exchange moment, Lilies (use sparingly) |
| ink | #1C1726 | Body text |
| muted | #6E6880 | Secondary text |
| surface | #FFFFFF | Screen background |
| surfaceAlt | #F7F4FC | Grouped sections |

**Dark mode**

| Token | Hex | Use |
|---|---|---|
| background | #14101E | Screen background |
| surface | #1F1830 | Cards |
| surfaceAlt | #2A2140 | Raised elements, inputs |
| primary | #B9A3E3 | Primary buttons (with plumDeep text) |
| lavender | #8C74C2 | Borders, waveform |
| gold | #E3B04B | Same accent role as light |
| text | #F4F0FB | Body text |
| muted | #A79FBA | Secondary text |

Rules:
- Gold is an accent only. One gold element per screen at most, reserved for spouse-seeker badges, Lilies, and the Photo Exchange.
- Text on gold is always plumDeep. Text on primary (light) is white.
- Light and dark mode from day one. All colors, spacing, radii as tokens in `theme/`.

### Feel
- Typography: one confident display font for headings, one clean sans for body.
- Rounded pill buttons, generous spacing, soft card corners.
- Blurred photos sit in a lavenderTint frame with a lock icon and "Photos shared after exchange." Never a gray box.
- Calm, reverent tone in copy. No gamified hype language.

## 4. Reverse-engineering map (pattern → source → our version)

Clone the pattern, never the branding, copy, or assets.

| Our feature | Pattern source | How we do it |
|---|---|---|
| Faith and life-stage onboarding | Muzz, Upward, Higher Bond | Denomination, attendance, marital history, kids, intent |
| Marriage intent | Muzz | "Seeking a spouse" or "Dating with purpose," shown on profile |
| Blurred photos by default | Muzz | All photos blurred until a Photo Exchange completes |
| Photo Exchange | Muzz (reveal to a match), our twist | Two-way exchange. Nothing releases until both agree. Both appear at once |
| Women-first after match | Bumble | She opens the chat or invites his voice intro. He can't message first |
| Selfie verification | Muzz | Required before liking (mocked in prototype). Unlocks spouse-seeker fast lane |
| Accountability partner | Muzz (chaperone) | Optional invite. Weekly count summary only, never content |
| Prompt profiles | Hinge | Written prompts + optional voice intro |
| Like a specific thing | Hinge | A like targets one prompt or the voice intro, with optional comment |
| Standout gift | Hinge (Roses), our version | Send a Lily, bought with Talents |
| Reply nudges | Hinge | Unanswered matches show a banner before you browse more |
| Daily batch | Coffee Meets Bagel | 10 profiles per day, refresh 7pm local, then "You're caught up" |
| Text-first cards | Lex | Typography-forward cards that feel complete without photos |
| Voice dates ("Front Porch") | Muzz and Hinge in-app calls, Matter.dating audio dates | Voice-only calls between matches, women-first, before photos |
| Plan a first date | Hinge Date Ideas, our version | A form both people confirm: activity, time, public place, who pays. No booking |
| AI dating coach "Aunt Martha" | Hinge Prompt Feedback and Convo Starters | A warm Christian auntie who coaches, never writes messages for you |

## 5. Onboarding (10 steps)

A progress bar runs across every step. Each step saves as you go so people can quit and resume. Copy is warm and short.

1. **Welcome + how it works** — 3 swipeable intro cards with Next, Skip, Done:
   - "Hear who they are" (voice and words first)
   - "Like what they said" (like a specific answer)
   - "Exchange photos when you're both ready"
2. **Basics** — first name, gender (Male / Female), birthdate (exact date, must be 18+, only age is shown), location (city)
3. **Faith** — denomination, church attendance, home church (optional)
4. **Life stage**
   - Marital history: Never married / Divorced / Widowed. If divorced or widowed, "Since what year?" (optional)
   - Do you have children? Yes / No. If yes, ages
   - Do you want children? Yes / No / Open / Not sure
5. **Intent** — Seeking a spouse / Dating with purpose
6. **Verify** — selfie check (mock pass). Explains that verified spouse-seekers get faster Photo Exchange
7. **Photos** — upload 2 to 6. Copy: "Your photos stay private until you and a match both choose to exchange."
8. **Voice intro (optional, encouraged)** — 30 to 90 seconds. Pick a starter prompt: "Who I am," "What my faith looks like day to day," "What I'm looking for." Record, replay, re-record. Skip is allowed but shows: "Profiles with a voice intro get noticed more."
9. **Your story**
   - Answer 3 prompts. Default set from the original FaithDate brief:
     - "Describe your perfect day. What activities do you enjoy and what makes you happiest?"
     - "If you could travel anywhere right now, where would you go and why?"
     - "What's one interesting thing most people don't know about you?"
   - Users can swap any of these for other prompts in the library
   - Interests (chips: Reading, Sports, Music, Travel, plus more, plus Other)
   - Core values (short text)
   - Testimony / faith journey (optional, text or voice)
10. **Preferences** — age range, distance, denominations you're open to, open to someone divorced, open to someone with children

**Finish screen** — profile strength meter, preview of your card as others see it, and a Talents reward for completing your profile. Then into the daily batch.

## 6. Main screens and flows

1. **Discover (daily batch)** — vertical cards
   - Cards with voice: large play button and waveform at the top, "Voice" badge, then prompts
   - Cards without voice: prompts first
   - Every card: first name, age, city, denomination, intent badge (gold if Seeking a spouse), blurred photo frame, Save and Like
   - Filter sheet includes "Has voice intro"
   - Text-only users see a nudge to add a voice intro
2. **Save** — private bookmark so you can keep someone past the daily refresh. Not required before liking. The other person is never notified. Saved list lives in its own tab
3. **Like sheet** — opened from a specific prompt or the voice intro. Optional comment (text or voice). Option to send a Lily instead of a standard like
4. **Likes inbox** — who liked you, what they liked, their comment. Lilies pinned at the top with gold accent. Like back to match, or pass
5. **Match moment** — full-screen celebration with prayer hands icon and the copy: **"You've made a match by faith!"** Action: "Open to view your match."
6. **Women-first chat start**
   - After a match, she sees two options: "Start the conversation" or "Ask him to introduce himself"
   - "Ask him to introduce himself" lets him send one voice intro (text if he has no mic access)
   - He cannot message until she does one of these
   - She has 48 hours, with one 24-hour extension. Then the match expires quietly
7. **Matches / Chats list** — each row shows chat status and Photo Exchange status
8. **Chat** — text and voice notes. Header shows Exchange status. Contact info blocked before exchange with a gentle explanation
9. **Photo Exchange flow**
   - Either person can tap "Exchange photos" once the chat is open
   - Other person sees "Exchange" or "Not yet"
   - "Not yet" keeps the chat open, no penalty
   - When both agree, a full-screen moment (gold accent) shows both photo sets at once
10. **Close kindly** — end a match with a short respectful closing message (templates) instead of disappearing
11. **Notifications** — likes, Lilies, matches, messages, exchange requests. In-app list plus push (Phase 4)
12. **Wallet** — Talents balance, how to earn, how to spend, purchase bundles (purchase is mocked in prototype)
13. **Settings**
    - Edit profile, preferences, account, notification preferences, privacy, accountability partner, dark mode
    - Advertisements: Remove ads and Promote my profile as "Coming soon" stubs
    - **Aunt Martha settings:** turn her nudges on or off, clear your conversation history with her, see how many free questions are left this week
    - Help and support, submit feedback, rate us, guidelines, privacy policy, terms, log out
14. **Front Porch (voice dates)**
    - Available once the chat is open. "Invite to a voice date" in the chat header and menu
    - Women-first: she sends the invite, or accepts one he sends after she has opened the chat
    - The other person taps "Join now" or picks a time. Both get a reminder
    - Call screen: voice only, both first names, blurred avatars, a gentle 20-minute timer with "Add 10 minutes" (both must tap), mute, end, report
    - Never recorded. No contact info shown
    - After the call: "Want to talk again?" and a quick private rating
    - A completed voice date counts toward Photo Exchange availability
15. **Plan a date (form, no booking)**
    - Available after a completed Photo Exchange. "Plan a date" in the chat menu
    - The proposer fills a short form: activity (coffee, brunch, walk, church event, dinner, other), 2 to 3 time options, a public place (place search), and who pays: "I'll treat," "Let's split," or "Each pays our own"
    - The other person sees a date card in the chat: "Accept" (picks one time), "Suggest changes," or "Not yet"
    - When both confirm: confirmed date card in chat, add-to-calendar for both, reminders the day before and 2 hours before
    - Optional: "Share my date plan" sends the time and place to their accountability partner or a friend by link
    - Day after: private "How did it go?" check-in (Great, Good, Not a fit) with an optional note
    - The app never books, reserves, or takes payment for the date
16. **Aunt Martha (AI dating coach)** — full details in section 7b
    - Pinned at the top of the Chats list as her own conversation, with her avatar and an "AI coach" label
    - "Ask Aunt Martha" entry points: profile builder (prompt and bio feedback), chat menu (conversation help), Plan a date (date prep), and the day-after check-in (reflection)
    - Starter chips in her thread: "Look at my profile," "What should I ask him/her?," "First date ideas," "Is this a red flag?," "Dating after divorce"
17. **Dev panel (prototype only)** — simulate incoming like, Lily, match, message, exchange request, voice date invite, or date plan; fast-forward message counts; reset daily batch; toggle verified, intent, and gender; add Talents

## 7. Core rules (all numbers in `config/rules.ts`)

- Daily batch: 10 profiles, refresh 7pm local
- Free likes per day: 8
- **Ranking:** verified profiles and profiles with a voice intro rank higher. High ghost_count ranks lower
- **Women-first:** after a match, only the woman can start the chat or invite his voice intro. 48h window, one 24h extension
- **Photo Exchange availability:**
  - Fast lane: both verified AND both Seeking a spouse → "Exchange photos" prompt appears as soon as the chat opens
  - Standard: prompt appears after 10 messages from each person (voice note counts as 2). Either can still request earlier from the chat menu
- **Release rule:** photos release only when both agree. Both see each other's photos at the same moment
- **Ghosting:** no reply within 72h after a completed exchange without using Close kindly increments ghost_count. Never shown publicly
- **Voice dates:** chat must be open. Women-first rules apply. Default length 20 minutes, extend in 10-minute steps when both agree. A completed voice date (at least 5 minutes) counts as 10 messages from each person toward Photo Exchange availability. No recording, ever
- **Date planning:** only after a completed Photo Exchange. One open date plan per match at a time. Place must be a public venue from place search (no home addresses). A plan with no response in 72h expires quietly

### Talents and Lilies (`config/currency.ts`, names configurable)

- **Talents** = in-app currency
- **Earn:** complete profile, add voice intro, get verified, daily check-in (small amount)
- **Buy:** bundles (Stripe on web, IAP on native in Phase 4)
- **Spend:** extra likes, profile boost, send a Lily
- **Lily** = a premium like that pins to the top of their Likes inbox with a gold accent
- **Guardrail:** Talents can never buy photo access, faster exchanges, or bypass women-first

## 7b. Aunt Martha, the AI dating coach (`config/auntMartha.ts`)

### Who she is
- A warm, wise, honest Christian auntie. Plain-spoken, encouraging, a little playful, and willing to tell you the truth in love
- Faith-grounded but denomination-neutral. Uses scripture sparingly, always with the reference, and only when it fits
- Always labeled as an AI coach. She never pretends to be a real person
- Write her voice with care: warm and wise, never a caricature or stereotype
- Sample greeting: "Hey, sweetheart. Aunt Martha here. What's on your heart today?"

### What she does
1. **Profile coaching** — reviews prompt answers and bio with three levels: "That's lovely," "Small change," "Go a little deeper." Explains why and asks questions to draw more out. Does not rewrite answers for you
2. **Conversation help** — from the chat menu, the user chooses to share the last few messages with her. She suggests topics and questions to ask. She never writes the message
3. **Date prep** — first date ideas, good questions, what to expect, staying safe
4. **Dating advice** — faith and dating, boundaries, how to tell if someone is serious, dating after divorce or as a single parent, waiting well
5. **Reflection** — after a date or a closed match, helps the user think it through and stay encouraged
6. **Safety flags** — if a shared conversation shows requests for money, pressure to move off the app quickly, or anything controlling, she names it plainly and shows the Report button

### What she won't do
- Write messages, bios, or prompt answers for you
- Tell you who to marry or rank your matches
- Rule on doctrine between denominations
- Act as a pastor, therapist, or counselor. For abuse, self-harm, or crisis topics she responds with care and points to real help (crisis lines, pastor, trusted people) instead of coaching
- Read any chat the user didn't explicitly share with her, or share anything with the other person
- Discuss sexual content beyond general, respectful guidance on boundaries

### Access and pricing
- Profile coaching: free and unlimited (better profiles help everyone)
- Other questions: 5 free per week, then 1 Talent per question. Configurable in `config/rules.ts`
- Talents can never buy anything that breaks the guardrails above

### How it's built
- Phase 1: full UI with canned sample replies from mock data, so the flows can be tested
- Phase 3: a Supabase Edge Function calls the Claude API (Anthropic). Her persona and guardrails live in a versioned system prompt in `config/auntMartha.ts`
- The function adds only what's needed: the user's own profile, and chat messages only when the user taps "Share with Aunt Martha" for that request
- Rate limits per user, input and output moderation, and an automatic safety note plus resources when crisis topics come up
- Conversations are stored for the user only. They are not used for training, and the user can clear them anytime
- A small admin log of flagged safety replies for review

## 8. Faith config (`config/faiths.ts`)

Launch with Christian only. Each faith entry: id, displayName, tagline, denominations, attendanceLabels, prompts. Only `christian` is enabled.

- Denominations: Non-denominational, Baptist, Catholic, Pentecostal, Methodist, AME, Church of God in Christ, Lutheran, Presbyterian, Orthodox, Seventh-day Adventist, Other
- Church attendance: Weekly, Most weeks, Occasionally, Growing in faith
- Shared faith prompt: "What does your faith look like in your everyday life?"
- Prompt library: the 3 default prompts in section 5 plus 15 to 20 more suited to marriage-minded Christian singles

## 9. Data model (build mock data in this exact shape)

- `profiles` — id, first_name, birthdate, city, gender, seeking, faith, denomination, church_attendance, home_church, marital_history (never | divorced | widowed), marital_since_year, has_children, children_ages, wants_children, intent (spouse | purpose), interests[], core_values, verified, has_voice_intro, onboarding_step, ghost_count, created_at
- `preferences` — profile_id, age_min, age_max, distance_km, denominations[], open_to_divorced, open_to_children
- `voice_clips` — id, profile_id, kind (intro | prompt_answer | testimony | chat | match_intro), storage_path, duration_s, transcript
- `prompts` — id, faith, text, is_default
- `prompt_answers` — id, profile_id, prompt_id, text, voice_clip_id
- `testimonies` — id, profile_id, text, voice_clip_id
- `photos` — id, profile_id, storage_path, blurred_path, order (full image never returned before exchange)
- `saves` — id, profile_id, saved_profile_id, created_at (private)
- `likes` — id, from_id, to_id, target_type (intro | prompt_answer), target_id, comment_text, comment_voice_id, is_lily, created_at
- `matches` — id, user_a, user_b, created_at, opened_by, opened_at, intro_invited_at, expires_at, extended, closed_at, closed_by
- `messages` — id, match_id, sender_id, text, voice_clip_id, created_at
- `photo_exchanges` — match_id, requested_by, requested_at, a_agreed, b_agreed, a_msg_count, b_msg_count, fast_lane, exchanged_at
- `daily_batches` — id, profile_id, date, profile_ids[]
- `talent_ledger` — id, profile_id, amount (+/-), reason, created_at (balance is the sum)
- `notifications` — id, profile_id, type, payload, read_at, created_at
- `voice_dates` — id, match_id, invited_by, scheduled_for, status (invited | scheduled | live | completed | declined | missed), started_at, ended_at, duration_s, extended_count
- `voice_date_feedback` — voice_date_id, profile_id, talk_again (bool), rating
- `date_plans` — id, match_id, proposed_by, activity, time_options[], chosen_time, place_name, place_address, place_id, who_pays (treat | split | each), status (proposed | changes_requested | confirmed | declined | expired | cancelled), confirmed_at, created_at
- `date_shares` — id, date_plan_id, profile_id, shared_with (partner | friend), share_token, created_at
- `date_checkins` — date_plan_id, profile_id, outcome (great | good | not_a_fit), note, created_at
- `coach_messages` — id, profile_id, role (user | martha), text, context_type (none | profile | shared_chat | date_plan | checkin), match_id (nullable), flagged, prompt_version, created_at
- `coach_usage` — profile_id, week_start, free_used, talents_spent
- `coach_settings` — profile_id, nudges_on
- `accountability_partners` — id, profile_id, email, status
- `reports` / `blocks` — standard

## 10. Data adapter

- `data/adapter.ts` defines one interface (saveOnboardingStep, getBatch, saveProfile, likeTarget, sendLily, getLikesInbox, getMatches, openChat, inviteIntro, sendMessage, requestExchange, respondToExchange, getPhotos, closeMatch, getWallet, inviteVoiceDate, respondToVoiceDate, startVoiceDate, endVoiceDate, proposeDatePlan, respondToDatePlan, shareDatePlan, submitDateCheckin, askAuntMartha, getCoachThread, clearCoachThread, getCoachUsage, etc.)
- In Phase 1, the voice date call is simulated (call screen, timer, and end flow work, no real audio connection)
- `data/mock/` implements it with seed data: 40 Christian profiles, mixed genders, denominations, life stages, and intents, about 60% with voice intros, placeholder audio, abstract placeholder photos with blurred versions
- `data/supabase/` implements the same interface in Phase 3
- `getPhotos(matchId)` returns only blurred images until `exchanged_at` is set, in both implementations

## 11. Metrics to track (log events from day one)

Onboarding started, each step completed, onboarding finished, voice intro added, verified, likes sent, Lilies sent, matches, chats opened by her, first reply, Photo Exchanges completed, voice dates invited and completed, date plans proposed and confirmed, date check-in outcomes, Close kindly used, Aunt Martha questions (by type), profile edits after her feedback, safety flags raised.

## 12. Phases (stop and show me after each)

**Phase 1 — Clickable prototype (mock data):** theme tokens, full onboarding, all screens in section 6, voice record and playback, daily batch with voice ranking, Save, likes and Lilies, women-first chat start, Photo Exchange, Front Porch voice dates (simulated call), Plan a date form and check-in, Aunt Martha thread and entry points (canned replies), wallet (mock), settings stubs, dev panel. Runs in Expo Go and in the browser.

**Phase 2 — Polish pass:** motion, empty states, the match moment, the Photo Exchange moment, dark mode, copy review. I approve the look before backend work.

**Phase 3 — Supabase:** schema and migrations from section 9. Row Level Security so full photos are only readable when `exchanged_at` is set for a match containing the viewer. Private storage bucket with signed URLs (blurred versions separate). Realtime chat. Edge Functions for women-first windows and expiry, message counting, exchange eligibility, daily batch with ranking, contact-info filter, ghost tracking, Talent ledger rules, and voice transcription. Real voice calls through LiveKit (or Agora), with call tokens issued by an Edge Function only to the two people in the match. Place search through Google Places, public venues only. Date reminders and calendar invites (.ics). Aunt Martha live through the Claude API with the guardrails in section 7b.

**Phase 4 — Production:** real verification provider, push notifications, moderation on voice, text, and photos, admin moderation queue, Stripe (web) and RevenueCat IAP (native), PWA install setup, EAS builds for iOS and Android.

## 13. Out of scope for the prototype

Other faith rooms (config only), real payments, live AI replies (canned in Phase 1), ads, video calls, call recording, group audio events, human date concierge (later, possibly never), booking or paying for dates, video messages, marriage gift and testimony gallery (later), real ID verification, push notifications.

## 14. Acceptance checklist for Phase 1

- [ ] No swipe gesture exists anywhere
- [ ] Onboarding has all 10 steps, a progress bar, and resumes where you left off
- [ ] Under-18 birthdates are blocked
- [ ] Only the Christian room is visible
- [ ] Every like is attached to a specific prompt or voice intro
- [ ] Save works privately and is not required to like
- [ ] Lilies pin to the top of the Likes inbox
- [ ] Match moment shows "You've made a match by faith!" with prayer hands
- [ ] He cannot message until she starts the chat or invites his intro
- [ ] Voice profiles show a badge, rank higher, and can be filtered
- [ ] Batch ends with a "caught up" screen
- [ ] Full photos cannot be seen before both agree to the exchange
- [ ] Both users see each other's photos at the same moment
- [ ] Fast lane works for verified spouse-seekers
- [ ] "Not yet" and Close kindly both work
- [ ] Talents can't buy photo access or skip women-first
- [ ] Voice date invites follow women-first rules, the call screen times out at 20 minutes, and a completed call counts toward Photo Exchange
- [ ] Plan a date only appears after a Photo Exchange, needs both to confirm, and records who pays
- [ ] No date booking or payment happens in the app
- [ ] The day-after check-in appears and stays private
- [ ] Aunt Martha is pinned in Chats, clearly labeled as an AI coach, and reachable from all four entry points
- [ ] She only sees chat messages the user chose to share
- [ ] Her free weekly limit and Talent charge work, and profile coaching stays free
- [ ] Works in the browser and in Expo Go
- [ ] Royal Covenant palette in light and dark mode, gold used sparingly
