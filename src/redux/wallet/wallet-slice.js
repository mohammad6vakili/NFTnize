import { createSlice } from "@reduxjs/toolkit"
import { SessionWallet } from "algorand-session-wallet"
import { config } from "utils/config"

const sw = new SessionWallet(config.network)
const localAddr = localStorage.getItem("selectedAccount")
const initialState = {
  sessionWallet: sw,
  connected: sw.connected(),
  accts: sw.accountList(),
  selectedAccount:
    sw.accountList().length > 0 ? localAddr || sw.accountList()[0] : "",
}
export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setSessionWallet(state, action) {
      state.sessionWallet = action.payload
    },
    setAccounts(state, action) {
      state.accts = action.payload
    },
    setConnectedStatus(state, action) {
      state.connected = action.payload
    },
    setSelectedAccount(state, action) {
      localStorage.setItem("selectedAccount", action.payload)
      state.selectedAccount = action.payload
    },
  },
  extraReducers: () => {},
})

export const {
  setSessionWallet,
  setAccounts,
  setConnectedStatus,
  setSelectedAccount,
} = walletSlice.actions

export const walletReducer = walletSlice.reducer
