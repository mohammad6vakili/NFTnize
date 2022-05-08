import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { IndexerService } from "services/IndexerService"

export const IndexerLoadingId = {
  ASSETS: "assets",
  SOME_ASSETS: "someAssets",
  FEATURED_CREATORS: "featuredCreators",
  TRANSACTIONS: "transactions",
  LOOKUP_ASSET_BALLANCES: "lookupAssetBallances",
  LOOKUP_ASSET_BY_ID: "lookupAssetByID",
  SCRAPE_ASSET_TRANSACTIONS: "scrapeAssetTransactions",
  GET_STATS_FROM_COLLECTION: "getStatsFromCollection",
  LOOKUP_MY_ACCOUNT: "lookupMyAccount",
  LOOKUP_ACCOUNT_BY_ID: "lookupAccountByID",
  PRICE_HISTORY_TRANSACTIONS: "priceHistoryTransactions",
  RECENT_TRANSACTIONS: "recentTransactions",
  MY_ASSETS: "myAssets",
  CHECKING_VERIFICATION: "checkingVerification",
}

const initialState = {
  assets: [],
  homeAssets: [],
  featuredCreators: [],
  selectedAsset: {},
  isSelectedAssetVerified: undefined,
  transactions: [],
  selectedAssetTransactions: [],
  selectedAssetScrapeTransactions: [],
  selectedCollectionStats: {},
  selectedAddressTransactions: [],
  selectedAssetBalances: [],
  priceHistoryTransactions: [],
  recent_transactions: [],
  lookupAccountInfo: [],
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

export const asyncFeaturedCreators = createAsyncThunk(
  "indexer/asyncFeaturedCreators",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await IndexerService.getFeaturedCreators(params)
    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)

export const asyncSomeAssets = createAsyncThunk(
  "indexer/asyncSomeAssets",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await IndexerService.getSomeAssets(params)
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

export const asyncScrapeAssetTransactions = createAsyncThunk(
  "indexer/asyncScrapeAssetTransactions",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await IndexerService.scrapeAssetTransactions(params)

    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)

export const asyncGetStatsFromCollection = createAsyncThunk(
  "indexer/asyncGetStatsFromCollection",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await IndexerService.getStatsFromCollection(params)

    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)

export const asyncLookupMyAccount = createAsyncThunk(
  "indexer/asyncLookupMyAccount",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await IndexerService.lookupMyAccount(params.address)

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
    const response = await IndexerService.lookupAccountByID(
      params.address,
      params.collectionName
    )

    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)

export const asyncIsVerifiedAsset = createAsyncThunk(
  "indexer/asyncCheckVerifiedAsset",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await IndexerService.isVerifiedAsset(params.index)

    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)

export const indexerSlice = createSlice({
  name: "indexer",
  initialState,
  reducers: {
    fetchingMyAssets(state, action) {
      if (action.payload) {
        state.loading.push(IndexerLoadingId.MY_ASSETS)
      } else {
        state.loading = state.loading.filter(
          (id) => id !== IndexerLoadingId.MY_ASSETS
        )
      }
    },
    resetLookupAccountInfo(state) {
      state.lookupAccountInfo = []
    },
    resetSelectedCollectionStats(state) {
      state.selectedCollectionStats = {}
    },
  },
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

    // Get Featured Creators
    builder.addCase(asyncFeaturedCreators.fulfilled, (state, action) => {
      state.featuredCreators = action.payload.data
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.SOME_ASSETS
      )
    })
    builder.addCase(asyncFeaturedCreators.pending, (state) => {
      state.loading.push(IndexerLoadingId.SOME_ASSETS)
    })
    builder.addCase(asyncFeaturedCreators.rejected, (state) => {
      state.featuredCreators = []
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.SOME_ASSETS
      )
    })

    // Get Some Assets For Homepage
    builder.addCase(asyncSomeAssets.fulfilled, (state, action) => {
      state.homeAssets = action.payload.data
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.FEATURED_CREATORS
      )
    })
    builder.addCase(asyncSomeAssets.pending, (state) => {
      state.loading.push(IndexerLoadingId.FEATURED_CREATORS)
    })
    builder.addCase(asyncSomeAssets.rejected, (state) => {
      state.homeAssets = []
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.FEATURED_CREATORS
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
      // state.assets = []
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.LOOKUP_ASSET_BALLANCES
      )
    })

    // Scrape Asset Transactions
    builder.addCase(asyncScrapeAssetTransactions.fulfilled, (state, action) => {
      state.selectedAssetScrapeTransactions = action.payload.data
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.SCRAPE_ASSET_TRANSACTIONS
      )
    })
    builder.addCase(asyncScrapeAssetTransactions.pending, (state) => {
      state.loading.push(IndexerLoadingId.SCRAPE_ASSET_TRANSACTIONS)
    })
    builder.addCase(asyncScrapeAssetTransactions.rejected, (state) => {
      state.selectedAssetScrapeTransactions = []
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.SCRAPE_ASSET_TRANSACTIONS
      )
    })

    // Get Stats From Collection
    builder.addCase(asyncGetStatsFromCollection.fulfilled, (state, action) => {
      state.selectedCollectionStats = action.payload.data
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.GET_STATS_FROM_COLLECTION
      )
    })
    builder.addCase(asyncGetStatsFromCollection.pending, (state) => {
      state.loading.push(IndexerLoadingId.GET_STATS_FROM_COLLECTION)
    })
    builder.addCase(asyncGetStatsFromCollection.rejected, (state) => {
      state.selectedCollectionStats = {}
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.GET_STATS_FROM_COLLECTION
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
      state.isSelectedAssetVerified = undefined
      state.loading.push(
        IndexerLoadingId.LOOKUP_ASSET_BY_ID,
        IndexerLoadingId.CHECKING_VERIFICATION
      )
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

    // Check Asset verification
    builder.addCase(asyncIsVerifiedAsset.fulfilled, (state, action) => {
      state.isSelectedAssetVerified = action.payload.data
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.CHECKING_VERIFICATION
      )
    })
    builder.addCase(asyncIsVerifiedAsset.pending, (state) => {
      state.loading.push(IndexerLoadingId.CHECKING_VERIFICATION)
    })
    builder.addCase(asyncIsVerifiedAsset.rejected, (state) => {
      state.isSelectedAssetVerified = undefined
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.CHECKING_VERIFICATION
      )
    })

    // Lookup My Account
    builder.addCase(asyncLookupMyAccount.fulfilled, (state, action) => {
      if (
        action.payload.data["created-assets"] &&
        action.payload.data["created-assets"].length > 0
      ) {
        state.lookupAccountInfo = action.payload.data["created-assets"].map(
          (asa) => ({
            index: asa.index,
            creator: asa.params.creator,
            name: asa.params.name,
            total: asa.params.total,
            unitName: asa.params["unit-name"],
            url: asa.params.url,
          })
        )
      }
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.LOOKUP_MY_ACCOUNT
      )
    })
    builder.addCase(asyncLookupMyAccount.pending, (state) => {
      state.loading.push(IndexerLoadingId.LOOKUP_MY_ACCOUNT)
    })
    builder.addCase(asyncLookupMyAccount.rejected, (state) => {
      state.lookupAccountInfo = []
      state.loading = state.loading.filter(
        (id) => id !== IndexerLoadingId.LOOKUP_MY_ACCOUNT
      )
    })
  },
})

export const {
  fetchingMyAssets,
  resetLookupAccountInfo,
  resetSelectedCollectionStats,
} = indexerSlice.actions
export const indexerReducer = indexerSlice.reducer
