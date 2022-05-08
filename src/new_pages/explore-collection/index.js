import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"
import { Layout, CollectionsGrid } from "new_components"
import { asyncGetCollectionsAll } from "redux/collection/collection-slice"
import { Hero } from "./page-components"
import classes from "./index.module.scss"
import { Search } from "utils/search"

const indexes = ["id", "name", "creator", "creatorAddress"]
const searchIndex = new Search({ indexes })

const ExploreCollection = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [searchStatus, setSearchStatus] = useState(false)
  const allCollections = useSelector(
    (state) => state.collection.all_collections
  )
  const [sortedCollections, setSortedCollections] = useState([])
  const [filteredCollections, setFilteredCollections] = useState([])

  useEffect(() => {
    dispatch(asyncGetCollectionsAll())
  }, [])

  useEffect(() => {
    const temp = allCollections.length
      ? Array.from(allCollections).sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
          return 0
        })
      : []
    setSortedCollections(temp)
  }, [allCollections])

  useEffect(() => {
    searchIndex.addData(sortedCollections)
    const query = new URLSearchParams(location.search).get("q")
    if (query) {
      const temp = searchIndex.search(query)
      setFilteredCollections(temp)
      setSearchStatus(true)
    } else {
      setFilteredCollections(sortedCollections)
      setSearchStatus(false)
    }
  }, [sortedCollections, location.search])

  return (
    <Layout>
      <Hero />
      <div className={classes.container}>
        {!searchStatus ? (
          <CollectionsGrid collections={sortedCollections} />
        ) : (
          <CollectionsGrid collections={filteredCollections} />
        )}
        {/* {collectionLoading.includes(CollectionLoadingId.GET_ALL_COLLECTIONS) ? (
          <ListLoading />
        ) : !searchStatus ? (
          <CollectionsGrid collections={sortedCollections} />
        ) : (
          <CollectionsGrid collections={collections} />
        )} */}
      </div>
    </Layout>
  )
}

export default ExploreCollection
