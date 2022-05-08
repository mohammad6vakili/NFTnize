import Web3 from "web3"

export const changeNetwork = async (network) => {
  let blockchain = localStorage.getItem("BLOCKCHAIN_STATE")

  if (blockchain) {
    blockchain = JSON.parse(blockchain)
    let blockchainState = {
      BLOCKCHAIN_STATE: blockchain.BLOCKCHAIN_STATE,
      walletConnectionType: blockchain.walletConnectionType,
    }
    if (
      blockchain.walletConnectionType === "MetaMask" ||
      blockchain.walletConnectionType === "MetaMaskPolygon"
    ) {
      if (network === "Eth" && blockchain.BLOCKCHAIN_STATE === "Polygon") {
        await window.ethereum
          .request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x4" }],
          })
          .then((tx) => {
            blockchainState = {
              BLOCKCHAIN_STATE: "Ethereum",
              walletConnectionType: "MetaMask",
            }
          })
          .catch(async (error) => {
            if (error.code === 4902) {
              const chainId = Web3.utils.toHex(4)
              const addChainPolygon = [
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

              await window.ethereum
                .request({
                  method: "wallet_addEthereumChain",
                  params: addChainPolygon,
                })
                .then((tx) => {
                  blockchainState = {
                    BLOCKCHAIN_STATE: "Polygon",
                    walletConnectionType: "MetaMaskPolygon",
                  }
                })
            }
          })
      } else if (
        network === "Plg" &&
        blockchain.BLOCKCHAIN_STATE === "Ethereum"
      ) {
        try {
          const addpolygon = await window.ethereum
            .request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x13881" }],
            })
            .then((tx) => {
              blockchainState = {
                BLOCKCHAIN_STATE: "Polygon",
                walletConnectionType: "MetaMaskPolygon",
              }
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

                await window.ethereum
                  .request({
                    method: "wallet_addEthereumChain",
                    params: addChainPolygon,
                  })
                  .then((tx) => {
                    blockchainState = {
                      BLOCKCHAIN_STATE: "Polygon",
                      walletConnectionType: "MetaMaskPolygon",
                    }
                  })
              }
            })
        } catch (error) {
          console.log(error)
        }
      }
    }
    localStorage.setItem("BLOCKCHAIN_STATE", JSON.stringify(blockchainState))
  }
}
