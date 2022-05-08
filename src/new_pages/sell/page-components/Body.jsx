import React, { useState, useEffect } from "react"
import { useWeb3React } from "@web3-react/core"
import ContractMarketABI from "utils/mint/abis/NFTMarketPlace_ABI.json"
import { config } from "utils/config"
import "../page-assets/Sell.css"
import "../../mint/page-assets/Mint.css"
import Header from "../../landing/page-components/Header"
import Footer from "../../landing/page-components/Footer"
import classes from "../../create-nft/page-components/Form/Form.module.scss"
import { useSelector } from "react-redux"
import moment from "moment"
import { Input, Button, Select, Modal, Calendar, TimePicker } from "antd"
import starIcon from "../../mint/page-assets/warning-star.svg"
import SelectArrow from "../../mint/page-components/SelectArrow"
import PriceLabel from "new_pages/mint/page-components/PriceLabel"
import { SearchOutlined } from "@ant-design/icons"
import HttpService from "utils/httpService"
import noImage from "../page-assets/no-image.svg"
import noImageLight from "../page-assets/no-image-light.svg"

const { TextArea } = Input
const { Option } = Select

const Body = () => {
  const { rootTheme } = useSelector((state) => state.application)
  const [tab, setTab] = useState(0)
  const [errorStyle, setErrorStyle] = useState(true)
  const { active: connected, account, library } = useWeb3React()
  const [progress, setProgress] = useState({
    status: 0,
    note: "",
  })
  const [sellData, setSellData] = useState({
    nft: "",
    start: "",
    end: "",
    file: "",
    price: "",
    amount: "",
  })
  const [validList, setValidList] = useState({
    file: {
      error: false,
    },
    nft: {
      error: false,
    },
    price: {
      error: false,
    },
    amount: {
      error: false,
    },
    start: {
      error: false,
    },
    end: {
      error: false,
    },
  })
  const [amount, setAmount] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [labelTitle, setLabelTitle] = useState("")
  const [searchedImg, setSearchedImg] = useState("")
  const [loading, setLoading] = useState(false)
  const [startPicker, setStartPicker] = useState(false)
  const [endPicker, setEndPicker] = useState(false)
  const [selectedDateStart, setSelectedDateStart] = useState("")
  const [selectedTimeStart, setSelectedTimeStart] = useState("")
  const [selectedDateEnd, setSelectedDateEnd] = useState("")
  const [selectedTimeEnd, setSelectedTimeEnd] = useState("")
  const [nftsUser, setnftsUser] = useState([])
  const httpservice = new HttpService()

  // functions-------------------------------------------------------

  const handleValidateForm = () => {
    // file validation
    if (sellData.file.length === 0) {
      validList.file.error = true
    }
    if (sellData.file.length !== 0) {
      validList.file.error = false
    }
    // nft validation
    if (sellData.nft.length === 0) {
      validList.nft.error = true
    }
    if (sellData.nft.length !== 0) {
      validList.nft.error = false
    }
    // price validation
    if (sellData.price.length === 0) {
      validList.price.error = true
    } else if (sellData.price === 0) {
      validList.price.error = true
    } else {
      validList.price.error = false
    }
    // price validation
    if (sellData.amount.length === 0) {
      validList.amount.error = true
    } else if (sellData.amount === 0) {
      validList.amount.error = true
    } else {
      validList.amount.error = false
    }
    // start validation
    if (tab === 0) {
      if (sellData.start.length === 0) {
        validList.start.error = true
      } else if (sellData.start === 0) {
        validList.start.error = true
      } else {
        validList.start.error = false
      }
    } else {
      validList.start.error = false
    }
    // // end validation
    if (tab === 0) {
      if (sellData.end.length === 0) {
        validList.end.error = true
      } else if (sellData.end === 0) {
        validList.end.error = true
      } else {
        validList.end.error = false
      }
    } else {
      validList.end.error = false
    }
  }

  const submitForm = async () => {
    setErrorStyle(false)
    const array = []
    handleValidateForm()
    Object.values(validList).forEach((fields) => {
      array.push(fields.error)
    })
    if (array.indexOf(true) !== -1) {
      console.log(validList)
    } else {
      let inStart
      let inEnd
      let contractAddressMarket
      let AmountForSale

      if (sellData.start === "Right after listing") {
        inStart = moment().unix()
      } else if (sellData.start.length === 0) {
        inStart = 0
      } else {
        inStart = moment(start).unix()
      }

      if (sellData.end === "1") {
        inEnd = moment().add(1, "days").unix()
      } else if (sellData.end === "3") {
        inEnd = moment().add(3, "days").unix()
      } else if (sellData.end === "5") {
        inEnd = moment().add(5, "days").unix()
      } else if (sellData.end === "7") {
        inEnd = moment().add(7, "days").unix()
      } else if (sellData.end.length === 0) {
        inEnd = 0
      } else {
        inEnd = moment(end).unix()
      }

      const formData = {
        ...sellData,
        start: inStart,
        end: inEnd,
      }

      if (formData.nft.blockchain === "Eth") {
        contractAddressMarket = config.marketContractAddressETH
      } else if (formData.nft.blockchain === "Plg") {
        contractAddressMarket = config.marketContractAddressMATIC
      }

      if (formData.nft.tokenType === "ERC721") {
        AmountForSale = 0
      } else if (formData.nft.tokenType === "ERC1155") {
        AmountForSale = formData.amount
      }

      const ConractMarketPlace = new library.eth.Contract(
        ContractMarketABI,
        contractAddressMarket
      )
      const { methods: methodsMarketPlace } = ConractMarketPlace
      const priceTowei = library.utils.toWei(formData.price, "ether")

      setProgress({
        status: 60,
        note: "add your nft to market decenterlise for sale...",
      })

      await methodsMarketPlace
        .createMarketItem(
          formData.nft.Collection.contractAddress,
          formData.nft.tokenId,
          priceTowei,
          formData.nft.tokenSale,
          AmountForSale,
          formData.start,
          formData.end
        )
        .send({ from: account })
        .then((result) => result)
        .catch((e) => console.log("e", e))

      const marketItemId = await methodsMarketPlace
        .LastIdMarketItem()
        .call()
        .then((result) => result)

      setProgress({
        status: 90,
        note: "caching data...",
      })

      await StoreNFTForSell(
        formData.price,
        { id: formData.nft.id, marketItemId: parseInt(marketItemId, 10) },
        AmountForSale,
        formData.start,
        formData.end
      ).then((result) => {
        console.log("result", result)
      })
    }
  }

  useEffect(() => {
    getNFTsbyUser().then((result) => {
      setnftsUser(result.nfts)
    })
  }, [])

  const getNFTsbyUser = async () => {
    if (account !== null) {
      const URL = `${config.url_NFTnize}/user/nfts/${account.toLowerCase()}` // just for test and later this url change from env
      const postdata = await httpservice.get(URL, {})
      return postdata.data
    }
  }

  const StoreNFTForSell = async (
    price,
    update,
    amountNFT,
    startNFT,
    endNFT
  ) => {
    if (account) {
      const URL = `${config.url_NFTnize}/user/nfts/` // just for test and later this url change from env
      const postdata = await httpservice.put(URL, {
        price,
        update,
        start: startNFT,
        end: endNFT,
        amount: amountNFT,
        account,
      })
      return postdata.data
    }
  }

  const changeNftHandler = (value) => {
    console.log(value)
  }

  // start pickers submit handler
  const startDateChange = (value) => {
    setSelectedDateStart(value.format("YYYY-MM-DD"))
  }

  const startTimeChange = (value) => {
    setSelectedTimeStart(moment(value).format("HH:mm"))
  }

  const submitStartPickerHandler = () => {
    const now = moment(`${selectedDateStart} ${selectedTimeStart}`).format()
    setSellData({
      ...sellData,
      start: now,
    })
    setStart(now)
    setStartPicker(false)
  }

  // end pickers submit handler
  const endDateChange = (value) => {
    setSelectedDateEnd(value.format("YYYY-MM-DD"))
  }

  const endTimeChange = (value) => {
    setSelectedTimeEnd(moment(value).format("HH:mm"))
  }

  const submitEndPickerHandler = () => {
    const now = moment(`${selectedDateEnd} ${selectedTimeEnd}`).format()
    setSellData({
      ...sellData,
      end: now,
    })
    setEnd(now)
    setEndPicker(false)
  }

  useEffect(() => {
    const now = moment().format()
    if (sellData.start === "-1") {
      setSellData({
        ...sellData,
        start: now,
      })
      setStartPicker(true)
      setStart(now)
    } else {
      setStart(sellData.start)
    }
  }, [sellData.start])

  useEffect(() => {
    const now = moment().format()
    if (sellData.end === "-1") {
      setSellData({
        ...sellData,
        end: now,
      })
      setEndPicker(true)
      setEnd(now)
    } else {
      setEnd(sellData.end)
    }
  }, [sellData.end])

  useEffect(() => {
    if (startPicker === true) {
      setSelectedDateStart(moment().format("DD/MM/YYYY"))
      setSelectedTimeStart(moment().format("HH:mm"))
    }
  }, [startPicker])

  useEffect(() => {
    if (tab === 1) {
      setSellData({ ...sellData, start: 0, end: 0, price: 0 })
    } else if (tab === 0) {
      setSellData({ ...sellData, price: 0 })
    }
    if (tab === 0) {
      setLabelTitle("wETH")
    }
    if (tab === 1) {
      setLabelTitle("Eth")
    }
  }, [tab])

  useEffect(() => {
    if (sellData.nft.tokenType === "ERC1155") {
      setSellData({
        ...sellData,
        amount: "",
      })
      setAmount("")
    } else if (sellData.nft.tokenType === "ERC721") {
      setSellData({
        ...sellData,
        amount: 1,
      })
      setAmount(1)
    }
  }, [sellData.nft.tokenType])

  useEffect(() => {
    if (errorStyle === false) {
      setErrorStyle(true)
    }
  }, [errorStyle])

  return (
    <div className={`mv-sell ${rootTheme === "light" ? "mv-sell-light" : ""}`}>
      <Header />
      <div
        className={`mv-sell-body ${
          rootTheme === "light" ? "mv-sell-body-light" : ""
        }`}
      >
        <div>
          <div
            className={`mv-sell-title ${
              rootTheme === "light" ? "mv-sell-title-light" : ""
            }`}
          >
            <div>Sell NFT</div>
            <div>Choose an NFT you own to sell on the marketplace:</div>
            {/* tabs----------------------------------- */}
            <div>
              <Button
                onClick={() => setTab(0)}
                className={
                  tab === 0 && rootTheme === "dark"
                    ? "mv-sell-tab-btn-selected"
                    : ""
                }
                id={
                  tab === 0 && rootTheme === "light"
                    ? "mv-sell-tab-btn-selected-light"
                    : ""
                }
              >
                Auction
              </Button>
              <Button
                className={
                  tab === 1 && rootTheme === "dark"
                    ? "mv-sell-tab-btn-selected"
                    : ""
                }
                id={
                  tab === 1 && rootTheme === "light"
                    ? "mv-sell-tab-btn-selected-light"
                    : ""
                }
                onClick={() => setTab(1)}
              >
                Fixed Price
              </Button>
            </div>
          </div>
          {/* NFT----------------------------------- */}
          <div
            className={`mv-sell-field ${
              rootTheme === "light" ? "mv-sell-field-light" : ""
            }`}
            id={
              errorStyle && validList.nft.error === true
                ? "mv-error-border-red-select"
                : ""
            }
          >
            <div>
              NFT
              <img src={starIcon} alt="required" />
              {errorStyle === true && validList.nft.error === true && (
                <span className="mv-mint-error-text">
                  You must select a NFT.
                </span>
              )}
            </div>
            <Select
              onChange={(value) =>
                nftsUser.forEach((item) => {
                  if (item.id === value) {
                    setSellData({ ...sellData, nft: item })
                  }
                })
              }
              suffixIcon={
                <SearchOutlined
                  className={`mv-suffix-search ${
                    rootTheme === "light" ? "mv-suffix-search-light" : ""
                  }`}
                />
              }
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              placeholder="Start typing to search"
              className={`mv-sell-field-select ${
                rootTheme === "light" ? "mv-sell-field-select-light" : ""
              }`}
            >
              {nftsUser.map((nft, index) => (
                <Option key={index} value={nft.id}>
                  {nft.displayName}
                </Option>
              ))}
            </Select>
          </div>
          {/* Sale price----------------------------------- */}
          {tab === 1 && (
            <div
              className={`mv-sell-field ${
                rootTheme === "light" ? "mv-sell-field-light" : ""
              }`}
              id={
                errorStyle && validList.price.error === true
                  ? "mv-error-border-red-select"
                  : ""
              }
            >
              <div>
                Sale Price
                <img src={starIcon} alt="required" />
                {errorStyle === true && validList.price.error === true && (
                  <span className="mv-mint-error-text">
                    You must enter a price.
                  </span>
                )}
              </div>
              <Input
                suffix={<PriceLabel title={labelTitle} />}
                onChange={(e) =>
                  setSellData({ ...sellData, price: e.target.value })
                }
                className={`mv-sell-field-input-bg ${
                  rootTheme === "light" ? "mv-sell-field-input-bg-light" : ""
                }`}
                defaultValue={0}
              />
            </div>
          )}
          {/* Minimum Price field */}
          {tab === 0 && (
            <div
              className={`mv-mint-field-wrapper ${
                rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
              }`}
              id={
                errorStyle && validList.price.error === true
                  ? "mv-error-border-red-select"
                  : ""
              }
            >
              <div>
                Minimum Price
                {errorStyle === true && validList.price.error === true && (
                  <span className="mv-mint-error-text">
                    You must enter a minimum price.
                  </span>
                )}
              </div>
              <Input
                onChange={(e) =>
                  setSellData({
                    ...sellData,
                    price: e.target.value,
                  })
                }
                suffix={<PriceLabel title={labelTitle} />}
                className={`mv-sell-field-input-bg ${
                  rootTheme === "light" ? "mv-sell-field-input-bg-light" : ""
                }`}
                defaultValue="0"
              />
            </div>
          )}
          {/* Amount field */}
          <div
            className={`mv-sell-field ${
              rootTheme === "light" ? "mv-sell-field-light" : ""
            }`}
          >
            <div>
              <img src={starIcon} alt="required" />
              Amount
              {errorStyle === true && validList.amount.error === true && (
                <span className="mv-mint-error-text">
                  You must enter an amount.
                </span>
              )}
            </div>
            <Input
              value={amount}
              disabled={sellData.nft.tokenType === "ERC721"}
              onChange={(e) => {
                setSellData({
                  ...sellData,
                  amount: e.target.value,
                })
                setAmount(e.target.value)
              }}
              className={`mv-sell-field-input-bg ${
                rootTheme === "light" ? "mv-sell-field-input-bg-light" : ""
              }`}
              id={
                errorStyle && validList.amount.error === true
                  ? "mv-error-border-red"
                  : ""
              }
            />
          </div>
          {/* start picker */}
          <Modal
            visible={startPicker}
            footer={[]}
            closable={false}
            width={360}
            bodyStyle={{
              display: "flex",
              justifyContent: "center",
            }}
            onCancel={() => setStartPicker(false)}
          >
            <div className="mv-mint-picker-modal">
              <div className="mv-mint-picker-modal-calendar">
                <Calendar fullscreen={false} onChange={startDateChange} />
              </div>
              <div>
                <TimePicker
                  defaultValue={moment()}
                  onChange={startTimeChange}
                />
              </div>
              <Button onClick={submitStartPickerHandler}>Apply</Button>
            </div>
          </Modal>
          {/* Starting bid----------------------------------- */}
          {tab === 0 && (
            <div
              className={`mv-sell-field ${
                rootTheme === "light" ? "mv-sell-field-light" : ""
              }`}
              id={
                errorStyle && validList.start.error === true
                  ? "mv-error-border-red-select"
                  : ""
              }
            >
              <div>
                Starting Bid
                <img src={starIcon} alt="required" />
                {errorStyle === true && validList.start.error === true && (
                  <span className="mv-mint-error-text">
                    You must select a date to start.
                  </span>
                )}
              </div>
              <Select
                value={
                  start.length > 0 && start !== "Right after listing"
                    ? moment(start).format("DD/MM/YYYY HH:mm")
                    : start
                }
                onChange={(value) => setSellData({ ...sellData, start: value })}
                suffixIcon={<SelectArrow />}
                className={`mv-sell-field-select ${
                  rootTheme === "light" ? "mv-sell-field-select-light" : ""
                }`}
              >
                <Option value="Right after listing">Right after listing</Option>
                <Option value="-1">Pick specific date</Option>
              </Select>
            </div>
          )}
          {/* end picker */}
          <Modal
            visible={endPicker}
            footer={[]}
            closable={false}
            width={360}
            bodyStyle={{
              display: "flex",
              justifyContent: "center",
            }}
            onCancel={() => setEndPicker(false)}
          >
            <div className="mv-mint-picker-modal">
              <div className="mv-mint-picker-modal-calendar">
                <Calendar fullscreen={false} onChange={endDateChange} />
              </div>
              <div>
                <TimePicker defaultValue={moment()} onChange={endTimeChange} />
              </div>
              <Button onClick={submitEndPickerHandler}>Apply</Button>
            </div>
          </Modal>
          {/* Expire bid */}
          {tab === 0 && (
            <div
              className={`mv-mint-field-wrapper ${
                rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
              }`}
              id={
                errorStyle && validList.end.error === true
                  ? "mv-error-border-red-select"
                  : ""
              }
            >
              <div>
                Expire Bid
                {errorStyle === true && validList.end.error === true && (
                  <span className="mv-mint-error-text">
                    You must select a date to expire.
                  </span>
                )}
              </div>
              <Select
                value={
                  end.length > 0 &&
                  end !== "1" &&
                  end !== "3" &&
                  end !== "5" &&
                  end !== "7"
                    ? moment(end).format("DD/MM/YYYY HH:mm")
                    : end
                }
                onChange={(value) => setSellData({ ...sellData, end: value })}
                suffixIcon={<SelectArrow />}
                className={`mv-sell-field-select ${
                  rootTheme === "light" ? "mv-sell-field-select-light" : ""
                }`}
              >
                <Option value="1">1 Day</Option>
                <Option value="3">3 Day</Option>
                <Option value="5">5 Day</Option>
                <Option value="7">7 Day</Option>
                <Option value="-1">Pick specific date</Option>
              </Select>
            </div>
          )}
          {/* submit button----------------------------------- */}
          <div className="mv-sell-submit-btn-wrapper">
            <Button
              onClick={submitForm}
              disabled={loading}
              className={`mv-sell-submit-button ${
                rootTheme === "light" ? "mv-sell-submit-button-light" : ""
              }`}
            >
              <span>{loading === true ? "+ Creating..." : "Sell NFT"}</span>
            </Button>
          </div>
        </div>
        {/* file upload----------------------------------- */}
        <div
          className={`mv-sell-upload-box ${
            rootTheme === "light" ? "mv-sell-upload-box-light" : ""
          }`}
        >
          {searchedImg.length === 0 ? (
            <div>
              <div>
                {rootTheme === "dark" ? (
                  <img src={noImageLight} alt="not found" />
                ) : (
                  <img src={noImage} alt="not found" />
                )}
              </div>
            </div>
          ) : (
            <img src={searchedImg} alt="searched nft" />
          )}
        </div>
      </div>
      {/* mobile submit button----------------------------------- */}
      <div className="mv-sell-submit-btn-mobile-wrapper">
        <Button
          disabled={loading}
          onClick={submitForm}
          className={`mv-sell-submit-button ${
            rootTheme === "light" ? "mv-sell-submit-button-light" : ""
          }`}
        >
          <span>{loading === true ? "+ Creating..." : "Sell NFT"}</span>
        </Button>
      </div>
      {/* progress bar */}
      {loading && (
        <div className="mv-sell-progress-wrapper">
          <p className={classes.progress__note}>{progress.note}</p>
          <div className={classes["mint-progress-bar"]}>
            <div
              className="mv-mint-progress-bar"
              style={{ width: `${progress.status}%` }}
            />
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}

export default Body
