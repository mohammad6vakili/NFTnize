import classes from "./List.module.scss"
import { CollectionLoading } from "components/Collection/Loading"

export const ListLoading = () => (
  <div className={classes.grid}>
    {[...Array(4).keys()].map((key) => (
      <CollectionLoading type="compact-list" key={key} />
    ))}
  </div>
)
