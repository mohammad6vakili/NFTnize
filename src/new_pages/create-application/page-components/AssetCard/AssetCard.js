import { useState, useEffect } from "react"
import classNames from "classnames"
import { OwnerBadge } from "new_components"
import { ReactComponent as AlgoIcon } from "new_assets/icons/algo.svg"
import loadingBubbleAnimation from "new_assets/loadings/bubble.svg"
import { SellTypes } from "utils/constants"
import { formatDuration } from "utils/helper"
import classes from "./AssetCard.module.scss"

export const AssetCard = ({
  owner,
  token,
  metadata,
  currentBid,
  salesPrice,
  endingIn,
  noHover,
  url,
  tab,
  onAssetClick = () => {},
  onAssetLoad = () => {},
}) => {
  const [isVideo, setIsVideo] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)
  useEffect(() => {
    setImgLoading(true)
    setIsVideo(false)
    onAssetLoad(false)
  }, [url])

  const onImageLoadFailed = () => {
    onAssetLoad(true)
    setIsVideo(true)
  }

  return (
    <div className={classNames(classes.asset, noHover && classes["no-hover"])}>
      {owner && (
        <OwnerBadge className={classes.owner} img={owner.img} id={owner.id} />
      )}
      <div className={classes.figure} onClick={onAssetClick}>
        {imgLoading && (
          <img
            src={loadingBubbleAnimation}
            alt="loading"
            className={classes.img}
          />
        )}
        {isVideo ? (
          <video
            preload="auto"
            className={classNames(classes.img, imgLoading && classes.hide_img)}
            loop
            autoPlay
            muted
            onLoadStart={() => setImgLoading(false)}
            onError={() => setImgLoading(false)}
          >
            <source src={`${url}#t=0.1`} type="video/mp4" />
          </video>
        ) : (
          <img
            className={classNames(classes.img, imgLoading && classes.hide_img)}
            loading="lazy"
            src={url}
            alt={metadata?.name}
            onError={() => onImageLoadFailed()}
            onLoad={() => setImgLoading(false)}
          />
        )}
      </div>
      <div className={classes.info}>
        <span className={classes.title}>{`${metadata?.name} ${
          token ? `#${token.id}` : ""
        }`}</span>
        {tab === SellTypes.FIXED_PRICE && (
          <div className={classes.details}>
            {salesPrice !== undefined ? (
              <div className={classes.detail}>
                <span>Sale Price</span>
                <span>
                  <AlgoIcon />
                  <span className={classes.priceText}>
                    {salesPrice > 0 ? salesPrice : 0}&nbsp;ALGO
                  </span>
                </span>
              </div>
            ) : (
              <div className={classes.detail}>
                <span>Sale Price</span>
                <span>
                  <AlgoIcon />
                  <span className={classes.priceText}>0&nbsp;ALGO</span>
                </span>
              </div>
            )}
          </div>
        )}
        {tab === SellTypes.AUCTION && (
          <div className={classes.details}>
            {currentBid !== undefined ? (
              <div className={classes.detail}>
                <span>Current Bid</span>
                <span>
                  <AlgoIcon />
                  <span className={classes.priceText}>
                    {currentBid > 0 ? currentBid : 0}&nbsp;ALGO
                  </span>
                </span>
              </div>
            ) : (
              <div className={classes.detail}>
                <span>Current Bid</span>
                <span>
                  <AlgoIcon />
                  <span className={classes.priceText}>0&nbsp;ALGO</span>
                </span>
              </div>
            )}
            {endingIn ? (
              <div className={classes.detail}>
                <span>Ending In</span>
                <span>{formatDuration(endingIn)}</span>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
