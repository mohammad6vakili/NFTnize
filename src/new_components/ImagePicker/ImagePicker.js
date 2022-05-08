import { useState, useRef } from "react"
import classNames from "classnames"
import { ReactComponent as CloseIcon } from "new_assets/icons/close.svg"
import { ReactComponent as MountShape } from "new_assets/shapes/mount.svg"
import classes from "./ImagePicker.module.scss"
import { ImagePreviewModal } from "new_components"

const inputRandomId = `image-picker-${Math.random()}`

export const ImagePicker = ({
  name,
  setFile,
  error,
  title,
  unitName,
  quantity,
  disabled,
}) => {
  const fileInputRef = useRef(null)

  const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false)

  const [img, setImg] = useState()

  const [mediaType, setMediaType] = useState("image")

  const handleOnChange = (event) => {
    const file = event.target.files.item(0)
    event.target.value = null

    setFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImg(e.target.result)
      setMediaType(file.type.split("/")[0])
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveFile = () => {
    if (!disabled) {
      setFile()
      setImg()
      setMediaType("image")
    }
  }

  return (
    <div className={classNames(classes.container, error && classes.error)}>
      <div
        className={classNames(
          classes["image-preview-container"],
          img && classes["image-preview-container--visible"]
        )}
      >
        <button
          type="button"
          onClick={handleRemoveFile}
          className={classNames(
            classes["image-preview-container__remove"],
            disabled && classes["image-preview-container__remove--disabled"]
          )}
        >
          <CloseIcon />
        </button>

        <div
          className={classes["image-preview-container__figures"]}
          onClick={() => setIsImagePreviewModalOpen(true)}
        >
          {mediaType === "image" && <img src={img} alt="" />}
          {mediaType === "video" && (
            <video preload="auto" autoPlay loop muted>
              <source src={img} type="video/mp4" />
            </video>
          )}
        </div>

        <div className={classes["image-preview-container__info"]}>
          <span className={classes["image-preview-container__title"]}>
            {title}
          </span>

          <div className={classes["image-preview-container__details"]}>
            <div className={classes["image-preview-container__detail"]}>
              <span>Unit name</span>
              <span>{unitName}</span>
            </div>
            <div className={classes["image-preview-container__detail"]}>
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>
          </div>
        </div>
      </div>

      <label htmlFor={inputRandomId} className={classes.label}>
        <div className={classes.label__shape}>
          <MountShape />
        </div>

        <span className={classes.label__text}>Click here to select file</span>
      </label>

      <input
        type="file"
        id={inputRandomId}
        onChange={handleOnChange}
        name={name}
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="audio/*, video/*, image/*"
      />

      <ImagePreviewModal
        isOpen={isImagePreviewModalOpen}
        onClose={() => setIsImagePreviewModalOpen(false)}
        url={img}
        isVideo={mediaType === "video"}
      />
    </div>
  )
}
