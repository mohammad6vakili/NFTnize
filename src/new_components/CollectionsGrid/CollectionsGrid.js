import { Link } from "react-router-dom"
import { Collection, CollectionLoading } from "new_components"
import { CollectionLoadingId } from "redux/collection/collection-slice"
import { useSelector } from "react-redux"
import InfiniteScroll from "react-infinite-scroll-component"
import classes from "./CollectionsGrid.module.scss"
import { ReactComponent as ArrowRightIcon } from "new_assets/icons/arrow-right.svg"
import classNames from "classnames"
import { useEffect, useState, useRef } from "react"
import { LoadingIndicator } from "../../components"

export const CollectionsGrid = ({ collections = [], layout, header }) => {
  const mounted = useRef(false)

  const { loading: collectionLoading } = useSelector(
    (state) => state.collection
  )
  const [displayCollections, setDisplayCollections] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [noCollectionStatus, setNoCollectionStatus] = useState(false)
  useEffect(() => {
    setTimeout(() => setNoCollectionStatus(true), 2000)
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (collections.length < 48) {
      setDisplayCollections(collections.slice(0, 48))
      setHasMore(false)
    } else {
      if (collections.length > 0) {
        setDisplayCollections(collections.slice(0, 48))
      }
      setHasMore(true)
    }
  }, [collections])

  const fetchMoreCollections = () => {
    if (displayCollections.length >= collections.length) {
      setHasMore(false)
      return
    }

    setTimeout(() => {
      if (mounted.current) {
        setDisplayCollections(
          collections.slice(0, displayCollections.length + 12)
        )
      }
    }, 2000)
  }

  return (
    <section className={classes.container}>
      {header && (
        <div className={classes.header}>
          <h2>Collections</h2>
          <Link to="/markets">
            <ArrowRightIcon />
          </Link>
        </div>
      )}

      <InfiniteScroll
        dataLength={displayCollections.length}
        next={fetchMoreCollections}
        hasMore={hasMore}
        loader={<LoadingIndicator />}
      >
        <div
          className={classNames(
            classes.grid,
            layout && classes[`grid--${layout}`]
          )}
        >
          {collectionLoading.includes(CollectionLoadingId.GET_ALL_COLLECTIONS)
            ? header
              ? [...Array(5).keys()].map((key) => (
                  <CollectionLoading
                    key={key}
                    layout={layout}
                    large={key === 2}
                  />
                ))
              : [...Array(8).keys()].map((key) => (
                  <CollectionLoading key={key} layout={layout} />
                ))
            : collections.length === 0
            ? noCollectionStatus && (
                <div className={classes.noCollections}>No Collections</div>
              )
            : displayCollections.map((collection, index) => (
                <Collection key={`${index}-${collection.id}`} {...collection} />
              ))}
          {/* {isLoading
            ? [...Array(5).keys()].map((key) => (
                <CollectionLoading key={key} large={key === 2} />
              ))
            : displayCollections.map((collection, index) => (
                <Collection key={index} {...collection} />
              ))} */}
        </div>
      </InfiniteScroll>
    </section>
  )
}
