import { combineReducers } from "@reduxjs/toolkit"
import { indexerReducer } from "./new_indexer/indexer-slice"
import { collectionReducer } from "./new_collection/collection-slice"

const reducers = {
  indexer: indexerReducer,
  collection: collectionReducer,
}

const rootReducer = combineReducers(reducers)

export default rootReducer
