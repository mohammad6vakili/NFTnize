import { createContext, useEffect, useReducer } from "react"
import Web3 from "web3"
import { useWeb3React } from "@web3-react/core"
import { config } from "utils/config"
import HttpService from "utils/httpService"
import {
  MetaMask,
  walletconnect,
  walletlink,
} from "../utils/walletConnector/ETHConnector"
import {
  MetaMaskPolygon,
  fortmatic,
  torus,
  portis,
} from "../utils/walletConnector/PolygonConnector"

const httpservice = new HttpService()

const initialState = {
  connected: false,
  account: null,
  isIntialized: false,
}

const storeUserToserver = async (account) => {
  const url = `${config.url_NFTnize}/user/`
  const res = await httpservice.post(url, {
    account,
  })
  return res.data.item
}

const handler = {
  INITIALIZE: (state, action) => {
    const { connected, account } = action.payload
    return {
      ...state,
      connected,
      isInitialized: true,
      account,
    }
  },
  ACTIVATE: (state, action) => {
    const { account } = action.payload
    return {
      ...state,
      connected: true,
      account,
    }
  },
  DEACTIVE: (state) => ({
    ...state,
    connected: false,
    account: null,
  }),
}

const reducer = (state, action) =>
  handler[action.type] ? handler[action.type](state, action) : state

const walletContext = createContext({
  ...initialState,
  connect: () => Promise.resolve(),
  deactive: () => Promise.resolve(),
})

const allProviders = [
  {
    key: "MetaMask",
    provider: MetaMask,
    type: "Ethereum",
  },
  {
    key: "WalletConnect",
    provider: walletconnect,
    type: "Ethereum",
  },
  {
    key: "WalletLink",
    provider: walletlink,
    type: "Ethereum",
  },
  {
    key: "MetaMaskPolygon",
    provider: MetaMaskPolygon,
    type: "Polygon",
  },
  {
    key: "Torus",
    provider: torus,
    type: "Polygon",
  },
  {
    key: "portis",
    provider: portis,
    type: "Polygon",
  },
  {
    key: "FortMatic",
    provider: fortmatic,
    type: "Polygon",
  },
]

function WalletProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { active, account, activate, deactivate, connector } = useWeb3React()

  useEffect(() => {
    const intialize = () => {
      try {
        const currentwallet = JSON.parse(
          localStorage.getItem("BLOCKCHAIN_STATE")
        )
        const getProvider = allProviders.find(
          (item) => item.key === currentwallet.walletConnectionType
        )
        activate(getProvider.provider, undefined, true)
          .then(() => {
            dispatch({
              type: "INITIALIZE",
              payload: {
                connected: true,
                account,
              },
            })
            const currentProvider = allProviders.find(
              (item) => item.provider === getProvider.provider
            )
            const blockchainState = {
              BLOCKCHAIN_STATE: currentProvider.type,
              walletConnectionType: currentProvider.key,
            }
          })
          .catch(() => {
            dispatch({
              type: "INITIALIZE",
              payload: {
                connected: false,
                account: null,
              },
            })
          })
      } catch (error) {
        dispatch({
          type: "INITIALIZE",
          payload: {
            connected: false,
            account: null,
          },
        })
      }
    }
    intialize()
    if (typeof window.ethereum !== "undefined") {
      const { ethereum } = window
      ethereum.on("chainChanged", () => {
        window.location.reload()
      })
    }
  }, [activate, connector, account, active])

  const connect = async (provider) => {
    try {
      await activate(provider)
      const currentProvider = allProviders.find(
        (item) => item.provider === provider
      )

      try {
        if (provider === MetaMaskPolygon) {
          const addpolygon = await window.ethereum
            .request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x13881" }],
            })
            .then((tx) => {
              console.log("tx", tx)
            })
            .catch(async (error) => {
              if (error.code === 4902) {
                const chainId = Web3.utils.toHex(80001)
                const addChainPolygon = [
                  {
                    chainId,
                    chainName: "Matic(Polygon) Mumbai",
                    nativeCurrency: {
                      name: "MATIC",
                      symbol: "MATIC",
                      decimals: 18,
                    },
                    rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
                    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
                  },
                ]

                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: addChainPolygon,
                })
              }
            })
        } else if (provider === MetaMask) {
          await window.ethereum
            .request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x4" }],
            })
            .catch(async (error) => {
              if (error.code === 4902) {
                const chainId = Web3.utils.toHex(4)
                const addChainEthereum = [
                  {
                    chainId,
                    chainName: "Rinkeby",
                    nativeCurrency: {
                      name: "Ethereum",
                      symbol: "ETH",
                      decimals: 18,
                    },
                    rpcUrls: [
                      "https://rinkeby.infura.io/v3/beb64dbe597141fcbcd23f61f10cfac0",
                    ],
                    blockExplorerUrls: [""],
                  },
                ]

                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: addChainEthereum,
                })
              }
            })
        }
      } catch (error) {
        console.log(error)
      }

      const blockchainState = {
        BLOCKCHAIN_STATE: currentProvider.type,
        walletConnectionType: currentProvider.key,
      }
      localStorage.setItem("BLOCKCHAIN_STATE", JSON.stringify(blockchainState))
      if (window.ethereum.selectedAddress !== null) {
        await storeUserToserver(window.ethereum.selectedAddress)
      }
      if (active) {
        dispatch({
          type: "ACTIVE",
          payload: {
            account,
          },
        })
      }
    } catch (ex) {
      return false
    }
  }

  const deactive = async () => {
    try {
      deactivate()
      dispatch({
        type: "DEACTIVE",
      })
      localStorage.removeItem("BLOCKCHAIN_STATE")
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <walletContext.Provider
      value={{
        ...state,
        connect,
        deactive,
      }}
    >
      {children}
    </walletContext.Provider>
  )
}

export {
  walletContext as WalletConnectionContext,
  WalletProvider as WalletConnectionProvider,
}
