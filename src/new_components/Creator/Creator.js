import classes from "./Creator.module.scss"
import { formatCreator } from "utils/helper"
import { useState } from "react"
import { Link, useHistory } from "react-router-dom"

export const Creator = ({ img, id, artworks, creator, creatorAddress }) => {
  const history = useHistory()
  const [imgLoadFailed, setLoadFailed] = useState(false)
  const handleClickCreator = () => {
    history.push(`/creators/${creatorAddress}`)
  }
  return (
    <div className={classes.creator} onClick={handleClickCreator}>
      <span className={classes.artworks}>{artworks} Artworks</span>
      <Link to={`/creators/${creatorAddress}`}>
        {!imgLoadFailed ? (
          <img
            src={img}
            alt={id}
            className={classes.img}
            onError={() => setLoadFailed(true)}
          />
        ) : (
          <video className={classes.img} preload="auto" autoPlay loop muted>
            <source src={img} type="video/mp4" />
          </video>
        )}
      </Link>
      <span className={classes.id}>@{formatCreator(creator)}</span>
    </div>
  )
}
