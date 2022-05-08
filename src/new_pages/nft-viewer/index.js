/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable no-shadow */
import { useState, useEffect } from "react"
import { Icon } from "@blueprintjs/core"
import { NFT, NFTMetadata, ARC69Metadata } from "utils/nft"
import { getAccountListHoldsAsset, getAssetInfo } from "utils/algorand"
import { useParams } from "react-router-dom"
import { validateArc3 } from "utils/validator"
import classes from "./index.module.scss"
import { LoadingIndicator } from "components"
import { Layout } from "new_components"
import { Hero } from "./page-components"

const NFTViewer = () => {
  const { index } = useParams()
  const [nft, setNFT] = useState(new NFT(new NFTMetadata()))
  const [arc69Nft, setArc69Nft] = useState(new NFT(new ARC69Metadata()))
  const [metadataFormat, setMetadataFormat] = useState("")
  const [loaded, setLoaded] = useState(false)
  const [errorMsg, setErrorMsg] = useState({
    status: false,
    message: "",
  })
  const [currentOwner, setCurrentOwner] = useState("")
  useEffect(() => {
    setLoaded(false)

    let subscribed = true
    NFT.fromAssetId(index)
      .then((nft) => {
        if (!subscribed) return
        if (nft.metadata.standard === "arc69") {
          setMetadataFormat("arc69")
          setArc69Nft(nft)
        } else {
          setMetadataFormat("arc3")
          setNFT(nft)
        }
        // setNFT(nft)
        setLoaded(true)
      })
      .catch((err) => {
        setErrorMsg({
          status: true,
          message: err.response?.body?.message,
        })
        setLoaded(true)
      })
    getOwnerOfAsset(index)

    return () => {
      subscribed = false
    }
  }, [index])

  const getOwnerOfAsset = async (assetId) => {
    Promise.all([
      getAccountListHoldsAsset(assetId),
      getAssetInfo(assetId),
    ]).then(([accounts, assetInfo]) => {
      const owner = accounts.balances.find(
        (account) => account.amount === assetInfo.asset.params.total
      )
      if (owner?.address) setCurrentOwner(owner.address)
    })
  }

  let metaData = <div />
  let arc3Tests = <div />
  // let arc69Tests = <div />

  if (loaded) {
    if (!errorMsg.status) {
      const arc69mdProps = arc69Nft.metadata
        ? Object.keys(arc69Nft.metadata).map((key, idx) => {
            let prop = arc69Nft.metadata[key]
            if (prop === undefined) {
              prop = ""
            }
            if (typeof prop === "object") {
              prop = JSON.stringify(prop)
            }
            return (
              <li key={idx}>
                <b> {key}: </b> <span>{prop.toString()}</span>
              </li>
            )
          })
        : [<li key="none"> No metadata </li>]
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
                <b> {key}: </b> <span>{prop.toString()}</span>
              </li>
            )
          })
        : [<li key="none"> No metadata </li>]
      const arc69Invalids = validateArc3(arc69Nft).map((test, index) => {
        if (test.pass)
          return (
            <li key={index}>
              <div>
                <Icon icon="tick" intent="success" /> <b> {test.name} </b>{" "}
              </div>{" "}
            </li>
          )

        return (
          <li key={index}>
            <div>
              <Icon icon="cross" intent="danger" /> <b> {test.name} </b>{" "}
            </div>{" "}
          </li>
        )
      })
      const arc3Invalids = validateArc3(nft).map((test, index) => {
        if (test.pass)
          return (
            <li key={index}>
              <div>
                <Icon icon="tick" intent="success" /> <b> {test.name} </b>{" "}
              </div>{" "}
            </li>
          )

        return (
          <li key={index}>
            <div>
              <Icon icon="cross" intent="danger" /> <b> {test.name} </b>{" "}
            </div>{" "}
          </li>
        )
      })

      metaData = (
        <div className={classes["list-container"]}>
          <h5 className={classes["list-title"]}> Metadata </h5>{" "}
          <ul className={classes.list}>
            {" "}
            {metadataFormat === "arc69" ? arc69mdProps : mdProps}{" "}
          </ul>{" "}
        </div>
      )

      arc3Tests = (
        <div className={classes["list-container"]}>
          <h5 className={classes["list-title"]}>
            {metadataFormat === "arc69" ? "ARC69 tests " : "ARC3 tests "}
          </h5>{" "}
          <ul className={classes.list}>
            {" "}
            {arc69Nft.token && metadataFormat === "arc69" && arc69Invalids}
            {nft.token && metadataFormat === "arc3" && arc3Invalids}{" "}
          </ul>{" "}
        </div>
      )

      return (
        <Layout>
          {arc69Nft.token && metadataFormat === "arc69" && (
            <Hero nft={arc69Nft} currentOwner={currentOwner} />
          )}
          {nft.token && metadataFormat === "arc3" && (
            <Hero nft={nft} currentOwner={currentOwner} />
          )}
          <div className={classes.container}>
            <div className={classes.meta}> {metaData} </div>{" "}
            <div className={classes.meta}> {arc3Tests} </div>{" "}
          </div>{" "}
        </Layout>
      )
    }
    return (
      <Layout>
        <div className={classes["no-assets"]}>
          <h1>Asset Not Found</h1>
        </div>
      </Layout>
    )
  }
  return <LoadingIndicator />
}

export default NFTViewer
