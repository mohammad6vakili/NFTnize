/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-shadow */
import { useState, useRef } from "react"
import {
  Button,
  Collapse,
  NumericInput,
  FormGroup,
  Dialog,
  Classes,
} from "@blueprintjs/core"
import { imageIntegrity, NFT, NFTMetadata } from "utils/nft"
import { putToIPFS } from "utils/ipfs"
import { useHistory } from "react-router-dom"
import classes from "./Minter.module.scss"
import { ReactComponent as ClearIcon } from "assets/icons/close.svg"
import { ReactComponent as PencilIcon } from "assets/icons/pencil-alt.svg"
import classNames from "classnames"

export const Minter = (props) => {
  const history = useHistory()

  const [meta, setMeta] = useState(new NFTMetadata())
  const [loading, setLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState()
  const [fileObj, setFileObj] = useState()
  const [decimals, setDecimals] = useState(0)

  const [extraProps, setExtraProps] = useState([])
  const [extraPropsVisible, setExtraPropsVisible] = useState(false)
  const initInfoDialog = {
    isOpen: false,
    data: { title: "", desc: "" },
  }

  const [infoDialog, setInfoDialog] = useState(initInfoDialog)
  // For MintDialog
  // const [isMinting, setIsMinting] = useState(false)

  const [errors, setErrors] = useState({
    image: false,
    name: false,
    unitName: false,
    decimal: false,
    description: false,
  })
  const [progressStatus, setProgressStatus] = useState()

  function setFile(file) {
    setFileObj(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      setImgSrc(e.target.result)
    }
    reader.readAsDataURL(file)

    setMeta(
      (meta) =>
        new NFTMetadata({
          ...meta,
          image: file.name,
          image_mimetype: file.type,
          properties: { ...meta.properties, size: file.size },
        })
    )
  }

  function clearFile() {
    setFileObj(null)
    setImgSrc("")
    setMeta(new NFTMetadata())
  }
  const handleShowInfoDialog = ({ title, desc }) => {
    setInfoDialog({ isOpen: true, data: { title, desc } })
  }

  const handleCloseInfoModal = () => {
    setInfoDialog(initInfoDialog)
  }

  const validateForm = () => {
    const errorsObj = {
      image: !fileObj,
      name: !!(!meta.name.trim() && meta.name.trim().length < 3),
      unitName: !!(!meta.unitName.trim() && meta.unitName.trim().length < 3),
      description: !!(
        !meta.description.trim() && meta.description.trim().length < 3
      ),
      // eslint-disable-next-line no-restricted-globals
      decimal: isNaN(decimals),
      // decimal: !!(!decimals && decimals === 0),
    }

    setErrors(errorsObj)

    if (Object.values(errorsObj).every((field) => !field)) {
      // all fields are valid
      mintNFT()
    }
  }

  async function mintNFT() {
    setLoading(true)
    setProgressStatus(10)
    const md = captureMetadata()

    md.image_integrity = await imageIntegrity(fileObj)
    setProgressStatus(30)
    setMeta(md)

    const cid = await putToIPFS(fileObj, md, setProgressStatus)
    if (cid) {
      setProgressStatus(50)
      try {
        const nft = await NFT.create(
          props.sw.wallet,
          md,
          cid,
          setProgressStatus
        )
        setLoading(false)
        handleSetNFT(nft)
      } catch (err) {
        if (props.connected) {
          let description = `Failed to create nft: ${err}.`
          if (description.includes("t:")) {
            description = description.replace(" t:", "")
          } else if (description.includes("TypeError:")) {
            description = description.replace("TypeError:", "")
          }
          handleShowInfoDialog({
            title: "Unexpected Error",
            desc: description,
          })
        } else {
          handleShowInfoDialog({
            title: "Connect a wallet",
            desc: "Please connect a wallet",
          })
        }
        setProgressStatus(0)
        setLoading(false)
      }
    }
  }

  function handleSetNFT(nft) {
    return history.push(`/nft/${nft.token.id}`)
  }

  function handleChangeDecimals(v) {
    setDecimals(v)
  }

  function handleChangeMeta(event) {
    const target = event.target

    const name = target.name
    const value = target.type === "checkbox" ? target.checked : target.value

    setMeta((meta) => new NFTMetadata({ ...meta, [name]: value }))
  }

  function handleShowExtraProps() {
    setExtraPropsVisible(!extraPropsVisible)
  }

  function handleExtraPropUpdate(e) {
    // eslint-disable-next-line radix
    const idx = parseInt(e.target.dataset.id)
    if (e.target.id === "name") extraProps[idx][e.target.id] = e.target.value
    else extraProps[idx][e.target.id] = e.target.value
    setExtraProps([...extraProps])
  }

  function handleExtraPropRemove(idx) {
    extraProps.splice(idx, 1)
    setExtraProps([...extraProps])
  }

  function handleAddExtraProp() {
    setExtraProps([...extraProps, emptyExtraProp()])
  }

  function emptyExtraProp() {
    return { name: "", value: "" }
  }

  function captureMetadata() {
    const eprops = extraProps.reduce(
      (all, ep) => ({ ...all, [ep.name]: ep.value }),
      {}
    )
    return new NFTMetadata({
      name: meta.name,
      unitName: meta.unitName,
      description: meta.description,
      image_mimetype: meta.image_mimetype,
      decimals,
      properties: { ...eprops, ...meta.properties },
    })
  }

  return (
    <>
      <section className={classes.container}>
        <Dialog
          isOpen={infoDialog.isOpen}
          title={infoDialog.data.title}
          className={classes.dialog}
          onClose={handleCloseInfoModal}
        >
          <div className={Classes.DIALOG_BODY}>
            <p>{infoDialog.data.desc}</p>
          </div>
          <div className={Classes.DIALOG_FOOTER}>
            <div className={Classes.DIALOG_FOOTER_ACTIONS}>
              <Button onClick={handleCloseInfoModal}>I understand</Button>
            </div>
          </div>
        </Dialog>
        <Uploader
          imgSrc={imgSrc}
          clearFile={clearFile}
          setFile={setFile}
          error={errors.image}
          {...meta}
        />

        <FormGroup
          helperText={
            errors.name ? "Name is required" : "The Name for this asset"
          }
          label="Name"
          labelFor="name"
          labelInfo="(required)"
          intent={errors.name ? "danger" : ""}
        >
          <input
            name="name"
            placeholder="Name"
            className="details-basic details-title bp3-input bp3-large"
            onChange={handleChangeMeta}
            type="text"
            id="name"
            value={meta.name}
          />
        </FormGroup>
        <FormGroup
          helperText={
            errors.unitName
              ? "Unit name is required"
              : "The Unit Name for this asset"
          }
          label="Unit Name"
          labelFor="unitName"
          labelInfo="(required)"
          intent={errors.unitName ? "danger" : ""}
        >
          <input
            name="unitName"
            placeholder="Unit Name"
            className="details-basic details-title bp3-input bp3-large"
            onChange={handleChangeMeta}
            type="text"
            id="unitName"
            value={meta.unitName}
          />
        </FormGroup>

        <FormGroup
          helperText={
            errors.description
              ? "Description is required"
              : "A description of this asset"
          }
          label="Description"
          labelFor="description"
          labelInfo="(required)"
          intent={errors.description ? "danger" : ""}
        >
          <textarea
            rows={10}
            cols={30}
            placeholder="Description"
            className="details-description bp3-input bp3-large"
            onChange={handleChangeMeta}
            name="description"
            id="description"
            value={meta.description}
          />
        </FormGroup>

        <FormGroup
          helperText={
            errors.decimal
              ? "Decimal is required"
              : "The number of decimals for this asset, increases number of units"
          }
          label="Decimals"
          labelFor="decimals"
          labelInfo="(A value > 0 is considered a 'Fractional NFT')"
          intent={errors.decimal ? "danger" : ""}
        >
          <NumericInput
            defaultValue={decimals}
            min={0}
            max={19}
            name="decimals"
            id="decimals"
            fill
            onValueChange={handleChangeDecimals}
          />
        </FormGroup>

        <div className="container extra-prop-dropdown">
          <Button
            onClick={handleShowExtraProps}
            minimal
            outlined
            intent="warning"
            text={extraPropsVisible ? "Hide extra props" : "Show extra props"}
            className={classes["extra-props-action"]}
          />

          <Collapse isOpen={extraPropsVisible}>
            <Button
              icon="plus"
              intent="success"
              onClick={handleAddExtraProp}
              className={classes["extra-prop-add"]}
            />
            <ul className={classes["extra-prop-list"]}>
              {extraProps.map((props, idx) => (
                <li className="extra-prop-item" key={idx}>
                  <div className="extra-prop-container">
                    <span>{idx + 1}</span>
                    <input
                      id="name"
                      data-id={idx}
                      name="name"
                      placeholder="Trait name"
                      value={props.name}
                      onChange={handleExtraPropUpdate}
                      className="details-basic details-artist bp3-input bp3-large"
                    />
                    <input
                      id="value"
                      name="value"
                      data-id={idx}
                      placeholder="Value"
                      value={props.value}
                      onChange={handleExtraPropUpdate}
                      className="details-basic details-artist bp3-input bp3-large"
                    />
                    <Button
                      intent="danger"
                      icon="minus"
                      onClick={() => {
                        handleExtraPropRemove(idx)
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Collapse>
        </div>
        {loading && (
          <div className={classes["mint-progress-bar"]}>
            <div
              className={classes["mint-progress"]}
              style={{ width: `${progressStatus}%` }}
            />
          </div>
        )}
        <div className={classes["mint-action-container"]}>
          <Button
            loading={loading}
            onClick={validateForm}
            rightIcon="clean"
            large
            intent="success"
            text="Mint"
            className={classes["mint-action"]}
          />
        </div>
      </section>
    </>
  )
}

function Uploader(props) {
  const uploaderInputRef = useRef(null)

  function captureFile(event) {
    event.stopPropagation()
    event.preventDefault()
    props.setFile(event.target.files.item(0))
  }

  function handleClearFile() {
    props.clearFile()
  }

  function handleOpenFilePicker() {
    uploaderInputRef.current.click()
  }

  return (
    <div className={classes.uploader}>
      <label
        className={classNames(
          classes["uploader-label"],
          props.imgSrc && classes["uploader-label--hidden"],
          props.error && classes["uploader-label--error"]
        )}
        htmlFor="uploader-input"
      >
        <input
          type="file"
          onChange={captureFile}
          id="uploader-input"
          ref={uploaderInputRef}
        />
      </label>

      <div
        className={classNames(
          classes["uploader-image"],
          !props.imgSrc && classes["uploader-image--hidden"]
        )}
      >
        <img id="gateway-link" alt="NFT" src={props.imgSrc} />
        <div className={classes["uploader-actions"]}>
          <button
            className={classes["uploader-action"]}
            type="button"
            onClick={handleClearFile}
          >
            <ClearIcon />
          </button>
          <button
            className={classes["uploader-action"]}
            type="button"
            onClick={handleOpenFilePicker}
          >
            <PencilIcon />
          </button>
        </div>
      </div>

      <div className={classes["uploader-info"]}>
        <h1>Create new NFT</h1>
        <p>Image, video, audio or 3D model</p>
        <p>
          File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG,
          GLB, GLTF. Max size: 40 MB
        </p>
      </div>
    </div>
  )
}
