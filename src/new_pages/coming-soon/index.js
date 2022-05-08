import { Layout, Button } from "new_components"
import { useHistory } from "react-router-dom"
import classes from "./index.module.scss"

const ComingSoon = () => {
  const history = useHistory()
  return (
    <Layout container>
      <div className={classes.container}>
        <h1>Coming Soon</h1>
        <p>
          This page will be <span>available soon</span>, stay tuned!
        </p>
        <Button onClick={() => history.push("/")}>Go back Home</Button>
      </div>
    </Layout>
  )
}

export default ComingSoon
