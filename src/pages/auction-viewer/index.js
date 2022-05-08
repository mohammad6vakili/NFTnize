import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams, useHistory } from "react-router-dom"
import { BlockTitle, Layout, AuctionTable } from "components"
import { loadStdlib } from "@reach-sh/stdlib"
import MyAlgoConnect from "@reach-sh/stdlib/ALGO_MyAlgoConnect"
import { Info } from "./page-components"
import { config } from "../../utils/config"
import * as AuctionService from "../../services/AuctionService"
import classes from "./index.module.scss"
import { timeDiffAsSec } from "utils/helper"

const stdlib = loadStdlib("ALGO")

stdlib.setWalletFallback(
  stdlib.walletFallback({
    providerEnv: config.network,
    MyAlgoConnect,
  })
)

const AuctionViewer = () => {
  const { appId } = useParams()
  const history = useHistory()
  const allAuctions = useSelector((state) => state.auction.auctions)
  const auction = allAuctions.filter(
    (app) => Number(app.appId) === Number(appId)
  )[0]
  const { bids, currentPrice, nft: asset, endTime } = auction
  const assetId = asset.token.id
  const [timeCounter, setTimeCounter] = useState(0)

  useEffect(() => {
    const diff = timeDiffAsSec(endTime)
    if (diff > 0) setTimeCounter(diff)
  }, [endTime])

  useEffect(() => {
    if (!timeCounter) return

    const intervalId = setInterval(() => {
      setTimeCounter(timeCounter - 1)
    }, 1000)

    if (timeCounter < 0) clearInterval(intervalId)

    return () => clearInterval(intervalId)
  }, [timeCounter])

  const onBid = async () => {
    const account = await stdlib.getDefaultAccount()
    await account.tokenAccept(assetId)

    const ctc = account.contract(AuctionService, appId)
    await ctc.a.Bid.getBid(
      stdlib.parseCurrency(window.prompt("Enter bid amount", "0"))
    )
  }

  const onClose = async () => {
    const account = await stdlib.getDefaultAccount()
    await account.tokenAccept(assetId)

    const ctc = account.contract(AuctionService, appId)
    await ctc.a.Bid.close(1)

    history.push("/all-applications")
  }

  return (
    <Layout
      breadcrumb={[
        {
          label: "Home",
          to: "/v1/home",
        },
        {
          label: "Auctions",
          to: "/v1/all-applications",
        },
        {
          label: `${appId}`,
        },
      ]}
      className={classes.layout}
    >
      <BlockTitle title="Bid History">
        <Info
          asset={asset}
          currentPrice={currentPrice}
          assetId={assetId}
          timeCounter={timeCounter}
          onBid={onBid}
          onClose={onClose}
        />
        {bids.length ? (
          <AuctionTable
            header={["Transaction ID", "Date/Time", "Bidder", "Price"]}
            items={bids}
          />
        ) : (
          <div className={classes["no-bid-history"]}>No bid history.</div>
        )}
      </BlockTitle>
    </Layout>
  )
}

export default AuctionViewer
