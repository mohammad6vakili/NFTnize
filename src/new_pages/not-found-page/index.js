import { Layout, Button } from "new_components"
import { useHistory } from "react-router-dom"
import classes from "./index.module.scss"

const NotFoundPage = () => {
  const history = useHistory()
  return (
    <Layout container>
      <div className={classes.container}>
        <h1>Not Found</h1>
        {/* <p>This page doesn't exist.</p> */}
        <Button onClick={() => history.push("/")}>Go back Home</Button>
      </div>
    </Layout>
  )
}

export default NotFoundPage
