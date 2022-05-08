import { CollectionAsset, BlockTitle, CollectionAssetLoading } from "components"
import { useSelector } from "react-redux"
import { IndexerLoadingId } from "redux/indexer/indexer-slice"
import classes from "./SearchResult.module.scss"

export const SearchResult = ({ className, assets }) => {
  const { loading: indexerLoading } = useSelector((state) => state.indexer)
  return (
    <BlockTitle className={className} title="Search Results">
      <div className={classes["assets-grid"]}>
        {indexerLoading.includes(IndexerLoadingId.ASSETS) ? (
          [...Array(6).keys()].map((key) => (
            <CollectionAssetLoading key={key} />
          ))
        ) : assets.length !== 0 ? (
          assets.map((asset, key) => (
            <CollectionAsset {...asset.params} index={asset.index} key={key} />
          ))
        ) : (
          <p className={classes["no-result"]}>No Results</p>
        )}
      </div>
    </BlockTitle>
  )
}
