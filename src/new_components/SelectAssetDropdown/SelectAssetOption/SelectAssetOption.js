import { useEffect, useState } from "react"
import classNames from "classnames"
import { formatURL, getOptImageUrl } from "utils/helper"
import loadingBubbleAnimation from "new_assets/loadings/bubble.svg"
import classes from "../SelectAssetDropdown.module.scss"

export const SelectAssetOption = ({
  image = "",
  name = "",
  selected = false,
  onClick,
}) => {
  const [imgURL, setImgURL] = useState()
  const [imgLoadFailed, setLoadFailed] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const format = async () => {
      const response = await formatURL(image)
      if (mounted) setImgURL(response)
    }
    format()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <li
      className={classNames(
        classes.dropdown__item,
        selected && classes["dropdown__item--active"]
      )}
    >
      <button type="button" onClick={() => onClick(imgURL)}>
        {imgLoading && (
          <span className={classes.optionLoadingImgContainer}>
            <img src={loadingBubbleAnimation} alt="loading" />
          </span>
        )}
        {imgLoadFailed ? (
          <video
            preload="auto"
            loop
            autoPlay
            muted
            onLoadStart={() => setImgLoading(false)}
            onError={() => setImgLoading(false)}
            className={classNames(imgLoading && classes.hide_img)}
          >
            <source src={imgURL} type="video/mp4" />
          </video>
        ) : (
          <img
            src={imgURL ? getOptImageUrl(imgURL, "40x40") : imgURL}
            alt={image}
            loading="lazy"
            onError={() => setLoadFailed(true)}
            onLoad={() => setImgLoading(false)}
            className={classNames(imgLoading && classes.hide_img)}
          />
        )}
        {name}
      </button>
    </li>
  )
}
