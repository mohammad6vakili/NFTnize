import { BaseModal } from "new_components"
import classes from "./ImagePreview.module.scss"

export const ImagePreviewModal = ({ isOpen, onClose, url, isVideo }) => (
  <BaseModal
    isOpen={isOpen}
    onClose={onClose}
    hideCloseIcon
    className={classes.modal}
    closeOnEsc
    closeOnClickOverlay
  >
    <div className={classes.container}>
      {isVideo ? (
        <video preload="auto" autoPlay loop muted>
          <source src={url} type="video/mp4" />
        </video>
      ) : (
        <img src={url} alt="" />
      )}
    </div>
  </BaseModal>
)
