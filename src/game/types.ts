// Shared domain types for Critter Bonk.

export type CritterKind = 'critter' | 'golden' | 'bomb' | 'clock'

export interface CritterDef {
  kind: CritterKind
  /** Points added when bonked (before combo multiplier; may be negative). */
  points: number
  /** Base spawn weight (bombs are overridden by a difficulty curve). */
  weight: number
  /** Multiplies the base on-screen lifetime (golden critters are quicker). */
  lifetimeScale: number
  /** Seconds added to the clock when bonked (clock power-up only). */
  addTime?: number
}

export interface ActiveCritter {
  id: number
  kind: CritterKind
  emoji: string
  /** performance.now() timestamps. */
  bornAt: number
  expiresAt: number
}

export type GameStatus = 'idle' | 'countdown' | 'playing' | 'over'
