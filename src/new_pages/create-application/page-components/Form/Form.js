import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useHistory, useParams } from "react-router-dom"
import { loadStdlib } from "@reach-sh/stdlib"
import MyAlgoConnect from "@reach-sh/stdlib/ALGO_MyAlgoConnect"
import classNames from "classnames"
import { Dialog, Classes, Button as BluePrintButton } from "@blueprintjs/core"
import useWallet from "hooks/useWallet"

import { LoadingIndicator } from "components"
import {
  AlertModal,
  Button,
  SelectAssetDropdown,
  TextField,
  SelectDropdown,
  DurationPicker,
  ImagePreviewModal,
} from "new_components"
import { AssetCard } from "new_pages/create-application/page-components"
import { config } from "utils/config"
import { getAccountInfo } from "utils/algorand"
import { NFT } from "utils/nft"
import {
  isDevelopment,
  AUCTION_TIMES,
  LOADING_STATUS,
  PROGRESS_STEPS,
  MINIMUM_BALANCE_APPLICATION,
  SellTypes,
} from "utils/constants"

import { ReactComponent as PlusIcon } from "new_assets/icons/plus-circle.svg"
import { AuctionService } from "services/AuctionService"
import classes from "./Form.module.scss"
import { formatURL } from "utils/helper"
import { ContractorService } from "../../../../services/ContractorService"
import { BuyNowService } from "../../../../services/BuyNowService"

import {
  walletconnect,
  walletlink,
  MetaMask,
} from "utils/walletConnector/ETHConnector"

import {
  MetaMaskPolygon,
  fortmatic,
  portis,
  torus,
} from "utils/walletConnector/PolygonConnector"

const stdlib = loadStdlib({
  REACH_CONNECTOR_MODE: "ALGO",
  REACH_DEBUG: isDevelopment ? "YES" : "NO",
})

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

const Providers = {
  EthereumNetwork: [
    {
      Provider: MetaMask,
      WalletName: "MetaMask",
      Logo: "/static/images/wallets/metamask-128.png",
    },
    {
      Provider: walletconnect,
      WalletName: "WalletConnect",
      Logo: "/static/images/wallets/walletConnect-128.png",
    },
    {
      Provider: walletlink,
      WalletName: "WalletLink",
      Logo: "/static/images/wallets/walletLink-128.png",
    },
    {
      Provider: walletconnect,
      WalletName: "TrustWallet",
      Logo: "/static/images/wallets/trustWallet-128.png",
    },
  ],
  PolygonNetwork: [
    {
      Provider: MetaMaskPolygon,
      WalletName: "MetaMask",
      Logo: "/static/images/wallets/metamask-128.png",
    },
    {
      Provider: fortmatic,
      WalletName: "FortMatic",
      Logo: "/static/images/wallets/fortmatic-128.png",
    },
    {
      Provider: portis,
      WalletName: "Portis",
      Logo: "/static/images/wallets/portis-128.png",
    },
    {
      Provider: torus,
      WalletName: "Torus",
      Logo: "/static/images/wallets/torus-128.png",
    },
  ],
}

