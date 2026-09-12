# Life RPG — Product & Engineering Source of Truth

> **Project codename:** LifeRPG
>
> **Core promise:** *You tell us what you did. We turn it into progress.*
>
> **Document role:** This file is the single source of truth for product direction, UX, game rules, architecture, database design, security, accessibility, and implementation. Coding agents should treat it as the authoritative specification unless a later decision explicitly supersedes it.

---

## 0. Product North Star

LifeRPG is a lightweight, nostalgic 2D life-progression game. It converts real-world activities into RPG progress without asking users to understand or configure game mechanics.

The user should feel like they are **entering a small game world**, not opening a productivity dashboard.

### Core loop

```text
Sign in
  ↓
Enter the game world
  ↓
See your character + current progress
  ↓
Create/choose a quest in natural language
  ↓
AI interprets the activity
  ↓
Server-side rules calculate XP / stats / gold / gems
  ↓
Complete the activity
  ↓
Celebratory feedback
  ↓
Level / streak / achievement / economy progression
  ↓
Customize character and world
  ↓
Come back tomorrow
```

### Product principles

1. **Low input, high intelligence.** Users should describe activities in normal language; the system handles classification and reward mechanics.
2. **Game first, dashboard second.** The home screen is a game scene with lightweight HUD elements, not a grid of analytics cards.
3. **Server authoritative.** The browser never decides final XP, gold, gems, level, streak state, or inventory ownership.
4. **Fast and tactile.** The interface should respond immediately, then reconcile with the backend.
5. **Progress should feel visible.** Character appearance, stats, streaks, collectibles, themes, and world details provide proof of progress.
6. **Reward consistency, not guilt.** Positive activity gets rewarded. Missed activities normally lose opportunity/streak rather than aggressively subtracting XP.
7. **Accessible by design.** Every interaction works with keyboard, focus, touch, and screen readers; motion is progressively enhanced and reduced when requested.

---

# 1. Product Experience & Visual Direction

## 1.1 Overall aesthetic

### Theme

Use a **nostalgic 2D adventure / cozy RPG** direction inspired by old handheld/desktop RPG menus, but rendered with modern crisp UI and subtle motion.

The visual target is **2D game UI**, not a complex real-time game engine. This keeps the build approachable for React + AI-assisted implementation while still looking distinctive.

### Visual personality

- Warm, slightly muted base colors.
- Dark navy / ink background instead of pure black.
- Cream / parchment surfaces for readable panels.
- One warm accent for XP/progress.
- One green/teal accent for positive growth.
- Gold for currency.
- Violet/indigo for gems and rare items.
- Pixel-inspired decorative elements used selectively; do not make every element pixel-art.
- Rounded panels and crisp borders to preserve modern accessibility.

### Suggested palette

```text
Ink / background       #171A2B
Deep panel              #202642
Surface                 #2A3150
Soft parchment          #F3E8D0
Muted parchment         #CFC3A8
Primary amber           #F4B860
Growth green            #67C587
Gem violet              #9B8AFB
Sky blue                #6CA8FF
Danger / warning        #E67B7B
Pure white              #FFFFFF
```

Treat these as design tokens, not hardcoded values scattered through components.

### Typography

Use one highly readable UI font paired with a subtle display font only for game titles/level names. Avoid novelty fonts for body copy.

Recommended approach:

- UI/body: `Inter` or another system-friendly sans-serif.
- Display: a restrained retro/arcade-inspired font for headings only.
- All important information must remain readable without the display font.

---

## 1.2 Visual hierarchy

The main game screen should prioritize:

1. Character / world scene.
2. Player identity: nickname + level title.
3. XP progress.
4. Today's quests.
5. Small currency + streak indicators.

Everything else belongs behind interactions such as **Character**, **Quests**, **Bag**, **Achievements**, or **Shop**.

Do **not** put all statistics on the landing game scene.

---

## 1.3 Main game screen

The authenticated experience should resemble entering a game lobby.

### Desktop composition

```text
┌─────────────────────────────────────────────────────┐
│ LIFE RPG                         💎 24   🪙 680      │
│                                                     │
│                  2D GAME SCENE                      │
│                                                     │
│             [ character sprite ]                   │
│                                                     │
│          Nova • Level 8 Adventurer                  │
│          ███████████░░░  820 / 1000 XP             │
│                                                     │
│       ┌───────────────────────────────────────┐     │
│       │ Today's Quests                         │     │
│       │                                        │     │
│       │ 📚 Study DSA for 1 hour     +60 XP   │     │
│       │ 🏃 Walk 5 km                 +70 XP   │     │
│       │ 🧹 Clean desk                +30 XP   │     │
│       └───────────────────────────────────────┘     │
│                                                     │
│   [Character] [Quests] [Bag] [Achievements] [Shop] │
└─────────────────────────────────────────────────────┘
```

### Mobile composition

```text
Top HUD
Character scene
Player/level card
XP bar
Today's quest stack
Bottom navigation
```

The scene should resize or crop gracefully; never force horizontal scrolling.

---

## 1.4 Character system

Onboarding asks for:

