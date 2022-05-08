import axios from "axios"
import { config } from "../utils/config"

const getAssets = async (params) => {
  const { collectionName, collectionIndex, limit } = params
  const response = {}
  try {
    const res = await axios.get(
      `${config.apiUrl}/indexer/algoAssets?assetName=${collectionName}&limit=${limit}&assetIndex=${collectionIndex}`
    )
    response.data = res.data
    response.status = res.status
  } catch (err) {
    response.error = {
      errorMessage: err.response.data,
      status: err.response.status,
    }
  }
  return response
}

const getPriceHistoryTransactions = async (params) => {
  const response = {}

  try {
    const res = await axios.post(
      `${config.apiUrl}/indexer/price-history`,
      params
    )
    response.data = res.data
    response.status = res.status
  } catch (err) {
    response.error = {
      errorMessage: err.response.data,
      status: err.response.status,
    }
  }
  return response
}
const getTransactions = async (params) => {
  const response = {}
  try {
    const res = await axios.get(
      `${config.apiUrl}/indexer/transactions/${params.index}?txn_type=${params.txn_type}&min_amount=${params.min_amount}`
    )
    response.data = res.data
    response.status = res.status
  } catch (err) {
    response.error = {
      errorMessage: err.response.data,
      status: err.response.status,
    }
  }
  return response
}

const getRecentTransactions = async (params) => {
  const response = {}
  try {
    const res = await axios.get(
      `${config.apiUrl}/indexer/recent-transactions?limit=${params.limit}`
    )
    response.data = res.data
    response.status = res.status
  } catch (err) {
    response.error = {
      errorMessage: err.response.data,
      status: err.response.status,
    }
  }
  return response
}

const lookupAssetBalances = async (params) => {
  const response = {}
  try {
    const res = await axios.get(
      `${config.apiUrl}/indexer/lookupAssetsBalances/${params.assetID}`
    )
    response.data = res.data
    response.status = res.status
  } catch (err) {
    response.error = {
      errorMessage: err.response.data,
      status: err.response.status,
    }
  }
  return response
}

const lookupAssetByID = async (params) => {
  const response = {}
  try {
    const res = await axios.get(
      `${config.apiUrl}/indexer/lookupAssets/${params.assetID}`
    )
    response.data = res.data
    response.status = res.status
  } catch (err) {
    response.error = {
      errorMessage: err.response.data,
      status: err.response.status,
    }
  }
  return response
}

const lookupAccountByID = async (address) => {
  const response = {}
  try {
    const res = await axios.get(`${config.apiUrl}/indexer/account/${address}`)
    response.data = res.data
    response.status = res.status
  } catch (err) {
    response.error = {
      errorMessage: err.response.data,
      status: err.response.status,
    }
  }
  return response
}
export const IndexerService = {
  getAssets,
  getTransactions,
  lookupAssetBalances,
  lookupAssetByID,
  lookupAccountByID,
  getPriceHistoryTransactions,
  getRecentTransactions,
}
