import HttpService from "../httpService"
import { config } from "../config"

const httpservice = new HttpService()
const API_KEY = process.env.REACT_APP_PINATA_API_KEY
const SERCRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY

export const pushImageToIPFS = async (file, setProgress) => {
  try {
    const url = `${process.env.REACT_APP_BASE_URL_PINATA}/pinning/pinFileToIPFS`
    const formData = new FormData()
    formData.append("file", file)
    setProgress({
      status: 40,
      note: "Uploading Image data to IPFS...",
    })
    const res = await httpservice.post(url, formData, {
      headers: {
        "content-type": "multipart/form-data",
        pinata_api_key: API_KEY,
        pinata_secret_api_key: SERCRET_KEY,
      },
    })
    return res.data?.IpfsHash ?? ""
  } catch (err) {
    console.error(err)
    return ""
  }
}

export const pushMetatdataToIPFS = async (JSONbody, setProgress) => {
  const url = `${process.env.REACT_APP_BASE_URL_PINATA}/pinning/pinJSONToIPFS`
  // const imageURL = `${process.env.REACT_APP_PINATA_GET_IPFS}/${hashFile}`
  // JSONbody.image = imageURL
  setProgress({
    status: 45,
    note: "Uploading asset data to IPFS...",
  })
  const response = await httpservice.post(url, JSONbody, {
    headers: {
      pinata_api_key: API_KEY,
      pinata_secret_api_key: SERCRET_KEY,
    },
  })
  const TokenURI = `ipfs://${response.data?.IpfsHash}`
  return TokenURI
}

export const getDataIPFS = async (URI, setStatueURI, structure = false) => {
  setStatueURI({
    description: "Loading ...",
  })
  let res
  let uri
  if (URI !== undefined) {
    if (structure) {
      uri = URI.replace(/^ipfs?:\/\//, "")
      res = await httpservice.get(`${config.IPFS}${uri}`, {})
      setStatueURI(res.data)
      return res.data
    } else {
      uri = `${config.IPFS}${URI}`
      res = await httpservice.get(`${config.IPFS}${uri}`, {})
      setStatueURI(res.data)
      return res.data
    }
  }
}