- Name
- Age
- Nickname
- Avatar base

Keep the initial avatar catalog intentionally small: approximately 6–10 base characters.

### Cosmetic slots

Keep the first version small and modular:

- Hair
- Top / outfit
- Bottom
- Shoes
- Small accessory
- Background/theme

Avoid full character-body editors in MVP.

### Rendering strategy

Prefer composable transparent 2D assets stacked in layers:

```text
background
  + body
  + hair
  + outfit
  + accessory
  + optional effect
```

This is cheaper and easier to maintain than maintaining a unique image for every combination.

The canonical character state stores **asset IDs**, never binary images.

---

## 1.5 Game navigation

Use five primary destinations:

1. **Home** — game scene + today's quests.
2. **Quests** — create/manage active and completed quests.
3. **Character** — attributes, cosmetics, level title.
4. **Bag** — owned items, themes, badges.
5. **Shop** — spend gold/gems.

Achievements may be a tab inside Character or Bag for the initial version.

Use a compact bottom navigation on mobile and compact side/bottom navigation on desktop.

---

# 2. Core Game Design

## 2.1 Categories

Categories are broad life areas selected by the user; they reduce ambiguity before the AI parser runs.

Initial categories:

```text
Mind
Body
Career
Life
Social
Growth
```

Each category owns default mappings to character attributes and activity types.

---

## 2.2 Attributes

Attributes represent long-term character growth.

Initial attributes:

```text
INTELLECT
STRENGTH
DISCIPLINE
CREATIVITY
WISDOM
SOCIAL
```

A quest can affect one or more attributes.

Example:

```text
"Study DSA for 2 hours"
→ Mind
→ +Intellect
→ +Discipline
→ XP
→ Gold
```

```text
"Run 5 km"
→ Body
→ +Strength
→ +Discipline
→ XP
→ Gold
```

Attribute gains are smaller than account-level XP gains. The player should feel progression without rapidly maxing stats.

---

## 2.3 XP and level system

The XP system must be non-linear.

Use a central level function so every part of the system uses exactly the same calculation.

### Initial recommended progression model

Cumulative XP required to reach level `L`:

```text
XP_required(L) = round(100 * L^1.65)
```

Do not hardcode individual levels.

The implementation must expose pure functions:

```ts
getXpRequiredForLevel(level)
getLevelFromTotalXp(totalXp)
getXpIntoCurrentLevel(totalXp)
getXpToNextLevel(totalXp)
```

The exact curve may be tuned during playtesting, but it must remain:

- Monotonic.
- Non-linear.
- Predictable.
- Fast enough at early levels.
- Increasingly meaningful at higher levels.

### Level titles

Use catchy titles instead of only `Level 1`, `Level 2`, etc.

Initial title ladder:

```text
1   Wanderer
2   Scout
3   Pathfinder
4   Apprentice
5   Adventurer
6   Trailblazer
7   Challenger
8   Vanguard
9   Champion
10  Hero
11  Veteran
12  Elite
13  Guardian
14  Master
15  Ascendant
16  Legend
17  Mythic
18  Paragon
19  Eternal
20  Living Legend
```

After level 20, use a repeatable prestige/title pattern instead of inventing hundreds of names. Do not make level 20 artificially final unless product direction changes.

---

## 2.4 Reward economy

Use two currencies with different purposes.

### Gold 🪙

Common currency.

Earned from normal activity.

Spend on:

- Common cosmetics.
- Simple themes.
- Small profile decorations.
- Basic accessories.

### Gems 💎

Rare currency.

Earned from:

- Major milestones.
- Achievement chains.
- Special weekly challenges.
- Special events later.

Spend on:

- Rare cosmetics.
- Premium-feeling visual effects.
- Legendary badges/themes.

Do not introduce real-money purchases in the MVP.

---

## 2.5 Reward calculation philosophy

The user does **not** enter XP, gold, gems, stats, or difficulty manually.

The user provides:

```text
Category + natural language activity
```

The AI layer extracts structured activity facts.

The deterministic rule engine calculates rewards.

### Example

Input:

```text
Category: Mind
Activity: "Study DSA for 2 hours"
```

AI result:

```json
{
  "activityType": "study",
  "subject": "DSA",
  "metric": "duration",
  "value": 120,
  "unit": "minutes",
  "polarity": "positive",
  "confidence": 0.96
}
```

Rule engine:

```text
study
+ 120 minutes
+ normal difficulty band
→ 100 XP
→ +10 Intellect
→ +3 Discipline
→ +20 Gold
```

### Critical security rule

The AI must **never be authoritative for currency values**.

Never accept this from a client/AI result:

```json
{ "xp": 1000000, "gold": 500000 }
```

The AI returns semantic facts. The backend maps facts to reward values.

---

## 2.6 Activity interpretation layer

Use a provider-agnostic `ActivityInterpreter` interface.

### Input

```ts
interface ActivityInterpretationRequest {
  categoryId: string;
  text: string;
  locale?: string;
}
```

### Output

