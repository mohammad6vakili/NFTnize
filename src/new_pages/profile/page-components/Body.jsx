import React, { useState, useEffect } from "react"
import "../page-assets/Profile.css"
import { Input, Button, Modal } from "antd"
import { useWeb3React } from "@web3-react/core"
import { useSelector, useDispatch } from "react-redux"
import { useHistory, useParams, useLocation } from "react-router-dom"
import Header from "new_pages/landing/page-components/Header"
import Footer from "new_pages/landing/page-components/Footer"
import profileAvatar from "../page-assets/profile-avatar.png"
import profileBanner from "../page-assets/profile-banner.png"
import followerAvatar from "../page-assets/follower-avatar.svg"
import pasteIcon from "../page-assets/paste.svg"
import productsOne from "../../landing/FakeData/Products-one"
import { Snackbar } from "../../../components/Snackbar/Snackbar"
import Loading from "../../landing/page-components/Loading"
import avatarIcon from "../page-assets/avatar.jpg"
import Collections from "new_pages/landing/FakeData/Collections"
import { setGlobalUserInfo } from "../../../redux/application/application-slice"

import ethIcon from "../page-assets/eth.svg"
import bidWhite from "../page-assets/bid-white.png"

import closeIcon from "../page-assets/close.svg"
import closeBlackIcon from "../page-assets/close-black.svg"
import HttpService from "utils/httpService"
import { config } from "utils/config"
import { getDataIPFS } from "utils/mint/ipfs"
import moment from "moment"

