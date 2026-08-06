import { ShareButton } from './ShareButton'

interface Props {
  score: number
  highScore: number
  bonked: number
  bestCombo: number
  isNewHigh: boolean
  onPlayAgain: () => void
}

function rankFor(score: number): { title: string; emoji: string } {
  if (score >= 2000) return { title: 'Legendary Bonker', emoji: '👑' }
  if (score >= 1200) return { title: 'Bonk Master', emoji: '😎' }
  if (score >= 700) return { title: 'Critter Wrangler', emoji: '🤠' }
  if (score >= 300) return { title: 'Bonk Apprentice', emoji: '🔨' }
  if (score > 0) return { title: 'Warming Up', emoji: '🐣' }
  return { title: 'Butterfingers', emoji: '🧈' }
}

const CONFETTI = ['🎉', '🎊', '⭐', '💎', '🐹', '🎈']

export function GameOverScreen({
  score,
  highScore,
  bonked,
  bestCombo,
  isNewHigh,
  onPlayAgain,
}: Props) {
  const rank = rankFor(score)

  return (
    <div className="screen over">
      {isNewHigh && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <span
              key={i}
              style={{
                left: `${(i / 18) * 100}%`,
                animationDelay: `${(i % 6) * 0.15}s`,
              }}
            >
              {CONFETTI[i % CONFETTI.length]}
            </span>
          ))}
        </div>
      )}

      <p className="over-eyebrow">Time's up!</p>
      <div className="rank-emoji" aria-hidden="true">
        {rank.emoji}
      </div>
      <h2 className="rank-title">{rank.title}</h2>

      <div className="final-score">
        <span className="final-score-value">{score.toLocaleString()}</span>
        <span className="final-score-label">points</span>
      </div>

      {isNewHigh ? (
        <p className="new-high">🎉 New high score!</p>
      ) : (
        <p className="hi">
          🏆 Best: <strong>{highScore.toLocaleString()}</strong>
        </p>
      )}

      <div className="stats">
        <div className="stat">
          <strong>{bonked}</strong>
          <span>critters bonked</span>
        </div>
        <div className="stat">
          <strong>{bestCombo}</strong>
          <span>best combo</span>
        </div>
      </div>

      <div className="over-actions">
        <button type="button" className="big-btn" onClick={onPlayAgain}>
          ▶ Play again
        </button>
        <ShareButton score={score} />
      </div>
    </div>
  )
}
