import classNames from "classnames"
import classes from "./BlockTitle.module.scss"

export const BlockTitle = ({ title, children, className }) => (
  <div className={classNames(classes.container, className)}>
    <h2 className={classes.title}>{title}</h2>
    {children}
  </div>
)
