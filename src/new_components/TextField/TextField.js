/* eslint-disable react/jsx-no-duplicate-props */
import classNames from "classnames"
import classes from "./TextField.module.scss"
import { ReactComponent as QuestionMarkIcon } from "new_assets/icons/question-mark-circle.svg"
import { Tooltip } from "new_components"
import { useEffect, useRef } from "react"

export const TextField = ({
  placeholder,
  value,
  onChange = () => {},
  onEnterPress = () => {},
  className,
  label,
  required,
  error,
  warning,
  icon,
  name,
  type = "text",
  min,
  max,
  labelAccent,
  disabled,
  capitalizeLabel,
  pinkBorder,
  textCenter,
  tooltipText,
  focus = false,
}) => {
  const inputRandomId = `text-field-${Math.random()}`
  const bidNumberInput = useRef(null)

  const handleKeyDown = (e) => {
    if (e.code === "Enter" && onEnterPress) {
      onEnterPress(e)
    }
  }

  useEffect(() => {
    if (focus) {
      bidNumberInput.current.focus()
    }
  }, [])

  return (
    <div
      className={classNames(
        classes.container,
        error && !warning && classes.error,
        !error && warning && classes.warning,
        disabled && classes.disabled,
        className
      )}
    >
      {label && (
        <label
          htmlFor={inputRandomId}
          className={classNames(
            classes.label,
            labelAccent && classes["label-accent-pink"],
            capitalizeLabel && classes["label-capitalize"]
          )}
        >
          {label} {required && <span>*</span>}
          {tooltipText && (
            <Tooltip placement="auto" text={tooltipText}>
              <QuestionMarkIcon />
            </Tooltip>
          )}
        </label>
      )}
      <div
        className={classNames(
          classes["input-container"],
          pinkBorder && classes.pinkBorder,
          textCenter && classes.textCenter
        )}
      >
        {icon && icon}
        <input
          className={classes.input}
          type={type}
          min={min}
          max={max}
          placeholder={placeholder}
          defaultValue={name === "decimal" && type === "number" ? 0 : value}
          onChange={(e) => onChange(e)}
          onKeyDown={handleKeyDown}
          id={inputRandomId}
          name={name}
          disabled={disabled}
          ref={bidNumberInput}
        />
      </div>
      <div
        className={classNames(
          !error && warning && classes["warning-container"],
          error && !warning && classes["error-container"],
          textCenter && classes.textCenter
        )}
      >
        {error && !warning && error}
        {!error && warning && warning}
      </div>
    </div>
  )
}
