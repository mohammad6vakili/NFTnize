import { Collection, BlockTitle, CollectionLoading } from "components"
import classes from "./RecentCollections.module.scss"
import { CollectionLoadingId } from "redux/collection/collection-slice"

export const RecentCollections = ({
  collections,
  className,
  collectionLoading,
}) => (
  <BlockTitle className={className} title="Recent Collections">
    <div className={classes.grid}>
      {collectionLoading.includes(CollectionLoadingId.GET_ALL_COLLECTIONS) ? (
        [...Array(10).keys()].map((key) => (
          <CollectionLoading type="compact-owner" key={key} />
        ))
      ) : (
        <>
          {collections?.map((collection, key) => (
            <Collection {...collection} type="compact-owner" key={key} />
          ))}
        </>
      )}
    </div>
  </BlockTitle>
)
