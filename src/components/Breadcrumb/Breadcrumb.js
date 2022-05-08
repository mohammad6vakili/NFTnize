import classes from "./Breadcrumb.module.scss"
import { Link } from "react-router-dom"

export const Breadcrumb = ({ paths, className }) => (
  <nav className={className}>
    <ul className={classes.list}>
      {paths.map((path, index) => {
        if (index + 1 !== paths.length) {
          return (
            <li className={classes.item} key={index}>
              <Link to={path.to}>{path.label}</Link>
            </li>
          )
        }

        return (
          <li className={classes.item} key={index}>
            {path.label}
          </li>
        )
      })}
    </ul>
  </nav>
)
