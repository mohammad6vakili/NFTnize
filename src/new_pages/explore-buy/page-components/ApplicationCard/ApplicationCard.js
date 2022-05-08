import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"
import { animateScroll as scroll } from "react-scroll"
import { LazyLoadImage } from "react-lazy-load-image-component"
import {
  formatDuration,
  formatURL,
  timeDiffAsSec,
  getOptImageUrl,
} from "utils/helper"
import classNames from "classnames"
import { Button, Tooltip } from "new_components"
import { buyTypes } from "utils/constants"
import loadingBubbleAnimation from "new_assets/loadings/bubble.svg"
import { ReactComponent as AlgoIcon } from "new_assets/icons/algo.svg"
import classes from "./ApplicationCard.module.scss"

export const ApplicationCard = ({
  buyType,
  appId,
  nft,
  currentPrice,
  reservedPrice,
  endTime,
  noHover,
  salesPrice,
  highestBidder,
}) => {
  // const selectedApplicationCard = useSelector((state) =>
  //   state.application.applications.find((app) => app.appId === appId)
  // )
  const history = useHistory()

  const [timeCounter, setTimeCounter] = useState(0)
  const [imgURL, setImgURL] = useState("")
  const [imgLoadFailed, setLoadFailed] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)

  const { accts } = useSelector((state) => state.wallet)

  useEffect(() => {
    let mounted = true

    const format = async () => {
      const response = await formatURL(nft.metadata?.image)
      if (mounted) setImgURL(response)
    }
    format()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (buyType !== buyTypes.LIVE_AUCTION) return

    const diff = timeDiffAsSec(endTime)
    if (diff > 0) setTimeCounter(diff)
  }, [endTime])

  useEffect(() => {
    if (buyType !== buyTypes.LIVE_AUCTION) return

    if (!timeCounter) return

    const intervalId = setInterval(() => {
      setTimeCounter(timeCounter - 1)
    }, 1000)

    if (timeCounter < 0) clearInterval(intervalId)

    return () => clearInterval(intervalId)
  }, [timeCounter])

  const openApplication = () => {
    history.push(`/buy/${appId}`)
    scroll.scrollToTop()
  }

  return (
    <div
      className={classNames(classes.asset, noHover && classes["no-hover"])}
      onClick={openApplication}
    >
      <div className={classes.figure}>
        {imgLoading && <img src={loadingBubbleAnimation} alt="loading" />}
        {imgLoadFailed ? (
          <video
            preload="auto"
            autoPlay
            muted
            loop
            onLoadStart={() => setImgLoading(false)}
            onError={() => setImgLoading(false)}
            className={classNames(imgLoading && classes.hide)}
          >
            <source src={imgURL} type="video/mp4" />
          </video>
        ) : (
          <LazyLoadImage
            className={classNames(imgLoading && classes.hide, classes.img)}
            src={getOptImageUrl(imgURL, "322x322")}
            alt={nft.metadata?.image}
            onError={() => setLoadFailed(true)}
            onLoad={() => setImgLoading(false)}
          />
        )}

        <div className={classes.overlay}>
          <Button>
            {buyType === buyTypes.LIVE_AUCTION &&
              timeCounter > 0 &&
              "Bid on this NFT"}
            {buyType === buyTypes.LIVE_AUCTION &&
              timeCounter <= 0 &&
              "View Details"}
            {buyType === buyTypes.BUY_NOW && "Buy this NFT"}
            {buyType === buyTypes.CLOSED_AUCTION && "View Details"}
            {buyType === buyTypes.DELETED_AUCTION && "View Details"}
            {buyType === buyTypes.SOLD && "View Details"}
          </Button>
        </div>
      </div>
      <div className={classes.info}>
        {/* <Tooltip text={nft.metadata?.name} tagClass="title">
          <TextEllipsis lines={1} class="title" tag="p">
            <span>
              {nft.metadata?.name}
            </span>
          </TextEllipsis>
        </Tooltip> */}

        {buyType === buyTypes.FIXED_PRICE && (
          <div className={classes.details}>
            <div className={classes.detail}>
              <span>Sale Price</span>
              <span>
                <AlgoIcon />
                {salesPrice}&nbsp;ALGO
              </span>
            </div>
            <div className={classes.detail}>Buy Now</div>
          </div>
        )}
        {(currentPrice || endTime) && (
          <div className={classes.details}>
            {currentPrice && (
              <div className={classes.detail}>
                <span>
                  <div className={classes.endin}>
                    <span>Current Bid</span>
                  </div>
                </span>
                <span>
                  <AlgoIcon />
                  {currentPrice}&nbsp;ALGO
                </span>
              </div>
            )}
            {endTime && (
              <div className={classNames(classes.detail, classes.minWidth13)}>
                {timeCounter > 0 ? (
                  <>
                    <span>
                      <div className={classes.endin}>
                        <span>Ending In</span>
                        {accts.includes(highestBidder) && (
                          <Tooltip text="You are the highest bidder.">
                            <div className={classes.indicator} />
                          </Tooltip>
                        )}
                      </div>
                    </span>
                    <span>{formatDuration(timeCounter)}</span>
                  </>
                ) : (
                  <div className={classes.result}>
                    <div className={classes.closed}>Auction Closed</div>
                    {currentPrice &&
                    reservedPrice &&
                    accts.includes(highestBidder) ? (
                      <Tooltip
                        text={
                          Number(currentPrice) >= Number(reservedPrice)
                            ? "You won the auction."
                            : "You are the highest bidder."
                        }
                      >
                        <div className={classes.indicator} />
                      </Tooltip>
                    ) : undefined}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {salesPrice && (
          <div className={classes.details}>
            {salesPrice && (
              <div className={classes.detail}>
                <span>Sale Price</span>
                <span>
                  <AlgoIcon />
                  {salesPrice}&nbsp;ALGO
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      {/* <ReactTooltip
        id="closed"
        place="right"
        effect="solid"
        multiline
        backgroundColor="#222"
        border
        borderColor="#2d2d57"
      >
        {Number(currentPrice) >= Number(reservedPrice)
          ? "You won the auction."
          : "You are the highest bidder."}
      </ReactTooltip> */}
    </div>
  )
}
