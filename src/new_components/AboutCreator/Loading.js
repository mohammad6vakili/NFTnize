import classes from "./AboutCreator.module.scss"
import ContentLoader from "react-content-loader"
import { contentLoaderColors } from "utils/config"

export const AboutCreatorLoading = () => (
  <div className={classes.about}>
    <ContentLoader
      speed={2}
      width={65}
      height={65}
      viewBox="0 0 65 65"
      backgroundColor={contentLoaderColors.background}
      foregroundColor={contentLoaderColors.foreground}
      style={{
        width: "100%",
        height: window.innerWidth < 960 ? "100%" : "unset",
      }}
    >
      <circle cx="32" cy="32" r="32" />
    </ContentLoader>

    <div className={classes.info}>
      <ContentLoader
        speed={2}
        width={722}
        height={122}
        viewBox="0 0 722 122"
        backgroundColor={contentLoaderColors.background}
        foregroundColor={contentLoaderColors.foreground}
        style={{
          width: "100%",
        }}
      >
        <rect x="0" y="0" rx="4" ry="4" width="215" height="41" />
        <rect x="0" y="55" rx="4" ry="4" width="600" height="17" />
        <rect x="0" y="79" rx="4" ry="4" width="600" height="17" />
        <rect x="0" y="103" rx="4" ry="4" width="300" height="17" />
      </ContentLoader>
    </div>

    <ContentLoader
      speed={2}
      width={205}
      height={50}
      viewBox="0 0 205 50"
      backgroundColor={contentLoaderColors.background}
      foregroundColor={contentLoaderColors.foreground}
      style={{
        width: "100%",
        height: window.innerWidth < 960 ? "100%" : "unset",
      }}
    >
      <rect x="0" y="0" rx="4" ry="4" width="205" height="50" />
    </ContentLoader>
  </div>
)
