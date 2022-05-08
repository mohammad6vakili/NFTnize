import { Link } from "react-router-dom"
import classNames from "classnames"
import classes from "./Button.module.scss"

export const Button = ({
  children,
  onClick = () => {},
  accent,
  type,
  to,
  size,
}) => {
  const btnClasses = classNames(
    classes.btn,
    accent && classes[accent],
    size && classes[size]
  )

  if (type === "link") {
    // return a link from react-router
    return (
      <Link to={to} className={btnClasses}>
        {children}
      </Link>
    )
  }

  if (type === "anchor") {
    // for external links only
    return (
      <a href={to} className={btnClasses} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }
  if (type === "anchor-link") {
    // for external links only
    return (
      <a href={to} className={classes.link} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={btnClasses} onClick={onClick}>
      {children}
    </button>
  )
}
