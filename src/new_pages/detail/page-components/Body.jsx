import React, { useState, useEffect } from "react"
import "../page-assets/Detail.css"

import { useWeb3React } from "@web3-react/core"
import { useHistory, useLocation, useParams } from "react-router-dom"
import ContractMarketABI from "utils/mint/abis/NFTMarketPlace_ABI.json"
import "../../mint/page-assets/Mint.css"
import Header from "../../landing/page-components/Header"
import Footer from "../../landing/page-components/Footer"
import ERC20ABI from "utils/mint/abis/ERC20.json"
import { useSelector } from "react-redux"
import creatorImage from "../../landing/page-assets/creator.svg"
import creatorBordered from "../page-assets/creator-bordered.svg"
import galleryPopoverImage from "../page-assets/gallery-popover-image.png"
import productImage from "../../landing/page-assets/product-one.png"
import productsOne from "../../landing/FakeData/Products-one"
import detailChartWhite from "../page-assets/detailChartWhite.svg"
import detailChartBlack from "../page-assets/detailChartBlack.svg"
import wolfImage from "../page-assets/wolfe.svg"
import avatarIcon from "../page-assets/avatar.jpg"
import bidWhite from "../../landing/page-assets/bid-white.png"
import Loading from "../../landing/page-components/Loading"
import miniProduct from "../page-assets/miniProduct.svg"
import { Snackbar } from "../../../components/Snackbar/Snackbar"
import acceptIcon from "../page-assets/accept.svg"
import declineIcon from "../page-assets/decline.svg"
import classes from "../../create-nft/page-components/Form/Form.module.scss"

import {
  Button,
  Popover,
  Modal,
  Input,
  Select,
  Calendar,
  TimePicker,
} from "antd"
import Countdown from "react-countdown"
import moment from "moment"
import miniProductLight from "../page-assets/miniProductLight.svg"
import timeWhite from "../page-assets/timeWhite.png"
import timeBlack from "../page-assets/timeBlack.png"
import priceWhite from "../page-assets/priceWhite.png"
import PriceLabel from "../../mint/page-components/PriceLabel"
import SelectArrow from "../../mint/page-components/SelectArrow"
import priceBlack from "../page-assets/priceBlack.png"
import { config } from "utils/config"
import HttpService from "utils/httpService"
import { getDataIPFS } from "utils/mint/ipfs"
import {
  addToMarketDecenterlize,
  TransferNFT,
  BurnNFT,
  IsApprove,
  deleteItemMarket,
  signMessage,
} from "utils/mint"

const { Option } = Select

