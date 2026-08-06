import type { ActiveCritter, GameStatus } from './types'
import {
  HOLE_COUNT,
  MAX_TIME,
  ROUND_SECONDS,
  multiplierForCombo,
} from './engine'
import { CRITTER_DEFS } from './critters'

export interface GameState {
  status: GameStatus
  score: number
  combo: number
  bestCombo: number
  bonked: number
  timeLeft: number
  holes: (ActiveCritter | null)[]
  highScore: number
  countdown: number
  /** performance.now() of the last bomb hit — drives the screen-shake. */
  shakeAt: number
}

export type GameAction =
  | { type: 'start' }
  | { type: 'countdownTick' }
  | { type: 'tick'; now: number; dt: number; spawn: SpawnRequest | null }
  | { type: 'bonk'; index: number; now: number }
  | { type: 'reset' }

export interface SpawnRequest {
  index: number
  critter: ActiveCritter
}

export function createInitialState(highScore = 0): GameState {
  return {
    status: 'idle',
    score: 0,
    combo: 0,
    bestCombo: 0,
    bonked: 0,
    timeLeft: ROUND_SECONDS,
    holes: Array.from({ length: HOLE_COUNT }, () => null),
    highScore,
    countdown: 3,
    shakeAt: 0,
  }
}

function freshRound(state: GameState): GameState {
  return {
    ...createInitialState(state.highScore),
    status: 'countdown',
    countdown: 3,
  }
}

export function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'start':
      return freshRound(state)

    case 'countdownTick': {
      if (state.status !== 'countdown') return state
      if (state.countdown > 1) {
        return { ...state, countdown: state.countdown - 1 }
      }
      return { ...state, status: 'playing', countdown: 0 }
    }

    case 'tick': {
      if (state.status !== 'playing') return state

      const timeLeft = state.timeLeft - action.dt
      if (timeLeft <= 0) {
        // Round over — clear the board and bank a new high score.
        return {
          ...state,
          status: 'over',
          timeLeft: 0,
          holes: state.holes.map(() => null),
          highScore: Math.max(state.highScore, state.score),
        }
      }

      // Despawn expired critters. If a *scoring* critter escapes, the combo
      // resets — you have to stay sharp.
      let combo = state.combo
      const holes = state.holes.map((c) => {
        if (c && c.expiresAt <= action.now) {
          if (c.kind === 'critter' || c.kind === 'golden') combo = 0
          return null
        }
        return c
      })

      // Place a freshly spawned critter, if the loop asked for one.
      if (action.spawn && holes[action.spawn.index] === null) {
        holes[action.spawn.index] = action.spawn.critter
      }

      return { ...state, timeLeft, holes, combo }
    }

    case 'bonk': {
      if (state.status !== 'playing') return state
      const critter = state.holes[action.index]
      if (!critter) return state

      const holes = state.holes.slice()
      holes[action.index] = null

      if (critter.kind === 'bomb') {
        const def = CRITTER_DEFS.bomb
        return {
          ...state,
          holes,
          score: Math.max(0, state.score + def.points),
          combo: 0,
          shakeAt: action.now,
        }
      }

      if (critter.kind === 'clock') {
        const add = CRITTER_DEFS.clock.addTime ?? 0
        return {
          ...state,
          holes,
          timeLeft: Math.min(MAX_TIME, state.timeLeft + add),
          bonked: state.bonked + 1,
        }
      }

      // Normal or golden critter — combo up, apply the multiplier.
      const combo = state.combo + 1
      const gained = CRITTER_DEFS[critter.kind].points * multiplierForCombo(combo)
      return {
        ...state,
        holes,
        score: state.score + gained,
        combo,
        bestCombo: Math.max(state.bestCombo, combo),
        bonked: state.bonked + 1,
      }
    }

    case 'reset':
      return createInitialState(state.highScore)

    default:
      return state
  }
}
