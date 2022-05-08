import React, { useState, useEffect } from "react"
import Web3 from "web3"
import { useWeb3React } from "@web3-react/core"
import { MetaMask } from "utils/walletConnector/ETHConnector"
import { MetaMaskPolygon } from "utils/walletConnector/PolygonConnector"
import "../page-assets/Mint.css"
import classes from "../../create-nft/page-components/Form/Form.module.scss"
import Header from "../../landing/page-components/Header"
import Footer from "../../landing/page-components/Footer"
import closeIcon from "../page-assets/close.svg"
import ethIcon from "../page-assets/eth.svg"
import ployIcon from "../page-assets/poly.png"
import warningIcon from "../page-assets/warning.svg"
import { Snackbar } from "../../../components/Snackbar/Snackbar"
import { useSelector } from "react-redux"
import { useLocation, useHistory } from "react-router-dom"
import {
  Input,
  Button,
  Select,
  Modal,
  Calendar,
  TimePicker,
  Popover,
  Switch,
} from "antd"
import useWallet from "hooks/useWallet"
import FileUpload from "./FileUpload"
import Lottie from "react-lottie-player"
import successWhite from "../../../assets/lottie/success-white.json"
import successBlack from "../../../assets/lottie/success-black.json"
import descAlert from "../page-assets/desc-alert.svg"
import descAlertDark from "../page-assets/desc-alert-dark.svg"
import warningStar from "../page-assets/warning-star.svg"
import {
  // categories,
  tokenTypes,
  networkTypes,
} from "../../../utils/constants"
import SelectArrow from "./SelectArrow"
import moment from "moment"
import PriceLabel from "./PriceLabel"
import {
  deployNFT,
  signMessage,
  mintNFT,
  deployMoneyPip,
  signMessageEIP712,
  StoreToServerNFT,
  StoreToServerCollection,
} from "utils/mint"
import { pushMetatdataToIPFS, pushImageToIPFS } from "utils/mint/ipfs"
import { config } from "utils/config"
import { calculateRoyalty } from "utils/calculateRoyalties"
import HttpService from "utils/httpService"
import { LazyMinter } from "utils/mint/Voucher-LazyMint"

const { TextArea } = Input
const { Option } = Select

const httpservice = new HttpService()

