import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import classes from "./ApplicationInfo.module.scss"
import { LazyLoadImage } from "react-lazy-load-image-component"
import {
  formatDuration,
  formatURL,
  timeDiffAsSec,
} from "../../../../utils/helper"
import { Button } from "../../../../components"

export const ApplicationInfo = ({ appId, currentPrice, nft, endTime }) => {
  const history = useHistory()

  const [timeCounter, setTimeCounter] = useState(0)
  const [imgURL, setImgURL] = useState("")

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
    const diff = timeDiffAsSec(endTime)
    if (diff > 0) setTimeCounter(diff)
  }, [endTime])

  useEffect(() => {
    if (!timeCounter) return

    const intervalId = setInterval(() => {
      setTimeCounter(timeCounter - 1)
    }, 1000)

    if (timeCounter < 0) clearInterval(intervalId)

    return () => clearInterval(intervalId)
  }, [timeCounter])

  const openAuction = () => {
    history.push(`/buy/${appId}`)
  }

  return (
    <div className={classes.application}>
      <div className={classes["image-container"]}>
        <LazyLoadImage src={imgURL} alt={nft.metadata?.image} />
      </div>
      <div className={classes.info}>
        <span className={classes.title}>#{appId}</span>
        <p>Current: {currentPrice} Algo</p>

        {timeCounter > 0 ? (
          <>
            <p>Ending in: {formatDuration(timeCounter)}</p>
            <Button size="small" onClick={openAuction}>
              Make a bid
            </Button>
          </>
        ) : (
          <>
            <p>Ended</p>
            <Button size="small" onClick={openAuction}>
              View details
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
