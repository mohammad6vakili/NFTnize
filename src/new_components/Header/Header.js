import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useLocation, useHistory } from "react-router-dom"
import { SessionWallet } from "algorand-session-wallet"
import classNames from "classnames"
import { useWeb3React } from "@web3-react/core"
import {
  setSessionWallet,
  setAccounts,
  setConnectedStatus,
} from "redux/wallet/wallet-slice"
import {
  MdOutlineTravelExplore,
  MdVideoSettings,
  MdSportsHandball,
} from "react-icons/md"
import { BiTrendingUp } from "react-icons/bi"
import {
  GiSellCard,
  GiBrokenHeartZone,
  GiDiamondTrophy,
  GiDiamondsSmile,
  GiAnimalHide,
  GiVintageRobot,
  GiConsoleController,
  GiFishingBoat,
  GiWorld,
} from "react-icons/gi"
import { IoMdPhotos } from "react-icons/io"
import { FiBookOpen } from "react-icons/fi"
import { SiWorldhealthorganization } from "react-icons/si"
import { BsMusicNoteBeamed, BsBuilding } from "react-icons/bs"
import { FaCoins } from "react-icons/fa"
import { GrDomain } from "react-icons/gr"
import { AiOutlineCamera, AiFillCar } from "react-icons/ai"
import { ImBooks } from "react-icons/im"
import { HiOutlineDocumentText } from "react-icons/hi"
import { EthereumConnectors } from "components"
import { config } from "utils/config"
import { ReactComponent as MenuIcon } from "new_assets/icons/menu.svg"
import { ReactComponent as CloseIcon } from "new_assets/icons/close.svg"
// import HeaderLogo from "new_assets/logos/NFTnize-Logo.png"
import HeaderLogo from "new_assets/logos/dark.png"
import classes from "./Header.module.scss"

import { ReactComponent as ArrowLeftSmallIcon } from "new_assets/icons/arrow-left-small.svg"
import { ReactComponent as ArrowRightSmallIcon } from "new_assets/icons/arrow-right-small.svg"

