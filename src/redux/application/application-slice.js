import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AuctionService } from "services/AuctionService"

const initialState = {
  applications: [],
  updatedStatus: false,
  popular: [],
  rootTheme: "dark",
  globalUserInfo: {},
}

export const asyncGetPopularAuctions = createAsyncThunk(
  "application/asyncGetPopularAuctions",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await AuctionService.getAuctions({
      popular: params.count,
    })
    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }
    return response
  }
)

export const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    setApplications(state, action) {
      state.applications = action.payload
    },

    addApplication(state, action) {
      state.applications = [...state.applications, action.payload]
    },

    updateApplication(state, action) {
      const idx = state.applications.findIndex(
        (auction) => auction.appId === action.payload.appId
      )

      state.applications[idx] = action.payload
      state.updatedStatus = true
    },

    deleteApplication(state, action) {
      const idx = state.applications.findIndex(
        (auction) => auction.appId === action.payload
      )
      state.applications.splice(idx, 1)
    },

    toggleTheme(state, action) {
      state.rootTheme = action.payload
    },

    setGlobalUserInfo(state, action) {
      state.globalUserInfo = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncGetPopularAuctions.fulfilled, (state, action) => {
      state.popular = action.payload.data
    })
  },
})

export const {
  setApplications,
  addApplication,
  updateApplication,
  deleteApplication,
  toggleTheme,
  setGlobalUserInfo,
} = applicationSlice.actions

export const applicationReducer = applicationSlice.reducer
