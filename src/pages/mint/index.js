import { Layout, Minter } from "components"
import { useSelector } from "react-redux"

const Mint = () => {
  const { sessionWallet, connected } = useSelector((state) => state.wallet)

  return (
    <Layout>
      <Minter sw={sessionWallet} connected={connected} />
    </Layout>
  )
}

export default Mint
