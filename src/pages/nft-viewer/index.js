import { Layout, NFTViewer } from "components"
import { useSelector } from "react-redux"

const NFTView = () => {
  const { sessionWallet } = useSelector((state) => state.wallet)
  return (
    <Layout>
      <NFTViewer sw={sessionWallet} />
    </Layout>
  )
}

export default NFTView
