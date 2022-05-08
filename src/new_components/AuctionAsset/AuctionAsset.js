/* eslint-disable react/destructuring-assignment */
import { useState } from "react"
import classes from "./AuctionAsset.module.scss"
import { OwnerBadge, Button, BidNFTModal } from "new_components"
import { ReactComponent as AlgoIcon } from "new_assets/icons/algo.svg"
import classNames from "classnames"

export const AuctionAsset = ({
  owner,
  img,
  name,
  metadata,
  currentBid,
  endingIn,
  total,
  noHover,
}) => {
  const [isNftModalOpen, setIsNftModalOpen] = useState(false)
  const bidStatus = false
  return (
    <div className={classNames(classes.asset, noHover && classes["no-hover"])}>
      {owner && (
        <OwnerBadge className={classes.owner} img={owner.img} id={owner.id} />
      )}
      <div className={classes.figure}>
        {metadata?.image_mimetype === "video/mp4" ? (
          <video preload="auto" autoPlay loop muted className={classes.img}>
            <source src={`${img}#t=0.1`} type="video/mp4" />
          </video>
        ) : (
          <img className={classes.img} src={img} alt={name} />
        )}

        <div className={classes.overlay}>
          <Button onClick={() => setIsNftModalOpen(!isNftModalOpen)}>
            Bid on this NFT
          </Button>
        </div>
      </div>
      <div className={classes.info}>
        <span className={classes.title}>{name}</span>
        {(currentBid || endingIn) && (
          <div className={classes.details}>
            {currentBid && (
              <div className={classes.detail}>
                <span>Current Bid</span>
                <span>
                  <AlgoIcon />
                  {currentBid}&nbsp;ALGO
                </span>
              </div>
            )}
            {endingIn && (
              <div className={classes.detail}>
                <span>Ending In</span>
                <span>{endingIn}</span>
              </div>
            )}
          </div>
        )}
        {!bidStatus && (
          <div className={classes.details}>
            <div className={classes.detail}>
              <span>Last Price</span>
              <span>
                <AlgoIcon />
                {currentBid}&nbsp;ALGO
              </span>
            </div>
            <div className={classes.detail}>
              <span>Total</span>
              <span>{total}</span>
            </div>
          </div>
        )}
      </div>

      <BidNFTModal
        isOpen={isNftModalOpen}
        onClose={() => setIsNftModalOpen(false)}
        nft={img}
      />
    </div>
  )
}
