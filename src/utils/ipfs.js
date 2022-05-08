/* eslint-disable no-undef */
import axios from "axios"
import { ipfsURL, NFTMetadata, ARC69Metadata } from "./nft"
import { config } from "./config"

/*
 Currently an issue with resolving ipfs-car module in web3.storage when using react-scripts
 We just use the prebuilt one but with no types we have to just ignore the issue for now
//import { Web3Storage } from 'web3.storage'
*/
// @ts-ignore
// eslint-disable-next-line import/extensions
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js"
// import { Web3Storage } from 'web3.storage'
const storage = new Web3Storage({ token: config.storageToken })

const pinataJsonURL = "https://api.pinata.cloud/pinning/pinJSONToIPFS"

export const putToIPFS = async (file, md, setProgress) => {
  try {
    const imgAdded = await storage.put([file], { wrapWithDirectory: false })
    setProgress({
      status: 40,
      note: "Uploading asset data to IPFS...",
    })
    // setProgressStatus(40)
    md.image = ipfsURL(imgAdded)

    return await storage.put([md.toFile()], { wrapWithDirectory: false })
  } catch (err) {
    console.error(err)
  }
  return ""
}

export const putToPinata = async (file, md, setProgress) => {
  try {
    const formData = new FormData()
    formData.append("file", file)
    const res = await axios.post(config.pinataURL, formData, {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${config.pinataJWT}`,
      },
    })
    const hash = res.data?.IpfsHash ?? ""
    setProgress({
      status: 40,
      note: "Uploading asset data to IPFS...",
    })
    md.image = `${config.ipfsGateway}${hash}`
    const assRes = await axios.post(pinataJsonURL, md, {
      headers: {
        Authorization: `Bearer ${config.pinataJWT}`,
      },
    })
    return assRes.data?.IpfsHash ?? ""
  } catch (err) {
    console.error(err)
    return ""
  }
}

export const getMimeTypeFromIpfs = async (url) => {
  const req = new Request(url, { method: "HEAD" })
  const resp = await fetch(req)
  return resp.headers.get("Content-Type")
}

export const getMetaFromIpfs = async (url) => {
  const req = new Request(url)
  const resp = await fetch(req)
  const body = await resp.blob()
  return new NFTMetadata(JSON.parse(await body.text()))
}
export const getArc69MetaFromIpfs = async (url) => {
  const req = new Request(url)
  const resp = await fetch(req)
  const body = await resp.blob()
  return new ARC69Metadata(JSON.parse(await body.text()))
}
