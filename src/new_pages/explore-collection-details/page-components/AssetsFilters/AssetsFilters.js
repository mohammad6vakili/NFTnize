import { useState } from "react"
import classes from "./AssetsFilters.module.scss"
import { Button, Menu, Popover, Position } from "@blueprintjs/core"
import classNames from "classnames"
import { isCheckedExist } from "utils/helper"
import { useSelector } from "react-redux"

export const AssetsFilters = ({
  selectedCollection,
  availableSortTypes,
  selectedValue,
  handleSortChange,
  length,
}) => {
  const { checked } = useSelector((state) => state.collection)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const selectedSortType = availableSortTypes.find(
    (a) => a.value === selectedValue
  )
  const handleClickOnOption = (value) => {
    handleSortChange(value)
    setIsPopoverOpen(false)
  }

  return (
    <section className={classes.container}>
      <span>
        {isCheckedExist(checked) ? length : selectedCollection?.artworks}{" "}
        Artworks
      </span>

      <div className={classes.sort}>
        <span>Sort By</span>
        <Popover
          minimal="true"
          position={Position.BOTTOM_RIGHT}
          className={classes["sort-popover"]}
          isOpen={isPopoverOpen}
          onInteraction={(state) => setIsPopoverOpen(state)}
        >
          <Button
            text={selectedSortType.title}
            className={classes["sort-dropdown"]}
            rightIcon="chevron-down"
            intent="success"
          />
          <div className={classes["popover-content"]}>
            {availableSortTypes.map((a, idx) => (
              <Menu
                text={a.title}
                key={idx}
                onClick={() => handleClickOnOption(a.value)}
                className={classNames(
                  classes.sortMenu,
                  a.value === selectedValue && classes.blueGlowText
                )}
              >
                {a.title}
              </Menu>
            ))}
          </div>
        </Popover>
      </div>
    </section>
  )
}
