import axios from "axios"
import { config } from "../utils/config"

const getSelectedCollectionTraits = async ({ url }) => {
  const response = {}
  try {
    const res = await axios.get(url)
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
const getCollections = async ({ limit }) => {
  const response = {}
  try {
    const res = await axios.get(`${config.apiUrl}/collection?limit=${limit}`)
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

const getCollectionsAll = async () => {
  const response = {}
  try {
    const res = await axios.get(`${config.apiUrl}/collection/all`)
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

const createCollection = async (params) => {
  const response = {}
  try {
    const res = await axios.post(`${config.apiUrl}/collection`, params)
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

const updateCollection = async (params, id) => {
  const response = {}
  try {
    const res = await axios.put(`${config.apiUrl}/collection/${id}`, params)
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

const deleteCollection = async (id) => {
  const response = {}
  try {
    const res = await axios.delete(`${config.apiUrl}/collection/${id}`)
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

export const CollectionService = {
  getCollections,
  getCollectionsAll,
  createCollection,
  updateCollection,
  deleteCollection,
  getSelectedCollectionTraits,
}
