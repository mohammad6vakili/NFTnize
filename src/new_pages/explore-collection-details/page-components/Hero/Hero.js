import { useSelector } from "react-redux"
import { Breadcrumb } from "new_components"
import classes from "./Hero.module.scss"
import { ReactComponent as WaveShape } from "new_assets/shapes/collection-wave.svg"
import { ReactComponent as AlgoIcon } from "new_assets/icons/algo.svg"
import { IndexerLoadingId } from "redux/indexer/indexer-slice"
import { SMLoadingIndicator } from "components"
import { isEmptyObject } from "utils/helper"

export const Hero = ({ collection }) => {
  const { loading: indexerLoading } = useSelector((state) => state.indexer)
  const { selectedCollectionStats } = useSelector((state) => state.indexer)

  return (
    <section className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>{collection?.name}</h1>
        <Breadcrumb
          paths={[
            {
              label: "Home",
              to: "/",
            },
            {
              label: "Collections",
              to: "/markets",
            },
            {
              label: collection?.name,
            },
          ]}
          className={classes.breadcrumb}
          showVerifiedIcon
        />
        {indexerLoading.includes(IndexerLoadingId.GET_STATS_FROM_COLLECTION) ? (
          <div className={classes.loadingIndicator}>
            <SMLoadingIndicator />
          </div>
        ) : isEmptyObject(selectedCollectionStats) ? (
          <></>
        ) : (
          <div className={classes.details}>
            <span>
              <span>Floor price:</span>
              <AlgoIcon />
              {selectedCollectionStats.floor}
            </span>
            |
            <span>
              <span>Total volume:</span>
              <AlgoIcon />
              {selectedCollectionStats.total}
            </span>
          </div>
        )}
      </div>

      <div className={classes.wave}>
        <div />
        <WaveShape />
      </div>
    </section>
  )
}
