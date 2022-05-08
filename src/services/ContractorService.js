import axios from "axios"
import { config } from "../utils/config"

const createContractor = async () => {
  const response = {}
  try {
    const res = await axios.post(`${config.smartContractUrl}/contractor`)
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

const tokenAccept = async (accountIndex, token) => {
  const response = {}
  try {
    const res = await axios.post(
      `${config.smartContractUrl}/contractor/tokenAccept`,
      {
        accountIndex,
        token,
      }
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

export const ContractorService = {
  createContractor,
  tokenAccept,
}
