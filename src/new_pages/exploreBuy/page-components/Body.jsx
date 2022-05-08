import { useEffect, useState, useMemo } from "react"
import "../page-assets/ExploreBuy.css"
import "../../sell/page-assets/Sell.css"
import { useHistory, useParams, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { useWeb3React } from "@web3-react/core"
import Header from "../../landing/page-components/Header"
import Footer from "../../landing/page-components/Footer"
import { Button, Input, Select, Spin } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import SelectArrow from "new_pages/mint/page-components/SelectArrow"
import bidWhite from "../page-assets/poly.png"
import avatarImage from "../page-assets/avatar.jpg"
import ethIcon from "../page-assets/eth.svg"
import loadingBubbleAnimation from "new_assets/loadings/bubble.svg"
import Loading from "./Loading"
import { contentLoaderColors, config } from "utils/config"
import ContentLoader from "react-content-loader"
import HttpService from "utils/httpService"
import Countdown from "react-countdown"

const { Option } = Select

const Body = () => {
  const history = useHistory()
  const { search } = useLocation()
  const query = useQuery()
  const [getNftLoading, setGetNftLoading] = useState(false)
  const { rootTheme } = useSelector((state) => state.application)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(0)
  const [products, setProducts] = useState([])
  const [searchedValue, setSearchedValue] = useState("")
  const [filter, setfilter] = useState({
    type: "",
    search: "",
    orderby: "all",
  })
  const [showData, setShowData] = useState(true)
  const httpservice = new HttpService()
  const pinata = config.IPFS

  const TimerRenderer = ({ days, hours, minutes, seconds, completed }) => {
    if (!completed) {
      return (
        <span>
          {days}D {hours}H {minutes}M {seconds}S
        </span>
      )
    }
  }

  const getNFTsFromServer = async (FilterItems) => {
    const URL = `${config.url_NFTnize}/nft/` // just for test and later this url change from env
    const queryItem = {}
    if (FilterItems.type) {
      queryItem.type = FilterItems.type === "time_auction" ? "auction" : "buy"
    }
    if (FilterItems.orderby !== "all") {
      queryItem.orderby = FilterItems.orderby
    }
    if (FilterItems.search !== "") {
      queryItem.search = FilterItems.search
    }
    const postdata = await httpservice.get(URL, {
      params: queryItem,
    })
    return postdata.data.items
  }

  function useQuery() {
    return useMemo(() => new URLSearchParams(search), [search])
  }

  const loadImageFromIPFS = (URI) => {
    const uri = URI.replace(/^ipfs?:\/\//, "")
    return `${pinata}${uri}`
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
    setGetNftLoading(true)
    getNFTsFromServer(filter).then((result) => {
      setProducts(result)
      setGetNftLoading(false)
    })
  }, [filter])

  useEffect(() => {
    setfilter({ ...filter, search: searchedValue })
  }, [searchedValue])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
    if (tab === 0) {
      setfilter({ ...filter, type: "time_auction" })
    } else {
      setfilter({ ...filter, type: "fixed_price" })
    }
  }, [tab])

  useEffect(() => {
    if (showData === false) {
      setShowData(true)
    }
  }, [showData])

  return (
    <div
      className={`mv-explore-buy ${
        rootTheme === "light" ? "mv-explore-buy-light" : ""
      }`}
    >
      <Header />
      <div
        className={`mv-explore-buy-main-top ${
          rootTheme === "light" ? "mv-explore-buy-main-top-light" : ""
        }`}
      >
        <div>Buy NFTs</div>
        <div>
          <a href="/">Home</a>
          <div>/</div>
          <div>Buy NFTs</div>
        </div>
        <div>
          <Button
            onClick={() => {
              setShowData(false)
              setLoading(true)
              history.push("/buy?type=auction")
              setTimeout(() => {
                setTab(0)
              }, 500)
            }}
            id={
              tab === 0 && rootTheme === "light"
                ? "mv-explore-buy-selected-tab-light"
                : ""
            }
            className={tab === 0 ? "mv-explore-buy-selected-tab" : ""}
          >
            <span>Live Auctions</span>
          </Button>
          <Button
            onClick={() => {
              setShowData(false)
              setLoading(true)
              history.push("/buy?type=buy")
              setTimeout(() => {
                setTab(1)
              }, 500)
            }}
            id={
              tab === 1 && rootTheme === "light"
                ? "mv-explore-buy-selected-tab-light"
                : ""
            }
            className={tab === 1 ? "mv-explore-buy-selected-tab" : ""}
          >
            <span>Buy Now</span>
          </Button>
        </div>
        <Input
          prefix={
            <SearchOutlined
              className={`mv-suffix-search ${
                rootTheme === "light" ? "mv-suffix-search-light" : ""
              }`}
            />
          }
          value={searchedValue}
          onChange={(e) => setSearchedValue(e.target.value)}
          placeholder="Search Buy Items"
        />
      </div>
      <div
        className={`mv-explore-buy-main ${
          rootTheme === "light" ? "mv-explore-buy-main-light" : ""
        }`}
      >
        <div>
          <div>{products.length} Items</div>
          <div>
            <span>Sort By</span>
            <Select
              onChange={(value) => {
                setfilter({ ...filter, orderby: value })
              }}
              suffixIcon={<SelectArrow />}
              defaultValue="all"
            >
              <Option value="all">All Time</Option>
              <Option value="newest">Date Listed:Newest</Option>
              <Option value="highest">Price:Highest</Option>
              <Option value="lowest">Price:Lowest</Option>
            </Select>
          </div>
        </div>
        <div>
          <div className="mv-product-section-one mv-explore-buy-section">
            {getNftLoading && (
              <div style={{ marginTop: "10vh" }}>
                <Spin size="large" />
              </div>
            )}
            {!getNftLoading && products && products.length === 0 && (
              <div style={{ marginTop: "10vh" }}>
                There is no NFT to display.
              </div>
            )}
            <div className="mv-product-section-one-list mv-explore-buy-list">
              {showData &&
                products.map((product, index) => (
                  <div
                    key={index}
                    style={{ position: "relative" }}
                    className={
                      rootTheme === "light"
                        ? "mv-product-section-one-list-item-light"
                        : ""
                    }
                  >
                    <div>{product.displayName}</div>
                    {loading === true ? (
                      <img src={loadingBubbleAnimation} alt="loading" />
                    ) : (
                      <img src={`${pinata}${product.fileURL}`} alt="product" />
                    )}
                    <div>
                      {product && product?.nft_owner?.avatar ? (
                        <img
                          src={`${config.url_NFTnize.replace(
                            "/api/v1",
                            "/static"
                          )}/${product?.nft_owner?.avatar}`}
                          style={{ marginRight: "10px" }}
                          alt="profile avatar"
                        />
                      ) : (
                        <img
                          src={avatarImage}
                          style={{ marginRight: "10px" }}
                          alt="no"
                        />
                      )}
                      <span>
                        {product?.nft_owner?.displayName === null
                          ? "No name"
                          : product?.nft_owner?.displayName}
                      </span>
                    </div>
                    <div
                      className={
                        rootTheme === "light"
                          ? "mv-product-section-one-list-item-light-titles"
                          : ""
                      }
                    >
                      <div>{tab === 0 ? "Current Bid" : "Sale Price"}</div>
                      {tab === 0 && <div>Ending In</div>}
                    </div>
                    <div
                      className={
                        rootTheme === "light"
                          ? "mv-product-section-one-list-item-light-infos"
                          : ""
                      }
                    >
                      <div>
                        {product.blockchain === "Eth" ? (
                          <img
                            style={{ marginRight: "5px" }}
                            src={ethIcon}
                            alt="bid"
                          />
                        ) : (
                          <img
                            style={{ marginRight: "5px" }}
                            src={bidWhite}
                            alt="bid"
                          />
                        )}
                        {product.price}{" "}
                        {product.blockchain === "Eth" ? "Eth" : "Matic"}
                      </div>
                      {tab === 0 && (
                        <div>
                          {product.end * 1000 - Date.now() > 0 ? (
                            <Countdown
                              renderer={TimerRenderer}
                              date={
                                Date.now() + (product.end * 1000 - Date.now())
                              }
                            />
                          ) : (
                            "Ended"
                          )}
                        </div>
                      )}
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
                          rootTheme === "light" && "mv-header-connect-btn-light"
                        }`}
                        onClick={() => {
                          history.push(
                            `/nft/detail/${product.Collection.contractAddress}:${product.tokenId}`
                          )
                        }}
                      >
                        {tab === 0 ? (
                          <span>Bid on this NFT</span>
                        ) : (
                          <span>Buy this NFT</span>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default Body
