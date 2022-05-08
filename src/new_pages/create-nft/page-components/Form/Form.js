/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-shadow */
import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import classNames from "classnames"
import { SessionWallet } from "algorand-session-wallet"

import { useWeb3React } from "@web3-react/core"
import { Dialog, Classes, Checkbox } from "@blueprintjs/core"
import useWallet from "hooks/useWallet"
import {
  pushMetatdataToIPFS,
  pushImageToIPFS,
} from "../../../../utils/mint/ipfs"
import {
  deployNFT,
  signMessage,
  mintNFT,
  StoreToServerNFT,
} from "../../../../utils/mint"
import {
  TextField,
  NumberField,
  Textarea,
  Button,
  ImagePicker,
  AlertModal,
  SelectDropdown,
} from "new_components"
import {
  metadataFormatTypes,
  networkTypes,
  categories,
  tokenTypes,
} from "utils/constants"
import {
  setSessionWallet,
  setAccounts,
  setConnectedStatus,
} from "redux/wallet/wallet-slice"
import { putToPinata } from "utils/ipfs"
import { imageIntegrity, NFT, NFTMetadata, ARC69Metadata } from "utils/nft"
import { ReactComponent as PlusIcon } from "new_assets/icons/plus-circle.svg"
import classes from "./Form.module.scss"
import {
  walletconnect,
  walletlink,
  MetaMask,
} from "../../../../utils/walletConnector/ETHConnector"
import {
  MetaMaskPolygon,
  fortmatic,
  portis,
  torus,
} from "../../../../utils/walletConnector/PolygonConnector"

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