```ts
interface ActivityInterpretation {
  activityType: string;
  subject?: string;
  metric?: "duration" | "distance" | "count" | "pages" | "completion" | "amount";
  value?: number;
  unit?: string;
  polarity: "positive" | "negative" | "neutral";
  difficultyBand: "easy" | "medium" | "hard";
  attributeHints: string[];
  confidence: number;
  normalizedTitle: string;
  clarificationNeeded: boolean;
  clarificationPrompt?: string;
}
```

### Interpretation policy

- If confidence is high and required fields are available, create the quest directly.
- If confidence is medium/low, ask one concise clarification question.
- Never ask a multi-step configuration form.
- Never ask the user for XP or gold.
- Avoid punitive interpretations from ambiguous text.

### Examples

```text
"Run 5 km"
→ running / distance / 5 / km / positive
```

```text
"Study Java for 1 hour"
→ study / duration / 60 / minutes / positive
```

```text
"Clean my desk"
→ cleaning / completion / medium / positive
```

```text
"Build authentication for my project"
→ software-development / completion / hard / positive
```

---

## 2.7 Negative activities / setbacks

Default product behavior is **not** to aggressively subtract XP from arbitrary text.

For missed commitments:

```text
No reward
+ possible streak impact
```

Only explicitly configured negative mechanics may deduct attributes/currency.

This avoids creating an unpleasant guilt loop and prevents easy abuse.

---

## 2.8 Quest types

Initial quest types:

```text
ONE_TIME
DAILY
REPEATING
CHALLENGE
```

Future types can include:

```text
BOSS
MILESTONE
EVENT
```

### One-time

A single real-world task.

### Daily

Resets each local calendar day.

### Repeating

Supports a simple schedule such as selected weekdays.

### Challenge

Tracks cumulative progress toward a target.

Example:

```text
"Solve 20 LeetCode problems this month"
```

becomes:

```text
0 / 20
```

and each completed activity contributes progress.

---

## 2.9 Streak system

A streak increments when the user completes at least one eligible quest on a local calendar day.

Store dates in a canonical UTC timestamp plus the user's timezone identifier.

Never calculate streaks from the browser clock alone.

Initial milestone thresholds:

```text
3 days     Getting Started
7 days     Week Warrior
14 days    Dedicated
30 days    Relentless
60 days    Unshakable
100 days   Legendary
```

A streak may provide small bonus effects, but it should never dominate normal rewards.

---

## 2.10 Achievements

Achievements are system-defined, not user-configured.

Categories of achievements:

- First-time milestones.
- Total quest milestones.
- Category mastery.
- Attribute milestones.
- Streak milestones.
- Level milestones.
- Economy milestones.
- Hidden/secret achievements.

Examples:

```text
First Step
→ Complete 1 quest.

Quest Apprentice
→ Complete 10 quests.

Scholar
→ Accumulate 10 hours of learning activities.

Week Warrior
→ Reach a 7-day streak.

Collector
→ Own 10 cosmetics.
```

Achievement unlocking must be deterministic and server-side.

---

## 2.11 Character progression beyond XP

The player has three progression dimensions:

```text
1. Account Level
2. Attributes
3. Cosmetics / Collection
```

This means a user can feel progression even when they are not leveling every day.

---

## 2.12 Creative UX features

These are desired enhancements after the mandatory core is stable:

### Daily Adventure

Instead of calling it a dashboard, present today's tasks as an adventure board.

### Mini Boss

A weekly aggregate challenge represented visually as a boss HP bar.

### World evolution

Future-ready concept: small decorative environment elements unlock as users progress.

### Ambient scene

Very subtle animated clouds, particles, lamps, leaves, or floating UI accents.

### Quest completion burst

On completion:

```text
button press
→ XP pop
→ attribute tick
→ gold sparkle
→ quest card settles
→ optional short sound
```

Respect `prefers-reduced-motion`.

### Character idle animation

Very small loop only. Avoid distracting motion.

---

# 3. Technical Architecture

## 3.1 Approved stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Tailwind CSS or a small tokenized CSS layer
- Motion for React (`motion/react`) for game UI animation
- TanStack Query for server state
- Zod for client-side schema validation where useful

React officially supports TypeScript workflows; Create React App is deprecated, so use Vite or another current React build setup rather than CRA. See official React docs.  
Reference: https://react.dev/learn/typescript  
Reference: https://react.dev/learn/installation  

Motion is selected because it supports React-native declarative animation, layout transitions, gestures, springs, and exit animations.  
Reference: https://motion.dev/docs/react  

### Backend

- Node.js
- Express
- TypeScript
- Zod
- Firebase Admin SDK
- Google Cloud / Firebase-compatible deployment

### Database

- Cloud Firestore

### Authentication

- Firebase Authentication
- Google provider as the initial login method
- Optional email/password later if required

Firebase documents Google sign-in for web through the modular Firebase SDK; redirect flow is preferred on mobile.  
Reference: https://firebase.google.com/docs/auth/web/google-signin

### Security hardening

