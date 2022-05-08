import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useHistory, useParams } from "react-router-dom"
import MyAlgoConnect from "@reach-sh/stdlib/ALGO_MyAlgoConnect"
import { loadStdlib } from "@reach-sh/stdlib"

import { AlertModal, BidHistory, Layout } from "new_components"
import { LoadingIndicator } from "components"
import { config } from "utils/config"
import { timeDiffAsSec } from "utils/helper"
import { buyTypes, BID_PROGRESS_STEPS } from "utils/constants"
import * as auctionContract from "services/contracts/auction-contract"
import * as buyNowContract from "services/contracts/buynow-contract"
import { AuctionService } from "services/AuctionService"
import { BuyNowService } from "services/BuyNowService"
import { NFTInfo } from "./page-components"
import classes from "./index.module.scss"
import { useTitle } from "react-use"
import {
  asyncLookupAssetByID,
  IndexerLoadingId,
  asyncGetTransactions,
} from "redux/indexer/indexer-slice"

const stdlib = loadStdlib("ALGO")

stdlib.setWalletFallback(
  stdlib.walletFallback({
    providerEnv: {
      ALGO_SERVER: config.baseServer,
      ALGO_PORT: "",
      ALGO_TOKEN: config.algodToken,
      ALGO_INDEXER_SERVER: config.baseIndexer,
      ALGO_INDEXER_PORT: "",
      ALGO_INDEXER_TOKEN: config.algodToken,
      REACH_ISOLATED_NETWORK: "no",
    },
    MyAlgoConnect,
  })
)

const InitInfoDialog = {
  isOpen: false,
  data: { title: "", desc: "" },
}

