import React, { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { Layout, Accordion, Breadcrumb } from "new_components"
import { ReactComponent as WaveShape } from "new_assets/shapes/collection-wave.svg"
import markdownContent from "./content.md"
import classes from "./index.module.scss"

const PrivacyPolicy = () => {
  const [markdown, setMarkdown] = useState(null)

  useEffect(() => {
    const getMarkdown = async () => {
      const res = await fetch(markdownContent)
      const mdText = await res.text()
      setMarkdown(mdText)
    }

    getMarkdown()
  }, [])

  return (
    <Layout>
      <section className={classes.container}>
        <div className={classes.content}>
          <h1 className={classes.title}>Privacy Policy</h1>
          <Breadcrumb
            paths={[
              {
                label: "Home",
                to: "/",
              },
              {
                label: "Privacy Policy",
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
      <section className={classes.terms}>
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

export default PrivacyPolicy
