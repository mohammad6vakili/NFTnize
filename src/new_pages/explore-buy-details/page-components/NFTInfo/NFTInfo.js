/* eslint-disable jsx-a11y/img-redundant-alt */
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router-dom"
// import classNames from "classnames"
import { SessionWallet } from "algorand-session-wallet"

import loadingBubbleAnimation from "new_assets/loadings/bubble.svg"
import { ReactComponent as VerifiedIcon } from "assets/icons/verified.svg"
import { ReactComponent as UnVerifiedIcon } from "assets/icons/unVerified.svg"
import {
  AlertModal,
  BidNFTModal,
  Button,
  ImagePreviewModal,
  Tooltip,
} from "new_components"
import { Snackbar } from "components"
import { buyTypes } from "utils/constants"
import {
  formatDuration,
  formatURL,
  formatAddress,
  getOptImageUrl,
} from "utils/helper"
import {
  setSessionWallet,
  setAccounts,
  setConnectedStatus,
} from "redux/wallet/wallet-slice"
import { ReactComponent as AlgoIcon } from "new_assets/icons/algo.svg"
import { ReactComponent as HomeHeroGround } from "new_assets/shapes/ground.svg"
import { ReactComponent as ArrowRightIcon } from "new_assets/icons/arrow-right.svg"
import { ReactComponent as CopyIcon } from "assets/icons/duplicate.svg"
// import { ReactComponent as ShareIcon } from "new_assets/icons/share.svg"
// import { ReactComponent as HeartIcon } from "new_assets/icons/heart.svg"
import classes from "./NFTInfo.module.scss"

