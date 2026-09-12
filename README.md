# ⚔️ Life RPG — Turn Life into Progress 🛡️

> *"You tell us what you did. We turn it into progress."*

Welcome to **Life RPG**, a cozy, nostalgic 2D life-progression game that turns your real-world habits, workouts, and study sessions into character XP, levels, streak bonuses, achievements, and customizable cosmetics.

---

## 🌟 The Core Philosophy

1. **Low Input, High Intelligence**: Type what you did in plain English (e.g. *"Study DSA for 2 hours"* or *"Run 5 km"*). No tedious XP forms.
2. **Game First, Dashboard Second**: Enter an interactive 2D realm with a live character sprite, equipment, and HUD—not another SaaS grid.
3. **Server Authoritative**: All XP calculations, levels, gold, and gems are calculated securely on the server using deterministic game rules.
4. **Accessible by Design**: Full keyboard navigation, screen-reader support, responsive mobile-to-desktop layouts, and `prefers-reduced-motion` compliance.

---

## 🏰 Monorepo Structure

```text
life-rpg/
├── apps/
│   ├── web/           # React + Vite + TypeScript + Tailwind CSS (Nostalgic 2D UI)
│   └── api/           # Express + TypeScript + Firebase Admin + Gemini AI Interpreter
├── packages/
│   ├── contracts/     # Shared Zod schemas, DTOs & ApiResponse envelope
│   ├── game-rules/    # Pure progression math, XP formulas, level titles, reward engine
│   └── tsconfig/      # Shared strict TypeScript base configs
├── .env.example       # Master environment variables template
└── README.md