const Body = () => {
  const { rootTheme } = useSelector((state) => state.application)
  const [loading, setLoading] = useState(true)
  const [fullScreenModal, setFullScreenModal] = useState(false)
  const [transferModal, setTransferModal] = useState(false)
  const [saleModal, setSaleModal] = useState(false)
  const [burnModal, setBurnModal] = useState(false)
  const [placeBidModal, setPlaceBidModal] = useState(false)
  const [placebidValue, setplacebidValue] = useState(0)
  const [saleStep, setSaleStep] = useState(0)
  // --------------------------------------------------------------
  // fixed price progress states
  const [progress, setProgress] = useState({
    status: 0,
    note: "",
  })
  const [progressLoading, setProgressLoading] = useState(false)
  // timed auction progress states
  const [auctionProgress, setAuctionProgress] = useState({
    status: 0,
    note: "",
  })
  const [auctionLoading, setAuctionLoading] = useState(false)
  // transfer progress states
  const [transferProgress, setTransferProgress] = useState({
    status: 0,
    note: "",
  })
  const [transferLoading, setTransferLoading] = useState(false)
  // burn progress states
  const [burnProgress, setBurnProgress] = useState({
    status: 0,
    note: "",
  })
  const [burnLoading, setBurnLoading] = useState(false)
  // accept progress states
  const [acceptProgress, setAcceptProgress] = useState({
    status: 0,
    note: "",
  })
  const [acceptLoading, setAcceptLoading] = useState(false)
  // place bid states
  const [placeBidProgress, setPlaceBidProgress] = useState({
    status: 0,
    note: "",
  })
  const [placeBidLoading, setPlaceBidLoading] = useState(false)
  // --------------------------------------------------------------

  const [setItemURI, setsetItemURI] = useState({
    description: "Loading ...",
  })

  const [startPicker, setStartPicker] = useState(false)
  const [endPicker, setEndPicker] = useState(false)

  const [selectedDateStart, setSelectedDateStart] = useState("")
  const [selectedTimeStart, setSelectedTimeStart] = useState("")
  const [selectedDateEnd, setSelectedDateEnd] = useState("")
  const [selectedTimeEnd, setSelectedTimeEnd] = useState("")

  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [currentAsset, setcurrentAsset] = useState({})

  const [errorStyle, setErrorStyle] = useState(true)
  const [validList, setValidList] = useState({
    price: {
      error: false,
    },
    start: {
      error: false,
    },
    end: {
      error: false,
    },
  })

  const [saleData, setSaleData] = useState({
    price: "",
    start: "",
    end: "",
  })

  const [transferAddress, setTransferAddress] = useState("")
  const [transferError, setTransferError] = useState(false)
  const wonBidder = {}
  const [Bids, setBids] = useState([])
  const [fixedPriceError, setFixedPriceError] = useState(false)
  const [textbuttonFollow, settextbuttonFollow] = useState("Loading ...")

  const { active: connected, account, library } = useWeb3React()
  const httpservice = new HttpService()
  const history = useHistory()
  const { search } = useLocation()
  const { asset } = useParams()
  const [nowTime, setNowTime] = useState(Date.now())
  const data = [1, 1, 1, 1, 1]
  const [list, setList] = useState([])

  const snackbarInitValues = {
    isActive: false,
    text: "",
    color: "",
    timeout: 3000,
  }
  const [snackbar, setSnackbar] = useState(snackbarInitValues)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)

    getCurrentAsset().then((item) => {
      getDataIPFS(item.tokenURI, setsetItemURI, true)
      getBids(item.id).then((bids) => {
        setBids(bids.items)
      })
      setcurrentAsset(item)
    })
  }, [])

  useEffect(() => {
    if (saleModal === false) {
      setSaleStep(0)
    }
  }, [saleModal])

  useEffect(() => {
    if (saleStep === 1) {
      console.log(start, "0")
    }
  }, [saleStep])

  useEffect(() => {
    const now = moment().format()
    if (saleData.start === "-1") {
      setSaleData({
        ...saleData,
        start: now,
      })
      setStartPicker(true)
      setStart(now)
    } else {
      setStart(saleData.start)
    }
  }, [saleData.start])

  useEffect(() => {
    const now = moment().format()
    if (saleData.end === "-1") {
      setSaleData({
        ...saleData,
        end: now,
      })
      setEndPicker(true)
      setEnd(now)
    } else {
      setEnd(saleData.end)
    }
  }, [saleData.end])

  useEffect(() => {
    if (startPicker === true) {
      setSelectedDateStart(moment().format("YYYY-MM-DD"))
      setSelectedTimeStart(moment().format("HH:mm"))
    }
  }, [startPicker])

  useEffect(() => {
    if (endPicker === true) {
      setSelectedDateEnd(moment().format("YYYY-MM-DD"))
      setSelectedTimeEnd(moment().format("HH:mm"))
    }
  }, [endPicker])

  const showMessage = ({ text, color, timeout }) => {
    setSnackbar({ isActive: true, text, color, timeout })
  }

  const handleCopyValue = (value) => {
    navigator.clipboard.writeText(value)
    showMessage({ text: "Copied to clipboard", color: "success" })
  }

  const PopoverMenu = (
    <div
      className={`mv-detail-popover ${
        rootTheme === "light" ? "mv-detail-popover-light" : ""
      }`}
    >
      {currentAsset?.put_on_marketplace ? (
        <button onClick={() => handleRemoveFromSale()} type="button">
          remove from sale
        </button>
      ) : (
        <button onClick={() => setSaleModal(true)} type="button">
          Put on sale
        </button>
      )}
      <button onClick={() => setBurnModal(true)} type="button">
        Burn
      </button>
      <button onClick={() => setTransferModal(true)} type="button">
        Transfer
      </button>
    </div>
  )

  const creatorModal = (
    <div
      className={`mv-info-modals-parts ${
        rootTheme === "light" && "mv-info-modals-parts-light"
      }`}
    >
      <div className="mv-info-modals-part-one">
        {currentAsset && currentAsset?.nft_creator?.avatar ? (
          <img
            src={`${config.url_NFTnize.replace("/api/v1", "/static")}/${
              currentAsset?.nft_creator?.avatar
            }`}
            width={25}
            height={25}
            alt="profile avatar"
          />
        ) : (
          <img
            src={avatarIcon}
            style={{ marginRight: "10px" }}
            height={25}
            width={25}
            alt="no"
          />
        )}
        {connected && (
          <Button
            onClick={() =>
              handleFollowUser(currentAsset?.nft_creator?.walletAddress)
            }
          >
            Follow
          </Button>
        )}
      </div>
      <div className="mv-info-modals-part-two">
        <span style={{ color: "white" }}>
          {currentAsset?.nft_creator?.displayName}
        </span>
        <span>@{currentAsset?.nft_creator?.username.substr(0, 14)}</span>
      </div>
      <div className="mv-info-modals-part-three">
        {currentAsset?.nft_creator?.bio}
      </div>
      <div className="mv-info-modals-part-four">
        <div>Followed by</div>
        <div>
          <img src={creatorBordered} alt="followd by" />
          <img src={creatorBordered} alt="followd by" />
          <img src={creatorBordered} alt="followd by" />
          <img src={creatorBordered} alt="followd by" />
        </div>
      </div>
      <div className="mv-info-modals-part-five">
        <div>
          <div>Following</div>
          <div
            className={
              rootTheme === "light" ? "mv-landing-popover-follow-status" : ""
            }
            style={{ fontWeight: "600" }}
          >
            1250
          </div>
        </div>
        <div>
          <div>Followers</div>
          <div
            className={
              rootTheme === "light" ? "mv-landing-popover-follow-status" : ""
            }
            style={{ fontWeight: "600" }}
          >
            2450
          </div>
        </div>
      </div>
    </div>
  )

  const ownerModal = (
    <div
      className={`mv-info-modals-parts ${
        rootTheme === "light" && "mv-info-modals-parts-light"
      }`}
    >
      <div className="mv-info-modals-part-one">
        {currentAsset && currentAsset?.nft_owner?.avatar ? (
          <img
            src={`${config.url_NFTnize.replace("/api/v1", "/static")}/${
              currentAsset?.nft_owner?.avatar
            }`}
            width={25}
            height={25}
            alt="profile avatar"
          />
        ) : (
          <img
            src={avatarIcon}
            style={{ marginRight: "10px" }}
            height={25}
            width={25}
            alt="no"
          />
        )}
        {connected && (
          <Button
            onClick={() =>
              handleFollowUser(currentAsset?.nft_owner?.walletAddress)
            }
          >
            Follow
          </Button>
        )}
      </div>
      <div className="mv-info-modals-part-two">
        <span style={{ color: "white" }}>
          {currentAsset?.nft_owner?.displayName}
        </span>
        <span>@{currentAsset?.nft_owner?.username.substr(0, 14)}</span>
      </div>
      <div className="mv-info-modals-part-three">
        {currentAsset?.nft_owner?.bio}
      </div>
      <div className="mv-info-modals-part-four">
        <div>Followed by</div>
        <div>
          <img src={creatorBordered} alt="followd by" />
          <img src={creatorBordered} alt="followd by" />
          <img src={creatorBordered} alt="followd by" />
          <img src={creatorBordered} alt="followd by" />
        </div>
      </div>
      <div className="mv-info-modals-part-five">
        <div>
          <div>Following</div>
          <div
            className={
              rootTheme === "light" ? "mv-landing-popover-follow-status" : ""
            }
            style={{ fontWeight: "600" }}
          >
            1250
          </div>
        </div>
        <div>
          <div>Followers</div>
          <div
            className={
              rootTheme === "light" ? "mv-landing-popover-follow-status" : ""
            }
            style={{ fontWeight: "600" }}
          >
            2450
          </div>
        </div>
      </div>
    </div>
  )

  const followUnfollow = async (address) => {
    const url = `${config.url_NFTnize}/follow/`
    const res = await httpservice.post(url, {
      account,
      following: address,
    })
    return res.data
  }

  const Isfollow = async (address) => {
    const url = `${config.url_NFTnize}/follow/isfollowed/`
    const res = await httpservice.get(url, {
      params: {
        account,
        following: address,
      },
    })
    return res.data
  }

  const handleFollowUser = (address) => {
    followUnfollow(address).then((item) => {
      if (item.message === "followed") {
        settextbuttonFollow("Unfollow")
      } else {
        settextbuttonFollow("Follow")
      }
    })
  }

  const loadImageFromIPFS = (URIIPFS) => {
    let uri
    if (URIIPFS) {
      uri = URIIPFS.replace(/^ipfs?:\/\//, "")
    }
    return `${config.IPFS}/${uri}`
  }

  const collectionModal = (
    <div
      className={`mv-collection-modal ${
        rootTheme === "light" ? "mv-collection-modal-light" : ""
      }`}
    >
      <div
        className={`mv-collection-modal-part-one ${
          rootTheme === "light" ? "mv-collection-modal-part-one-light" : ""
        }`}
      >
        <div>
          <img
            src={`${config.url_NFTnize.replace("/api/v1", "/static")}/${
              currentAsset?.nft_creator?.avatar
            }`}
            height={25}
            width={25}
            alt="info"
          />{" "}
          @{currentAsset?.nft_creator?.username.substr(0, 10)}
        </div>
        <Button>Self</Button>
      </div>
      <div>
        <img
          src={loadImageFromIPFS(currentAsset?.Collection?.image_url)}
          alt="gallery"
        />
      </div>
      <div>{currentAsset?.Collection?.name}</div>
    </div>
  )

  const TimerRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (!completed) {
      return (
        <>
          <div>
            <span>{days}</span>D
          </div>
          <div>
            <span>{hours}</span>H
          </div>
          <div>
            <span>{minutes}</span>M
          </div>
          <div>
            <span>{seconds}</span>S
          </div>
        </>
      )
    }
  }

  // start pickers submit handler
  const startDateChange = (value) => {
    setSelectedDateStart(value.format("YYYY-MM-DD"))
  }

  const startTimeChange = (value) => {
    setSelectedTimeStart(moment(value).format("HH:mm"))
  }

  const submitStartPickerHandler = () => {
    const now = moment(`${selectedDateStart} ${selectedTimeStart}`).format()
    setSaleData({
      ...saleData,
      start: now,
    })
    setStart(now)
    setStartPicker(false)
  }

  // end pickers submit handler
  const endDateChange = (value) => {
    setSelectedDateEnd(value.format("YYYY-MM-DD"))
  }

  const endTimeChange = (value) => {
    setSelectedTimeEnd(moment(value).format("HH:mm"))
  }

  const submitEndPickerHandler = () => {
    const now = moment(`${selectedDateEnd} ${selectedTimeEnd}`).format()
    setSaleData({
      ...saleData,
      end: now,
    })
    setEnd(now)
    setEndPicker(false)
  }

  const getCurrentAsset = async () => {
    const url = `${config.url_NFTnize}/nft/${asset}`
    const res = await httpservice.get(url, {})
    return res.data?.item
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)

    getCurrentAsset().then((item) => {
      getDataIPFS(item.tokenURI, setsetItemURI, true)
      getBids(item.id).then((bids) => {
        setBids(bids.items)
      })
      setcurrentAsset(item)
    })

    Isfollow().then((user) => {
      if (user?.isFollowed) {
        settextbuttonFollow("Unfollow")
      } else {
        settextbuttonFollow("Follow")
      }
    })
  }, [])

  useEffect(() => {
    if (saleModal === false) {
      setSaleStep(0)
    }
  }, [saleModal])

  useEffect(() => {
    if (saleStep === 1) {
      console.log(start, "0")
    }
  }, [saleStep])

  useEffect(() => {
    const now = moment().format()
    if (saleData.start === "-1") {
      setSaleData({
        ...saleData,
        start: now,
      })
      setStartPicker(true)
      setStart(now)
    } else {
      setStart(saleData.start)
    }
  }, [saleData.start])

  useEffect(() => {
    const now = moment().format()
    if (saleData.end === "-1") {
      setSaleData({
        ...saleData,
        end: now,
      })
      setEndPicker(true)
      setEnd(now)
    } else {
      setEnd(saleData.end)
    }
  }, [saleData.end])

  useEffect(() => {
    if (startPicker === true) {
      setSelectedDateStart(moment().format("YYYY-MM-DD"))
      setSelectedTimeStart(moment().format("HH:mm"))
    }
  }, [startPicker])

  useEffect(() => {
    if (endPicker === true) {
      setSelectedDateEnd(moment().format("YYYY-MM-DD"))
      setSelectedTimeEnd(moment().format("HH:mm"))
    }
  }, [endPicker])

  const handleValidateForm = () => {
    if (saleStep === 2) {
      // price validation
      if (saleData.price.length === 0) {
        validList.price.error = true
      } else if (saleData.price === 0) {
        validList.price.error = true
      } else {
        validList.price.error = false
      }
      // start validation
      if (saleData.start.length === 0) {
        validList.start.error = true
      } else if (saleData.start === 0) {
        validList.start.error = true
      } else {
        validList.start.error = false
      }
      // end validation
      if (saleData.end.length === 0) {
        validList.end.error = true
      } else if (saleData.end === 0) {
        validList.end.error = true
      } else {
        validList.end.error = false
      }
    }
  }

  const getBids = async (id) => {
    const URL = `${config.url_NFTnize}/bid/${id}` // just for test and later this url change from env
    const postdata = await httpservice.get(URL, {})
    return postdata.data
  }

  const submitTimeAuction = async () => {
    setErrorStyle(false)
    const array = []
    handleValidateForm()
    Object.values(validList).forEach((fields) => {
      array.push(fields.error)
    })
    if (array.indexOf(true) !== -1) {
      console.log(validList)
      console.log(errorStyle)
      showMessage({
        text: "Please check you entered all inputs!",
        color: "error",
      })
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      let inStart
      let inEnd
      if (saleData.start === "Right after listing") {
        inStart = moment().unix()
      } else if (saleData.start.length === 0) {
        inStart = ""
      } else {
        inStart = moment(start).unix()
      }

      if (saleData.end === "1") {
        inEnd = moment().add(1, "days").unix()
      } else if (saleData.end === "3") {
        inEnd = moment().add(3, "days").unix()
      } else if (saleData.end === "5") {
        inEnd = moment().add(5, "days").unix()
      } else if (saleData.end === "7") {
        inEnd = moment().add(7, "days").unix()
      } else if (saleData.end.length === 0) {
        inEnd = ""
      } else {
        inEnd = moment(end).unix()
      }
      const formData = {
        ...saleData,
        start: inStart,
        end: inEnd,
      }
      console.log(formData)
      setProgressLoading(true)
      setProgress({ status: 20, note: "Start sale process..." })
      if (currentAsset?.tokenType === "ERC721") {
        const priceToWei = library.utils.toWei(saleData.price, "ether")
        await IsApprove(
          account,
          currentAsset?.blockchain === "Eth"
            ? config.marketContractAddressETH
            : config.marketContractAddressMATIC,
          setProgress,
          currentAsset?.Collection?.contractAddress,
          library,
          currentAsset?.amount
        )
        const marketItem = await addToMarketDecenterlize(
          setProgress,
          currentAsset?.Collection?.contractAddress,
          currentAsset?.tokenId,
          priceToWei,
          config.ETHAddress,
          currentAsset.amount,
          formData.start,
          formData.end,
          currentAsset?.blockchain === "Eth"
            ? config.marketContractAddressETH
            : config.marketContractAddressMATIC,
          library,
          account
        )

        setProgress({ status: 90, note: "Caching data ..." })

        await updateNFTFromServer(
          marketItem,
          saleData.price,
          formData.start,
          formData.end
        ).then((result) => result)

        setProgress({ status: 100, note: "Complete!" })
        setProgressLoading(false)
      } else {
        setTimeout(() => {
          setProgress({ status: 100, note: "Process invalid!" })
          setProgressLoading(false)
        }, 3800)
      }
    }
  }

  const handleRemoveFromSale = async () => {
    let contractAddressmarketPlace
    if (currentAsset?.blockchain === "Eth") {
      contractAddressmarketPlace = config.marketContractAddressETH
    } else {
      contractAddressmarketPlace = config.marketContractAddressMATIC
    }

    await deleteItemMarket(
      contractAddressmarketPlace,
      currentAsset?.marketItemId,
      currentAsset?.amount,
      account,
      library
    )

    await removeFromSaleServer()

    setcurrentAsset({ ...currentAsset, put_on_marketplace: false })
  }

  const acceptBidToServer = async (dataItem) => {
    const URL = `${config.url_NFTnize}/bid/` // just for test and later this url change from env
    const postdata = await httpservice.put(URL, {
      id: dataItem.id,
      bidder: dataItem.bidder,
      nft_id: dataItem.nft_id,
      priceBid: dataItem.priceBid,
      seller: account,
    })
    return postdata.data
  }

  const saveTransactionToserver = async (from, to, price, nftId) => {
    const URL = `${config.url_NFTnize}/transaction/` // just for test and later this url change from env
    const postdata = await httpservice.post(URL, {
      from,
      to,
      price,
      nft_id: nftId,
    })
    return postdata.data
  }

  const saveBidToserver = async (bidder, priceBid, nftId, bidItemMarket) => {
    const URL = `${config.url_NFTnize}/bid/` // just for test and later this url change from env
    const postdata = await httpservice.post(URL, {
      bidder,
      priceBid,
      nft_id: nftId,
      bidItemMarket,
    })
    return postdata.data
  }

  const acceptBid = async (bidItem) => {
    const MarketPlaceContract = new library.eth.Contract(
      ContractMarketABI,
      config.marketContractAddressETH
    )
    const { methods: marketMethods } = MarketPlaceContract
    setAuctionProgress(true)
    setAuctionProgress({
      status: 20,
      note: "Accept bid ...",
    })
    await marketMethods
      .acceptBidByOwner(bidItem.bidItemMarket)
      .send({ from: account })
      .then((result) => console.log("Accepted Bid by owner", result))
    setAuctionProgress({
      status: 90,
      note: "Caching data ...",
    })
    await acceptBidToServer(bidItem).then((result) => {
      console.log("Result Accept bid in server", result)
    })
    setAuctionProgress(true)
    setAuctionProgress({
      status: 100,
      note: "Complete!",
    })
  }

  const handleBuyItemFromMarket = async () => {
    setAuctionLoading(true)
    setAuctionProgress({
      status: 20,
      note: "start for buy...",
    })
    let contractMarketAddress
    if (currentAsset?.blockchain === "Plg") {
      contractMarketAddress = config.marketContractAddressMATIC
    } else if (currentAsset?.blockchain === "Eth") {
      contractMarketAddress = config.marketContractAddressETH
    }
    const ConractMarketPlace = new library.eth.Contract(
      ContractMarketABI,
      contractMarketAddress
    )

    const gasLimit = await library.eth.getBlock("latest").gasLimit
    const gasPrice = await library.eth.getBlock("latest").gasUsed

    const { methods: methodsMarketPlace } = ConractMarketPlace

    if (currentAsset?.tokenType === "ERC721") {
      setAuctionProgress({
        status: 50,
        note: "Buy Item ERC721...",
      })
      await methodsMarketPlace
        .createMarketSaleERC721(
          currentAsset?.Collection.contractAddress,
          currentAsset?.marketItemId
        )
        .send({
          from: account,
          value: library.utils.toWei(currentAsset?.price, "ether"),
        })
        .then(async (result) => result)
      setAuctionProgress({
        status: 90,
        note: "Caching Data...",
      })
      const saveTransaction = await saveTransactionToserver(
        currentAsset?.owner,
        account,
        currentAsset?.price,
        currentAsset?.id
      )
    } else if (currentAsset?.tokenType === "ERC1155") {
      setAuctionProgress({
        status: 50,
        note: "Buy Item ERC1155...",
      })
      await methodsMarketPlace
        .createMarketSaleERC1155(
          currentAsset?.Collection.contractAddress,
          currentAsset?.marketItemId,
          currentAsset?.amount
        )
        .send({
          from: account,
          value: library.utils.toWei(currentAsset?.price, "ether"),
        })
        .then((result) => result)
      setAuctionProgress({
        status: 90,
        note: "Caching Data...",
      })
      const saveTransaction = await saveTransactionToserver(
        currentAsset?.owner,
        account,
        currentAsset?.price,
        currentAsset?.id
      )
    }
    setAuctionProgress({
      status: 100,
      note: "Complete!",
    })
    setAuctionProgress(false)
  }

  const removeFromSaleServer = async () => {
    const url = `${config.url_NFTnize}/user/`
    const res = await httpservice.delete(url, {
      params: {
        id: currentAsset?.id,
        put_on_marketplace: false,
      },
    })
    return res.data
  }

  const updateNFTFromServer = async (marketItemId, price, Start, End) => {
    const url = `${config.url_NFTnize}/nft`
    const res = await httpservice.put(url, {
      update: { id: currentAsset.id, marketItemId },
      amount: currentAsset.amount,
      price,
      start: Start !== "" ? Start : 0,
      end: End !== "" ? End : 0,
    })
    return res.data
  }

  const setTransaction = async (from, to, price) => {
    const url = `${config.url_NFTnize}/transaction`
    const res = await httpservice.post(url, {
      from,
      to,
      price,
      nft_id: currentAsset?.id,
    })
    return res.data
  }

  const burnItem = async (ItemId, auth) => {
    const url = `${config.url_NFTnize}/nft`
    const res = await httpservice.delete(url, {
      headers: {
        sign: auth.sign,
        account: auth.account,
      },
      data: {
        id: ItemId,
      },
    })
    return res.data
  }

  const handleSubmitFixedPrice = async () => {
    if (saleData.price.length > 0) {
      setFixedPriceError(false)
      setProgressLoading(true)
      setProgress({ status: 38, note: "Start for sale..." })
      const priceToWei = library.utils.toWei(saleData.price, "ether")

      await IsApprove(
        account,
        currentAsset?.blockchain === "Eth"
          ? config.marketContractAddressETH
          : config.marketContractAddressMATIC,
        setProgress,
        currentAsset?.Collection?.contractAddress,
        library,
        currentAsset?.amount
      )
      const marketItem = await addToMarketDecenterlize(
        setProgress,
        currentAsset?.Collection?.contractAddress,
        currentAsset?.tokenId,
        priceToWei,
        config.ETHAddress,
        currentAsset.amount,
        0,
        0,
        currentAsset?.blockchain === "Eth"
          ? config.marketContractAddressETH
          : config.marketContractAddressMATIC,
        library,
        account
      )

      setProgress({ status: 90, note: "Caching data ..." })

      await updateNFTFromServer(marketItem, saleData.price, 0, 0).then(
        (result) => result
      )

      setProgress({ status: 100, note: "Complete!" })
      setProgressLoading(false)
    } else if (saleData.price.length === 0) {
      setFixedPriceError(true)
    }
  }

  const handleTransferToken = async () => {
    if (transferAddress.length > 0) {
      setTransferError(false)
      setTransferLoading(true)
      setTransferProgress({ status: 40, note: "Start for transfer..." })

      if (currentAsset.tokenType === "ERC1155") {
        await TransferNFT(
          account,
          transferAddress,
          currentAsset?.tokenId,
          currentAsset?.amount,
          library,
          currentAsset?.Collection?.contractAddress,
          setTransferProgress
        )
      } else {
        await TransferNFT(
          account,
          transferAddress,
          currentAsset?.tokenId,
          0,
          library,
          currentAsset?.Collection?.contractAddress,
          setTransferProgress
        )
      }
      setTransferProgress({ status: 90, note: "Caching data..." })
      await setTransaction(account, transferAddress, 0)
      setTransferProgress({ status: 100, note: "Complete !" })
      setTransferLoading(false)
    } else if (transferAddress.length === 0) {
      setTransferError(true)
    }
  }

  const handleBurnToken = async () => {
    setBurnLoading(true)
    setBurnProgress({ status: 40, note: "Verify User..." })

    const auth = await signMessage(account, library)

    await BurnNFT(
      account,
      currentAsset?.tokenId,
      currentAsset?.amount,
      library,
      currentAsset.Collection.contractAddress,
      setBurnProgress
    )

    setBurnProgress({ status: 90, note: "Cachin data..." })

    await burnItem(currentAsset?.id, auth)

    setBurnProgress({ status: 100, note: "Complete!" })
    setBurnLoading(false)
  }
  const submitBidModal = async (e) => {
    e.preventDefault()
    setPlaceBidLoading(true)
    setPlaceBidProgress({
      status: 20,
      note: "Start the bid...",
    })

    setPlaceBidProgress({
      status: 45,
      note: "Approve your WETH...",
    })

    const WETHContract = new library.eth.Contract(ERC20ABI, config.WETHAddress)
    const MarketPlaceContract = new library.eth.Contract(
      ContractMarketABI,
      config.marketContractAddressETH
    )
    const { methods: WETHmethods } = WETHContract
    const { methods: marketMethods } = MarketPlaceContract
    let contractMarket
    if (currentAsset?.blockchain === "Eth") {
      contractMarket = config.marketContractAddressETH
    } else if (currentAsset?.blockchain === "Plg") {
      contractMarket = config.marketContractAddressMATIC
    }

    const priceTowei = library.utils.toWei(placebidValue, "ether")

    await WETHmethods.approve(contractMarket, priceTowei)
      .send({ from: account })
      .then((result) => console.log("result approve Weth", result))

    setPlaceBidProgress({
      status: 65,
      note: "Add your bid...",
    })

    await marketMethods
      .addBidToNFT(
        currentAsset?.marketItemId,
        currentAsset?.tokenId,
        priceTowei,
        currentAsset?.Collection.contractAddress
      )
      .send({ from: account })
      .then((result) => console.log("result approve Weth", result))

    const BidItemId = await marketMethods
      .LastIdBidsItem()
      .call()
      .then((result) => result)

    saveBidToserver(account, placebidValue, currentAsset?.id, BidItemId).then(
      (value) => {
        setPlaceBidLoading(false)
        setPlaceBidProgress({
          status: 100,
          note: "Complete!",
        })
        setPlaceBidModal(false)
      }
    )
  }

  return (
    <div
      className={
        rootTheme === "dark"
          ? "mv-dark-landing mv-landing"
          : "mv-light-landing mv-landing"
      }
    >
      <Header />
      <div
        className={`mv-detail ${
          rootTheme === "light" ? "mv-detail-light" : ""
        }`}
      >
        <div>
          <div onClick={() => setFullScreenModal(true)}>
            <img src={`${config.IPFS}/${currentAsset?.fileURL}`} alt="nft" />
          </div>
        </div>
        {/* place bid modal */}
        <Modal
          visible={placeBidModal}
          onCancel={() => setPlaceBidModal(false)}
          onOk={() => setPlaceBidModal(false)}
          width={360}
          closable={false}
          bodyStyle={{
            padding: "0",
            background: "white",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <form onSubmit={submitBidModal} className="mv-buy-bid-modal-body">
            <div>
              {/* {nftData.timeAuction === true ? "Bid On this" : "Buy this"} NFT */}
            </div>
            <div>
              <img src={`${config.IPFS}/${currentAsset?.fileURL}`} alt="nft" />
            </div>
            <div>
              {/* {nftData.timeAuction === true && (
                <div>Minimum bid {nft !== null ? nft.item.price : 0} ETH</div>
              )} */}
              <div>Minimum bid</div>
              <Input
                onChange={(e) => setplacebidValue(e.target.value)}
                required
                placeholder="7.70"
              />
              <div className="mv-buy-bid-modal-btn">
                <Button htmlType="submit">
                  {/* {nftData.timeAuction === true ? "Place bid" : "Buy"} */}
                  Place bid
                </Button>
              </div>
              <div>
                Bid will be held in escrow until there is a higher bid or the
                auction ends.
              </div>
              {placeBidLoading && (
                <div style={{ width: "100%" }}>
                  <p className={classes.progress__note}>
                    {placeBidProgress.note}
                  </p>
                  <div className={classes["mint-progress-bar"]}>
                    <div
                      className="mv-mint-progress-bar"
                      style={{ width: `${placeBidProgress.status}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </Modal>
        {/* fullscreen modal */}
        <Modal
          visible={fullScreenModal}
          closable={false}
          wrapClassName="mv-fullscreen-modal-wrapp"
          style={{
            width: "100vw",
            maxWidth: "100vw",
            padding: "0",
            top: "0",
            left: "0",
            backgroundColor: "transparent",
          }}
          bodyStyle={{
            width: "100vw",
            display: "flex",
            backgroundColor: "transparent",
            padding: "0",
            justifyContent: "center",
          }}
          onCancel={() => setFullScreenModal(false)}
        >
          <div
            className={`mv-fullscreen-modal ${
              rootTheme === "light" ? "mv-fullscreen-modal-light" : ""
            }`}
          >
            <img src={`${config.IPFS}/${currentAsset?.fileURL}`} alt="nft" />
            <button
              className={`mv-detail-modal-close ${
                rootTheme === "light" ? "mv-detail-modal-close-light" : ""
              }`}
              type="button"
              onClick={() => setFullScreenModal(false)}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6697 10.0797L7.59 6L11.6697 1.92034C12.1101 1.47989 12.1101 0.770793 11.6697 0.33034C11.2292 -0.110113 10.5201 -0.110113 10.0797 0.33034L6 4.41L1.92034 0.33034C1.47989 -0.110113 0.770793 -0.110113 0.33034 0.33034C-0.110113 0.770793 -0.110113 1.47989 0.33034 1.92034L4.41 6L0.33034 10.0797C-0.110113 10.5201 -0.110113 11.2292 0.33034 11.6697C0.770793 12.1101 1.47989 12.1101 1.92034 11.6697L6 7.59L10.0797 11.6697C10.5201 12.1101 11.2292 12.1101 11.6697 11.6697C12.107 11.2292 12.107 10.517 11.6697 10.0797Z"
                  fill="white"
                  fillOpacity="0.7"
                />
              </svg>
            </button>
          </div>
        </Modal>
        {/* burn modal */}
        <Modal
          closable={false}
          className="mv-mint-add-collection-modal-body"
          style={{
            padding: "0",
            top: "15vh",
            backgroundColor: "transparent",
          }}
          bodyStyle={{
            display: "flex",
            backgroundColor: "transparent",
            padding: "0",
            justifyContent: "center",
          }}
          visible={burnModal}
          onCancel={() => setBurnModal(false)}
        >
          <div
            className={`mv-detail-burn-modal ${
              rootTheme === "light" ? "mv-detail-burn-modal-light" : ""
            }`}
          >
            <div>Burn token</div>
            <div>
              Are you sure to burn this token? This action cannot be undone.
              Token will be transferred to zero address
            </div>
            <div>
              <Button onClick={() => handleBurnToken()}>Burn token</Button>
              <Button onClick={() => setBurnModal(false)}>Cancel</Button>
            </div>
            {/* progress bar */}
            {burnLoading && (
              <>
                <p className={classes.progress__note}>{burnProgress.note}</p>
                <div className={classes["mint-progress-bar"]}>
                  <div
                    className="mv-mint-progress-bar"
                    style={{ width: `${burnProgress.status}%` }}
                  />
                </div>
              </>
            )}
            <button
              className={`mv-detail-modal-close ${
                rootTheme === "light" ? "mv-detail-modal-close-light" : ""
              }`}
              type="button"
              onClick={() => setBurnModal(false)}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6697 10.0797L7.59 6L11.6697 1.92034C12.1101 1.47989 12.1101 0.770793 11.6697 0.33034C11.2292 -0.110113 10.5201 -0.110113 10.0797 0.33034L6 4.41L1.92034 0.33034C1.47989 -0.110113 0.770793 -0.110113 0.33034 0.33034C-0.110113 0.770793 -0.110113 1.47989 0.33034 1.92034L4.41 6L0.33034 10.0797C-0.110113 10.5201 -0.110113 11.2292 0.33034 11.6697C0.770793 12.1101 1.47989 12.1101 1.92034 11.6697L6 7.59L10.0797 11.6697C10.5201 12.1101 11.2292 12.1101 11.6697 11.6697C12.107 11.2292 12.107 10.517 11.6697 10.0797Z"
                  fill="white"
                  fillOpacity="0.7"
                />
              </svg>
            </button>
          </div>
        </Modal>
        {/* transfer modal */}
        <Modal
          closable={false}
          className="mv-mint-add-collection-modal-body"
          style={{
            padding: "0",
            top: "15vh",
            backgroundColor: "transparent",
          }}
          bodyStyle={{
            display: "flex",
            backgroundColor: "transparent",
            padding: "0",
            justifyContent: "center",
          }}
          visible={transferModal}
          onCancel={() => setTransferModal(false)}
        >
          <div
            className={`mv-detail-burn-modal ${
              rootTheme === "light" ? "mv-detail-burn-modal-light" : ""
            }`}
          >
            <div>Transfer token</div>
            <div>You can transfer tokens from your address to another</div>
            <div>
              <div>Receiver address</div>
              <Input
                className={transferError ? "mv-detail-input-error" : ""}
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                placeholder="Paste address"
              />
            </div>
            <div>
              <Button onClick={() => handleTransferToken()}>Continue</Button>
              <Button onClick={() => setTransferModal(false)}>Cancel</Button>
            </div>
            {/* progress bar */}
            {transferLoading && (
              <>
                <p className={classes.progress__note}>
                  {transferProgress.note}
                </p>
                <div className={classes["mint-progress-bar"]}>
                  <div
                    className="mv-mint-progress-bar"
                    style={{ width: `${transferProgress.status}%` }}
                  />
                </div>
              </>
            )}
            <button
              className={`mv-detail-modal-close ${
                rootTheme === "light" ? "mv-detail-modal-close-light" : ""
              }`}
              type="button"
              onClick={() => setTransferModal(false)}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6697 10.0797L7.59 6L11.6697 1.92034C12.1101 1.47989 12.1101 0.770793 11.6697 0.33034C11.2292 -0.110113 10.5201 -0.110113 10.0797 0.33034L6 4.41L1.92034 0.33034C1.47989 -0.110113 0.770793 -0.110113 0.33034 0.33034C-0.110113 0.770793 -0.110113 1.47989 0.33034 1.92034L4.41 6L0.33034 10.0797C-0.110113 10.5201 -0.110113 11.2292 0.33034 11.6697C0.770793 12.1101 1.47989 12.1101 1.92034 11.6697L6 7.59L10.0797 11.6697C10.5201 12.1101 11.2292 12.1101 11.6697 11.6697C12.107 11.2292 12.107 10.517 11.6697 10.0797Z"
                  fill="white"
                  fillOpacity="0.7"
                />
              </svg>
            </button>
          </div>
        </Modal>
        {/* put on sale modal */}
        <Modal
          closable={false}
          className="mv-mint-add-collection-modal-body"
          style={{
            padding: "0",
            top: "12vh",
            backgroundColor: "transparent",
          }}
          bodyStyle={{
            display: "flex",
            backgroundColor: "transparent",
            padding: "0",
            justifyContent: "center",
          }}
          visible={saleModal}
          onCancel={() => setSaleModal(false)}
        >
          <div
            className={`mv-detail-sale-modal ${
              rootTheme === "light" ? "mv-detail-sale-modal-light" : ""
            }`}
          >
            <div>
              {saleStep === 0 && "Put on sale"}
              {saleStep === 1 && "Fixed price"}
              {saleStep === 2 && "Timed auction"}
            </div>
            <div>
              {saleStep === 0 && "Choose sale type"}
              {saleStep === 1 &&
                "Enter new price. Your NFT will be pushed in top of marketplace"}
              {saleStep === 2 && ""}
            </div>
            {/* choose type */}
            {saleStep === 0 && (
              <div
                className={`mv-detail-sale-modal-step-zero ${
                  rootTheme === "light"
                    ? "mv-detail-sale-modal-step-zero-light"
                    : ""
                }`}
              >
                <button onClick={() => setSaleStep(1)} type="button">
                  <span>Fixed Price</span>
                  {rootTheme === "light" ? (
                    <img src={priceBlack} alt="time auction" />
                  ) : (
                    <img src={priceWhite} alt="time auction" />
                  )}
                </button>
                <button onClick={() => setSaleStep(2)} type="button">
                  <span>Timed Auction</span>
                  {rootTheme === "light" ? (
                    <img src={timeBlack} alt="time auction" />
                  ) : (
                    <img src={timeWhite} alt="time auction" />
                  )}
                </button>
              </div>
            )}
            {/* fixed price */}
            {saleStep === 1 && (
              <div
                className={`mv-detail-sale-modal-step-one ${
                  rootTheme === "light"
                    ? "mv-detail-sale-modal-step-one-light"
                    : ""
                }`}
                id={fixedPriceError ? "mv-detail-wrapper-error" : ""}
              >
                <div>
                  <Input
                    suffix={<PriceLabel title="ETH" />}
                    className={`mv-mint-field-input ${
                      rootTheme === "light" ? "mv-mint-field-input-light" : ""
                    }`}
                    onChange={(e) =>
                      setSaleData({ ...saleData, price: e.target.value })
                    }
                  />
                </div>
                <div>
                  <div>Service fee</div>
                  <div>2.5%</div>
                </div>
                <div>
                  <div>You will receive</div>
                  <div>0 ETH</div>
                </div>
                <div>
                  <Button onClick={() => handleSubmitFixedPrice()}>
                    Next step
                  </Button>
                  <Button onClick={() => setSaleModal(false)}>Cancel</Button>
                </div>
                {progressLoading && (
                  <>
                    <p className={classes.progress__note}>{progress.note}</p>
                    <div className={classes["mint-progress-bar"]}>
                      <div
                        className="mv-mint-progress-bar"
                        style={{ width: `${progress.status}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            {/* timed auction price */}
            {saleStep === 2 && (
              <div
                className={`mv-detail-sale-modal-step-two ${
                  rootTheme === "light"
                    ? "mv-detail-sale-modal-step-two-light"
                    : ""
                }`}
              >
                {/* Minimum Price field */}
                <div
                  className={`mv-mint-field-wrapper ${
                    rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                  }`}
                  id={
                    errorStyle && validList.price.error === true
                      ? "mv-error-border-red-select"
                      : ""
                  }
                >
                  <div>
                    Minimum Price
                    {errorStyle === true && validList.price.error === true && (
                      <span className="mv-mint-error-text">
                        You must enter a price.
                      </span>
                    )}
                    <span> </span>
                  </div>
                  <Input
                    onChange={(e) =>
                      setSaleData({
                        ...saleData,
                        price: e.target.value,
                      })
                    }
                    suffix={<PriceLabel title="wETH" />}
                    className={`mv-mint-field-input ${
                      rootTheme === "light" ? "mv-mint-field-input-light" : ""
                    }`}
                  />
                </div>
                {/* Starting Bid */}
                <div
                  className={`mv-mint-field-wrapper ${
                    rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                  }`}
                  id={
                    errorStyle && validList.start.error === true
                      ? "mv-error-border-red-select"
                      : ""
                  }
                >
                  <div>
                    Starting Bid
                    {errorStyle === true && validList.start.error === true && (
                      <span className="mv-mint-error-text">
                        You must select a date to start.
                      </span>
                    )}
                  </div>
                  <Select
                    value={
                      start.length > 0 && start !== "Right after listing"
                        ? moment(start).format("DD/MM/YYYY HH:mm")
                        : start
                    }
                    onChange={(value) =>
                      setSaleData({ ...saleData, start: value })
                    }
                    suffixIcon={<SelectArrow />}
                    className={`mv-mint-field-input ${
                      rootTheme === "light" ? "mv-mint-field-input-light" : ""
                    }`}
                  >
                    <Option value="Right after listing">
                      Right after listing
                    </Option>
                    <Option value="-1">Pick specific date</Option>
                  </Select>
                </div>
                {/* Expire bid */}
                <div
                  className={`mv-mint-field-wrapper ${
                    rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                  }`}
                  id={
                    errorStyle && validList.end.error === true
                      ? "mv-error-border-red-select"
                      : ""
                  }
                >
                  <div>
                    Expire Bid
                    {errorStyle === true && validList.end.error === true && (
                      <span className="mv-mint-error-text">
                        You must select a date to expire.
                      </span>
                    )}
                  </div>
                  <Select
                    value={
                      end.length > 0 &&
                      end !== "1" &&
                      end !== "3" &&
                      end !== "5" &&
                      end !== "7"
                        ? moment(end).format("DD/MM/YYYY HH:mm")
                        : end
                    }
                    onChange={(value) =>
                      setSaleData({ ...saleData, end: value })
                    }
                    suffixIcon={<SelectArrow />}
                    className={`mv-mint-field-input ${
                      rootTheme === "light" ? "mv-mint-field-input-light" : ""
                    }`}
                  >
                    <Option value="1">1 Day</Option>
                    <Option value="3">3 Day</Option>
                    <Option value="5">5 Day</Option>
                    <Option value="7">7 Day</Option>
                    <Option value="-1">Pick specific date</Option>
                  </Select>
                </div>
                <Button
                  disabled={auctionLoading}
                  style={auctionLoading ? { opacity: ".5" } : { opacity: "1" }}
                  onClick={submitTimeAuction}
                >
                  Start auction
                </Button>
                {/* progress bar */}
                {auctionLoading && (
                  <>
                    <p className={classes.progress__note}>
                      {auctionProgress.note}
                    </p>
                    <div className={classes["mint-progress-bar"]}>
                      <div
                        className="mv-mint-progress-bar"
                        style={{ width: `${auctionProgress.status}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
            {saleStep === 0 && (
              <Button onClick={() => setSaleModal(false)}>Cancel</Button>
            )}
            <button
              className={`mv-detail-modal-close ${
                rootTheme === "light" ? "mv-detail-modal-close-light" : ""
              }`}
              type="button"
              onClick={() => setSaleModal(false)}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.6697 10.0797L7.59 6L11.6697 1.92034C12.1101 1.47989 12.1101 0.770793 11.6697 0.33034C11.2292 -0.110113 10.5201 -0.110113 10.0797 0.33034L6 4.41L1.92034 0.33034C1.47989 -0.110113 0.770793 -0.110113 0.33034 0.33034C-0.110113 0.770793 -0.110113 1.47989 0.33034 1.92034L4.41 6L0.33034 10.0797C-0.110113 10.5201 -0.110113 11.2292 0.33034 11.6697C0.770793 12.1101 1.47989 12.1101 1.92034 11.6697L6 7.59L10.0797 11.6697C10.5201 12.1101 11.2292 12.1101 11.6697 11.6697C12.107 11.2292 12.107 10.517 11.6697 10.0797Z"
                  fill="white"
                  fillOpacity="0.7"
                />
              </svg>
            </button>
          </div>
        </Modal>
        {/* start picker */}
        <Modal
          visible={startPicker}
          footer={[]}
          closable={false}
          width={360}
          bodyStyle={{
            display: "flex",
            boxShadow: "none",
            justifyContent: "center",
          }}
          onCancel={() => setStartPicker(false)}
        >
          <div className="mv-mint-picker-modal">
            <div className="mv-mint-picker-modal-calendar">
              <Calendar fullscreen={false} onChange={startDateChange} />
            </div>
            <div>
              <TimePicker defaultValue={moment()} onChange={startTimeChange} />
            </div>
            <Button onClick={submitStartPickerHandler}>Apply</Button>
          </div>
        </Modal>
        {/* end picker */}
        <Modal
          visible={endPicker}
          footer={[]}
          closable={false}
          width={360}
          bodyStyle={{
            display: "flex",
            boxShadow: "none",
            justifyContent: "center",
          }}
          onCancel={() => setEndPicker(false)}
        >
          <div className="mv-mint-picker-modal">
            <div className="mv-mint-picker-modal-calendar">
              <Calendar fullscreen={false} onChange={endDateChange} />
            </div>
            <div>
              <TimePicker defaultValue={moment()} onChange={endTimeChange} />
            </div>
            <Button onClick={submitEndPickerHandler}>Apply</Button>
          </div>
        </Modal>
        <div>
          {/* left section */}
          <div>
            <div>{currentAsset?.displayName}</div>
            <div>
              <svg
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.98969 0V2.01031H2.01031V16.0206H16.0206V11.0103H18.0309V17.0103C18.0309 17.567 17.5979 18 17.0412 18H0.989691C0.43299 18 0 17.567 0 17.0103V0.989691C0 0.43299 0.43299 0 0.989691 0H6.98969ZM14.567 2.01031H9.98969V0H18V8.01031H15.9897V3.40206L9 10.4227L7.57732 9L14.567 2.01031Z"
                  fill="white"
                />
              </svg>
              Mint , charles 4,2022
            </div>
            <div>
              <div>
                <div>Created by</div>
                <Popover content={creatorModal} title="" placement="right">
                  <div
                    onClick={() =>
                      history.push(
                        `/profile/${currentAsset?.creator}?type=sale`
                      )
                    }
                  >
                    {currentAsset && currentAsset?.nft_creator?.avatar ? (
                      <img
                        src={`${config.url_NFTnize.replace(
                          "/api/v1",
                          "/static"
                        )}/${currentAsset?.nft_creator?.avatar}`}
                        width={25}
                        height={25}
                        alt="profile avatar"
                      />
                    ) : (
                      <img
                        src={avatarIcon}
                        style={{ marginRight: "10px" }}
                        height={25}
                        width={25}
                        alt="no"
                      />
                    )}
                    {currentAsset?.creator?.substr(0, 15)} ...
                  </div>
                </Popover>
              </div>
              <div>
                <div>Collection</div>
                <Popover content={collectionModal} title="" placement="right">
                  <div
                    onClick={() =>
                      history.push(
                        `/collection/${currentAsset?.Collection?.contractAddress}?type=sale`
                      )
                    }
                  >
                    {currentAsset && currentAsset?.Collection?.image_url ? (
                      <img
                        src={loadImageFromIPFS(
                          currentAsset?.Collection?.image_url
                        )}
                        style={{ marginRight: "10px" }}
                        alt="profile avatar"
                        width={25}
                        height={25}
                      />
                    ) : (
                      <img
                        src={avatarIcon}
                        style={{ marginRight: "10px" }}
                        height={25}
                        width={25}
                        alt="no"
                      />
                    )}
                    {currentAsset?.Collection?.contractAddress?.substr(0, 15)}{" "}
                    ...
                  </div>
                </Popover>
              </div>
            </div>
          </div>
          {/* right section */}
          <div>
            <div>
              <div>
                <div>
                  <div>Current bid</div>
                  <div>
                    {currentAsset?.price?.substr(0, 15)}{" "}
                    {currentAsset?.blockchain === "Eth"
                      ? currentAsset.start !== 0
                        ? "WETH"
                        : "ETH"
                      : "MATIC"}
                  </div>
                </div>

                {currentAsset?.timeAuction && (
                  <>
                    {" "}
                    <div>
                      <div>
                        {currentAsset?.start * 1000 > nowTime
                          ? "Auction starts in"
                          : "Auction ends in"}
                      </div>
                      <div>
                        {currentAsset?.start * 1000 > nowTime ? (
                          <>
                            <Countdown
                              renderer={TimerRenderer}
                              date={
                                Date.now() +
                                (currentAsset?.start * 1000 - nowTime)
                              }
                            />
                          </>
                        ) : currentAsset?.end * 1000 - nowTime > 0 &&
                          currentAsset?.start * 1000 < nowTime ? (
                          <>
                            <Countdown
                              renderer={TimerRenderer}
                              date={
                                Date.now() +
                                (currentAsset?.end * 1000 - nowTime)
                              }
                            />
                          </>
                        ) : (
                          <>
                            {" "}
                            <div>Ended</div>
                          </>
                        )}
                      </div>{" "}
                    </div>
                  </>
                )}
              </div>
              <div>
                <div>
                  {currentAsset && currentAsset?.nft_owner?.avatar ? (
                    <img
                      src={`${config.url_NFTnize.replace(
                        "/api/v1",
                        "/static"
                      )}/${currentAsset?.nft_owner?.avatar}`}
                      width={25}
                      height={25}
                      alt="profile avatar"
                    />
                  ) : (
                    <img
                      src={avatarIcon}
                      style={{ marginRight: "10px" }}
                      height={25}
                      width={25}
                      alt="creator"
                    />
                  )}
                  {currentAsset?.owner?.substr(0, 4)} ...
                </div>
                <div>
                  {/* <Button>
                    <span>Place Bid</span>
                  </Button> */}
                  {currentAsset?.put_on_marketplace &&
                  currentAsset?.owner?.toLowerCase() ===
                    account.toLowerCase() ? (
                    <>
                      <Button onClick={() => handleRemoveFromSale()}>
                        <span>Remove from sale</span>
                      </Button>
                    </>
                  ) : account.toLowerCase() ===
                    currentAsset?.owner?.toLowerCase() ? (
                    <>
                      <Button onClick={() => setSaleModal(true)}>
                        <span>Put on sale</span>
                      </Button>
                      <Button onClick={() => setTransferModal(true)}>
                        <span>Transfer</span>
                      </Button>
                    </>
                  ) : (
                    currentAsset?.put_on_marketplace &&
                    (currentAsset?.timeAuction ? (
                      <>
                        {" "}
                        <Button onClick={() => setPlaceBidModal(true)}>
                          <span>Place a bid</span>
                        </Button>{" "}
                      </>
                    ) : (
                      <>
                        {" "}
                        <Button onClick={() => handleBuyItemFromMarket()}>
                          <span>Buy Now</span>
                        </Button>{" "}
                      </>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div>
              <div>Owned by</div>
              <Popover content={ownerModal} title="" placement="left">
                <div
                  onClick={() =>
                    history.push(`/profile/${currentAsset?.owner}`)
                  }
                >
                  {currentAsset && currentAsset?.nft_owner?.avatar ? (
                    <img
                      src={`${config.url_NFTnize.replace(
                        "/api/v1",
                        "/static"
                      )}/${currentAsset?.nft_owner?.avatar}`}
                      width={25}
                      height={25}
                      alt="profile avatar"
                    />
                  ) : (
                    <img
                      src={avatarIcon}
                      style={{ marginRight: "10px" }}
                      height={25}
                      width={25}
                      alt="no"
                    />
                  )}
                  {currentAsset?.owner?.substr(0, 15)} ...
                </div>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      {acceptLoading && (
        <div style={{ width: "100%", margin: "50px 0", padding: "0 40px" }}>
          <p className={classes.progress__note}>{acceptProgress.note}</p>
          <div className={classes["mint-progress-bar"]}>
            <div
              className="mv-mint-progress-bar"
              style={{ width: `${acceptProgress.status}%` }}
            />
          </div>
        </div>
      )}

      {/* desc */}
      <div
        className={`mv-detail-desc-sec ${
          rootTheme === "light" ? "mv-detail-desc-sec-light" : ""
        }`}
      >
        <div>
          <div
            className={`mv-detail-desc-div ${
              rootTheme === "light" ? "mv-detail-desc-div-light" : ""
            }`}
          >
            <div>Description</div>
            <div>{setItemURI.description}</div>
          </div>
          <div
            className={`mv-detail-desc-div ${
              rootTheme === "light" ? "mv-detail-desc-div-light" : ""
            }`}
          >
            <div>Details</div>
            <div
              className={`mv-detail-desc-div-second ${
                rootTheme === "light" ? "mv-detail-desc-div-second-light" : ""
              }`}
            >
              <div>
                {rootTheme === "light" ? (
                  <img src={detailChartBlack} alt="chart" />
                ) : (
                  <img src={detailChartWhite} alt="chart" />
                )}
                View on Etherscan
              </div>
              <div>
                <svg
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17 5L9 1L1 5M17 5L9 9M17 5V15L9 19M1 5L9 9M1 5V15L9 19M9 9V19"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                View on Etherscan
              </div>
            </div>
          </div>
          <div>
            <Button>
              <span>
                <svg
                  width="18"
                  height="21"
                  viewBox="0 0 18 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18 9.41421V18.4142C18 19.5188 17.1046 20.4142 16 20.4142H2C0.89543 20.4142 0 19.5188 0 18.4142V9.41421H2V18.4142H16V9.41421H18ZM10 3.82843V14.4142H8V3.82843L4.70711 7.12132L3.29289 5.70711L9 0L14.7071 5.70711L13.2929 7.12132L10 3.82843Z"
                    fill="white"
                  />
                </svg>
              </span>
            </Button>
            {account.toLowerCase() === currentAsset?.owner?.toLowerCase() && (
              <>
                {" "}
                <Popover
                  placement="right"
                  content={PopoverMenu}
                  trigger="click"
                >
                  <Button>
                    <span>
                      <svg
                        width="18"
                        height="4"
                        viewBox="0 0 18 4"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                        <circle cx="9" cy="2" r="2" fill="#C4C4C4" />
                        <circle cx="16" cy="2" r="2" fill="#C4C4C4" />
                      </svg>
                    </span>
                  </Button>
                </Popover>{" "}
              </>
            )}
          </div>
        </div>
        {currentAsset?.timeAuction && (
          <div
            className={`mv-detail-desc-div ${
              rootTheme === "light" ? "mv-detail-desc-div-light" : ""
            }`}
          >
            <div>Provenance</div>
            <div
              className={`mv-detail-desc-div-list ${
                rootTheme === "light" ? "mv-detail-desc-div-list-light" : ""
              }`}
            >
              <div>
                <div>
                  <img src={wolfImage} alt="avatar" />
                  <div>
                    Auction won by @{wonBidder?.bidder?.substr(0, 10)} Sold for{" "}
                    {wonBidder?.priceBid} WETH $2,477.38 <br />{" "}
                    <span>{wonBidder?.updatedAt}</span>
                  </div>
                </div>
                <div>
                  Auction Settled by @tonym{" "}
                  <svg
                    width="19"
                    height="18"
                    viewBox="0 0 19 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.98969 0V2.01031H2.01031V16.0206H16.0206V11.0103H18.0309V17.0103C18.0309 17.567 17.5979 18 17.0412 18H0.989691C0.43299 18 0 17.567 0 17.0103V0.989691C0 0.43299 0.43299 0 0.989691 0H6.98969ZM14.567 2.01031H9.98969V0H18V8.01031H15.9897V3.40206L9 10.4227L7.57732 9L14.567 2.01031Z"
                      fill="white"
                      fillOpacity="0.5"
                    />
                  </svg>
                </div>
              </div>
              {Bids.map((dd, index) => (
                <div
                  className={`mv-detail-desc-div-list-item ${
                    rootTheme === "light"
                      ? "mv-detail-desc-div-list-item-light"
                      : ""
                  }`}
                  key={index}
                >
                  <div>
                    <img src={wolfImage} alt="avatar" />
                    <div>
                      <span>Bid placed by {dd?.bidder}</span>
                      <span>{dd?.createdAt}</span>
                    </div>
                  </div>
                  <div>
                    {dd.priceBid} WETH{" "}
                    {currentAsset?.owner.toLowerCase() ===
                      account.toLowerCase() && (
                      <>
                        <button
                          onClick={() => acceptBid(dd)}
                          className="mv-accept-btn-bid-list"
                          type="button"
                        >
                          <img src={acceptIcon} alt="accept" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* more collections wrapp */}
      <div
        className={`mv-detail-desc-third ${
          rootTheme === "light" ? "mv-detail-desc-third-light" : ""
        }`}
      >
        <div>More from this collection</div>
        <div>
          <div>
            {rootTheme === "light" ? (
              <img src={miniProductLight} alt="product" />
            ) : (
              <img src={miniProduct} alt="product" />
            )}
            <div>B14th</div>
            <div># Charles Joni 245-548</div>
            <div>1000 NTFs</div>
            <div>
              <img src={avatarIcon} height={25} width={25} alt="avatar" />
              <div>@Artgallery</div>
            </div>
          </div>
          {/* other nfts */}
          <div
            className="mv-product-section-one-list mv-detail-grid-list"
            id="mv-detail-grid-list"
          >
            {productsOne &&
              productsOne.length > 0 &&
              productsOne
                .filter((item, index) => index < 3)
                .map((product, idx) => (
                  <div
                    key={idx}
                    className={
                      rootTheme === "light"
                        ? "mv-product-section-one-list-item-light"
                        : ""
                    }
                    id={loading === true ? "mv-product-item-loading" : ""}
                  >
                    {loading === true ? (
                      <Loading />
                    ) : (
                      <>
                        <div>{product.title}</div>
                        <img src={product.productImg} alt="product" />
                        <div>
                          {product.creatorImg ? (
                            <img
                              src={product.creatorImg}
                              alt="product creator"
                              style={{ marginRight: "10px" }}
                            />
                          ) : (
                            <img
                              src={avatarIcon}
                              alt="product creator"
                              height={25}
                              width={25}
                              style={{ marginRight: "10px" }}
                            />
                          )}
                          <span>{product.creatorName}</span>
                        </div>
                        <div
                          className={
                            rootTheme === "light"
                              ? "mv-product-section-one-list-item-light-titles"
                              : ""
                          }
                        >
                          <div>Current Bid</div>
                          <div>Ending In</div>
                        </div>
                        <div
                          className={
                            rootTheme === "light"
                              ? "mv-product-section-one-list-item-light-infos"
                              : ""
                          }
                        >
                          <div>
                            <img
                              style={{ marginRight: "5px" }}
                              src={bidWhite}
                              alt="bid"
                            />
                            {product.currentBid}
                          </div>
                          <div>{product.expire}</div>
                        </div>
                        <div
                          className={`mv-explore-buy-item-hover-cover ${
                            rootTheme === "light"
                              ? "mv-explore-buy-item-hover-cover-light"
                              : ""
                          }`}
                        >
                          <Button
                            className={`mv-landing-bid-btn ${
                              rootTheme === "light" &&
                              "mv-header-connect-btn-light"
                            }`}
                            // onClick={() => {
                            //   console.log(asset)
                            //   handleNavigateToNFT(
                            //     `/nft/detail/${asset?.Collection?.contractAddress}:${asset?.tokenId}`
                            //   )
                            // }}
                          >
                            <span>View NFT</span>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </div>
      <Snackbar
        text={snackbar.text}
        active={snackbar.isActive}
        color={snackbar.color}
        timeout={snackbar.timeout}
        onClose={() => setSnackbar({ ...snackbar, isActive: false })}
      />
      <Footer />
    </div>
  )
}
export default Body
