import classes from "./Traits.module.scss"
import { useParams } from "react-router-dom"
import { calculate } from "utils/helper"
// local loading
import { TraitLoading, HeaderLoading } from "./Loading"
import { CollectionLoadingId } from "redux/collection/collection-slice"
import { IndexerLoadingId } from "redux/indexer/indexer-slice"
import { useSelector } from "react-redux"

export const Traits = ({ asset, items }) => {
  const { index } = useParams()
  const { loading: collectionLoading } = useSelector(
    (state) => state.collection
  )
  const { loading: indexerLoading } = useSelector((state) => state.indexer)
  if (items && items.length > 0) {
    const totalLength = items.length
    const selectedAssetTraits = items.find((li) => li.id.$numberLong === index)
    return (
      <>
        {selectedAssetTraits && (
          <section className={classes.container}>
            {collectionLoading.includes(
              CollectionLoadingId.GET_SELECTED_COLLECTION_TRAITS
            ) ||
            indexerLoading.includes(IndexerLoadingId.LOOKUP_ASSET_BY_ID) ? (
              <HeaderLoading />
            ) : (
              <div className={classes.header}>
                <div className={classes.header__left}>
                  <h2 className={classes.header__title}>Traits</h2>
                  <span className={classes.header__rank}>
                    Rank:{" "}
                    <span>
                      {asset?.rarity_rank !== "none" && asset?.rarity_rank}
                    </span>{" "}
                    of {totalLength}
                  </span>
                </div>

                <div className={classes.header__right}>
                  <span>
                    {asset?.rarity_score !== "none" && asset?.rarity_score}
                  </span>
                  <span>Rarity Score</span>
                </div>
              </div>
            )}

            <ul className={classes.grid}>
              {collectionLoading.includes(
                CollectionLoadingId.GET_SELECTED_COLLECTION_TRAITS
              )
                ? [...Array(8).keys()].map((key) => <TraitLoading key={key} />)
                : selectedAssetTraits &&
                  selectedAssetTraits.attributes &&
                  selectedAssetTraits.attributes.length > 0 &&
                  selectedAssetTraits.attributes.map((trait, idx) => (
                    <li className={classes.trait} key={idx}>
                      <div className={classes.trait__header}>
                        <span>{trait.trait_type}</span>
                        <span>{trait.value}</span>
                      </div>
                      <div className={classes["trait__progress-bar"]}>
                        <div
                          className={classes.trait__progress}
                          style={{
                            width: `${calculate(items, trait, totalLength)}%`,
                          }}
                        />
                      </div>
                      <span className={classes["trait__progress-percent"]}>
                        {calculate(items, trait, totalLength)}% ({totalLength}x)
                      </span>
                    </li>
                  ))}
            </ul>
          </section>
        )}
      </>
    )
  } else {
    return <></>
  }
}
