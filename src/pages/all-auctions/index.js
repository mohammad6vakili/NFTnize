import { useSelector } from "react-redux"
import { BlockTitle, Layout } from "components"

import classes from "./index.module.scss"
import { ApplicationInfo } from "./page-components"

const AllAuctions = () => {
  const allAuctions = useSelector((state) => state.auction.auctions)

  return (
    <Layout
      breadcrumb={[
        {
          label: "Home",
          to: "/",
        },
        {
          label: "All Auctions",
        },
      ]}
    >
      <BlockTitle title="All Auctions">
        {!allAuctions.length ? (
          <h2>No applications</h2>
        ) : (
          <div className={classes["applications-container"]}>
            <h2>Select an auction and make a bid</h2>
            <div className={classes["applications-grid"]}>
              {allAuctions.map((auction, index) => (
                <ApplicationInfo key={index} {...auction} />
              ))}
            </div>
          </div>
        )}
      </BlockTitle>
    </Layout>
  )
}

export default AllAuctions
