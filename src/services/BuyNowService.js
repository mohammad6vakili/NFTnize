import axios from "axios"
import { config } from "../utils/config"

const getBuyNows = async ({ creator = "" }) => {
  const response = {}
  try {
    const res = await axios.get(
      `${config.smartContractUrl}/buy-now?creator=${creator}`
    )
    response.data = res.data
    response.status = res.status
  } catch (err) {
    response.error = {
      errorMessage: err.response?.data,
      status: err.response?.status,
    }
  }
  return response
}

const getBuyNow = async (appId) => {
  const response = {}
  try {
    const res = await axios.get(`${config.smartContractUrl}/buy-now/${appId}`)
    response.data = res.data
    response.status = res.status
  } catch (err) {
    response.error = {
      errorMessage: err.response?.data,
      status: err.response?.status,
    }
  }
  return response
}

const createBuyNow = async (
  accountIndex,
  creator,
  token,
  salesPrice,
  royalty
) => {
  const response = {}
  try {
    const res = await axios.post(`${config.smartContractUrl}/buy-now`, {
      accountIndex,
      creator,
      token,
      salesPrice,
      royalty,
    })
    response.data = res.data
    response.status = res.status
  } catch (err) {
    response.error = {
      errorMessage: err.response?.data,
      status: err.response?.status,
    }
  }
  return response
}

const closeBuyNow = async (appId) => {
  const response = {}
  try {
    const res = await axios.delete(
      `${config.smartContractUrl}/buy-now/${appId}`
    )
    response.data = res.data
    response.status = res.status
  } catch (err) {
    response.error = {
      errorMessage: err.response?.data,
      status: err.response?.status,
    }
  }
  return response
}

const buyNFT = async (appId) => {
  const response = {}
  try {
    const res = await axios.put(`${config.smartContractUrl}/buy-now/${appId}`)
    response.data = res.data
    response.status = res.status
  } catch (err) {
    response.error = {
      errorMessage: err.response?.data,
      status: err.response?.status,
    }
  }
  return response
}

export const BuyNowService = {
  getBuyNows,
  getBuyNow,
  createBuyNow,
  closeBuyNow,
  buyNFT,
}
