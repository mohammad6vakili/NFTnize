import axios from "axios"
import { config } from "../utils/config"

const getAuctions = async ({ creator = "", bidder = "", popular = 0 }) => {
  const response = {}
  try {
    const res = await axios.get(
      `${config.smartContractUrl}/auctions?creator=${creator}&bidder=${bidder}&popular=${popular}`
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

const getAuction = async (appId) => {
  const response = {}
  try {
    const res = await axios.get(`${config.smartContractUrl}/auctions/${appId}`)
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

const createAuction = async (
  accountIndex,
  creator,
  token,
  startingBid,
  reservedPrice,
  duration,
  royalty
) => {
  const response = {}
  try {
    const res = await axios.post(`${config.smartContractUrl}/auctions`, {
      accountIndex,
      creator,
      token,
      startingBid,
      reservedPrice,
      duration,
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

const closeAuction = async (appId) => {
  const response = {}
  try {
    const res = await axios.delete(
      `${config.smartContractUrl}/auctions/${appId}`
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

const updateAuction = async (appId) => {
  const response = {}
  try {
    const res = await axios.put(`${config.smartContractUrl}/auctions/${appId}`)
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

const claimAuction = async (appId) => {
  const response = {}
  try {
    const res = await axios.patch(
      `${config.smartContractUrl}/auctions/${appId}`
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

export const AuctionService = {
  getAuctions,
  getAuction,
  createAuction,
  closeAuction,
  updateAuction,
  claimAuction,
}
