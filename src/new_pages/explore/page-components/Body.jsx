import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useWeb3React } from "@web3-react/core"
import { useHistory } from "react-router-dom"
import "../page-assets/Explore.css"
import { config } from "utils/config"
import "../../landing/page-assets/Landing.css"
import profileImage from "../../landing/page-assets/profile.png"
import { Button, Input, Select, Collapse, Checkbox, Radio, Spin } from "antd"
import Header from "../../landing/page-components/Header"
import Footer from "../../landing/page-components/Footer"
import Profiles from "../../landing/FakeData/Profiles"
import avatarImage from "../page-assets/avatar.jpg"
import PanelArrow from "./PanelArrow"
import HttpService from "utils/httpService"
import Countdown from "react-countdown"
import bidWhite from "../../exploreBuy/page-assets/poly.png"
import ethIcon from "../../exploreBuy/page-assets/eth.svg"
import loadingBubbleAnimation from "new_assets/loadings/bubble.svg"

const { Option } = Select
const { Panel } = Collapse

const Body = () => {
  const history = useHistory()
  const { rootTheme } = useSelector((state) => state.application)
  const [loading, setLoading] = useState(true)
  const [nftLoading, setNftLoading] = useState(false)
  const { account, library } = useWeb3React()

  const [categories, setCategories] = useState([])
  const [tab, setTab] = useState(0)
  const [nfts, setnfts] = useState(null)
  const [minPrice, setMinPrice] = useState("")
  const [users, setusers] = useState([])
  const [maxPrice, setMaxPrice] = useState("")
  const [textbuttonFollow, settextbuttonFollow] = useState({
    text: "Loading ...",
  })

  const [isPriceFilter, setIsPriceFilter] = useState(false)
  const [collections, setcollections] = useState(null)
  const { globalUserInfo } = useSelector((state) => state.application)
  const [nftFilter, setNftFilter] = useState({
    price: {
      min: "",
      max: "",
    },
    availability: "",
    market: "",
    type: "",
    search: "",
    category: "",
  })
  const [profileFilter, setProfileFilter] = useState({
    verification: "",
    type: "",
  })
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

  const getNFTsFromServer = async (filters) => {
    setNftLoading(true)
    const URL = `${config.url_NFTnize}/nft/` // just for test and later this url change from env
    const configURL = {}
    if (filters.price?.min && filters.price?.max) {
      configURL.price = filters.price
    }
    if (filters.type) {
      configURL.typeFile = filters.type
    }
    if (filters.availability) {
      configURL.type = filters.availability
    }
    if (filters.search) {
      configURL.search = filters.search
    }
    if (filters.category) {
      configURL.category = filters.category
    }
    const postdata = await httpservice.get(URL, { params: configURL })
    setNftLoading(false)
    return postdata.data
  }

  const getCollectionsFromServer = async () => {
    const URL = `${config.url_NFTnize}/collection` // just for test and later this url change from env
    const postdata = await httpservice.get(URL, {})
    return postdata.data
  }

  const getUsersFromServer = async () => {
    const URL = `${config.url_NFTnize}/user`
    const query = {}
    if (Object.keys(globalUserInfo).length === 0) {
      query.checkIsfollowUser = true
      query.currentUserId = globalUserInfo.id
    } else {
      query.checkIsfollowUser = false
    }
    console.log("query", query)
    const postdata = await httpservice.get(URL, {
      params: query,
    })
    return postdata.data
  }

  const loadImageFromIPFS = (URI) => {
    const uri = URI.replace(/^ipfs?:\/\//, "")
    return `${pinata}${uri}`
  }

  const getCategories = async () => {
    const res = await httpservice.get(`${config.url_NFTnize}/category`, {})
    return res.data.data
  }

  useEffect(() => {
    getNFTsFromServer({}).then((result) => {
      setnfts(result)
    })
    getCollectionsFromServer().then((result) => {
      setcollections(result)
    })
    getCategories().then((category) => {
      setCategories(
        category.filter(
          (cat) =>
            cat.name !== "Explore All" &&
            cat.name !== "Trending" &&
            cat.name !== "Top Sellers"
        )
      )
    })
    getUsersFromServer().then((user) => {
      console.log("userrr", user)
      setusers(user)
    })
    console.log("globalUserInfo", globalUserInfo)
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])

  useEffect(() => {
    if (categories) {
      setCategories(categories.sort((a, b) => a.name.localeCompare(b.name)))
    }
  }, [categories])

  useEffect(() => {
    setTimeout(() => {
      getNFTsFromServer(nftFilter).then((result) => {
        setnfts(result)
      })
    }, 1000)
  }, [nftFilter])

  const handleNavigateToNFT = (route) => {
    history.push(route)
  }

  const followUnfollow = async (address) => {
    const url = `${config.url_NFTnize}/follow/`
    const res = await httpservice.post(url, {
      account,
      following: address,
    })
    return res.data
  }

  const handleFollowUser = async (address) => {
    settextbuttonFollow({
      text: "Loading ...",
    })
    followUnfollow(address).then((item) => {
      if (item.message === "followed") {
        settextbuttonFollow({
          text: "Unfollow",
        })
      } else {
        settextbuttonFollow({ text: "Follow" })
      }
    })
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
      <div className="mv-explore-search-wrapper">
        <Input
          onChange={(e) =>
            setNftFilter({ ...nftFilter, search: e.target.value })
          }
          placeholder="Search NFTnise"
        />
      </div>
      <div
        className={`mv-explore-title-wrapper ${
          rootTheme === "dark" && "mv-explore-title-wrapper-dark"
        }`}
      >
        <div> </div>
        {/* -----------------------------------------header------------------------------------------- */}
        <div
          style={{
            width: "73%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <Button
              onClick={() => setTab(0)}
              className={tab === 0 ? "mv-explore-tab-selected" : ""}
              id={
                tab === 0 && rootTheme === "dark"
                  ? "mv-explore-tab-selected-dark"
                  : ""
              }
            >
              <span style={{ marginRight: "10px" }}>NFTs</span>{" "}
              {nfts !== null && nfts.items.length}
            </Button>
            <Button
              onClick={() => setTab(1)}
              className={tab === 1 ? "mv-explore-tab-selected" : ""}
              id={
                tab === 1 && rootTheme === "dark"
                  ? "mv-explore-tab-selected-dark"
                  : ""
              }
            >
              <span style={{ marginRight: "10px" }}>Collections</span>{" "}
              {collections !== null && collections.items.length}
            </Button>
            <Button
              onClick={() => setTab(2)}
              className={tab === 2 ? "mv-explore-tab-selected" : ""}
              id={
                tab === 2 && rootTheme === "dark"
                  ? "mv-explore-tab-selected-dark"
                  : ""
              }
            >
              <span style={{ marginRight: "10px" }}>Profiles</span>{" "}
              {users.count}
            </Button>
          </div>
          <div>
            <span>Sort By</span>
            <Select defaultValue="1">
              <Option value="1">Newest</Option>
            </Select>
          </div>
        </div>
      </div>
      <div className="mv-explore-main">
        {tab !== 1 && (
          <div className="mv-filterbar-explore">
            <Collapse
              defaultActiveKey={["0", "1", "2", "3", "4", "5", "6"]}
              style={{ position: "relative" }}
              ghost
              expandIcon={() => <PanelArrow />}
              className={
                rootTheme === "dark" ? "mv-explore-filterbar-dark" : ""
              }
            >
              {/* ---------------------------------- side bar filter --------------------------------------- */}
              {tab === 0 && (
                <>
                  <Panel
                    className={`mv-explore-price-filter ${
                      rootTheme === "light"
                        ? "mv-explore-price-filter-light"
                        : ""
                    }`}
                    header="Category"
                    key="0"
                  >
                    <Select
                      placeholder="select a category"
                      onChange={(value) => {
                        setNftFilter({ ...nftFilter, category: value })
                      }}
                      className="mv-explore-category-select"
                    >
                      {categories &&
                        categories.map((cat, index) => (
                          <Option key={index} value={cat.id}>
                            {cat.name}
                          </Option>
                        ))}
                    </Select>
                  </Panel>
                  <Panel
                    className={`mv-explore-price-filter ${
                      rootTheme === "light"
                        ? "mv-explore-price-filter-light"
                        : ""
                    }`}
                    header="Price Range"
                    key="1"
                  >
                    <Input
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value)
                        if (isPriceFilter === true) {
                          setNftFilter({
                            ...nftFilter,
                            price: { min: e.target.value, max: maxPrice },
                          })
                        }
                      }}
                      type="tel"
                      placeholder="0.00  ETH"
                    />
                    <Input
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value)
                        if (isPriceFilter === true) {
                          setNftFilter({
                            ...nftFilter,
                            price: { min: minPrice, max: e.target.value },
                          })
                        }
                      }}
                      type="tel"
                      placeholder="0.00  ETH"
                    />
                    <Checkbox
                      checked={isPriceFilter}
                      onChange={(e) => {
                        setIsPriceFilter(e.target.checked)
                        if (e.target.checked === true) {
                          setNftFilter({
                            ...nftFilter,
                            price: { min: minPrice, max: maxPrice },
                          })
                        } else {
                          setNftFilter({
                            ...nftFilter,
                            price: { min: "", max: "" },
                          })
                        }
                      }}
                      defaultChecked={false}
                    />
                  </Panel>
                  <Panel header="Availability" key="2">
                    <Radio.Group
                      onChange={(e) =>
                        setNftFilter({
                          ...nftFilter,
                          availability: e.target.value,
                        })
                      }
                      className={`mv-explore-filter-checkboxes ${
                        rootTheme === "light"
                          ? "mv-explore-filter-checkboxes-light"
                          : ""
                      }`}
                    >
                      <Radio className="mv-explore-filter-radio" value="buy">
                        <span>Buy Now Price Set</span>
                        <span className="mv-explore-sidebar-count">7,241</span>
                      </Radio>
                      <Radio
                        className="mv-explore-filter-radio"
                        value="listed_for_auction"
                      >
                        <span>Listed for Auction</span>
                        <span className="mv-explore-sidebar-count">7,241</span>
                      </Radio>
                      <Radio
                        className="mv-explore-filter-radio"
                        value="auction"
                      >
                        <span>Live Auction</span>
                        <span className="mv-explore-sidebar-count">7,241</span>
                      </Radio>
                    </Radio.Group>
                  </Panel>
                  <Panel header="Type" key="4">
                    <Radio.Group
                      onChange={(e) =>
                        setNftFilter({
                          ...nftFilter,
                          type: e.target.value,
                        })
                      }
                      className={`mv-explore-filter-checkboxes ${
                        rootTheme === "light"
                          ? "mv-explore-filter-checkboxes-light"
                          : ""
                      }`}
                    >
                      <Radio className="mv-explore-filter-radio" value="image">
                        <span>Image</span>
                        <span className="mv-explore-sidebar-count">7,241</span>
                      </Radio>
                      <Radio className="mv-explore-filter-radio" value="video">
                        <span>Video</span>
                        <span className="mv-explore-sidebar-count">7,241</span>
                      </Radio>
                      <Radio className="mv-explore-filter-radio" value="3D">
                        <span>3D</span>
                        <span className="mv-explore-sidebar-count">7,241</span>
                      </Radio>
                    </Radio.Group>
                  </Panel>
                </>
              )}
              {tab === 2 && (
                <>
                  <Panel header="Type" key="5">
                    <Radio.Group
                      onChange={(e) =>
                        setProfileFilter({
                          ...profileFilter,
                          type: e.target.value,
                        })
                      }
                      className={`mv-explore-filter-checkboxes ${
                        rootTheme === "light"
                          ? "mv-explore-filter-checkboxes-light"
                          : ""
                      }`}
                    >
                      <Radio
                        className="mv-explore-filter-radio"
                        value="creator"
                      >
                        <span>Creator</span>
                        <span className="mv-explore-sidebar-count">7,241</span>
                      </Radio>
                      <Radio
                        className="mv-explore-filter-radio"
                        value="collector"
                      >
                        <span>Collector</span>
                        <span className="mv-explore-sidebar-count">7,241</span>
                      </Radio>
                      <Radio className="mv-explore-filter-radio" value="other">
                        <span>Other</span>
                        <span className="mv-explore-sidebar-count">7,241</span>
                      </Radio>
                    </Radio.Group>
                  </Panel>
                  <Panel header="Social Verification" key="6">
                    <Radio.Group
                      onChange={(e) =>
                        setProfileFilter({
                          ...profileFilter,
                          verification: e.target.value,
                        })
                      }
                      className={`mv-explore-filter-checkboxes ${
                        rootTheme === "light"
                          ? "mv-explore-filter-checkboxes-light"
                          : ""
                      }`}
                    >
                      <Radio
                        className="mv-explore-filter-radio"
                        value="twitter"
                      >
                        <span>Twitter</span>
                        <span className="mv-explore-sidebar-count">7,241</span>
                      </Radio>
                      <Radio
                        className="mv-explore-filter-radio"
                        value="instagram"
                      >
                        <span>Instagram</span>
                        <span className="mv-explore-sidebar-count">7,241</span>
                      </Radio>
                      <Radio
                        className="mv-explore-filter-radio"
                        value="not_verified"
                      >
                        <span>Not-verified</span>
                        <span className="mv-explore-sidebar-count">7,241</span>
                      </Radio>
                    </Radio.Group>
                  </Panel>
                </>
              )}
            </Collapse>
          </div>
        )}
        <div
          className="mv-body-explore"
          style={
            tab === 1 ? { width: "100%", maxWidth: "unset" } : { width: "73%" }
          }
        >
          {nftLoading === true && (
            <div
              style={{
                backgroundColor: "unset",
                width: "100%",
                marginTop: "35vh",
                marginBottom: "3vh",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin size="large" />
            </div>
          )}
          {/* ---------------------------------- tab 0 --------------------------------------- */}
          {tab === 0 && (
            <div className="mv-product-section-one-list">
              {nfts !== null &&
                nfts.items.map((item, index) => (
                  <div
                    key={index}
                    style={{ position: "relative" }}
                    className={
                      rootTheme === "light"
                        ? "mv-product-section-one-list-item-light"
                        : ""
                    }
                  >
                    <div>{item.displayName}</div>
                    {loading === true ? (
                      <img src={loadingBubbleAnimation} alt="loading" />
                    ) : (
                      <img src={`${pinata}${item.fileURL}`} alt="item" />
                    )}
                    <div>
                      {item && item?.nft_owner?.avatar ? (
                        <img
                          src={`${config.url_NFTnize.replace(
                            "/api/v1",
                            "/static"
                          )}/${item?.nft_owner?.avatar}`}
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
                      <span> Owner: {item.owner.substring(0, 20)}...</span>
                    </div>
                    <div
                      className={
                        rootTheme === "light"
                          ? "mv-item-section-one-list-item-light-titles"
                          : ""
                      }
                    >
                      <div>{item.end !== 0 ? "Current Bid" : "Sale Price"}</div>
                      {item.end !== 0 && <div>Ending In</div>}
                    </div>
                    <div
                      className={
                        rootTheme === "light"
                          ? "mv-product-section-one-list-item-light-infos"
                          : ""
                      }
                    >
                      <div>
                        {item.blockchain === "Eth" ? (
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
                        {item.price}{" "}
                        {item.blockchain === "Eth" ? "Eth" : "Matic"}
                      </div>
                      {item.end !== 0 && (
                        <div>
                          {item.end * 1000 - Date.now() > 0 ? (
                            <Countdown
                              renderer={TimerRenderer}
                              date={Date.now() + (item.end * 1000 - Date.now())}
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
                        onClick={() =>
                          handleNavigateToNFT(
                            `/nft/detail/${item?.Collection?.contractAddress}:${item?.tokenId}`
                          )
                        }
                      >
                        {item.timeAuction === true ? "Place Bid" : "Buy Now"}
                      </Button>
                    </div>
                  </div>

                  // <div
                  //   className={
                  //     rootTheme === "light"
                  //       ? "mv-product-section-one-list-item-light"
                  //       : ""
                  //   }
                  // >
                  //   <div>{item.displayName}</div>
                  //   <img
                  //     src={loadImageFromIPFS(
                  //       item.fileURL !== null && item.fileURL
                  //     )}
                  //     alt="product"
                  //   />
                  //   <div>
                  //     <img
                  //       src={avatarImage}
                  //       alt="product creator"
                  //       style={{ marginRight: "10px" }}
                  //     />
                  //     <span>Creator: {item.creator.substring(0, 20)}...</span>
                  //   </div>
                  //   <div
                  //     style={{ backgroundColor: "white" }}
                  //     id={rootTheme === "dark" && "explore-bid-price-box-dark"}
                  //     className={
                  //       rootTheme === "light"
                  //         ? "mv-product-section-one-list-item-light-titles"
                  //         : ""
                  //     }
                  //   >
                  //     <div>Current Bid</div>
                  //     <div
                  //       style={{
                  //         color: "unset",
                  //         fontWeight: "600",
                  //         fontSize: "14px",
                  //       }}
                  //     >
                  //       {item.price}{" "}
                  //       {item.tokenSale ===
                  //       "0x0000000000000000000000000000000000000000"
                  //         ? "ETH"
                  //         : "WETH"}
                  //     </div>
                  //   </div>
                  //   <Button
                  //     id={rootTheme === "dark" && "explore-bid-btn-box-dark"}
                  //     className={
                  //       rootTheme === "light"
                  //         ? "mv-product-section-one-list-item-light-infos"
                  //         : ""
                  //     }
                  //     onClick={() =>
                  //       handleNavigateToNFT(
                  //         `/nft/detail/${item?.Collection?.contractAddress}:${item?.tokenId}`
                  //       )
                  //     }
                  //   >
                  //     {item.timeAuction === true ? "Place Bid" : "Buy Now"}
                  //   </Button>
                  // </div>
                ))}
              {nftLoading === false && nfts === null && (
                <div className="mv-explore-empty-message">
                  There is no NFts to display, please NFTnize NFTs. Thanks!
                </div>
              )}
              {nftLoading === false && nfts && nfts.items === null && (
                <div className="mv-explore-empty-message">
                  There is no NFts to display, please NFTnize NFTs. Thanks!
                </div>
              )}
              {nftLoading === false &&
                nfts &&
                nfts.items &&
                nfts.items.length === 0 && (
                  <div className="mv-explore-empty-message">
                    There is no NFts to display, please NFTnize NFTs. Thanks!
                  </div>
                )}
            </div>
          )}
          {/* ---------------------------------- tab 1 --------------------------------------- */}
          {tab === 1 && (
            <div className="mv-product-section-one-list mv-explore-list-center">
              {collections !== null &&
                collections.items !== null &&
                collections.items.map((collection, index) => (
                  <div
                    className={`mv-collection-item mv-collection-item-explore ${
                      rootTheme === "light" && "mv-collection-item-light"
                    }`}
                    key={index}
                    style={{ position: "relative" }}
                  >
                    <div>
                      <img
                        src={loadImageFromIPFS(collection.image_url)}
                        alt="product"
                      />
                      <span>{collection.name}</span>
                      <span>({collection.symbol})</span>
                      <img
                        className={`mv-collection-item-thumb ${
                          rootTheme === "light" &&
                          "mv-collection-item-thumb-light"
                        }`}
                        src={loadImageFromIPFS(collection.image_url)}
                        alt="collector"
                      />
                    </div>
                    <div>
                      <img
                        style={{ marginRight: "10px", width: "20px" }}
                        src={avatarImage}
                        alt="creator"
                      />
                      <span>{collection.owner}</span>
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
                          handleNavigateToNFT(
                            `/collection/${collection.contractAddress}`
                          )
                        }}
                      >
                        <span>View Collection</span>
                      </Button>
                    </div>
                  </div>
                ))}
              {collections === null && (
                <div className="mv-explore-empty-message">
                  There is no Collections to display
                </div>
              )}
              {collections && collections.items === null && (
                <div className="mv-explore-empty-message">
                  There is no Collections to display
                </div>
              )}
              {collections &&
                collections.items &&
                collections.items.length === 0 && (
                  <div className="mv-explore-empty-message">
                    There is no Collections to display
                  </div>
                )}
            </div>
          )}
          {/* ---------------------------------- tab 2 --------------------------------------- */}
          {tab === 2 && (
            <div className="mv-product-section-one-list mv-explore-list">
              {console.log("users", users)}
              {users.users &&
                users.users.length > 0 &&
                users.users.map((profile, index) => (
                  <div
                    key={index}
                    className={`mv-profile-item ${
                      rootTheme === "light" && "mv-profile-item-light"
                    }`}
                  >
                    <div>{profile.displayName}</div>
                    <div>
                      <img src={profileImage} alt="profile" />
                      <img
                        src={`${config.url_NFTnize.replace(
                          "/api/v1",
                          "/static"
                        )}/${profile.avatar}`}
                        width={50}
                        height={50}
                        alt="profile avatar"
                      />
                    </div>
                    <div>{profile.username.substr}</div>
                    <div>{profile.bio}</div>
                    <div>
                      <span
                        style={
                          rootTheme === "light"
                            ? { color: "black" }
                            : { color: "white" }
                        }
                      >
                        Followers
                      </span>
                      <div
                        style={
                          rootTheme === "light"
                            ? { border: "1px solid black" }
                            : { border: "1px solid white" }
                        }
                      >
                        {profile.followerCount}
                      </div>
                    </div>
                    <Button
                      className={`mv-profile-follow-btn ${
                        rootTheme === "light" && "mv-profile-follow-btn-light"
                      }`}
                      onClick={() => handleFollowUser(profile.walletAddress)}
                    >
                      {profile.isFollowed
                        ? settextbuttonFollow({
                            ...textbuttonFollow,
                            text: "Follow",
                          })
                        : settextbuttonFollow({
                            ...textbuttonFollow,
                            text: "Unfollow",
                          })}
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Body
