import { Collection } from "components"
import classes from "./List.module.scss"

// mock data

export const List = ({ collections }) => (
  <div className={classes.grid}>
    {collections.map((collection, index) => (
      <Collection {...collection} type="compact-list" key={index} />
    ))}
  </div>
)
