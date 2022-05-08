/* eslint-disable no-undef */
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Layout,
  Collections,
  RecentCollections,
  // eslint-disable-next-line import/named
  SearchResult,
  BlockTitle,
  ExpandableTable,
} from "components"
import { Search } from "./page-components"
import classes from "./index.module.scss"
import {
  asyncGetCollections,
  asyncGetCollectionsAll,
} from "redux/collection/collection-slice"

const Home = ({ handleThemeSwitch }) => {
  const [searchStatus, setSearchStatus] = useState(false)

  const dispatch = useDispatch()
  const collections = useSelector((state) => state.collection.collections)
  const assets = useSelector((state) => state.indexer.assets)
  const allCollections = useSelector(
    (state) => state.collection.all_collections
  )
  const { loading: collectionLoading } = useSelector(
    (state) => state.collection
  )

  useEffect(() => {
    if (!collections || !(collections.length > 0)) {
      dispatch(asyncGetCollectionsAll())
      dispatch(asyncGetCollections({ limit: 4 }))
    }
    // dispatch(asyncGetRecentTransactions({ limit: 10 }))
  }, [])

  return (
    <Layout className={classes.layout} handleThemeSwitch={handleThemeSwitch}>
      <Collections
        collections={collections?.slice(0, 8)}
        collectionLoading={collectionLoading}
      />
      <Search setSearchStatus={setSearchStatus} />
      {searchStatus && <SearchResult assets={assets.assets} />}
      <RecentCollections
        collections={allCollections?.slice(0, 10)}
        collectionLoading={collectionLoading}
      />
      <BlockTitle title="Recent Transaction History">
        {/* <RecentTable /> */}
        <ExpandableTable />
      </BlockTitle>
      {/* <TopCollections /> */}
    </Layout>
  )
}

export default Home
