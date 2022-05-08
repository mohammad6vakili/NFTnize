import { combineReducers } from "@reduxjs/toolkit"
import { indexerReducer } from "./indexer/indexer-slice"
import { collectionReducer } from "./collection/collection-slice"
import { walletReducer } from "./wallet/wallet-slice"
import { applicationReducer } from "./application/application-slice"
import { accessCodeReducer } from "./accessCode/accessCode"

const reducers = {
  indexer: indexerReducer,
  collection: collectionReducer,
  wallet: walletReducer,
  application: applicationReducer,
  accessCode: accessCodeReducer,
}

const rootReducer = combineReducers(reducers)

export default rootReducer
