import React from "react"
import { contentLoaderColors } from "../../../utils/config"
import ContentLoader from "react-content-loader"

const Loading = () => (
  <div className="mv-card-loading">
    <ContentLoader
      speed={2}
      viewBox="0 0 205 260"
      backgroundColor={contentLoaderColors.background}
      foregroundColor={contentLoaderColors.foreground}
      style={{ width: "100%", height: "100%" }}
    >
      <rect
        x="0"
        y="0"
        rx="4"
        ry="4"
        style={{ width: "100%", height: "100%" }}
      />
    </ContentLoader>{" "}
  </div>
)
export default Loading
