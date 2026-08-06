import { useState } from 'react'
import type { ActiveCritter } from '../game/types'

interface FloatText {
  id: number
  text: string
  tone: 'good' | 'gold' | 'bad' | 'time'
}

let fxSeq = 0

interface Props {
  index: number
  critter: ActiveCritter | null
  multiplier: number
  onBonk: (index: number) => void
}

export function Hole({ index, critter, multiplier, onBonk }: Props) {
  const [fx, setFx] = useState<FloatText[]>([])

  const doBonk = () => {
    const c = critter
    if (c) {
      let text = '+10'
      let tone: FloatText['tone'] = 'good'
      if (c.kind === 'bomb') {
        text = 'OUCH!'
        tone = 'bad'
      } else if (c.kind === 'clock') {
        text = '+3s ⏰'
        tone = 'time'
      } else if (c.kind === 'golden') {
        text = `+${50 * multiplier}`
        tone = 'gold'
      } else {
        text = `+${10 * multiplier}`
        tone = 'good'
      }
      const id = ++fxSeq
      setFx((f) => [...f, { id, text, tone }])
      window.setTimeout(() => setFx((f) => f.filter((x) => x.id !== id)), 700)
    }
    onBonk(index)
  }

  return (
    <div className="hole">
      <div className="hole-back" />
      {critter && (
        <button
          key={critter.id}
          type="button"
          className={`critter kind-${critter.kind}`}
          onPointerDown={(e) => {
            e.preventDefault()
            doBonk()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              doBonk()
            }
          }}
          aria-label={
            critter.kind === 'bomb' ? 'Bomb — do not bonk' : 'Bonk the critter'
          }
        >
          <span aria-hidden="true">{critter.emoji}</span>
        </button>
      )}
      <div className="hole-lip" />
      {fx.map((f) => (
        <span key={f.id} className={`float ${f.tone}`}>
          {f.text}
        </span>
      ))}
    </div>
  )
}
