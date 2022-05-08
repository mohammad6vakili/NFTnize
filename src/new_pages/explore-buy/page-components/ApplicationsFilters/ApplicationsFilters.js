import { useMemo, useState } from "react"
import classes from "./ApplicationsFilters.module.scss"
import { Button, Menu, Popover, Position } from "@blueprintjs/core"
import classNames from "classnames"

export const ApplicationsFilters = ({
  length,
  availableSortTypes,
  selectedValue,
  handleSortChange,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const selectedSortType = useMemo(
    () =>
      availableSortTypes.find((a) => a.value === selectedValue) ??
      availableSortTypes[0],
    [selectedValue, availableSortTypes]
  )

  const handleClickOnOption = (value) => {
    handleSortChange(value)
    setIsPopoverOpen(false)
  }

  return (
    <section className={classes.container}>
      <span>{length || 0} Items</span>
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
                  a.value === selectedSortType.value && classes.blueGlowText
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
