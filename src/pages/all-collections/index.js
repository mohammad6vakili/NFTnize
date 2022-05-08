import { Layout, BlockTitle } from "components"
import { List, ListLoading } from "./page-components"
import { useSelector, useDispatch } from "react-redux"
import {
  asyncGetCollectionsAll,
  CollectionLoadingId,
} from "redux/collection/collection-slice"
import { useEffect } from "react"

const AllCollections = () => {
  const dispatch = useDispatch()
  const allCollections = useSelector(
    (state) => state.collection.all_collections
  )
  const { loading: collectionLoading } = useSelector(
    (state) => state.collection
  )
  const newCollect = allCollections.length
    ? Array.from(allCollections).sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1
        return 0
      })
    : []

  useEffect(() => {
    dispatch(asyncGetCollectionsAll())
  }, [])
  return (
    <Layout
      breadcrumb={[
        {
          label: "Home",
          to: "/",
        },
        {
          label: "All Collections",
        },
      ]}
    >
      <BlockTitle title="All Collections">
        {collectionLoading.includes(CollectionLoadingId.GET_ALL_COLLECTIONS) ? (
          <ListLoading />
        ) : (
          <List collections={newCollect} />
        )}
      </BlockTitle>
    </Layout>
  )
}

export default AllCollections
