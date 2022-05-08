/* eslint-disable jsx-a11y/img-redundant-alt */
import { useState, useEffect, useRef } from "react"
import { Button, Snackbar } from "components"
import classes from "./Info.module.scss"
import { ReactComponent as VerifiedIcon } from "assets/icons/verified.svg"
import { ReactComponent as CheckIcon } from "assets/icons/check.svg"
import { ReactComponent as CopyIcon } from "assets/icons/duplicate.svg"
import { formatURL, formatDuration } from "utils/helper"

export const Info = ({
  asset,
  currentPrice,
  assetId,
  timeCounter,
  onBid,
  onClose,
}) => {
  const mounted = useRef(false)
  const snackbarInitValues = {
    isActive: false,
    text: "",
    color: "",
    timeout: 3000,
  }
  const [snackbar, setSnackbar] = useState(snackbarInitValues)
  const [imgURL, setImgURL] = useState("")

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const showMessage = ({ text, color, timeout }) => {
    setSnackbar({ isActive: true, text, color, timeout })
  }

  const handleCopyValue = (value) => {
    navigator.clipboard.writeText(value)
    showMessage({ text: "Copied to clipboard", color: "success" })
  }

  useEffect(() => {
    const format = async () => {
      const response = await formatURL(asset?.metadata?.image)
      if (mounted.current) setImgURL(response)
    }
    format()
  }, [asset])

  const details = [
    {
      title: "Unit Name: ",
      value: asset?.token?.unitName,
    },
    {
      title: "Creator: ",
      //   address: currentOwner,
      value: `${asset?.token?.name} #${assetId}`,
      //   clipboard: true,
    },
    {
      title: "Current Price",
      value: currentPrice,
    },
    {
      title: "Created Date",
      value: "9/21/2021, 9:09 AM",
    },
    {
      title: "Last Bid Price",
      value: "100 Algo",
    },
  ]

  return (
    <section className={classes.info}>
      <div className={classes.left}>
        <img src={imgURL} alt={asset?.metadata?.image} />
      </div>

      <div className={classes.right}>
        <h1 className={classes.title}>
          {asset.metadata.name} <VerifiedIcon />
        </h1>

        <ul className={classes["details-list"]}>
          {details.map((detail, index) => (
            <li className={classes["details-item"]} key={index}>
              <CheckIcon /> {detail.title}: <span>{detail.value}</span>{" "}
              {detail.clipboard && (
                <button
                  type="button"
                  onClick={() => handleCopyValue(detail.address)}
                >
                  <CopyIcon />
                </button>
              )}
            </li>
          ))}
        </ul>
        {timeCounter > 0 ? (
          <>
            <p>Deadline: {formatDuration(timeCounter)}</p>
            <Button size="small" onClick={onBid}>
              Bid
            </Button>
          </>
        ) : (
          <Button size="small" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <Snackbar
        text={snackbar.text}
        active={snackbar.isActive}
        color={snackbar.color}
        timeout={snackbar.timeout}
        onClose={() => setSnackbar({ ...snackbar, isActive: false })}
      />
    </section>
  )
}
