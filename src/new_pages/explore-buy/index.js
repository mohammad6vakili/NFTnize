import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroll-component"

import { Layout } from "new_components"
import { LoadingIndicator } from "components"
import { Search } from "utils/search"
import { buyTypes, FilterTypes, SortOptions } from "utils/constants"
import {
  ApplicationCard,
  Hero,
  ApplicationsFilters,
} from "./page-components/index"
import classes from "./index.module.scss"

const indexes = [
  "appId",
  ["nft", "metadata", "name"],
  ["nft", "metadata", "description"],
]

const searchIndex = new Search({ id: "appId", indexes })

const NewExploreBuy = () => {
  const { search } = useLocation()
  const history = useHistory()
  const applications = useSelector((state) => state.application.applications)

  const [query, setQuery] = useState("")
  const [filteredApps, setFilteredApps] = useState([])
  const [activeBuyType, setActiveBuyType] = useState("")
  const [sortValue, setSortValue] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [displayedApps, setDisplayedApps] = useState([])
  const sortTypes = useMemo(() => {
    const isNoEnding =
      activeBuyType === buyTypes.SOLD || activeBuyType === buyTypes.BUY_NOW
    return SortOptions.filter((e) => (isNoEnding ? e.value !== 4 : e))
  }, [activeBuyType])

  useEffect(() => {
    if (activeBuyType === "") {
      handleBuyType("LIVE_AUCTION")
    }
  }, [])

  useEffect(() => {
    const sortedApps = sortApplications(filteredApps)
    setFilteredApps(sortedApps)
  }, [sortValue])

  useEffect(() => {
    searchIndex.addData(applications)
    filterBuyItems()
  }, [applications])

  useEffect(() => {
    filterBuyItems()
  }, [activeBuyType, query])

  useEffect(() => {
    const params = new URLSearchParams(search)
    const activeType = params.get("type")
    const searchKey = params.get("key")
    setActiveBuyType(activeType ? FilterTypes[activeType] : "")
    setQuery(searchKey ?? "")
  }, [search])

  useEffect(() => {
    if (filteredApps && filteredApps.length >= 0) {
      setDisplayedApps(filteredApps.slice(0, 20))
    }
  }, [filteredApps])

  useEffect(() => {
    if (displayedApps.length >= filteredApps.length) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
  }, [displayedApps])

  useEffect(() => {
    const selectedSortType = sortTypes.find((a) => a.value === sortValue)
    if (!selectedSortType) {
      setSortValue(sortTypes[0].value)
    }
  }, [sortTypes])

  const sortApplications = (apps) => {
    const priceNameProp =
      activeBuyType === buyTypes.BUY_NOW || activeBuyType === buyTypes.SOLD
        ? "salesPrice"
        : "currentPrice"

    if (sortValue === 1) {
      return apps.slice().sort((a, b) => b.accountIndex - a.accountIndex)
    } else if (sortValue === 2) {
      return apps
        .slice()
        .sort((a, b) => Number(b[priceNameProp]) - Number(a[priceNameProp]))
    } else if (sortValue === 3) {
      return apps
        .slice()
        .sort((a, b) => Number(a[priceNameProp]) - Number(b[priceNameProp]))
    } else if (sortValue === 4) {
      return apps
        .slice()
        .sort(
          (a, b) =>
            new Date(a.endTime).getTime() - new Date(b.endTime).getTime()
        )
    }
  }

  const handleFilterBuyItems = (items) => {
    // filter items based on buy types
    if (activeBuyType === buyTypes.CLOSED_AUCTION) {
      // closed auction
      return items.filter(
        (auction) =>
          new Date(auction.endTime).getTime() <= new Date().getTime() ||
          auction.buyType === buyTypes.CLOSED_AUCTION
      )
    } else if (activeBuyType === buyTypes.LIVE_AUCTION) {
      // live auction
      return items.filter(
        (auction) =>
          new Date(auction.endTime).getTime() > new Date().getTime() &&
          auction.buyType !== buyTypes.CLOSED_AUCTION
      )
    } else if (activeBuyType === buyTypes.BUY_NOW) {
      // buy now
      return items.filter(({ buyType }) => buyType === buyTypes.BUY_NOW)
    } else if (activeBuyType === buyTypes.SOLD) {
      // sold
      return items.filter(({ buyType }) => buyType === buyTypes.SOLD)
    } else {
      // default, no filter: if no buy type selected!
      return items
    }
  }

  const filterBuyItems = () => {
    // get items based on query
    const filteredBySearchKey =
      query && query !== "" ? searchIndex.search(query) : applications
    // filter items based on buy type
    const filtered = handleFilterBuyItems(filteredBySearchKey)
    // sort items
    const sortedApps = sortApplications(filtered)
    setFilteredApps(sortedApps)
  }

  const handleSearchBuyItems = (e) => {
    handleQueryParam(activeBuyType, e)
  }

  const handleBuyType = (e) => {
    handleQueryParam(e, query)
  }

  const handleQueryParam = (type, key) => {
    let searchQuery = ""
    if (key && key !== "") {
      searchQuery = `key=${key}`
    }
    if (type !== "") {
      searchQuery =
        searchQuery !== ""
          ? `?${searchQuery}&type=${FilterTypes[type]}`
          : `?type=${FilterTypes[type]}`
    }
    history.push({ pathname: "/buy", search: searchQuery })
  }

  const fetchMoreCollections = () => {
    setTimeout(() => {
      setDisplayedApps(filteredApps.slice(0, displayedApps.length + 12))
    }, 2000)
  }

  return (
    <Layout>
      <Hero
        search={query}
        activeBuyType={activeBuyType}
        onSearch={handleSearchBuyItems}
        onBuyTypeChange={handleBuyType}
      />
      <div className={classes.container}>
        <ApplicationsFilters
          length={filteredApps?.length}
          handleSortChange={(val) => setSortValue(Number(val))}
          availableSortTypes={sortTypes}
          selectedValue={sortValue}
        />
        <InfiniteScroll
          dataLength={displayedApps.length}
          next={fetchMoreCollections}
          hasMore={hasMore}
          loader={<LoadingIndicator />}
        >
          <div className={classes.grid}>
            {displayedApps &&
              displayedApps.map((app) => (
                <ApplicationCard key={app.appId} {...app} />
              ))}
          </div>
        </InfiniteScroll>
        {applications && applications.length === 0 && (
          <div className={classes["no-auctions"]}>
            <h1>No Auctions</h1>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default NewExploreBuy
