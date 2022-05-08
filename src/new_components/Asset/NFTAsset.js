/* eslint-disable react/destructuring-assignment */
import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { animateScroll as scroll } from "react-scroll"
import { OwnerBadge, Tooltip } from "new_components"
import { formatURL, getOptImageUrl } from "utils/helper"
import { ReactComponent as AlgoIcon } from "new_assets/icons/algo.svg"
import classNames from "classnames"
import loadingBubbleAnimation from "new_assets/loadings/bubble.svg"
import classes from "./Asset.module.scss"

export const NFTAsset = ({
  owner,
  name,
  // metadata,
  currentBid,
  endingIn,
  total,
  noHover,
  url,
  index,
}) => {
  const mounted = useRef(false)

  const [imgURL, setImgURL] = useState(url)
  const [imgLoadFailed, setLoadFailed] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    const format = async () => {
      const response = await formatURL(url)
      if (mounted.current) setImgURL(response)
      setTimeout(() => {
        if (imgLoading && mounted.current) setImgLoading(false)
      }, 5000)
    }
    format()
  }, [url])

  useEffect(() => {
    setLoadFailed(false)
  }, [imgURL])

  const bidStatus = false
  return (
    <div className={classNames(classes.asset, noHover && classes["no-hover"])}>
      {owner && (
        <OwnerBadge className={classes.owner} img={owner.img} id={owner.id} />
      )}
      <Link
        to={`/mint-nft/${index}`}
        onClick={() => {
          scroll.scrollToTop()
        }}
      >
        <div className={classes.figure}>
          {/* <img
            src={getOptImageUrl(imgURL, "322x322")}
            alt={name}
            loading="lazy"
            className={classes.img}
            onError={() => setLoadFailed(true)}
          /> */}
          {imgLoading && (
            <img
              src={loadingBubbleAnimation}
              alt="loading"
              className={classes.img}
            />
          )}
          {!imgLoadFailed ? (
            <img
              src={getOptImageUrl(imgURL, "322x322")}
              alt={name}
              loading="lazy"
              className={imgLoading ? classes.hide_img : classes.img}
              onLoad={() => setImgLoading(false)}
              onError={() => setLoadFailed(true)}
            />
          ) : (
            <video
              className={imgLoading ? classes.hide_img : classes.img}
              preload="none"
              loop
              autoPlay
              muted
              onLoadStart={() => setImgLoading(false)}
              onError={() => setImgLoading(false)}
            >
              <source src={imgURL} />
            </video>
          )}
        </div>

        <div className={classes.info}>
          <Tooltip text={name}>
            <span className={classes.title}>{name}</span>
          </Tooltip>

          {(currentBid || endingIn) && (
            <div className={classes.details}>
              {currentBid && (
                <div className={classes.detail}>
                  <span>Current Bid</span>
                  <span>
                    <AlgoIcon />
                    {currentBid}&nbsp;ALGO
                  </span>
                </div>
              )}
              {endingIn && (
                <div className={classes.detail}>
                  <span>Ending In</span>
                  <span>{endingIn}</span>
                </div>
              )}
            </div>
          )}
          {!bidStatus && (
            <div className={classes.details}>
              <div className={classes.detail}>
                <span>Last Price</span>
                <span>
                  <AlgoIcon />
                  {currentBid}&nbsp;ALGO
                </span>
              </div>
              <div className={classes.detail}>
                <span>Total</span>
                <span>{total}</span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
