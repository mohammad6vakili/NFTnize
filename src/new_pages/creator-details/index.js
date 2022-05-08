import { Layout, AssetsGrid } from "new_components"
import { CreatorInfo } from "./page-components"
import classes from "./index.module.scss"
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { asyncGetCollectionsAll } from "redux/collection/collection-slice"
import {
  asyncLookupAccountByID,
  fetchingMyAssets,
  resetLookupAccountInfo,
} from "redux/indexer/indexer-slice"
import { useParams, useHistory } from "react-router-dom"
import { getAccountInfo } from "utils/algorand"
import { NFT } from "utils/nft"
import { ApplicationCard } from "../explore-buy/page-components/ApplicationCard/ApplicationCard"
import { AuctionService } from "services/AuctionService"
import { BuyNowService } from "services/BuyNowService"
import { creatorFilterTypes as filterTypes } from "utils/constants"

const CreatorDetails = () => {
  const dispatch = useDispatch()
  const { address } = useParams()
  const history = useHistory()
  const { accts, connected } = useSelector((state) => state.wallet)
  const [ownerAddress, setOwnerAddress] = useState(false)
  const [filterType, setFilterType] = useState(filterTypes.created)
  // const applications = useSelector((state) => state.application.applications)

  const { selectedAccount } = useSelector((state) => state.wallet)
  const allCollections = useSelector(
    (state) => state.collection.all_collections
  )

  const selectedCollection = allCollections.find((collection) =>
    collection.creatorAddress.includes(address)
  )

  const lookupAccountInfo = useSelector(
    (state) => state.indexer.lookupAccountInfo
  )
  const [myCreatedAssets, setMyCreatedAssets] = useState([])
  const [myOwnedAssets, setMyOwnedAssets] = useState([])
  const [myOptInsAssets, setMyOptInsAssets] = useState([])
  const [myBidsApps, setMyBidsApps] = useState([])
  const [myListingsApps, setMyListingsApps] = useState([])

  useEffect(() => {
    const lowerKebabCaseType = filterType.split(" ").join("-").toLowerCase()
    history.push({
      pathname: history.location.pathname,
      search: `type=${lowerKebabCaseType}`,
    })
  }, [filterType])
  useEffect(() => {}, [selectedAccount])
  useEffect(() => {
    if (address) {
      if (accts.includes(address)) {
        if (selectedAccount !== address) {
          const lowerKebabCaseType = filterType
            .split(" ")
            .join("-")
            .toLowerCase()
          history.push(`${selectedAccount}?type=${lowerKebabCaseType}`)
        } else {
          initMyAssets()
          setOwnerAddress(true)
        }
      } else {
        dispatch(
          asyncLookupAccountByID({
            address,
            collectionName: undefined,
          })
        )
      }
    }
  }, [address, selectedAccount, selectedCollection, accts, connected])
  useEffect(() => {
    if (allCollections.length === 0) {
      dispatch(asyncGetCollectionsAll())
    }

    return () => dispatch(resetLookupAccountInfo())
  }, [])

  useEffect(() => {
    if (!connected) setOwnerAddress(false)
  }, [connected])

  // const isBidder = (bids) => {
  //   let isBid = false
  //   if (bids && bids.length > 0) {
  //     bids.forEach((element) => {
  //       if (element.sender === selectedAccount) isBid = true
  //     })
  //   }
  //   return isBid
  // }

  const initMyAssets = async () => {
    dispatch(fetchingMyAssets(true))
    const { "created-assets": createdAssets, assets } = await getAccountInfo(
      address
    )
    // my bids
    const bidAuctions = await AuctionService.getAuctions({ bidder: address })
    const createdAuctions = await AuctionService.getAuctions({
      creator: address,
    })
    const createdBuyNows = await BuyNowService.getBuyNows({ creator: address })

    const bidAuctionsData = bidAuctions?.data.map((app) => app)
    const createdAuctionsData = createdAuctions?.data.map((app) => app)
    const createdBuyNowsData = createdBuyNows?.data.map((app) => app)

    setMyBidsApps(bidAuctionsData)
    setMyListingsApps([...createdAuctionsData, ...createdBuyNowsData])

    const getOwnedAssetsPromises = []
    const getOptInsAssetsPromises = []

    assets.forEach((asset) => {
      if (asset.amount > 0 && asset.amount < 10000) {
        getOwnedAssetsPromises.push(NFT.fromAssetId(asset["asset-id"]))
      } else {
        getOptInsAssetsPromises.push(NFT.fromAssetId(asset["asset-id"]))
      }
    })
    Promise.all([...getOwnedAssetsPromises, ...getOptInsAssetsPromises])
      .then((list) => {
        const ownedAssets = list.slice(0, getOwnedAssetsPromises.length)
        const optInsAssets = list.slice(
          getOwnedAssetsPromises.length,
          list.length
        )
        setMyOwnedAssets(
          ownedAssets
            .filter((e) => !!e)
            .map(({ token }) => ({ index: token.id, ...token }))
        )
        setMyOptInsAssets(
          optInsAssets
            .filter((e) => !!e)
            .map(({ token }) => ({ index: token.id, ...token }))
        )
        setMyCreatedAssets(
          createdAssets.map(({ index, params }) => ({
            index,
            creator: params.creator,
            name: params.name,
            total: params.total,
            unitName: params["unit-name"],
            url: params.url,
          }))
        )
        // setMyBidsAssets(filtered)
        dispatch(fetchingMyAssets(false))
      })
      .catch((error) => console.log(error))
  }
  return (
    <Layout>
      {/* <CollectionInfo /> */}
      <CreatorInfo
        collection={selectedCollection}
        ownerAddress={address}
        isOwnerAddress={ownerAddress}
        onFilterTypeChange={(type) => setFilterType(type)}
        filterType={filterType}
        filterTypes={filterTypes}
      />
      <div className={classes.container}>
        <AssetsGrid
          assets={
            ownerAddress
              ? filterType === filterTypes.created
                ? myCreatedAssets
                : filterType === filterTypes.owned
                ? myOwnedAssets
                : filterType === filterTypes.optIns
                ? myOptInsAssets
                : []
              : lookupAccountInfo
          }
          filterType={filterType}
          ownerAddress={ownerAddress}
        />
        {ownerAddress &&
          (filterType === filterTypes.myBids ||
            filterType === filterTypes.myListings) && (
            <div className={classes.grid}>
              {filterType === filterTypes.myBids &&
                myBidsApps.map((app) => (
                  <ApplicationCard key={app.appId} {...app} />
                ))}
              {filterType === filterTypes.myBids &&
                myBidsApps &&
                myBidsApps.length === 0 && (
                  <div className={classes["no-applications"]}>
                    <h1>No Applications</h1>
                  </div>
                )}
              {filterType === filterTypes.myListings &&
                myListingsApps.map((app) => (
                  <ApplicationCard key={app.appId} {...app} />
                ))}
              {filterType === filterTypes.myListings &&
                myListingsApps &&
                myListingsApps.length === 0 && (
                  <div className={classes["no-applications"]}>
                    <h1>No Applications</h1>
                  </div>
                )}
            </div>
          )}
      </div>
    </Layout>
  )
}

export default CreatorDetails
