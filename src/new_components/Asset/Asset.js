/* eslint-disable no-restricted-globals */
/* eslint-disable react/destructuring-assignment */
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { animateScroll as scroll } from "react-scroll"
import classNames from "classnames"
import { OwnerBadge, Tooltip } from "new_components"
import { formatURL, getOptImageUrl } from "utils/helper"
import { ReactComponent as AlgoIcon } from "new_assets/icons/algo.svg"
import loadingBubbleAnimation from "new_assets/loadings/bubble.svg"
import classes from "./Asset.module.scss"

export const Asset = ({
  owner,
  name,
  // metadata,
  currentBid,
  endingIn,
  total,
  noHover,
  url,
  index,
  lastPrice,
  mint,
}) => {
  const [imgLoadFailed, setLoadFailed] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)
  const [imgURL, setImgURL] = useState("")
  // const [isNftModalOpen, setIsNftModalOpen] = useState(false)
  const bidStatus = false

  useEffect(() => {
    let mounted = true

    const format = async () => {
      const response = await formatURL(url)
      if (mounted) setImgURL(response)
      setTimeout(() => {
        if (mounted && imgLoading) setImgLoading(false)
      }, 5000)
    }
    format()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    setLoadFailed(false)
  }, [imgURL])

  return (
    <div className={classNames(classes.asset, noHover && classes["no-hover"])}>
      {owner && (
        <OwnerBadge className={classes.owner} img={owner.img} id={owner.id} />
      )}
      <Link
        to={`/nft/${index}`}
        onClick={() => {
          scroll.scrollToTop()
        }}
      >
        <div className={classes.figure}>
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
              preload="auto"
              loop
              autoPlay
              muted
              onLoadStart={() => setImgLoading(false)}
              onError={() => setImgLoading(false)}
            >
              <source src={imgURL} type="video/mp4" />
            </video>
          )}
          {/* {metadata?.image_mimetype === "video/mp4" ? (
          <video preload="none" controls className={classes.img}>
            <source src={`${img}#t=0.1`} />
          </video>
        ) : (
          <img
            className={classes.img}
            loading="lazy"
            src={img}
            alt={name}
            onError={() => setLoadFailed(true)}
          />
        )} */}

          {/* <div className={classes.overlay}>
          <Button onClick={() => setIsNftModalOpen(!isNftModalOpen)}>
            Bid on this NFT
          </Button>
        </div> */}
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
                <span>{!mint ? "Last Price" : "Unit Name"}</span>
                <span>
                  {lastPrice === "No Sale" && lastPrice}
                  {/* {!lastPrice && "Checking..."} */}
                  {!isNaN(lastPrice) && (
                    <>
                      <AlgoIcon />
                      {Number(lastPrice) / 100000}&nbsp;ALGO
                    </>
                  )}
                  {/* <AlgoIcon /> */}
                  {/* {unitName} */}
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
      {/* <BidNFTModal
        isOpen={isNftModalOpen}
        onClose={() => setIsNftModalOpen(false)}
        nft={url}
      /> */}
    </div>
  )
}
