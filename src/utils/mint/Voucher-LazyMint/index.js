import { TypedDataUtils } from "ethers-eip712"

const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher"
const SIGNING_DOMAIN_VERSION = "1"

export class LazyMinter {
  constructor({ contractAddress, signer }) {
    this.contractAddress = contractAddress
    this.signer = signer

    this.types = {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      // Part: [
      //   { name: "account", type: "address" },
      //   { name: "value", type: "uint96" },
      // ],
      NFTVoucher: [
        { name: "tokenId", type: "uint256" },
        { name: "minPrice", type: "uint256" },
        { name: "uri", type: "string" },
        // { name: "royalties", type: "Part" },
      ],
    }
  }

  async _signingDomain() {
    if (this._domain != null) {
      return this._domain
    }
    const chainId = await this.signer.eth.getChainId()
    this._domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contractAddress,
      chainId,
    }
    return this._domain
  }

  async _formatVoucher(voucher) {
    const domain = await this._signingDomain()
    return {
      domain,
      types: this.types,
      primaryType: "NFTVoucher",
      message: voucher,
    }
  }

  async createVoucher(tokenId, uri, minPrice = 0) {
    const voucher = { tokenId, uri, minPrice }
    const typedData = await this._formatVoucher(voucher)
    // const digest = TypedDataUtils.encodeDigest(typedData)
    return {
      typedData,
      voucher,
    }
  }
}
