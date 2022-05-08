/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-shadow */
import { useState, useEffect } from "react"
import { Icon } from "@blueprintjs/core"
import { NFT, NFTMetadata } from "utils/nft"
import { useParams } from "react-router-dom"
import { getAddrUrl, getAsaUrl } from "utils/config"
import { validateArc3 } from "utils/validator"
import classes from "./NFTViewer.module.scss"
import { LoadingIndicator } from "components"

export function NFTViewer() {
  const { assetId } = useParams()

  const [nft, setNFT] = useState(new NFT(new NFTMetadata()))
  const [loaded, setLoaded] = useState(false)
  const [imgLoadFailed, setLoadFailed] = useState(false)
  useEffect(() => {
    setLoaded(false)

    let subscribed = true
    NFT.fromAssetId(assetId).then((nft) => {
      if (!subscribed) return

      setNFT(nft)
      setLoaded(true)
    })

    return () => {
      subscribed = false
    }
  }, [assetId])

  let tokenDetails = <div />
  let metaData = <div />
  let arc3Tests = <div />

  if (loaded) {
    const mdProps = nft.metadata
      ? Object.keys(nft.metadata).map((key, idx) => {
          let prop = nft.metadata[key]
          if (prop === undefined) {
            prop = ""
          }
          if (typeof prop === "object") {
            prop = JSON.stringify(prop)
          }
          return (
            <li key={idx}>
              <b>{key}: </b>
              {prop.toString()}
            </li>
          )
        })
      : [<li key="none">No metadata</li>]

    const arc3Invalids = validateArc3(nft).map((test, idx) => {
      if (test.pass)
        return (
          <li key={idx}>
            <div>
              <Icon icon="tick" intent="success" /> <b>{test.name}</b>
            </div>
          </li>
        )

      return (
        <li key={idx}>
          <div>
            <Icon icon="cross" intent="danger" /> <b>{test.name}</b>
          </div>
        </li>
      )
    })

    tokenDetails = (
      <div className={classes["list-container"]}>
        <h5 className={classes["list-title"]}>Token Details</h5>

        <ul className={classes.list}>
          <li>
            <b>ASA id: </b>
            <a href={getAsaUrl(nft.token.id)}>{nft.token.id}</a>
          </li>
          <li>
            <b>name: </b>
            {nft.token.name}
          </li>
          <li>
            <b>unit name: </b>
            {nft.token.unitName}
          </li>
          <li>
            <b>total: </b>
            {nft.token.total}
          </li>
          <li>
            <b>url:</b> <a href={nft.token.url}>{nft.token.url}</a>
          </li>
          <li>
            <b>creator: </b>
            <a href={getAddrUrl(nft.token.creator)}>{nft.token.creator}</a>
          </li>
          <li>
            <b>freeze: </b>
            <a href={getAddrUrl(nft.token.creator)}>{nft.token.freeze}</a>
          </li>
          <li>
            <b>manager: </b>
            <a href={getAddrUrl(nft.token.creator)}>{nft.token.manager}</a>
          </li>
        </ul>
      </div>
    )

    metaData = (
      <div className={classes["list-container"]}>
        <h5 className={classes["list-title"]}>Metadata</h5>
        <ul className={classes.list}>{mdProps}</ul>
      </div>
    )

    arc3Tests = (
      <div className={classes["list-container"]}>
        <h5 className={classes["list-title"]}>ARC3 tests</h5>
        <ul className={classes.list}>{arc3Invalids}</ul>
      </div>
    )

    return (
      <div className={classes.container}>
        <div className={classes.hero}>
          <div className={classes["qr-code"]}>
            <a
              href={nft.imgURL()}
              alt={nft.imgURL()}
              target="_blank"
              rel="noreferrer"
            >
              {loaded && !imgLoadFailed ? (
                <img
                  src={nft.imgURL()}
                  alt={nft}
                  loading="lazy"
                  onError={() => setLoadFailed(true)}
                />
              ) : (
                <video preload="none" autoPlay muted>
                  <source src={nft.imgURL()} />
                </video>
              )}
              {/* {loaded && <img alt="nft" src={nft.imgURL()} />} */}
            </a>
          </div>

          {tokenDetails}
        </div>
        <div className={classes.meta}>
          {metaData}
          <hr />
          {arc3Tests}
        </div>
      </div>
    )
  }
  return <LoadingIndicator />
}
