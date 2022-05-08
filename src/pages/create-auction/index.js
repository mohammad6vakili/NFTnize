import { useState } from "react"
import { loadStdlib } from "@reach-sh/stdlib"
import MyAlgoConnect from "@reach-sh/stdlib/ALGO_MyAlgoConnect"
import classes from "./index.module.scss"

import { Button, Layout, LoadingIndicator } from "components"
import { getAccountInfo } from "../../utils/algorand"
import { AuctionAsset } from "../../components/AuctionAsset/AuctionAsset"
import { NFT } from "../../utils/nft"
import { config } from "../../utils/config"
import { LOADING_STATUS } from "utils/constants"

const stdlib = loadStdlib("ALGO")
stdlib.setWalletFallback(
  stdlib.walletFallback({
    providerEnv: config.network,
    MyAlgoConnect,
  })
)

const CreateAuction = () => {
  const [assetList, setAssetList] = useState([])
  const [loading, setLoading] = useState(LOADING_STATUS.IDLE)
  const [defaultAccount, setDefaultAccount] = useState({})

  const fetchAssets = async (account) => {
    const { addr } = account.networkAccount
    const { assets } = await getAccountInfo(addr)
    const getAssetPromises = []
    assets.map((asset) =>
      getAssetPromises.push(NFT.fromAssetId(asset["asset-id"]))
    )
    Promise.all([...getAssetPromises])
      .then((list) => setAssetList(list))
      .catch((error) => console.log(error))
      .finally(() => setLoading(LOADING_STATUS.COMPLETED))
  }

  const handleConnect = async () => {
    const account = await stdlib.getDefaultAccount()
    setLoading(LOADING_STATUS.PENDING)
    setDefaultAccount(account)
    await fetchAssets(account)
  }

  return (
    <Layout>
      <h3>Choose default account to open auction from opt-in assets</h3>
      <br />
      <Button size="small" onClick={handleConnect}>
        Connect
      </Button>
      {loading === LOADING_STATUS.PENDING ? (
        <LoadingIndicator />
      ) : (
        loading === LOADING_STATUS.COMPLETED && (
          <div className={classes["assets-container"]}>
            <h2>Opt-in to application to create an auction</h2>
            <div className={classes["assets-grid"]}>
              {assetList.map(({ metadata, token }, index) => (
                <AuctionAsset
                  key={index}
                  index={token.id}
                  image={metadata.image}
                  total={token.total}
                  account={defaultAccount}
                />
              ))}
            </div>
          </div>
        )
      )}
    </Layout>
  )
}

export default CreateAuction
