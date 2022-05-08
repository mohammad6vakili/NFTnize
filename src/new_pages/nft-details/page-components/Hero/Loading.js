import classes from "./Hero.module.scss"
import ContentLoader from "react-content-loader"
import { contentLoaderColors } from "utils/config"

export const HeroLoading = () => (
  <div className={classes["hero-loading"]}>
    <div className={classes["hero-loading__info"]}>
      <ContentLoader
        speed={2}
        width={433}
        height={443}
        viewBox="0 0 433 443"
        backgroundColor={contentLoaderColors.background}
        foregroundColor={contentLoaderColors.foreground}
        style={{ width: "100%" }}
      >
        <rect x="0" y="0" rx="17" ry="17" width="114" height="31" />
        <rect x="0" y="50" rx="4" ry="4" width="271" height="40" />
        <rect x="0" y="107" rx="4" ry="4" width="413" height="27" />
        <rect x="0" y="147" rx="4" ry="4" width="413" height="27" />
        <rect x="0" y="186" rx="4" ry="4" width="218" height="27" />
        <rect x="0" y="233" rx="4" ry="4" width="430" height="2" />
        <rect x="0" y="250" rx="4" ry="4" width="122" height="21" />
        <rect x="0" y="284" rx="4" ry="4" width="178" height="21" />
        <rect x="251" y="250" rx="4" ry="4" width="122" height="21" />
        <rect x="251" y="284" rx="4" ry="4" width="178" height="21" />
        <rect x="0" y="323" rx="4" ry="4" width="122" height="21" />
        <rect x="0" y="357" rx="4" ry="4" width="178" height="21" />
        <rect x="251" y="323" rx="4" ry="4" width="122" height="21" />
        <rect x="251" y="357" rx="4" ry="4" width="178" height="21" />
        <rect x="0" y="398" rx="4" ry="4" width="430" height="43" />
      </ContentLoader>
    </div>

    <div className={classes["hero-loading__figures"]}>
      <ContentLoader
        speed={2}
        width={441}
        height={612}
        viewBox="0 0 441 612"
        backgroundColor={contentLoaderColors.background}
        foregroundColor={contentLoaderColors.foreground}
        style={{ width: "100%" }}
      >
        <rect x="0" y="0" rx="4" ry="4" width="440" height="553" />
        <circle cx="181" cy="589" r="21" />
        <circle cx="239" cy="589" r="21" />
      </ContentLoader>
    </div>
  </div>
)
