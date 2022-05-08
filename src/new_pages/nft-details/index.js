import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  asyncGetCollectionsAll,
  asyncGetSelectedCollectionTraits,
  setEmptySelectedCollectionTraits,
} from "redux/collection/collection-slice"
import {
  asyncGetTransactions,
  asyncLookupAssetByID,
  asyncScrapeAssetTransactions,
  IndexerLoadingId,
} from "redux/indexer/indexer-slice"
import {
  Layout,
  Traits,
  // PriceHistoryChart,
  // Provenance,
  TransactionHistory,
  // AboutCreator,
} from "new_components"
import { Hero } from "./page-components"
import classes from "./index.module.scss"
import { useParams } from "react-router-dom"
import { isEmptyObject } from "utils/helper"

const NftDetails = () => {
  const dispatch = useDispatch()
  const { index } = useParams()

  const [currentOwner, setCurrentOwner] = useState("")
  const [noAssetStatus, setNoAssetStatus] = useState(false)
  const [historyAPICalled, setHistoryAPICalled] = useState(false)
  // const queryParams = new URLSearchParams(window.location.search)
  // const collectionName = queryParams.get("collectionName")

  const { selectedAsset } = useSelector((state) => state.indexer)
  const { selectedAssetScrapeTransactions } = useSelector(
    (state) => state.indexer
  )

  const isVerified = useSelector(
    (state) => state.indexer.isSelectedAssetVerified
  )
  const indexerLoading = useSelector((state) => state.indexer.loading)
  const selectedCollection = useSelector(
    (state) => state.indexer.selectedAsset.collection
  )
  // eslint-disable-next-line prefer-const
  const assetTransactionInfo = useSelector(
    (state) => state.indexer.selectedAssetTransactions.transactions
  )
  // const priceHistoryTransactions = useSelector(
  //   (state) => state.indexer.priceHistoryTransactions
  // )
  useEffect(() => {
    dispatch(asyncGetCollectionsAll())
    setTimeout(() => setNoAssetStatus(true), 2000)
  }, [])
  useEffect(() => {
    if (assetTransactionInfo && assetTransactionInfo.length >= 2) {
      const sortedTransactionInfo = Array.from(assetTransactionInfo).sort(
        (tx1, tx2) => tx2["round-time"] - tx1["round-time"]
      )
      const ownerAddr =
        sortedTransactionInfo[0]["asset-transfer-transaction"].receiver
      setCurrentOwner(ownerAddr)
    } else if (assetTransactionInfo && assetTransactionInfo.length > 0) {
      const ownerAddr =
        assetTransactionInfo[0]["asset-transfer-transaction"].receiver
      setCurrentOwner(ownerAddr)
    } else {
      const ownerAddr = selectedAsset?.creator
      setCurrentOwner(ownerAddr)
    }
  }, [assetTransactionInfo])

  const selectedCollectionTraitsData = useSelector(
    (state) => state.collection.selectedCollectionTraits
  )
  useEffect(() => {
    dispatch(asyncLookupAssetByID({ assetID: index }))
    if (index) {
      dispatch(
        asyncGetTransactions({
          index,
          txn_type: "axfer",
          min_amount: 0,
        })
      )
      dispatch(asyncScrapeAssetTransactions({ index }))
      setHistoryAPICalled(false)
    }
  }, [index])
  useEffect(() => {
    if (indexerLoading.includes(IndexerLoadingId.SCRAPE_ASSET_TRANSACTIONS))
      setHistoryAPICalled(true)
  }, [indexerLoading])
  useEffect(() => {
    if (selectedCollection?.traits_url) {
      dispatch(
        asyncGetSelectedCollectionTraits({ url: selectedCollection.traits_url })
      )
    } else {
      dispatch(setEmptySelectedCollectionTraits())
    }
  }, [selectedAsset])
  return (
    <Layout>
      {!isEmptyObject(selectedAsset) ? (
        <>
          <Hero
            asset={selectedAsset}
            currentOwner={currentOwner}
            isVerified={isVerified}
            verifyLoading={indexerLoading.includes(
              IndexerLoadingId.CHECKING_VERIFICATION
            )}
          />
          <div className={classes.container}>
            <Traits
              asset={selectedAsset}
              items={selectedCollectionTraitsData}
            />
            {/* <div className={classes.row}>
          <PriceHistoryChart />
          <Provenance />
        </div> */}
            <TransactionHistory
              selectedAssetScrapeTransactions={selectedAssetScrapeTransactions}
              historyLoaded={
                !indexerLoading.includes(
                  IndexerLoadingId.SCRAPE_ASSET_TRANSACTIONS
                ) && historyAPICalled
              }
              // assetTransactions={
              //   assetTransactionInfo
              //     ? Array.from(assetTransactionInfo).sort(
              //         (a, b) => b["round-time"] - a["round-time"]
              //       )
              //     : assetTransactionInfo
              // }
              // assetPrices={priceHistoryTransactions}
            />
            {/* <AboutCreator info={selectedAsset} /> */}
          </div>
        </>
      ) : (
        <div className={classes["no-assets"]}>
          {noAssetStatus && <h1>Asset Not Found</h1>}
        </div>
      )}
    </Layout>
  )
}

export default NftDetails
