import classes from "./Creator.module.scss"
import ContentLoader from "react-content-loader"
import { contentLoaderColors } from "utils/config"

export const CreatorLoading = () => (
  <div className={classes["creator-loading"]}>
    <ContentLoader
      speed={2}
      width={205}
      height={160}
      viewBox="0 0 205 160"
      backgroundColor={contentLoaderColors.background}
      foregroundColor={contentLoaderColors.foreground}
      style={{ width: "100%" }}
    >
      <rect x="0" y="0" rx="4" ry="4" width="205" height="160" />
    </ContentLoader>
  </div>
)
