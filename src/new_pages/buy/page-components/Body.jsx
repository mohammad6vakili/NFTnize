import React, { useEffect, useState } from "react"
import "../page-assets/Buy.css"
import "../../mint/page-assets/Mint.css"
import ContractMarketABI from "utils/mint/abis/NFTMarketPlace_ABI.json"
import PaymentSplitterABI from "utils/mint/abis/PaymentSplitter.json"
import ERC20ABI from "utils/mint/abis/ERC20.json"
import { bytecodePaymentSplitter } from "utils/mint/abis/byteCodePaymentSplitter"
import { useWeb3React } from "@web3-react/core"
import { config } from "utils/config"
import Header from "../../landing/page-components/Header"
import Footer from "../../landing/page-components/Footer"
import classes from "../../create-nft/page-components/Form/Form.module.scss"
import { useSelector } from "react-redux"
import { useHistory, useLocation, useParams } from "react-router-dom"
import { MetaMask } from "utils/walletConnector/ETHConnector"
import { MetaMaskPolygon } from "utils/walletConnector/PolygonConnector"
import useWallet from "hooks/useWallet"
import Countdown from "react-countdown"
import Nfts from "../FakeData/Products"
import { Snackbar } from "../../../components/Snackbar/Snackbar"
import creatorImage from "../../landing/page-assets/creator.svg"
import productImage from "../../landing/page-assets/product-one.png"
import loadingBubbleAnimation from "new_assets/loadings/bubble.svg"
import acceptIcon from "../page-assets/accept.svg"
import declineIcon from "../page-assets/decline.svg"
import { Button, Modal, Input } from "antd"
import HttpService from "utils/httpService"

