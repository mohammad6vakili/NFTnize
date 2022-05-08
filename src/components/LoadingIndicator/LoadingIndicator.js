import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import classes from "./LoadingIndicator.module.scss"

export const LoadingIndicator = () => (
  <div className={classes.container}>
    <Spin
      indicator={
        <LoadingOutlined
          style={{ fontSize: 36, color: "var(--color-pink)" }}
          spin
        />
      }
    />
  </div>
)

export const SMLoadingIndicator = () => (
  <div className={classes["sm-container"]}>
    <Spin
      indicator={
        <LoadingOutlined
          style={{ fontSize: 24, color: "var(--color-pink)" }}
          spin
        />
      }
    />
  </div>
)
