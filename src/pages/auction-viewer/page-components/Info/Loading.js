import classes from "./Info.module.scss"
import ContentLoader from "react-content-loader"
import { contentLoaderColors } from "utils/config"

export const InfoLoading = () => (
  <section className={classes.info}>
    <div className={classes.left}>
      <ContentLoader
        speed={2}
        width={410}
        height={410}
        viewBox="0 0 410 410"
        backgroundColor={contentLoaderColors.background}
        foregroundColor={contentLoaderColors.foreground}
      >
        <rect x="0" y="0" rx="4" ry="4" width="410" height="410" />
      </ContentLoader>
    </div>

    <div className={classes.right}>
      <ContentLoader
        speed={2}
        width={840}
        height={410}
        viewBox="0 0 840 410"
        backgroundColor={contentLoaderColors.background}
        foregroundColor={contentLoaderColors.foreground}
      >
        <rect x="0" y="0" rx="4" ry="4" width="294" height="46" />
        <rect x="0" y="100" rx="4" ry="4" width="567" height="20" />
        <rect x="0" y="129" rx="4" ry="4" width="567" height="20" />
        <rect x="0" y="157" rx="4" ry="4" width="193" height="20" />
        <rect x="0" y="207" rx="4" ry="4" width="243" height="18" />
        <rect x="268" y="207" rx="4" ry="4" width="243" height="18" />
        <rect x="0" y="233" rx="4" ry="4" width="243" height="18" />
        <rect x="268" y="233" rx="4" ry="4" width="243" height="18" />
        <rect x="0" y="259" rx="4" ry="4" width="243" height="18" />
        <rect x="268" y="259" rx="4" ry="4" width="243" height="18" />
        <rect x="0" y="324" rx="4" ry="4" width="97" height="45" />
        <rect x="0" y="72" rx="4" ry="4" width="567" height="20" />
      </ContentLoader>
    </div>
  </section>
)
