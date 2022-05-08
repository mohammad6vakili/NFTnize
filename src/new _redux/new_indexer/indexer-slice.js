import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IndexerService } from "new_services/IndexerService"

export const IndexerLoadingId = {
  ASSETS: "assets",
  TRANSACTIONS: "transactions",
  LOOKUP_ASSET_BALLANCES: "lookupAssetBallances",
  LOOKUP_ASSET_BY_ID: "lookupAssetByID",
  LOOKUP_ACCOUNT_BY_ID: "lookupAccountByID",
  PRICE_HISTORY_TRANSACTIONS: "priceHistoryTransactions",
  RECENT_TRANSACTIONS: "recentTransactions",
}

const initialState = {
  assets: [],
  selectedAsset: {},
  transactions: [],
  selectedAssetTransactions: [],
  selectedAddressTransactions: [],
  selectedAssetBalances: [],
  priceHistoryTransactions: [],
  recent_transactions: [],
  lookupAccountInfo: {},
  loading: [],
}

export const asyncGetPriceTransactions = createAsyncThunk(
  "indexer/asyncGetPriceHistoryTransactions",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await IndexerService.getPriceHistoryTransactions(params)
    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)

export const asyncGetAssets = createAsyncThunk(
  "indexer/asyncGetAssets",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await IndexerService.getAssets(params)
    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)

export const asyncGetTransactions = createAsyncThunk(
  "indexer/asyncGetTransactions",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await IndexerService.getTransactions(params)

    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)

export const asyncGetRecentTransactions = createAsyncThunk(
  "indexer/asyncGetRecentTransactions",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await IndexerService.getRecentTransactions(params)

    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)

export const asyncLookupAssetBalances = createAsyncThunk(
  "indexer/asyncLookupAssetBalance",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await IndexerService.lookupAssetBalances(params)

    if (response.error !== null) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)

export const asyncLookupAssetByID = createAsyncThunk(
  "indexer/asyncLookupAssetByID",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await IndexerService.lookupAssetByID(params)

    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)

export const asyncLookupAccountByID = createAsyncThunk(
  "indexer/asyncLookupAccountByID",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await IndexerService.lookupAccountByID(params.address)

    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)

export const indexerSlice = createSlice({
  name: "indexer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get Assets
    builder.addCase(asyncGetAssets.fulfilled, (state, action) => {
      state.assets = action.payload.data
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.ASSETS
      )
    })
    builder.addCase(asyncGetAssets.pending, (state) => {
      state.loading.push(IndexerLoadingId.ASSETS)
    })
    builder.addCase(asyncGetAssets.rejected, (state) => {
      state.assets = []
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.ASSETS
      )
    })

    // Get Transactions
    builder.addCase(asyncGetTransactions.fulfilled, (state, action) => {
      state.selectedAssetTransactions = action.payload.data
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.TRANSACTIONS
      )
    })
    builder.addCase(asyncGetTransactions.pending, (state) => {
      state.loading.push(IndexerLoadingId.TRANSACTIONS)
    })
    builder.addCase(asyncGetTransactions.rejected, (state) => {
      state.selectedAssetTransactions = []
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.TRANSACTIONS
      )
    })

    // Get Recent Transactions
    builder.addCase(asyncGetRecentTransactions.fulfilled, (state, action) => {
      state.recent_transactions = action.payload.data
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.RECENT_TRANSACTIONS
      )
    })
    builder.addCase(asyncGetRecentTransactions.pending, (state) => {
      state.loading.push(IndexerLoadingId.RECENT_TRANSACTIONS)
    })
    builder.addCase(asyncGetRecentTransactions.rejected, (state) => {
      state.recent_transactions = []
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.RECENT_TRANSACTIONS
      )
    })

    // Lookup Asset Balances
    builder.addCase(asyncLookupAssetBalances.fulfilled, (state) => {
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.LOOKUP_ASSET_BALLANCES
      )
    })
    builder.addCase(asyncLookupAssetBalances.pending, (state) => {
      state.loading.push(IndexerLoadingId.LOOKUP_ASSET_BALLANCES)
    })
    builder.addCase(asyncLookupAssetBalances.rejected, (state) => {
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.LOOKUP_ASSET_BALLANCES
      )
    })

    // Lookup Asset By ID
    builder.addCase(asyncLookupAssetByID.fulfilled, (state, action) => {
      state.selectedAsset = action.payload.data
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.LOOKUP_ASSET_BY_ID
      )
    })
    builder.addCase(asyncLookupAssetByID.pending, (state) => {
      state.loading.push(IndexerLoadingId.LOOKUP_ASSET_BY_ID)
    })
    builder.addCase(asyncLookupAssetByID.rejected, (state) => {
      state.selectedAsset = {}
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.LOOKUP_ASSET_BY_ID
      )
    })

    // Price History Transactions
    builder.addCase(asyncGetPriceTransactions.fulfilled, (state, action) => {
      state.priceHistoryTransactions = action.payload.data
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.PRICE_HISTORY_TRANSACTIONS
      )
    })
    builder.addCase(asyncGetPriceTransactions.pending, (state) => {
      state.loading.push(IndexerLoadingId.PRICE_HISTORY_TRANSACTIONS)
    })
    builder.addCase(asyncGetPriceTransactions.rejected, (state) => {
      state.priceHistoryTransactions = []
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.PRICE_HISTORY_TRANSACTIONS
      )
    })

    // Lookup Account Info
    builder.addCase(asyncLookupAccountByID.fulfilled, (state, action) => {
      state.lookupAccountInfo = action.payload.data
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.LOOKUP_ACCOUNT_BY_ID
      )
    })
    builder.addCase(asyncLookupAccountByID.pending, (state) => {
      state.loading.push(IndexerLoadingId.LOOKUP_ACCOUNT_BY_ID)
    })
    builder.addCase(asyncLookupAccountByID.rejected, (state) => {
      state.lookupAccountInfo = []
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.LOOKUP_ACCOUNT_BY_ID
      )
    })
  },
})

export const indexerReducer = indexerSlice.reducer
