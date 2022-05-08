import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit"
import rootReducer from "./rootReducer"

import { middleware } from "./middleware"
import { initApp } from "./initApp"

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false,
})
const store = configureStore({
  reducer: rootReducer,
  middleware: [...customizedMiddleware, ...middleware],
  devTools: process.env.NODE_ENV !== "production",
})

initApp(store)

export default store
