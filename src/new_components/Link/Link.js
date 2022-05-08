import { Link as ReactLink } from "react-router-dom"
import classNames from "classnames"
import classes from "./Link.module.scss"

export const Link = ({
  children,
  accent,
  type,
  to,
  size,
  onClick = () => {},
}) => {
  const btnClasses = classNames(
    classes.btn,
    accent && classes[accent],
    size && classes[size]
  )

  if (type === "link") {
    // return a link from react-router
    return (
      <ReactLink to={to} className={btnClasses}>
        {children}
      </ReactLink>
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
