import classes from "./Asset.module.scss"
import ContentLoader from "react-content-loader"
import { contentLoaderColors } from "utils/config"

export const AssetLoading = () => (
  <div className={classes["asset-loading"]}>
    <ContentLoader
      speed={2}
      width={322}
      height={447}
      viewBox="0 0 322 447"
      backgroundColor={contentLoaderColors.background}
      foregroundColor={contentLoaderColors.foreground}
      style={{ width: "100%" }}
    >
      <rect x="0" y="0" rx="4" ry="4" width="322" height="322" />
      <rect x="20" y="342" rx="4" ry="4" width="191" height="25" />
      <rect x="20" y="383" rx="4" ry="4" width="73" height="16" />
      <rect x="20" y="410" rx="4" ry="4" width="112" height="20" />
      <rect x="190" y="383" rx="4" ry="4" width="73" height="16" />
      <rect x="190" y="410" rx="4" ry="4" width="112" height="20" />
    </ContentLoader>
  </div>
)
