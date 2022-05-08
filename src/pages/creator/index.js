import { Layout, BlockTitle } from "components"
import { List, ListLoading } from "./page-components"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import {
  asyncGetCollectionsAll,
  CollectionLoadingId,
} from "redux/collection/collection-slice"

const CreatorPage = () => {
  const [allCreators, setAllCreators] = useState([])
  const dispatch = useDispatch()
  const allCollections = useSelector(
    (state) => state.collection.all_collections
  )
  const { loading: collectionLoading } = useSelector(
    (state) => state.collection
  )

  useEffect(() => {
    dispatch(asyncGetCollectionsAll())
  }, [])
  useEffect(() => {
    const addressSet = new Set()
    allCollections.forEach((li) => {
      addressSet.add(li.creatorAddress)
    })
    const addressArr = Array.from(addressSet)
    setAllCreators(addressArr)
  }, [allCollections])

  return (
    <Layout
      breadcrumb={[
        {
          label: "Home",
          to: "/v1/home",
        },
        {
          label: "Creators",
        },
      ]}
    >
      <BlockTitle title="All Creators">
        {collectionLoading.includes(CollectionLoadingId.GET_ALL_COLLECTIONS) ? (
          <ListLoading />
        ) : (
          <List creators={allCreators} />
        )}
      </BlockTitle>
    </Layout>
  )
}

export default CreatorPage
