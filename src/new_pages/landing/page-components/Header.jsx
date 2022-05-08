import React, { useState, useLayoutEffect, useEffect, useRef } from "react"
import "../page-assets/Header.css"
import ERC20ABI from "utils/mint/abis/ERC20.json"
import classNames from "classnames"
import { useWeb3React } from "@web3-react/core"
import { config } from "utils/config"
import useLocalStorage from "use-local-storage"
import {
  toggleTheme,
  setGlobalUserInfo,
} from "../../../redux/application/application-slice"
import classes from "../../../new_components/Header/Header.module.scss"
import headerLogo from "../page-assets/new-logo.png"
import lightOff from "../page-assets/light-off.svg"
import creatorIcon from "../page-assets/creator.svg"
import { Button, Modal, Select } from "antd"
import { Link, useLocation, useHistory } from "react-router-dom"
import lightActive from "../page-assets/light-active.svg"
import ethIcon from "../page-assets/eth.svg"
import SelectArrow from "new_pages/mint/page-components/SelectArrow"
import { useDispatch, useSelector } from "react-redux"
import hamIcon from "../page-assets/menu.png"
import PolyIcon from "../page-assets/bid-white.png"
import avatarImage from "../page-assets/avatar.jpg"
import CheckedIcon from "../page-assets/Checked.svg"
import darkOff from "../page-assets/dark-off.svg"
import darkActive from "../page-assets/dark-active.svg"
import exitIcon from "../page-assets/exit-icon.svg"
import { ReactComponent as CloseIcon } from "new_assets/icons/close.svg"
import {
  MdOutlineRealEstateAgent,
  MdPermIdentity,
  SiInfluxdb,
  GiSellCard,
  GiBrokenHeartZone,
  GiDiamondTrophy,
  GiDiamondsSmile,
  GiAnimalHide,
  GiVintageRobot,
  GiConsoleController,
  GiFishingBoat,
  GiWorld,
  MdOutlineTravelExplore,
  MdVideoSettings,
  MdSportsHandball,
  IoTicketOutline,
  MdCardMembership,
  MdOutlineMedicalServices,
  GiGlowingArtifact,
} from "react-icons/all"
import { BiTrendingUp } from "react-icons/bi"
import { IoMdPhotos } from "react-icons/io"
import { FiBookOpen } from "react-icons/fi"
import { SiWorldhealthorganization } from "react-icons/si"
import { BsMusicNoteBeamed, BsBuilding } from "react-icons/bs"
import { FaCoins } from "react-icons/fa"
import { AiOutlineCamera, AiFillCar } from "react-icons/ai"
import { ImBooks } from "react-icons/im"
import { HiOutlineDocumentText } from "react-icons/hi"
import useWallet from "hooks/useWallet"
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
import { formatAddress } from "utils/helper"
import { Snackbar } from "../../../components/Snackbar/Snackbar"
import HttpService from "utils/httpService"
import { signMessage } from "utils/mint"
import { changeNetwork } from "utils/changeNetwork"

const { Option } = Select

