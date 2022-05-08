import { InjectedConnector } from "@web3-react/injected-connector"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { WalletLinkConnector } from "@web3-react/walletlink-connector"

const RPC_URLS = {
  1: "https://mainnet.infura.io/v3/2073292c01e449eea7fd84514662d97c",
}

export const MetaMask = new InjectedConnector({
  supportedChainIds: [1, 4],
})

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 12000,
})

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: "NFTNize",
})
