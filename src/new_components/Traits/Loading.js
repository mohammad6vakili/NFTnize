import classes from "./Traits.module.scss"
import ContentLoader from "react-content-loader"
import { contentLoaderColors } from "utils/config"

export const TraitLoading = () => (
  <li className={classes.trait}>
    <ContentLoader
      speed={2}
      width={215}
      height={70}
      viewBox="0 0 215 70"
      backgroundColor={contentLoaderColors.background}
      foregroundColor={contentLoaderColors.foreground}
      style={{ width: "100%" }}
    >
      <rect x="0" y="0" rx="4" ry="4" width="105" height="18" />
      <rect x="143" y="0" rx="4" ry="4" width="68" height="18" />
      <rect x="0" y="32" rx="4" ry="4" width="212" height="6" />
      <rect x="0" y="51" rx="4" ry="4" width="131" height="17" />
    </ContentLoader>
  </li>
)

export const HeaderLoading = () => (
  <div className={classes.header}>
    <div className={classes.header}>
      <div className={classes.header__left}>
        <h2 className={classes.header__title}>Traits</h2>
        <ContentLoader
          speed={2}
          width={147}
          height={20}
          viewBox="0 0 147 20"
          backgroundColor={contentLoaderColors.background}
          foregroundColor={contentLoaderColors.foreground}
        >
          <rect x="0" y="0" rx="4" ry="4" width="147" height="20" />
        </ContentLoader>
      </div>

      <div className={classes.header__right}>
        <ContentLoader
          speed={2}
          width={41}
          height={34}
          viewBox="0 0 41 34"
          backgroundColor={contentLoaderColors.background}
          foregroundColor={contentLoaderColors.foreground}
          style={{ marginRight: "1rem" }}
        >
          <rect x="0" y="0" rx="4" ry="4" width="41" height="34" />
        </ContentLoader>

        <span>Rarity Score</span>
      </div>
    </div>
  </div>
)
