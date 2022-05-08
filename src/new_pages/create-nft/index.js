/* eslint-disable import/named */
import { Layout } from "new_components"
import { Form } from "./page-components"
import classes from "./index.module.scss"
import { useSelector } from "react-redux"

const CreateNft = () => {
  const { sessionWallet, connected } = useSelector((state) => state.wallet)

  return (
    <Layout container className={classes.container}>
      <Form className={classes.form} sw={sessionWallet} connected={connected} />
      {/* <Traits items={traits} /> */}
      {/* <div className={classes.row}>
        <PriceHistoryChart />
        <Provenance />
      </div> */}
      {/* <TransactionHistory /> */}
      {/* <AboutCreator /> */}
    </Layout>
  )
}

export default CreateNft