const Body = () => {
  const location = useLocation()
  // states-----------------------------------------------------------------------
  const { rootTheme } = useSelector((state) => state.application)

  const [uploadRef, setUploadRef] = useState(null)
  const [nftFileUploaded, setNftFileUploaded] = useState("")

  const [startPicker, setStartPicker] = useState(false)
  const [endPicker, setEndPicker] = useState(false)
  const [collectionModal, setCollectionModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [collectionLoading, setCollectionLoading] = useState(false)
  const [errorStyle, setErrorStyle] = useState(true)
  const route = useHistory()
  const [categories, setcategories] = useState(null)

  const [tab, setTab] = useState(0)
  const [putOnMarket, setPutOnMarket] = useState(true)

  const [selectedDateStart, setSelectedDateStart] = useState("")
  const [selectedTimeStart, setSelectedTimeStart] = useState("")
  const [selectedDateEnd, setSelectedDateEnd] = useState("")
  const [selectedTimeEnd, setSelectedTimeEnd] = useState("")

  const [imageList, setImageList] = useState("")
  const [collectionImageList, setCollectionImageList] = useState("")
  const [net, setNet] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [quan, setQuan] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [labelTitle, setLabelTitle] = useState("")
  const [collectionContract, setcollectionContract] = useState("")
  const [collectionID, setcollectionID] = useState(0)
  const [collectionValue, setCollectionValue] = useState("")
  const [collectionData, setcollectionData] = useState([])

  const [fileList, setFileList] = useState([])
  const [collectionFileList, setCollectionFileList] = useState([])
  const [royalityWallets, setRoyalityWallets] = useState([])
  const [traits, setTraits] = useState([])

  const { connect, deactive } = useWallet()
  const { active: connected, account, library } = useWeb3React()

  const collectionDisableContent = (
    <div
      className={`mv-buy-popover-content ${
        rootTheme === "light" ? "mv-buy-popover-content-light" : ""
      }`}
    >
      Please select the Token to create or select the Collection.
    </div>
  )

  const disablePopoverContent = (
    <div className="mv-mint-tab-popover">
      {net === "Eth"
        ? "ERC1155 doesn't support the Timed Auction."
        : "Polygon doesn't support the Auction yet, Coming soon..."}
    </div>
  )
  const [currentTokenId, setcurrentTokenId] = useState(null)
  const [progress, setProgress] = useState({
    status: 0,
    note: "",
  })
  const [collectionProgress, setCollectionProgress] = useState({
    status: 0,
    note: "",
  })
  const [addCollectionData, setAddCollectionData] = useState({
    id: "",
    name: "",
    contractAddress: "",
    symbol: "",
    description: "",
    image: "",
  })
  const [mintData, setMintData] = useState({
    putOnMarketPlace: true,
    name: "",
    unitName: "",
    token: "",
    Quantity: 0,
    price: 0,
    start: "",
    end: "",
    totalRoyality: 0,
    file: "",
    description: "",
    category: "",
    collection: "",
    network: "",
  })

  const snackbarInitValues = {
    isActive: false,
    text: "",
    color: "",
    timeout: 3000,
  }
  const [snackbar, setSnackbar] = useState(snackbarInitValues)

  const [validList, setValidList] = useState({
    file: {
      error: false,
    },
    name: {
      error: false,
    },
    unitName: {
      error: false,
    },
    token: {
      error: false,
    },
    price: {
      error: false,
    },
    start: {
      error: false,
    },
    end: {
      error: false,
    },
    totalRoyality: {
      error: false,
      warning: false,
    },
    royalityWallets: {
      error: false,
    },
    description: {
      error: false,
    },
    category: {
      error: false,
    },
    collection: {
      error: false,
    },
    network: {
      error: false,
    },
  })

  const getCategories = async () => {
    const url = `${config.url_NFTnize}/category`
    const res = await httpservice.get(url, {})
    return res.data.data
  }

  const getCollections = async () => {
    const url = `${config.url_NFTnize}/user/collections`

    if (account) {
      const res = await httpservice.post(url, {
        account: account.toLowerCase(),
        collectionType: mintData.token,
      })
      return res.data.collectionsUser
    }
  }

  const upload = async (e) => {
    const list = []
    const base64 = await converter(e.target.files[0])
    setMintData({ ...mintData, file: e.target.files[0] })
    setImageList(base64)
    setFileList(base64.split(",")[1])
  }

  const uploadCollection = async (e) => {
    const list = []
    const base64 = await converter(e.target.files[0])
    setCollectionImageList(base64)
    setAddCollectionData({ ...addCollectionData, image: e.target.files[0] })
    setCollectionFileList(base64.split(",")[1])
  }

  function converter(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result)
      }
      fileReader.onerror = (error) => {
        reject(error)
      }
    })
  }

  const MetadataNFTLevel = (data, image) => ({
    name: data.name,
    description: data.description,
    image: `ipfs://${image}`,
    attributes: data.traits,
    external_url: `${config.url_NFTnize}/nft/detail/${collectionContract}:${currentTokenId}`,
  })

  const showMessage = ({ text, color, timeout }) => {
    setSnackbar({ isActive: true, text, color, timeout })
  }

  const MetadataCollectionLevel = (
    data,
    image,
    seller_fee_basis_points = 0,
    feeRecipient = ""
  ) => ({
    name: data.name,
    description: data.description,
    image: `ipfs://${image}`,
    seller_fee_basis_points,
    fee_recipient: feeRecipient,
  })

  // functions-----------------------------------------------------------------------
  const handleValidateForm = () => {
    console.log("handleValidateForm")
    // file validation
    if (mintData.file.length === 0) {
      validList.file.error = true
    }
    if (mintData.file.length !== 0) {
      validList.file.error = false
    }
    // name validation
    if (mintData.name.length === 0) {
      validList.name.error = true
    }
    if (mintData.name.length !== 0) {
      validList.name.error = false
    }
    // unitName validation
    if (mintData.unitName.length === 0) {
      validList.unitName.error = true
    }
    if (mintData.unitName.length !== 0) {
      validList.unitName.error = false
    }
    // token validation
    if (mintData.token.length === 0) {
      validList.token.error = true
    }
    if (mintData.token.length !== 0) {
      validList.token.error = false
    }
    // price validation
    if (putOnMarket === true) {
      if (mintData.price.length === 0) {
        validList.price.error = true
      } else if (mintData.price === 0) {
        validList.price.error = true
      } else {
        validList.price.error = false
      }
    }
    // start validation
    if (putOnMarket === true) {
      if (tab === 0) {
        if (mintData.start.length === 0) {
          validList.start.error = true
        } else if (mintData.start === 0) {
          validList.start.error = true
        } else {
          validList.start.error = false
        }
      } else {
        validList.start.error = false
      }
    }
    // end validation
    if (putOnMarket === true) {
      if (tab === 0) {
        if (mintData.end.length === 0) {
          validList.end.error = true
        } else if (mintData.end === 0) {
          validList.end.error = true
        } else {
          validList.end.error = false
        }
      } else {
        validList.end.error = false
      }
    }
    // total royality validation
    if (
      mintData.totalRoyality.length === 0 ||
      mintData.totalRoyality === 0 ||
      mintData.totalRoyality > 99
    ) {
      validList.totalRoyality.error = true
    } else {
      validList.totalRoyality.error = false
    }
    if (mintData.totalRoyality > 50) {
      validList.totalRoyality.warning = true
    } else {
      validList.totalRoyality.warning = false
    }
    // royality wallets
    if (royalityWallets.length > 0) {
      if (
        royalityWallets.reduce((a, b) => +a + +b.value, 0) !==
        parseFloat(mintData.totalRoyality)
      ) {
        validList.royalityWallets.error = true
      } else if (
        royalityWallets.reduce((a, b) => +a + +b.value, 0) ===
        parseFloat(mintData.totalRoyality)
      ) {
        validList.royalityWallets.error = false
      }
    }
    if (royalityWallets.length === 0) {
      validList.royalityWallets.error = false
    }
    // description validation
    if (mintData.description.length === 0) {
      validList.description.error = true
    }
    if (mintData.description.length !== 0) {
      validList.description.error = false
    }
    // category validation
    if (mintData.category.length === 0) {
      validList.category.error = true
    }
    if (mintData.category.length !== 0) {
      validList.category.error = false
    }
    // collection validation
    if (mintData.collection.length === 0 && mintData.token.length > 0) {
      validList.collection.error = true
    } else {
      validList.collection.error = false
    }
    // network validation
    if (mintData.network.length === 0) {
      validList.network.error = true
    }
    if (mintData.network.length !== 0) {
      validList.network.error = false
    }
  }

  const submitForm = async () => {
    console.log(mintData)
    setErrorStyle(false)
    const array = []
    handleValidateForm()
    Object.values(validList).forEach((fields) => {
      array.push(fields.error)
    })
    if (array.indexOf(true) !== -1) {
      console.log(validList)
      showMessage({
        text: "Please check you entered all inputs!",
        color: "error",
      })
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      let inStart
      let inEnd
      let royaltyInfo = {}
      if (mintData.start === "Right after listing") {
        inStart = moment().unix()
      } else if (mintData.start.length === 0) {
        inStart = ""
      } else {
        inStart = moment(start).unix()
      }

      if (mintData.end === "1") {
        inEnd = moment().add(1, "days").unix()
      } else if (mintData.end === "3") {
        inEnd = moment().add(3, "days").unix()
      } else if (mintData.end === "5") {
        inEnd = moment().add(5, "days").unix()
      } else if (mintData.end === "7") {
        inEnd = moment().add(7, "days").unix()
      } else if (mintData.end.length === 0) {
        inEnd = ""
      } else {
        inEnd = moment(end).unix()
      }

      const formData = {
        ...mintData,
        start: inStart,
        end: inEnd,
        royalityWallets,
        network: localStorage.getItem("selectedNetwork"),
        traits,
      }
      setProgress({
        status: 10,
        note: "Sign user for authenticate...",
      })
      setLoading(true)
      const auth = await signMessage(account, library)
      const fileObj = formData.file
      const tokenID = Math.round(new Date().getTime() / 1000)
      setcurrentTokenId(tokenID)
      const cidImage = await pushImageToIPFS(fileObj, setProgress)
      const metadata = MetadataNFTLevel(formData, cidImage)
      const cid = await pushMetatdataToIPFS(metadata, setProgress)

      // const lazymint = new LazyMinter({
      //   contractAddress: "0x8f4C78368C33F3A1B6A8193C80a8D95581763957",
      //   signer: library,
      // })
      // const data = await lazymint.createVoucher(1, "google.com", 1000000)
      // const convertToJson = JSON.stringify(data.typedData)
      // await signMessageEIP712(account, library, convertToJson)

      const finalRoyalty = calculateRoyalty(
        mintData.totalRoyality,
        royalityWallets
      )

      const royaltyforDeploy = []
      royalityWallets.forEach((royalty) => {
        royaltyforDeploy.push([
          royalty.address,
          parseInt(royalty.value, 10) * 100,
          parseInt(mintData.totalRoyality, 10) * 100,
        ])
      })

      const royaltyReciever = await deployMoneyPip(
        account,
        library,
        royaltyforDeploy,
        setProgress
      )

      royaltyInfo = {
        royaltyReciever,
        total: parseInt(formData.totalRoyality, 10) * 100,
      }

      const mint = await mintNFT(
        formData,
        formData.collection.contractAddress,
        formData.collection.id,
        cid,
        cidImage,
        library,
        account,
        tokenID,
        auth,
        finalRoyalty,
        royaltyInfo,
        setProgress
      )
      setTimeout(() => {
        setProgress({
          status: 100,
          note: "Complete!",
        })
        setLoading(false)
        setSuccessModal(true)
      }, 1000)
    }
  }

  const addCollectionHandler = async (e) => {
    e.preventDefault()
    setCollectionLoading(true)
    setCollectionProgress({
      status: 5,
      note: "Start Creating...",
    })

    await signMessage(account, library)
      .then(async (auth) => {
        const cidImage = await pushImageToIPFS(
          addCollectionData.image,
          setCollectionProgress
        )

        const data = MetadataCollectionLevel(addCollectionData, cidImage)

        const cid = await pushMetatdataToIPFS(data, setCollectionProgress)
        setCollectionProgress({
          status: 80,
          note: "deploy contract to network...",
        })
        const contractAddress = await deployNFT(
          localStorage.getItem("selectedNetwork"),
          library,
          account,
          mintData.token,
          addCollectionData.name,
          addCollectionData.symbol,
          cid
        )
        setCollectionProgress({
          status: 95,
          note: "Caching data...",
        })

        const values = {
          name: addCollectionData.name,
          symbol: addCollectionData.symbol,
          owner: account,
          blockchain: mintData.network,
          image_url: `ipfs://${cidImage}`,
          description: addCollectionData.description,
          collection_type: mintData.token,
          collectionURI: cid,
          contractAddress,
        }
        const cachingData = await StoreToServerCollection(values, account, auth)
        setcollectionContract(contractAddress)
        setcollectionID(cachingData.id)
        addCollectionData.id = cachingData.id
        addCollectionData.contractAddress = contractAddress
        setCollectionProgress({
          status: 100,
          note: "completed!",
        })

        setTimeout(() => {
          collectionData.push(addCollectionData)
          setAddCollectionData({
            id: "",
            contractAddress: "",
            name: "",
            symbol: "",
            description: "",
            shortUrl: "",
          })
          setImageList("")
          getCollections().then((items) => {
            setcollectionData(items)
          })
          collectionData.forEach((coll) => {
            if (coll.id === cachingData.id) {
              setMintData({ ...mintData, collection: coll })
              setCollectionValue(coll.name)
            }
          })
          setCollectionLoading(false)
          setCollectionModal(false)
          showMessage({
            text: "Successfully Created!",
            color: "success",
          })
        }, 3800)
      })
      .catch((error) => {
        setCollectionProgress({
          status: 100,
          note: "Cancel...",
        })
        setCollectionLoading(false)
      })
  }

  const resetMint = () => {
    window.location.reload()
  }

  const changeNetwork = async () => {
    let blockchain = localStorage.getItem("BLOCKCHAIN_STATE")

    if (blockchain) {
      blockchain = JSON.parse(blockchain)
      let blockchainState = {
        BLOCKCHAIN_STATE: blockchain.BLOCKCHAIN_STATE,
        walletConnectionType: blockchain.walletConnectionType,
      }
      if (
        blockchain.walletConnectionType === "MetaMask" ||
        blockchain.walletConnectionType === "MetaMaskPolygon"
      ) {
        if (
          mintData.network === "Eth" &&
          blockchain.BLOCKCHAIN_STATE === "Polygon"
        ) {
          await window.ethereum
            .request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x4" }],
            })
            .then((tx) => {
              blockchainState = {
                BLOCKCHAIN_STATE: "Ethereum",
                walletConnectionType: "MetaMask",
              }
            })
            .catch(async (error) => {
              if (error.code === 4902) {
                const chainId = Web3.utils.toHex(4)
                const addChainPolygon = [
                  {
                    chainId,
                    chainName: "Rinkeby",
                    nativeCurrency: {
                      name: "Ethereum",
                      symbol: "ETH",
                      decimals: 18,
                    },
                    rpcUrls: [
                      "https://rinkeby.infura.io/v3/beb64dbe597141fcbcd23f61f10cfac0",
                    ],
                    blockExplorerUrls: [""],
                  },
                ]

                await window.ethereum
                  .request({
                    method: "wallet_addEthereumChain",
                    params: addChainPolygon,
                  })
                  .then((tx) => {
                    blockchainState = {
                      BLOCKCHAIN_STATE: "Polygon",
                      walletConnectionType: "MetaMaskPolygon",
                    }
                  })
              }
            })
        } else if (
          mintData.network === "Plg" &&
          blockchain.BLOCKCHAIN_STATE === "Ethereum"
        ) {
          try {
            const addpolygon = await window.ethereum
              .request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x13881" }],
              })
              .then((tx) => {
                blockchainState = {
                  BLOCKCHAIN_STATE: "Polygon",
                  walletConnectionType: "MetaMaskPolygon",
                }
              })
              .catch(async (error) => {
                if (error.code === 4902) {
                  const chainId = Web3.utils.toHex(80001)
                  const addChainPolygon = [
                    {
                      chainId,
                      chainName: "Matic(Polygon) Mumbai",
                      nativeCurrency: {
                        name: "MATIC",
                        symbol: "MATIC",
                        decimals: 18,
                      },
                      rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
                      blockExplorerUrls: ["https://mumbai.polygonscan.com"],
                    },
                  ]

                  await window.ethereum
                    .request({
                      method: "wallet_addEthereumChain",
                      params: addChainPolygon,
                    })
                    .then((tx) => {
                      blockchainState = {
                        BLOCKCHAIN_STATE: "Polygon",
                        walletConnectionType: "MetaMaskPolygon",
                      }
                    })
                }
              })
          } catch (error) {
            console.log(error)
          }
        }
      }
      localStorage.setItem("BLOCKCHAIN_STATE", JSON.stringify(blockchainState))
    }
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
    setMintData({
      ...mintData,
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
    setMintData({
      ...mintData,
      end: now,
    })
    setEnd(now)
    setEndPicker(false)
  }

  const handleSelectedWallet = async (provider = null) => {
    if (
      window.ethereum.networkVersion === "4" ||
      window.ethereum.networkVersion === "1"
    ) {
      await connect(MetaMask)
    } else if (
      window.ethereum.networkVersion === "80001" ||
      window.ethereum.networkVersion === "137"
    ) {
      await connect(MetaMaskPolygon)
    }
  }

  const changeCollectionHandler = (value) => {
    if (value === "-1") {
      setCollectionModal(true)
    } else {
      if (collectionData) {
        collectionData.forEach((cl) => {
          if (cl.id === value) {
            setMintData({ ...mintData, collection: cl })
          }
        })
      }
      setCollectionValue(value)
    }
  }

  useEffect(() => {
    setQuan(mintData.Quantity)
  })

  useEffect(() => {
    const selectedNetwork = localStorage.getItem("selectedNetwork")
    if (selectedNetwork !== null && selectedNetwork !== undefined) {
      mintData.network = selectedNetwork
    }
    let blockchainState
    if (
      window.ethereum.networkVersion === "1" ||
      window.ethereum.networkVersion === "4"
    ) {
      localStorage.setItem("selectedNetwork", "Eth")
      setMintData({ ...mintData, network: "Eth" })
      setNet("Eth")
    } else if (
      window.ethereum.networkVersion === "137" ||
      window.ethereum.networkVersion === "80001"
    ) {
      setMintData({ ...mintData, network: "Plg" })
      setNet("Plg")
      localStorage.setItem("selectedNetwork", "Plg")
    }

    getCategories().then((items) => {
      setcategories(
        items
          .sort((a, b) => a.name.localeCompare(b.name))
          .filter(
            (item) =>
              item.name !== "Explore All" &&
              item.name !== "Trending" &&
              item.name !== "Top Sellers"
          )
      )
    })
  }, [])

  useEffect(() => {
    const param = location.search.replace("?", "")
    if (categories) {
      categories.forEach((cat) => {
        if (cat.route === param) {
          setSelectedCategory(cat.id)
          setMintData({ ...mintData, category: cat.id })
        }
      })
    }
  }, [categories])

  useEffect(() => {
    if (tab === 0) {
      setMintData({ ...mintData, price: 0 })
    } else if (tab === 1) {
      setMintData({ ...mintData, start: 0, end: 0, price: 0 })
    }
    if (tab === 0 && mintData.network === "Eth") {
      setLabelTitle("wETH")
    }
    if (tab === 1 && mintData.network === "Eth") {
      setLabelTitle("Eth")
    }
    if (tab === 1 && mintData.network === "Plg") {
      setLabelTitle("MATIC")
    }
  }, [tab])

  useEffect(() => {
    let blockchainState
    if (
      window.ethereum.networkVersion === "1" ||
      window.ethereum.networkVersion === "4"
    ) {
      localStorage.setItem("selectedNetwork", "Eth")
      setMintData({ ...mintData, network: "Eth" })
      setNet("Eth")
    } else if (
      window.ethereum.networkVersion === "137" ||
      window.ethereum.networkVersion === "80001"
    ) {
      setMintData({ ...mintData, network: "Plg" })
      setNet("Plg")
      localStorage.setItem("selectedNetwork", "Plg")
    }
  }, [window.ethereum.networkVersion])

  useEffect(() => {
    setNet(mintData.network)
    changeNetwork()
    if (mintData.network === "Plg") {
      setTab(1)
    }
    if (tab === 0 && mintData.network === "Eth") {
      setLabelTitle("wETH")
    }
    if (tab === 1 && mintData.network === "Eth") {
      setLabelTitle("Eth")
    }
    if (tab === 1 && mintData.network === "Plg") {
      setLabelTitle("MATIC")
    }
  }, [mintData.network])

  useEffect(() => {
    if (mintData.token === "ERC721") {
      setMintData({ ...mintData, Quantity: "1" })
      setQuan("1")
    }
    if (mintData.token === "ERC1155") {
      setTab(1)
    }
    getCollections().then((items) => {
      setcollectionData(items)
    })
  }, [mintData.token])

  useEffect(() => {
    const now = moment().format()
    if (mintData.start === "-1") {
      setMintData({
        ...mintData,
        start: now,
      })
      setStartPicker(true)
      setStart(now)
    } else {
      setStart(mintData.start)
    }
  }, [mintData.start])

  useEffect(() => {
    const now = moment().format()
    if (mintData.end === "-1") {
      setMintData({
        ...mintData,
        end: now,
      })
      setEndPicker(true)
      setEnd(now)
    } else {
      setEnd(mintData.end)
    }
  }, [mintData.end])

  useEffect(() => {
    if (mintData.collection === "-1") {
      setMintData({ ...mintData, collection: "" })
      setCollectionModal(true)
    }
  }, [mintData.collection])

  useEffect(() => {
    if (startPicker === true) {
      setSelectedDateStart(moment().format("YYYY-MM-DD"))
      setSelectedTimeStart(moment().format("HH:mm"))
    }
  }, [startPicker])

  useEffect(() => {
    if (endPicker === true) {
      setSelectedDateEnd(moment().format("YYYY-MM-DD"))
      setSelectedTimeEnd(moment().format("HH:mm"))
    }
  }, [endPicker])

  useEffect(() => {
    if (errorStyle === false) {
      setErrorStyle(true)
    }
  }, [errorStyle])

  useEffect(() => {
    if (putOnMarket === false) {
      validList.price.error = false
      validList.start.error = false
      validList.end.error = false
      setMintData({ ...mintData, start: 0, end: 0 })
    }
  }, [putOnMarket])

  useEffect(() => {
    if (collectionModal === false) {
      setAddCollectionData({
        id: "",
        name: "",
        contractAddress: "",
        symbol: "",
        description: "",
        image: "",
      })
      setImageList("")
    }
  }, [collectionModal])

  return (
    <div className={`mv-mint ${rootTheme === "light" ? "mv-mint-light" : ""}`}>
      <Header />
      <div
        className={`mv-mint-body ${
          rootTheme === "light" ? "mv-mint-body-light" : ""
        }`}
      >
        {connected === true ? (
          <>
            {/* success modal */}
            <Modal
              visible={successModal}
              footer={[]}
              closable={false}
              className="mv-mint-add-collection-modal-body mv-success-modal-body"
              style={{
                padding: "0",
                top: "7vh",
                backgroundColor: "transparent",
              }}
              bodyStyle={{
                display: "flex",
                backgroundColor: "transparent",
                padding: "0",
                justifyContent: "center",
              }}
              onCancel={() => setSuccessModal(false)}
            >
              <div
                className={`mv-mint-collection-modal mv-success-modal ${
                  rootTheme === "light"
                    ? "mv-mint-collection-modal-light mv-success-modal-light"
                    : ""
                }`}
              >
                {/* lottie animation */}
                {rootTheme === "light" ? (
                  <Lottie
                    loop
                    animationData={successWhite}
                    play
                    style={{ width: "160%", height: 250 }}
                  />
                ) : (
                  <Lottie
                    loop
                    animationData={successBlack}
                    play
                    style={{ width: "160%", height: 250 }}
                  />
                )}
                {/* nft image */}
                <img src={nftFileUploaded} alt="nft" />
                {/* nft desc */}
                <div>
                  Your <span>{mintData.name}</span> NFT is successfully created.
                  It will be minted in blockchain while purchasing or
                  transferring
                </div>
                {/* actions */}
                <Button
                  onClick={() => {
                    route.push(
                      `/nft/detail/${collectionContract}:${currentTokenId}`
                    )
                  }}
                >
                  View NFT
                </Button>
                <Button onClick={resetMint}>Create another</Button>
              </div>
              <button
                className={`mv-mint-collection-modal-close ${
                  rootTheme === "light"
                    ? "mv-mint-collection-modal-close-light"
                    : ""
                }`}
                type="button"
                onClick={() => setSuccessModal(false)}
              >
                <img src={closeIcon} alt="close" />
              </button>
            </Modal>
            {/* add collection modal */}
            <Modal
              visible={collectionModal}
              footer={[]}
              closable={false}
              className="mv-mint-add-collection-modal-body"
              style={{
                padding: "0",
                top: "7vh",
                backgroundColor: "transparent",
              }}
              bodyStyle={{
                display: "flex",
                backgroundColor: "transparent",
                padding: "0",
                justifyContent: "center",
              }}
              onCancel={() => setCollectionModal(false)}
            >
              <form
                onSubmit={addCollectionHandler}
                className={`mv-mint-collection-modal ${
                  rootTheme === "light" ? "mv-mint-collection-modal-light" : ""
                }`}
              >
                {/* file upload */}
                <div
                  className={`mv-mint-add-collection-upload ${
                    rootTheme === "light"
                      ? "mv-mint-add-collection-upload-light"
                      : ""
                  }`}
                >
                  <div>
                    {collectionImageList.length === 0 ? (
                      <div>
                        <span style={{ display: "none" }}>no image yet</span>
                      </div>
                    ) : (
                      <div>
                        <img src={collectionImageList} alt="uploaded" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div>Add a new collection</div>
                    <div>
                      We recommend an image of at least 300x300. Gifs work too.
                      Max 5mb.
                    </div>
                    <input
                      onChange={uploadCollection}
                      type="file"
                      name="filefield"
                      style={{ display: "none" }}
                      ref={(fileInput) => setUploadRef(fileInput)}
                    />
                    <Button onClick={() => uploadRef.click()}>
                      <span>Choose file</span>
                    </Button>
                  </div>
                </div>
                {/* name */}
                <div
                  className={`mv-mint-add-collection-field ${
                    rootTheme === "light"
                      ? "mv-mint-add-collection-field-light"
                      : ""
                  }`}
                >
                  <div>
                    <span className="mint-title">
                      <img src={warningStar} alt="required" />
                      Display name (required)
                    </span>
                  </div>
                  <Input
                    required
                    onChange={(e) =>
                      setAddCollectionData({
                        ...addCollectionData,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter Collection Name"
                    className={`mv-mint-field-input ${
                      rootTheme === "light" ? "mv-mint-field-input-light" : ""
                    }`}
                  />
                  <div>Token name cannot be changed in future</div>
                </div>
                {/* symbol */}
                <div
                  className={`mv-mint-add-collection-field ${
                    rootTheme === "light"
                      ? "mv-mint-add-collection-field-light"
                      : ""
                  }`}
                >
                  <div>
                    <span className="mint-title">
                      <img src={warningStar} alt="required" />
                      Symbol (required)
                    </span>
                  </div>
                  <Input
                    required
                    onChange={(e) =>
                      setAddCollectionData({
                        ...addCollectionData,
                        symbol: e.target.value,
                      })
                    }
                    placeholder="Enter token symbo"
                    className={`mv-mint-field-input ${
                      rootTheme === "light" ? "mv-mint-field-input-light" : ""
                    }`}
                  />
                </div>
                {/* description */}
                <div
                  className={`mv-mint-add-collection-field ${
                    rootTheme === "light"
                      ? "mv-mint-add-collection-field-light"
                      : ""
                  }`}
                >
                  <div>
                    <span className="mint-title">
                      <img src={warningStar} alt="required" />
                      Description (optional)
                    </span>
                  </div>
                  <TextArea
                    required
                    onChange={(e) =>
                      setAddCollectionData({
                        ...addCollectionData,
                        description: e.target.value,
                      })
                    }
                    placeholder="Spread some words about your token collection"
                    className={`mv-mint-add-collection-textarea mv-mint-field-textarea ${
                      rootTheme === "light"
                        ? "mv-mint-field-textarea-light"
                        : ""
                    }`}
                  />
                </div>
                <Button disabled={collectionLoading} htmlType="submit">
                  <span>
                    {collectionLoading === true
                      ? "+ Creating..."
                      : "Create Collection"}
                  </span>
                </Button>
                {collectionLoading && (
                  <>
                    <p className={classes.progress__note}>
                      {collectionProgress.note}
                    </p>
                    <div className={classes["mint-progress-bar"]}>
                      <div
                        className="mv-mint-progress-bar"
                        style={{ width: `${collectionProgress.status}%` }}
                      />
                    </div>
                  </>
                )}
              </form>
              <button
                className={`mv-mint-collection-modal-close ${
                  rootTheme === "light"
                    ? "mv-mint-collection-modal-close-light"
                    : ""
                }`}
                type="button"
                onClick={() => setCollectionModal(false)}
              >
                <img src={closeIcon} alt="close" />
              </button>
            </Modal>
            {/* start picker */}
            <Modal
              visible={startPicker}
              footer={[]}
              closable={false}
              width={360}
              bodyStyle={{
                display: "flex",
                boxShadow: "none",
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
            {/* end picker */}
            <Modal
              visible={endPicker}
              footer={[]}
              closable={false}
              width={360}
              bodyStyle={{
                display: "flex",
                boxShadow: "none",
                justifyContent: "center",
              }}
              onCancel={() => setEndPicker(false)}
            >
              <div className="mv-mint-picker-modal">
                <div className="mv-mint-picker-modal-calendar">
                  <Calendar fullscreen={false} onChange={endDateChange} />
                </div>
                <div>
                  <TimePicker
                    defaultValue={moment()}
                    onChange={endTimeChange}
                  />
                </div>
                <Button onClick={submitEndPickerHandler}>Apply</Button>
              </div>
            </Modal>
            <div className="mv-mint-title">
              NFTnize Image, video, audio, 3D model, etc
            </div>
            <div className="mv-mint-subtitle">
              Image, video, audio or 3D model.
            </div>
            <div
              className={`mv-mint-body-section-one ${
                rootTheme === "light" ? "mv-mint-body-section-one-light" : ""
              }`}
            >
              <div>
                {/* file upload description */}
                <div
                  className={`mv-mint-file-upload-desc ${
                    rootTheme === "light"
                      ? "mv-mint-file-upload-desc-light"
                      : ""
                  }`}
                >
                  {rootTheme === "light" ? (
                    <img src={descAlertDark} alt="alert" />
                  ) : (
                    <img src={descAlert} alt="alert" />
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      cursor: "unset",
                      fontSize: "16px",
                    }}
                  >
                    <span>Image, video, audio or 3D model.</span>
                    <span>
                      File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3,
                      WAV, GLB, GLTF. Max size: 40MB.
                    </span>
                  </div>
                </div>
                {/* network field */}
                <div
                  className={`mv-mint-field-wrapper ${
                    rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                  }`}
                  style={loading ? { opacity: ".4" } : { opacity: "1" }}
                  id={
                    errorStyle && validList.network.error === true
                      ? "mv-error-border-red-select"
                      : ""
                  }
                >
                  <div>
                    <span className="mint-title">
                      <img
                        style={{
                          color: "red",
                          position: "absolute",
                          left: "-15px",
                          top: "7px",
                        }}
                        src={warningStar}
                        alt="required"
                      />
                      Choose Blockchain
                      {errorStyle === true &&
                        validList.network.error === true && (
                          <span className="mv-mint-error-text">
                            You must choose a network.
                          </span>
                        )}
                    </span>
                  </div>
                  <Select
                    value={net}
                    disabled={loading}
                    onChange={(value) => {
                      setMintData({ ...mintData, network: value })
                      localStorage.setItem("selectedNetwork", value)
                    }}
                    suffixIcon={<SelectArrow />}
                    className={`mv-mint-field-input ${
                      rootTheme === "light" ? "mv-mint-field-input-light" : ""
                    }`}
                  >
                    {networkTypes.map((cat, index) => (
                      <Option key={index} value={cat.value}>
                        <img
                          className="mv-selectbox-option-icon"
                          src={cat.value === "Eth" ? ethIcon : ployIcon}
                          alt="network logo"
                        />
                        {cat.label}
                      </Option>
                    ))}
                  </Select>
                </div>
                {/* put on marketplace */}
                <div
                  style={loading ? { opacity: ".4" } : { opacity: "1" }}
                  className={`mv-mint-put-on-market ${
                    rootTheme === "light" ? "mv-mint-put-on-market-light" : ""
                  }`}
                >
                  <div>Put on marketplace</div>
                  <Switch
                    disabled={loading}
                    checked={putOnMarket}
                    onChange={(value) => {
                      setPutOnMarket(value)
                      setMintData({ ...mintData, putOnMarketPlace: value })
                    }}
                  />
                </div>
                {/* tabs */}
                {putOnMarket === true && (
                  <div
                    style={loading ? { opacity: ".4" } : { opacity: "1" }}
                    className={`mv-mint-tab-btn-wrapper ${
                      rootTheme === "light"
                        ? "mv-mint-tab-btn-wrapper-light"
                        : ""
                    }`}
                  >
                    {mintData.token === "ERC1155" ||
                    mintData.network === "Plg" ? (
                      <Popover
                        placement="top"
                        trigger="hover"
                        content={disablePopoverContent}
                      >
                        <Button
                          onClick={() => {
                            if (mintData.token !== "ERC1155") {
                              setTab(0)
                            }
                          }}
                          disabled={
                            mintData.token === "ERC1155" ||
                            mintData.network === "Plg"
                          }
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
                      </Popover>
                    ) : (
                      <Button
                        onClick={() => {
                          if (mintData.token !== "ERC1155") {
                            setTab(0)
                          }
                        }}
                        disabled={
                          mintData.token === "ERC1155" ||
                          mintData.network === "Plg"
                        }
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
                    )}
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
                )}
                {/* token field */}
                <div
                  className={`mv-mint-field-wrapper ${
                    rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                  }`}
                  style={loading ? { opacity: ".4" } : { opacity: "1" }}
                  id={
                    errorStyle && validList.token.error === true
                      ? "mv-error-border-red-select"
                      : ""
                  }
                >
                  <div>
                    <span className="mint-title">
                      <img
                        style={{
                          color: "red",
                          position: "absolute",
                          left: "-15px",
                          top: "7px",
                        }}
                        src={warningStar}
                        alt="required"
                      />
                      Choose Token
                      {errorStyle === true &&
                        validList.token.error === true && (
                          <span className="mv-mint-error-text">
                            You must select a token.
                          </span>
                        )}
                    </span>
                    <span> </span>
                  </div>
                  <Select
                    onChange={(value) =>
                      setMintData({ ...mintData, token: value })
                    }
                    disabled={loading}
                    suffixIcon={<SelectArrow />}
                    className={`mv-mint-field-input ${
                      rootTheme === "light" ? "mv-mint-field-input-light" : ""
                    }`}
                  >
                    {tokenTypes.map((cat, index) => (
                      <Option key={index} value={cat.value}>
                        {cat.label}
                      </Option>
                    ))}
                  </Select>
                </div>
                {/* name field */}
                <div
                  className={`mv-mint-field-wrapper ${
                    rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                  }`}
                  style={loading ? { opacity: ".4" } : { opacity: "1" }}
                >
                  <div>
                    <span className="mint-title">
                      <img
                        style={{
                          color: "red",
                          position: "absolute",
                          left: "-15px",
                          top: "7px",
                        }}
                        src={warningStar}
                        alt="required"
                      />
                      Name
                      {errorStyle === true && validList.name.error === true && (
                        <span className="mv-mint-error-text">
                          NFT Name is required.
                        </span>
                      )}
                    </span>
                    <span
                      style={
                        rootTheme === "light"
                          ? { color: "#0000004D" }
                          : { color: "#FFFFFF4D" }
                      }
                    >
                      Nft names must be 32 characters or less
                    </span>
                  </div>
                  <Input
                    onChange={(e) =>
                      setMintData({ ...mintData, name: e.target.value })
                    }
                    disabled={loading}
                    className={`mv-mint-field-input ${
                      rootTheme === "light" ? "mv-mint-field-input-light" : ""
                    }`}
                    id={
                      errorStyle && validList.name.error === true
                        ? "mv-error-border-red"
                        : ""
                    }
                  />
                </div>
                {/* unit name field */}
                <div
                  className={`mv-mint-field-wrapper ${
                    rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                  }`}
                  style={loading ? { opacity: ".4" } : { opacity: "1" }}
                >
                  <div>
                    <span className="mint-title">
                      <img
                        style={{
                          color: "red",
                          position: "absolute",
                          left: "-15px",
                          top: "7px",
                        }}
                        src={warningStar}
                        alt="required"
                      />
                      Unit Name
                      {errorStyle === true &&
                        validList.unitName.error === true && (
                          <span className="mv-mint-error-text">
                            NFT Unit Name is required.
                          </span>
                        )}
                    </span>
                    <span
                      style={
                        rootTheme === "light"
                          ? { color: "#0000004D" }
                          : { color: "#FFFFFF4D" }
                      }
                    >
                      Nft names must be 8 characters or less
                    </span>
                  </div>
                  <Input
                    onChange={(e) =>
                      setMintData({ ...mintData, unitName: e.target.value })
                    }
                    disabled={loading}
                    className={`mv-mint-field-input ${
                      rootTheme === "light" ? "mv-mint-field-input-light" : ""
                    }`}
                    id={
                      errorStyle && validList.unitName.error === true
                        ? "mv-error-border-red"
                        : ""
                    }
                  />
                </div>
                {/* Quantity field */}
                <div
                  style={loading ? { opacity: ".4" } : { opacity: "1" }}
                  className={`mv-mint-field-wrapper ${
                    rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                  }`}
                >
                  <div>
                    <span className="mint-title">Quantity</span>
                  </div>
                  <Input
                    disabled={mintData.token === "ERC721"}
                    value={quan === 0 ? "" : quan}
                    onChange={(e) =>
                      setMintData({ ...mintData, Quantity: e.target.value })
                    }
                    className={`mv-mint-field-input ${
                      rootTheme === "light" ? "mv-mint-field-input-light" : ""
                    }`}
                  />
                </div>
                {/* Sale Price field */}
                {tab === 1 && putOnMarket === true && (
                  <div
                    className={`mv-mint-field-wrapper ${
                      rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                    }`}
                    style={loading ? { opacity: ".4" } : { opacity: "1" }}
                    id={
                      errorStyle && validList.price.error === true
                        ? "mv-error-border-red-select"
                        : ""
                    }
                  >
                    <div>
                      Sale Price
                      {errorStyle === true &&
                        validList.price.error === true && (
                          <span className="mv-mint-error-text">
                            You must enter a price.
                          </span>
                        )}
                    </div>
                    <Input
                      onChange={(e) =>
                        setMintData({ ...mintData, price: e.target.value })
                      }
                      disabled={loading}
                      suffix={<PriceLabel title={labelTitle} />}
                      className={`mv-mint-field-input ${
                        rootTheme === "light" ? "mv-mint-field-input-light" : ""
                      }`}
                    />
                  </div>
                )}
                {/* Minimum Price field */}
                {tab === 0 && putOnMarket === true && (
                  <div
                    className={`mv-mint-field-wrapper ${
                      rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                    }`}
                    style={loading ? { opacity: ".4" } : { opacity: "1" }}
                    id={
                      errorStyle && validList.price.error === true
                        ? "mv-error-border-red-select"
                        : ""
                    }
                  >
                    <div>
                      Minimum Price
                      {errorStyle === true &&
                        validList.price.error === true && (
                          <span className="mv-mint-error-text">
                            You must enter a price.
                          </span>
                        )}
                      <span> </span>
                    </div>
                    <Input
                      onChange={(e) =>
                        setMintData({
                          ...mintData,
                          price: e.target.value,
                        })
                      }
                      disabled={loading}
                      suffix={<PriceLabel title={labelTitle} />}
                      className={`mv-mint-field-input ${
                        rootTheme === "light" ? "mv-mint-field-input-light" : ""
                      }`}
                    />
                  </div>
                )}
                {/* Starting Bid */}
                {tab === 0 && putOnMarket === true && (
                  <div
                    className={`mv-mint-field-wrapper ${
                      rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                    }`}
                    style={loading ? { opacity: ".4" } : { opacity: "1" }}
                    id={
                      errorStyle && validList.start.error === true
                        ? "mv-error-border-red-select"
                        : ""
                    }
                  >
                    <div>
                      Starting Bid
                      {errorStyle === true &&
                        validList.start.error === true && (
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
                      onChange={(value) =>
                        setMintData({ ...mintData, start: value })
                      }
                      disabled={loading}
                      suffixIcon={<SelectArrow />}
                      className={`mv-mint-field-input ${
                        rootTheme === "light" ? "mv-mint-field-input-light" : ""
                      }`}
                    >
                      <Option value="Right after listing">
                        Right after listing
                      </Option>
                      <Option value="-1">Pick specific date</Option>
                    </Select>
                  </div>
                )}
                {/* Expire bid */}
                {tab === 0 && putOnMarket === true && (
                  <div
                    className={`mv-mint-field-wrapper ${
                      rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                    }`}
                    style={loading ? { opacity: ".4" } : { opacity: "1" }}
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
                      onChange={(value) =>
                        setMintData({ ...mintData, end: value })
                      }
                      disabled={loading}
                      suffixIcon={<SelectArrow />}
                      className={`mv-mint-field-input ${
                        rootTheme === "light" ? "mv-mint-field-input-light" : ""
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
                {/* Assign Total Royalty field */}
                <div
                  className={`mv-mint-field-wrapper ${
                    rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                  }`}
                  style={loading ? { opacity: ".4" } : { opacity: "1" }}
                >
                  <div>
                    <span className="mint-title">
                      Assign Total Royalty (%)
                      {errorStyle === true &&
                        validList.totalRoyality.error === true && (
                          <span className="mv-mint-error-text">
                            You must enter a total royality between 0 and 50.
                          </span>
                        )}
                      {errorStyle === true &&
                        validList.totalRoyality.warning === true &&
                        validList.totalRoyality.error === false && (
                          <span className="mv-mint-warning-text">
                            Your nft don't publish if your royalty higher than
                            50%.
                          </span>
                        )}
                    </span>
                  </div>
                  <Input
                    onChange={(e) => {
                      setMintData({
                        ...mintData,
                        totalRoyality: e.target.value,
                      })
                      if (
                        e.target.value.length === 0 ||
                        e.target.value === 0 ||
                        e.target.value > 99
                      ) {
                        validList.totalRoyality.error = true
                      } else {
                        validList.totalRoyality.error = false
                      }
                      if (e.target.value > 50) {
                        validList.totalRoyality.warning = true
                      } else {
                        validList.totalRoyality.warning = false
                      }
                    }}
                    className={`mv-mint-field-input ${
                      rootTheme === "light" ? "mv-mint-field-input-light" : ""
                    } ${
                      errorStyle && validList.totalRoyality.warning === true
                        ? "mv-error-border-warning"
                        : ""
                    }`}
                    id={
                      errorStyle && validList.totalRoyality.error === true
                        ? "mv-error-border-red"
                        : ""
                    }
                    disabled={loading}
                  />
                  <div
                    style={
                      rootTheme === "light"
                        ? { color: "#0000004D" }
                        : { color: "#FFFFFF4D" }
                    }
                  >
                    The percentage of sale price sent to the creator's address
                    when the asset is sold. Applies to both first and second
                    hand sales.
                  </div>
                </div>
                {/* Total Royalty wallets field */}
                <div
                  className={`mv-mint-list-field-wrapper ${
                    rootTheme === "light"
                      ? "mv-mint-list-field-wrapper-light"
                      : ""
                  }`}
                  style={loading ? { opacity: ".4" } : { opacity: "1" }}
                  id={
                    errorStyle && validList.royalityWallets.error === true
                      ? "mv-error-border-red-select"
                      : ""
                  }
                >
                  <div>
                    <span className="mint-title">
                      Royalty Wallets
                      {errorStyle === true &&
                        validList.royalityWallets.error === true && (
                          <span className="mv-mint-error-text">
                            The sum of the values ​​must be equal to the Total
                            Royality.
                          </span>
                        )}
                    </span>
                    <button
                      onClick={() => {
                        setRoyalityWallets([
                          ...royalityWallets,
                          {
                            address: "",
                            value: "",
                            role: "",
                          },
                        ])
                      }}
                      type="button"
                      disabled={loading}
                    >
                      + Add
                    </button>
                  </div>
                  <div>
                    {royalityWallets.length === 0 && (
                      <div
                        style={{
                          width: "100%",
                          textAlign: "center",
                          fontSize: "12px",
                          padding: "20px 0",
                        }}
                      >
                        No wallet added, click on "Add" to add a wallet.
                      </div>
                    )}
                    {royalityWallets.length > 0 &&
                      royalityWallets.map((wallet, index) => (
                        <div
                          className={`mv-mint-list-field ${
                            rootTheme === "light"
                              ? "mv-mint-list-field-light"
                              : ""
                          }`}
                          key={index}
                        >
                          <Input
                            onChange={(e) => {
                              wallet.address = e.target.value
                            }}
                            placeholder="Wallet Address"
                          />
                          <Input
                            onChange={(e) => {
                              wallet.value = e.target.value
                            }}
                            placeholder="Royality Value (%)"
                          />
                          <Select
                            onChange={(value) => {
                              wallet.role = value
                            }}
                            suffixIcon={<SelectArrow />}
                            className={`mv-mint-field-input ${
                              rootTheme === "light"
                                ? "mv-mint-field-input-light"
                                : ""
                            }`}
                          >
                            <Option value="royal_member">Royal Member</Option>
                            <Option value="curator">Curator</Option>
                            <Option value="creator">Creator</Option>
                            <Option value="charity">Charity</Option>
                            <Option value="gallery_owner">Gallery Owner</Option>
                            <Option value="buyer_affiliate">
                              Buyer Affiliate
                            </Option>
                            <Option value="creator_affiliate">
                              Creator Affiliate
                            </Option>
                            <Option value="partner_1">Partner 1</Option>
                            <Option value="partner_2">Partner 2</Option>
                            <Option value="other">Other</Option>
                          </Select>
                          <Button
                            onClick={() =>
                              setRoyalityWallets(
                                royalityWallets.filter((rw, i) => i !== index)
                              )
                            }
                          >
                            -Remove
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              {/* file upload field */}
              <div
                id={
                  errorStyle && validList.file.error === true
                    ? "mv-error-border-red"
                    : ""
                }
                style={loading ? { opacity: ".4" } : { opacity: "1" }}
              >
                <FileUpload
                  title="Click here to select file"
                  boxWidth="100%"
                  boxHeight="100%"
                  minHeight="600px"
                  showUnitName="true"
                  showQantity="true"
                  mintData={mintData}
                  setMintData={setMintData}
                  setNftFileUploaded={setNftFileUploaded}
                />
                {errorStyle === true && validList.file.error === true && (
                  <span className="mv-mint-error-text">
                    You must upload a file.
                  </span>
                )}
              </div>
            </div>
            <div className="mv-mint-body-section-two">
              {/* Description field */}
              <div
                className={`mv-mint-field-wrapper ${
                  rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                }`}
                style={loading ? { opacity: ".4" } : { opacity: "1" }}
              >
                <div>
                  <span className="mint-title">
                    <img
                      style={{
                        color: "red",
                        position: "absolute",
                        left: "-15px",
                        top: "7px",
                      }}
                      src={warningStar}
                      alt="required"
                    />
                    Description
                    {errorStyle === true &&
                      validList.description.error === true && (
                        <span className="mv-mint-error-text">
                          You must enter a description.
                        </span>
                      )}
                  </span>
                </div>
                <TextArea
                  onChange={(e) =>
                    setMintData({ ...mintData, description: e.target.value })
                  }
                  disabled={loading}
                  className={`mv-mint-field-textarea ${
                    rootTheme === "light" ? "mv-mint-field-textarea-light" : ""
                  }`}
                  id={
                    errorStyle && validList.description.error === true
                      ? "mv-error-border-red"
                      : ""
                  }
                />
              </div>
              {/* categroy field */}
              <div
                className={`mv-mint-field-wrapper ${
                  rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                }`}
                style={loading ? { opacity: ".4" } : { opacity: "1" }}
                id={
                  errorStyle && validList.category.error === true
                    ? "mv-error-border-red-select"
                    : ""
                }
              >
                <div>
                  <span className="mint-title">
                    Select Category
                    {errorStyle === true &&
                      validList.category.error === true && (
                        <span className="mv-mint-error-text">
                          You must select a category.
                        </span>
                      )}
                  </span>
                </div>
                <Select
                  onChange={(value) => {
                    setMintData({ ...mintData, category: value })
                    setSelectedCategory(value)
                  }}
                  value={selectedCategory}
                  disabled={loading}
                  suffixIcon={<SelectArrow />}
                  className={`mv-mint-field-input ${
                    rootTheme === "light" ? "mv-mint-field-input-light" : ""
                  }`}
                >
                  {categories !== null &&
                    categories.map((cat, index) => (
                      <Option key={cat.id} value={cat.id}>
                        {cat.name}
                      </Option>
                    ))}
                </Select>
              </div>
              {/* Collections field */}
              <div
                className={`mv-mint-field-wrapper ${
                  rootTheme === "light" ? "mv-mint-field-wrapper-light" : ""
                }`}
                style={
                  mintData.token.length === 0
                    ? { opacity: ".5" }
                    : { opacity: "1" }
                }
                id={
                  errorStyle && validList.collection.error === true
                    ? "mv-error-border-red-select"
                    : ""
                }
              >
                <div>
                  <span
                    style={loading ? { opacity: ".4" } : { opacity: "1" }}
                    className="mint-title"
                  >
                    collections
                    {mintData.token.length === 0 && (
                      <Popover
                        content={collectionDisableContent}
                        trigger="hover"
                        placement="topRight"
                      >
                        <img
                          style={{ marginLeft: "10px", width: "20px" }}
                          src={warningIcon}
                          alt="warning"
                        />
                      </Popover>
                    )}
                    {errorStyle === true &&
                      validList.collection.error === true && (
                        <span className="mv-mint-error-text">
                          You must select a collection.
                        </span>
                      )}
                  </span>
                </div>
                <Select
                  style={loading ? { opacity: ".4" } : { opacity: "1" }}
                  disabled={mintData.token.length === 0}
                  value={collectionValue}
                  onChange={(value) => changeCollectionHandler(value)}
                  suffixIcon={<SelectArrow />}
                  className={`mv-mint-field-input ${
                    rootTheme === "light" ? "mv-mint-field-input-light" : ""
                  }`}
                >
                  {collectionData &&
                    collectionData.length > 0 &&
                    collectionData.map(
                      (data, index) =>
                        data.blockchain ===
                          localStorage.getItem("selectedNetwork") && (
                          <Option key={index} value={data.id}>
                            {data.name}
                          </Option>
                        )
                    )}
                  <Option value="-1">+ Create</Option>
                </Select>
              </div>
              {/* Traits field */}
              <div
                className={`mv-mint-list-field-wrapper ${
                  rootTheme === "light"
                    ? "mv-mint-list-field-wrapper-light"
                    : ""
                }`}
                style={loading ? { opacity: ".4" } : { opacity: "1" }}
              >
                <div>
                  <span className="mint-title">Traits</span>
                  <button
                    onClick={() => {
                      setTraits([
                        ...traits,
                        {
                          trait_type: "",
                          key: "",
                          value: "",
                        },
                      ])
                    }}
                    disabled={loading}
                    type="button"
                  >
                    + Add
                  </button>
                </div>
                <div>
                  {traits.length === 0 && (
                    <div
                      style={{
                        width: "100%",
                        textAlign: "center",
                        fontSize: "12px",
                        padding: "20px 0",
                      }}
                    >
                      No traits added, click on "Add" to add a trait.
                    </div>
                  )}
                  {traits.length > 0 &&
                    traits.map((trait, index) => (
                      <div
                        className={`mv-mint-list-field ${
                          rootTheme === "light"
                            ? "mv-mint-list-field-light"
                            : ""
                        }`}
                        key={index}
                      >
                        <Input
                          onChange={(e) => {
                            trait.trait_type = e.target.value
                            trait.key = e.target.value
                          }}
                          placeholder="Trait Type"
                        />
                        <Input
                          onChange={(e) => {
                            trait.value = e.target.value
                          }}
                          placeholder="Trait Value"
                        />
                        <Button
                          onClick={() =>
                            setTraits(traits.filter((rw, i) => i !== index))
                          }
                        >
                          - Remove
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            {/* form submit button */}
            <div className="mv-mint-submit-btn-wrapper">
              <Button
                disabled={loading}
                onClick={submitForm}
                className={`mv-mint-submit-button ${
                  rootTheme === "light" ? "mv-mint-submit-button-light" : ""
                }`}
                style={loading ? { opacity: ".4" } : { opacity: "1" }}
              >
                {loading === true ? (
                  <span>Creating...</span>
                ) : (
                  <span>NFTnize</span>
                )}
              </Button>
            </div>
            {/* progress bar */}
            {loading && (
              <>
                <p className={classes.progress__note}>{progress.note}</p>
                <div className={classes["mint-progress-bar"]}>
                  <div
                    className="mv-mint-progress-bar"
                    style={{ width: `${progress.status}%` }}
                  />
                </div>
              </>
            )}
          </>
        ) : (
          // user not connected view
          <div className="mv-mint-user-not-connected-ui">
            <div>NFTnize Image, video, audio, 3D model, etc</div>
            <Button
              onClick={handleSelectedWallet}
              className={`mv-mint-submit-button ${
                rootTheme === "light" ? "mv-mint-submit-button-light" : ""
              }`}
              type="button"
            >
              Connect Wallet
            </Button>
          </div>
        )}
      </div>
      <Snackbar
        text={snackbar.text}
        active={snackbar.isActive}
        color={snackbar.color}
        timeout={snackbar.timeout}
        onClose={() => setSnackbar({ ...snackbar, isActive: false })}
      />
      <Footer />
    </div>
  )
}
export default Body
