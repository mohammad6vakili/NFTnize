import Countdown from "react-countdown"
import classes from "./CountDown.module.scss"

export const CountDown = ({ time = 0, className }) => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    const count = `${
      days > 0 ? `${days}d` : ``
    } ${hours}h ${minutes}m ${seconds}s`
    return (
      <div className={`flex ${classes.countdown} ${className ?? ""}`}>
        {completed ? <p>Finished</p> : <p>{count}</p>}
      </div>
    )
  }

  return time && time >= 0 ? (
    <Countdown date={time} renderer={renderer} />
  ) : (
    <p className="text-md">Not started</p>
  )
}
