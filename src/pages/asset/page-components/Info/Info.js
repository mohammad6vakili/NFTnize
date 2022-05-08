import { useState, useEffect, useRef } from "react"
import { Button, Snackbar } from "components"
import classes from "./Info.module.scss"
import { ReactComponent as VerifiedIcon } from "assets/icons/verified.svg"
import { ReactComponent as CheckIcon } from "assets/icons/check.svg"
import { ReactComponent as CopyIcon } from "assets/icons/duplicate.svg"
import { formatURL, formatAddress } from "utils/helper"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"

export const Info = ({ asset, currentOwner }) => {
  const history = useHistory()
  const mounted = useRef(false)
  const selectedAsset = useSelector((state) => state.indexer.selectedAsset)
  const snackbarInitValues = {
    isActive: false,
    text: "",
    color: "",
    timeout: 3000,
  }
  const [snackbar, setSnackbar] = useState(snackbarInitValues)
  const [imgURL, setImgURL] = useState("")
  const showMessage = ({ text, color, timeout }) => {
    setSnackbar({ isActive: true, text, color, timeout })
  }

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const handleCopyValue = (value) => {
    navigator.clipboard.writeText(value)
    showMessage({ text: "Copied to clipboard", color: "success" })
  }

  const handleClickAddress = (value) => {
    history.push(`/v1/creators/${value}`)
  }

  useEffect(() => {
    const format = async () => {
      const response = await formatURL(selectedAsset.url)
      if (mounted.current) setImgURL(response)
    }
    format()
  }, [selectedAsset])

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
    {
      title: "Mint Date",
      value: "9/21/2021, 9:09 AM",
    },
    {
      title: "Last Sold Price",
      value: "100 Algo",
    },
  ]

  return (
    <section className={classes.info}>
      <div className={classes.left}>
        <img src={imgURL} alt={asset.url} />
      </div>

      <div className={classes.right}>
        <h1 className={classes.title}>
          {asset.name} <VerifiedIcon />
        </h1>

        <p className={classes.desc}>
          Silvio Micali (born October 13, 1954) is an Italian computer
          scientist, professor at the Massachusetts Institute of Technology. In
          2012, he received the Turing Award for his work in cryptography. In
          2017, Silvio achieved his life's purpose and founded Algorand, and was
          reborn as Master Micali. His purpose was to train the next generation
          of ALGO Saiyans.
        </p>

        <ul className={classes["details-list"]}>
          {details.map((detail, index) => (
            <li className={classes["details-item"]} key={index}>
              {detail.clipboard ? (
                <>
                  <CheckIcon /> {detail.title}:{" "}
                  <span onClick={() => handleClickAddress(detail.address)}>
                    {detail.value}
                  </span>{" "}
                  <button
                    type="button"
                    onClick={() => handleCopyValue(detail.address)}
                  >
                    <CopyIcon />
                  </button>
                </>
              ) : (
                <>
                  <CheckIcon /> {detail.title}: <span>{detail.value}</span>{" "}
                </>
              )}
            </li>
          ))}
        </ul>

        <Button
          type="anchor"
          to={`https://ab2.gallery/asset/${asset.index}`}
          accent="orange"
        >
          Buy Asset
        </Button>
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
