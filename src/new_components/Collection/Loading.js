import classes from "./Collection.module.scss"
import ContentLoader from "react-content-loader"
import { contentLoaderColors } from "utils/config"

export const CollectionLoading = ({ large, layout }) => (
  <div className={classes["collection-loading"]}>
    {large ? (
      <ContentLoader
        speed={2}
        width={window.innerWidth > 1264 ? 526 : 395}
        height={window.innerWidth > 1264 ? 586 : 282}
        viewBox={window.innerWidth > 1264 ? "0 0 526 586" : "0 0 395 282"}
        backgroundColor={contentLoaderColors.background}
        foregroundColor={contentLoaderColors.foreground}
        style={{ width: "100%" }}
      >
        <rect
          x="0"
          y="0"
          rx="4"
          ry="4"
          width={window.innerWidth > 1264 ? "526" : "395"}
          height={window.innerWidth > 1264 ? "586" : "282"}
        />
      </ContentLoader>
    ) : (
      <ContentLoader
        speed={2}
        width={layout === "home" ? 395 : 323}
        height={layout === "home" ? 282 : 388}
        viewBox={layout === "home" ? "0 0 395 282" : "0 0 323 388"}
        backgroundColor={contentLoaderColors.background}
        foregroundColor={contentLoaderColors.foreground}
        style={{ width: "100%" }}
      >
        <rect
          x="0"
          y="0"
          rx="4"
          ry="4"
          width={layout === "home" ? "395" : "323"}
          height={layout === "home" ? "282" : "388"}
        />
      </ContentLoader>
    )}
  </div>
)
