import classes from "./CollectionAsset.module.scss"
import ContentLoader from "react-content-loader"
import { contentLoaderColors } from "utils/config"

export const CollectionAssetLoading = () => (
  <div className={classes.asset}>
    <ContentLoader
      speed={2}
      width={378}
      height={150}
      viewBox="0 0 378 150"
      backgroundColor={contentLoaderColors.background}
      foregroundColor={contentLoaderColors.foreground}
    >
      <rect x="1" y="0" rx="4" ry="4" width="143" height="150" />
      <rect x="162" y="9" rx="4" ry="4" width="213" height="29" />
      <rect x="164" y="116" rx="4" ry="4" width="89" height="26" />
      <rect x="218" y="60" rx="4" ry="4" width="94" height="25" />
      <circle cx="184" cy="72" r="22" />
    </ContentLoader>
  </div>
)