export const Form = (props) => {
  const { className, sw } = props
  const dispatch = useDispatch()
  const history = useHistory()
  const { connect, deactive } = useWallet()

  const initErrors = {
    image: {
      status: false,
      message: "",
      warning: false,
    },
    name: {
      status: false,
      message: "",
      warning: false,
    },
    unitName: {
      status: false,
      message: "",
      warning: false,
    },
    royalty: {
      status: false,
      message: "",
      warning: false,
    },
    decimal: {
      status: false,
      message: "",
      warning: false,
    },
    description: {
      status: false,
      message: "",
      warning: false,
    },
    category: {
      status: false,
      message: "",
      warning: false,
    },
    token: {
      status: false,
      message: "",
      warning: false,
    },
    mints: [],
    addresses: [],
  }

  const [meta, setMeta] = useState(new NFTMetadata())
  const [arc69Meta, setArc69Meta] = useState(new ARC69Metadata())
  const [loading, setLoading] = useState(false)
  const [fileObj, setFileObj] = useState()
  const [nameVal, setName] = useState("")
  const [unitName, setUnitName] = useState("")
  const [metadataFormat, setMetadataFormat] = useState("")
  const [network, setNetwork] = useState("Eth")
  const { account, library, active: connected } = useWeb3React()
  const [theme, setTheme] = useState(JSON.parse(localStorage.getItem("theme")))
  const { rootTheme } = useSelector((state) => state.application)

  const [category, setCategory] = useState("")
  const [token, setToken] = useState("")

  const [progress, setProgress] = useState({
    status: 0,
    note: "",
  })
  const [mints, setMints] = useState([])
  const [addresses, setAddresses] = useState([])
  const [errors, setErrors] = useState(initErrors)

  const initInfoDialog = {
    isOpen: false,
    data: { title: "", desc: "" },
  }

  const [infoDialog, setInfoDialog] = useState(initInfoDialog)
  const [decimal, setDecimal] = useState(1)
  const [selectorOpen, setSelectorOpen] = useState(false)

  useEffect(() => {
    setMetadataFormat("arc3")
  }, [])
  const handleNumberChange = (e) => {
    setDecimal(e.target.value)
  }

  const createRandomId = () => {
    const id = Math.random()
    if (mints.some((mint) => mint.id === id)) {
      createRandomId()
    } else {
      return id
    }
  }

  const createRandomIdForAddress = () => {
    const id = Math.random()
    if (addresses.some((address) => address.id === id)) {
      createRandomId()
    } else {
      return id
    }
  }

  const handleAddMint = () => {
    const existingMints = [...mints]
    existingMints.push({
      id: createRandomId(),
      name: "",
      value: "",
    })

    setMints(existingMints)
  }

  const handleAddAddress = () => {
    const existingAddresses = [...addresses]
    existingAddresses.push({
      id: createRandomIdForAddress(),
      address: "",
      value: "",
    })

    setAddresses(existingAddresses)
  }

  const handleRemoveMint = (id) => {
    // find target mint
    const existingMints = [...mints]
    const targetId = existingMints.findIndex((m) => m.id === id)

    if (targetId !== -1) {
      // remove mint
      existingMints.splice(targetId, 1)
      setMints(existingMints)
    }
  }

  const handleRemoveAddress = (id) => {
    // find target mint
    const existingAddresses = [...addresses]
    const targetId = existingAddresses.findIndex((address) => address.id === id)

    if (targetId !== -1) {
      // remove mint
      existingAddresses.splice(targetId, 1)
      setAddresses(existingAddresses)
    }
  }

  const handleOnChangeMintInput = ({ event, type, id }) => {
    const existingMints = [...mints]
    // find target input
    const targetIndex = existingMints.findIndex((mint) => mint.id === id)

    if (targetIndex !== -1) {
      // update value
      if (type === "name") {
        existingMints[targetIndex].name = event.target.value
      } else if (type === "value") {
        existingMints[targetIndex].value = event.target.value
      }
    }

    setMints(existingMints)
  }

  const handleOnChangeAddressesInput = ({ event, type, id }) => {
    const existingAddresses = [...addresses]
    // find target input
    const targetIndex = existingAddresses.findIndex(
      (address) => address.id === id
    )

    if (targetIndex !== -1) {
      // update value
      if (type === "address") {
        existingAddresses[targetIndex].address = event.target.value
      } else if (type === "value") {
        existingAddresses[targetIndex].value = event.target.value
      }
    }

    setAddresses(existingAddresses)
  }

  const handleValidateForm = (e) => {
    e.preventDefault()
    const elements = e.target.elements
    let formValues = {}
    if (metadataFormat === "arc3") {
      formValues = {
        image: fileObj,
        metadata: meta,
        name: elements.name.value.trim(),
        unitName: elements.unitName.value.trim(),
        royalty: elements.royalty.value.trim()
          ? Number(elements.royalty.value.trim())
          : undefined,
        decimal: elements.decimal.value.trim()
          ? Number(elements.decimal.value.trim())
          : undefined,
        description: elements.description.value.trim(),
        category,
        token,
        network,
      }
    } else if (metadataFormat === "arc69") {
      formValues = {
        image: fileObj,
        metadata: arc69Meta,
        name: elements.name.value.trim(),
        unitName: elements.unitName.value.trim(),
        royalty: elements.royalty.value.trim()
          ? Number(elements.royalty.value.trim())
          : undefined,
        decimal: elements.decimal.value.trim()
          ? Number(elements.decimal.value.trim())
          : undefined,
        description: elements.description.value.trim(),
        category,
        token,
        network,
      }
    }

    const errorsObj = { ...initErrors }

    // image
    if (!formValues.image) {
      errorsObj.image = {
        status: true,
        message: "Please select an image.",
      }
    }
    // name
    if (formValues.name.length < 3 || formValues.name.length >= 32) {
      if (formValues.name.length < 3) {
        errorsObj.name = {
          status: true,
          message: "The NFT name must be more than 2 characters.",
        }
      } else if (formValues.name.length > 3 && formValues.name.length >= 32) {
        errorsObj.name = {
          status: true,
          message: "The NFT name must be less than 32 characters.",
        }
      }
    }
    // unit name
    if (formValues.unitName.length < 3 || formValues.unitName.length >= 8) {
      if (formValues.unitName.length < 3) {
        errorsObj.unitName = {
          status: true,
          message: "Unit name must be more than 2 characters.",
        }
      } else if (
        formValues.unitName.length > 3 &&
        formValues.unitName.length >= 8
      ) {
        errorsObj.unitName = {
          status: true,
          message: "Unit name must be less than 8 characters.",
        }
      }
    }
    // royalty
    // eslint-disable-next-line no-restricted-globals
    if (formValues.royalty <= 0) {
      errorsObj.royalty = {
        status: true,
        message: "Royalty must be bigger than 0%.",
      }
    }
    if (formValues.royalty >= 90) {
      errorsObj.royalty = {
        status: true,
        message: "Royalty must be smller than 90%.",
      }
    }
    if (addresses.length > 0) {
      if (addresses.reduce((a, b) => +a + +b.value, 0) !== formValues.royalty) {
        errorsObj.royalty = {
          status: true,
          warning: false,
          message: "Royalty must be equal to the sum of the royalties entered",
        }
      }
    }
    // eslint-disable-next-line no-restricted-globals
    if (formValues.royalty >= 10 && formValues.royalty <= 90) {
      errorsObj.royalty = {
        status: false,
        warning: true,
        message: "Your nft don't publish if your royalty higher than 10%.",
      }
    }
    // category
    // eslint-disable-next-line no-restricted-globals
    if (category.length === 0) {
      errorsObj.category = {
        status: true,
        warning: false,
        message: "To publish your NFT you need to select a category",
      }
    }
    // token
    // eslint-disable-next-line no-restricted-globals
    if (token.length === 0) {
      errorsObj.token = {
        status: true,
        warning: false,
        message: "To publish your NFT you need to select a Token",
      }
    }
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(formValues.decimal)) {
      errorsObj.decimal = {
        status: true,
        message: "Quantity must be a number.",
      }
    }
    // description
    if (formValues.description.length < 3) {
      errorsObj.description = {
        status: true,
        message: "Description must be more than 2 characters.",
      }
    }

    // check for mint validations
    mints.forEach((mint) => {
      const isNameNotValid = !!(
        !mint.name.trim() && mint.name.trim().length < 3
      )
      const isValueNotValid = !!(
        !mint.value.trim() && mint.value.trim().length < 3
      )

      if (isNameNotValid || isValueNotValid) {
        errorsObj.mints.push({
          id: mint.id,
          name: isNameNotValid,
          value: isValueNotValid,
        })
      }
    })

    addresses.forEach((address) => {
      const isAddressNotValid = !!(
        !address.address.trim() && address.address.trim().length < 3
      )

      const isValueNotValid = !!(
        !address.value.trim() && address.value.trim().length === 0
      )

      if (isAddressNotValid || isValueNotValid) {
        errorsObj.addresses.push({
          id: address.id,
          address: isAddressNotValid,
          value: isValueNotValid,
        })
      }
    })

    setErrors(errorsObj)

    const isAllFormValuesValid = Object.values(errorsObj).every((field) => {
      if (Array.isArray(field)) {
        return field.length === 0
      }
      return !field.status
    })

    if (isAllFormValuesValid) {
      // all fields are valid
      mintNft({ ...formValues, mints, addresses })
    }
  }

  const captureMetadata = (values) => {
    const eprops = values.mints.reduce(
      (all, ep) => ({ ...all, [ep.name]: ep.value }),
      {}
    )
    const addprops = addresses.reduce(
      (all, ep) => ({ ...all, [ep.address]: ep.value }),
      {}
    )
    if (metadataFormat === "arc3") {
      return new NFTMetadata({
        name: values.name,
        unitName: values.unitName,
        description: values.description,
        image_mimetype: values.image.type,
        royalty: values.royalty,
        // decimals: values.decimal,
        total: values.decimal,
        properties: { ...eprops, ...meta.properties, ...addprops },
      })
    } else if (metadataFormat === "arc69") {
      return new ARC69Metadata({
        standard: "arc69",
        name: values.name,
        unitName: values.unitName,
        description: values.description,
        image_mimetype: values.image.type,
        royalty: values.royalty,
        // decimals: values.decimal,
        total: values.decimal,
        properties: { ...eprops, ...arc69Meta.properties, ...addprops },
      })
    }
  }

  const mintNft = async (values) => {
    setProgress({
      status: 10,
      note: "Sign user...",
    })
    const auth = await signMessage(account, library)
    setLoading(true)
    setProgress({
      status: 10,
      note: "Starting mint...",
    })
    const md = captureMetadata(values)
    md.image_integrity = await imageIntegrity(fileObj)
    setProgress({
      status: 30,
      note: "Calculating integrity...",
    })

    if (metadataFormat === "arc3") {
      setMeta(md)
    } else if (metadataFormat === "arc69") {
      setArc69Meta(md)
    }
    const cidImage = await pushImageToIPFS(fileObj, md, setProgress)
    const cid = await pushMetatdataToIPFS(md, cidImage, setProgress)
    // const cid = "asdasdasd"
    const imageURL = `${process.env.REACT_APP_PINATA_GET_IPFS}/${cidImage}`
    // const imageURL = "asdasdasdasd"
    setProgress({
      status: 59,
      note: "Deploy your NFT...",
    })

    // const contractAddress = await deployNFT(
    //   library,
    //   account,
    //   values.token,
    //   md.name,
    //   md.unitName,
    //   cid
    // )

    setProgress({
      status: 75,
      note: "Minting your NFT...",
    })

    // const mint = await mintNFT(
    //   md,
    //   contractAddress,
    //   cid,
    //   library,
    //   account,
    //   values.token,
    //   "0"
    // )

    if (cid) {
      setProgress({
        status: 90,
        note: "Caching IPFS CID...",
      })

      // const save = await StoreToServer(values, imageURL, cid, account, auth)
      // console.log("save", save)

      try {
        const nft = await NFT.create(
          sw.wallet,
          md,
          cid,
          setProgress,
          metadataFormat
        )
        setLoading(false)
        window.analytics.track("NFT Minted", {
          ...nft.metadata,
          ...nft.token,
        })
        window.heap.track("NFT Minted", {
          ...nft.metadata,
          ...nft.token,
        })
        handleSetNFT(nft)
      } catch (err) {
        if (connected) {
          if (JSON.stringify(err).includes("PopupOpenError")) {
            handleShowInfoDialog({
              title: "Wallet Popup Blocked",
              desc: "Your browser has blocked popups. Please allow popups to create an NFT.",
            })
          } else {
            let description = `Failed to create nft: ${err}.`
            if (description.includes("t:")) {
              description = description.replace("t:", "")
            } else if (description.includes("TypeError:")) {
              description = description.replace("TypeError:", "")
            }
            handleShowInfoDialog({
              title: "Unexpected Error",
              desc: description,
            })
          }
        } else {
          handleShowInfoDialog({
            title: "Connect a wallet",
            desc: "Please connect a wallet",
          })
        }
        setProgress({
          status: 0,
          note: "",
        })
        window.analytics.track("NFT Mint Failed")
        setLoading(false)
      }
    } else {
      setLoading(false)
      setProgress({
        status: 0,
        note: "",
      })
    }
  }

  const isMintInputHasError = (mintId, type) => {
    const existingMintErrors = [...errors.mints]

    // find target input
    const targetIndex = existingMintErrors.findIndex(
      (mint) => mint.id === mintId
    )

    if (targetIndex !== -1) {
      if (type === "name" && existingMintErrors[targetIndex].name) {
        return "Mint name is required"
      } else if (type === "value" && existingMintErrors[targetIndex].value) {
        return "Mint value is required"
      }
    }

    return false
  }

  const isAddressInputHasError = (addressId, type) => {
    const existingAddressesErrors = [...errors.addresses]

    // find target input
    const targetIndex = existingAddressesErrors.findIndex(
      (address) => address.id === addressId
    )

    if (targetIndex !== -1) {
      if (type === "address" && existingAddressesErrors[targetIndex].address) {
        return "Royalty Wallet is required"
      } else if (
        type === "value" &&
        existingAddressesErrors[targetIndex].value
      ) {
        return "Royalty Value is required"
      }
    }

    return false
  }

  const setFile = (file) => {
    setFileObj(file)

    if (file) {
      if (metadataFormat === "arc3") {
        setMeta(
          (meta) =>
            new NFTMetadata({
              ...meta,
              image: file.name,
              image_mimetype: file.type,
              properties: { ...meta.properties, size: file.size },
            })
        )
      } else if (metadataFormat === "arc69") {
        setArc69Meta(
          (arc69Meta) =>
            new ARC69Metadata({
              ...arc69Meta,
              image: file.name,
              image_mimetype: file.type,
              properties: { ...arc69Meta.properties, size: file.size },
            })
        )
      }
    }
  }
  const handleShowInfoDialog = ({ title, desc }) => {
    setInfoDialog({ isOpen: true, data: { title, desc } })
  }

  const handleCloseInfoModal = () => {
    setInfoDialog(initInfoDialog)
  }

  const handleSetNFT = (nft) => {
    history.push(`/mint-nft/${nft.token.id}`)
  }

  const handleConnect = async () => {
    setSelectorOpen(true)
  }

  const handleSelectedWallet = async (provider) => {
    if (provider === "close") {
      setSelectorOpen(false)
    } else {
      await connect(provider)
      setSelectorOpen(false)
    }
  }

  const walletsEthereum = Providers.EthereumNetwork.map((item, index) => (
    <li key={index}>
      <Button
        id={index}
        className={classes["connect-btn-100"]}
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
        className={classes["connect-btn-100"]}
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

  useEffect(() => {
    setTheme(JSON.parse(localStorage.getItem("theme")))
  }, [localStorage.getItem("theme")])

  return (
    <>
      <Dialog
        isOpen={selectorOpen}
        title=""
        onClose={() => handleSelectedWallet("close")}
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
      {connected ? (
        <form
          className={classNames(classes.container, className)}
          onSubmit={handleValidateForm}
        >
          <div className={classes.left}>
            <h1
              className={classes.Title}
              style={
                rootTheme === "dark" ? { color: "white" } : { color: "black" }
              }
            >
              {" "}
              NFTnize Image, video, audio, 3D model, etc{" "}
            </h1>
            <span className={classes.subtitle}>
              Image, video, audio or 3D model.
            </span>
            <span className={classes.info}>
              File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
              GLB, GLTF. Max size: 40MB.
            </span>

            <div className={classes.left__inputs}>
              <TextField
                label="Name"
                required
                name="name"
                onChange={(e) => setName(e.target.value)}
                error={errors.name.status && errors.name.message}
                tooltipText="NFT name must be 32 characters or less."
                disabled={loading}
              />
              <TextField
                label="Unit name"
                required
                onChange={(e) => setUnitName(e.target.value)}
                name="unitName"
                error={errors.unitName.status && errors.unitName.message}
                tooltipText="Unit name must be 8 characters or less."
                disabled={loading}
              />
              <NumberField
                label="Quantity"
                type="number"
                name="decimal"
                min="1"
                max="10000"
                value={decimal}
                onChange={handleNumberChange}
                error={errors.decimal.status && errors.decimal.message}
                disabled={loading}
              />
              <TextField
                label="Assign Total Royalty (%)"
                name="royalty"
                error={errors.royalty.status && errors.royalty.message}
                warning={
                  !errors.royalty.status &&
                  errors.royalty.warning &&
                  errors.royalty.message
                }
                tooltipText="The percentage of sale price sent to the creator's address when the asset is sold. Applies to both first and second hand sales."
                placeholder="2.5"
                disabled={loading}
                min="1"
                max="80"
              />
              <div className={classes.mint}>
                <div className={classes.mint__header}>
                  <span> Royalty Wallets </span>
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    disabled={loading}
                  >
                    + Add
                  </button>
                </div>
                {addresses.length > 0 ? (
                  addresses.map((address, key) => (
                    <div className={classes.mint__row} key={key}>
                      <TextField
                        value={address.address}
                        placeholder="Wallet Address"
                        onChange={(e) => {
                          handleOnChangeAddressesInput({
                            event: e,
                            type: "address",
                            id: address.id,
                          })
                        }}
                        error={isAddressInputHasError(address.id, "address")}
                        disabled={loading}
                      />
                      <TextField
                        value={address.value}
                        placeholder="Royality Value (%)"
                        onChange={(e) =>
                          handleOnChangeAddressesInput({
                            event: e,
                            type: "value",
                            id: address.id,
                          })
                        }
                        error={isAddressInputHasError(address.id, "value")}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAddress(address.id)}
                        disabled={loading}
                      >
                        - Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <p className={classes["mint__no-mint-message"]}>
                    No wallet added, click on "Add" to add a wallet.
                  </p>
                )}
              </div>
            </div>
          </div>
          <div
            style={{ marginTop: "20px" }}
            className={!fileObj ? classes.right : classes.mint}
          >
            <ImagePicker
              name="image"
              setFile={setFile}
              error={errors.image.status}
              title={nameVal}
              unitName={unitName}
              quantity={decimal}
              disabled={loading}
            />
          </div>
          <div className={classes.bottom}>
            <Textarea
              label="Description"
              required
              className={classes.description}
              name="description"
              error={errors.description.status && errors.description.message}
              disabled={loading}
            />
            <SelectDropdown
              label="Select Category"
              placeholder="Select one option"
              value={category}
              onChange={(value) => setCategory(value)}
              error={errors.category.status && errors.category.message}
              items={categories}
            />
            <SelectDropdown
              label="Choose Token"
              placeholder="Select one option"
              value={token}
              error={errors.token.status && errors.token.message}
              onChange={(value) => setToken(value)}
              items={tokenTypes}
            />
            <SelectDropdown
              label="Choose Network"
              placeholder="Select one option"
              value={network}
              onChange={(value) => setNetwork(value)}
              items={networkTypes}
            />
            <div className={classes.mint}>
              <div className={classes.mint__header}>
                <span> Traits </span>
                <button
                  type="button"
                  onClick={handleAddMint}
                  disabled={loading}
                >
                  + Add
                </button>
              </div>
              {mints.length > 0 ? (
                mints.map((mint, key) => (
                  <div className={classes.mint__row} key={key}>
                    <TextField
                      value={mint.name}
                      placeholder="Trait Type"
                      onChange={(e) =>
                        handleOnChangeMintInput({
                          event: e,
                          type: "name",
                          id: mint.id,
                        })
                      }
                      error={isMintInputHasError(mint.id, "name")}
                      disabled={loading}
                    />
                    <TextField
                      value={mint.value}
                      placeholder="Trait Value"
                      onChange={(e) =>
                        handleOnChangeMintInput({
                          event: e,
                          type: "value",
                          id: mint.id,
                        })
                      }
                      error={isMintInputHasError(mint.id, "value")}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMint(mint.id)}
                      disabled={loading}
                    >
                      - Remove
                    </button>
                  </div>
                ))
              ) : (
                <p className={classes["mint__no-mint-message"]}>
                  No traits added, click on "Add" to add a trait.
                </p>
              )}
            </div>
            <div className={classes.actions}>
              <Button
                accent="pink"
                minimal
                icon={<PlusIcon />}
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "NFTnize"}
              </Button>
            </div>
            {loading && (
              <>
                <p className={classes.progress__note}>{progress.note}</p>
                <div className={classes["mint-progress-bar"]}>
                  <div
                    className={classes["mint-progress"]}
                    style={{ width: `${progress.status}%` }}
                  />
                </div>
              </>
            )}
          </div>
        </form>
      ) : (
        <>
          <h1
            className={classes.title}
            style={
              rootTheme === "dark" ? { color: "white" } : { color: "black" }
            }
          >
            {" "}
            NFTnize Image, video, audio, 3D model, etc{" "}
          </h1>
          <Button
            onClick={handleConnect}
            style={{ width: "unset" }}
            className={classes["connect-btn"]}
          >
            Connect Wallet
          </Button>
        </>
      )}
    </>
  )
}
