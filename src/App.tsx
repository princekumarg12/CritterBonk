import { useEffect, useRef } from 'react'
import { useGame } from './game/useGame'
import { StartScreen } from './components/StartScreen'
import { Hud } from './components/Hud'
import { GameBoard } from './components/GameBoard'
import { Countdown } from './components/Countdown'
import { GameOverScreen } from './components/GameOverScreen'

function App() {
  const game = useGame()
  const { state } = game

  // Remember the high score going *into* a round so we can tell whether the
  // player just beat it on the game-over screen.
  const preHighRef = useRef(state.highScore)
  useEffect(() => {
    if (state.status === 'countdown') preHighRef.current = state.highScore
  }, [state.status, state.highScore])
  const isNewHigh =
    state.status === 'over' && state.score > 0 && state.score > preHighRef.current

  if (state.status === 'idle') {
    return (
      <div className="app">
        <StartScreen
          highScore={state.highScore}
          muted={game.muted}
          onStart={game.start}
          onToggleMute={game.toggleMute}
        />
      </div>
    )
  }

  return (
    <div className="app playing-bg">
      <Hud
        score={state.score}
        timeLeft={state.timeLeft}
        combo={state.combo}
        multiplier={game.multiplier}
        muted={game.muted}
        onToggleMute={game.toggleMute}
      />

      <div className="board-wrap">
        <GameBoard
          holes={state.holes}
          multiplier={game.multiplier}
          shakeAt={state.shakeAt}
          onBonk={game.bonk}
        />

        {state.status === 'countdown' && <Countdown count={state.countdown} />}

        {state.status === 'over' && (
          <GameOverScreen
            score={state.score}
            highScore={state.highScore}
            bonked={state.bonked}
            bestCombo={state.bestCombo}
            isNewHigh={isNewHigh}
            onPlayAgain={game.start}
          />
        )}
      </div>
    </div>
  )
}

export default App
