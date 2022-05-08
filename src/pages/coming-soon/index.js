import { Layout } from "components"
import classes from "./index.module.scss"

import { ReactComponent as ComingSoonIcon } from "assets/icons/coming-soon.svg"

const ComingSoon = () => (
  <Layout className={classes.layout}>
    <div className={classes.container}>
      <ComingSoonIcon className={classes.icon} />
      <h2 className={classes.desc}>
        This page will be <span>available soon</span>, stay tuned!
      </h2>
    </div>
  </Layout>
)

export default ComingSoon
