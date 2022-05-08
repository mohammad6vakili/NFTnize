import { CreatorCard } from "components"
import classes from "./List.module.scss"

// mock data

export const List = ({ creators }) => (
  <div className={classes.grid}>
    {creators.map((creator, index) => (
      <CreatorCard creator={creator} key={index} />
    ))}
  </div>
)