- Firebase ID token verification on Express.
- Firebase App Check on the web client and backend integration where supported.
- Firestore Security Rules as defense-in-depth for any direct client access.
- Strict server-side ownership checks.
- Zod validation for every mutation request.
- Rate limiting on expensive endpoints such as AI interpretation.
- Structured audit/transaction records for rewards.

Firebase recommends Authentication + Firestore Security Rules for web/mobile authorization, and App Check can help ensure requests originate from an authentic app. Server SDKs bypass Firestore Security Rules and therefore require proper IAM/credential controls.  
References: https://firebase.google.com/docs/firestore/security/overview  
https://firebase.google.com/docs/rules  
https://firebase.google.com/docs/reference/js/app-check

---

## 3.2 Request architecture

Do not make the browser the authority for game state.

```text
React client
   │
   │ Firebase Authentication
   │ obtains ID token
   ▼
Express API
   │
   ├── Verify Firebase ID token
   ├── Determine authenticated UID
   ├── Validate request with Zod
   ├── Authorize resource ownership
   ├── Execute domain service
   └── Write Firestore via Admin SDK
          │
          ▼
      Firestore
```

The browser should not send:

```text
finalXp
finalGold
newLevel
inventoryOwned
```

The browser should send intentions such as:

```text
complete quest 123
buy item 456
create quest from text
```

The backend calculates the outcome.

---

## 3.3 API design

Use versioned REST endpoints.

```text
/api/v1/me
/api/v1/quests
/api/v1/quests/:id
/api/v1/quests/:id/complete
/api/v1/activities/interpret
/api/v1/character
/api/v1/achievements
/api/v1/inventory
/api/v1/shop/items
/api/v1/shop/purchase
/api/v1/history
```

### Response envelope

Use one consistent shape.

```ts
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId: string;
}
```

Do not leak internal stack traces to the client.

---

## 3.4 Backend folder structure

```text
server/
  src/
    app.ts
    server.ts

    config/
      env.ts
      firebase.ts

    middleware/
      auth.ts
      errorHandler.ts
      rateLimit.ts
      requestId.ts
      validate.ts

    modules/
      auth/
      users/
      quests/
      activityInterpreter/
      progression/
      achievements/
      economy/
      inventory/
      catalog/

    domain/
      entities/
      valueObjects/
      rules/

    repositories/
      firestore/

    services/
      transactionService.ts
      timeService.ts

    shared/
      errors/
      constants/
      types/
      utils/
```

### SOLID expectations

- Controllers translate HTTP into application commands; no game rules in controllers.
- Services implement use cases.
- Repositories abstract Firestore.
- Domain rules remain pure and testable.
- AI provider adapters implement an interface, not direct model calls throughout the codebase.
- No circular dependencies.
- Avoid giant `utils.ts` files.

---

# 4. Production-Level Data Model

## 4.1 Firestore principles

Use user-scoped subcollections for user-owned data and top-level collections for global catalogs/configuration.

Recommended shape:

```text
/users/{uid}
/users/{uid}/character/main
/users/{uid}/quests/{questId}
/users/{uid}/questCompletions/{completionId}
/users/{uid}/achievements/{achievementId}
/users/{uid}/inventory/{inventoryItemId}
/users/{uid}/transactions/{transactionId}
/users/{uid}/streaks/current
/users/{uid}/activityLog/{logId}

/catalog/categories/{categoryId}
/catalog/items/{itemId}
/catalog/achievements/{achievementId}
/catalog/rules/{ruleId}
/catalog/assets/{assetId}
```

### Why this structure

- Strong ownership boundary.
- Simple authenticated-user queries.
- Modular growth.
- Global catalogs can be updated independently.
- Historical records remain append-friendly.

---

## 4.2 User document

```ts
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  nickname: string;
  age: number;
  avatarBaseId: string;
  timezone: string;
  onboardingCompleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Do not store sensitive profile information that is not needed by the product.

---

## 4.3 Character document

```ts
interface CharacterState {
  level: number;
  totalXp: number;
  gold: number;
  gems: number;
  currentLevelTitle: string;

  attributes: {
    intellect: number;
    strength: number;
    discipline: number;
    creativity: number;
    wisdom: number;
    social: number;
  };

  cosmetics: {
    hairId: string;
    outfitId: string;
    shoesId?: string;
    accessoryId?: string;
    backgroundId: string;
    effectId?: string;
  };

  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Store `totalXp` as the source of truth; derive current level from the progression engine or maintain the level as a denormalized field updated atomically.

---

## 4.4 Quest document

```ts
interface Quest {
  id: string;
  title: string;
  rawInput: string;
  normalizedActivity: string;
  categoryId: string;

  type: "ONE_TIME" | "DAILY" | "REPEATING" | "CHALLENGE";
  status: "ACTIVE" | "PAUSED" | "ARCHIVED" | "COMPLETED";

  interpretation: {
    activityType: string;
    subject?: string;
    metric?: string;
    value?: number;
    unit?: string;
    difficultyBand: "easy" | "medium" | "hard";
    polarity: "positive" | "negative" | "neutral";
    confidence: number;
  };

  rewardPreview: {
    xp: number;
    gold: number;
    attributeEffects: Partial<Record<string, number>>;
  };

  recurrence?: {
    timezone: string;
    daysOfWeek?: number[];
  };

  challenge?: {
    target: number;
    unit: string;
    current: number;
  };

  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

Important: `rewardPreview` is display-oriented. The authoritative reward is recalculated by the server at completion using trusted rule definitions.

---

## 4.5 Quest completion document

Completion records are immutable historical events.

```ts
interface QuestCompletion {
  id: string;
  questId: string;
  userId: string;
  completedAt: Timestamp;
  localDate: string;

