import type { CritterDef, CritterKind } from './types'

// The friendly critters you want to bonk. A random one is chosen each spawn so
// the board stays visually lively and silly.
export const CRITTER_EMOJIS = ['🐹', '🐭', '🐰', '🐸', '🦔', '🐷', '🐨', '🦊']

export const GOLDEN_EMOJI = '💎'
export const BOMB_EMOJI = '💣'
export const CLOCK_EMOJI = '⏰'

export const CRITTER_DEFS: Record<CritterKind, CritterDef> = {
  critter: { kind: 'critter', points: 10, weight: 70, lifetimeScale: 1 },
  golden: { kind: 'golden', points: 50, weight: 8, lifetimeScale: 0.7 },
  bomb: { kind: 'bomb', points: -20, weight: 18, lifetimeScale: 1.1 },
  clock: { kind: 'clock', points: 0, weight: 4, lifetimeScale: 1, addTime: 3 },
}
