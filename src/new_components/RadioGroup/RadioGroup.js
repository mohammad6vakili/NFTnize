import classNames from "classnames"
import { createContext } from "react"
import classes from "./RadioGroup.module.scss"

export const RadioGroupContext = createContext()
RadioGroupContext.displayName = "RadioGroupContext"

export const RadioGroup = ({
  onChange,
  selected,
  children,
  horizontal,
  closer,
  center,
  label,
  required,
}) => {
  const inputRandomId = `textarea-${Math.random()}`
  return (
    <div>
      {label && (
        <label htmlFor={inputRandomId} className={classes.label}>
          {label} {required && <span style={{ color: "#ff39b0" }}>*</span>}
        </label>
      )}
      <div
        className={classNames(
          classes.container,
          horizontal && classes.horizontal,
          closer ? classes.gap2 : classes.gap3,
          center && classes.justifyCenter
        )}
      >
        <RadioGroupContext.Provider value={{ selected, onChange }}>
          {children}
        </RadioGroupContext.Provider>
      </div>
    </div>
  )
}
