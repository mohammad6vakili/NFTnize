import { useEffect } from "react"
import classes from "./Base.module.scss"
import Modal from "react-modal"
import { ReactComponent as CloseIcon } from "new_assets/icons/close.svg"
import classNames from "classnames"

Modal.setAppElement("#root")

export const BaseModal = ({
  isOpen,
  onClose,
  hideCloseIcon,
  children,
  className,
  closeOnEsc,
  closeOnClickOverlay,
}) => {
  useEffect(() => {
    if (closeOnEsc) {
      document.addEventListener("keyup", handleCloseModalOnEsc)

      return () => {
        document.removeEventListener("keyup", handleCloseModalOnEsc)
      }
    }
  }, [])

  const handleCloseModalOnEsc = (e) => {
    if (e.code === "Escape") {
      onClose()
    }
  }

  const handleCloseModal = (e) => {
    if (
      e.target.className.includes("ReactModal__Overlay") &&
      closeOnClickOverlay
    ) {
      onClose()
    }
  }

  return (
    <Modal
      closeTimeoutMS={300}
      isOpen={isOpen}
      className={classNames(classes.modal, className)}
      overlayClassName={classes.overlay}
      onRequestClose={handleCloseModal}
    >
      {!hideCloseIcon && (
        <div className={classes.header}>
          <button type="button" onClick={onClose} className={classes.close}>
            <CloseIcon />
          </button>
        </div>
      )}

      <div
        className={classNames(
          classes.content,
          hideCloseIcon && classes["content--full"]
        )}
      >
        {children}
      </div>
    </Modal>
  )
}
