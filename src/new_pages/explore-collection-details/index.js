/* eslint-disable no-restricted-globals */
import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Layout, AssetsGrid, SideFilter } from "new_components"
import {
  asyncGetCollectionsAll,
  asyncGetSelectedCollectionTraits,
  setEmptySelectedCollectionTraits,
} from "redux/collection/collection-slice"
import { AssetsFilters, Hero } from "./page-components"
import classes from "./index.module.scss"
import {
  asyncLookupAccountByID,
  asyncGetStatsFromCollection,
  resetLookupAccountInfo,
  resetSelectedCollectionStats,
} from "redux/indexer/indexer-slice"
import { useParams } from "react-router-dom"
import { formatTraits, isCheckedExist } from "utils/helper"
import classNames from "classnames"

const ExploreCollectionDetails = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const allCollections = useSelector(
    (state) => state.collection.all_collections
  )
  const filterTraitValues = useSelector(
    (state) => state.collection.filterTraitValues
  )
  const { checked } = useSelector((state) => state.collection)
  const [sortedAssets, setSortedAssets] = useState([])
  const [sortValue, setSortValue] = useState(1)
  const [floorPrice, setFloorPrice] = useState()
  const [totalVolume, setTotalVolume] = useState()
  const sortTypes = [
    { title: "Date Listed: Newest", value: 1 },
    { title: "Price: Highest", value: 2 },
    { title: "Price: Lowest", value: 3 },
  ]

  const [selectedCollection, setSelectedCollection] = useState(null)
  const lookupAccountInfo = useSelector(
    (state) => state.indexer.lookupAccountInfo
  )
  const selectedCollectionTraitsData = useSelector(
    (state) => state.collection.selectedCollectionTraits
  )
  const sideFiltersData = formatTraits(selectedCollectionTraitsData)

  useEffect(() => {
    setSelectedCollection(
      allCollections.find((collection) => collection.name === id)
    )
  }, [allCollections])
  useEffect(() => {
    const address = selectedCollection?.creatorAddress
    if (address && selectedCollection.name) {
      dispatch(
        asyncLookupAccountByID({
          address,
          collectionName: selectedCollection.name,
        })
      )
    }
    if (selectedCollection?.slug) {
      dispatch(asyncGetStatsFromCollection({ name: selectedCollection?.slug }))
    }
    if (selectedCollection?.traits_url) {
      dispatch(
        asyncGetSelectedCollectionTraits({ url: selectedCollection.traits_url })
      )
    } else {
      dispatch(setEmptySelectedCollectionTraits())
    }
  }, [selectedCollection])

  useEffect(() => {
    if (allCollections.length === 0) {
      dispatch(asyncGetCollectionsAll())
    }
    return () => {
      dispatch(resetLookupAccountInfo())
      dispatch(resetSelectedCollectionStats())
    }
  }, [])

  useEffect(() => {
    if (lookupAccountInfo && lookupAccountInfo.length > 0) {
      const priceFilterAssets = lookupAccountInfo.filter(
        (li) => !isNaN(li.lastPrice) && Number(li.lastPrice) !== 0
      )
      let totalVolumeAmount = 0
      priceFilterAssets.forEach((asa) => {
        totalVolumeAmount += Number(asa.lastPrice)
      })
      setTotalVolume(Number(totalVolumeAmount) / 100000)
      const sortedPriceFilterAssets = Array.from(priceFilterAssets).sort(
        (a, b) => a.lastPrice - b.lastPrice
      )
      if (sortedPriceFilterAssets && sortedPriceFilterAssets.length > 0) {
        const floorAsset = sortedPriceFilterAssets[0]
        setFloorPrice(Number(floorAsset.lastPrice) / 100000)
      }
    }
    sortAssets()
  }, [lookupAccountInfo, sortValue, filterTraitValues])

  const sortAssets = () => {
    let sortableAccountInfo
    if (isCheckedExist(checked)) {
      if (filterTraitValues?.length > 0) {
        sortableAccountInfo = lookupAccountInfo.filter((li) =>
          filterTraitValues.includes(li.index.toString())
        )
      } else if (filterTraitValues.length === 0) {
        sortableAccountInfo = []
      }
    } else {
      sortableAccountInfo = lookupAccountInfo
    }

    if (sortValue === 1) {
      const temp = Array.from(sortableAccountInfo).sort(
        (a, b) => a.index - b.index
      )
      setSortedAssets(temp)
    } else if (sortValue === 2) {
      const temp = Array.from(sortableAccountInfo).sort((a, b) => {
        if (b.lastPrice.toLowerCase() === "no sale") return -1
        if (a.lastPrice.toLowerCase() === "no sale") return 1
        return b.lastPrice - a.lastPrice
      })
      setSortedAssets(temp)
    } else if (sortValue === 3) {
      const temp = Array.from(sortableAccountInfo).sort((a, b) => {
        if (b.lastPrice.toLowerCase() === "no sale") return 1
        if (a.lastPrice.toLowerCase() === "no sale") return -1
        return a.lastPrice - b.lastPrice
      })
      setSortedAssets(temp)
    } else {
      const temp = Array.from(sortableAccountInfo)
      setSortedAssets(temp)
    }
  }
  return (
    <Layout>
      {/* <CollectionInfo /> */}
      <Hero collection={selectedCollection} />
      <div
        className={classNames(
          classes.container,
          selectedCollection?.traits_url && classes["container--has-filter"]
        )}
      >
        {selectedCollection?.traits_url ? (
          <SideFilter className={classes.aside} data={sideFiltersData} />
        ) : (
          <></>
        )}
        <AssetsFilters
          selectedCollection={selectedCollection}
          length={sortedAssets?.length}
          handleSortChange={(val) => {
            setSortValue(Number(val))
          }}
          availableSortTypes={sortTypes}
          selectedValue={sortValue}
          floorPrice={floorPrice}
          totalVolume={totalVolume}
        />
        <AssetsGrid assets={sortedAssets} className={classes.grid} />
      </div>
    </Layout>
  )
}

export default ExploreCollectionDetails