export const Header = () => {
  const location = useLocation()
  const history = useHistory()
  const navItems = [
    // {
    //   label: "Markets",
    //   to: "/markets",
    // },
    {
      label: "Buy",
      to: "/buy?type=live",
      subItems: [
        {
          label: "Explore All",
          route: "markets",
          icon: <MdOutlineTravelExplore />,
        },
        {
          label: "Trending",
          route: "trending",
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
        // {
        //   label: "Antiques (anything)",
        //   route: "",
        //   icon: <SiWorldhealthorganization />,
        // },
        // {
        //   label: "Fine Art (the Masters)",
        //   route: "",
        //   icon: <GiDiamondTrophy />,
        // },
        // {
        //   label: "Digital Art and Animations",
        //   route: "",
        //   icon: <GiDiamondsSmile />,
        // },
        // {
        //   label: "Pokémon cards",
        //   route: "",
        //   icon: <GiAnimalHide />,
        // },
        // {
        //   label: "Comic (books and magazines)",
        //   route: "",
        //   icon: <FiBookOpen />,
        // },
        // {
        //   label: "Vintage (anything)",
        //   route: "",
        //   icon: <GiVintageRobot />,
        // },
        // {
        //   label: "Gaming (things, tools, characters)",
        //   route: "",
        //   icon: <GiConsoleController />,
        // },
        // {
        //   label: "Photos (unique and rare)",
        //   route: "",
        //   icon: <IoMdPhotos />,
        // },
        // {
        //   label: "Music (clips, tracks and songs)",
        //   route: "",
        //   icon: <BsMusicNoteBeamed />,
        // },
        // {
        //   label: "Videos and Films (unique and rare)",
        //   route: "",
        //   icon: <MdVideoSettings />,
        // },
        // {
        //   label: "Collectibles (coins, stamps, etc.)",
        //   route: "",
        //   icon: <FaCoins />,
        // },
        // {
        //   label: "Domain Names",
        //   route: "",
        //   icon: <GiSellCard />,
        // },
        // {
        //   label: "Photography",
        //   route: "",
        //   icon: <AiOutlineCamera />,
        // },
        // {
        //   label: "Sports (trading cards, jersey, rings, trophies)",
        //   route: "",
        //   icon: <MdSportsHandball />,
        // },
        // {
        //   label: "Signatures & Documents",
        //   route: "",
        //   icon: <HiOutlineDocumentText />,
        // },
        // {
        //   label: "Books (old, new, one of a kind)",
        //   route: "",
        //   icon: <ImBooks />,
        // },
        // {
        //   label: "Cars (rare classics and FAST!!!)",
        //   route: "",
        //   icon: <AiFillCar />,
        // },
        // {
        //   label: "Boats, Trains and Airplanes",
        //   route: "",
        //   icon: <GiFishingBoat />,
        // },
        // {
        //   label: "Real estate (land, buildings, structures)",
        //   route: "",
        //   icon: <BsBuilding />,
        // },
        // {
        //   label: "Virtual Worlds (metaverse)",
        //   route: "",
        //   icon: <GiWorld />,
        // },
      ],
    },
    {
      label: "Sell",
      to: "/sell",
      subItems: [
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
      ],
    },
    {
      label: "preNFTs",
      // to: "",
      to: "https://www.nftnize.io/prenfts",
    },
    {
      label: "NFTnize",
      to: "/nftnize",
    },
  ]

  navItems.map((navItem) => {
    if (navItem.subItems) {
      navItem.menus = []
      let menu = []
      for (let i = 0; i < navItem.subItems.length; i++) {
        menu.push(navItem.subItems[i])
        if (i % 6 === 5) {
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

  const dispatch = useDispatch()
  const sw = new SessionWallet(config.network)

  // const [connected, setConnected] = useState(sw.connected())
  const [isAsideMenuOpen, setIsAsideMenuOpen] = useState(false)
  const [IsOpenDialog, setIsOpenDialog] = useState(false)
  const [isDropBox, showDropBox] = useState(0)
  const { active: connected } = useWeb3React()

  const { sessionWallet, accts } = useSelector((state) => state.wallet)
  const { authenticated } = useSelector((state) => state.accessCode)

  // useEffect(() => {
  //   setConnected(active)
  // }, [connected, active])

  // useEffect(() => {
  //   setConnected(sessionWallet.connected())
  // }, [sessionWallet])

  useEffect(() => {
    // remove scroll from page when sidebar is open
    const html = document.querySelector("html")

    if (isAsideMenuOpen) {
      html.style.overflow = "hidden"
    } else {
      html.style.overflow = "auto"
    }
  }, [isAsideMenuOpen])

  const updateWallet = (swk) => {
    dispatch(setSessionWallet(swk))
    dispatch(setAccounts(swk.accountList()))
    dispatch(setConnectedStatus(swk.connected()))
  }

  const isActiveNavItem = (label) => {
    const pathName = location.pathname.split("/")[1]

    if (pathName === "markets" && label === "Markets") {
      return true
    }
    if (pathName === "buy" && label === "Buy") {
      return true
    }
    if (pathName === "sell" && label === "Sell") {
      return true
    }

    if (pathName === "mint" && label === "Mint") {
      return true
    }
    return false
  }

  if (!authenticated) {
    return (
      <header className={classes["header-container"]}>
        <div className={classes.header}>
          <Link to="/" className={classes.logo}>
            <img src={HeaderLogo} alt="Logo" className={classes.logo} />
          </Link>
        </div>
      </header>
    )
  }

  const NavigateToItem = (item) => {
    if (connected) {
      setIsOpenDialog(false)
      history.push(item)
    } else {
      setIsOpenDialog(true)
    }
  }

  return (
    <>
      <header className={classes["header-container"]}>
        <div className={classes.header}>
          <Link to="/" className={classes.logo}>
            <img src={HeaderLogo} alt="Logo" className={classes.logo} />
          </Link>
          <nav className={classes.nav}>
            {navItems.map((navItem, index) => (
              <div className={classes.dropdown}>
                {navItem.label === "preNFTs" ? (
                  <a
                    href={navItem.to}
                    className={classNames(
                      classes[`nav-item`],
                      isActiveNavItem(navItem.label) && classes["nav-active"]
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {navItem.label}
                  </a>
                ) : (
                  <>
                    <Link
                      to={navItem.to}
                      key={index}
                      className={classNames(
                        classes[`nav-item`],
                        isActiveNavItem(navItem.label) && classes["nav-active"]
                      )}
                    >
                      {navItem.label}
                    </Link>
                    {/* Dropdown List for Markets */}
                    {navItem.subItems && (
                      <ul className={classes["dropdown-content"]}>
                        <div className={classes.row}>
                          {navItem.menus.map((menu, menuIndex) => (
                            <div className={classes.col_lg_3} key={menuIndex}>
                              <ul>
                                {menu.map((menuItem, menuItemIndex) => (
                                  <li>
                                    <Link
                                      to={menuItem.route}
                                      key={menuItemIndex}
                                      onClick={() =>
                                        NavigateToItem(menuItem.route)
                                      }
                                    >
                                      {menuItem.icon}
                                      {menuItem.label}
                                    </Link>
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

          <div className={classes.actions}>
            <EthereumConnectors
              darkMode={false}
              sessionWallet={sessionWallet}
              accts={accts}
              connected={connected}
              setSelectorOpenPopup={IsOpenDialog}
              setIsOpenDialog={setIsOpenDialog}
              updateWallet={updateWallet}
              handleThemeSwitch={() => alert("hehe")}
            />

            <button
              className={classNames(classes.action, classes["mobile-menu"])}
              type="button"
              onClick={() => setIsAsideMenuOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
        <aside
          className={classNames(
            classes.aside,
            isAsideMenuOpen && classes["aside--open"]
          )}
        >
          <div className={classes.aside__header}>
            <button type="button" onClick={() => setIsAsideMenuOpen(false)}>
              <CloseIcon />
            </button>
          </div>

          <div className={classes.aside__content}>
            <nav className={classes.aside__nav}>
              {navItems.map((item, index) => (
                <>
                  {item.label === "preNFTs" ? (
                    <a
                      href={item.to}
                      className={classNames(
                        classes[`aside__nav-item`],
                        isActiveNavItem(item.label) && classes["nav-active"]
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <>
                      <span
                        to={item.to}
                        key={index}
                        onClick={() =>
                          showDropBox(isDropBox === index + 1 ? 0 : index + 1)
                        }
                        className={classNames(
                          classes["aside__nav-item"],
                          isActiveNavItem(item.label) && classes["nav-active"]
                        )}
                      >
                        {item.label}
                        {isDropBox !== index + 1 ? (
                          <ArrowRightSmallIcon className={classes.arrowRight} />
                        ) : (
                          <ArrowLeftSmallIcon className={classes.arrowRight} />
                        )}
                      </span>
                      {/* Dropdown List for Markets */}
                      {isDropBox === index + 1 && (
                        <ul className={classes["aside__dropdown-content"]}>
                          {item.subItems.map((marketItem, marketIndex) => (
                            <li key={marketIndex}>
                              <Link to={marketItem.route} key={marketIndex}>
                                {marketItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </>
              ))}
            </nav>
          </div>
        </aside>
      </header>
    </>
  )
}
