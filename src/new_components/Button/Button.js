/* eslint-disable react/button-has-type */
import classNames from "classnames"
import classes from "./Button.module.scss"

export const Button = ({
  children,
  type,
  className,
  accent,
  minimal,
  icon,
  to,
  disabled,
  onClick = () => {},
}) => {
  if (type === "anchor") {
    // for external links only
    return (
      <a
        href={to}
        className={classNames(
          classes.button,
          accent && classes[accent],
          minimal && classes.minimal,
          disabled && classes.disabled,
          className
        )}
        target="_blank"
        rel="noreferrer"
        disabled={disabled}
      >
        {children}
      </a>
    )
  }
  if (type === "anchor-link") {
    // for external links only
    return (
      <a
        href={to}
        className={classNames(classes.link, disabled && classes.disabled)}
        target="_blank"
        disabled={disabled}
        rel="noreferrer"
      >
        {children}
      </a>
    )
  }
  return (
    <button
      type={type}
      className={classNames(
        classes.button,
        accent && classes[accent],
        minimal && classes.minimal,
        disabled && classes.disabled,
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && icon} {children}
    </button>
  )
}
