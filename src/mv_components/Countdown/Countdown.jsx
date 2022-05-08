import React from "react"
import "./Countdown.css"
import Countdown from "react-countdown"

const MvCountdown = ({ time }) => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (!completed) {
      return (
        <span>
          {days}D {hours}H {minutes}M {seconds}S
        </span>
      )
    }
  }
  return (
    <>
      {" "}
      <Countdown date={time} renderer={renderer} />{" "}
    </>
  )
}
export default MvCountdown
