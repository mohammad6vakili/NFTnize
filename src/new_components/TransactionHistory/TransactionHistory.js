/* eslint-disable no-restricted-globals */
// import moment from "moment"

import { Link, Table } from "new_components"
import { config } from "utils/config"
import { formatAddress } from "utils/helper"
import classes from "./TransactionHistory.module.scss"
import { Icon } from "@blueprintjs/core"
import { IndexerLoadingId } from "redux/indexer/indexer-slice"
import { useSelector } from "react-redux"
import { LoadingIndicator } from "components"

export const TransactionHistory = ({
  selectedAssetScrapeTransactions,
  historyLoaded,
  // assetTransactions,
  // assetPrices,
}) => {
  const { loading: indexerLoading } = useSelector((state) => state.indexer)

  const header = [
    "Transaction ID",
    "Date/Time",
    "Sender",
    "Receiver",
    "Quantity",
    "Sell Price",
  ]

  const items = selectedAssetScrapeTransactions
    ? selectedAssetScrapeTransactions.map((e) => [
        <Link
          to={`${config.blockExplorer}/tx/${e?.txId}`}
          type="anchor-link"
          className={classes["history-link"]}
        >
          <span className={classes["history-link__span"]}>
            {formatAddress(e?.txId)}{" "}
            <Icon
              icon="share"
              size={12}
              className={classes["history-link__icon"]}
            />
          </span>
        </Link>,
        // moment.unix(e["round-time"]).format("M/DD/YYYY, HH:mm A"),
        e?.date,
        <Link
          to={`${config.blockExplorer}/address/${e?.sender}`}
          type="anchor-link"
          className={classes["history-link"]}
        >
          <span className={classes["history-link__span"]}>
            {formatAddress(e.sender)}
            <Icon
              icon="share"
              size={12}
              className={classes["history-link__icon"]}
            />
          </span>
        </Link>,
        <Link
          to={`${config.blockExplorer}/address/${e?.receiver}`}
          type="anchor-link"
          className={classes["history-link"]}
        >
          <span className={classes["history-link__span"]}>
            {/* {formatAddress(e["asset-transfer-transaction"].receiver)} */}
            {formatAddress(e?.receiver)}
            <Icon
              icon="share"
              size={12}
              className={classes["history-link__icon"]}
            />
          </span>
        </Link>,
        // e["asset-transfer-transaction"]?.amount ?? 0,
        e?.quantity,
        !isNaN(e?.sellPrice?.replace(/,/, "")) ? `${e?.sellPrice} A` : "-",
        // assetPrices && formatPrice(assetPrices, e, true, "A"),
      ])
    : []

  return (
    <section className={classes.container}>
      <h2 className={classes.title}>Transaction History</h2>
      {historyLoaded ? (
        items.length > 0 ? (
          <Table
            header={header}
            rows={items}
            loading={indexerLoading.includes(
              IndexerLoadingId.SCRAPE_ASSET_TRANSACTIONS
            )}
          />
        ) : (
          <div className={classes["no-tx"]}>No transaction history</div>
        )
      ) : (
        <LoadingIndicator />
      )}
    </section>
  )
}
