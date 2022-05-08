import React from "react"
import { useSelector } from "react-redux"

const PriceLabel = ({ title }) => {
  const { rootTheme } = useSelector((state) => state.application)
  return (
    <div
      style={
        rootTheme === "light"
          ? { color: "black", fontSize: "16px" }
          : { color: "white", fontSize: "16px" }
      }
    >
      {title}
    </div>
  )
}
export default PriceLabel
