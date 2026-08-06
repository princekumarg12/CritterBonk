// Minimal WebAudio sound effects — no audio files, just synthesised blips.
// The AudioContext is created lazily on first use (after a user gesture) to
// comply with browser autoplay policies.

let ctx: AudioContext | null = null
let muted = false

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext }

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  return ctx
}

export function setMuted(value: boolean): void {
  muted = value
}

export function isMuted(): boolean {
  return muted
}

function blip(
  freq: number,
  duration: number,
  type: OscillatorType = 'square',
  gain = 0.06,
): void {
  if (muted) return
  const c = audio()
  if (!c) return
  try {
    const osc = c.createOscillator()
    const vol = c.createGain()
    osc.type = type
    osc.frequency.value = freq
    osc.connect(vol)
    vol.connect(c.destination)
    const t = c.currentTime
    vol.gain.setValueAtTime(gain, t)
    vol.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    osc.start(t)
    osc.stop(t + duration)
  } catch {
    // Ignore audio hiccups — sound is non-essential.
  }
}

export function playBonk(): void {
  blip(420, 0.08, 'square', 0.05)
}

export function playGold(): void {
  blip(660, 0.07, 'square', 0.05)
  blip(990, 0.12, 'square', 0.04)
}

export function playBomb(): void {
  blip(110, 0.28, 'sawtooth', 0.11)
}

export function playPowerup(): void {
  blip(520, 0.07, 'triangle', 0.06)
  blip(780, 0.1, 'triangle', 0.05)
}
