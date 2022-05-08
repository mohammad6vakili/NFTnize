import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"
import { useDispatch } from "react-redux"
import {
  Dialog,
  Button,
  Classes,
  Menu,
  Popover,
  Position,
} from "@blueprintjs/core"
import classNames from "classnames"
import useWallet from "hooks/useWallet"
import useLocalStorage from "use-local-storage"
import Moon from "../../assets/icons/moon.svg"
import Sun from "../../assets/icons/sun.svg"
import { toggleTheme } from "../../redux/application/application-slice"

// import { connect } from "redux/wallet/wallet-slice"
import { formatAddress } from "utils/helper"
import classes from "./EthereumConnectors.module.scss"
import {
  walletconnect,
  walletlink,
  MetaMask,
} from "../../utils/walletConnector/ETHConnector"
import {
  MetaMaskPolygon,
  fortmatic,
  portis,
  torus,
} from "../../utils/walletConnector/PolygonConnector"

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

export const EthereumConnectors = ({
  sessionWallet,
  updateWallet,
  setSelectorOpenPopup,
  setIsOpenDialog,
  // darkMode,
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    active: connected,
    connector,
    error,
    account,
    library,
  } = useWeb3React()
  const { connect, deactive } = useWallet()
  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "light" : "dark"
  )

  // detect the theme
  useEffect(() => {
    dispatch(toggleTheme(theme))
  }, [])

  // const selectedWallet = useSelector((state) => state.wallet.selectedAccount)
  const [selectorOpen, setSelectorOpen] = useState(false)

  useEffect(() => {
    if (setSelectorOpenPopup) {
      setSelectorOpen(true)
    } else {
      setSelectorOpen(false)
    }
  }, [setSelectorOpenPopup])

  useEffect(() => {
    if (sessionWallet.connected()) return

    let interval
    sessionWallet.connect().then((success) => {
      if (!success) return

      // Check every 500ms to see if we've connected then kill the interval
      // This is most useful in the case of walletconnect where it may be several
      // seconds before the user connects
      interval = setInterval(() => {
        if (sessionWallet.connected()) {
          clearInterval(interval)
          updateWallet(sessionWallet)
        }
      }, 500)
    })

    return () => {
      clearInterval(interval)
    }
  }, [sessionWallet, updateWallet])

  const disconnectWallet = () => {
    localStorage.removeItem("selectedAccount")
    if (connected || error) {
      deactive()
      if (!library.currentProvider.isMetaMask) {
        connector.close()
      }
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

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    dispatch(toggleTheme(newTheme))

    // change body backgroud color
    document.body.style =
      newTheme !== "dark" ? "background: white" : "background: #0b0b1d;"
  }

  const handleTheme = () => {
    switchTheme()
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
  if (!connected)
    return (
      <div>
        <Button
          minimal
          rightIcon="selection"
          intent="warning"
          outlined
          className={classes.buttonPink}
          onClick={() => setSelectorOpen(true)}
        >
          Connect Wallet
        </Button>

        <Button
          minimal
          outlined
          id="themeToggle"
          className={classes.themeButton}
          onClick={() => handleTheme()}
        >
          <img src={theme === "dark" ? Moon : Sun} alt="moon" />
        </Button>

        <Dialog
          isOpen={selectorOpen}
          title=""
          onClose={() => {
            setIsOpenDialog(false)
            handleSelectedWallet("close")
          }}
          className={classes.dialog}
        >
          <h2 className={classes["dialog-title"]}>Select Wallet</h2>

          <div className={Classes.DIALOG_BODY}>
            <h3 style={{ padding: "10px" }}> Ethereum Network </h3>
            <ul className={classes["wallet-option-list"]}>{walletsEthereum}</ul>
            <h3 style={{ padding: "10px" }}> Polygon Network </h3>
            <ul className={classes["wallet-option-list"]}>{PolygonNetwork}</ul>
          </div>
        </Dialog>
      </div>
    )

  const handleWalletChange = (index) => {
    // dispatch(setSelectedAccount(addr))
    sessionWallet.setAccountIndex(index)
    updateWallet(sessionWallet)
  }

  const hadleGoClick = (addr) => {
    history.push(`/creators/${addr}`)
  }

  return (
    <div>
      <Popover
        minimal="true"
        position={Position.BOTTOM}
        className={classes["wallet-popover"]}
      >
        <Button
          text={formatAddress(account)}
          className={classes["wallets-dropdown"]}
          rightIcon="symbol-circle"
          intent="success"
        />
        <div className={classes["popover-content"]}>
          <Menu
            text={account}
            onClick={() => handleWalletChange(1, account)}
            className={classNames(
              classes.walletMenu,
              account && classes.blueGlowText
            )}
          >
            {formatAddress(account)}{" "}
            <Button
              icon="arrow-right"
              minimal
              onClick={() => hadleGoClick(account)}
              className={classes.linkTo}
            />
          </Menu>
          {/* {accts.map((addr, idx) => (
            <Menu
              text={addr}
              key={idx}
              onClick={() => handleWalletChange(idx, addr)}
              className={classNames(
                classes.walletMenu,
                addr === selectedWallet && classes.blueGlowText
              )}
            >
              {formatAddress(addr)}{" "}
              <Button
                icon="arrow-right"
                minimal
                onClick={() => hadleGoClick(addr)}
                className={classes.linkTo}
              />
            </Menu>
          ))} */}
        </div>
      </Popover>
      <Button
        icon="log-out"
        minimal
        onClick={disconnectWallet}
        className={classNames(
          classes.buttonPink,
          classes.noOutline,
          classes.disconnect
        )}
      />
      <Button
        minimal
        outlined
        id="themeToggle"
        className={classes.themeButton}
        onClick={() => handleTheme()}
      >
        <img src={theme === "dark" ? Moon : Sun} alt="moon" />
      </Button>
    </div>
  )
}
