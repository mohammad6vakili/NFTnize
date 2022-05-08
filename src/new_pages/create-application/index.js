import { Layout } from "new_components"
import { Form } from "./page-components"
import classes from "./index.module.scss"

const CreateApplication = () => (
  <Layout container className={classes.container}>
    <Form className={classes.form} />
  </Layout>
)

export default CreateApplication
