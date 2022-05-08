import axios from "axios"
import { config } from "../utils/config"

const createAccessHistory = async ({ code }) => {
  const response = {}
  try {
    const res = await axios.post(`${config.apiUrl}/accessHistory`, {
      code,
    })
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

const getAccessCodeHistoryCount = async ({ code }) => {
  const response = {}
  try {
    const res = await axios.get(`${config.apiUrl}/accessHistory/count/${code}`)
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

const getSomeAccessCodeHistory = async ({ code, limit, page }) => {
  const response = {}
  try {
    const res = await axios.get(
      `${config.apiUrl}/accessHistory/some/${code}?limit=${limit}&page=${page}`
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

const getAllAccessCodeHistory = async ({ limit, page }) => {
  const response = {}
  try {
    const res = await axios.get(
      `${config.apiUrl}/accessHistory/all?limit=${limit}&page=${page}`
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

export {
  createAccessHistory,
  getAccessCodeHistoryCount,
  getSomeAccessCodeHistory,
  getAllAccessCodeHistory,
}