export const Form = ({ className }) => {
  const history = useHistory()
  const { id: tokenId } = useParams()

  const { sessionWallet, selectedAccount } = useSelector(
    (state) => state.wallet
  )

  const { connect } = useWallet()

  const [assetList, setAssetList] = useState([])
  const [loading, setLoading] = useState(LOADING_STATUS.IDLE)
  const [sellLoading, setSellLoading] = useState(false)
  const [progress, setProgress] = useState(PROGRESS_STEPS.INITIAL)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [startingBid, setStartingBid] = useState(0)
  const [reservedPrice, setReservedPrice] = useState(0)
  const [endIn, setEndIn] = useState(null)
  const [selectedDuration, setSelectedDuration] = useState(null)
  const [alertMessage, setAlertMessage] = useState({})
  const { rootTheme } = useSelector((state) => state.application)

  const [selectorOpen, setSelectorOpen] = useState(false)

  const [errors, setErrors] = useState({
    asset: false,
    startingBid: false,
    reservedPrice: false,
    salesPrice: false,
    duration: false,
  })

  const [activeTab, setActiveTab] = useState(SellTypes.AUCTION)
  const [salesPrice, setSalesPrice] = useState(0)
  const [royalty, setRoyalty] = useState(0)

  const [totalAssets, setTotalAssets] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [isImagePreviewModalOpen, setIsImagePreviewModalOpen] = useState(false)
  const [isVideo, setIsVideo] = useState(false)

  useEffect(() => {
    if (sessionWallet.connected()) {
      const defaultAddress =
        selectedAccount ||
        sessionWallet.getDefaultAccount() ||
        sessionWallet.wallet.accounts[0]
      setLoading(LOADING_STATUS.PENDING)
      fetchAssets(defaultAddress)
    } else {
      setLoading(LOADING_STATUS.IDLE)
      setSelectedAsset(null)
      setAssetList([])
      setStartingBid(0)
      setEndIn(null)
      setAlertMessage({})
      setErrors({
        bid: false,
        duration: false,
        asset: false,
      })
    }
  }, [sessionWallet, selectedAccount])

  useEffect(() => {
    if (selectedAsset) {
      updateSelectedAsset()
    }
  }, [startingBid, endIn, salesPrice, selectedDuration])

  useEffect(async () => {
    let mounted = true

    try {
      if (tokenId) {
        const NFTDetail = await NFT.fromAssetId(tokenId)
        const NFTImg = NFTDetail.imgURL()
        if (mounted) updateSelectedAsset(NFTDetail, NFTImg)
      }
    } catch (err) {
      console.log(err)
    }

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (totalAssets.length > 0) {
      setHasMore(true)
      fetchNextBlock("", [], 0, 8)
    } else {
      setAssetList([])
      setHasMore(false)
    }
  }, [totalAssets])

  const updateSelectedAsset = (asset, url) => {
    const updatedAsset = {
      ...(asset || selectedAsset),
      currentBid: startingBid
        ? startingBid > 0
          ? Number(startingBid)
          : 0
        : undefined,
      salesPrice,
      endingIn: endIn === "custom" ? selectedDuration : Number(endIn),
    }

    if (url) updatedAsset.url = url

    setSelectedAsset(updatedAsset)
  }

  const fetchAssets = async (addr) => {
    try {
      const { assets } = await getAccountInfo(addr)
      const ownedAssets = assets.filter((a) => a.amount > 0 && a.amount < 10000)
      const getAssetPromises = ownedAssets.map((asset) =>
        NFT.fromAssetId(asset["asset-id"])
      )
      Promise.all([...getAssetPromises])
        .then((list) => {
          const successTokens = list.filter((asset) => asset)
          setTotalAssets(successTokens)
          if (tokenId) {
            const targetNFT = successTokens.find(
              (nft) => String(nft.token.id) === tokenId
            )
            if (targetNFT) {
              formatURL(targetNFT.metadata.image).then((url) => {
                updateSelectedAsset(targetNFT, url)
              })
            }
          }
        })
        .catch((error) => console.log(error))
        .finally(() => setLoading(LOADING_STATUS.COMPLETED))
    } catch (error) {
      console.log(error)
    }
  }

  const onSearchAsset = (searchValue) => {
    setHasMore(true)
    setAssetList([])
    fetchNextBlock(searchValue, [], 0, 8)
  }

  const fetchMoreAssets = (assets, originAssets, from, to) => {
    if (from >= assets.length) {
      setHasMore(false)
      return
    }
    setTimeout(() => {
      setAssetList([...originAssets, ...assets.slice(from, to + 8)])
    }, 1500)
  }

  const fetchNextBlock = (searchValue, originAssets, from, to) => {
    const filteredAssets = searchValue
      ? totalAssets.filter((asset) => {
          if (asset?.metadata?.name) {
            return asset.metadata.name
              .toLowerCase()
              .includes(searchValue.toLowerCase())
          }
          return false
        })
      : totalAssets

    fetchMoreAssets(filteredAssets, originAssets, from, to)
  }

  // const handleConnect = async () => {
  //   try {
  //     const sw = new SessionWallet(
  //       sessionWallet.network,
  //       sessionWallet.permissionCallback,
  //       "my-algo-connect"
  //     )
  //     const res = await sw.connect()
  //     if (res) {
  //       dispatch(setSessionWallet(sw))
  //       dispatch(setAccounts(sw.accountList()))
  //       dispatch(setConnectedStatus(sw.connected()))
  //     } else {
  //       setAlertMessage({
  //         title: "Wallet Connection Failed",
  //         desc: "Please try it again.",
  //       })
  //     }
  //   } catch (error) {
  //     setAlertMessage({
  //       title: "Wallet Connection Error",
  //       desc: "Please try it again.",
  //     })
  //   }
  // }

  const handleValidateForm = () => {
    let values = null
    let errorsObj = null

    if (activeTab === SellTypes.AUCTION) {
      values = {
        asset: selectedAsset,
        startingBid: (startingBid || 0) > 0 ? Number(startingBid) : 0,
        reservedPrice: (reservedPrice || 0) > 0 ? Number(reservedPrice) : 0,
        royalty: (royalty || 0) > 0 ? Number(royalty) : 0,
        duration: endIn === "custom" ? selectedDuration : Number(endIn),
      }
      errorsObj = {
        asset: !values.asset,
        startingBid: Number.isNaN(values.startingBid),
        reservedPrice: Number.isNaN(values.startingBid),
        royalty: values.royalty < 0 || values.royalty > 90,
        duration: !!(!values.duration && values.duration === 0),
      }
    } else if (SellTypes.FIXED_PRICE) {
      values = {
        asset: selectedAsset,
        salesPrice: salesPrice > 0 ? Number(salesPrice) : 0,
        royalty: (royalty || 0) > 0 ? Number(royalty) : 0,
      }

      errorsObj = {
        asset: !values.asset,
        salesPrice: values.salesPrice <= 0,
        royalty: values.royalty < 0 || values.royalty > 90,
      }
    }

    setErrors(errorsObj)

    const isAllValuesValid = Object.values(errorsObj).every((field) => !field)

    if (isAllValuesValid) {
      // all fields are valid
      createApplication(values)
    }
  }

  const createApplication = async (values) => {
    setSellLoading(true)

    const { asset } = values
    const token = Number(asset.token.id)

    try {
      /*
       * Connect wallet
       */
      setProgress(PROGRESS_STEPS.CONNECT_WALLET)

      const creator = await stdlib.getDefaultAccount()

      /*
       * Check balance
       */
      setProgress(PROGRESS_STEPS.BALANCE_CHECK)

      let balance = await stdlib.balanceOf(creator)
      balance = stdlib.formatCurrency(balance, 4)

      if (balance <= MINIMUM_BALANCE_APPLICATION)
        throw new Error(PROGRESS_STEPS.BALANCE_CHECK.error)

      /*
       * Create sales account
       */
      setProgress(PROGRESS_STEPS.CREATE_SALES_ACCOUNT)

      const {
        data: { newAuctioneerWallet, newAccountIndex },
      } = await ContractorService.createContractor()

      /*
       * Transfer minimal balance
       */
      setProgress(PROGRESS_STEPS.MINIMAL_BALANCE_TRANSFER)

      const auctioneer = await stdlib.connectAccount({
        addr: newAuctioneerWallet,
      })
      await stdlib.transfer(
        creator,
        auctioneer,
        stdlib.parseCurrency(MINIMUM_BALANCE_APPLICATION)
      )

      /*
       * Opt-in asset
       */
      setProgress(PROGRESS_STEPS.OPT_IN)
      await ContractorService.tokenAccept(newAccountIndex, token)

      /*
       * Transfer asset
       */
      setProgress(PROGRESS_STEPS.ASSET_TRANSFER)
      await stdlib.transfer(creator, auctioneer, stdlib.bigNumberify(1), token)

      /*
       * Verify
       */
      setProgress(PROGRESS_STEPS.VERIFY_CONTRACT)

      const duration = endIn === "custom" ? selectedDuration : endIn
      let newAppId = 0

      if (activeTab === SellTypes.FIXED_PRICE) {
        const {
          data: { appId },
        } = await BuyNowService.createBuyNow(
          newAccountIndex,
          creator.networkAccount.addr,
          token,
          salesPrice,
          royalty
        )
        newAppId = appId
      } else {
        const {
          data: { appId },
        } = await AuctionService.createAuction(
          newAccountIndex,
          creator.networkAccount.addr,
          token,
          Number(startingBid),
          Number(reservedPrice),
          duration,
          royalty
        )
        newAppId = appId
      }

      setProgress(PROGRESS_STEPS.REDIRECT)

      if (newAppId === "0" || typeof newAppId === "undefined") {
        throw new Error("invalid app id")
      } else if (activeTab === SellTypes.FIXED_PRICE) {
        window.analytics.track("Fixed Price Sale Created", {
          newAppId,
        })
        window.heap.track("Fixed Price Sale Created", {
          newAppId,
        })
      } else {
        window.analytics.track("Auction Created", {
          newAppId,
        })
        window.heap.track("Auction Created", {
          newAppId,
        })
      }

      setTimeout(() => {
        history.push(`/buy/${newAppId}`)
      }, 500)
    } catch (e) {
      if (e.toString().includes("PopupOpenError")) {
        setAlertMessage({
          title: "Wallet Popup Blocked",
          desc: "Your browser has blocked popups. Please allow popups to sell an NFT.",
        })
      } else {
        setAlertMessage({
          title: "Application creation failed",
          desc: "Please try again",
        })
      }
      window.analytics.track("Auction Creation Failed")
      setProgress(PROGRESS_STEPS.INITIAL)
      setSellLoading(false)
    }
  }

  const handleSelectedWallet = async (provider) => {
    if (provider === "close") {
      setSelectorOpen(false)
    } else {
      await connect(provider)
      setSelectorOpen(false)
    }
  }

  const walletsEthereum = Providers.EthereumNetwork.map((item, index) => (
    <li key={index}>
      <Button
        id={index}
        large
        fill
        minimal
        outlined
        className={classes.buttonPink}
        onClick={() => handleSelectedWallet(item.Provider)}
      >
        <div className={classes["wallet-option"]}>
          <img
            alt="wallet-branding"
            className={classes["wallet-branding"]}
            src={item.Logo}
          />
          <h5>{item.WalletName}</h5>
        </div>
      </Button>
    </li>
  ))

  const PolygonNetwork = Providers.PolygonNetwork.map((item, index) => (
    <li key={index}>
      <Button
        id={item.Provider}
        large
        fill
        minimal
        outlined
        className={classes.buttonPink}
        onClick={() => handleSelectedWallet(item.Provider)}
      >
        <div className={classes["wallet-option"]}>
          <img
            alt="wallet-branding"
            className={classes["wallet-branding"]}
            src={item.Logo}
          />
          <h5>{item.WalletName}</h5>
        </div>
      </Button>
    </li>
  ))

  return (
    <>
      <section className={classNames(classes.container, className)}>
        <div className={classes.left}>
          <h1
            style={
              rootTheme === "dark" ? { color: "white" } : { color: "black" }
            }
            className={classes.title}
          >
            Sell NFT
          </h1>
          <span className={classes.subtitle}>
            Choose an NFT you own to sell on the marketplace.
          </span>
          {loading === LOADING_STATUS.IDLE && (
            // <Button onClick={handleConnect} className={classes["connect-btn"]}>
            //   Connect Wallet
            // </Button>
            <>
              <Button
                onClick={() => setSelectorOpen(true)}
                className={classes["connect-btn"]}
              >
                Connect Wallet
              </Button>

              {/* Dialog */}
              <Dialog
                isOpen={selectorOpen}
                title=""
                onClose={() => handleSelectedWallet("close")}
                className={classes.dialog}
              >
                <h2 className={classes["dialog-title"]}>Select Wallet</h2>

                <div className={Classes.DIALOG_BODY}>
                  <h3 style={{ padding: "10px" }}> Ethereum Network </h3>
                  <ul className={classes["wallet-option-list"]}>
                    {walletsEthereum}
                  </ul>
                  <h3 style={{ padding: "10px" }}> Polygon Network </h3>
                  <ul className={classes["wallet-option-list"]}>
                    {PolygonNetwork}
                  </ul>
                </div>
              </Dialog>
            </>
          )}
          {loading === LOADING_STATUS.PENDING ? (
            <LoadingIndicator />
          ) : (
            loading === LOADING_STATUS.COMPLETED && (
              <>
                <div className={classes.left__inputs}>
                  <div className={classes.tabs}>
                    <BluePrintButton
                      onClick={() => setActiveTab(SellTypes.AUCTION)}
                      minimal
                      outlined
                      intent="danger"
                      text="Auction"
                      className={`${classes.tab_auction} ${
                        activeTab === SellTypes.AUCTION
                          ? classes.active_pink
                          : ""
                      }`}
                      type="button"
                      disabled={sellLoading}
                    />
                    <BluePrintButton
                      onClick={() => setActiveTab(SellTypes.FIXED_PRICE)}
                      minimal
                      outlined
                      intent="success"
                      text="Fixed Price"
                      className={`${classes.tab_buy} ${
                        activeTab === SellTypes.FIXED_PRICE
                          ? classes.active_blue
                          : ""
                      }`}
                      type="button"
                      disabled={sellLoading}
                    />
                  </div>

                  <SelectAssetDropdown
                    required
                    hasMore={hasMore}
                    fetchMoreAssets={fetchNextBlock}
                    onSearchAsset={onSearchAsset}
                    assets={assetList}
                    error={errors.asset && "Please Select An NFT"}
                    onChange={(asset) => updateSelectedAsset(asset)}
                    value={selectedAsset}
                    disabled={sellLoading}
                  />

                  {activeTab === SellTypes.FIXED_PRICE ? (
                    <TextField
                      label="Sale Price"
                      required
                      error={
                        errors.salesPrice &&
                        "Sale price is required and higher than 0"
                      }
                      type="number"
                      min="0"
                      value={salesPrice}
                      onChange={(e) => setSalesPrice(e.target.value)}
                      disabled={!selectedAsset || sellLoading}
                      capitalizeLabel
                    />
                  ) : (
                    <>
                      <TextField
                        label="Starting Bid"
                        required
                        error={errors.startingBid && "Starting bid is required"}
                        type="number"
                        min="0"
                        value={startingBid}
                        onChange={(e) => setStartingBid(e.target.value)}
                        disabled={!selectedAsset || sellLoading}
                        capitalizeLabel
                      />

                      <TextField
                        label="Reserved Price"
                        error={
                          errors.reservedPrice && "Reserved price is required"
                        }
                        type="number"
                        min="0"
                        value={reservedPrice}
                        onChange={(e) => setReservedPrice(e.target.value)}
                        disabled={!selectedAsset || sellLoading}
                        capitalizeLabel
                      />
                    </>
                  )}

                  <TextField
                    label="Creator Royalty (%)"
                    error={
                      errors.royalty &&
                      "Royalty must be bigger than 0% and smaller than 90%"
                    }
                    value={royalty}
                    onChange={(e) => setRoyalty(Number(e.target.value))}
                    disabled={!selectedAsset || sellLoading}
                    capitalizeLabel
                  />

                  {activeTab === SellTypes.AUCTION && (
                    <>
                      <SelectDropdown
                        label="Auction duration"
                        placeholder="Select one option"
                        required
                        disabled={!selectedAsset || sellLoading}
                        error={
                          endIn !== "custom"
                            ? errors.duration && "Auction duration is required"
                            : null
                        }
                        value={endIn}
                        onChange={(value) => setEndIn(value)}
                        items={AUCTION_TIMES}
                        capitalizeLabel
                      />

                      {endIn === "custom" && (
                        <DurationPicker
                          label="Select Duration"
                          onChange={(val) => setSelectedDuration(val)}
                          disabled={sellLoading}
                        />
                      )}
                    </>
                  )}
                </div>

                <Button
                  accent="pink"
                  minimal
                  icon={<PlusIcon />}
                  onClick={handleValidateForm}
                  className={classes["submit-btn"]}
                  disabled={sellLoading}
                >
                  Sell NFT
                </Button>
              </>
            )
          )}
        </div>
        {loading !== LOADING_STATUS.IDLE && (
          <div className={classes.right}>
            {selectedAsset ? (
              <AssetCard
                {...selectedAsset}
                tab={activeTab}
                noHover
                onAssetClick={() => setIsImagePreviewModalOpen(true)}
                onAssetLoad={(video) => setIsVideo(video)}
              />
            ) : (
              loading === LOADING_STATUS.COMPLETED && (
                <div className={classes.right__placeholder}>
                  Please Select An NFT First
                </div>
              )
            )}
          </div>
        )}
        <AlertModal
          isOpen={!!alertMessage.title}
          data={alertMessage}
          onClose={() => setAlertMessage({})}
        />
      </section>
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

      <ImagePreviewModal
        isOpen={isImagePreviewModalOpen}
        onClose={() => setIsImagePreviewModalOpen(false)}
        url={selectedAsset?.url}
        isVideo={isVideo}
      />
    </>
  )
}
