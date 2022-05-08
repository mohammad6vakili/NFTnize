import { useState } from "react"
import { BaseModal, TextField, Button } from "new_components"
import classes from "./BidNFT.module.scss"

export const BidNFTModal = ({ isOpen, nft, minBid = 0, onBid, onClose }) => {
  const [bidPrice, setBidPrice] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const [imgLoadFailed, setLoadFailed] = useState(false)

  const handleBidChange = (e) => {
    setBidPrice(e.target.value)
    setErrorMsg(null)
  }

  const handleSubmitBid = () => {
    if (bidPrice && +bidPrice < minBid) {
      setErrorMsg(
        "Your price must be greater than or equal to the minimum price."
      )
    } else if (!bidPrice) {
      onBid(minBid)
      onClose()
    } else {
      onBid(+bidPrice)
      onClose()
    }
  }

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className={classes.container}>
        <h2 className={classes.title}>Bid on this NFT</h2>
        {!imgLoadFailed ? (
          <img
            src={nft}
            alt={nft}
            loading="lazy"
            className={classes.nft}
            onError={() => setLoadFailed(true)}
          />
        ) : (
          <video preload="auto" autoPlay loop muted className={classes.nft}>
            <source src={nft} type="video/mp4" />
          </video>
        )}
        <TextField
          type="number"
          label={`Minimum bid ${minBid} ALGO`}
          labelAccent="pink"
          error={errorMsg}
          placeholder={minBid}
          onChange={handleBidChange}
          focus
        />
        <Button className={classes.cta} onClick={handleSubmitBid}>
          Place Bid
        </Button>
        <span className={classes.info}>
          Bid will be held in escrow until there is a higher bid or the auction
          ends.
        </span>
      </div>
    </BaseModal>
  )
}
