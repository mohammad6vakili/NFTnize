/* eslint-disable max-classes-per-file */
/* eslint-disable camelcase */
/* eslint-disable no-return-await */
import { createToken, getToken } from "./algorand"
import {
  getMimeTypeFromIpfs,
  getMetaFromIpfs,
  getArc69MetaFromIpfs,
} from "./ipfs"
import { sha256 } from "js-sha256"
import { config } from "./config"

/*

The following is a class and metadata type to support the ARC-0003 standard
set forth by the Algorand Foundation and Community

https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0003.md

*/

export const ARC3_NAME_SUFFIX = "@arc3"
export const ARC3_URL_SUFFIX = "#arc3"
export const ARC69_NAME_SUFFIX = "@arc69"
export const ARC69_URL_SUFFIX = "#arc69"
export const METADATA_FILE = "metadata.json"
export const JSON_TYPE = "application/json"

export const asaURL = (cid) => ipfsURL(cid) + ARC3_URL_SUFFIX
export const asaArc69URL = (cid) => ipfsURL(cid) + ARC69_URL_SUFFIX
export const ipfsURL = (cid) => `ipfs://${cid}`
export const fileURL = (cid, name) => `${config.ipfsGateway + cid}/${name}`

export function resolveProtocol(url) {
  if (url.endsWith(ARC3_URL_SUFFIX))
    url = url.slice(0, url.length - ARC3_URL_SUFFIX.length)
  if (url.endsWith(ARC69_URL_SUFFIX))
    url = url.slice(0, url.length - ARC69_URL_SUFFIX.length)
  const chunks = url.split("://")

  // No protocol specified, give up
  if (chunks.length < 2) return url

  // Switch on the protocol
  switch (chunks[0]) {
    case "ipfs": // Its ipfs, use the configured gateway
      return config.ipfsGateway + chunks[1]
    case "https": // Its already http, just return it
      return url
    default:
      return null
    // TODO: Future options may include arweave or algorand
  }
}

export async function imageIntegrity(file) {
  const buff = await file.arrayBuffer()
  const bytes = new Uint8Array(buff)
  const hash = new Uint8Array(sha256.digest(bytes))
  return `sha256-${Buffer.from(hash).toString("base64")}`
}

export class Token {
  constructor(t) {
    this.id = t.index

    const p = t.params

    this.name = p.name
    this.unitName = p["unit-name"]
    this.url = p.url

    this.metadataHash = p["metadata-hash"]

    this.total = p.total
    // this.decimals = p.decimals

    this.creator = p.creator

    this.manager = p.manager
    this.reserve = p.reserve
    this.clawback = p.clawback
    this.freeze = p.freeze

    this.defaultFrozen = p["default-frozen"]
  }
}

export class NFT {
  // token: Token
  // metadata: NFTMetadata

  // urlMimeType: string

  constructor(md, token, urlMimeType) {
    this.metadata = md
    this.token = token
    this.urlMimeType = urlMimeType
  }

  static async create(wallet, md, cid, setProgress, metadataFormat) {
    // eslint-disable-next-line camelcase
    let asset_id
    if (metadataFormat === "arc3") {
      asset_id = await createToken(
        wallet,
        md,
        asaURL(cid),
        // md.decimals,
        md.total,
        setProgress
      )
    } else if (metadataFormat === "arc69") {
      asset_id = await createToken(
        wallet,
        md,
        asaArc69URL(cid),
        // md.decimals,
        md.total,
        setProgress
      )
    }
    setProgress({
      status: 90,
      note: "Getting asset identifier...",
    })
    // setProgress(90)
    return await NFT.fromAssetId(asset_id)
  }

  static async fromAssetId(assetId) {
    // eslint-disable-next-line no-useless-catch
    try {
      return NFT.fromToken(await getToken(assetId))
    } catch (err) {
      throw err
    }
  }

