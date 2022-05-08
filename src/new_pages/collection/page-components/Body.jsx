import React, { useState, useEffect } from "react"
import { useParams, useHistory } from "react-router-dom"
import "../page-assets/Collection.css"
import Header from "new_pages/landing/page-components/Header"
import Footer from "new_pages/landing/page-components/Footer"
import { useSelector } from "react-redux"
import { Input, Button, Select } from "antd"
import miniBaner from "../page-assets/miniBaner.svg"
import miniAvatar from "../page-assets/miniAvatar.svg"
import SelectArrow from "./SelectArrow"
import artWork from "../page-assets/artwork.svg"
import productsOne from "../../landing/FakeData/Products-one"
import Loading from "../../landing/page-components/Loading"
import avatarImage from "../page-assets/avatar.jpg"
import bidWhite from "../page-assets/bid-white.png"
import { config } from "utils/config"
import HttpService from "utils/httpService"
import { getDataIPFS } from "utils/mint/ipfs"

const { Option } = Select

const Body = () => {
  const { rootTheme } = useSelector((state) => state.application)
  const [loading, setLoading] = useState(true)
  const route = useHistory()
  const param = useParams()
  const httpservice = new HttpService()
  const [tab, setTab] = useState(0)
  const [setItemURI, setsetItemURI] = useState({
    description: "Loading ...",
  })
  const [currenctCollection, setcurrenctCollection] = useState({})
  const data = [1, 1, 1, 1, 1]

  useEffect(() => {
    getCurrenctCollection().then((collection) => {
      getDataIPFS(collection?.collection?.collectionURI, setsetItemURI, true)
      setLoading(false)
      setcurrenctCollection(collection)
    })
  }, [])

  const getCurrenctCollection = async () => {
    const url = `${config.url_NFTnize}/collection/${param.contractAddress}`
    const res = await httpservice.get(url, {})
    return res.data
  }

  const loadImageFromIPFS = (URIIPFS) => {
    const uri = URIIPFS.replace(/^ipfs?:\/\//, "")
    return `${config.IPFS}/${uri}`
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
        className={`mv-collection-body ${
          rootTheme === "light" ? "mv-collection-body-light" : ""
        }`}
        id={`mv-collection-body ${
          rootTheme === "light" ? "mv-collection-body-light" : ""
        }`}
      >
        <div>
          <Input placeholder="Search NFTnise" />
          <img
            src={
              currenctCollection?.collection &&
              loadImageFromIPFS(currenctCollection?.collection?.image_url)
            }
            alt="collection"
          />
        </div>
        <div>
          <div>
            <div># {currenctCollection?.collection?.name}</div>
            <div>
              <div>
                {currenctCollection?.owner_collection?.avatar ? (
                  <img
                    src={`${config.url_NFTnize.replace("/api/v1", "/static")}/${
                      currenctCollection?.owner_collection?.avatar
                    }`}
                    width={25}
                    height={25}
                    style={{ marginRight: "10px" }}
                    alt="profile avatar"
                  />
                ) : (
                  <img src={miniAvatar} alt="avatar" />
                )}
                @
                {currenctCollection?.owner_collection?.username?.length > 15
                  ? `${currenctCollection?.owner_collection?.username} ...`
                  : currenctCollection?.owner_collection?.username}
              </div>
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
                Mint , Apple
              </div>
            </div>
            <div>
              <div>
                <div>
                  <div>Collection of</div>
                  <div>1,028</div>
                </div>
                <div>
                  <div>Collection of</div>
                  <div>
                    <img src={miniAvatar} alt="miniavatar" />
                    <img src={miniAvatar} alt="miniavatar" />
                    <img src={miniAvatar} alt="miniavatar" />
                    <span>245</span>
                  </div>
                </div>
                <div>
                  <div>Floor Price</div>
                  <div>
                    {currenctCollection?.avgPrice?.toString().substr(0, 5)}{" "}
                    {currenctCollection?.collection?.blockchain === "Eth"
                      ? "ETH"
                      : "MATIC"}
                  </div>
                </div>
                <div>
                  <div>Total Sales</div>
                  <div>
                    {currenctCollection?.total_sale?.toString().substr(0, 5)}{" "}
                    {currenctCollection?.collection?.blockchain === "Eth"
                      ? "ETH"
                      : "MATIC"}
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
              </div>
            </div>
          </div>
        </div>
        <div>
          <Button
            onClick={() => setTab(0)}
            className={tab === 0 ? "mv-profile-tab-selected" : ""}
            id={
              rootTheme === "light" && tab === 0
                ? "mv-profile-tab-selected-light"
                : ""
            }
          >
            NFTs
          </Button>
          <Button
            onClick={() => setTab(1)}
            className={tab === 1 ? "mv-profile-tab-selected" : ""}
            id={
              rootTheme === "light" && tab === 1
                ? "mv-profile-tab-selected-light"
                : ""
            }
          >
            Description
          </Button>
          <Button
            onClick={() => setTab(2)}
            className={tab === 2 ? "mv-profile-tab-selected" : ""}
            id={
              rootTheme === "light" && tab === 2
                ? "mv-profile-tab-selected-light"
                : ""
            }
          >
            Activity
          </Button>
          {tab === 0 && (
            <Select suffixIcon={<SelectArrow />} defaultValue="1">
              <Option value="1">Date Minted - Newest</Option>
              <Option value="2">Date Minted - Newest</Option>
              <Option value="3">Date Minted - Newest</Option>
            </Select>
          )}
        </div>
        {tab === 0 && (
          <>
            {loading === false &&
              currenctCollection?.collection?.NFTs &&
              currenctCollection?.collection?.NFTs.length === 0 && (
                <div
                  style={{
                    width: "100%",
                    textAlign: "center",
                    marginTop: "5vh",
                  }}
                >
                  This Collection doesn't have any NFTs yet.
                </div>
              )}
            <div className="mv-product-section-one-list">
              {currenctCollection?.collection?.NFTs &&
                currenctCollection?.collection?.NFTs.length > 0 &&
                currenctCollection?.collection?.NFTs?.map((product, index) => (
                  <div
                    className={
                      rootTheme === "light"
                        ? "mv-product-section-one-list-item-light"
                        : ""
                    }
                    key={index}
                    style={{ position: "relative" }}
                    id={loading === true ? "mv-product-item-loading" : ""}
                  >
                    {loading === true ? (
                      <Loading />
                    ) : (
                      <>
                        <div>{product.displayName}</div>
                        <img
                          src={`${config.IPFS}/${product.fileURL}`}
                          alt="product"
                        />
                        <div>
                          {currenctCollection &&
                          currenctCollection?.owner_collection?.avatar ? (
                            <img
                              src={`${config.url_NFTnize.replace(
                                "/api/v1",
                                "/static"
                              )}/${
                                currenctCollection?.owner_collection?.avatar
                              }`}
                              width={25}
                              height={25}
                              style={{ marginRight: "10px" }}
                              alt="profile avatar"
                            />
                          ) : (
                            <img
                              src={avatarImage}
                              style={{ marginRight: "10px" }}
                              height={25}
                              width={25}
                              alt="creator"
                            />
                          )}
                          <span>{product.owner.substr(0, 10)} ...</span>
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
                            {product.price}
                          </div>
                          <div>{product.timeAuction && product.end}</div>
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
                            onClick={() => {
                              route.push(
                                `/nft/detail/${param.contractAddress}:${product.tokenId}`
                              )
                            }}
                          >
                            <span>View NFT</span>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
        {tab === 1 && (
          <div
            className={`mv-collection-body-desc ${
              rootTheme === "light" ? "mv-collection-body-desc-light" : ""
            }`}
          >
            {setItemURI.description}
          </div>
        )}
        {tab === 2 && (
          <div
            className={`mv-collection-body-list ${
              rootTheme === "light" ? "mv-collection-body-list-light" : ""
            }`}
          >
            <div>Sales History</div>
            <div>
              <div>
                <div>Artwork</div>
                <div>
                  <div> </div>
                  <div>From</div>
                  <div>To</div>
                  <div>Type</div>
                  <div>Price</div>
                  <div>Date</div>
                </div>
              </div>
              {currenctCollection?.histories?.map((dd, index) => (
                <div key={index}>
                  <div>
                    <img
                      src={`${config.IPFS}/${dd.NFT.fileURL}`}
                      alt="artwork"
                      width={80}
                      height={80}
                    />
                  </div>
                  <div>
                    <div># {dd.NFT.displayName}</div>
                    <div>
                      <img src={miniAvatar} alt="mini avatar" />@
                      {dd.from.substr(0, 9)} ...
                    </div>
                    <div>
                      <img src={miniAvatar} alt="mini avatar" />@
                      {dd.to.substr(0, 9)} ...
                    </div>
                    <div>{dd.NFT.timeAuction ? "Auction" : "Fix price"}</div>
                    <div>{dd.price} ETH</div>
                    <div>4 Days ago</div>
                  </div>
                </div>
              ))}
              {loading === false &&
                currenctCollection?.histories &&
                currenctCollection?.histories.length === 0 && (
                  <div
                    style={{
                      width: "100%",
                      textAlign: "center",
                      marginTop: "5vh",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    There is no activities.
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Body
