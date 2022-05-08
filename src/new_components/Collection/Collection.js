/* eslint-disable camelcase */
import classes from "./Collection.module.scss"
import { OwnerBadge } from "new_components"
import { animateScroll as scroll } from "react-scroll"
import { useState, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { formatCreator, getOptImageUrl } from "utils/helper"
import loadingBubbleAnimation from "new_assets/loadings/bubble.svg"

export const Collection = ({
  // eslint-disable-next-line camelcase
  collection_dashboard,
  name,
  artworks,
  creator,
  creatorAddress,
}) => {
  const history = useHistory()
  const [imgLoading, setImgLoading] = useState(true)
  const [imgLoadFailed, setLoadFailed] = useState(false)
  const displayCreator = formatCreator(creator)

  useEffect(() => {
    let mounted = true
    setTimeout(() => {
      if (mounted && imgLoading) setImgLoading(false)
    }, 5000)

    return () => {
      mounted = false
    }
  }, [])

  const handleClickMedia = () => {
    history.push(`/markets/${name}`)
    scroll.scrollToTop()
  }
  const handleOwnerClick = (e) => {
    e.stopPropagation()
    history.push(`/creators/${creatorAddress}`)
    scroll.scrollToTop()
  }
  return (
    <div className={classes.collection} onClick={handleClickMedia}>
      {collection_dashboard && (
        <OwnerBadge
          className={classes.owner}
          img={getOptImageUrl(collection_dashboard.image1, "30x30")}
          onClick={handleOwnerClick}
          id={displayCreator}
        />
      )}
      {imgLoading && (
        <img
          src={loadingBubbleAnimation}
          alt="loading"
          className={classes.img}
        />
      )}
      {!imgLoadFailed ? (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <img
          src={getOptImageUrl(collection_dashboard?.image1, "403x423")}
          alt={name}
          loading="lazy"
          className={imgLoading ? classes.hide_img : classes.img}
          onLoad={() => setImgLoading(false)}
          onError={() => setLoadFailed(true)}
        />
      ) : (
        <video
          className={imgLoading ? classes.hide_img : classes.img}
          onClick={handleClickMedia}
          preload="auto"
          autoPlay
          muted
          onLoadStart={() => setImgLoading(false)}
          onError={() => setImgLoading(false)}
        >
          <source src={collection_dashboard?.image1} type="video/mp4" />
        </video>
      )}
      <div className={classes.info}>
        <span className={classes.title}>{name}</span>
        <span className={classes.artworks}>{artworks} Artworks</span>
      </div>
    </div>
  )
}
