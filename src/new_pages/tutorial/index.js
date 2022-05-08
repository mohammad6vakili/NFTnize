import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { Layout, Accordion, Breadcrumb } from "new_components"
import { ReactComponent as WaveShape } from "new_assets/shapes/collection-wave.svg"
import contentMarkdown from "./content.md"
import classes from "./index.module.scss"

const Tutorial = () => {
  const [markdown, setMarkdown] = useState(null)

  useEffect(() => {
    const getMarkdown = async () => {
      const res = await fetch(contentMarkdown)
      const mdText = await res.text()
      setMarkdown(mdText)
    }

    getMarkdown()
  }, [])

  return (
    <Layout>
      <section className={classes.container}>
        <div className={classes.content}>
          <h1 className={classes.title}>Tutorial</h1>
          <Breadcrumb
            paths={[
              {
                label: "Home",
                to: "/",
              },
              {
                label: "Tutorial",
              },
            ]}
            className={classes.breadcrumb}
          />
        </div>

        <div className={classes.wave}>
          <div />
          <WaveShape />
        </div>
      </section>

      <section className={classes.tutorials}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            div(props) {
              return (
                <Accordion summary={props.tutorial}>{props.children}</Accordion>
              )
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </section>
    </Layout>
  )
}

export default Tutorial
