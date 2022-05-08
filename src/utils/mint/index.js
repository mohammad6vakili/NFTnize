import { bytecodeERC1155 } from "./abis/bytecodeERC1155"
import { bytecodeERC721 } from "./abis/bytecodeERC721"
import { bytecodePaymentSplitter } from "utils/mint/abis/byteCodePaymentSplitter"
import ERC721ABI from "./abis/TokenERC721.json"
import PaymentSplitterABI from "utils/mint/abis/PaymentSplitter.json"
import ERC1155ABI from "./abis/TokenERC1155.json"
import ContractMarketABI from "./abis/NFTMarketPlace_ABI.json"
import HttpService from "utils/httpService"
import { LazyMinter } from "utils/mint/Voucher-LazyMint"
import { config } from "utils/config"
import { getNonce } from "utils/getNonceTosign"

const httpservice = new HttpService()

export const signMessage = async (account, library) => {
  const message = await getNonce(account)
  const sign = new Promise((resolve, reject) => {
    library.currentProvider.sendAsync(
      {
        method: "personal_sign",
        params: [message, account],
        from: account,
      },
      (err, result) => {
        if (!err) {
          if (result) {
            const { result: signature } = result
            const address = library.eth.accounts.recover(message, signature)
            const auth = {
              sign: signature,
              account: address,
              site: config.url_NFTnize,
            }
            localStorage.setItem("auth", JSON.stringify(auth))
            resolve({
              sign: signature,
              message,
              account: address,
            })
          }
        } else {
          reject(err)
        }
      }
    )
  })
  return sign
}

export const signMessageEIP712 = async (account, library, data) => {
  const sign = new Promise((resolve, reject) => {
    library.currentProvider.sendAsync(
      {
        method: "eth_signTypedData_v4",
        params: [account, data],
        from: account,
      },
      (err, result) => {
        if (result) {
          const { result: signature } = result
          resolve({
            sign: signature,
            data,
          })
        } else if (err) {
          reject(err)
        }
      }
    )
  })
  return sign
}

export const mintNFT = async (
  md,
  address,
  collectionID,
  TokenURI,
  cidImage,
  libaray,
  account,
  id,
  auth,
  royalityWallets,
  royaltyInfo,
  setProgress
) => {
  let contract
  let mint
  let IsLazyMint
  let tokenSale
  let amount
  let contractAddressMarket
  let priceTowei
  let marketItemId = 0
  if (md.network === "Eth") {
    contractAddressMarket = config.marketContractAddressETH
  } else if (md.network === "Plg") {
    contractAddressMarket = config.marketContractAddressMATIC
  }
  const tokenWETH = "0xc778417E063141139Fce010982780140Aa0cD5Ab"
  const tokenETH = "0x0000000000000000000000000000000000000000"

  if (md.token === "ERC721") {
    contract = new libaray.eth.Contract(ERC721ABI, address)
  } else if (md.token === "ERC1155") {
    contract = new libaray.eth.Contract(ERC1155ABI, address)
  }

  const { methods } = contract
  if (md.putOnMarketPlace) {
    priceTowei = libaray.utils.toWei(md.price, "ether")
  }

  if (md.token === "ERC721") {
    amount = 0

    // if (md.network === "Eth") {
    // setProgress({
    //   status: 80,
    //   note: `you should sign data ${md.token} before buy by buyer ...`,
    // })

    // const lazymint = new LazyMinter({
    //   contractAddress: "0x855D6558F3E72e0293028C0469A630B4fc800045",
    //   signer: libaray,
    // })
    // IsLazyMint = true
    // marketItemId = 0
    // const royalty = {
    //   account: "0x0ad616fa97C41358368380aC870a4aDFaA3eCba4",
    //   value: 1000,
    // }
    // const data = await lazymint.createVoucher(
    //   id,
    //   TokenURI,
    //   priceTowei,
    //   royalty
    // )
    // const convertToJson = JSON.stringify(data.typedData)
    // mint = await signMessageEIP712(account, libaray, convertToJson)
    // } else if (md.network === "Plg") {
    setProgress({
      status: 80,
      note: `mint token ${md.token} on ${
        md.network === "Plg" ? "Polygon" : "Ethereum"
      } ...`,
    })
    mint = await methods
      .mint(id, TokenURI)
      .send({ from: account })
      .then((result) => result)

    IsLazyMint = false
    // }
  } else if (md.token === "ERC1155") {
    amount = md.Quantity
    setProgress({
      status: 80,
      note: `mint token ${md.token}...`,
    })
    IsLazyMint = false
    mint = await methods
      .mint(account, id, md.Quantity, TokenURI, "0x00")
      .send({ from: account })
      .then((result) => result)
  }

  if (md.start !== 0) {
    tokenSale = tokenWETH
  } else {
    tokenSale = tokenETH
  }

  // if (
  //   (md.token === "ERC1155" && md.network === "Eth") ||
  //   (md.token === "ERC1155" && md.network === "Plg") ||
  //   (md.token === "ERC721" && md.network === "Plg")
  // ) {
  if (md.putOnMarketPlace) {
    setTimeout(() => {
      setProgress({
        status: 78,
        note: `Approve your NFT to market...`,
      })
    }, 5800)
    marketItemId = await addToMarketDecenterlize(
      setProgress,
      address,
      id,
      priceTowei,
      tokenSale,
      amount,
      md.start,
      md.end,
      contractAddressMarket,
      libaray,
      account
    )
  }

  // }

  setProgress({
    status: 89,
    note: `Set royalties to your NFT...`,
  })

  await methods
    .setRoyalities(id, royaltyInfo.royaltyReciever, royaltyInfo.total)
    .send({ from: account })
    .then((result) => result)

  setProgress({
    status: 90,
    note: `Caching Data...`,
  })
  const nft = {
    displayName: md.name,
    unitName: md.unitName,
    description: md.description,
    timeAuction: md.start !== 0,
    tokenId: id,
    royality: md.totalRoyality,
    collection_id: collectionID,
    marketItemId,
    amount,
    put_on_marketplace: md.putOnMarketPlace,
    price: md.putOnMarketPlace ? md.price : "0",
    owner: account.toLowerCase(),
    creator: account.toLowerCase(),
    tokenSale: md.start !== 0 ? tokenWETH : tokenETH,
    tokenType: md.token,
    blockchain: md.network,
    start: md.start,
    end: md.end,
    category_id: md.category,
    status: md.putOnMarketPlace ? "Created" : "Inactive",
    tokenURI: TokenURI,
    fileURL: cidImage,
    fileType: md.file.type.split("/")[0],
    isLazymint: IsLazyMint,
  }
  const storeToServer = await StoreToServerNFT(
    nft,
    md.traits,
    royalityWallets,
    royaltyInfo,
    account,
    auth
  )

  return mint
}

