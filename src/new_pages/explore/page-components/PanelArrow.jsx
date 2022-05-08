import React from "react"
import { useSelector } from "react-redux"

const PanelArrow = () => {
  const { rootTheme } = useSelector((state) => state.application)

  return (
    <svg
      width="15"
      height="9"
      viewBox="0 0 15 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 1L7.5 7.5L1 0.999999"
        stroke={rootTheme === "dark" ? "white" : "black"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default PanelArrow
