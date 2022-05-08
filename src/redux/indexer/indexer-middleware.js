import {
  asyncGetAssets,
  asyncGetTransactions,
  asyncGetPriceTransactions,
  asyncGetRecentTransactions,
  asyncLookupAssetByID,
  asyncIsVerifiedAsset,
} from "./indexer-slice"
import { message } from "antd"

export const indexerMiddleware =
  (middlewareOptions) => (next) => async (action) => {
    const { dispatch } = middlewareOptions
    const result = next(action)

    // ASSETS
    if (asyncGetAssets.rejected.match(action)) {
      message.error(`Failed to load assets!`)
    }
    // Transactions
    if (asyncGetTransactions.fulfilled.match(action)) {
      if (action.payload.data && action.payload.data.transactions.length > 0) {
        const asyncGetSellPriceParams = action.payload.data.transactions.map(
          (tx) => ({
            sender: tx.sender,
            txid: tx.id,
            roundtime: tx["round-time"],
          })
        )
        dispatch(asyncGetPriceTransactions(asyncGetSellPriceParams))
      }
    }

    // Recent Transactions
    if (asyncGetRecentTransactions.fulfilled.match(action)) {
      setTimeout(() => {
        dispatch(asyncGetRecentTransactions({ limit: 10 }))
      }, 10000)
    }
    if (asyncGetRecentTransactions.rejected.match(action)) {
      setTimeout(() => {
        dispatch(asyncGetRecentTransactions({ limit: 10 }))
      }, 10000)
    }
    if (asyncLookupAssetByID.fulfilled.match(action)) {
      dispatch(asyncIsVerifiedAsset(action.payload.data))
    }

    return result
  }
