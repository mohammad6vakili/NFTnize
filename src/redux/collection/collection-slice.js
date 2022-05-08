import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { CollectionService } from "services/CollectionService"

export const CollectionLoadingId = {
  GET_COLLECTIONS: "getCollections",
  CREATE_COLLECTION: "createCollection",
  UPDATE_COLLECTION: "updateCollection",
  DELETE_COLLECTION: "deleteCollection",
  GET_ALL_COLLECTIONS: "getAllCollections",
  GET_SELECTED_COLLECTION_TRAITS: "getSelectedCollectionTraits",
}

const initialState = {
  all_collections: [],
  collections: [],
  selectedCollectoin: {},
  selectedCollectionTraits: [],
  filterTraitValues: [],
  collpaseStates: {},
  loading: [],
}

export const asyncGetSelectedCollectionTraits = createAsyncThunk(
  "collection/asyncGetSelectedCollectionTraits",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await CollectionService.getSelectedCollectionTraits({
      url: params.url,
    })
    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }
    return response
  }
)

export const asyncGetCollections = createAsyncThunk(
  "collection/asyncGetCollections",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await CollectionService.getCollections({
      limit: params.limit,
    })
    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }
    return response
  }
)

export const asyncGetCollectionsAll = createAsyncThunk(
  "collection/asyncGetCollectionsAll",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await CollectionService.getCollectionsAll()
    if (response.error !== null && response.error !== undefined) {
      return rejectWithValue(response.error.errorMessage)
    }
    return response
  }
)

export const asyncCreateCollection = createAsyncThunk(
  "collection/asyncCreateCollection",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await CollectionService.createCollection()

    if (response.error !== null) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)
export const asyncUpdateCollection = createAsyncThunk(
  "collection/asyncUpdateCollection",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await CollectionService.updateCollection()

    if (response.error !== null) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)
export const asyncDeleteCollection = createAsyncThunk(
  "collection/asyncDeleteCollection",
  async (params, thunkOptions) => {
    const { rejectWithValue } = thunkOptions
    const response = await CollectionService.deleteCollection()

    if (response.error !== null) {
      return rejectWithValue(response.error.errorMessage)
    }

    return response
  }
)

export const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    setEmptySelectedCollectionTraits(state) {
      state.selectedCollectionTraits = []
    },
    setFilteredCollections(state, action) {
      state.collections = action.payload
    },
    setFilterTraitValues(state, action) {
      state.filterTraitValues = action.payload
    },
    setCollapseStates(state, action) {
      state.collpaseStates = action.payload
    },
    setCheckedValues(state, action) {
      state.checked = action.payload
    },
  },
  extraReducers: (builder) => {
    // Get SelectedCollection Traits
    builder.addCase(
      asyncGetSelectedCollectionTraits.fulfilled,
      (state, action) => {
        state.selectedCollectionTraits = action.payload.data
        state.loading = state.loading.filter(
          (id) => id !== CollectionLoadingId.GET_SELECTED_COLLECTION_TRAITS
        )
      }
    )
    builder.addCase(asyncGetSelectedCollectionTraits.pending, (state) => {
      state.loading.push(CollectionLoadingId.GET_SELECTED_COLLECTION_TRAITS)
    })
    builder.addCase(asyncGetSelectedCollectionTraits.rejected, (state) => {
      state.selectedCollectionTraits = []
      state.loading = state.loading.filter(
        (id) => id !== CollectionLoadingId.GET_SELECTED_COLLECTION_TRAITS
      )
    })

    // Get Collection
    builder.addCase(asyncGetCollections.fulfilled, (state, action) => {
      state.collections = action.payload.data
      state.loading = state.loading.filter(
        (id) => id !== CollectionLoadingId.GET_COLLECTIONS
      )
    })
    builder.addCase(asyncGetCollections.pending, (state) => {
      state.loading.push(CollectionLoadingId.GET_COLLECTIONS)
    })
    builder.addCase(asyncGetCollections.rejected, (state) => {
      state.collections = []
      state.loading = state.loading.filter(
        (id) => id !== CollectionLoadingId.GET_COLLECTIONS
      )
    })

    // Get All Collections
    builder.addCase(asyncGetCollectionsAll.fulfilled, (state, action) => {
      state.all_collections = action.payload.data
      state.loading = state.loading.filter(
        (id) => id !== CollectionLoadingId.GET_ALL_COLLECTIONS
      )
    })
    builder.addCase(asyncGetCollectionsAll.pending, (state) => {
      state.loading.push(CollectionLoadingId.GET_ALL_COLLECTIONS)
    })
    builder.addCase(asyncGetCollectionsAll.rejected, (state) => {
      state.all_collections = []
      state.loading = state.loading.filter(
        (id) => id !== CollectionLoadingId.GET_ALL_COLLECTIONS
      )
    })

    // Create Collection
    builder.addCase(asyncCreateCollection.fulfilled, (state) => {
      state.loading = state.loading.filter(
        (id) => id !== CollectionLoadingId.CREATE_COLLECTION
      )
    })
    builder.addCase(asyncCreateCollection.pending, (state) => {
      state.loading.push(CollectionLoadingId.CREATE_COLLECTION)
    })
    builder.addCase(asyncCreateCollection.rejected, (state) => {
      state.loading = state.loading.filter(
        (id) => id !== CollectionLoadingId.CREATE_COLLECTION
      )
    })

    // Update Collection
    builder.addCase(asyncUpdateCollection.fulfilled, (state) => {
      state.loading = state.loading.filter(
        (id) => id !== CollectionLoadingId.UPDATE_COLLECTION
      )
    })
    builder.addCase(asyncUpdateCollection.pending, (state) => {
      state.loading.push(CollectionLoadingId.UPDATE_COLLECTION)
    })
    builder.addCase(asyncUpdateCollection.rejected, (state) => {
      state.collections = []
      state.loading = state.loading.filter(
        (id) => id !== CollectionLoadingId.UPDATE_COLLECTION
      )
    })

    // Delete Collection
    builder.addCase(asyncDeleteCollection.fulfilled, (state) => {
      state.loading = state.loading.filter(
        (id) => id !== CollectionLoadingId.DELETE_COLLECTION
      )
    })
    builder.addCase(asyncDeleteCollection.pending, (state) => {
      state.loading.push(CollectionLoadingId.DELETE_COLLECTION)
    })
    builder.addCase(asyncDeleteCollection.rejected, (state) => {
      state.collections = []
      state.loading = state.loading.filter(
        (id) => id !== CollectionLoadingId.DELETE_COLLECTION
      )
    })
  },
})

export const {
  setEmptySelectedCollectionTraits,
  setFilteredCollections,
  setFilterTraitValues,
  setCollapseStates,
  setCheckedValues,
} = collectionSlice.actions
export const collectionReducer = collectionSlice.reducer
