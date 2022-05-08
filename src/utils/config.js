export const config = {
  apiUrl: process.env.REACT_APP_API_URL,
  scrapperUrl: process.env.REACT_APP_YNFT_SCRAPPER,
  storageToken: process.env.REACT_APP_STORAGE_TOKEN,
  ipfsGateway: process.env.REACT_APP_IPFS_GATEWAY,
  pinataURL: process.env.REACT_APP_PINATA_URL,
  pinataJWT: process.env.REACT_APP_PINATA_JWT,
  blockExplorer: process.env.REACT_APP_BLOCK_EXPLORER,
  explorerApi: process.env.REACT_APP_ALGO_EXPLORER_API,
  baseServer: process.env.REACT_APP_ALGO_BASE_SERVER,
  baseIndexer: process.env.REACT_APP_ALGO_BASE_INDEXER,
  network: process.env.REACT_APP_ALGO_NETWORK,
  algodToken: {
    "X-API-key": process.env.REACT_APP_PURESTAKE_KEY,
  },
  smartContractUrl: process.env.REACT_APP_SMART_CONTRACT_URL,
  imageOptimizer: process.env.REACT_APP_IMAGE_OPTIMIZER,
  marketContractAddressETH: "0x83Ce18893adBee4c79534c86C5736aCa1EFcB027",
  marketContractAddressMATIC: "0xff5C6901d3ae876f48AaaCB218282e8852527Eb3",
  WETHAddress: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
  ETHAddress: "0x0000000000000000000000000000000000000000",
  url_NFTnize: process.env.REACT_APP_NFTNIZE_BASE_URL,
  IPFS: "https://ipfs.io/ipfs/",
}

export const getAddrUrl = (addr) => `${config.blockExplorer}address/${addr}`

export const getAsaUrl = (id) => `${config.blockExplorer}/asset/${id}`

export const contentLoaderColors = {
  background: "#787878",
  foreground: "#333333",
}
