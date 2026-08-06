import { useState } from 'react'

interface Props {
  score: number
}

export function ShareButton({ score }: Props) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    const text = `I bonked ${score.toLocaleString()} points in Critter Bonk! 🔨 Can you beat me?`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Critter Bonk!', text, url })
        return
      }
      await navigator.clipboard.writeText(`${text} ${url}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Share sheet dismissed or clipboard blocked — no problem.
    }
  }

  return (
    <button type="button" className="ghost-btn" onClick={share}>
      {copied ? 'Copied! ✅' : 'Share score 🔗'}
    </button>
  )
}
