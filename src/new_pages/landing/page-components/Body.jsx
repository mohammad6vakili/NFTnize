import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import "../page-assets/Landing.css"
import { useSelector } from "react-redux"
import Header from "./Header"
import Footer from "./Footer"
import headerLogo from "../page-assets/new-logo.png"
import avatarImage from "../page-assets/avatar.jpg"
import creatorImage from "../page-assets/creator.svg"
import galleryPopoverImage from "../page-assets/gallery-popover-image.png"
import creatorBordered from "../page-assets/creator-bordered.svg"
import productImage from "../page-assets/product-one.png"
import bidWhite from "../page-assets/bid-white.png"
import bidBlack from "../page-assets/bid-black.svg"
import allIcon from "../page-assets/all-icon.png"
import blackArrow from "../page-assets/black-arrow.svg"
import blackStars from "../page-assets/stars-black.svg"
import whiteStars from "../page-assets/stars-white.svg"
import whiteRightArrow from "../page-assets/right-arrow-white.svg"
import rightArrow from "../page-assets/right-arrow-landing-top.svg"
import { Button, Modal, Popover } from "antd"
import "antd/dist/antd.css"
import productsOne from "../FakeData/Products-one"
import Collections from "../FakeData/Collections"
import Profiles from "../FakeData/Profiles"
import Articles from "../FakeData/Articles"
import Loading from "./Loading"
import { contentLoaderColors } from "../../../utils/config"
import ContentLoader from "react-content-loader"

