import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { SessionWallet, allowedWallets } from "algorand-session-wallet"
import {
  Dialog,
  Button,
  Classes,
  Menu,
  Popover,
  Position,
} from "@blueprintjs/core"
import classNames from "classnames"

import { setSelectedAccount } from "redux/wallet/wallet-slice"
import { formatAddress } from "utils/helper"
import classes from "./AlgorandConnectorWallet.module.scss"
import Moon from "../../assets/icons/moon.svg"
import useLocalStorage from "use-local-storage"
import { toggleTheme } from "../../redux/application/application-slice"

export const AlgorandConnectorWallet = ({
  sessionWallet,
  updateWallet,
  darkMode,
  connected,
  accts,
}) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const selectedWallet = useSelector((state) => state.wallet.selectedAccount)
  const [selectorOpen, setSelectorOpen] = useState(false)

  const defaultDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  const [theme, setTheme] = useLocalStorage(
    "theme",
    defaultDark ? "dark" : "light"
  )

  useEffect(() => {
    if (accts?.length > 0 && !accts.includes(selectedWallet)) {
      dispatch(setSelectedAccount(accts[0]))
    }
  }, [accts])

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

  const switchTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    dispatch(toggleTheme(newTheme))
  }

  const handleTheme = () => {
    switchTheme()
  }

  const disconnectWallet = () => {
    localStorage.removeItem("selectedAccount")
    window.analytics.track("Wallet Disconnected", {
      disconnectedNetwork: sessionWallet.network,
      disconnectedWalletAddress: sessionWallet.wallet.accounts[0],
    })
    dispatch(setSelectedAccount(""))
    sessionWallet.disconnect()
    updateWallet(
      new SessionWallet(sessionWallet.network, sessionWallet.permissionCallback)
    )
  }

  const handleSelectedWallet = async (e) => {
    const choice = e.currentTarget.id

    if (!(choice in allowedWallets)) {
      if (sessionWallet.wallet !== undefined) sessionWallet.disconnect()
      return setSelectorOpen(false)
    }

    const sw = new SessionWallet(
      sessionWallet.network,
      sessionWallet.permissionCallback,
      choice
    )

    if (!(await sw.connect())) {
      sw.disconnect()
    }
    window.analytics.identify(sw.wallet.accounts[0], {
      address: sw.wallet.accounts[sw.wallet.accounts.length - 1],
      network: sw.network,
      wname: sw.wname,
    })
    window.heap.identify(sw.wallet.accounts[0])
    window.heap.addUserProperties({ network: sw.network })
    window.heap.addUserProperties({ wname: sw.wname })
    updateWallet(sw)
    window.heap.track("Wallet Connection", {
      address: sw.wallet.accounts[sw.wallet.accounts.length - 1],
      network: sw.network,
      wname: sw.wname,
    })
    setSelectorOpen(false)
  }

  const walletOptions = []
  const myAlgoOption = Object.entries(allowedWallets).find(
    (w) => w[0] === "my-algo-connect"
  )
  if (myAlgoOption) {
    walletOptions.push(
      <li key={myAlgoOption[0]}>
        <Button
          id={myAlgoOption[0]}
          large
          fill
          minimal
          outlined
          onClick={handleSelectedWallet}
          className={classes.buttonPink}
        >
          <div className={classes["wallet-option"]}>
            <img
              alt="wallet-branding"
              className={classes["wallet-branding"]}
              src={myAlgoOption[1].img(darkMode)}
            />
            <h5>{myAlgoOption[1].displayName()}</h5>
          </div>
        </Button>
      </li>
    )
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const [k, v] of Object.entries(allowedWallets).filter(
    (w) => w[0] !== "my-algo-connect"
  )) {
    walletOptions.push(
      <li key={k}>
        <Button
          id={k}
          large
          fill
          minimal
          outlined
          onClick={handleSelectedWallet}
          className={classes.buttonPink}
        >
          <div className={classes["wallet-option"]}>
            <img
              alt="wallet-branding"
              className={classes["wallet-branding"]}
              src={v.img(darkMode)}
            />
            <h5>{v.displayName()}</h5>
          </div>
        </Button>
      </li>
    )
  }

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
          <img src={Moon} alt="moon" />
        </Button>

        <Dialog
          isOpen={selectorOpen}
          title=""
          onClose={handleSelectedWallet}
          className={classes.dialog}
        >
          <h2 className={classes["dialog-title"]}>Select Wallet</h2>
          <div className={Classes.DIALOG_BODY}>
            <ul className={classes["wallet-option-list"]}>{walletOptions}</ul>
          </div>
        </Dialog>
      </div>
    )

  const handleWalletChange = (index, addr) => {
    dispatch(setSelectedAccount(addr))
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
          text={formatAddress(selectedWallet.toString())}
          className={classes["wallets-dropdown"]}
          rightIcon="symbol-circle"
          intent="success"
        />
        <div className={classes["popover-content"]}>
          {accts.map((addr, idx) => (
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
          ))}
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
    </div>
  )
}
