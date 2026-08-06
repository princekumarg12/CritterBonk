import { ROUND_SECONDS } from '../game/engine'

interface Props {
  score: number
  timeLeft: number
  combo: number
  multiplier: number
  muted: boolean
  onToggleMute: () => void
}

export function Hud({
  score,
  timeLeft,
  combo,
  multiplier,
  muted,
  onToggleMute,
}: Props) {
  const pct = Math.max(0, Math.min(1, timeLeft / ROUND_SECONDS)) * 100
  const low = timeLeft <= 10

  return (
    <div className="hud">
      <div className="hud-row">
        <div className="hud-score">
          <span className="hud-score-value">{score.toLocaleString()}</span>
          <span className="hud-score-label">score</span>
        </div>

        <div className={`hud-combo${combo >= 5 ? ' hot' : ''}`}>
          {combo >= 2 ? (
            <>
              <span className="combo-x">x{multiplier}</span>
              <span className="combo-count">{combo} combo 🔥</span>
            </>
          ) : (
            <span className="combo-hint">build a combo!</span>
          )}
        </div>

        <button
          type="button"
          className="mute-btn"
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>

      <div className="time-bar">
        <div
          className={`time-fill${low ? ' low' : ''}`}
          style={{ width: `${pct}%` }}
        />
        <span className="time-text">{Math.ceil(timeLeft)}s</span>
      </div>
    </div>
  )
}
