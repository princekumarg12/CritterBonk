import { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import type { SpawnRequest } from './gameState'
import { createInitialState, reducer } from './gameState'
import {
  ROUND_SECONDS,
  clamp,
  critterLifetimeMs,
  emojiForKind,
  loadHighScore,
  multiplierForCombo,
  pickKind,
  saveHighScore,
  spawnIntervalMs,
} from './engine'
import { CRITTER_DEFS } from './critters'
import { playBomb, playBonk, playGold, playPowerup, setMuted } from './sound'

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    createInitialState(loadHighScore()),
  )
  const [muted, setMutedState] = useState(false)

  // Live refs the animation loop can read without re-subscribing every frame.
  const holesRef = useRef(state.holes)
  holesRef.current = state.holes
  const statusRef = useRef(state.status)
  statusRef.current = state.status

  const lastRef = useRef(0)
  const spawnAccRef = useRef(0)
  const elapsedRef = useRef(0)
  const critterIdRef = useRef(0)

  // Persist the high score whenever it improves.
  useEffect(() => {
    saveHighScore(state.highScore)
  }, [state.highScore])

  // Mirror the mute toggle into the sound module.
  useEffect(() => {
    setMuted(muted)
  }, [muted])

  // 3 · 2 · 1 · GO! countdown.
  useEffect(() => {
    if (state.status !== 'countdown') return
    const id = window.setInterval(
      () => dispatch({ type: 'countdownTick' }),
      700,
    )
    return () => window.clearInterval(id)
  }, [state.status])

  // The main game loop, driven by requestAnimationFrame for smoothness.
  useEffect(() => {
    if (state.status !== 'playing') return

    lastRef.current = performance.now()
    elapsedRef.current = 0
    spawnAccRef.current = Number.MAX_SAFE_INTEGER // spawn immediately

    let raf = 0
    const frame = (now: number) => {
      // Clamp big gaps (e.g. tab was backgrounded) so nothing teleports.
      const dt = Math.min(0.1, (now - lastRef.current) / 1000)
      lastRef.current = now
      elapsedRef.current += dt
      const progress = clamp(elapsedRef.current / ROUND_SECONDS, 0, 1)

      let spawn: SpawnRequest | null = null
      spawnAccRef.current += dt * 1000
      if (spawnAccRef.current >= spawnIntervalMs(progress)) {
        spawnAccRef.current = 0
        const empties: number[] = []
        holesRef.current.forEach((c, i) => {
          if (!c) empties.push(i)
        })
        if (empties.length > 0) {
          const index = empties[Math.floor(Math.random() * empties.length)]
          const kind = pickKind(progress, Math.random)
          const emoji = emojiForKind(kind, Math.random)
          const life = critterLifetimeMs(
            progress,
            CRITTER_DEFS[kind].lifetimeScale,
          )
          spawn = {
            index,
            critter: {
              id: ++critterIdRef.current,
              kind,
              emoji,
              bornAt: now,
              expiresAt: now + life,
            },
          }
        }
      }

      dispatch({ type: 'tick', now, dt, spawn })
      if (statusRef.current === 'playing') raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [state.status])

  const start = useCallback(() => dispatch({ type: 'start' }), [])
  const reset = useCallback(() => dispatch({ type: 'reset' }), [])
  const toggleMute = useCallback(() => setMutedState((m) => !m), [])

  const bonk = useCallback((index: number) => {
    const critter = holesRef.current[index]
    if (!critter) return
    switch (critter.kind) {
      case 'bomb':
        playBomb()
        break
      case 'golden':
        playGold()
        break
      case 'clock':
        playPowerup()
        break
      default:
        playBonk()
    }
    dispatch({ type: 'bonk', index, now: performance.now() })
  }, [])

  return {
    state,
    multiplier: multiplierForCombo(state.combo),
    muted,
    start,
    reset,
    bonk,
    toggleMute,
  }
}
