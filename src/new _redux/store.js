import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import rootReducer from "./rootReducer"

import { middleware } from "./middleware"

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
})
const store = configureStore({
  reducer: rootReducer,
  middleware: [...customizedMiddleware, ...middleware],
  devTools: process.env.NODE_ENV !== "production",
})

export default store