const Body = () => {
  const history = useHistory()
  const { rootTheme } = useSelector((state) => state.application)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])

  const creatorModal = (
    <div
      className={`mv-info-modals-parts ${
        rootTheme === "light" && "mv-info-modals-parts-light"
      }`}
    >
      <div className="mv-info-modals-part-one">
        <img src={creatorImage} alt="creator" />
        <Button>Follow</Button>
      </div>
      <div className="mv-info-modals-part-two">
        <span style={{ color: "white" }}>Algo Ram #025 </span>
        <span>@Algoram#25</span>
      </div>
      <div className="mv-info-modals-part-three">
        Marcelo Pinel is graduate in Visual Arts from UFMG, Brazil. Cyber
        ​​Mystic Garden it's the archetypical laboratory, where Alchemy,
        metaphysics, ancient cultures merges with neon of the future.
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
          <img src={creatorImage} alt="info" /> @Artgallery
        </div>
        <Button>Self</Button>
      </div>
      <div>
        <img src={galleryPopoverImage} alt="gallery" />
      </div>
      <div>Happy Man</div>
    </div>
  )

  return (
    <div
      className={
        rootTheme === "dark"
          ? "mv-dark-landing mv-landing"
          : "mv-light-landing mv-landing"
      }
    >
      <Header />
      <div className="mv-landing-main-top">
        <div>
          <div>
            <div>
              # Charles Jakson 24
              {rootTheme === "dark" ? (
                <img
                  className="mv-landing-nft-rate-stars"
                  src={whiteStars}
                  alt="rate"
                />
              ) : (
                <img
                  className="mv-landing-nft-rate-stars"
                  src={blackStars}
                  alt="rate"
                />
              )}
            </div>
            <div
              className={
                rootTheme === "light" ? "mv-landing-main-top-first-light" : ""
              }
            >
              <div>
                <span>Created by</span>
                <Popover content={creatorModal} title="" placement="left">
                  <div className="mv-landing-hover-clear">
                    <img
                      src={creatorImage}
                      alt="info"
                      style={{ marginRight: "5px" }}
                    />{" "}
                    @algo ram #025
                  </div>
                </Popover>
              </div>
              <div>
                <span>Collection</span>
                <Popover content={collectionModal} title="" placement="left">
                  <div>
                    <img
                      src={creatorImage}
                      alt="info"
                      style={{ marginRight: "5px" }}
                    />{" "}
                    @Artgallery
                  </div>
                </Popover>
              </div>
              <div>
                <span>Current Bid</span>
                <div style={{ boxShadow: "unset" }}>
                  {rootTheme === "dark" ? (
                    <img
                      src={bidWhite}
                      style={{ marginRight: "5px" }}
                      alt="price"
                    />
                  ) : (
                    <img
                      src={bidBlack}
                      style={{ marginRight: "5px" }}
                      alt="price"
                    />
                  )}{" "}
                  7 ALGO
                </div>
              </div>
              <div>
                <span>Owner by</span>
                <Popover content={creatorModal} title="" placement="left">
                  <div>
                    <img
                      src={creatorImage}
                      alt="info"
                      style={{ marginRight: "5px" }}
                    />{" "}
                    @David Jobs
                  </div>
                </Popover>
              </div>
            </div>
            <Button
              style={{ marginRight: "auto", marginTop: "50px", color: "white" }}
              className={`mv-landing-bid-btn ${
                rootTheme === "light" && "mv-header-connect-btn-light"
              }`}
            >
              <span>Bid</span>
            </Button>
          </div>
        </div>
        <div>
          <div>
            <img
              className={`mv-landing-main-top-image ${
                rootTheme === "dark" ? "mv-landing-main-top-image-dark" : ""
              }`}
              src={productImage}
              alt="product"
            />
          </div>
        </div>
        {rootTheme === "light" ? (
          <img
            src={rightArrow}
            alt="arrow"
            className="mv-landing-main-top-direction-arrow"
          />
        ) : (
          <img
            src={whiteRightArrow}
            alt="arrow"
            className="mv-landing-main-top-direction-arrow"
          />
        )}
      </div>
      <div className="mv-product-section-one">
        <div className="mv-product-section-one-title">
          <div>Trending</div>
          <div style={{ fontSize: "12px" }}>
            View all
            {rootTheme === "dark" ? (
              <img
                src={allIcon}
                alt="all"
                style={{ marginLeft: "3px", width: "14px" }}
              />
            ) : (
              <img
                src={blackArrow}
                alt="all"
                style={{ marginLeft: "3px", width: "18px" }}
              />
            )}
          </div>
        </div>
        <div className="mv-product-section-one-list">
          {productsOne &&
            productsOne.length > 0 &&
            productsOne.map((product, index) => (
              <div
                className={
                  rootTheme === "light"
                    ? "mv-product-section-one-list-item-light"
                    : ""
                }
                key={index}
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
                          src={avatarImage}
                          alt="product creator"
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
                  </>
                )}
              </div>
            ))}
        </div>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Button
            style={{ color: "white", marginTop: "50px" }}
            className={`mv-landing-bid-btn ${
              rootTheme === "light" && "mv-header-connect-btn-light"
            }`}
            onClick={() => history.push("/trending")}
          >
            <span>View All</span>
          </Button>
        </div>
      </div>
      <div className="mv-product-section-two">
        <div className="mv-product-section-one-title">
          <div>Featured Collection</div>
          <div style={{ fontSize: "12px" }}>
            View all
            {rootTheme === "dark" ? (
              <img
                src={allIcon}
                alt="all"
                style={{ marginLeft: "3px", width: "14px" }}
              />
            ) : (
              <img
                src={blackArrow}
                alt="all"
                style={{ marginLeft: "3px", width: "18px" }}
              />
            )}
          </div>
        </div>
        <div className="mv-product-section-one-list">
          {Collections &&
            Collections.length > 0 &&
            Collections.map((collection, index) => (
              <div
                className={`mv-collection-item ${
                  rootTheme === "light" && "mv-collection-item-light"
                }`}
                id={loading === true ? "mv-product-item-loading" : ""}
                key={index}
              >
                {loading === true ? (
                  <Loading />
                ) : (
                  <>
                    <div>
                      <img src={collection.productImg} alt="product" />
                      <span>{collection.title}</span>
                      <span>({collection.username})</span>
                      {rootTheme === "dark" ? (
                        <img src={collection.darkImage} alt="collector" />
                      ) : (
                        <img src={collection.collectorImage} alt="collector" />
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
                          src={avatarImage}
                          alt="creator"
                        />
                      )}
                      <span>{collection.creatorName}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Button
            style={{ color: "white", marginTop: "50px" }}
            className={`mv-landing-bid-btn ${
              rootTheme === "light" && "mv-header-connect-btn-light"
            }`}
            onClick={() => history.push("/explore")}
          >
            <span>View All</span>
          </Button>
        </div>
      </div>
      <div className="mv-product-section-one">
        <div className="mv-product-section-one-title">
          <div>Featured NFTs</div>
          <div style={{ fontSize: "12px" }}>
            View all
            {rootTheme === "dark" ? (
              <img
                src={allIcon}
                alt="all"
                style={{ marginLeft: "3px", width: "14px" }}
              />
            ) : (
              <img
                src={blackArrow}
                alt="all"
                style={{ marginLeft: "3px", width: "18px" }}
              />
            )}
          </div>
        </div>
        <div className="mv-product-section-one-list">
          {productsOne &&
            productsOne.length > 0 &&
            productsOne.map((product, index) => (
              <div
                className={
                  rootTheme === "light"
                    ? "mv-product-section-one-list-item-light"
                    : ""
                }
                key={index}
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
                          src={avatarImage}
                          alt="product creator"
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
                  </>
                )}
              </div>
            ))}
        </div>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Button
            style={{ color: "white", marginTop: "50px" }}
            className={`mv-landing-bid-btn ${
              rootTheme === "light" && "mv-header-connect-btn-light"
            }`}
            onClick={() => history.push("/explore")}
          >
            <span>View All</span>
          </Button>
        </div>
      </div>
      <div className="mv-product-section-one">
        <div className="mv-product-section-one-title">
          <div>Feautured Profiles</div>
          <div style={{ fontSize: "12px" }}>
            View all
            {rootTheme === "dark" ? (
              <img
                src={allIcon}
                alt="all"
                style={{ marginLeft: "3px", width: "14px" }}
              />
            ) : (
              <img
                src={blackArrow}
                alt="all"
                style={{ marginLeft: "3px", width: "18px" }}
              />
            )}
          </div>
        </div>
        <div className="mv-product-section-one-list">
          {Profiles &&
            Profiles.length > 0 &&
            Profiles.map((profile, index) => (
              <div
                onClick={() => history.push("/profile")}
                className={`mv-profile-item ${
                  rootTheme === "light" && "mv-profile-item-light"
                }`}
                key={index}
                id={loading === true ? "mv-product-item-loading" : ""}
              >
                {loading === true ? (
                  <Loading />
                ) : (
                  <>
                    <div>{profile.title}</div>
                    <div>
                      <img src={profile.profileImage} alt="profile" />
                      <img src={profile.thumbnail} alt="profile avatar" />
                    </div>
                    <div>{profile.username}</div>
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
                        {profile.follower}
                      </div>
                    </div>
                    <Button
                      className={`mv-profile-follow-btn ${
                        rootTheme === "light" && "mv-profile-follow-btn-light"
                      }`}
                    >
                      Follow
                    </Button>
                  </>
                )}
              </div>
            ))}
        </div>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Button
            style={{ color: "white", marginTop: "50px" }}
            className={`mv-landing-bid-btn ${
              rootTheme === "light" && "mv-header-connect-btn-light"
            }`}
            onClick={() => history.push("/explore")}
          >
            <span>View All Creators</span>
          </Button>
        </div>
      </div>
      {/* <div className="mv-product-section-one">
        <div className="mv-product-section-one-title">
          <div>Blog</div>
          <div style={{ fontSize: "12px" }}>
            View all Articles
            {rootTheme === "dark" ? (
              <img
                src={allIcon}
                alt="all"
                style={{ marginLeft: "3px", width: "14px" }}
              />
            ) : (
              <img
                src={blackArrow}
                alt="all"
                style={{ marginLeft: "3px", width: "18px" }}
              />
            )}
          </div>
        </div>
        <div className="mv-product-section-one-list mv-articles">
          {Articles &&
            Articles.length > 0 &&
            Articles.map((article, index) => {
              if (loading === true) {
                return (
                  <div
                    className={`mv-card-loading mv-card-loading-blog ${
                      rootTheme === "light" ? "mv-card-loading-blog-light" : ""
                    }`}
                  >
                    <ContentLoader
                      speed={2}
                      viewBox="0 0 505 260"
                      backgroundColor={contentLoaderColors.background}
                      foregroundColor={contentLoaderColors.foreground}
                    >
                      <rect
                        x="0"
                        y="0"
                        rx="4"
                        ry="4"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </ContentLoader>{" "}
                  </div>
                )
              } else {
                return (
                  <div
                    className={`mv-article-item ${
                      rootTheme === "light" ? "mv-article-item-light" : ""
                    }`}
                    id="mv-article-item"
                    key={article}
                  >
                    <div>
                      <img src={article.articleImage} alt="article" />
                    </div>
                    <div>
                      <div>{article.title}</div>
                      <div>{article.content}</div>
                      <div>
                        <div>
                          <div style={{ fontSize: "12px" }}>Published</div>
                          <div>{article.date}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
            })}
        </div>
        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <Button
            style={{ color: "white", marginTop: "50px" }}
            className={`mv-landing-bid-btn ${
              rootTheme === "light" && "mv-header-connect-btn-light"
            }`}
          >
            <span>View All Articles</span>
          </Button>
        </div>
      </div> */}
      <Footer />
    </div>
  )
}

export default Body
