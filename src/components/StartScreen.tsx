interface Props {
  highScore: number
  muted: boolean
  onStart: () => void
  onToggleMute: () => void
}

const LEGEND = [
  { emoji: '🐹', text: 'Bonk critters for points' },
  { emoji: '💎', text: 'Gems = big points' },
  { emoji: '⏰', text: 'Clocks add time' },
  { emoji: '💣', text: "Bombs? Don't!" },
]

export function StartScreen({ highScore, muted, onStart, onToggleMute }: Props) {
  return (
    <div className="screen start">
      <button
        type="button"
        className="mute-btn corner"
        onClick={onToggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? '🔇' : '🔊'}
      </button>

      <div className="title-mallet" aria-hidden="true">
        🔨
      </div>
      <h1 className="title">Critter Bonk!</h1>
      <p className="subtitle">Bonk the critters. Dodge the bombs. Have a giggle.</p>

      <ul className="legend">
        {LEGEND.map((l) => (
          <li key={l.emoji}>
            <span className="legend-emoji" aria-hidden="true">
              {l.emoji}
            </span>
            {l.text}
          </li>
        ))}
      </ul>

      <button type="button" className="big-btn" onClick={onStart}>
        ▶ Play
      </button>

      {highScore > 0 && (
        <p className="hi">
          🏆 Best score: <strong>{highScore.toLocaleString()}</strong>
        </p>
      )}
    </div>
  )
}
