interface Props {
  count: number
}

export function Countdown({ count }: Props) {
  return (
    <div className="countdown" aria-live="assertive">
      <span key={count} className="countdown-number">
        {count > 0 ? count : 'GO!'}
      </span>
    </div>
  )
}
