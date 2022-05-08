import React, { useEffect } from "react"
import { CollectionAsset, CollectionAssetLoading } from "components"
import classes from "./Creator.module.scss"
import { useSelector, useDispatch } from "react-redux"
import {
  asyncLookupAccountByID,
  IndexerLoadingId,
} from "redux/indexer/indexer-slice"

export const NewCreator = ({ address }) => {
  const dispatch = useDispatch()
  const { loading: indexerLoading } = useSelector((state) => state.indexer)
  const lookupAccountInfo = useSelector(
    (state) => state.indexer.lookupAccountInfo
  )
  useEffect(() => {
    if (address) {
      dispatch(asyncLookupAccountByID({ address }))
    }
  }, [address])
  return (
    <div>
      {indexerLoading.includes(IndexerLoadingId.LOOKUP_ACCOUNT_BY_ID) ? (
        <div className={classes["assets-grid"]}>
          {[...Array(9).keys()].map((key) => (
            <CollectionAssetLoading key={key} />
          ))}
        </div>
      ) : (
        <div className={classes["assets-grid"]}>
          {lookupAccountInfo &&
            lookupAccountInfo.length &&
            lookupAccountInfo.map((asset, key) => (
              <CollectionAsset {...asset} index={asset.index} key={key} />
            ))}
          {lookupAccountInfo &&
            lookupAccountInfo.length &&
            lookupAccountInfo.length === 0 && <h3>No Assets.</h3>}
        </div>
      )}
    </div>
  )
}
