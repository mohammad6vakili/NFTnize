import { Button, ComingSoonModal, AboutCreatorLoading } from "new_components"
import classes from "./AboutCreator.module.scss"
import { formatCreator } from "utils/helper"
import { IndexerLoadingId } from "redux/indexer/indexer-slice"
import { useState } from "react"
import { useSelector } from "react-redux"

export const AboutCreator = ({ info }) => {
  const { loading: indexerLoading } = useSelector((state) => state.indexer)
  const [isOpen, setIsOpen] = useState(false)
  const handleFollowClick = () => {
    setIsOpen(true)
  }

  return (
    <section className={classes.container}>
      <h2 className={classes.title}>About Creator</h2>

      {indexerLoading.includes(IndexerLoadingId.LOOKUP_ASSET_BY_ID) ? (
        <AboutCreatorLoading />
      ) : (
        <div className={classes.about}>
          <img src={info?.url} alt="profile logo" className={classes.avatar} />

          <div className={classes.info}>
            {/* <span className={classes.name}>Usera Namera</span> */}
            <span className={classes.id}>
              @{formatCreator(info?.collection?.creator)}
            </span>
            <p className={classes.bio}>
              Alien from the fine art world. Manifesting art to explore the
              power of human emotions and how it resonates with suggested
              fantasy circumstances.
            </p>
          </div>

          <Button onClick={handleFollowClick}>Follow</Button>
        </div>
      )}

      <ComingSoonModal
        isOpen={isOpen}
        // data={alertMessage}
        onClose={() => setIsOpen(false)}
      />
    </section>
  )
}
