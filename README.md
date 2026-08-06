# 🔨 Critter Bonk!

> A silly little whack-a-mole game. **Bonk** the critters, grab **💎 gems**, snatch
> **⏰ clocks** for extra time, and *do not* smack the **💣 bombs**. Beat your
> high score, then dare your friends to beat it.

Made to be **fun for absolutely anyone** — no instructions needed, no account, no
downloads. It's **100% frontend** (no server, no database), so it hosts for
**free** and you share it with a single link. Works great on phones — just tap!

![No backend](https://img.shields.io/badge/backend-none-brightgreen) ![Free hosting](https://img.shields.io/badge/hosting-free-blue) ![Plays on](https://img.shields.io/badge/plays%20on-any%20phone%20or%20laptop-ff5d8f)

---

## 🎮 How to play

1. Press **Play**.
2. Critters pop out of the holes — **tap/click them** to bonk them for points.
3. **💎 Gems** are worth big points. **⏰ Clocks** add time.
4. **Don't bonk the 💣 bombs** — they cost you points and break your combo!
5. Bonk lots in a row to build a **combo multiplier** (up to **x5**).
6. You get **60 seconds**. Beat your best and hit **Share** to challenge friends.

That's it. Your grandparent and your niece can both play this. 🐹

---

## ▶️ Run it locally

```bash
npm install
npm run dev      # open the printed http://localhost:5173 link
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build
```

Requires Node 20+.

---

## 🌍 Put it online for free & share the link

The build uses a **relative base path**, so the same `dist/` works at a domain
root *or* under a sub-path — no fiddling required.

### Option A — Vercel (easiest)
1. Push this project to GitHub.
2. [vercel.com](https://vercel.com) → **New Project** → import the repo → **Deploy**.
3. Share the `*.vercel.app` link. Done!

### Option B — Netlify
1. Push to GitHub.
2. [app.netlify.com](https://app.netlify.com) → **Add new site** → import the repo.
   Settings are read from [`netlify.toml`](./netlify.toml) automatically.
3. Share the `*.netlify.app` link.

### Option C — GitHub Pages (no third-party service)
1. Push to GitHub.
2. Repo **Settings → Pages → Source: GitHub Actions**.
3. The included workflow
   ([`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml)) builds and
   deploys automatically on every push.
4. Share the `https://<you>.github.io/<repo>/` link.

The game's **Share** button also copies a ready-made "I bonked N points, can you
beat me?" message (and opens the native share sheet on phones).

---

## 🏗️ How it's built (the engineering bit)

The game logic is intentionally decoupled from React, which keeps it simple,
predictable, and unit-testable.

```
src/
├── game/                 # Pure, framework-agnostic game logic
│   ├── types.ts          # Domain model (string-union kinds, no enums)
│   ├── critters.ts       # Critter definitions & emojis
│   ├── engine.ts         # Pure helpers: difficulty curve, weighted spawns,
│   │                     #   combo multiplier, high-score persistence
│   ├── gameState.ts      # The reducer & state machine (idle→countdown→playing→over)
│   ├── sound.ts          # Tiny WebAudio blips (no audio files) + mute
│   └── useGame.ts        # React hook: requestAnimationFrame loop wiring it together
└── components/           # Small presentational components
    ├── StartScreen, Hud, GameBoard, Hole,
    ├── Countdown, GameOverScreen, ShareButton
```

**Highlights worth a recruiter's glance**

- **State machine + pure reducer.** All rules live in `gameState.ts`; randomness
  is injected from the loop so the reducer stays deterministic and testable.
- **`requestAnimationFrame` game loop** using real delta-time, with a difficulty
  curve that ramps spawn rate, critter lifetime, and bomb frequency over the round.
- **Strict TypeScript** end-to-end (`strict`, `noUnusedLocals`,
  `verbatimModuleSyntax`, `erasableSyntaxOnly`).
- **Mobile-first & accessible:** pointer + keyboard input, `aria-live` countdown,
  big tap targets, and a `prefers-reduced-motion` fallback.
- **Resilient persistence:** high score in `localStorage`, wrapped in `try/catch`.
- **Zero UI dependencies** — hand-rolled CSS animations (pop-ups, screen shake,
  confetti).

---

## 🧰 Tech stack

- **React 19** + **TypeScript** (strict)
- **Vite 8** dev server & bundler
- **WebAudio** for sound, **localStorage** for the high score — no backend!

---

Made for fun. Fork it, reskin the critters, and send your friends a link. 🔨🐹💎
