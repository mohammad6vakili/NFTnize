import classes from "./Collection.module.scss"
import ContentLoader from "react-content-loader"
import { contentLoaderColors } from "utils/config"

export const CollectionLoading = ({ type }) => {
  if (type === "compact-owner" || type === "compact-price") {
    return (
      <ContentLoader
        speed={2}
        width={230}
        height={38}
        viewBox="0 0 230 38"
        backgroundColor={contentLoaderColors.background}
        foregroundColor={contentLoaderColors.foreground}
      >
        <circle cx="19" cy="19" r="19" />
        <rect x="43" y="4" rx="4" ry="4" width="148" height="16" />
        <rect x="43" y="24" rx="4" ry="4" width="132" height="11" />
      </ContentLoader>
    )
  }
  if (type === "compact-list") {
    return (
      <div className={classes["compact-list-loading"]}>
        <ContentLoader
          speed={2}
          width={634}
          height={62}
          viewBox="0 0 634 62"
          backgroundColor={contentLoaderColors.background}
          foregroundColor={contentLoaderColors.foreground}
        >
          <rect x="468" y="26" rx="3" ry="3" width="88" height="6" />
          <rect x="469" y="36" rx="3" ry="3" width="52" height="6" />
          <rect x="38" y="19" rx="3" ry="3" width="178" height="21" />
          <circle cx="441" cy="31" r="20" />
        </ContentLoader>
      </div>
    )
  }
  return (
    <div className={classes.collection}>
      <ContentLoader
        speed={2}
        width={268}
        height={284}
        viewBox="0 0 268 284"
        backgroundColor={contentLoaderColors.background}
        foregroundColor={contentLoaderColors.foreground}
      >
        <rect x="0" y="7" rx="4" ry="4" width="266" height="130" />
        <rect x="0" y="148" rx="4" ry="4" width="80" height="61" />
        <rect x="186" y="148" rx="4" ry="4" width="80" height="61" />
        <rect x="1" y="220" rx="4" ry="4" width="266" height="27" />
        <rect x="34" y="263" rx="4" ry="4" width="233" height="16" />
        <circle cx="13" cy="270" r="13" />
        <rect x="92" y="148" rx="4" ry="4" width="80" height="61" />
      </ContentLoader>
    </div>
  )
}