const Body = () => {
  const location = useLocation()
  const history = useHistory()
  const { connect, deactive } = useWallet()
  const param = useParams()
  const { active: connected, account, library } = useWeb3React()
  const { rootTheme } = useSelector((state) => state.application)
  const [modal, setModal] = useState(false)
  const [nft, setnft] = useState(null)
  const [now, setNow] = useState(Date.now())
  const [fullScreenModal, setFullScreenModal] = useState(false)
  const httpservice = new HttpService()
  const pinata = config.IPFS

  const snackbarInitValues = {
    isActive: false,
    text: "",
    color: "",
    timeout: 3000,
  }
  const [progress, setProgress] = useState({
    status: 0,
    note: "",
  })
  const [placeBidProgress, setPlaceBidProgress] = useState({
    status: 0,
    note: "",
  })
  const [snackbar, setSnackbar] = useState(snackbarInitValues)
  const [progressLoading, setProgressLoading] = useState(false)
  const [placeBidProgressLoading, setPlaceBidProgressLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [nftData, setNftData] = useState({})
  const [royalties, setroyalties] = useState([])
  const [list, setList] = useState([])
  const [nowTime, setNowTime] = useState(Date.now())
  const [placebidValue, setplacebidValue] = useState(0)

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

  const getNFTFromServer = async (id) => {
    const URL = `${config.url_NFTnize}/nft/${id}` // just for test and later this url change from env
    const postdata = await httpservice.get(URL, {})
    return postdata.data
  }

  const getBids = async (id) => {
    const URL = `${config.url_NFTnize}/bid/${id}` // just for test and later this url change from env
    const postdata = await httpservice.get(URL, {})
    return postdata.data
  }

  const acceptBidToServer = async (data) => {
    const URL = `${config.url_NFTnize}/bid/` // just for test and later this url change from env
    const postdata = await httpservice.put(URL, {
      id: data.id,
      bidder: data.bidder,
      nft_id: data.nft_id,
      priceBid: data.priceBid,
      seller: account,
    })
    return postdata.data
  }

  const getRoyaltiesOfNFT = async (id) => {
    const URL = `${config.url_NFTnize}/royalty/${id}` // just for test and later this url change from env
    const postdata = await httpservice.get(URL, {})
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

  const loadImageFromIPFS = (URI) => {
    const uri = URI.replace(/^ipfs?:\/\//, "")
    return `${pinata}${uri}`
  }

  useEffect(() => {
    const itemId = param.asset
    getNFTFromServer(itemId).then((result) => {
      console.log("resasdasdasult", result)
      getRoyaltiesOfNFT(result.item.id).then((items) => {
        items.Royalties.forEach((royalty) =>
          setroyalties((prevRoyalties) => [
            ...prevRoyalties,
            [
              royalty.address === "0" ? account : royalty.address,
              parseFloat(royalty.percentage) * 100,
              parseFloat(royalty.total) * 100,
            ],
          ])
        )
      })
      if (result.item.timeAuction) {
        getBids(result.item.id).then((bids) => {
          setList(bids.items)
        })
      }
      setnft(result)
    })
  }, [])

  const acceptBid = async (data) => {
    const MarketPlaceContract = new library.eth.Contract(
      ContractMarketABI,
      config.marketContractAddressETH
    )
    const { methods: marketMethods } = MarketPlaceContract

    await marketMethods
      .acceptBidByOwner(data.bidItemMarket)
      .send({ from: account })
      .then((result) => console.log("Accepted Bid by owner", result))

    await acceptBidToServer(data).then((result) => {
      console.log("Result Accept bid in server", result)
    })
  }

  const showMessage = ({ text, color, timeout }) => {
    setSnackbar({ isActive: true, text, color, timeout })
  }

  const handleCopyValue = (value) => {
    navigator.clipboard.writeText(value)
    showMessage({ text: "Copied to clipboard", color: "success" })
  }

  const handleBuyItemFromMarket = async () => {
    let contractMarketAddress
    if (nft.item.blockchain === "Plg") {
      contractMarketAddress = config.marketContractAddressMATIC
    } else if (nft.item.blockchain === "Eth") {
      contractMarketAddress = config.marketContractAddressETH
    }
    const ConractMarketPlace = new library.eth.Contract(
      ContractMarketABI,
      contractMarketAddress
    )

    const gasLimit = await library.eth.getBlock("latest").gasLimit
    const gasPrice = await library.eth.getBlock("latest").gasUsed

    const { methods: methodsMarketPlace } = ConractMarketPlace

    if (nft.item.tokenType === "ERC721") {
      await methodsMarketPlace
        .createMarketSaleERC721(
          nft.item.Collection.contractAddress,
          nft.item.marketItemId
        )
        .send({
          from: account,
          value: library.utils.toWei(nft.item.price, "ether"),
        })
        .then(async (result) => result)
      const saveTransaction = await saveTransactionToserver(
        nft.item.owner,
        account,
        nft.item.price,
        nft.item.id
      )
    } else if (nft.item.tokenType === "ERC1155") {
      await methodsMarketPlace
        .createMarketSaleERC1155(
          nft.item.Collection.contractAddress,
          nft.item.marketItemId,
          nft.item.amount
        )
        .send({
          from: account,
          value: library.utils.toWei(nft.item.price, "ether"),
        })
        .then((result) => result)
      const saveTransaction = await saveTransactionToserver(
        nft.item.owner,
        account,
        nft.item.price,
        nft.item.id
      )
    }
  }

  const handleSelectedWallet = async (provider = null) => {
    if (connected === false) {
      if (
        window.ethereum.networkVersion === "4" ||
        window.ethereum.networkVersion === "1"
      ) {
        await connect(MetaMask)
      } else if (
        window.ethereum.networkVersion === "80001" ||
        window.ethereum.networkVersion === "137"
      ) {
        await connect(MetaMaskPolygon)
      }
    } else if (nft.item) {
      if (nft.item.timeAuction) {
        setModal(true) // It's just for Time Auction, not fix price
      }
      if (!nft.item.timeAuction) {
        handleBuyItemFromMarket()
      }
    }
  }

  const submitBidModal = async (e) => {
    e.preventDefault()
    setModal(false)
    setProgressLoading(true)
    setProgress({
      status: 20,
      note: "Start the bid...",
    })

    setProgress({
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
    if (nft.item.blockchain === "Eth") {
      contractMarket = config.marketContractAddressETH
    } else if (nft.item.blockchain === "Plg") {
      contractMarket = config.marketContractAddressMATIC
    }

    const priceTowei = library.utils.toWei(placebidValue, "ether")

    await WETHmethods.approve(contractMarket, priceTowei)
      .send({ from: account })
      .then((result) => console.log("result approve Weth", result))

    setProgress({
      status: 65,
      note: "Add your bid...",
    })

    await marketMethods
      .addBidToNFT(
        nft.item.marketItemId,
        nft.item.tokenId,
        priceTowei,
        nft.item.Collection.contractAddress
      )
      .send({ from: account })
      .then((result) => console.log("result approve Weth", result))

    const BidItemId = await marketMethods
      .LastIdBidsItem()
      .call()
      .then((result) => result)

    saveBidToserver(account, placebidValue, nft.item.id, BidItemId).then(
      (value) => {
        setProgressLoading(false)
        setProgress({
          status: 100,
          note: "Complete!",
        })
      }
    )
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
    Nfts.forEach((data) => {
      if (
        location.pathname.substring(location.pathname.indexOf("/") + 5) ===
        data.id.toString()
      ) {
        setNftData(data)
      }
    })
  }, [])

  let button
  if (
    nft !== null &&
    account &&
    account.toLowerCase() === nft.item.owner.toLowerCase()
  ) {
    button = (
      <Button
        disabled
        style={{
          marginRight: "auto",
          marginTop: "50px",
          color: "white",
        }}
        className={`mv-header-connect-btn mv-landing-bid-btn ${
          rootTheme === "light" && "mv-header-connect-btn-light"
        }`}
      >
        You are owner
      </Button>
    )
  } else if (nft !== null && account !== null && nft.item.timeAuction) {
    button = (
      <Button
        disabled={progressLoading}
        onClick={handleSelectedWallet}
        style={{
          marginRight: "auto",
          marginTop: "50px",
          color: "white",
        }}
        className={`mv-header-connect-btn mv-landing-bid-btn ${
          rootTheme === "light" && "mv-header-connect-btn-light"
        }`}
      >
        {connected === true ? "Place a Bid" : "Connect Wallet to Bid"}
      </Button>
    )
  } else if (nft !== null && nft.item.status === "Release") {
    button = (
      <Button
        disabled
        style={{
          marginRight: "auto",
          marginTop: "50px",
          color: "white",
        }}
        className={`mv-header-connect-btn mv-landing-bid-btn ${
          rootTheme === "light" && "mv-header-connect-btn-light"
        }`}
      >
        Sold
      </Button>
    )
  } else {
    button = (
      <Button
        disabled={progressLoading}
        onClick={handleSelectedWallet}
        style={{
          marginRight: "auto",
          marginTop: "50px",
          color: "white",
        }}
        className={`mv-header-connect-btn mv-landing-bid-btn ${
          rootTheme === "light" && "mv-header-connect-btn-light"
        }`}
      >
        {connected ? "Buy Now" : "Connect Wallet to Bid"}
      </Button>
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
          <img
            src={nft !== null && loadImageFromIPFS(nft.item.fileURL)}
            alt="nft"
          />
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
      {/* bid modal */}
      <Modal
        visible={modal}
        onCancel={() => setModal(false)}
        onOk={() => setModal(false)}
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
            {nftData.timeAuction === true ? "Bid On this" : "Buy this"} NFT
          </div>
          <div>
            <img src={productImage} alt="product" />
          </div>
          <div>
            {nftData.timeAuction === true && (
              <div>Minimum bid {nft !== null ? nft.item.price : 0} ETH</div>
            )}
            <Input
              onChange={(e) => setplacebidValue(e.target.value)}
              required
              placeholder="7.70"
            />
            <div className="mv-buy-bid-modal-btn">
              <Button htmlType="submit">
                {nftData.timeAuction === true ? "Place bid" : "Buy"}
              </Button>
            </div>
            <div>
              Bid will be held in escrow until there is a higher bid or the
              auction ends.
            </div>
            {/* progress bar */}
            {placeBidProgressLoading && (
              <div className="mv-buy-progress-wrapper">
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
      <div
        className={`mv-buy-main-top ${
          rootTheme === "light" ? "mv-buy-main-top-light" : ""
        }`}
      >
        {/* image wrapper */}
        <div>
          <div
            onClick={() => setFullScreenModal(true)}
            className="mv-buy-no-bg"
          >
            {loading === true ? (
              <img
                className={`mv-landing-main-top-image ${
                  rootTheme === "dark" ? "mv-landing-main-top-image-dark" : ""
                }`}
                src={loadingBubbleAnimation}
                alt="product"
              />
            ) : (
              <img
                className={`mv-landing-main-top-image ${
                  rootTheme === "dark" ? "mv-landing-main-top-image-dark" : ""
                }`}
                src={nft !== null && loadImageFromIPFS(nft.item.fileURL)}
                alt="product"
              />
            )}
          </div>
        </div>
        {nft && nft.item && (
          <div>
            {/* left section */}
            <div>
              <div>{nft !== null && nft.item.displayName}</div>
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
                  <div
                    onClick={() =>
                      history.push(`/profile/${nft.item.owner}?type=sale`)
                    }
                  >
                    <img src={creatorImage} alt="creator" />{" "}
                    {nft.item.owner?.substr(0, 15)} ...
                  </div>
                </div>
                <div>
                  <div>Created by</div>
                  <div
                    onClick={() =>
                      history.push(`/profile/${nft.item.owner}?type=sale`)
                    }
                  >
                    <img src={creatorImage} alt="creator" />{" "}
                    {nft.item.owner?.substr(0, 15)} ...
                  </div>
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
                      {nft !== null && nft.item.price?.substr(0, 15)}{" "}
                      {nft && nft.item?.blockchain === "Eth"
                        ? nft.item.start !== 0
                          ? "WETH"
                          : "ETH"
                        : "MATIC"}
                    </div>
                  </div>
                  <div>
                    <div>Auction ends in</div>
                    <div>
                      <Countdown
                        renderer={TimerRenderer}
                        date={nowTime + 200000000}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div>
                    <img src={creatorImage} alt="creator" />
                    {nft.item?.owner?.substr(0, 4)} ...
                  </div>
                  <div>
                    <div className="mv-buy-btn-wrapper">{button}</div>
                  </div>
                </div>
              </div>
              <div>
                <div>Owned by</div>
                <div
                  onClick={() =>
                    history.push(`/profile/${nft.item?.owner}?type=sale`)
                  }
                >
                  <img src={creatorImage} alt="owner" />{" "}
                  {nft.item?.owner?.substr(0, 15)} ...
                </div>
              </div>
            </div>
          </div>
        )}
        {/* detail wrapper */}
        {/* <div>
          <div className="mv-buy-nft-name">
            {nft !== null && nft.item.displayName}
            <span>{nft !== null && nft.item.description}</span>
            <Popover
              overlayInnerStyle={{ borderRadius: "10px" }}
              style={{ borderRadius: "10px" }}
              placement="topLeft"
              title=""
              content={content}
            >
              <img src={verifyed} alt="verifyed" />
            </Popover>
            {rootTheme === "dark" ? (
              <img
                className="mv-buy-nft-rate-stars"
                src={whiteStars}
                alt="rate"
              />
            ) : (
              <img
                className="mv-buy-nft-rate-stars"
                src={blackStars}
                alt="rate"
              />
            )}
          </div>
          <div>
            <div>
              <span>Sale Price</span>
              {nft && nft.item && nft.item.blockchain === "Eth" ? (
                <div style={{ boxShadow: "unset" }}>
                  <img src={ethIcon} alt="price" />
                  {nft !== null && nft.item.price} ETH
                </div>
              ) : (
                <div style={{ boxShadow: "unset" }}>
                  {rootTheme === "dark" ? (
                    <img src={algoWhite} alt="price" />
                  ) : (
                    <img src={algoBlack} alt="price" />
                  )}
                  {nft !== null && nft.item.price} MATIC
                </div>
              )}
            </div>
            {nft !== null && nft.item.timeAuction && (
              <div>
                <span>
                  {nft.item.start * 1000 > now ? "starting in" : "Ending in"}
                </span>

                {nft.item.start * 1000 > now ? (
                  <div>
                    <MvCountdown
                      time={Date.now() + (nft.item.start * 1000 - now)}
                    />
                  </div>
                ) : nft.item.end * 1000 - now > 0 &&
                  nft.item.start * 1000 < now ? (
                  <div>
                    <MvCountdown
                      time={Date.now() + (nft.item.end * 1000 - now)}
                    />
                  </div>
                ) : (
                  <div>Ended</div>
                )}
              </div>
            )}
            <div>
              <img src={creatorImage} alt="creator" />
              <Link to={nft !== null && `/profile/${nft.item.owner}?type=NFTs`}>
                {nft !== null && nft.item.owner.substring(0, 10)} ...
              </Link>
            </div>
            <div className="mv-buy-btn-wrapper">{button}</div>
          </div>
        </div> */}
      </div>
      {/* progress bar */}
      {progressLoading && (
        <div className="mv-buy-progress-wrapper">
          <p className={classes.progress__note}>{progress.note}</p>
          <div className={classes["mint-progress-bar"]}>
            <div
              className="mv-mint-progress-bar"
              style={{ width: `${progress.status}%` }}
            />
          </div>
        </div>
      )}
      {/* buy list */}
      {nft !== null && nft.item.timeAuction && (
        <div
          className={`mv-buy-list ${
            rootTheme === "light" ? "mv-buy-list-light" : ""
          }`}
        >
          <div>Bids List</div>
          <div>
            <div
              className={`mv-buy-list-item ${
                rootTheme === "light" ? "mv-buy-list-item-light" : ""
              }`}
            >
              <div>wallet Address</div>
              <div>Bid price</div>
              <div> </div>
            </div>
            {list.map((data, index) => (
              <div
                className={`mv-buy-list-item ${
                  rootTheme === "light" ? "mv-buy-list-item-light" : ""
                }`}
                key={index}
              >
                <div>{data.bidder}</div>
                <div>{data.priceBid} WETH</div>
                <div>
                  {nft !== null && nft.item.owner === account && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setList(list.filter((li) => li.id !== data.id))
                        }
                      >
                        <img src={declineIcon} alt="decline" />
                      </button>
                      <button onClick={() => acceptBid(data)} type="button">
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