  xpEarned: number;
  goldEarned: number;
  gemEarned: number;
  attributeEffects: Record<string, number>;

  ruleVersion: string;
  source: "USER" | "SYSTEM";
}
```

Never rewrite history to make the current total look correct. If a correction is necessary, record a compensating transaction.

---

## 4.6 Transaction document

```ts
interface EconomyTransaction {
  id: string;
  userId: string;
  currency: "GOLD" | "GEMS";
  direction: "CREDIT" | "DEBIT";
  amount: number;
  sourceType: "QUEST" | "ACHIEVEMENT" | "SHOP_PURCHASE" | "ADMIN_ADJUSTMENT";
  sourceId: string;
  createdAt: Timestamp;
}
```

Use transaction records to make the economy auditable.

---

## 4.7 Inventory document

```ts
interface InventoryItem {
  itemId: string;
  quantity: number;
  acquiredAt: Timestamp;
  source: "PURCHASE" | "ACHIEVEMENT" | "EVENT";
}
```

For unique cosmetics, enforce one ownership record. For consumables, use quantity.

---

## 4.8 Catalogs

Global catalog documents should contain no user-specific state.

### Category

```ts
interface CategoryDefinition {
  id: string;
  name: string;
  icon: string;
  defaultAttributes: Record<string, number>;
  activityTypes: string[];
  active: boolean;
}
```

### Item

```ts
interface CatalogItem {
  id: string;
  name: string;
  type: "HAIR" | "OUTFIT" | "SHOES" | "ACCESSORY" | "THEME" | "BADGE" | "EFFECT";
  rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
  price: {
    currency: "GOLD" | "GEMS";
    amount: number;
  };
  assetId: string;
  active: boolean;
}
```

---

# 5. Security, Accessibility, Performance & Quality

## 5.1 Authentication

Initial flow:

```text
Landing
  ↓
Sign in with Google
  ↓
Firebase Auth
  ↓
ID token
  ↓
Express API
  ↓
Verify token
  ↓
Resolve user profile
  ↓
Onboarding if incomplete
  ↓
Game world
```

Firebase Authentication supports Google provider login and auth-state observers for web apps.  
Reference: https://firebase.google.com/docs/auth/web/google-signin

### Rules

- Never trust a client-provided UID.
- Always derive `uid` from the verified Firebase token.
- Every repository query for user-owned data must receive the authenticated UID.
- Never accept arbitrary user IDs from the browser for ownership-sensitive operations.
- All mutation routes require authentication.
- Sensitive routes should be rate-limited.

---

## 5.2 Firestore security

Preferred production posture:

- Browser reads/writes application state through Express.
- Express uses Firebase Admin SDK.
- Firestore is not treated as an unrestricted client database.
- Security Rules remain locked down for direct client access.
- Admin SDK access is protected by service-account/hosting IAM.

Firebase notes that server SDKs bypass Firestore Security Rules, so access from the server must be controlled through IAM and server-side authorization.  
Reference: https://firebase.google.com/docs/firestore/security/rules-structure

---

## 5.3 Completion transactions

Completing a quest can update multiple values:

```text
quest completion record
+ character XP
+ character level
+ attributes
+ gold
+ gems
+ streak
+ achievement unlocks
+ economy transaction
```

Use a Firestore transaction or equivalent atomic write strategy where consistency requires it. Firestore transactions provide atomic read/write behavior and retry on concurrent changes; batched writes provide atomic multi-document writes when no dependent reads are required.  
Reference: https://firebase.google.com/docs/firestore/manage-data/transactions

### Idempotency

A completion request must be idempotent.

If the same request is retried because of network issues, it must not award XP twice.

Use a client-generated or server-generated `operationId` and store it with the completion event.

---

## 5.4 Accessibility

The product must pass the following manual checks before release:

### Keyboard

- Tab reaches every interactive control.
- Enter/Space activates buttons.
- Escape closes dialogs.
- Focus is trapped inside modal dialogs while open.
- Focus returns to the triggering element after modal close.
- Visible focus styles exist.

### Screen readers

- Use semantic buttons/links/headings.
- Every icon-only control has an accessible name.
- Progress bars include accessible values.
- XP changes and achievement unlocks use polite live announcements.
- Decorative artwork is hidden from assistive technology.
- Meaningful images have useful alt text.

### Motion

- Respect `prefers-reduced-motion`.
- Do not use flashing effects.
- Game feedback should have a non-motion equivalent.

---

## 5.5 Responsive design

Targets:

```text
360px+   mobile
768px+   tablet
1024px+  desktop
1440px+  large desktop
```

Never rely on hover for core functionality.

The entire game must remain usable on a small phone screen with one thumb where practical.

---

## 5.6 Performance

Target behavior:

- Initial shell appears quickly.
- Use skeletons for data loading.
- Use optimistic UI only where rollback behavior is defined.
- Lazy-load non-critical screens/assets.
- Compress sprite assets.
- Avoid huge sprite sheets when only a few assets are visible.
- Animate transform/opacity where possible.
- Avoid unnecessary React re-renders in the game scene.
- Cache stable catalog data.

Use Motion for intentional game feedback and layout transitions; keep simple hover/color transitions in CSS. Motion supports gesture and layout animation for React.  
Reference: https://motion.dev/docs/react

---

## 5.7 Error UX

Errors must feel like part of a game product, not raw API failures.

Bad:

```text
500 Internal Server Error
```

Good:

```text
The quest could not be saved.
Your progress is safe. Try again.
```

Do not obscure the technical error in logs; only simplify it for the user.

---

# 6. Repository Structure & Six-Phase Implementation Plan

## 6.1 Monorepo structure

Use a simple monorepo so the frontend and backend remain independently testable but share types/contracts.

```text
life-rpg/
  apps/
    web/
      src/
        app/
        components/
        features/
          auth/
          onboarding/
          game/
          quests/
          character/
          achievements/
          shop/
          inventory/
        services/
        hooks/
        stores/
        styles/
        assets/
        lib/

