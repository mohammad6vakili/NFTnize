import { useEffect, useState } from "react"
import classes from "./Snackbar.module.scss"
import { useSelector } from "react-redux"

import { ReactComponent as CheckIcon } from "assets/icons/success-circle.svg"
import { ReactComponent as ErrorIcon } from "assets/icons/error-circle.svg"
import classNames from "classnames"

export const Snackbar = ({ active, timeout = 3000, color, text, onClose }) => {
  const [isInDom, setIsInDom] = useState(false)
  const [timeoutHandler, setTimeoutHandler] = useState(null)

  useEffect(() => {
    showSnackbar(active)
  }, [active])

  const showSnackbar = (isActive) => {
    if (isActive) {
      setIsInDom(isActive)

      // Close snackbar after setTimeout
      setTimeoutHandler(
        setTimeout(() => {
          closeSnackbar()
        }, timeout)
      )
    }
  }

  const closeSnackbar = () => {
    if (active) {
      setTimeoutHandler(clearTimeout(timeoutHandler))

      onClose()

      setTimeout(() => {
        // set a timer to remove from dom in .25s
        setIsInDom(false)
      }, 250)
    }
  }

  return (
    <>
      {isInDom && (
        <div className={classes.container}>
          <div
            className={classNames(
              classes.snackbar,
              active && classes["snackbar--active"],
              color && classes[color]
            )}
          >
            <div className={classes["text-container"]}>
              {color === "success" && (
                <CheckIcon
                  style={{ color: "#78FA7B" }}
                  className={classes.icon}
                />
              )}
              {color === "error" && <ErrorIcon className={classes.icon} />}

              <span className={classes.text}>{text}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
