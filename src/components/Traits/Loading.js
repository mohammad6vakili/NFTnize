import classes from "./Traits.module.scss"
import ContentLoader from "react-content-loader"
import { contentLoaderColors } from "utils/config"

export const TraitsLoading = () => (
  <section className={classes.container}>
    <ul className={classes.grid}>
      {[...Array(10).keys()].map((key) => (
        <li className={classes.trait} key={key}>
          <ContentLoader
            speed={2}
            width={203}
            height={112}
            viewBox="0 0 203 112"
            backgroundColor={contentLoaderColors.background}
            foregroundColor={contentLoaderColors.foreground}
          >
            <rect x="32" y="0" rx="4" ry="4" width="139" height="27" />
            <rect x="37" y="37" rx="4" ry="4" width="130" height="18" />
            <rect x="22" y="75" rx="4" ry="4" width="159" height="18" />
            <rect x="11" y="102" rx="4" ry="4" width="180" height="8" />
          </ContentLoader>
        </li>
      ))}
    </ul>
  </section>
)
