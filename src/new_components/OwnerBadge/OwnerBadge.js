import classNames from "classnames"
import classes from "./OwnerBadge.module.scss"
import { useState } from "react"

export const OwnerBadge = ({ img, id, className, accent, onClick }) => {
  const [imgLoadFailed, setLoadFailed] = useState(false)
  if (img && id) {
    return (
      <div
        className={classNames(
          classes.owner,
          className,
          accent && classes[accent]
        )}
        onClick={onClick}
      >
        {!imgLoadFailed ? (
          <img
            src={img}
            alt={img}
            loading="lazy"
            onError={() => setLoadFailed(true)}
          />
        ) : (
          <video preload="auto" autoPlay loop muted>
            <source src={img} type="video/mp4" />
          </video>
        )}

        <span>@{id}</span>
      </div>
    )
  } else {
    return <></>
  }
}
