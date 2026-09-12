# ⚔️ Life RPG — Turn Life into Progress 🛡️

> *"You tell us what you did. We turn it into progress."*

```text
┌─────────────────────────────────────────────────────────┐
│  LIFE RPG                                💎 24   🪙 680 │
│                                                         │
│                      2D GAME SCENE                      │
│                  [ 🧙‍♂️ Nova Lvl 8 ]                      │
│                  ███████████░░░  820 / 1000 XP          │
│                                                         │
│       ┌─────────────────────────────────────────┐       │
│       │ 📜 Today's Quests                       │       │
│       │  📚 Study DSA for 1 hour        +60 XP  │       │
│       │  🏃 Walk 5 km                   +70 XP  │       │
│       │  🧹 Clean desk                  +30 XP  │       │
│       └─────────────────────────────────────────┘       │
│                                                         │
│     [Home]  [Quests]  [Character]  [Bag]  [Shop]        │
└─────────────────────────────────────────────────────────┘
```

Welcome to **Life RPG**, a lightweight, nostalgic 2D life-progression game that turns real-world activities into meaningful RPG progress.

Users express their tasks in normal conversational language (e.g. *"Study DSA for 2 hours"* or *"Clean my room"*), while our AI interpretation layer extracts facts and the server deterministically awards XP, levels, attribute growth, gold, gems, streaks, and cosmetics.

---

## 🌟 Core Pillars

1. **Low Input, High Intelligence**: Type what you did in natural language. No manual XP or gold sliders.
2. **Game First, Dashboard Second**: You enter a cozy 2D game world with character sprites and tactile HUDs—not a SaaS analytics board.
3. **Server Authoritative**: All progression calculations (`XP_required(L) = round(100 * L^1.65)`), streaks, inventory, and currency balances are cryptographically and logically owned by the server.
4. **Accessible & Responsive**: Built with semantic HTML, focus trapping modals, screen-reader live regions, mobile touch targets (360px+), and full `prefers-reduced-motion` compliance.

---

## 🏰 Monorepo Architecture (`pnpm workspaces`)

```text
life-rpg/
├── pnpm-workspace.yaml   # Workspace definitions
├── package.json          # Monorepo root scripts
├── .gitignore            # Git exclusion rules
├── .env.example          # Environment variables template
│
├── apps/
│   ├── web/              # React 19 + Vite + TypeScript + Tailwind CSS (Nostalgic RPG UI)
│   │   ├── src/
│   │   │   ├── components/   # CharacterAvatar (2D layer engine), Button, Dialog, ProgressBar
│   │   │   ├── features/     # Auth, Onboarding, Character Customization, Home Game Scene
│   │   │   ├── styles/       # RPG color tokens & custom pixel effects
│   │   │   └── lib/          # Motion presets, utils
│   │   └── index.html
│   │
│   └── api/              # Node.js + Express + TypeScript + Firebase Admin SDK
│       └── src/
│           ├── config/       # Strict Zod environment validation & Firebase Admin
│           ├── middleware/   # Bearer Auth, Rate Limiter, Helmet, Request ID, Error Handler
│           ├── modules/      # Auth, Users, Character, Quests, Catalog
│           └── routes/       # Versioned REST endpoints (/api/v1/...)
│
└── packages/
    ├── contracts/        # Shared Zod schemas, DTOs, and ApiResponse envelope
    ├── game-rules/       # Pure progression math, XP formulas, level titles, 8 base avatars, asset catalog
    └── tsconfig/         # Shared strict TypeScript compiler configurations
```

---

## ⚙️ Environment Variables Template (`.env.example`)

Create a `.env` file in the root directory:

```ini
# ==========================================
# 🛡️ Life RPG API Configuration
# ==========================================
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Firebase Admin Service Account (Optional for Dev / Required for Live Firebase)
FIREBASE_PROJECT_ID=liferpg-local
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
USE_FIREBASE_EMULATOR=false
DEV_AUTH_BYPASS=true

# AI Interpretation Engine
GEMINI_API_KEY=

# ==========================================
# 🧙‍♂️ Life RPG Web Client Configuration
# ==========================================
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=liferpg-local
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 🚀 Setup & Installation (`pnpm`)

### 1. Prerequisites
- **Node.js**: `v20.0.0` or higher (tested on `v22.14.0`)
- **pnpm**: `v9.0.0` or higher (`npm install -g pnpm` if needed)

### 2. Install Workspace Dependencies
```bash
pnpm install
```

### 3. Setup Environment
```bash
cp .env.example .env
```

### 4. Run Development Servers
```bash
# Run both Backend API and Web Frontend concurrently:
pnpm run dev

# Or run separately:
pnpm run dev:api   # API running on http://localhost:4000
pnpm run dev:web   # Web running on http://localhost:5173
```

---

## 🧪 Testing & Verification

```bash
# Run all Vitest suites across packages and apps
pnpm run test

# Run strict TypeScript type checks across all workspaces
pnpm run typecheck

# Build all packages and apps for production
pnpm run build
```

---

## 🧭 Phased Implementation Roadmap

- [x] **Phase 1: Foundation, Authentication & Visual System**
  - Monorepo setup with `pnpm workspaces`
  - Contracts & DTOs with Zod validation
  - Pure progression engine & XP curve (`XP_required(L) = round(100 * L^1.65)`)
  - Express API with RequestId, Helmet, RateLimiting, and Firebase ID token auth
  - React + Vite web client with nostalgic RPG design tokens, accessible primitives, and GameShell
  - Vitest test suites for progression math, level titles, rewards, API auth & UI components

- [x] **Phase 2: Onboarding & Character World**
  - 3-step interactive onboarding flow (Identity, 8 Origin Classes, Custom Starting Style)
  - Multi-layer composable 2D character avatar engine (background + body + hair + outfit + accessories + effects)
  - Character idle animation & ambient background themes (Forest, Archives, Mountain, Cyber Arcade, Celestial)
  - Character Hall (live stat overview, attribute hex, and cosmetic wardrobe live preview)
  - Home Game Scene viewport with live character rendering & adventure board

- [ ] **Phase 3: Quests, AI Interpretation & CRUD**
  - Category picker (Mind, Body, Career, Life, Social, Growth)
  - Natural language quest interpreter with Gemini provider adapter
  - Single-question clarification UX & active/completed quest stacks

- [ ] **Phase 4: Progression Engine, Streaks, Economy & Achievements**
  - Server-side atomic Firestore transactions for quest completion
  - Streak calculation with timezone support
  - Gold & gems ledger, inventory, shop catalog, and achievement engine

- [ ] **Phase 5: Game Feel, Customization & Creative UX**
  - Quest completion bursts, level-up celebration, floating XP text
  - Shop cosmetic preview, rarity effects, and Daily Adventure board

- [ ] **Phase 6: Accessibility, Security Hardening, Testing & Release**
  - End-to-end security audit, keyboard navigation pass, and production release gates