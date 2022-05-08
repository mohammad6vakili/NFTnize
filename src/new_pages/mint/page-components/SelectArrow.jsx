import React from "react"
import { useSelector } from "react-redux"
import selectArrowWhite from "../page-assets/select-arrow-white.svg"
import selectArrowBlack from "../page-assets/select-arrow-black.svg"

const SelectArrow = ({ icon }) => {
  const { rootTheme } = useSelector((state) => state.application)

  return (
    <img
      src={rootTheme === "dark" ? selectArrowWhite : selectArrowBlack}
      alt="icon"
    />
  )
}
export default SelectArrow