    api/
      src/
        config/
        middleware/
        modules/
        domain/
        repositories/
        services/
        shared/
        routes/

  packages/
    contracts/
    game-rules/
    eslint-config/
    tsconfig/

  firebase/
    firestore.rules
    firestore.indexes.json
    firebase.json

  docs/
    api.md
    game-rules.md

  .env.example
  README.md
  package.json
```

### Shared package responsibilities

`packages/contracts`:

- Request/response schemas.
- Domain DTOs.
- Shared enums.

`packages/game-rules`:

- Pure progression math.
- Level titles.
- Base reward formulas.
- Achievement predicates.
- No Firebase imports.
- No HTTP imports.
- No React imports.

This keeps the most important game mechanics deterministic and testable.

---

## Phase 1 — Foundation, Authentication & Visual System

### Goal
Create the technical skeleton and establish the final visual language early.

### Deliverables

- Monorepo initialized.
- React + TypeScript + Vite frontend.
- Express + TypeScript backend.
- Firebase project integration.
- Google authentication.
- Auth context/state observer.
- Express Firebase ID-token verification middleware.
- Environment validation.
- Design tokens and palette.
- Typography setup.
- Accessible button/input/dialog primitives.
- Motion system with reduced-motion support.
- Base application shell.
- CI checks for formatting, type checking, linting, and tests.

### Acceptance criteria

- New user can sign in with Google.
- Returning user remains authenticated.
- API rejects missing/invalid tokens.
- No secrets are committed.
- Keyboard can navigate all auth screens.
- App renders correctly at 360px and desktop widths.

### Agent rule
Do not build the final dashboard yet. Build the visual foundation and game-shell primitives first.

---

## Phase 2 — Onboarding & Character World

### Goal
Make entering the product feel like entering a small game.

### Deliverables

- First-login onboarding.
- Name, age, nickname.
- Base avatar selection.
- Default cosmetic loadout.
- Character scene.
- Character idle animation.
- Initial profile/character documents.
- Home game scene.
- Compact HUD for:
  - nickname
  - level title
  - XP bar
  - gold
  - gems
  - streak
- Character customization screen.
- Asset manifest and cosmetic component system.

### Acceptance criteria

- User completes onboarding once.
- User can revisit character customization.
- Character appearance is built from asset IDs.
- Home screen feels like a game scene, not a SaaS dashboard.
- No core interaction requires a mouse.

### Agent rule
Keep the 2D world intentionally small. Use layered images/SVG/DOM elements rather than introducing a game engine unless a later requirement proves it necessary.

---

## Phase 3 — Quests, AI Interpretation & CRUD

### Goal
Build the core low-input quest experience.

### Deliverables

- Category picker.
- Natural-language quest input.
- AI interpreter interface.
- Provider adapter.
- Structured interpretation schema.
- Confidence handling.
- One-question clarification flow.
- Quest create/read/update/delete.
- Quest list grouped by active/completed.
- One-time and daily quest types.
- Reward preview.
- Loading/skeleton states.
- Error recovery.
- Unit tests for parser contracts and quest services.

### UX example

```text
Choose category: Mind

What do you want to do?
[ Study DSA for 2 hours                    ]

[ Add quest ]
```

Do not show a reward configuration form.

### Acceptance criteria

Input:

```text
Study DSA for 2 hours
```

produces a normalized quest with structured interpretation.

Input:

```text
Study Java
```

may trigger one concise clarification instead of a long form.

User can edit/delete their own quests.

User cannot edit another user's quest by changing IDs.

### Agent rule
The AI adapter must return structured data validated by Zod. Never persist raw model output without schema validation.

---

## Phase 4 — Progression Engine, Streaks, Economy & Achievements

### Goal
Turn the quest system into a real RPG.

### Deliverables

- Central XP progression module.
- Non-linear level calculations.
- Level titles.
- Attribute calculations.
- Streak service.
- Gold and gem ledger.
- Inventory.
- Shop catalog.
- Purchase flow.
- Achievement engine.
- Historical completion log.
- Server-side completion transaction.
- Idempotent completion endpoint.
- Reward animation pipeline.

### Completion flow

```text
POST /quests/:id/complete
        ↓
Authenticate
        ↓
Authorize ownership
        ↓
Load quest + trusted rule definitions
        ↓
Validate completion eligibility
        ↓
Calculate XP / stats / currency
        ↓
Atomic Firestore transaction
        ↓
Return authoritative result
        ↓
Frontend celebrates
```

### Acceptance criteria

A quest completion updates every dependent value consistently.

Repeated requests for the same operation do not duplicate rewards.

Level-up is deterministic.

Streak calculation survives logout/login and device changes.

Achievement unlocks are recorded once.

Gold purchases cannot produce negative balances.

### Agent rule
No client-side authority over final rewards. No direct `setGold(userInput)` or `setXp(userInput)` routes.

---

## Phase 5 — Game Feel, Customization & Creative UX

### Goal
Make the product feel memorable and satisfying.

### Deliverables

- Quest completion burst.
- XP number animation.
- Level-up celebration.
- Attribute gain animation.
- Gold/gem sparkle.
- Achievement toast/modal.
- Character reactions.
- Shop micro-interactions.
- Cosmetic preview.
- Rarity treatment.
- Empty states with character/world flavor.
- Daily Adventure presentation.
- Optional weekly challenge/boss UI.
- Ambient background motion.
- Sound architecture with sound OFF by default unless product decides otherwise.
- Reduced-motion mode for all effects.

### UX rule
Every animation must communicate state, not merely decorate it.

### Examples

```text
Quest complete
→ card presses down
→ +XP floats upward
→ progress bar advances
→ gold icon pops
```

```text
Level up
→ world dims slightly
→ level title appears
→ character glow / burst
→ new title shown
→ world returns to normal
```

### Acceptance criteria

Game feedback completes quickly and does not block the next interaction.

No celebration traps keyboard focus.

Reduced-motion users receive a calm equivalent.

---

## Phase 6 — Accessibility, Security Hardening, Testing & Release

### Goal
Turn the prototype-quality game into a credible production-ready project.

### Deliverables

- Firestore rules review.
- API authorization audit.
- Firebase App Check where applicable.
- Rate limits.
- Input size limits.
- AI request rate/cost limits.
- CORS policy.
- Security headers.
- Error handling review.
- Audit/event logging.
- Firestore index review.
- Accessibility pass.
- Keyboard-only pass.
- Screen-reader smoke tests.
- Mobile responsive pass.
- Performance pass.
- Unit tests for progression rules.
- Integration tests for quest completion.
- API tests.
- End-to-end smoke tests.
- Production environment configuration.
- Monitoring/logging.
- Backup/export strategy for important data.
- Final README with setup/deploy instructions.

### Release gates

The product is not considered complete until all are true:

```text
[ ] Authentication secure
[ ] User data isolated
[ ] Quest CRUD works
[ ] Completion is server-authoritative
[ ] Non-linear leveling works
[ ] Streaks persist
[ ] Attributes update
[ ] Gold/gems work
[ ] Inventory/shop works
[ ] Achievements work
[ ] Mobile responsive
[ ] Keyboard accessible
[ ] Screen-reader basics pass
[ ] Reduced motion supported
[ ] Duplicate reward protection works
[ ] Automated tests pass
[ ] Production build passes
```

---

# 7. Non-Negotiable Engineering Rules

1. **TypeScript everywhere.** Avoid `any` except at isolated integration boundaries with explicit validation.
2. **No business logic in React components.** Components render state and dispatch actions.
3. **No Firebase calls directly inside large UI components.** Use services/hooks/query functions.
4. **No business logic in Express route handlers.** Controllers call application services.
5. **All external input is validated.** API, query params, path params, AI output, and persisted catalog data.
6. **Game calculations are pure functions wherever possible.**
7. **All reward-changing mutations are server-authoritative.**
8. **Every user-owned read/write requires authenticated ownership.**
9. **Historical completion records are immutable.**
10. **Economy changes are ledgered.**
11. **Completion operations are idempotent.**
12. **No hardcoded reward values inside UI.**
13. **No magic numbers scattered through the codebase.** Put game tuning values into versioned rules/config.
14. **No giant component files.** Split by feature and responsibility.
15. **Prefer composition over inheritance.**
16. **Do not over-engineer future multiplayer/network gameplay.** This is a single-player life RPG for MVP.
17. **Do not introduce a full 2D game engine unless React/DOM/SVG proves insufficient.**
18. **Accessibility is a release requirement, not a final polish item.**

---

# 8. Suggested Game Rules Configuration

Keep tunable game constants in a central versioned definition.

```ts
interface GameRules {
  version: string;

