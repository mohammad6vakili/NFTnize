import { useState, useEffect } from "react"
import classNames from "classnames"
import classes from "./DurationPicker.module.scss"
import { add, format, differenceInSeconds } from "date-fns"

export const DurationPicker = ({
  onChange = () => {},
  className,
  label,
  labelAccent,
  disabled,
}) => {
  const inputRandomIdDay = `duration-picker-day-${Math.random()}`
  const inputRandomIdHour = `duration-picker-hour-${Math.random()}`
  const inputRandomIdMin = `duration-picker-min-${Math.random()}`
  const inputRandomIdSec = `duration-picker-sec-${Math.random()}`

  const [day, setDay] = useState("00")
  const [hour, setHour] = useState("00")
  const [min, setMin] = useState("00")
  const [sec, setSec] = useState("00")

  const [time, setTime] = useState("")

  const [inputErrors, setInputErrors] = useState({
    day: false,
    hour: false,
    min: false,
    sec: false,
  })
  // if user did not enter any value in any of inputs
  const [error, setError] = useState("")

  useEffect(() => {
    const now = Date.now()

    const timeInFuture = add(now, {
      days: day,
      hours: hour,
      minutes: min,
      seconds: sec,
    })

    setTime(timeInFuture)

    const diffInSeconds = differenceInSeconds(timeInFuture, now)

    // validate
    const errorsObj = {
      day: false,
      hour: hour >= 25,
      min: min >= 61,
      sec: sec >= 61,
    }

    setInputErrors(errorsObj)

    if (Object.values(errorsObj).every((field) => !field)) {
      // all fields are valid, check all inputs value all together
      if (diffInSeconds === 0) setError("Duration is required")
      else setError("")
    } else if (errorsObj.hour) setError("Hour must be between 0 and 24")
    else if (errorsObj.min) setError("Minute must be between 0 and 60")
    else if (errorsObj.sec) setError("Second must be between 0 and 60")

    onChange(diffInSeconds)
  }, [day, hour, min, sec])

  const handleValidate = (num) => {
    const input = Number(num)

    if (input < 0) {
      return 0
    }

    return input
  }

  const handleSetDay = (d) => {
    setDay(handleValidate(d))
  }

  const handleSetHour = (h) => {
    setHour(handleValidate(h))
  }
  const handleSetMin = (m) => {
    setMin(handleValidate(m))
  }

  const handleSetSec = (s) => {
    setSec(handleValidate(s))
  }

  return (
    <div
      className={classNames(
        classes.container,
        error && classes.error,
        disabled && classes.disabled,
        className
      )}
    >
      {label && (
        <label
          htmlFor={inputRandomIdDay}
          className={classNames(
            classes.label,
            labelAccent && classes["label-accent-pink"]
          )}
        >
          {label} <span style={{ color: "#ff39b0" }}>*</span>
        </label>
      )}
      <div className={classes["inputs-container"]}>
        <div className={classes["input-container"]}>
          <input
            className={classNames(
              classes.input,
              inputErrors.day && classes["input--error"]
            )}
            type="number"
            value={day}
            onChange={(e) => handleSetDay(e.target.value)}
            id={inputRandomIdDay}
            disabled={disabled}
            min="0"
          />
          <label className={classes["input-label"]} htmlFor={inputRandomIdDay}>
            D
          </label>
        </div>

        <div className={classes["input-container"]}>
          <input
            className={classNames(
              classes.input,
              inputErrors.hour && classes["input--error"]
            )}
            type="number"
            value={hour}
            onChange={(e) => handleSetHour(e.target.value)}
            id={inputRandomIdHour}
            disabled={disabled}
            min="0"
          />
          <label className={classes["input-label"]} htmlFor={inputRandomIdHour}>
            H
          </label>
        </div>

        <div className={classes["input-container"]}>
          <input
            className={classNames(
              classes.input,
              inputErrors.min && classes["input--error"]
            )}
            type="number"
            value={min}
            onChange={(e) => handleSetMin(e.target.value)}
            id={inputRandomIdMin}
            disabled={disabled}
            min="0"
          />
          <label className={classes["input-label"]} htmlFor={inputRandomIdMin}>
            M
          </label>
        </div>

        <div className={classes["input-container"]}>
          <input
            className={classNames(
              classes.input,
              inputErrors.sec && classes["input--error"]
            )}
            type="number"
            value={sec}
            onChange={(e) => handleSetSec(e.target.value)}
            id={inputRandomIdSec}
            disabled={disabled}
            min="0"
          />
          <label className={classes["input-label"]} htmlFor={inputRandomIdSec}>
            S
          </label>
        </div>

        {time && (
          <span className={classes.time}>
            {format(time, "MM-dd-yyyy kk:mm:ss")}
          </span>
        )}
      </div>
      <div className={classes["error-container"]}>{error}</div>
    </div>
  )
}
