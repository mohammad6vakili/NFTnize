import React, { useState } from "react"
import "../page-assets/Trending.css"
import Header from "new_pages/landing/page-components/Header"
import Footer from "new_pages/landing/page-components/Footer"
import { useSelector } from "react-redux"
import { Input, Button, Select } from "antd"
import SelectArrow from "new_pages/mint/page-components/SelectArrow"
import tableData from "../page-data/data"

const { Option } = Select

const Body = () => {
  const { rootTheme } = useSelector((state) => state.application)
  const [tab, setTab] = useState(0)

  return (
    <div
      className={`mv-trending ${
        rootTheme === "light" ? "mv-trending-light" : ""
      }`}
    >
      <Header />
      <div
        className={`mv-trending-search-wrapper ${
          rootTheme === "light" ? "mv-trending-search-wrapper-light" : ""
        }`}
      >
        <Input placeholder="Search NFTnise" />
      </div>
      <div
        className={`mv-trending-body ${
          rootTheme === "light" ? "mv-trending-body-light" : ""
        }`}
      >
        <div
          className={`mv-trending-body-title ${
            rootTheme === "light" ? "mv-trending-body-title-light" : ""
          }`}
        >
          <div>Trending Creators</div>
          <div>
            <Button
              onClick={() => setTab(0)}
              className={tab === 0 ? "mv-explore-tab-selected" : ""}
              id={
                tab === 0 && rootTheme === "light"
                  ? "mv-explore-tab-selected-light"
                  : ""
              }
            >
              Creators
            </Button>
            <Button
              onClick={() => setTab(1)}
              className={tab === 1 ? "mv-explore-tab-selected" : ""}
              id={
                tab === 1 && rootTheme === "light"
                  ? "mv-explore-tab-selected-light"
                  : ""
              }
            >
              Collectors
            </Button>
            <Button
              onClick={() => setTab(2)}
              className={tab === 2 ? "mv-explore-tab-selected" : ""}
              id={
                tab === 2 && rootTheme === "light"
                  ? "mv-explore-tab-selected-light"
                  : ""
              }
            >
              Collections
            </Button>
          </div>
          <div>
            <span>Sort By</span>
            <Select suffixIcon={<SelectArrow />} defaultValue="1">
              <Option value="1">Newest</Option>
            </Select>
          </div>
        </div>
        <div
          className={`mv-trending-table ${
            rootTheme === "light" ? "mv-trending-table-light" : ""
          }`}
        >
          <div className="mv-trending-table-title">
            <div>Rank</div>
            <div>
              <div className="mv-column-20"> </div>
              <div className="mv-column-12">Unique Collectors</div>
              <div className="mv-column-10">NFTs sold</div>
              <div className="mv-column-15">Primary Sales</div>
              <div className="mv-column-15">Secondary Sales</div>
              <div className="mv-column-15">Total Sales</div>
            </div>
          </div>
          {tableData.map((data, index) => (
            <div
              className={`mv-trending-table-body ${
                rootTheme === "light" ? "mv-trending-table-body-light" : ""
              }`}
              key={index}
            >
              <div># {index + 1}</div>
              <div>
                <div className="mv-column-20">
                  <img src={data.img} alt="profile" />
                  <div>
                    <span>{data.name}</span>
                    <span>{data.username}</span>
                  </div>
                </div>
                <div className="mv-column-12">{data.count}</div>
                <div className="mv-column-10">{data.count}</div>
                <div className="mv-column-15">
                  <div
                    className={`mv-trending-table-cell-box ${
                      rootTheme === "light"
                        ? "mv-trending-table-cell-box-light"
                        : ""
                    }`}
                  >
                    5.00 ETH
                    <div>$13.000.000</div>
                  </div>
                </div>
                <div className="mv-column-15">
                  <div
                    className={`mv-trending-table-cell-box ${
                      rootTheme === "light"
                        ? "mv-trending-table-cell-box-light"
                        : ""
                    }`}
                  >
                    0 ETH
                    <div>$0.00</div>
                  </div>
                </div>
                <div className="mv-column-15">
                  <div
                    className={`mv-trending-table-cell-box ${
                      rootTheme === "light"
                        ? "mv-trending-table-cell-box-light"
                        : ""
                    }`}
                  >
                    5.00 ETH
                    <div>$13.000.000</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Body