const Header = () => {
  const location = useLocation()
  const history = useHistory()
  const dispatch = useDispatch()
  const {
    active: connected,
    connector,
    error,
    account,
    library,
  } = useWeb3React()
  const { connect, deactive } = useWallet()
  const httpservice = new HttpService()
  const [hamOpen, setHamOpen] = useState(false)
  const [userInfo, setuserInfo] = useState({})
  const [subItemsBuy, setsubItemsBuy] = useState([])
  const [balance, setbalance] = useState("0")
  const [WETHOFbalance, setWETHOFbalance] = useState("0")
  const [currentNetwork, setcurrentNetwork] = useState("")
  const [ready, setReady] = useState(false)
  const [menuItems, setMenuItems] = useState([
    {
      label: "Buy",
      to: "/buy",
    },
    {
      label: "NFTnize",
      to: "/nftnize",
    },
    {
      label: "preNFTs",
      to: "https://www.nftnize.io/prenfts",
    },
  ])
  const [profileModal, setProfileModal] = useState(false)
  const { rootTheme } = useSelector((state) => state.application)

  const snackbarInitValues = {
    isActive: false,
    text: "",
    color: "",
    timeout: 3000,
  }
  const [snackbar, setSnackbar] = useState(snackbarInitValues)

  const [currencies, setcurrencies] = useState([])
  const [pair, setpair] = useState("")
  const [price, setprice] = useState("0.00")
  const [pastData, setpastData] = useState({})
  // const ws = useRef(null)

  // const first = useRef(false)
  // const urlCoinBase = "https://api.pro.coinbase.com"

  // useEffect(() => {
  //   if (!first.current) {
  //     return
  //   }
  //   const wss = new WebSocket("wss://ws-feed.pro.coinbase.com")
  //   const msg = {
  //     type: "subscribe",
  //     product_ids: [pair],
  //     channels: ["ticker"],
  //   }
  //   const jsonMsg = JSON.stringify(msg)
  //   wss.send(jsonMsg)

  //   wss.onmessage = (e) => {
  //     const data = JSON.parse(e.data)
  //     if (data.type !== "ticker") {
  //       return
  //     }
  //     console.log("price", data.price * 0.1)
  //     if (data.product_id === pair) {
  //       setprice(data.price)
  //     }
  //   }
  // }, [pair])

  const showMessage = ({ text, color, timeout }) => {
    setSnackbar({ isActive: true, text, color, timeout })
  }

  const switchTheme = () => {
    const newTheme = rootTheme === "light" ? "dark" : "light"
    dispatch(toggleTheme(newTheme))
  }

  const isActiveNavItem = (label) => {
    const pathName = location.pathname.split("/")[1]

    if (pathName === "explore" && label === "Explore") {
      return true
    }
    if (pathName === "buy" && label === "Buy") {
      return true
    }
    if (pathName === "sell" && label === "Sell") {
      return true
    }

    if (pathName === "nftnize" && label === "NFTnize") {
      return true
    }
    return false
  }

  const navIcons = [
    {
      label: "Explore All",
      route: "/explore",
      icon: <MdOutlineTravelExplore />,
    },
    {
      label: "Trending",
      route: "/trending",
      icon: <BiTrendingUp />,
    },
    {
      label: "Top Sellers",
      route: "",
      icon: <GiSellCard />,
    },
    {
      label: "Art (all paintings)",
      route: "",
      icon: <GiBrokenHeartZone />,
    },
    {
      label: "Antiques (anything)",
      route: "",
      icon: <SiWorldhealthorganization />,
    },
    {
      label: "Fine Art (the Masters)",
      route: "",
      icon: <GiDiamondTrophy />,
    },
    {
      label: "Digital Art and Animations",
      route: "",
      icon: <GiDiamondsSmile />,
    },
    {
      label: "Pokémon cards",
      route: "",
      icon: <GiAnimalHide />,
    },
    {
      label: "Comic (books and magazines)",
      route: "",
      icon: <FiBookOpen />,
    },
    {
      label: "Vintage (anything)",
      route: "",
      icon: <GiVintageRobot />,
    },
    {
      label: "Gaming (things, tools, characters)",
      route: "",
      icon: <GiConsoleController />,
    },
    {
      label: "Photos (unique and rare)",
      route: "",
      icon: <IoMdPhotos />,
    },
    {
      label: "Music (clips, tracks and songs)",
      route: "",
      icon: <BsMusicNoteBeamed />,
    },
    {
      label: "Videos and Films (unique and rare)",
      route: "",
      icon: <MdVideoSettings />,
    },
    {
      label: "Collectibles (coins, stamps, etc.)",
      route: "",
      icon: <FaCoins />,
    },
    {
      label: "Domain Names",
      route: "",
      icon: <GiSellCard />,
    },
    {
      label: "Photography",
      route: "",
      icon: <AiOutlineCamera />,
    },
    {
      label: "Sports (trading cards, jersey, rings, trophies)",
      route: "",
      icon: <MdSportsHandball />,
    },
    {
      label: "Signatures & Documents",
      route: "",
      icon: <HiOutlineDocumentText />,
    },
    {
      label: "Books (old, new, one of a kind)",
      route: "",
      icon: <ImBooks />,
    },
    {
      label: "Cars (rare classics and FAST!!!)",
      route: "",
      icon: <AiFillCar />,
    },
    {
      label: "Boats, Trains and Airplanes",
      route: "",
      icon: <GiFishingBoat />,
    },
    {
      label: "Real estate (land, buildings, structures)",
      route: "",
      icon: <BsBuilding />,
    },
    {
      label: "Virtual Worlds (metaverse)",
      route: "",
      icon: <GiWorld />,
    },
    {
      label: "Tickets (Sports, Concert, Airline, Cruise, Space, Travel, etc.)",
      route: "",
      icon: <IoTicketOutline />,
    },
    {
      label: "Memberships (Clubs, Sports, Life/Season Passes, etc.)",
      route: "",
      icon: <MdCardMembership />,
    },
    {
      label: "Identity (Person, Animal, etc.)",
      route: "",
      icon: <MdPermIdentity />,
    },
    {
      label: "Real Estates (Deeds, Will, Trust, etc.)",
      route: "",
      icon: <MdOutlineRealEstateAgent />,
    },
    {
      label: "Medical (Person Records, etc.)",
      route: "",
      icon: <MdOutlineMedicalServices />,
    },
    {
      label: "Luxury (Brands, Goods, etc.)",
      route: "",
      icon: <SiInfluxdb />,
    },
    {
      label: "Estate (Real, Personal, etc.)",
      route: "",
      icon: <MdOutlineRealEstateAgent />,
    },
    {
      label: "Artifacts (Alien, Egyptian, etc.)",
      route: "",
      icon: <GiGlowingArtifact />,
    },
  ]

  const LogoutAccount = async () => {
    if (connected || error) {
      setProfileModal(false)
      deactive()
      if (!library.currentProvider.isMetaMask) {
        connector.close()
      }

      showMessage({
        text: "Wallet logged out Successfully!",
        color: "success",
      })
    }
  }

  const balanceOfWETH = async () => {
    if (
      (library && window.ethereum.networkVersion === "4") ||
      window.ethereum.networkVersion === "1"
    ) {
      const contract = new library.eth.Contract(ERC20ABI, config.WETHAddress)
      const { methods } = contract
      const balanceWETH = await methods.balanceOf(account).call()
      return balanceWETH
    }
  }

  const handleSelectedWallet = async (provider = null) => {
    if (
      window.ethereum.networkVersion === "4" ||
      window.ethereum.networkVersion === "1"
    ) {
      showMessage({
        text: "Wallet Logged in Successfully!",
        color: "success",
      })
      await connect(MetaMask)
    } else if (
      window.ethereum.networkVersion === "80001" ||
      window.ethereum.networkVersion === "137"
    ) {
      showMessage({
        text: "Wallet Logged in Successfully!",
        color: "success",
      })
      await connect(MetaMaskPolygon)
    }
  }

  const getCategories = async () => {
    const res = await httpservice.get(`${config.url_NFTnize}/category`, {})
    return res.data.data
  }

  const getUserInfo = async () => {
    const url = `${config.url_NFTnize}/user/${account.toLowerCase()}`
    const res = await httpservice.get(url, {})
    return res.data
  }

  useLayoutEffect(() => {
    getCategories().then((category) => {
      category.forEach((catt) => {
        navIcons.forEach((icons) => {
          if (catt.name === icons.label) {
            catt.icon = icons.icon
          }
        })
      })
      let buyCat = []
      let sellCat = []
      buyCat = category.filter(
        (cat) =>
          cat.total_items > 0 ||
          cat.name === "Explore All" ||
          cat.name === "Top Sellers" ||
          cat.name === "Trending"
      )
      sellCat = category.filter(
        (cat) =>
          cat.name !== "Explore All" &&
          cat.name !== "Top Sellers" &&
          cat.name !== "Trending"
      )
      buyCat.forEach((cat) => {
        if (cat.route === "markets") {
          Object.assign(cat, {
            route: "explore",
          })
        }
      })
      menuItems.forEach((menuItem) => {
        if (menuItem.label === "Buy") {
          menuItem.subItems = buyCat.sort(({ name: a }, { name: b }) =>
            a === "Trending" || a === "Top Sellers" || a === "Explore All"
              ? 0
              : b === "Trending" || b === "Top Sellers" || b === "Explore All"
              ? 1
              : a.localeCompare(b)
          )

          // buyCat.sort(
          //   (a, b) => a.name !== "Explore All" && a.name.localeCompare(b.name)
          // )
        }
        if (menuItem.label === "NFTnize") {
          menuItem.subItems = sellCat.sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        }
      })
      setReady(true)
    })
  }, [])

  useEffect(() => {
    if (account) {
      getUserInfo().then((user) => {
        setuserInfo(user.result)
        dispatch(setGlobalUserInfo(user.result))
      })
    }

    if (
      window.ethereum.networkVersion === "4" ||
      window.ethereum.networkVersion === "1"
    ) {
      setcurrentNetwork("1")
      localStorage.setItem("selectedNetwork", "Eth")
      // setpair("ETH-USD")
    } else if (
      window.ethereum.networkVersion === "80001" ||
      window.ethereum.networkVersion === "137"
    ) {
      setcurrentNetwork("2")
      localStorage.setItem("selectedNetwork", "Plg")
      // setpair("MATIC-USD")
    }
    if (library) {
      const balanceUser = library.eth.getBalance(account).then((balanceOf) => {
        const c = library.utils.fromWei(balanceOf).toString()
        setbalance(c)
      })
    }
    if (
      window.ethereum.networkVersion === "4" ||
      window.ethereum.networkVersion === "1"
    ) {
      balanceOfWETH().then((Wethbalance) => {
        if (library) {
          const WETH = library.utils.fromWei(Wethbalance).toString()
          setWETHOFbalance(WETH)
        }
      })
    }
  }, [])

  // useEffect(() => {
  //   console.log("price", price * balance)
  // }, [price, balance])

  useEffect(() => {
    if (currentNetwork === "1") {
      localStorage.setItem("selectedNetwork", "Eth")
      changeNetwork("Eth")
      setcurrentNetwork("1")
    } else if (currentNetwork === "2") {
      localStorage.setItem("selectedNetwork", "Plg")
      changeNetwork("Plg")
      setcurrentNetwork("2")
    }
  }, [currentNetwork])

  useEffect(() => {
    if (ready === true) {
      menuItems.forEach((navItem) => {
        if (navItem.subItems) {
          navItem.menus = []
          let menu = []
          for (let i = 0; i < navItem.subItems.length; i++) {
            menu.push(navItem.subItems[i])
            if (i % 8 === 7) {
              navItem.menus.push(menu)
              menu = []
            }
          }
          if (menu.length) {
            navItem.menus.push(menu)
          }
        }
        return navItem
      })
    }
  }, [ready])

  const handleSignUser = async () => {
    if (localStorage.getItem("auth")) {
      const checkAuth = JSON.parse(localStorage.getItem("auth"))
      if (checkAuth?.site) {
        if (
          checkAuth?.account !== account &&
          checkAuth?.site !== config.url_NFTnize
        ) {
          await signMessage(account, library)
        }
      } else {
        await signMessage(account, library)
      }
    } else {
      await signMessage(account, library)
    }
    history.push(`/profile/${account}?type=sale`)
    setProfileModal(false)
  }

  return (
    <div
      className={
        rootTheme === "dark"
          ? "mv-dark-landing-header mv-landing-header"
          : "mv-light-landing-header mv-landing-header"
      }
    >
      <Modal
        style={{ margin: "0" }}
        bodyStyle={{ left: "0", top: "60px", margin: "0", padding: "0" }}
        visible={hamOpen}
        onCancel={() => setHamOpen(false)}
      >
        <div className="mv-ham-menu">
          <div className="mv-ham-profile-btn">
            {connected ? (
              // profile button
              <Button
                className="mv-header-profile-button"
                onClick={() => setProfileModal(true)}
              >
                {" "}
                {userInfo && userInfo.avatar && (
                  <img
                    src={`${config.url_NFTnize.replace("/api/v1", "/static")}/${
                      userInfo?.avatar
                    }`}
                    alt="profile avatar"
                  />
                )}
              </Button>
            ) : (
              <Button
                className="mv-header-connect-btn"
                style={{ color: "#0cff6d" }}
                onClick={() => handleSelectedWallet()}
              >
                Connect Wallet
              </Button>
            )}
          </div>
          <div className="mv-landing-ham-links">
            <a href="/buy">Buy</a>
            <a href="/nftnize">NFTnize</a>
            <a href="https://www.nftnize.io/prenfts">PreNFTs</a>
            <a href="#About">About</a>
            <a href="#Blog">Blog</a>
            <a href="#Press">Press</a>
            <a href="#Careers">Careers</a>
            <a href="#Community Guidelines">Community Guidelines</a>
            <a href="#Help">Help</a>
          </div>
          <img src={headerLogo} alt="logo" />
        </div>
      </Modal>
      <div className="mv-header-content">
        <div>
          <a
            href="#page"
            onClick={() => setHamOpen(!hamOpen)}
            className="mv-landing-ham-icon"
          >
            <img src={hamIcon} alt="menu" />
          </a>
          <button
            type="button"
            className="mv-landing-header-logo"
            onClick={() => history.push("/")}
          >
            <img src={headerLogo} alt="logo" />
          </button>
          <div className="mv-landing-header-links">
            <nav
              style={{ position: "relative", margin: "0" }}
              className={classes.nav}
            >
              {menuItems &&
                menuItems.map((navItem, index) => (
                  <div
                    style={{
                      margin: "0",
                    }}
                    key={index}
                    className={classes.dropdown}
                  >
                    {navItem.label === "preNFTs" ? (
                      <a
                        href={navItem.to}
                        className="mv-header-links"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {navItem.label}
                      </a>
                    ) : (
                      <>
                        <a
                          href={navItem.to}
                          key={index}
                          className="mv-header-links"
                          id={
                            location.pathname === navItem.to
                              ? "mv-nav-item-selected"
                              : ""
                          }
                        >
                          {navItem.label}
                        </a>
                        {/* Dropdown List for Markets */}
                        {navItem.subItems && (
                          <ul
                            id={
                              rootTheme === "dark"
                                ? "mv-dropdown-content"
                                : "mv-dropdown-content-light"
                            }
                            className={classes["dropdown-content"]}
                          >
                            <div className={classes.row}>
                              {navItem.menus &&
                                navItem.menus.map((menu, menuIndex) => (
                                  <div
                                    className={classes.col_lg_3}
                                    key={menuIndex}
                                  >
                                    <ul>
                                      {menu.map((menuItem, menuItemIndex) => (
                                        <li key={menuItemIndex}>
                                          {navItem.label === "NFTnize" ? (
                                            <Link
                                              to={`nftnize?${menuItem.route}`}
                                              key={menuItemIndex}
                                            >
                                              {menuItem.icon}
                                              {menuItem.name}
                                            </Link>
                                          ) : (
                                            <Link
                                              to={
                                                menuItem.route === "explore" ||
                                                menuItem.route === "trending" ||
                                                menuItem.route === "topseller"
                                                  ? `/${menuItem.route}`
                                                  : `/category/${menuItem.route}`
                                              }
                                              key={menuItemIndex}
                                            >
                                              {menuItem.icon}
                                              {menuItem.name}
                                            </Link>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                            </div>
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                ))}
            </nav>
          </div>
        </div>
        <div>
          {/* wallet button  */}
          {connected ? (
            // profile button
            <Button
              className="mv-header-profile-button"
              onClick={() => setProfileModal(true)}
            >
              {" "}
              {userInfo && userInfo.avatar && (
                <img
                  src={`${config.url_NFTnize.replace("/api/v1", "/static")}/${
                    userInfo?.avatar
                  }`}
                  alt="profile avatar"
                />
              )}
            </Button>
          ) : (
            <Button
              className="mv-header-connect-btn"
              style={{ color: "#0cff6d" }}
              onClick={() => handleSelectedWallet()}
            >
              Connect Wallet
            </Button>
          )}
          {/* theme changer  */}
          <div className="mv-header-theme-changer">
            <Button
              onClick={() => {
                dispatch(toggleTheme("light"))
              }}
            >
              {rootTheme === "dark" ? (
                <img style={{ border: "none" }} src={lightOff} alt="dark" />
              ) : (
                <img
                  className="mv-header-switch-theme-selected"
                  src={lightActive}
                  alt="dark"
                />
              )}
            </Button>
            <Button
              onClick={() => {
                dispatch(toggleTheme("dark"))
              }}
            >
              {rootTheme === "dark" ? (
                <img
                  className="mv-header-switch-theme-selected"
                  src={darkActive}
                  alt="dark"
                />
              ) : (
                <img style={{ border: "none" }} src={darkOff} alt="dark" />
              )}
            </Button>
          </div>
          {/* profile modal */}
          <Modal
            bodyStyle={{ padding: "0" }}
            width={window.outerWidth > 1500 ? 350 : 280}
            style={{
              padding: "0",
              top: "70px",
              right: "5px",
              marginRight: "0",
            }}
            visible={profileModal}
            onCancel={() => setProfileModal(false)}
            closable={false}
          >
            <div
              className={`mv-header-profile-modal ${
                rootTheme === "light" ? "mv-header-profile-modal-light" : ""
              }`}
            >
              {/* first section */}
              <div>
                {connected ? (
                  <span>
                    {" "}
                    Connected <img src={CheckedIcon} alt="connected" />
                  </span>
                ) : (
                  <span style={{ color: "#FF9900" }}>Disconnected</span>
                )}
              </div>
              {/* second section */}
              <div>
                <div>
                  {userInfo && userInfo.avatar ? (
                    <img
                      src={`${config.url_NFTnize.replace(
                        "/api/v1",
                        "/static"
                      )}/${userInfo?.avatar}`}
                      alt="profile avatar"
                    />
                  ) : (
                    <img src={avatarImage} alt="creator" />
                  )}
                  {userInfo &&
                    userInfo.username &&
                    `${userInfo.username.substr(0, 8)}...`}
                </div>
                <Button onClick={() => handleSignUser()}>View Profile</Button>
              </div>
              {/* third section */}
              <div> </div>
              {/* fourth section */}
              <Select
                value={currentNetwork}
                onChange={(Value) => {
                  setcurrentNetwork(Value)
                }}
                suffixIcon={<SelectArrow />}
                defaultValue="1"
              >
                <Option value="1">
                  <div className="mv-header-profile-modal-select-dropdown">
                    <div>
                      <img src={ethIcon} alt="eth" />
                    </div>
                    <div>
                      <span>{formatAddress(account)}</span>
                      <span>Ethereum - $ 0.00</span>
                    </div>
                  </div>
                </Option>
                <Option value="2">
                  <div className="mv-header-profile-modal-select-dropdown">
                    <div>
                      <img src={PolyIcon} alt="eth" />
                    </div>
                    <div>
                      <span>{formatAddress(account)}</span>
                      <span>Polygon - $ 0.00</span>
                    </div>
                  </div>
                </Option>
              </Select>
              {/* fifth section */}
              <div>
                <div>
                  <div>
                    <img
                      src={currentNetwork === "1" ? ethIcon : PolyIcon}
                      alt="eth"
                    />
                  </div>
                  <div>
                    <span>
                      {currentNetwork === "1" ? "Ethereum" : "Polygon"}
                    </span>
                    <span>
                      {balance?.substr(0, 6)}{" "}
                      {currentNetwork === "1" ? "ETH" : "MATIC"}
                    </span>
                  </div>
                </div>
                {currentNetwork === "1" && (
                  <div>
                    <div>
                      <img src={ethIcon} alt="eth" />
                    </div>
                    <div>
                      <span>Wrapper Ethereum</span>
                      <span>{WETHOFbalance} WETH</span>
                    </div>
                    <a href="/#">Convert</a>
                  </div>
                )}
              </div>
              {/* sixth section */}
              <div> </div>
              {/* seventh section */}
              <div>
                <Button onClick={() => history.push("/edit/profile")}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
                      stroke="white"
                      strokeWidth="1.7"
                      strokeMiterlimit="10"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 16.6006C16 13.2868 13.3138 10.6006 10 10.6006C6.6862 10.6006 4 13.2868 4 16.6006"
                      stroke="white"
                      strokeWidth="1.7"
                      strokeMiterlimit="10"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.9999 10.6004C11.9881 10.6004 13.5999 8.98862 13.5999 7.00039C13.5999 5.01217 11.9881 3.40039 9.9999 3.40039C8.01168 3.40039 6.3999 5.01217 6.3999 7.00039C6.3999 8.98862 8.01168 10.6004 9.9999 10.6004Z"
                      stroke="white"
                      strokeWidth="1.7"
                      strokeMiterlimit="10"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Edit profile
                </Button>
                <Button
                  onClick={() => {
                    history.push(`/profile/${account}?type=sale`)
                    localStorage.setItem("tabCollection", true)
                  }}
                >
                  <svg
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 18H5C4.20435 18 3.44129 17.6839 2.87868 17.1213C2.31607 16.5587 2 15.7956 2 15V5C2 4.73478 1.89464 4.48043 1.70711 4.29289C1.51957 4.10536 1.26522 4 1 4C0.734784 4 0.48043 4.10536 0.292893 4.29289C0.105357 4.48043 0 4.73478 0 5V15C0 16.3261 0.526784 17.5979 1.46447 18.5355C2.40215 19.4732 3.67392 20 5 20H13C13.2652 20 13.5196 19.8946 13.7071 19.7071C13.8946 19.5196 14 19.2652 14 19C14 18.7348 13.8946 18.4804 13.7071 18.2929C13.5196 18.1054 13.2652 18 13 18ZM18 6.94C17.9896 6.84813 17.9695 6.75763 17.94 6.67V6.58C17.8919 6.47718 17.8278 6.38267 17.75 6.3L11.75 0.3C11.6673 0.222216 11.5728 0.158081 11.47 0.11H11.38L11.06 0H7C6.20435 0 5.44129 0.316071 4.87868 0.87868C4.31607 1.44129 4 2.20435 4 3V13C4 13.7956 4.31607 14.5587 4.87868 15.1213C5.44129 15.6839 6.20435 16 7 16H15C15.7956 16 16.5587 15.6839 17.1213 15.1213C17.6839 14.5587 18 13.7956 18 13V7C18 7 18 7 18 6.94ZM12 3.41L14.59 6H13C12.7348 6 12.4804 5.89464 12.2929 5.70711C12.1054 5.51957 12 5.26522 12 5V3.41ZM16 13C16 13.2652 15.8946 13.5196 15.7071 13.7071C15.5196 13.8946 15.2652 14 15 14H7C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13V3C6 2.73478 6.10536 2.48043 6.29289 2.29289C6.48043 2.10536 6.73478 2 7 2H10V5C10 5.79565 10.3161 6.55871 10.8787 7.12132C11.4413 7.68393 12.2044 8 13 8H16V13Z"
                      fill="white"
                    />
                  </svg>
                  My Collections
                </Button>
              </div>
              {/* seventh section */}
              <Button
                onClick={() => {
                  if (connected) {
                    LogoutAccount()
                  } else {
                    handleSelectedWallet()
                  }
                }}
              >
                {connected ? "Sign out" : "Connect Wallet"}
              </Button>
              {/* close btn */}
              <button
                className={`mv-modal-close-btn ${
                  rootTheme === "light" ? "mv-modal-close-btn-light" : ""
                }`}
                type="button"
                onClick={() => setProfileModal(false)}
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
        </div>
      </div>
      <Snackbar
        text={snackbar.text}
        active={snackbar.isActive}
        color={snackbar.color}
        timeout={snackbar.timeout}
        onClose={() => setSnackbar({ ...snackbar, isActive: false })}
      />
    </div>
  )
}
export default Header
