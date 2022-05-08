import { Collection, Button, BlockTitle, CollectionLoading } from "components"
import classes from "./Collections.module.scss"
import { CollectionLoadingId } from "redux/collection/collection-slice"

export const Collections = ({ className, collectionLoading, collections }) => (
  <BlockTitle className={className} title="Collections">
    <div className={classes.grid}>
      {collectionLoading.includes(CollectionLoadingId.GET_COLLECTIONS) ? (
        [...Array(4).keys()].map((key) => <CollectionLoading key={key} />)
      ) : (
        <>
          {collections.map((collection, key) => (
            <Collection {...collection} key={key} />
          ))}
        </>
      )}
    </div>

    <div className={classes.actions}>
      <Button accent="orange" type="link" to="/all-collections">
        View All Collections
      </Button>
    </div>
  </BlockTitle>
)
