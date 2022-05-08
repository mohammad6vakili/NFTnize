import { Link } from "react-router-dom"
import { Asset, AssetLoading, NFTAsset } from "new_components"
import classes from "./AssetsGrid.module.scss"
import { ReactComponent as ArrowRightIcon } from "new_assets/icons/arrow-right.svg"
import { useSelector } from "react-redux"
import InfiniteScroll from "react-infinite-scroll-component"
import { useState, useEffect, useRef } from "react"
import { LoadingIndicator } from "../../components"
import { IndexerLoadingId } from "redux/indexer/indexer-slice"
import classNames from "classnames"
import { creatorFilterTypes as filterTypes } from "utils/constants"

export const AssetsGrid = ({
  assets = [],
  header,
  ownerAddress,
  className,
  filterType,
  noItemsText = "No Assets",
}) => {
  const mounted = useRef(false)

  const [displayAssets, setDisplayAssets] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const { loading: indexerLoading } = useSelector((state) => state.indexer)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (assets && assets.length > 20) {
      setDisplayAssets(assets.slice(0, 20))
      setHasMore(true)
    } else {
      if (assets.length > 0) {
        setDisplayAssets(assets.slice(0, 20))
      }
      setHasMore(false)
    }
  }, [assets])

  const fetchMoreAssets = () => {
    if (displayAssets.length >= assets.length) {
      setHasMore(false)
      return
    }

    setTimeout(() => {
      if (mounted.current) {
        setDisplayAssets(assets.slice(0, displayAssets.length + 12))
      }
    }, 2000)
  }

  return (
    <section className={classNames(classes.container, className)}>
      {header && (
        <div className={classes.header}>
          <h2>Popular</h2>
          <Link to="/markets/M.N.G.O">
            <ArrowRightIcon />
          </Link>
        </div>
      )}
      <InfiniteScroll
        dataLength={displayAssets.length}
        next={fetchMoreAssets}
        hasMore={hasMore}
        loader={<LoadingIndicator />}
      >
        <div className={classes.grid}>
          {indexerLoading.includes(IndexerLoadingId.LOOKUP_ACCOUNT_BY_ID) ||
          indexerLoading.includes(IndexerLoadingId.SOME_ASSETS) ||
          indexerLoading.includes(IndexerLoadingId.MY_ASSETS)
            ? [...Array(9).keys()].map((key) => <AssetLoading key={key} />)
            : assets &&
              assets.length > 0 &&
              displayAssets.map((asset, index) =>
                ownerAddress ? (
                  <NFTAsset key={`${asset.index}-${index}`} {...asset} />
                ) : (
                  <Asset key={`${asset.index}-${index}`} {...asset} />
                )
              )}
        </div>
      </InfiniteScroll>
      {assets &&
        assets.length === 0 &&
        !(
          indexerLoading.includes(IndexerLoadingId.LOOKUP_ACCOUNT_BY_ID) ||
          indexerLoading.includes(IndexerLoadingId.SOME_ASSETS) ||
          indexerLoading.includes(IndexerLoadingId.MY_ASSETS)
        ) &&
        (filterType === filterTypes.created ||
          filterType === filterTypes.owned ||
          filterType === filterTypes.optIns) && (
          <div className={classes["no-assets"]}>
            <h1>{noItemsText}</h1>
          </div>
        )}
    </section>
  )
}
