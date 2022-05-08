import { useDebouncedCallback } from "use-debounce"
import { TextField, Breadcrumb } from "new_components"
import classes from "./Hero.module.scss"
import { Button } from "@blueprintjs/core"

import { ReactComponent as MagnifyIcon } from "new_assets/icons/magnify.svg"
import { ReactComponent as WaveShape } from "new_assets/shapes/collection-wave.svg"
import { buyTypes } from "../../../../utils/constants"

export const Hero = ({ activeBuyType, search, onSearch, onBuyTypeChange }) => {
  const debounced = useDebouncedCallback((value) => {
    if (onSearch) onSearch(value)
  }, 500)

  return (
    <section className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>Buy NFTs</h1>
        <Breadcrumb
          paths={[
            {
              label: "Home",
              to: "/",
            },
            {
              label: "Buy NFTs",
            },
          ]}
          className={classes.breadcrumb}
        />
        <div className={classes.auction_types}>
          <Button
            onClick={() => onBuyTypeChange(buyTypes.LIVE_AUCTION)}
            minimal
            outlined
            intent="danger"
            text="Live Auctions"
            className={`${classes.auction_type_buynow} ${
              activeBuyType === buyTypes.LIVE_AUCTION ? classes.active_blue : ""
            }`}
            type="button"
          />

          <Button
            onClick={() => onBuyTypeChange(buyTypes.BUY_NOW)}
            minimal
            outlined
            intent="danger"
            text="Buy Now"
            className={`${classes.auction_type_buynow} ${
              activeBuyType === buyTypes.BUY_NOW ? classes.active_blue : ""
            }`}
            type="button"
          />

          {/* <Button
            onClick={() => onBuyTypeChange(buyTypes.CLOSED_AUCTION)}
            minimal
            outlined
            intent="danger"
            text="Closed Auctions"
            className={`${classes.auction_type_live} ${
              activeBuyType === buyTypes.CLOSED_AUCTION
                ? classes.active_pink
                : ""
            }`}
            type="button"
          />

          <Button
            onClick={() => onBuyTypeChange(buyTypes.SOLD)}
            minimal
            outlined
            intent="danger"
            text="Sold Items"
            className={`${classes.auction_type_live} ${
              activeBuyType === buyTypes.SOLD ? classes.active_pink : ""
            }`}
            type="button"
          /> */}
        </div>
        <TextField
          icon={<MagnifyIcon />}
          value={search}
          placeholder="Search Buy Items"
          className={classes["search-input"]}
          onChange={(e) => debounced(e.target.value)}
        />
      </div>

      <div className={classes.wave}>
        <div />
        <WaveShape />
      </div>
    </section>
  )
}