  xp: {
    levelExponent: number;
    levelBase: number;
    difficultyMultiplier: Record<string, number>;
  };

  activityRates: Record<string, {
    metric?: string;
    basePerUnit: number;
    maxDailyReward?: number;
    attributeWeights: Record<string, number>;
  }>;

  economy: {
    goldPerXp: number;
    gemMilestones: number[];
  };

  streak: {
    milestoneDays: number[];
    maxBonusPercent: number;
  };
}
```

Store the active rule version with completion records:

```text
ruleVersion = "2026-09-v1"
```

This makes historical calculations explainable when rules change later.

---

# 9. AI Contract & Prompting Guidance

The model's role is **classification and extraction**, not game authority.

### System-level intent

```text
You are the activity interpreter for a life-RPG application.
Convert a user's natural-language activity into the predefined structured schema.
Do not invent rewards, currencies, levels, or database IDs.
Do not infer sensitive personal information.
Prefer clarification over confident guessing when the activity cannot be safely normalized.
```

### AI output constraints

- JSON/schema output only.
- Enumerated fields where possible.
- Numeric values must be finite and bounded.
- No arbitrary reward fields.
- No direct Firestore mutations.
- No tool access to user currency or progression.

### Fallback behavior

If the model is unavailable:

- Allow predefined templates for common activities.
- Keep existing quests playable.
- Do not block access to the rest of the game.

---

# 10. Testing Strategy

## Unit tests

Test pure domain logic:

```text
level calculation
XP curve
attribute calculation
streak calculation
reward calculation
achievement predicates
currency math
challenge progress
```

## Integration tests

Test:

```text
Firebase token → Express middleware
quest create → Firestore
quest completion → atomic updates
purchase → inventory + transaction
```

## End-to-end tests

Critical journeys:

```text
new user
→ Google sign in
→ onboarding
→ create quest
→ complete quest
→ level-up
→ achievement
→ shop purchase
→ reload
→ state persists
```

## Security tests

Attempt:

```text
missing token
expired token
wrong user ID
foreign quest ID
forged XP
forged gold
duplicate completion
negative purchase amount
invalid item ID
malformed AI response
oversized input
rate-limit abuse
```

All must fail safely.

---

# 11. Definition of Done for Agents

An agent should not mark a feature complete just because the happy path works.

For every feature, verify:

```text
[ ] Types compile
[ ] Loading state exists
[ ] Error state exists
[ ] Empty state exists where applicable
[ ] Keyboard works
[ ] Mobile layout works
[ ] Data ownership is enforced
[ ] Server is authoritative where needed
[ ] Tests cover core behavior
[ ] No secrets are committed
[ ] No unrelated files are modified
```

When adding a feature, update the relevant shared types and tests rather than duplicating concepts.

---

# 12. Final Product Definition

The finished MVP should feel like this:

> A player signs in, chooses a character, enters a cozy 2D world, and immediately sees a tiny game-like representation of their life progress. They add activities naturally—without configuring XP or rewards. The system understands the activity, converts it into a quest, and the server calculates the rewards. Completing real-world actions grows the player's level and attributes, builds streaks, unlocks achievements, earns gold and gems, and gradually unlocks cosmetic identity. The interface remains compact, tactile, nostalgic, responsive, and accessible instead of becoming a conventional productivity dashboard.

### The single most important UX sentence

> **The user should think about what they want to do, not how the game works.**

### The single most important engineering sentence

> **The client expresses intent; the server owns progression.**

### The single most important visual sentence

> **Build a small, beautiful game world—not a dashboard with game-colored cards.**

---

## 13. Current Official Technical References

These references were checked while preparing this source of truth and should be re-checked when implementation begins because SDKs and APIs evolve.

- React TypeScript: https://react.dev/learn/typescript
- React installation/current setup guidance: https://react.dev/learn/installation
- Firebase Google Authentication for web: https://firebase.google.com/docs/auth/web/google-signin
- Firebase Authentication overview: https://firebase.google.com/docs/auth
- Firestore security overview: https://firebase.google.com/docs/firestore/security/overview
- Firestore Security Rules: https://firebase.google.com/docs/rules
- Firestore transactions and batched writes: https://firebase.google.com/docs/firestore/manage-data/transactions
- Firebase App Check JS reference: https://firebase.google.com/docs/reference/js/app-check
- Motion for React: https://motion.dev/docs/react

---

# 14. Agent Execution Note

When an AI coding agent reads this file:

1. Treat Sections 0–5 as the product/technical contract.
2. Execute Sections 6 in order.
3. Do not skip Phase 1 foundations in order to build flashy screens.
4. Do not invent alternate database ownership models without documenting the change.
5. When uncertain between two UI options, choose the option that reduces user input and keeps the game world visually calm.
6. When uncertain between client-side and server-side responsibility, choose server-side for anything involving progression, currency, achievements, inventory ownership, or security.
7. When uncertain about a game mechanic, prefer the simplest deterministic rule that can later be tuned through the central `GameRules` configuration.
8. Preserve clean module boundaries so the project can evolve without rewrites.
