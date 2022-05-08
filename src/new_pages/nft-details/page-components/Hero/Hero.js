/* eslint-disable no-undef */
import { useEffect, useState, useRef } from "react"
import { Link, useHistory } from "react-router-dom"
import {
  BidNFTModal,
  OwnerBadge,
  ImagePreviewModal,
  Tooltip,
} from "new_components"
import { Snackbar } from "components"
import { ReactComponent as HomeHeroGround } from "new_assets/shapes/ground.svg"
import { ReactComponent as ArrowRightIcon } from "new_assets/icons/arrow-right.svg"
import { ReactComponent as CopyIcon } from "assets/icons/duplicate.svg"
import classes from "./Hero.module.scss"
import { formatCreator, formatAddress, formatURL } from "utils/helper"
import { HeroLoading } from "./Loading"
import { IndexerLoadingId } from "redux/indexer/indexer-slice"
import { useSelector } from "react-redux"
import loadingBubbleAnimation from "new_assets/loadings/bubble.svg"
import { ReactComponent as VerifiedIcon } from "assets/icons/verified.svg"
import { ReactComponent as UnVerifiedIcon } from "assets/icons/unVerified.svg"

export const Hero = ({ asset, currentOwner, isVerified, verifyLoading }) => {
  const mounted = useRef(false)
  const history = useHistory()
  // const { loading: collectionLoading } = useSelector(
  //   (state) => state.collection
  // )
  const { loading: indexerLoading } = useSelector((state) => state.indexer)
  const { name, url } = asset
  const selectedCollectionInfo = asset.collection
  const [isNftModalOpen, setIsNftModalOpen] = useState(false)
  const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false)
  const [imageLoadFailed, setLoadFailed] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)
  const [imgURL, setImgURL] = useState()

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(async () => {
    const format = async () => {
      const response = await formatURL(url)
      if (mounted.current) setImgURL(response)
      setTimeout(() => {
        if (mounted.current && imgLoading) setImgLoading(false)
      }, 5000)
    }
    await format()
  }, [url])

  useEffect(() => {
    if (mounted.current) {
      // eslint-disable-next-line no-undef
      setLoadFailed(false)
      const img = new Image()
      img.src = imgURL
      img.onload = () => {
        if (img.width > img.height && mounted.current)
          setLandscapeClass("landscape-image")
      }
    }
  }, [imgURL])

  const snackbarInitValues = {
    isActive: false,
    text: "",
    color: "",
    timeout: 3000,
  }

  const [snackbar, setSnackbar] = useState(snackbarInitValues)
  // const [share, setShare] = useState(false)
  // const [love, setLove] = useState(false)
  const [landscapeClass, setLandscapeClass] = useState("")

  const showMessage = ({ text, color, timeout }) => {
    setSnackbar({ isActive: true, text, color, timeout })
  }

  const handleCopyValue = (value) => {
    navigator.clipboard.writeText(value)
    showMessage({ text: "Copied to clipboard", color: "success" })
  }

  const handleClickAddress = (value) => {
    history.push(`/creators/${value}`)
  }

  const details = [
    {
      title: "Unit Name",
      value: asset?.unitName,
    },
    {
      title: "Creator",
      address: asset?.creator,
      value: formatAddress(asset.creator),
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
      value: asset?.total,
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
  return (
    <div className={classes.container}>
      {indexerLoading.includes(
        IndexerLoadingId.LOOKUP_ASSET_BY_ID ||
          IndexerLoadingId.LOOKUP_ASSET_BY_ID
      ) ? (
        <HeroLoading />
      ) : (
        <div className={classes.hero}>
          <div className={classes.info}>
            <Link
              to={`/creators/${
                selectedCollectionInfo?.creatorAddress ?? asset?.creator
              }`}
              className={classes.info__link}
            >
              <OwnerBadge
                id={formatCreator(selectedCollectionInfo?.creator)}
                img={url}
                className={classes.info__owner}
              />
            </Link>
            <h1 className={classes.info__title}>
              <span className={classes.info__title_text}>{name}</span>
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
            <div className={classes.info__divider} />
            <div className={classes.info__details}>
              {details.map((detail, idx) => (
                <div key={idx} className={classes.info__detail}>
                  {detail.clipboard ? (
                    <>
                      <span
                        className={classes.info__address}
                        onClick={() => handleClickAddress(detail.address)}
                      >
                        {detail.title}
                      </span>
                      <span className={classes.info__address}>
                        <span
                          className={classes.info__value}
                          onClick={() => handleClickAddress(detail.address)}
                        >
                          {detail.value}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyValue(detail.address)}
                        >
                          <CopyIcon />
                        </button>
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{detail.title}</span>
                      <span>{detail.value}</span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className={classes.figures}>
            <ArrowRightIcon />
            <div className={classes["figures__image-container"]}>
              <div
                className={classes.figures__image}
                onClick={() => setIsImagePreviewModalOpen(true)}
              >
                {imgLoading && (
                  <>
                    <img
                      src={loadingBubbleAnimation}
                      alt="loading"
                      className={classes.img}
                    />
                    <img
                      src={loadingBubbleAnimation}
                      alt="loading"
                      className={classes.img}
                    />
                  </>
                )}
                {!imageLoadFailed ? (
                  <>
                    <img
                      className={
                        imgLoading ? classes.hide_img : classes[landscapeClass]
                      }
                      loading="lazy"
                      src={imgURL}
                      alt={imgURL}
                    />
                    <img
                      className={
                        imgLoading ? classes.hide_img : classes[landscapeClass]
                      }
                      loading="lazy"
                      src={imgURL}
                      alt={imgURL}
                      onLoad={() => setImgLoading(false)}
                      onError={() => setLoadFailed(true)}
                    />
                  </>
                ) : (
                  <>
                    <video
                      className={
                        imgLoading ? classes.hide_img : classes[landscapeClass]
                      }
                      preload="auto"
                      autoPlay
                      loop
                      muted
                    >
                      <source src={imgURL} type="video/mp4" />
                    </video>
                    <video
                      className={
                        imgLoading ? classes.hide_img : classes[landscapeClass]
                      }
                      preload="auto"
                      autoPlay
                      loop
                      muted
                      onLoadStart={() => setImgLoading(false)}
                      onError={() => setImgLoading(false)}
                    >
                      <source src={imgURL} type="video/mp4" />
                    </video>
                  </>
                )}
              </div>
              {/* <div className={classes.figures__actions}>
                <button
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
                </button>
              </div> */}
            </div>
          </div>
        </div>
      )}

      <div className={classes["ground-shape"]}>
        <div />
        <HomeHeroGround />
      </div>

      <BidNFTModal
        isOpen={isNftModalOpen}
        onClose={() => setIsNftModalOpen(false)}
        nft={url}
      />

      <ImagePreviewModal
        isOpen={isImagePreviewModalOpen}
        onClose={() => setIsImagePreviewModalOpen(false)}
        url={imgURL}
        isVideo={imageLoadFailed}
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
