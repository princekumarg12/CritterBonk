import type { CritterKind } from './types'
import {
  BOMB_EMOJI,
  CLOCK_EMOJI,
  CRITTER_DEFS,
  CRITTER_EMOJIS,
  GOLDEN_EMOJI,
} from './critters'

// ---- Tunable constants -------------------------------------------------
export const ROUND_SECONDS = 60
export const HOLE_COUNT = 9
export const HIGH_SCORE_KEY = 'critter-bonk-highscore-v1'
export const MAX_TIME = 99

// ---- Small maths helpers ----------------------------------------------
export function clamp(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, x))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1)
}

// ---- Difficulty curve (progress = elapsed / ROUND_SECONDS, 0..1) -------

/** Time between spawn attempts. Starts relaxed, ends frantic. */
export function spawnIntervalMs(progress: number): number {
  return lerp(750, 320, progress)
}

/** How long a critter stays pop-up. Shrinks as the round heats up. */
export function critterLifetimeMs(progress: number, scale = 1): number {
  return lerp(1400, 720, progress) * scale
}

/** Bombs get more common the longer you play. */
export function bombWeight(progress: number): number {
  return lerp(12, 28, progress)
}

/** Combo tiers: every 5 in a row bumps the multiplier, capped at x5. */
export function multiplierForCombo(combo: number): number {
  return clamp(1 + Math.floor(combo / 5), 1, 5)
}

// ---- Spawn selection (RNG injected for testability) --------------------

export function pickKind(progress: number, rng: () => number): CritterKind {
  const weights: [CritterKind, number][] = [
    ['critter', CRITTER_DEFS.critter.weight],
    ['golden', CRITTER_DEFS.golden.weight],
    ['clock', CRITTER_DEFS.clock.weight],
    ['bomb', bombWeight(progress)],
  ]
  const total = weights.reduce((sum, [, w]) => sum + w, 0)
  let roll = rng() * total
  for (const [kind, w] of weights) {
    if (roll < w) return kind
    roll -= w
  }
  return 'critter'
}

export function emojiForKind(kind: CritterKind, rng: () => number): string {
  switch (kind) {
    case 'golden':
      return GOLDEN_EMOJI
    case 'bomb':
      return BOMB_EMOJI
    case 'clock':
      return CLOCK_EMOJI
    default:
      return CRITTER_EMOJIS[Math.floor(rng() * CRITTER_EMOJIS.length)]
  }
}

// ---- High-score persistence -------------------------------------------
export function loadHighScore(): number {
  try {
    const raw = localStorage.getItem(HIGH_SCORE_KEY)
    const n = raw ? Number.parseInt(raw, 10) : 0
    return Number.isFinite(n) && n > 0 ? n : 0
  } catch {
    return 0
  }
}

export function saveHighScore(score: number): void {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score))
  } catch {
    // Storage disabled (private mode) — ignore.
  }
}
