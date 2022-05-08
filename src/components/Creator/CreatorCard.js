import classes from "./Creator.module.scss"
import { LazyLoadImage } from "react-lazy-load-image-component"
import { Link } from "react-router-dom"

export const CreatorCard = ({ creator }) => {
  const creatorDispStr = `${creator.substr(0, 4)}....${creator.substr(
    creator.length - 4,
    creator.length - 1
  )}`
  return (
    <div className={classes["compact-list"]}>
      <div className={classes["compact-list-figures"]}>
        <LazyLoadImage src="https://unsplash.it/300/300" alt="creator" />
      </div>
      <Link to={`/v1/creators/${creator}`}>{creatorDispStr}</Link>
      {/* <div className={classes["compact-list-owner"]}>
        <LazyLoadImage
          src="https://unsplash.it/100/100"
          alt={`${creator} avatar`}
        />
        <span>{creator}</span>
      </div> */}
    </div>
  )
}
