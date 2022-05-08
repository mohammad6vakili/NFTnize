import { createSlice } from "@reduxjs/toolkit"
import { accessCodes } from "utils/accessCode"

const initialState = {
  accessCode: "", // empty if auth required
  authenticated: false, // false if auth required
  authChecking: true, // true if auth required
}

export const accessCode = createSlice({
  name: "accessCode",
  initialState,
  reducers: {
    setAccessCode(state, action) {
      if (accessCodes.includes(action.payload)) {
        window.localStorage.setItem("accessCode", action.payload)
        state.accessCode = action.payload
        state.authenticated = true
      }
      state.authChecking = false
    },
    setAuthCheckingFinished(state, action) {
      state.authChecking = action.payload
    },
  },
})

export const { setAccessCode, setAuthCheckingFinished } = accessCode.actions

export const accessCodeReducer = accessCode.reducer
