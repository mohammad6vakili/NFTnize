import classes from "./Table.module.scss"
import ContentLoader from "react-content-loader"
import { contentLoaderColors } from "utils/config"

export const TableLoading = () => (
  <div className={classes["table-loading"]}>
    <ContentLoader
      speed={2}
      width={1032}
      height={355}
      viewBox="0 0 1032 355"
      backgroundColor={contentLoaderColors.background}
      foregroundColor={contentLoaderColors.foreground}
      style={{ width: "100%" }}
    >
      <rect x="25" y="20" rx="4" ry="4" width="142" height="17" />
      <rect x="230" y="20" rx="4" ry="4" width="150" height="17" />
      <rect x="443" y="20" rx="4" ry="4" width="129" height="17" />
      <rect x="646" y="20" rx="4" ry="4" width="106" height="17" />
      <rect x="790" y="20" rx="4" ry="4" width="88" height="17" />
      <rect x="916" y="20" rx="4" ry="4" width="88" height="17" />
      <rect x="0" y="57" rx="3" ry="3" width="1032" height="2" />
      <rect x="25" y="79" rx="4" ry="4" width="142" height="17" />
      <rect x="230" y="79" rx="4" ry="4" width="150" height="17" />
      <rect x="443" y="79" rx="4" ry="4" width="129" height="17" />
      <rect x="646" y="79" rx="4" ry="4" width="106" height="17" />
      <rect x="790" y="79" rx="4" ry="4" width="88" height="17" />
      <rect x="916" y="79" rx="4" ry="4" width="88" height="17" />
      <rect x="0" y="116" rx="3" ry="3" width="1032" height="2" />
      <rect x="25" y="138" rx="4" ry="4" width="142" height="17" />
      <rect x="230" y="138" rx="4" ry="4" width="150" height="17" />
      <rect x="443" y="138" rx="4" ry="4" width="129" height="17" />
      <rect x="646" y="138" rx="4" ry="4" width="106" height="17" />
      <rect x="790" y="138" rx="4" ry="4" width="88" height="17" />
      <rect x="916" y="138" rx="4" ry="4" width="88" height="17" />
      <rect x="0" y="175" rx="3" ry="3" width="1032" height="2" />
      <rect x="25" y="197" rx="4" ry="4" width="142" height="17" />
      <rect x="230" y="197" rx="4" ry="4" width="150" height="17" />
      <rect x="443" y="197" rx="4" ry="4" width="129" height="17" />
      <rect x="646" y="197" rx="4" ry="4" width="106" height="17" />
      <rect x="790" y="197" rx="4" ry="4" width="88" height="17" />
      <rect x="916" y="197" rx="4" ry="4" width="88" height="17" />
      <rect x="0" y="234" rx="3" ry="3" width="1032" height="2" />
      <rect x="25" y="256" rx="4" ry="4" width="142" height="17" />
      <rect x="230" y="256" rx="4" ry="4" width="150" height="17" />
      <rect x="443" y="256" rx="4" ry="4" width="129" height="17" />
      <rect x="646" y="256" rx="4" ry="4" width="106" height="17" />
      <rect x="790" y="256" rx="4" ry="4" width="88" height="17" />
      <rect x="916" y="256" rx="4" ry="4" width="88" height="17" />
      <rect x="0" y="293" rx="3" ry="3" width="1032" height="2" />
      <rect x="25" y="315" rx="4" ry="4" width="142" height="17" />
      <rect x="230" y="315" rx="4" ry="4" width="150" height="17" />
      <rect x="443" y="315" rx="4" ry="4" width="129" height="17" />
      <rect x="646" y="315" rx="4" ry="4" width="106" height="17" />
      <rect x="790" y="315" rx="4" ry="4" width="88" height="17" />
      <rect x="916" y="315" rx="4" ry="4" width="88" height="17" />
    </ContentLoader>
  </div>
)
