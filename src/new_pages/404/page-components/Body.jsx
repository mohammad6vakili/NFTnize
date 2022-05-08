import React from "react"
import "../page-assets/404.css"
import "../../mint/page-assets/Mint.css"
import Header from "new_pages/landing/page-components/Header"
import Footer from "new_pages/landing/page-components/Footer"
import { Button } from "components"
import { useHistory } from "react-router-dom"
import { useSelector } from "react-redux"

const Body = () => {
  const { rootTheme } = useSelector((state) => state.application)
  const history = useHistory()
  return (
    <div className={`mv-mint ${rootTheme === "light" ? "mv-mint-light" : ""}`}>
      <Header />
      <div
        className={`mv-mint-body ${
          rootTheme === "light" ? "mv-mint-body-light" : ""
        }`}
      >
        <div
          className={`mv-not-found-body ${
            rootTheme === "light" ? "mv-not-found-body-light" : ""
          }`}
        >
          <h3 className="title">Not Found</h3>
          <Button
            className={`mv-not-found-btn${
              rootTheme === "light" && "mv-not-found-btn-light"
            }`}
            type="button"
            onClick={() => history.push("/")}
          >
            <div>Go Back Home</div>
          </Button>
          <div
            className={`mv-not-found-bottom ${
              rootTheme === "light" ? "mv-not-found-bottom-light" : ""
            }`}
          >
            <h3 className="title">NFTnize</h3>
            <div>
              Mint, list, auction & trade NFTs. Enter the{" "}
              <span style={{ color: "#0CFF6D" }}>new creator economy</span> on
              Polygon and Ethereum.
            </div>
            <Button
              className={`mv-not-found-btn${
                rootTheme === "light" && "mv-not-found-btn-light"
              }`}
              type="button"
              onClick={() => history.push("/explore")}
            >
              <div>Explore Market</div>
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default Body
