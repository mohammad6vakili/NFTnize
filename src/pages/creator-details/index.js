import { Layout, BlockTitle, NewCreator } from "components"
import { useParams } from "react-router-dom"

const CreatorDetails = () => {
  const { addr } = useParams()

  return (
    <Layout
      breadcrumb={[
        {
          label: "Home",
          to: "/v1/home",
        },
        {
          label: "Creators",
          to: `/v1/creators`,
        },
        {
          label: addr,
        },
      ]}
    >
      {/* <Creator /> */}
      <BlockTitle title="Creator Assets">
        <NewCreator address={addr} />
      </BlockTitle>
    </Layout>
  )
}

export default CreatorDetails