// export const addToMarket = async (library, account, contractAddress, data) => {
//   if (data.token === "ERC1155" && data.network === "Eth") {
//   } else if (data.token === "ERC721" && data.network === "Eth") {
//   } else if (data.token === "ERC1155" && data.network === "Plg") {
//   } else if (data.token === "ERC721" && data.network === "Plg") {
//   }
// }

export const deployNFT = async (
  network,
  libaray,
  account,
  type,
  name = null,
  symbol = null,
  tokenURI
) => {
  let contract
  let bytecode
  let contractAddressMarket
  if (network === "Eth") {
    contractAddressMarket = config.marketContractAddressETH
  } else if (network === "Plg") {
    contractAddressMarket = config.marketContractAddressMATIC
  }
  if (type === "ERC721") {
    contract = new libaray.eth.Contract(ERC721ABI)
    bytecode = bytecodeERC721
  } else if (type === "ERC1155") {
    contract = new libaray.eth.Contract(ERC1155ABI)
    bytecode = bytecodeERC1155
  }

  const gasLimit = await libaray.eth.getBlock("latest").gasLimit
  const gasPrice = await libaray.eth.getBlock("latest").gasUsed

  let address

  if (type === "ERC721") {
    address = contract
      .deploy({
        data: bytecode,
        arguments: [name, symbol, contractAddressMarket, tokenURI],
      })
      .send(
        {
          from: account,
          gas: gasLimit,
          gasPrice,
        },
        (error, transactionHash) => {}
      )
      .on("error", (error) => {})
      .on("transactionHash", (transactionHash) => {})
      .on("receipt", (receipt) => {
        console.log(receipt.contractAddress) // contains the new contract address
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log("receipt", receipt)
      })
      .then((newContractInstance) => newContractInstance.options.address)
  } else if (type === "ERC1155") {
    address = contract
      .deploy({
        data: bytecode,
        arguments: [tokenURI, contractAddressMarket],
      })
      .send(
        {
          from: account,
          gas: gasLimit,
          gasPrice,
        },
        (error, transactionHash) => {}
      )
      .on("error", (error) => {})
      .on("transactionHash", (transactionHash) => {})
      .on("receipt", (receipt) => {
        console.log(receipt.contractAddress) // contains the new contract address
      })
      .on("confirmation", (confirmationNumber, receipt) => {
        console.log("receipt", receipt)
      })
      .then((newContractInstance) => newContractInstance.options.address)
  }

  return address
}

export const StoreToServerNFT = async (
  values,
  traits,
  royalityWallets,
  royaltyInfo,
  account,
  auth
) => {
  const URL = `${config.url_NFTnize}/nft/` // just for test and later this url change from env
  const sendData = {
    metadata: values,
    traits,
    royalityWallets,
    royaltyInfo,
  }
  const postdata = await httpservice.post(URL, sendData, {
    headers: {
      message: auth.message,
      sign: auth.sign,
      account,
    },
  })
  return postdata.data
}