export const NFTInfo = ({
  asset,
  assetId,
  salesPrice,
  currentPrice,
  highestBidder,
  timeCounter,
  endTime,
  buyType,
  lastBid,
  bidLoading,
  onBidAuction,
  onCloseAuction,
  onClaimAuction,
  onBuyNow,
  onCloseBuyNow,
  reservedPrice,
  creator,
  buyLoading,
  closeAuctionLoading,
  isVerified,
  verifyLoading,
  currentOwner,
  // onMakeOffer,
}) => {
  const mounted = useRef(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const snackbarInitValues = {
    isActive: false,
    text: "",
    color: "",
    timeout: 3000,
  }

  const [isBidModalOpen, setIsBidModalOpen] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)
  const [imgURL, setImgURL] = useState("")
  const [imgLoadFailed, setLoadFailed] = useState(false)
  const [auctionClosed, setAuctionClosed] = useState(false)
  // const [share, setShare] = useState(false)
  // const [love, setLove] = useState(false)
  const [alertMessage, setAlertMessage] = useState({})
  const [isWinner, setIsWinner] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false)
  const { accts, sessionWallet } = useSelector((state) => state.wallet)
  const [snackbar, setSnackbar] = useState(snackbarInitValues)

  const isClaimNFT =
    isWinner &&
    lastBid &&
    Number(reservedPrice) <= Number(lastBid.amount) &&
    buyType === buyTypes.LIVE_AUCTION
  const isCloseAuction =
    isOwner &&
    (buyType === buyTypes.CLOSED_AUCTION ||
      buyType === buyTypes.LIVE_AUCTION) &&
    ((lastBid && Number(reservedPrice) > Number(lastBid.amount)) || !lastBid)
  const isOngoingAuction =
    timeCounter > 0 && buyType !== buyTypes.CLOSED_AUCTION

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    const format = async () => {
      const response = await formatURL(asset?.metadata?.image)
      if (mounted.current) setImgURL(response)
    }
    format()
  }, [asset])

  useEffect(() => {
    if (lastBid) {
      const status =
        new Date(lastBid?.time).getTime() >= new Date(endTime).getTime()
      setAuctionClosed(status)
    }
  }, [lastBid])

  useEffect(() => {
    if (accts.includes(highestBidder)) {
      setIsWinner(true)
    }
    if (accts.includes(creator)) {
      setIsOwner(true)
    }
  }, [accts])

  const handleConnect = async () => {
    try {
      const sw = new SessionWallet(
        sessionWallet.network,
        sessionWallet.permissionCallback,
        "my-algo-connect"
      )
      const res = await sw.connect()
      if (res) {
        dispatch(setSessionWallet(sw))
        dispatch(setAccounts(sw.accountList()))
        dispatch(setConnectedStatus(sw.connected()))
      } else {
        setAlertMessage({
          title: "Wallet Connection Failed",
          desc: "Please try it again.",
        })
      }
    } catch (error) {
      setAlertMessage({
        title: "Wallet Connection Error",
        desc: "Please try it again.",
      })
    }
  }

  const goToMintDetail = () => {
    history.push(`/mint-nft/${assetId}`)
  }
  const showMessage = ({ text, color, timeout }) => {
    setSnackbar({ isActive: true, text, color, timeout })
  }
  const handleCopyValue = (value) => {
    navigator.clipboard.writeText(value)
    showMessage({ text: "Copied to clipboard", color: "success" })
  }
  const handleClickAddress = (value) => {
    if (value) {
      history.push(`/creators/${value}`)
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.hero}>
        <div className={classes.info}>
          <h1 className={classes.info__title}>
            <span
              className={classes.info__title_text}
            >{`${asset?.token?.name}`}</span>
            {verifyLoading ||
            typeof isVerified === "undefined" ? null : isVerified ? (
              <span className={classes.blueColor}>
                <Tooltip
                  placement="auto"
                  color="blue"
                  text="This creator has been verified by nftexplorer.app"
                >
                  <VerifiedIcon />
                </Tooltip>
              </span>
            ) : (
              <span className={classes.pinkColor}>
                <Tooltip
                  placement="auto"
                  color="pink"
                  text="This creator has not been verified by nftexplorer.app. Do your own research to verify authenticity before buying."
                >
                  <UnVerifiedIcon />
                </Tooltip>
              </span>
            )}
          </h1>
          <p className={classes.info__text}>{asset.metadata.description}</p>
          <div className={classes.info__divider} />
          <div className={classes.info__details}>
            <div className={classes.info__detail}>
              <span>Current Owner</span>
              {currentOwner && (
                <div className={classes.info__detail_value}>
                  <span onClick={() => handleClickAddress(currentOwner)}>
                    {formatAddress(currentOwner)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyValue(creator)}
                  >
                    <CopyIcon />
                  </button>
                </div>
              )}
            </div>
            <div className={classes.info__detail}>
              <span>Creator</span>
              {creator && (
                <div className={classes.info__detail_value}>
                  <span onClick={() => handleClickAddress(creator)}>
                    {formatAddress(creator)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyValue(creator)}
                  >
                    <CopyIcon />
                  </button>
                </div>
              )}
            </div>
            <div className={classes.info__detail}>
              <span>
                {buyType === buyTypes.BUY_NOW || buyType === buyTypes.SOLD
                  ? "Sale Price"
                  : "Current Price"}
              </span>
              <span>
                <AlgoIcon />
                {buyType === buyTypes.BUY_NOW || buyType === buyTypes.SOLD
                  ? salesPrice
                  : currentPrice}{" "}
                ALGO
                {accts.includes(lastBid?.sender) &&
                  (auctionClosed ? (
                    <Tooltip placement="auto" text="You won the auction.">
                      <div className={classes.info__indicator} />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      placement="auto"
                      text="You are the highest bidder."
                    >
                      <div className={classes.info__indicator} />
                    </Tooltip>
                  ))}
              </span>
            </div>
            {buyType === buyTypes.LIVE_AUCTION ||
            buyType === buyTypes.CLOSED_AUCTION ? (
              <div className={classes.info__detail}>
                {isOngoingAuction && (
                  <>
                    <span>Ending In</span>
                    <span className={classes.timeCounter}>
                      {formatDuration(timeCounter)}
                    </span>
                  </>
                )}
              </div>
            ) : undefined}
          </div>
          {sessionWallet.connected() ? (
            <>
              {buyType === buyTypes.BUY_NOW ? (
                <div className={classes.info__actions}>
                  <Button
                    onClick={isOwner ? onCloseBuyNow : onBuyNow}
                    className={classes.info__btn}
                    disabled={buyLoading}
                  >
                    {isOwner ? "Close Buy Now" : "Buy Now"}
                  </Button>
                  {/* <Button onClick={onMakeOffer} className={classes.info__btn}>
                    Make Offer
                  </Button> */}
                </div>
              ) : (
                <>
                  {isOngoingAuction ? (
                    <Button
                      onClick={() => setIsBidModalOpen(true)}
                      className={classes.info__btn}
                      disabled={bidLoading}
                    >
                      Place a Bid
                    </Button>
                  ) : (
                    <>
                      {isClaimNFT ? (
                        <Button
                          onClick={onClaimAuction}
                          className={classes.info__btn}
                          disabled={closeAuctionLoading}
                        >
                          Claim NFT
                        </Button>
                      ) : isCloseAuction ? (
                        <>
                          <Button
                            onClick={onCloseAuction}
                            className={classes.info__btn}
                            disabled={closeAuctionLoading}
                          >
                            Close Auction
                          </Button>
                        </>
                      ) : null}
                    </>
                  )}
                </>
              )}
            </>
          ) : buyType === buyTypes.BUY_NOW ? (
            <Button className={classes.info__btn} onClick={handleConnect}>
              Connect Wallet To Buy
            </Button>
          ) : (
            timeCounter > 0 && (
              <Button className={classes.info__btn} onClick={handleConnect}>
                Connect Wallet To Bid
              </Button>
            )
          )}
        </div>

        <div className={classes.figures}>
          <ArrowRightIcon
            onClick={() => goToMintDetail()}
            className={classes.arrowIcon}
          />
          <div className={classes["figures__image-container"]}>
            <div
              className={classes.figures__image}
              onClick={() => setIsImagePreviewModalOpen(true)}
            >
              {imgLoading && (
                <>
                  <img src={loadingBubbleAnimation} alt="loading" />
                  <img src={loadingBubbleAnimation} alt="loading" />
                </>
              )}
              {imgURL && imgLoadFailed && (
                <>
                  <video
                    preload="auto"
                    autoPlay
                    muted
                    loop
                    className={imgLoading && classes.hide_img}
                  >
                    <source
                      src={imgURL}
                      type="video/mp4"
                      onLoadStart={() => setImgLoading(false)}
                      onError={() => setImgLoading(false)}
                    />
                  </video>
                  <video
                    preload="auto"
                    autoPlay
                    muted
                    loop
                    className={imgLoading && classes.hide_img}
                  >
                    <source src={imgURL} type="video/mp4" />
                  </video>
                </>
              )}{" "}
              {imgURL && !imgLoadFailed && (
                <>
                  <img
                    src={getOptImageUrl(imgURL, "450x560")}
                    alt={asset?.metadata?.image}
                    onError={() => setLoadFailed(true)}
                    onLoad={() => setImgLoading(false)}
                    className={imgLoading && classes.hide_img}
                  />
                  <img
                    src={getOptImageUrl(imgURL, "450x560")}
                    alt={asset?.metadata?.image}
                    className={imgLoading && classes.hide_img}
                  />
                </>
              )}
            </div>

            <div className={classes.figures__actions}>
              {/* <button
                type="button"
                className={classNames(
                  classes.figures__action,
                  classes.hover_blue_button,
                  share && classes.blue_button
                )}
                onClick={() => setShare(!share)}
              >
                <ShareIcon />
              </button>
              <button
                type="button"
                className={classNames(
                  classes.figures__action,
                  classes.hover_pink_button,
                  love && classes.pink_button
                )}
                onClick={() => setLove(!love)}
              >
                <HeartIcon />
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className={classes["ground-shape"]}>
        <div />
        <HomeHeroGround />
      </div>

      <BidNFTModal
        isOpen={isBidModalOpen}
        nft={imgURL}
        minBid={(currentPrice * 1.1).toFixed(2)}
        onBid={onBidAuction}
        onClose={() => setIsBidModalOpen(false)}
      />

      <AlertModal
        isOpen={!!alertMessage.title}
        data={alertMessage}
        onClose={() => setAlertMessage({})}
      />

      <ImagePreviewModal
        isOpen={isImagePreviewModalOpen}
        onClose={() => setIsImagePreviewModalOpen(false)}
        url={imgURL}
        isVideo={imgLoadFailed}
      />

      <Snackbar
        text={snackbar.text}
        active={snackbar.isActive}
        color={snackbar.color}
        timeout={snackbar.timeout}
        onClose={() => setSnackbar({ ...snackbar, isActive: false })}
      />
    </div>
  )
}