const Body = () => {
  const dispatch = useDispatch()
  const { rootTheme } = useSelector((state) => state.application)
  const { globalUserInfo } = useSelector((state) => state.application)

  const snackbarInitValues = {
    isActive: false,
    text: "",
    color: "",
    timeout: 3000,
  }
  const history = useHistory()
  const param = useParams()
  const { search } = useLocation()
  const [snackbar, setSnackbar] = useState(snackbarInitValues)
  const [tab, setTab] = useState(0)
  const [modalTab, setModalTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const { account, library } = useWeb3React()
  const [modal, setModal] = useState(false)
  const [assets, setassets] = useState([])
  const [followers, setfollowers] = useState(0)
  const [following, setfollowing] = useState(0)
  const [readyFollowedBy, setReadyFollowedBy] = useState(false)
  const [followedBy, setFollowedBy] = useState([])
  const [followedByLoading, setFollowedByLoading] = useState(false)
  const [followerFollowing, setfollowerFollowing] = useState([])
  const [userCollections, setuserCollections] = useState([])
  const [counts, setcounts] = useState({
    count_sale: 0,
    count_created: 0,
    count_hold: 0,
    count_collection: 0,
  })
  const [textbuttonFollow, settextbuttonFollow] = useState("Loading ...")
  const [userInfo, setuserInfo] = useState({})
  const query = useQuery()
  const httpservice = new HttpService()
  const pinata = config.IPFS
  const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  const showMessage = ({ text, color, timeout }) => {
    setSnackbar({ isActive: true, text, color, timeout })
  }

  const handleCopyValue = (value) => {
    navigator.clipboard.writeText(value)
    showMessage({ text: "Copied to clipboard", color: "success" })
  }

  const isOwner = () => {
    if (param?.address?.toLowerCase() === account?.toLowerCase()) {
      return true
    } else {
      return false
    }
  }

  const getUserInfo = async () => {
    const url = `${config.url_NFTnize}/user/${param.address.toLowerCase()}`
    const res = await httpservice.get(url, {})
    return res.data
  }

  const followUnfollow = async () => {
    const url = `${config.url_NFTnize}/follow/`
    const res = await httpservice.post(url, {
      account,
      following: param?.address,
    })
    return res.data
  }

  const Isfollow = async () => {
    const url = `${config.url_NFTnize}/follow/isfollowed/`
    const res = await httpservice.get(url, {
      params: {
        account,
        following: param?.address,
      },
    })
    return res.data
  }

  const getAssetsUser = async (assetType, owner) => {
    let url
    if (assetType !== null || assetType !== undefined) {
      url = `${config.url_NFTnize}/user/assets/${owner}`
      const res = await httpservice.get(url, {
        params: {
          type: assetType,
          account: owner,
          is_owner: account.toLowerCase() === owner.toLowerCase(),
        },
      })
      return res.data
    }
  }

  const getCollections = async (assetType, owner) => {
    let url
    if (assetType !== null || assetType !== undefined) {
      url = `${config.url_NFTnize}/user/collections/`
      const res = await httpservice.post(url, {
        account: owner,
        collectionType: "all",
      })
      return res.data.collectionsUser
    }
  }

  const getfollowersAndFollowing = async (userId, type = "following") => {
    const url = `${config.url_NFTnize}/follow/`
    const queryParams = {
      user_id: userId,
      type,
    }

    if (Object.keys(globalUserInfo).length === 0) {
      queryParams.checkIsfollowUser = true
      queryParams.currentUserId = globalUserInfo.id
    } else {
      queryParams.checkIsfollowUser = false
    }
    const res = await httpservice.get(url, {
      params: queryParams,
    })
    return res.data
  }

  function useQuery() {
    return React.useMemo(() => new URLSearchParams(search), [search])
  }

  const loadImageFromIPFS = (URIIPFS) => {
    const uri = URIIPFS.replace(/^ipfs?:\/\//, "")
    return `${config.IPFS}/${uri}`
  }

  const handleTabsProfile = (type) => {
    if (type === "sale") {
      setTab(0)
      history.push("?type=sale")
    } else if (type === "created") {
      setTab(2)
      history.push("?type=created")
    } else if (type === "hold") {
      setTab(1)
      history.push("?type=hold")
    } else if (type === "collection") {
      setTab(3)
      history.push("?type=collection")
      getCollections(type, param.address).then((collections) => {
        setuserCollections(collections)
      })
    }
    getAssetsUser(type, param.address)
      .then((result) => {
        setassets(result.result)
        setcounts({
          count_sale: result.count_sale,
          count_created: result.count_created,
          count_hold: result.count_hold,
          count_collection: result.count_collection,
        })
      })
      .catch((error) => {
        alert("error for get assets user")
      })
  }

  useEffect(() => {
    const isInCollection = localStorage.getItem("tabCollection")
    if (isInCollection) {
      handleTabsProfile("collection")
    }
    setTimeout(() => {
      setLoading(false)
    }, 3000)
    if (!query.get("type")) {
      setTab(0)
      history.push("?type=sale")
    }
    if (query.get("type") === "created") {
      setTab(2)
    } else if (query.get("type") === "hold") {
      setTab(1)
    } else if (query.get("type") === "sale") {
      setTab(0)
    } else if (query.get("type") === "collection") {
      setTab(3)
      getCollections(query.get("type"), param.address).then((collections) => {
        setuserCollections(collections)
      })
    }
    if (query.get("type") !== null) {
      getAssetsUser(query.get("type"), param.address)
        .then((result) => {
          setassets(result.result)
          setcounts({
            count_sale: result.count_sale,
            count_created: result.count_created,
            count_hold: result.count_hold,
            count_collection: result.count_collection,
          })
        })
        .catch((error) => {
          console.error("error", error)
        })
    }
    getUserInfo().then((user) => {
      setuserInfo(user.result)
      dispatch(setGlobalUserInfo(user.result))
      setReadyFollowedBy(true)

      getfollowersAndFollowing(user.result?.id).then((usersFollow) => {
        setfollowerFollowing(usersFollow)
      })
      if (user.following && user.following > 0) {
        setfollowing(user.following)
      }
      if (user.follower && user.follower > 0) {
        setfollowers(user.follower)
      }
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
    console.log("globalUserInfo", globalUserInfo)
  }, [globalUserInfo])

  useEffect(() => {
    if (readyFollowedBy === true) {
      setFollowedByLoading(true)
      getfollowersAndFollowing(userInfo?.id, "follower").then((usersFollow) => {
        setfollowerFollowing(usersFollow)
        Object.values(usersFollow.items).forEach((ff) => {
          followedBy.push(ff.follower)
        })
        setFollowedByLoading(false)
      })
    }
  }, [readyFollowedBy])

  useEffect(() => {
    getUserInfo().then((user) => {
      setuserInfo(user.result)
      dispatch(setGlobalUserInfo(user.result))
      setfollowers(user.following)
      setfollowing(user.follower)
    })
  }, [param?.address])

  useEffect(() => {
    if (modalTab === 0) {
      getfollowersAndFollowing(userInfo?.id, "follower").then((usersFollow) => {
        setfollowerFollowing(usersFollow)
      })
    } else if (modalTab === 1) {
      getfollowersAndFollowing(userInfo?.id, "following").then(
        (usersFollow) => {
          setfollowerFollowing(usersFollow)
        }
      )
    }
  }, [modalTab])

  const handleFollowUnFollow = () => {
    settextbuttonFollow("Loading ...")
    followUnfollow().then((item) => {
      if (item.message === "followed") {
        settextbuttonFollow("Unfollow")
        setfollowers(followers + 1)
      } else {
        settextbuttonFollow("Follow")
        setfollowers(followers - 1)
      }
    })
  }

  const handleNavigateToNFT = (route) => {
    history.push(route)
  }

  useEffect(() => {
    setTab(tab)
  }, [tab])

  return (
    <div
      className={`mv-profile ${
        rootTheme === "light" ? "mv-profile-light" : ""
      }`}
    >
      <Header />
      <div
        className={`mv-profile-body ${
          rootTheme === "light" ? "mv-profile-body-light" : ""
        }`}
      >
        <div
          className={`mv-profile-banner ${
            rootTheme === "light" ? "mv-profile-banner-light" : ""
          }`}
        >
          <img src={profileBanner} alt="profile banner" />
          <div> </div>
          <div>
            {userInfo && userInfo.avatar ? (
              <img
                src={`${config.url_NFTnize.replace("/api/v1", "/static")}/${
                  userInfo?.avatar
                }`}
                alt="profile avatar"
              />
            ) : (
              <img src={avatarIcon} alt="no" />
            )}
          </div>
          <div className="mv-profile-banner-cp">
            <button
              onClick={() => handleCopyValue(param?.address)}
              type="button"
            >
              <img src={pasteIcon} alt="paste" />
              {param?.address && param?.address.substr(0, 15)} ...
            </button>
          </div>
        </div>
        <div
          className={`mv-profile-main ${
            rootTheme === "light" ? "mv-profile-main-light" : ""
          }`}
        >
          {/* follower and following modal */}
          <Modal
            className="mv-mint-add-collection-modal-body"
            style={{
              padding: "0",
              top: "7vh",
              backgroundColor: "transparent",
            }}
            bodyStyle={{
              display: "flex",
              backgroundColor: "transparent",
              padding: "0",
              justifyContent: "center",
            }}
            closable={false}
            visible={modal}
            onCancel={() => setModal(false)}
          >
            <div
              className={`mv-profile-modal ${
                rootTheme === "light" ? "mv-profile-modal-light" : ""
              }`}
            >
              <div>
                {/* tabs */}
                <Button
                  onClick={() => setModalTab(1)}
                  className={modalTab === 1 ? "mv-profile-tab-selected" : ""}
                  id={
                    rootTheme === "light" && modalTab === 1
                      ? "mv-profile-tab-selected-light"
                      : ""
                  }
                >
                  Following <span>{following}</span>
                </Button>
                <Button
                  onClick={() => setModalTab(0)}
                  className={modalTab === 0 ? "mv-profile-tab-selected" : ""}
                  id={
                    rootTheme === "light" && modalTab === 0
                      ? "mv-profile-tab-selected-light"
                      : ""
                  }
                >
                  Followers <span>{followers}</span>
                </Button>
              </div>
              <div
                className={`mv-profile-modal-list ${
                  rootTheme === "light" ? "mv-profile-modal-list-light" : ""
                }`}
              >
                {modalTab === 1
                  ? followerFollowing?.items?.map((dd, index) => (
                      <div key={index}>
                        <div
                          onClick={() => {
                            history.push(
                              `/profile/${dd.following.walletAddress}`
                            )
                            setfollowerFollowing([])
                            setModal(false)
                          }}
                        >
                          {dd?.following?.avatar?.length > 0 ? (
                            <img
                              src={`${config.url_NFTnize.replace(
                                "/api/v1",
                                "/static"
                              )}/${dd?.following?.avatar}`}
                              alt="following"
                            />
                          ) : (
                            <img src={avatarIcon} alt="following" />
                          )}
                          <div>
                            <span>
                              {!dd?.following?.displayName
                                ? "No name"
                                : dd?.following?.displayName}
                            </span>
                            <span>
                              @{dd?.following?.username.substr(0, 10)}
                            </span>
                          </div>
                        </div>
                        <Button onClick={() => handleFollowUnFollow()}>
                          {dd?.isFollowed
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
                    ))
                  : followerFollowing?.items?.map((dd, index) => (
                      <div key={index}>
                        <div
                          onClick={() => {
                            history.push(
                              `/profile/${dd.follower.walletAddress}`
                            )
                            setfollowerFollowing([])
                            setModal(false)
                          }}
                        >
                          {dd?.follower?.avatar?.length > 0 ? (
                            <img
                              src={`${config.url_NFTnize.replace(
                                "/api/v1",
                                "/static"
                              )}/${dd?.follower?.avatar}`}
                              alt="follower"
                            />
                          ) : (
                            <img src={avatarIcon} alt="follower" />
                          )}
                          <div>
                            <span>
                              {!dd?.follower?.displayName
                                ? "No name"
                                : dd?.follower?.displayName}
                            </span>
                            <span>
                              @{dd?.follower?.username?.substr(0, 10)}
                            </span>
                          </div>
                        </div>
                        <Button onClick={() => console.log(dd)}>Follow</Button>
                      </div>
                    ))}
              </div>
            </div>
            {rootTheme === "light" ? (
              <button
                className={`mv-profile-modal-close ${
                  rootTheme === "light" ? "mv-profile-modal-close-light" : ""
                }`}
                type="button"
                onClick={() => setModal(false)}
              >
                <img src={closeBlackIcon} alt="close" />
              </button>
            ) : (
              <button
                className={`mv-profile-modal-close ${
                  rootTheme === "light" ? "mv-profile-modal-close-light" : ""
                }`}
                type="button"
                onClick={() => setModal(false)}
              >
                <img src={closeIcon} alt="close" />
              </button>
            )}
          </Modal>
          <div>
            <div> </div>
            <div>
              {/* tabs */}
              <div>
                <Button
                  onClick={() => handleTabsProfile("sale")}
                  className={tab === 0 ? "mv-profile-tab-selected" : ""}
                  id={
                    rootTheme === "light" && tab === 0
                      ? "mv-profile-tab-selected-light"
                      : ""
                  }
                >
                  On sale <span>{counts.count_sale}</span>
                </Button>
                <Button
                  onClick={() => handleTabsProfile("hold")}
                  className={tab === 1 ? "mv-profile-tab-selected" : ""}
                  id={
                    rootTheme === "light" && tab === 1
                      ? "mv-profile-tab-selected-light"
                      : ""
                  }
                >
                  Hold <span>{counts.count_hold}</span>
                </Button>
                <Button
                  onClick={() => handleTabsProfile("created")}
                  className={tab === 2 ? "mv-profile-tab-selected" : ""}
                  id={
                    rootTheme === "light" && tab === 2
                      ? "mv-profile-tab-selected-light"
                      : ""
                  }
                >
                  Created <span>{counts.count_created}</span>
                </Button>
                <Button
                  onClick={() => handleTabsProfile("collection")}
                  className={tab === 3 ? "mv-profile-tab-selected" : ""}
                  id={
                    rootTheme === "light" && tab === 3
                      ? "mv-profile-tab-selected-light"
                      : ""
                  }
                >
                  Collections <span>{counts.count_collection}</span>
                </Button>
              </div>
            </div>
          </div>
          <div>
            <div>
              <div>
                <div>
                  {userInfo?.displayName === null
                    ? "No name"
                    : userInfo?.displayName}
                </div>
                <div>
                  {userInfo?.username?.length > 20
                    ? `@ ${userInfo?.username?.substr(0, 15)}...`
                    : userInfo?.username}
                </div>
                <div>
                  <div>
                    <span>{!following ? "0" : following}</span>
                    <span>Following</span>
                  </div>
                  <div>
                    {" "}
                    <span>{!followers ? "0" : followers}</span>
                    <span>Followers</span>
                  </div>
                </div>
                {isOwner() ? (
                  <>
                    <Button onClick={() => history.push("/edit/profile")}>
                      <span>Edit your profile</span>
                    </Button>
                  </>
                ) : (
                  <>
                    {" "}
                    <Button onClick={() => handleFollowUnFollow()}>
                      <span>{textbuttonFollow}</span>
                    </Button>{" "}
                  </>
                )}

                <div
                  className={`mv-profile-follow-badge ${
                    rootTheme === "light" ? "mv-profile-follow-badge-light" : ""
                  }`}
                >
                  <div>Followed by</div>
                  <div>
                    <div>
                      {readyFollowedBy &&
                        followedBy.map((flb, index) => {
                          if (flb.avatar?.length > 0) {
                            return (
                              <img
                                key={index}
                                src={`${config.url_NFTnize.replace(
                                  "/api/v1",
                                  "/static"
                                )}/${flb.avatar}`}
                                alt="follower"
                              />
                            )
                          } else {
                            return (
                              <img
                                key={index}
                                src={avatarIcon}
                                alt="follower"
                              />
                            )
                          }
                        })}
                      {!followedByLoading && followedBy.length === 0 && (
                        <span style={{ fontSize: "12px" }}>No Followers</span>
                      )}
                    </div>
                    <a href="#Followed by" onClick={() => setModal(true)}>
                      View All
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <div>
                  <div>Bio</div>
                  <div>{userInfo?.bio}</div>
                </div>
                <div>
                  <div>Links</div>
                  <div>
                    {userInfo?.link?.length > 0 && (
                      <a href={userInfo.link}>{userInfo?.link}</a>
                    )}
                  </div>
                </div>
                <div>
                  <div>Joined</div>
                  <div>{moment(userInfo?.createdAt).format("YYYY/MM/DD")}</div>
                </div>
                <div>
                  <div>
                    {userInfo?.instagram?.length > 0 ? (
                      <a href={`https://instagram.com/${userInfo.instagram}`}>
                        Instagram
                      </a>
                    ) : (
                      "Instagram"
                    )}
                  </div>
                  <div>
                    {userInfo?.twitter?.length > 0 ? (
                      <a href={`https://twitter.com/${userInfo.twitter}`}>
                        Twitter
                      </a>
                    ) : (
                      "Twitter"
                    )}
                  </div>
                  <div>
                    {userInfo?.blog?.length > 0 ? (
                      <a href={userInfo.blog}>Blog</a>
                    ) : (
                      "Blog"
                    )}
                  </div>
                </div>
              </div>
            </div>
            {tab !== 3 && (
              <div className="mv-product-section-one-list">
                {assets &&
                  assets.length > 0 &&
                  assets.map((asset, index) => (
                    <div
                      key={index}
                      className={
                        rootTheme === "light"
                          ? "mv-product-section-one-list-item-light"
                          : ""
                      }
                      style={{ position: "relative" }}
                      id={loading === true ? "mv-product-item-loading" : ""}
                    >
                      {loading === true ? (
                        <Loading />
                      ) : (
                        <>
                          <div>{asset.displayName}</div>
                          <img
                            src={loadImageFromIPFS(asset.fileURL)}
                            alt="product"
                          />
                          <div>
                            {asset && asset?.nft_owner?.avatar ? (
                              <img
                                src={`${config.url_NFTnize.replace(
                                  "/api/v1",
                                  "/static"
                                )}/${asset?.nft_owner?.avatar}`}
                                style={{ marginRight: "10px" }}
                                alt="profile avatar"
                              />
                            ) : (
                              <img
                                src={avatarIcon}
                                style={{ marginRight: "10px" }}
                                alt="no"
                              />
                            )}
                            <span>{asset.owner.substr(0, 15)} ...</span>
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
                              {asset.blockchain === "Eth" ? (
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
                              {asset.price}
                            </div>
                            {/* <div>{asset.expire}</div> */}
                          </div>
                        </>
                      )}
                      {asset.status !== "Burned" && (
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
                            onClick={() => {
                              handleNavigateToNFT(
                                `/nft/detail/${asset?.Collection?.contractAddress}:${asset?.tokenId}`
                              )
                            }}
                          >
                            <span>View NFT</span>
                          </Button>
                        </div>
                      )}
                      {/* burned overlay */}
                      {asset.status === "Burned" && (
                        <div
                          className={`mv-detail-burned-cover ${
                            rootTheme === "light"
                              ? "mv-detail-burned-cover-light"
                              : ""
                          }`}
                        >
                          <span>🔥</span>
                          <span>This item was burned</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
            {tab === 3 && (
              <div className="mv-product-section-one-list">
                {userCollections &&
                  userCollections.length > 0 &&
                  userCollections.map((collection, index) => (
                    <div
                      className={`mv-collection-item ${
                        rootTheme === "light" && "mv-collection-item-light"
                      }`}
                      id={loading === true ? "mv-product-item-loading" : ""}
                      key={index}
                      style={{ position: "relative" }}
                    >
                      {loading === true ? (
                        <Loading />
                      ) : (
                        <>
                          <div>
                            <img
                              src={loadImageFromIPFS(collection.image_url)}
                              alt="product"
                            />
                            <span>{collection.name}</span>
                            <span>
                              ({collection.contractAddress?.substr(0, 15)}) ...
                            </span>
                            {rootTheme === "dark" ? (
                              <img
                                src={loadImageFromIPFS(collection.image_url)}
                                alt="collector"
                              />
                            ) : (
                              <img
                                src={loadImageFromIPFS(collection.image_url)}
                                alt="collector"
                              />
                            )}
                          </div>
                          <div>
                            {collection.creatorImg ? (
                              <img
                                style={{ marginRight: "10px", width: "20px" }}
                                src={collection.creatorImg}
                                alt="creator"
                              />
                            ) : (
                              <img
                                style={{ marginRight: "10px", width: "20px" }}
                                src={avatarIcon}
                                alt="creator"
                              />
                            )}
                            <span>{collection.owner.substr(0, 15)} ...</span>
                          </div>
                        </>
                      )}
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
              </div>
            )}
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
