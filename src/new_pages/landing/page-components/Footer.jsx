import React from "react"
import "../page-assets/Landing.css"
import classes from "../../../new_components/Header/Header.module.scss"
import headerLogo from "../page-assets/new-logo.png"
import { Button } from "antd"
import { useHistory } from "react-router-dom"

const Footer = () => {
  const history = useHistory()
  return (
    <div className="mv-footer-wrapper">
      <div className="mv-footer">
        <button
          type="button"
          className="mv-landing-footer-logo"
          onClick={() => history.push("/")}
        >
          <img
            style={{ width: "unset" }}
            className={classes.logo}
            src={headerLogo}
            alt="logo"
          />
        </button>
        <div className="mv-footer-links">
          <a href="#About">About</a>
          <a href="#Blog">Blog</a>
          <a href="#Press">Press</a>
          <a href="#Careers">Careers</a>
          <a href="#Community Guidelines">Community Guidelines</a>
          <a href="#Help">Help</a>
        </div>
        <Button className="mv-header-connect-btn" style={{ color: "#0cff6d" }}>
          Subscribe
        </Button>
      </div>
    </div>
  )
}

export default Footer
