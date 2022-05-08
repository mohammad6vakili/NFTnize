import { useRef, useLayoutEffect, useEffect } from "react"
import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"

import {
  Layout,
  Table,
  TableLoading,
  BlockTitle,
  Traits,
  TraitsLoading,
} from "components"
import { Info, InfoLoading } from "./page-components"
import classes from "./index.module.scss"
import { useSelector, useDispatch } from "react-redux"
import { useParams } from "react-router-dom"
import {
  asyncGetTransactions,
  IndexerLoadingId,
  asyncLookupAssetByID,
} from "redux/indexer/indexer-slice"
import {
  asyncGetCollectionsAll,
  asyncGetSelectedCollectionTraits,
  CollectionLoadingId,
  setEmptySelectedCollectionTraits,
} from "redux/collection/collection-slice"

const AssetDetails = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const { loading: indexerLoading } = useSelector((state) => state.indexer)
  const { loading: collectionLoading } = useSelector(
    (state) => state.collection
  )

  const selectedAsset = useSelector((state) => state.indexer.selectedAsset)
  const selectedCollection = useSelector(
    (state) => state.indexer.selectedAsset.collection
  )
  // eslint-disable-next-line prefer-const
  const assetTransactionInfo = useSelector(
    (state) => state.indexer.selectedAssetTransactions.transactions
  )
  const priceHistoryTransactions = useSelector(
    (state) => state.indexer.priceHistoryTransactions
  )
  let currentOwner
  if (assetTransactionInfo && assetTransactionInfo.length >= 2) {
    Array.from(assetTransactionInfo).sort(
      (tx1, tx2) => tx2["round-time"] - tx1["round-time"]
    )
    currentOwner =
      assetTransactionInfo[0]["asset-transfer-transaction"].receiver
  } else if (assetTransactionInfo && assetTransactionInfo.length > 0) {
    currentOwner =
      assetTransactionInfo[0]["asset-transfer-transaction"].receiver
  } else {
    currentOwner = selectedAsset?.params?.creator
  }
  const selectedCollectionTraitsData = useSelector(
    (state) => state.collection.selectedCollectionTraits
  )
  const chart = useRef(null)
  useEffect(() => {
    dispatch(asyncGetCollectionsAll())
    dispatch(asyncLookupAssetByID({ assetID: id }))
  }, [])
  useEffect(() => {
    if (selectedCollection?.traits_url) {
      dispatch(
        asyncGetSelectedCollectionTraits({ url: selectedCollection.traits_url })
      )
    } else {
      dispatch(setEmptySelectedCollectionTraits())
    }
  }, [selectedCollection])
  useEffect(() => {
    if (selectedAsset) {
      dispatch(
        asyncGetTransactions({
          index: selectedAsset.index,
          txn_type: "axfer",
          min_amount: 0,
        })
      )
    }
  }, [selectedAsset])

  useLayoutEffect(() => {
    const x = am4core.create("chartdiv", am4charts.XYChart)
    if (priceHistoryTransactions && priceHistoryTransactions.length > 0) {
      priceHistoryTransactions.forEach((tx) => {
        const date = new Date(tx.round)
        x.data.push({
          date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          value: tx.price / 100000,
        })
      })
    }

    // Create axes
    const dateAxis = x.xAxes.push(new am4charts.DateAxis())
    dateAxis.renderer.grid.template.location = 0
    dateAxis.renderer.minGridDistance = 30

    // const valueAxis = x.yAxes.push(new am4charts.ValueAxis())
    x.yAxes.push(new am4charts.ValueAxis())
    // Create series
    function createSeries(field, name) {
      const series = x.series.push(new am4charts.LineSeries())
      series.dataFields.valueY = field
      series.dataFields.dateX = "date"
      series.name = name
      series.tooltipText = "{dateX}: [b]{valueY}[/]"
      series.strokeWidth = 2

      const bullet = series.bullets.push(new am4charts.CircleBullet())
      bullet.circle.stroke = am4core.color("#fff")
      bullet.circle.strokeWidth = 2

      return series
    }

    createSeries("value", "Asset price")

    x.legend = new am4charts.Legend()
    x.cursor = new am4charts.XYCursor()

    chart.current = x

    return () => {
      x.dispose()
    }
  }, [priceHistoryTransactions])
  return (
    <Layout
      breadcrumb={
        selectedCollection && [
          {
            label: "Home",
            to: "/v1/home",
          },
          {
            label: selectedCollection?.name,
            to: `/v1/collection/${selectedCollection?.id}`,
          },
          {
            label: selectedAsset?.name,
          },
        ]
      }
      className={classes.layout}
    >
      {indexerLoading.includes(IndexerLoadingId.ASSETS) ? (
        <InfoLoading />
      ) : (
        selectedAsset &&
        currentOwner && (
          <Info asset={selectedAsset} currentOwner={currentOwner} />
        )
      )}

      {selectedCollectionTraitsData &&
        selectedCollectionTraitsData.length > 0 && (
          <BlockTitle title="Traits">
            {collectionLoading.includes(
              CollectionLoadingId.GET_SELECTED_COLLECTION_TRAITS
            ) ? (
              <TraitsLoading />
            ) : (
              <Traits data={selectedCollectionTraitsData} />
            )}
          </BlockTitle>
        )}

      {priceHistoryTransactions && priceHistoryTransactions.length > 0 && (
        <BlockTitle title="Price History">
          <div id="chartdiv" style={{ width: "100%", height: "500px" }} />
        </BlockTitle>
      )}

      <BlockTitle title="Transaction History">
        {indexerLoading.includes(IndexerLoadingId.TRANSACTIONS) ? (
          <TableLoading />
        ) : (
          <Table
            header={[
              "Transaction ID",
              "Date/Time",
              "Sender",
              "Receiver",
              "Quantity",
              "Sell Price",
            ]}
            items={assetTransactionInfo}
            itemPrices={priceHistoryTransactions}
          />
        )}
      </BlockTitle>
    </Layout>
  )
}

export default AssetDetails