const NewExploreBuyDetails = () => {
  const { id } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()

  const { applications, updatedStatus } = useSelector(
    (state) => state.application
  )
  const selectedWallet = useSelector((state) => state.wallet.selectedAccount)
  const isVerified = useSelector(
    (state) => state.indexer.isSelectedAssetVerified
  )
  const indexerLoading = useSelector((state) => state.indexer.loading)
  const assetTransactionInfo = useSelector(
    (state) => state.indexer.selectedAssetTransactions.transactions
  )

  const [loading, setLoading] = useState(false)
  const [bidLoading, setBidLoading] = useState(false)
  const [buyLoading, setBuyLoading] = useState(false)
  const [closeAuctionLoading, setCloseAuctionLoading] = useState(false)
  const [timeCounter, setTimeCounter] = useState(0)
  const [bids, setBids] = useState([])
  const [currentPrice, setCurrentPrice] = useState(0)
  const [asset, setAsset] = useState(null)
  const [reservedPrice, setReservedPrice] = useState(0)
  const [assetId, setAssetId] = useState(0)
  const [buyType, setBuyType] = useState("")
  const [highestBidder, setHighestBidder] = useState("")
  const [creator, setCreator] = useState("")
  const [salesPrice, setSalesPrice] = useState(0)
  const [infoDialog, setInfoDialog] = useState(InitInfoDialog)
  const [lastBid, setLastBid] = useState()
  const [endTimeV, setEndTimeV] = useState()
  const [progress, setProgress] = useState(BID_PROGRESS_STEPS.INITIAL)
  const [pageTitle, setPageTitle] = useState("Application | YNFT Club")
  const [verifyCalled, setVerifyCalled] = useState(false)
  const [currentOwner, setCurrentOwner] = useState("")

  useEffect(() => {
    if (assetTransactionInfo && assetTransactionInfo.length >= 2) {
      const sortedTransactionInfo = Array.from(assetTransactionInfo).sort(
        (tx1, tx2) => tx2["round-time"] - tx1["round-time"]
      )
      const ownerAddr =
        sortedTransactionInfo[0]["asset-transfer-transaction"].receiver
      setCurrentOwner(ownerAddr)
    } else if (assetTransactionInfo && assetTransactionInfo.length > 0) {
      const ownerAddr =
        assetTransactionInfo[0]["asset-transfer-transaction"].receiver
      setCurrentOwner(ownerAddr)
    } else {
      const ownerAddr = creator
      setCurrentOwner(ownerAddr)
    }
  }, [assetTransactionInfo, creator])
  useEffect(() => {
    if (updatedStatus) {
      setProgress(BID_PROGRESS_STEPS.INITIAL)
    }
  }, [updatedStatus])

  useEffect(() => {
    if (indexerLoading.includes(IndexerLoadingId.CHECKING_VERIFICATION)) {
      setVerifyCalled(true)
    }
  }, [indexerLoading])

  useEffect(() => {
    if (!applications.length) {
      setLoading(true)
      return
    }

    const application = applications.find(
      (app) => Number(app.appId) === Number(id)
    )
    if (typeof application === "undefined") {
      history.push("/buy?type=live")
      return
    }

    setPageTitle(application.nft.metadata.name)

    setLoading(false)
    // eslint-disable-next-line no-shadow
    const {
      // eslint-disable-next-line no-shadow
      bids,
      // eslint-disable-next-line no-shadow
      currentPrice,
      // eslint-disable-next-line no-shadow
      nft: asset,
      endTime,
      // eslint-disable-next-line no-shadow
      highestBidder,
      // eslint-disable-next-line no-shadow
      buyType,
      // eslint-disable-next-line no-shadow
      salesPrice,
      // eslint-disable-next-line no-shadow
      reservedPrice,
      // eslint-disable-next-line no-shadow
      creator,
    } = application

    if (
      buyType === buyTypes.LIVE_AUCTION ||
      buyType === buyTypes.CLOSED_AUCTION
    ) {
      setLastBid(bids[0])
      setBids(bids)
    }

    // check verified asset
    dispatch(asyncLookupAssetByID({ assetID: asset.token.id }))
    dispatch(
      asyncGetTransactions({
        index: asset.token.id,
        txn_type: "axfer",
        min_amount: 0,
      })
    )

    setCurrentPrice(currentPrice)
    setAsset(asset)
    setAssetId(asset.token.id)
    setHighestBidder(highestBidder)
    setBuyType(buyType)
    setSalesPrice(salesPrice)
    setReservedPrice(reservedPrice || 0)
    setCreator(creator)
    setEndTimeV(endTime)

    const diff = timeDiffAsSec(endTime)
    if (diff > 0) setTimeCounter(diff)

    window.analytics.track("Product Viewed", application.nft)
    window.heap.track("Product Viewed", application.nft)

    setProgress(BID_PROGRESS_STEPS.INITIAL)
  }, [applications])

  useTitle(`${pageTitle} | YNFT Club`)

  useEffect(() => {
    if (!timeCounter) return

    const intervalId = setInterval(() => {
      setTimeCounter(timeCounter - 1)
    }, 1000)

    if (timeCounter < 0) {
      const auction = applications.find(
        (app) => Number(app.appId) === Number(id)
      )
      window.analytics.track("Auction Expired", {
        appId: assetId,
        creator: auction.creator,
        contractAddress: auction.contractAddress,
        currentPrice: auction.currentPrice,
        endTime: auction.endTime,
        buyType: auction.buyType,
        nftDetail: auction.nft,
      })
      window.heap.track("Auction Expired", {
        appId: assetId,
        creator: auction.creator,
        contractAddress: auction.contractAddress,
        currentPrice: auction.currentPrice,
        endTime: auction.endTime,
        buyType: auction.buyType,
        nftDetail: auction.nft,
      })
      clearInterval(intervalId)
    }

    return () => clearInterval(intervalId)
  }, [timeCounter])

  const onBidAuction = async (amount) => {
    try {
      setBidLoading(true)
      setProgress(BID_PROGRESS_STEPS.CONNECT_WALLET)
      const account = await stdlib.getDefaultAccount()

      setProgress(BID_PROGRESS_STEPS.OPTIN_APPLICATION)
      await account.tokenAccept(assetId)

      // TODO: check balance before bid
      setProgress(BID_PROGRESS_STEPS.BALANCE_CHECK)
      const ctc = account.contract(auctionContract, Number(id))
      await ctc.a.Bidder.getBid(stdlib.parseCurrency(Number(amount)))

      setProgress(BID_PROGRESS_STEPS.BIDDING)
      await AuctionService.updateAuction(id)
      const auction = applications.find(
        (app) => Number(app.appId) === Number(id)
      )
      setProgress(BID_PROGRESS_STEPS.BID_CONFIRM)

      window.analytics.track("Bid Detail", {
        appId: assetId,
        currentBidAmount: amount,
        oldBidAmount: auction.currentPrice,
        creator: auction.creator,
        contractAddress: auction.contractAddress,
        bidderAddress: selectedWallet,
      })
      window.heap.track("Bid Detail", {
        appId: assetId,
        currentBidAmount: amount,
        oldBidAmount: auction.currentPrice,
        creator: auction.creator,
        contractAddress: auction.contractAddress,
        bidderAddress: selectedWallet,
      })
    } catch (error) {
      setProgress(BID_PROGRESS_STEPS.INITIAL)
      if (error.toString().includes("Operation cancelled")) {
        handleShowInfoDialog({
          title: "Operation Cancelled.",
          desc: "You have cancelled the operation yourself.",
        })
      } else if (error.toString().includes("PopupOpenError")) {
        handleShowInfoDialog({
          title: "Wallet Popup Blocked",
          desc: "Your browser has blocked popups. Please allow popups to place a bid.",
        })
      } else {
        handleShowInfoDialog({
          title: "Unexpected Error",
          desc: `Failed to place a bid.`,
        })
      }

      window.analytics.track("Bid Failed")
    } finally {
      setBidLoading(false)
    }
  }

  const onClaimAuction = async () => {
    try {
      setCloseAuctionLoading(true)
      setProgress(BID_PROGRESS_STEPS.CONNECT_WALLET)
      const account = await stdlib.getDefaultAccount()
      setProgress(BID_PROGRESS_STEPS.CLOSE_CONTRACT)
      const ctc = account.contract(auctionContract, Number(id))
      await ctc.a.Bidder.close(1)

      await AuctionService.claimAuction(id)
      setProgress(BID_PROGRESS_STEPS.CLOSE_CONFIRM)
      const auction = applications.find(
        (app) => Number(app.nft.token.id) === Number(assetId)
      )

      window.analytics.track("Claim NFT", {
        appId: auction.appId,
        auctioneer: auction.auctioneer,
        currentPrice: auction.currentPrice,
        highestBidder: auction.highestBidder,
        nftDetail: auction.nft,
        creator: auction.creator,
        buyType: auction.buyType,
      })
      window.heap.track("Claim NFT", {
        appId: auction.appId,
        auctioneer: auction.auctioneer,
        currentPrice: auction.currentPrice,
        highestBidder: auction.highestBidder,
        nftDetail: auction.nft,
        creator: auction.creator,
        buyType: auction.buyType,
      })

      history.push({
        pathname: "/buy",
        search: `type=live`,
      })
    } catch {
      setProgress(BID_PROGRESS_STEPS.INITIAL)
      handleShowInfoDialog({
        title: "Unexpected Error",
        desc: `Failed to claim the auction.`,
      })
      window.analytics.track("Claim NFT Failed")
      window.heap.track("Claim NFT Failed")
    } finally {
      setCloseAuctionLoading(false)
    }
  }

  const onMakeOffer = async () => {}

  // Seller close buy now contract
  const onCloseBuyNow = async () => {
    try {
      setBuyLoading(true)
      setProgress(BID_PROGRESS_STEPS.CONNECT_WALLET)
      const account = await stdlib.getDefaultAccount()
      const ctc = account.contract(buyNowContract, Number(id))
      setProgress(BID_PROGRESS_STEPS.CLOSE_CONTRACT)
      await ctc.a.Buyer.close(1)
      await BuyNowService.closeBuyNow(id)
      setProgress(BID_PROGRESS_STEPS.CLOSE_BUYNOW)
    } catch (e) {
      setProgress(BID_PROGRESS_STEPS.INITIAL)
      handleShowInfoDialog({
        title: "Unexpected Error",
        desc: `Failed to close the Fixed Sale.`,
      })
    } finally {
      setBuyLoading(false)
    }
  }

  // Seller close auction contract
  const onCloseAuction = async () => {
    try {
      setCloseAuctionLoading(true)
      setProgress(BID_PROGRESS_STEPS.CONNECT_WALLET)
      const account = await stdlib.getDefaultAccount()

      const ctc = account.contract(auctionContract, Number(id))
      setProgress(BID_PROGRESS_STEPS.CLOSE_CONTRACT)
      await ctc.a.Bidder.close(1)

      await AuctionService.closeAuction(id)
      setProgress(BID_PROGRESS_STEPS.CLOSE_CONFIRM)
      const auction = applications.find(
        (app) => Number(app.nft.token.id) === Number(assetId)
      )

      window.analytics.track("Close Auction", {
        appId: auction.appId,
        auctioneer: auction.auctioneer,
        currentPrice: auction.currentPrice,
        highestBidder: auction.highestBidder,
        nftDetail: auction.nft,
        creator: auction.creator,
        buyType: auction.buyType,
      })
      window.heap.track("Close Auction", {
        appId: auction.appId,
        auctioneer: auction.auctioneer,
        currentPrice: auction.currentPrice,
        highestBidder: auction.highestBidder,
        nftDetail: auction.nft,
        creator: auction.creator,
        buyType: auction.buyType,
      })
    } catch (err) {
      setProgress(BID_PROGRESS_STEPS.INITIAL)
      handleShowInfoDialog({
        title: "Unexpected Error",
        desc: `Failed to close the auction.`,
      })
      window.analytics.track("Close Auction Failed")
      window.heap.track("Close Auction Failed")
    } finally {
      setCloseAuctionLoading(false)
    }
  }

  const onBuyNow = async () => {
    try {
      setBuyLoading(true)
      setProgress(BID_PROGRESS_STEPS.CONNECT_WALLET)
      const account = await stdlib.getDefaultAccount()
      setProgress(BID_PROGRESS_STEPS.OPTIN_APPLICATION)
      await account.tokenAccept(assetId)

      // TODO: check balance before buy
      setProgress(BID_PROGRESS_STEPS.BALANCE_CHECK)
      const ctc = account.contract(buyNowContract, Number(id))
      await ctc.a.Buyer.buyNFT(stdlib.parseCurrency(Number(salesPrice)))
      setProgress(BID_PROGRESS_STEPS.BUYING)
      await BuyNowService.buyNFT(id)
      setProgress(BID_PROGRESS_STEPS.INITIAL)
      window.analytics.track("Buy the NFT.", {
        id,
        salesPrice,
      })
      window.heap.track("Buy the NFT.", {
        id,
        salesPrice,
      })
      history.push({
        pathname: "/buy",
        search: `type=sold`,
      })
    } catch (err) {
      setProgress(BID_PROGRESS_STEPS.INITIAL)
      handleShowInfoDialog({
        title: "Unexpected Error",
        desc: `Failed to buy the NFT.`,
      })
      window.analytics.track("Failed to buy the NFT.")
    } finally {
      setBuyLoading(false)
    }
  }

  const handleShowInfoDialog = ({ title, desc }) => {
    setInfoDialog({ isOpen: true, data: { title, desc } })
  }

  return (
    <Layout>
      {loading && <LoadingIndicator />}
      {asset ? (
        <>
          <NFTInfo
            asset={asset}
            assetId={assetId}
            creator={creator}
            currentOwner={currentOwner}
            currentPrice={currentPrice}
            salesPrice={salesPrice}
            timeCounter={timeCounter}
            endTime={endTimeV}
            highestBidder={highestBidder}
            buyType={buyType}
            reservedPrice={reservedPrice}
            lastBid={lastBid}
            bidLoading={bidLoading}
            buyLoading={buyLoading}
            closeAuctionLoading={closeAuctionLoading}
            isVerified={isVerified}
            verifyLoading={
              !verifyCalled &&
              !indexerLoading.includes(IndexerLoadingId.CHECKING_VERIFICATION)
            }
            onBidAuction={onBidAuction}
            onCloseAuction={onCloseAuction}
            onClaimAuction={onClaimAuction}
            onBuyNow={onBuyNow}
            onCloseBuyNow={onCloseBuyNow}
            onMakeOffer={onMakeOffer}
          />
          <div className={classes.container}>
            {progress.status ? (
              <div className={classes.progress}>
                <p className={classes.progress__note}>{progress.note}</p>
                <div className={classes.progress__bar}>
                  <div
                    className={classes.progress__status}
                    style={{ width: `${progress.status}%` }}
                  />
                </div>
              </div>
            ) : undefined}
            {buyType === buyTypes.BUY_NOW || buyType === buyTypes.SOLD ? (
              <></>
            ) : (
              <BidHistory items={bids} />
            )}
          </div>
        </>
      ) : null}
      <AlertModal
        isOpen={infoDialog.isOpen}
        data={infoDialog.data}
        onClose={() => setInfoDialog(InitInfoDialog)}
      />
    </Layout>
  )
}

export default NewExploreBuyDetails
