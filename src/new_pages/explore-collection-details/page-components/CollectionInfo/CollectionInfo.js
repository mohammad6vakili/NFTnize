import { OwnerBadge } from "new_components"
import classes from "./CollectionInfo.module.scss"

import { ReactComponent as CircleShape } from "new_assets/shapes/circle.svg"
import { ReactComponent as GroundShape } from "new_assets/shapes/ground.svg"

export const CollectionInfo = () => (
  <section className={classes.container}>
    <div className={classes.content}>
      <OwnerBadge
        accent="pink"
        img="https://unsplash.it/100/100"
        id="Steward"
        className={classes["owner-badge"]}
      />
      <h1 className={classes.title}>Yieldling Rare #004</h1>
      <p className={classes.info}>
        The world’s first and largest digital marketplace for crypto
        collectibles and non- fungible tokens (NFTs).
      </p>
    </div>

    <CircleShape className={classes["circle-shape"]} />
    <div className={classes["ground-shape"]}>
      <div />
      <GroundShape />
    </div>
  </section>
)
