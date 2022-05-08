/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-await */
/* eslint-disable camelcase */
import algosdk, { Transaction } from "algosdk"
import { NFT } from "./nft"
import axios from "axios"
import { config } from "./config"

const client = new algosdk.Algodv2(config.algodToken, config.baseServer, "")

export const createToken = async (
  wallet,
  md,
  url,
  // decimals,
  total,
  setProgress
) => {
  const addr = wallet.getDefaultAccount()
  const suggested = await getSuggested(10)
  setProgress({
    status: 60,
    note: "Preparing asset parameters...",
  })
  // setProgressStatus(60)
  const create_txn = getAsaCreateTxn(
    suggested,
    addr,
    md.unitName,
    md.name,
    md.toHash(),
    url,
    total
    // decimals
  )

  const [create_txn_s] = await wallet.signTxn([create_txn])
  setProgress({
    status: 70,
    note: "Signing transaction...",
  })
  // setProgressStatus(70)
  const result = await sendWait([create_txn_s])
  setProgress({
    status: 80,
    note: "Awaiting confirmation...",
  })
  // setProgressStatus(80)
  return result["asset-index"]
}

export const getSuggested = async (rounds) => {
  const txParams = await client.getTransactionParams().do()
  return { ...txParams, lastRound: txParams.firstRound + rounds }
}

export const getPayTxn = async (suggestedParams, addr) =>
  new Transaction({
    type: "pay",
    from: addr,
    to: addr,
    amount: 0,
    ...suggestedParams,
  })

export const getAsaCreateTxn = (
  suggestedParams,
  addr,
  unitName,
  name,
  mdhash,
  url,
  decimals
) =>
  new Transaction({
    from: addr,
    assetName: name,
    assetUnitName: unitName,
    assetURL: url,
    assetMetadataHash: mdhash,
    assetManager: addr,
    assetReserve: addr,
    // eslint-disable-next-line no-restricted-properties
    // assetTotal: Math.pow(10, decimals),
    assetTotal: decimals,
    // assetDecimals: decimals,
    type: "acfg",
    ...suggestedParams,
  })

export const sendWait = async (signed) => {
  try {
    const { txId } = await client
      .sendRawTransaction(signed.map((t) => t.blob))
      .do()
    return await waitForConfirmation(txId, 3)
  } catch (error) {
    console.error(error)
  }

  return undefined
}

export const waitForConfirmation = async (txId, timeout) => {
  if (client == null || txId == null || timeout < 0) {
    throw new Error("Bad arguments.")
  }

  const status = await client.status().do()
  if (typeof status === "undefined")
    throw new Error("Unable to get node status")

  const startround = status["last-round"] + 1
  let currentround = startround

  /* eslint-disable no-await-in-loop */
  while (currentround < startround + timeout) {
    const pending = await client.pendingTransactionInformation(txId).do()

    if (pending !== undefined) {
      if (pending["confirmed-round"] !== null && pending["confirmed-round"] > 0)
        return pending

      if (pending["pool-error"] != null && pending["pool-error"].length > 0)
        throw new Error(
          `Transaction Rejected pool error${pending["pool-error"]}`
        )
    }

    await client.statusAfterBlock(currentround).do()
    currentround += 1
  }

  /* eslint-enable no-await-in-loop */
  throw new Error(`Transaction not confirmed after ${timeout} rounds!`)
}

export const getToken = async (assetId) => {
  // eslint-disable-next-line no-useless-catch
  try {
    return await client.getAssetByID(assetId).do()
  } catch (err) {
    throw err
  }
}

export const getCollection = async (address) => {
  const results = await client.accountInformation(address).do()

  const plist = []
  for (const a in results.assets) {
    if (results.assets[a].amount > 0 && results.assets[a].amount < 10000)
      plist.push(getToken(results.assets[a]["asset-id"]))
  }

  const assets = await Promise.all(plist)

  const collectionRequests = assets.map((a) => NFT.fromToken(a))
  // .filter((a)=>{ return NFT.isArc3(a) })

  return Promise.all(collectionRequests)
}

export const getAccountInfo = async (address) => {
  try {
    const { data } = await axios.get(
      `${config.explorerApi}/v2/accounts/${address}`
    )
    return data
  } catch (error) {
    console.error(error)
  }
}

export const getAssetInfo = async (assetId) => {
  try {
    const { data } = await axios.get(
      `${config.explorerApi}/idx2/v2/assets/${assetId}`
    )
    return data
  } catch (error) {
    console.error(error)
  }
}

export const getApplicationInfo = async (appId) => {
  try {
    const { data } = await axios.get(
      `${config.explorerApi}/v2/applications/${appId}`
    )
    return data
  } catch (error) {
    console.error(error)
  }
}

export const getAccountTransaction = async (address, params) => {
  try {
    const { data } = await axios.get(
      `${config.explorerApi}/idx2/v2/accounts/${address}/transactions`,
      params
    )
    return data
  } catch (error) {
    console.error(error)
  }
}

export const getAccountListHoldsAsset = async (assetId) => {
  try {
    const { data } = await axios.get(
      `${config.explorerApi}/idx2/v2/assets/${assetId}/balances`
    )
    return data
  } catch (error) {
    console.error(error)
  }
}
