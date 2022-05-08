import { Layout, CollectionsGrid, CreatorsGrid } from "new_components"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { asyncGetCollectionsAll } from "redux/collection/collection-slice"
import {
  asyncSomeAssets,
  asyncFeaturedCreators,
} from "redux/indexer/indexer-slice"
import { ApplicationCard } from "new_pages/explore-buy/page-components/index"
import { Hero } from "./page-components"
import classes from "./index.module.scss"

const Home = ({ handleThemeSwitch }) => {
  const dispatch = useDispatch()
  const allCollections = useSelector(
    (state) => state.collection.all_collections
  )
  const { popular: popularApplications } = useSelector(
    (state) => state.application
  )
  const { featuredCreators } = useSelector((state) => state.indexer)

  useEffect(() => {
    dispatch(asyncGetCollectionsAll())
    dispatch(asyncSomeAssets({ limit: 10 }))
    dispatch(asyncFeaturedCreators({ limit: 6 }))
  }, [])

  return (
    <Layout handleThemeSwitch={handleThemeSwitch}>
      <Hero handleThemeSwitch={handleThemeSwitch} />
      <div className={classes.container}>
        {/* <AssetsGrid assets={homeAssets.slice(0, 8)} header /> */}
        {popularApplications && popularApplications.length > 3 && (
          <div>
            <div className={classes.header}>
              <h2>Popular</h2>
            </div>
            <div className={classes.grid}>
              {popularApplications.slice(3, 11).map((app) => (
                <ApplicationCard key={app.appId} {...app} />
              ))}
            </div>
          </div>
        )}

        <CollectionsGrid
          collections={allCollections.slice(0, 5)}
          layout="home"
          header
        />

        <CreatorsGrid creatorsData={featuredCreators.slice(0, 6)} />
      </div>
    </Layout>
  )
}

export default Home
