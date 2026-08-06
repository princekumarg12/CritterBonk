import { useEffect, useState } from 'react'
import type { ActiveCritter } from '../game/types'
import { Hole } from './Hole'

interface Props {
  holes: (ActiveCritter | null)[]
  multiplier: number
  shakeAt: number
  onBonk: (index: number) => void
}

export function GameBoard({ holes, multiplier, shakeAt, onBonk }: Props) {
  const [shaking, setShaking] = useState(false)

  useEffect(() => {
    if (!shakeAt) return
    setShaking(true)
    const id = window.setTimeout(() => setShaking(false), 380)
    return () => window.clearTimeout(id)
  }, [shakeAt])

  return (
    <div className={`board${shaking ? ' shake' : ''}`}>
      {holes.map((critter, i) => (
        <Hole
          key={i}
          index={i}
          critter={critter}
          multiplier={multiplier}
          onBonk={onBonk}
        />
      ))}
    </div>
  )
}
