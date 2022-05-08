import { useState, useEffect } from "react"
import { Link, NavLink } from "react-router-dom"
import { useWeb3React } from "@web3-react/core"

import classes from "./Header.module.scss"
import { EthereumConnectors } from "components"
import { SessionWallet } from "algorand-session-wallet"
import { config } from "utils/config"
import {
  setSessionWallet,
  setAccounts,
  setConnectedStatus,
} from "redux/wallet/wallet-slice"
import { useSelector, useDispatch } from "react-redux"
// import useWallet from "hooks/useWallet"

export const Header = ({ handleThemeSwitch }) => {
  const dispatch = useDispatch()
  const sw = new SessionWallet(config.network)
  const { active } = useWeb3React()
  const [connected, setConnected] = useState(sw.connected())
  const { sessionWallet, accts } = useSelector((state) => state.wallet)
  useEffect(() => {
    setConnected(active)
  }, [connected, active])
  const updateWallet = (swk) => {
    dispatch(setSessionWallet(swk))
    dispatch(setAccounts(swk.accountList()))
    dispatch(setConnectedStatus(swk.connected()))
    setConnected(swk.connected())
  }

  const navItems = [
    {
      label: "Collections",
      to: "/v1/all-collections",
    },
    {
      label: "Creators",
      to: "/v1/creators",
    },
    {
      label: "Create Auction",
      to: "/v1/create-application",
    },
    {
      label: "View Auctions",
      to: "/v1/all-applications",
    },
    {
      label: "Mint",
      to: "/v1/mint",
    },
  ]
  return (
    <header className={classes.header}>
      <Link to="/v1/home" className={classes.logo}>
        &nbsp;YNFT <span>CLUB</span>
      </Link>

      <nav className={classes.nav}>
        {navItems.map((item, index) => (
          <NavLink
            to={item.to}
            key={index}
            className={classes["nav-item"]}
            activeClassName={classes["nav-item--active"]}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <EthereumConnectors
        darkMode={false}
        sessionWallet={sessionWallet}
        accts={accts}
        connected={connected}
        updateWallet={updateWallet}
        handleThemeSwitch={() => alert("hehe")}
      />
    </header>
  )
}
