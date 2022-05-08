import React, { useEffect, useState } from "react"
import {
  Search,
  BlockTitle,
  CollectionAsset,
  CollectionAssetLoading,
} from "components"
import classes from "./Creator.module.scss"
import { IndexerLoadingId } from "redux/indexer/indexer-slice"
import { useSelector } from "react-redux"

export const Creator = () => {
  const { loading: indexerLoading } = useSelector((state) => state.indexer)
  const [searchcedStatus, setSearchedStatus] = useState(false)
  const lookupAccountInfo = useSelector(
    (state) => state.indexer.lookupAccountInfo
  )
  useEffect(() => {
    if (Object.keys(lookupAccountInfo)[0] === "message") {
      setSearchedStatus(false)
    } else {
      setSearchedStatus(true)
    }
  }, [lookupAccountInfo])
  return (
    <BlockTitle title="Creator Page">
      <Search />
      <div>
        {indexerLoading.includes(IndexerLoadingId.LOOKUP_ACCOUNT_BY_ID) ? (
          <div className={classes["assets-grid"]}>
            {[...Array(9).keys()].map((key) => (
              <CollectionAssetLoading key={key} />
            ))}
          </div>
        ) : !searchcedStatus ? (
          <h3>{lookupAccountInfo.message}</h3>
        ) : (
          <div className={classes["assets-grid"]}>
            {lookupAccountInfo &&
              lookupAccountInfo.length > 0 &&
              lookupAccountInfo?.map((asset, key) => (
                <CollectionAsset {...asset} index={asset.index} key={key} />
              ))}
            {lookupAccountInfo && lookupAccountInfo.length === 0 && (
              <h3>No Assets.</h3>
            )}
          </div>
        )}
      </div>
    </BlockTitle>
  )
}
