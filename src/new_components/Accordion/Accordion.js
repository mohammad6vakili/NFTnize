import { useState } from "react"
import classes from "./Accordion.module.scss"
import { ReactComponent as ChevronDownIcon } from "new_assets/icons/chevron-down.svg"
import { Collapse } from "react-collapse"
import classNames from "classnames"

export const Accordion = ({ summary, children, isOpen, onToggle }) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  const isControlled = !!(isOpen !== undefined || onToggle)

  const handleToggle = () => {
    if (!isControlled) {
      setIsAccordionOpen((o) => !o)
    } else {
      onToggle?.(!isOpen)
    }
  }

  return (
    <div
      className={classNames(
        classes.accordion,
        isControlled ? isOpen : isAccordionOpen && classes["accordion--open"]
      )}
    >
      <button type="button" className={classes.summary} onClick={handleToggle}>
        {summary}
        <ChevronDownIcon />
      </button>
      <Collapse isOpened={isControlled ? isOpen : isAccordionOpen}>
        <div className={classes.details}>{children}</div>
      </Collapse>
    </div>
  )
}
