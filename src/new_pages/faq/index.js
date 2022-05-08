import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeRaw from "rehype-raw"
import { Layout, Accordion, Breadcrumb } from "new_components"
import { ReactComponent as WaveShape } from "new_assets/shapes/collection-wave.svg"
import contentMarkdown from "./content.md"
import classes from "./index.module.scss"

const FAQ = () => {
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
          <h1 className={classes.title}>FAQ</h1>
          <Breadcrumb
            paths={[
              {
                label: "Home",
                to: "/",
              },
              {
                label: "FAQ",
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

      <section className={classes.faqs}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            div(props) {
              return <Accordion summary={props.faq}>{props.children}</Accordion>
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
      </section>
    </Layout>
  )
}

export default FAQ
