import { useEffect, useState, useRef } from "react"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"

import { Button, ImagePreviewModal } from "new_components"
import { Snackbar } from "components"
import { formatAddress, formatURL, getOptImageUrl } from "utils/helper"
import { ReactComponent as HomeHeroGround } from "new_assets/shapes/ground.svg"
import { ReactComponent as ArrowRightIcon } from "new_assets/icons/arrow-right.svg"
import loadingBubbleAnimation from "new_assets/loadings/bubble.svg"
// import { ReactComponent as ShareIcon } from "new_assets/icons/share.svg"
// import { ReactComponent as HeartIcon } from "new_assets/icons/heart.svg"
import { ReactComponent as CopyIcon } from "assets/icons/duplicate.svg"
import classes from "./Hero.module.scss"
import classNames from "classnames"

export const Hero = ({ nft, currentOwner }) => {
  const history = useHistory()
  const assetRef = useRef()
  const mounted = useRef(false)
  const walletAccounts = useSelector(
    (state) => state.wallet?.sessionWallet?.wallet?.accounts
  )

  const { name, unitName, total, creator } = nft.token
  const { description } = nft.metadata
  const snackbarInitValues = {
    isActive: false,
    text: "",
    color: "",
    timeout: 3000,
  }
  const [snackbar, setSnackbar] = useState(snackbarInitValues)
  const [imgLoadFailed, setLoadFailed] = useState(false)
  const [imgURL, setImgURL] = useState("")
  const [isAssetPortrait, setIsAssetPortrait] = useState(false)
  const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)
  // const [share, setShare] = useState(false)
  // const [love, setLove] = useState(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(async () => {
    setImgLoading(true)
    setLoadFailed(false)
    const response = await formatURL(nft.imgURL())
    if (mounted.current) setImgURL(response)
  }, [nft])

  const showMessage = ({ text, color, timeout }) => {
    setSnackbar({ isActive: true, text, color, timeout })
  }

  const handleCopyValue = (value) => {
    navigator.clipboard.writeText(value)
    showMessage({ text: "Copied to clipboard", color: "success" })
  }
  const details = [
    {
      title: "Unit Name",
      value: unitName,
    },
    {
      title: "Creator",
      address: creator,
      value: formatAddress(creator),
      clipboard: true,
    },
    {
      title: "Current Owner",
      address: currentOwner,
      value: formatAddress(currentOwner),
      clipboard: true,
    },
    {
      title: "Total",
      value: total,
    },
    // {
    //   title: "Mint Date",
    //   value: "N/A",
    // },
    // {
    //   title: "Last Sold Price",
    //   value: "100 Algo",
    // },
  ]

  const checkIsAssetPortrait = () => {
    const loadedAsset = assetRef.current
    if (loadedAsset) {
      if (loadedAsset?.naturalHeight < loadedAsset?.naturalWidth) {
        setIsAssetPortrait(true)
      }
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.hero}>
        <div className={classes.info}>
          {/* <Link to={`creators/${selectedCollectionInfo?.creatorAddress}`}>
            <OwnerBadge
              id={formatCreator(selectedCollectionInfo?.creator)}
              img={url}
              className={classes.info__owner}
            />
          </Link> */}
          <h1 className={classes.info__title}>{name}</h1>
          <p className={classes.info__text}>{description}</p>
          <div className={classes.info__divider} />
          <div className={classes.info__details}>
            {details.map((detail, idx) => {
              const isLink = detail.clipboard || detail.external
              return (
                <div key={idx} className={classes.info__detail}>
                  <span>{detail.title}</span>
                  <span className={isLink ? classes.info__link : ""}>
                    {detail.value}
                    {detail.clipboard && (
                      <button
                        type="button"
                        onClick={() => handleCopyValue(detail.address)}
                      >
                        <CopyIcon />
                      </button>
                    )}
                  </span>
                </div>
              )
            })}
          </div>

          {walletAccounts && walletAccounts.includes(creator) ? (
            <Button
              onClick={() => history.push(`/sell/${nft.token.id}`)}
              className={classes.info__btn}
            >
              Sell Now
            </Button>
          ) : null}
        </div>

        <div className={classes.figures}>
          <ArrowRightIcon />
          <div className={classes["figures__image-container"]}>
            {imgLoading && (
              <div className={classes.figures__image}>
                <img src={loadingBubbleAnimation} alt="loading" />
                <img src={loadingBubbleAnimation} alt="loading" />
              </div>
            )}
            {!imgLoadFailed ? (
              <div
                className={classNames(
                  classes.figures__image,
                  isAssetPortrait && classes["figures__image--portrait"],
                  imgLoading && classes.hide
                )}
                onClick={() => setIsImagePreviewModalOpen(true)}
              >
                <img
                  src={getOptImageUrl(imgURL, "450x560")}
                  alt=""
                  onLoad={() => {
                    setImgLoading(false)
                    checkIsAssetPortrait()
                  }}
                  ref={assetRef}
                />
                <img
                  src={getOptImageUrl(imgURL, "450x560")}
                  alt=""
                  onError={() => setLoadFailed(true)}
                />
              </div>
            ) : (
              <div
                className={classNames(
                  classes.figures__image,
                  imgLoading && classes.hide
                )}
                onClick={() => setIsImagePreviewModalOpen(true)}
              >
                <video
                  preload="auto"
                  loop
                  autoPlay
                  muted
                  ref={assetRef}
                  onLoadStart={() => setImgLoading(false)}
                  onError={() => setImgLoading(false)}
                >
                  <source src={imgURL} type="video/mp4" />
                </video>
                <video preload="auto" loop autoPlay muted>
                  <source src={imgURL} type="video/mp4" />
                </video>
              </div>
            )}
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
      <Snackbar
        text={snackbar.text}
        active={snackbar.isActive}
        color={snackbar.color}
        timeout={snackbar.timeout}
        onClose={() => setSnackbar({ ...snackbar, isActive: false })}
      />
      <ImagePreviewModal
        isOpen={isImagePreviewModalOpen}
        onClose={() => setIsImagePreviewModalOpen(false)}
        url={imgURL}
        isVideo={imgLoadFailed}
      />
    </div>
  )
}