export const StoreToServerCollection = async (values, account, auth) => {
  const URL = `${config.url_NFTnize}/collection/` // just for test and later this url change from env

  const data = {
    name: values.name,
    symbol: values.symbol,
    image_url: values.image_url,
    blockchain: values.blockchain,
    owner: values.owner.toLowerCase(),
    description: values.description,
    collection_type: values.collection_type,
    collectionURI: values.collectionURI,
    contractAddress: values.contractAddress,
  }

  const postdata = await httpservice.post(URL, data, {
    headers: {
      sign: auth.sign,
      account,
    },
  })
  return postdata.data
}

export const deployMoneyPip = async (
  account,
  library,
  royalties,
  setProgress
) => {
  const bytecode = bytecodePaymentSplitter
  const contractPaymentSplitter = new library.eth.Contract(PaymentSplitterABI)

  const gasLimit = await library.eth.getBlock("latest").gasLimit
  const gasPrice = await library.eth.getBlock("latest").gasUsed

  setProgress({
    status: 50,
    note: "deploy payment splitter for royalties...",
  })

  const addressRoyalty = await contractPaymentSplitter
    .deploy({
      data: bytecode,
      arguments: [royalties],
    })
    .send(
      {
        from: account,
        gas: gasLimit,
        gasPrice,
      },
      (error, transactionHash) => {}
    )
    .on("error", (error) => {
      console.log("error for deploy", error)
    })
    .on("transactionHash", (transactionHash) => {})
    .on("receipt", (receipt) => {
      console.log(receipt.contractAddress) // contains the new contract address
    })
    .on("confirmation", (confirmationNumber, receipt) => {
      console.log("receipt", receipt)
    })
    .then((newContractInstance) => newContractInstance.options.address)
  return addressRoyalty
}

export const addToMarketDecenterlize = async (
  setProgress,
  address,
  id,
  priceTowei,
  tokenSale,
  amount,
  start,
  end,
  contractAddressMarket,
  libaray,
  account
) => {
  const ConractMarketPlace = new libaray.eth.Contract(
    ContractMarketABI,
    contractAddressMarket
  )

  const { methods: methodsMarketPlace } = ConractMarketPlace

  setProgress({
    status: 85,
    note: `add your NFT to our Market decentralise...`,
  })

  await methodsMarketPlace
    .createMarketItem(address, id, priceTowei, tokenSale, amount, start, end)
    .send({ from: account })
    .then((result) => result)

  const marketItemId = await methodsMarketPlace
    .LastIdMarketItem()
    .call()
    .then((result) => result)

  return marketItemId
}

export const TransferNFT = async (
  from,
  to,
  tokenId,
  amount,
  library,
  contractAddress,
  setProgress
) => {
  let contract
  let res
  if (amount === 0) {
    contract = new library.eth.Contract(ERC721ABI, contractAddress)
  } else {
    contract = new library.eth.Contract(ERC1155ABI, contractAddress)
  }

  const { methods } = contract

  setProgress({
    status: 85,
    note: `Transfering, please wait...`,
  })

  if (amount === 0) {
    res = await methods
      .transferFrom(from, to, tokenId)
      .send({ from })
      .then((result) => true)
      .catch((error) => false)
  } else {
    res = await methods
      .safeTransferFrom(from, to, tokenId, amount, "0x00")
      .send({ from })
      .then((result) => true)
      .catch((error) => false)
  }

  return res
}

export const BurnNFT = async (
  from,
  tokenId,
  amount,
  library,
  contractAddress,
  setProgress
) => {
  let contract
  let res
  if (amount === 0) {
    contract = new library.eth.Contract(ERC721ABI, contractAddress)
  } else {
    contract = new library.eth.Contract(ERC1155ABI, contractAddress)
  }

  const { methods } = contract

  setProgress({
    status: 85,
    note: `Burning, please wait...`,
  })

  if (amount === 0) {
    res = await methods
      .burn(tokenId)
      .send({ from })
      .then((result) => true)
      .catch((error) => false)
  } else {
    res = await methods
      .burn(from, tokenId, amount)
      .send({ from })
      .then((result) => true)
      .catch((error) => false)
  }

  return res
}

export const IsApprove = async (
  owner,
  operator,
  setProgress,
  contractAddress,
  library,
  amount
) => {
  let contract
  if (amount === 0) {
    contract = new library.eth.Contract(ERC721ABI, contractAddress)
  } else {
    contract = new library.eth.Contract(ERC1155ABI, contractAddress)
  }
  const { methods } = contract
  setProgress({
    status: 65,
    note: `Approve your NFT to market...`,
  })
  const res = await methods.isApprovedForAll(owner, operator).call()
  if (!res) {
    await methods.setApprovalForAll(operator, true).send({ from: owner })
  }
}

export const deleteItemMarket = async (
  contractAddress,
  itemMarketId,
  amount,
  owner,
  library
) => {
  let contract
  if (amount === 0) {
    contract = new library.eth.Contract(ContractMarketABI, contractAddress)
  } else {
    contract = new library.eth.Contract(ContractMarketABI, contractAddress)
  }
  const { methods } = contract
  // setProgress({
  //   status: 65,
  //   note: `Remove your NFT from Market...`,
  // })
  await methods.deleteMarketItem(itemMarketId).send({ from: owner })
}