  static async fromToken(t) {
    try {
      const token = new Token(t)
      const url = resolveProtocol(token.url)
      // TODO: provide getters for other storage options
      // arweave? note field?

      const urlMimeType = await getMimeTypeFromIpfs(url)

      // eslint-disable-next-line default-case
      switch (urlMimeType) {
        case JSON_TYPE:
          if (token.url.endsWith(ARC69_URL_SUFFIX)) {
            return new NFT(await getArc69MetaFromIpfs(url), token, urlMimeType)
          } else {
            return new NFT(await getMetaFromIpfs(url), token, urlMimeType)
          }
      }

      if (token.url.endsWith(ARC69_URL_SUFFIX)) {
        return new NFT(ARC69Metadata.fromToken(token), token, urlMimeType)
      } else {
        return new NFT(NFTMetadata.fromToken(token), token, urlMimeType)
      }
    } catch (e) {
      return false
    }
  }

  imgURL() {
    // Try to resolve the protocol, if one is set
    const url = resolveProtocol(this.metadata.image)

    // If the url is different, we resolved it correctly
    if (url !== this.metadata.image) return url

    // It may be a relative url stored within the same directory as the metadata file
    // Lop off the METADATA_FILE bit and append image path
    if (this.token.url.endsWith(METADATA_FILE)) {
      const dir = this.token.url.substring(
        0,
        this.token.url.length - METADATA_FILE.length
      )
      return resolveProtocol(dir) + this.metadata.image
    }

    // give up
    return url
  }
}

// export type Properties = {
//     [key: string]: string | number
// }

export class ARC69Metadata {
  constructor(args) {
    this.standard = ""
    this.description = ""
    this.image = ""
    this.total = 1
    this.unitName = ""
    this.royalty = undefined
    this.image_integrity = ""
    this.image_mimetype = ""
    this.properties = {}
    Object.assign(this, args)
  }

  toHash() {
    // eslint-disable-next-line no-prototype-builtins
    if (this.hasOwnProperty("extra_metadata")) {
      // TODO
      // am = SHA-512/256("arc0003/am" || SHA-512/256("arc0003/amj" || content of JSON metadata file) || e)
    }

    const hash = sha256.create()
    hash.update(JSON.stringify(this))
    return new Uint8Array(hash.digest())
  }

  toFile() {
    const md_blob = new Blob([JSON.stringify({ ...this }, null, 2)], {
      type: JSON_TYPE,
    })
    return new File([md_blob], METADATA_FILE)
  }

  static fromToken(t) {
    return new ARC69Metadata({
      name: t.name,
      image: t.url,
      decimals: t.decimals,
    })
  }
}
export class NFTMetadata {
  // name: string = ""
  // description: string = ""

  // image: string = ""
  // decimals?: number = 0
  // unitName?: string = ""
  // image_integrity?: string = ""
  // image_mimetype?: string = ""

  // properties?: Properties

  constructor(args) {
    this.name = ""
    this.description = ""
    this.image = ""
    this.total = 1
    this.unitName = ""
    this.royalty = undefined
    this.image_integrity = ""
    this.image_mimetype = ""
    this.properties = {}
    Object.assign(this, args)
  }

  toHash() {
    // eslint-disable-next-line no-prototype-builtins
    if (this.hasOwnProperty("extra_metadata")) {
      // TODO
      // am = SHA-512/256("arc0003/am" || SHA-512/256("arc0003/amj" || content of JSON metadata file) || e)
    }

    const hash = sha256.create()
    hash.update(JSON.stringify(this))
    return new Uint8Array(hash.digest())
  }

  toFile() {
    const md_blob = new Blob([JSON.stringify({ ...this }, null, 2)], {
      type: JSON_TYPE,
    })
    return new File([md_blob], METADATA_FILE)
  }

  static fromToken(t) {
    return new NFTMetadata({ name: t.name, image: t.url, decimals: t.decimals })
  }
}
