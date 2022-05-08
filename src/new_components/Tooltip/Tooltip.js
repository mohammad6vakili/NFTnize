import { usePopperTooltip } from "react-popper-tooltip"
import classes from "./Tooltip.module.scss"
import classNames from "classnames"

export const Tooltip = ({ children, text, color, ...props }) => {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ ...props })

  return (
    <>
      <span ref={setTriggerRef}>{children}</span>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: "tooltip-container",
          })}
        >
          <span
            className={classNames(
              color === "pink" && classes.pinkText,
              color === "blue" && classes.blueText,
              !color && classes.whiteText
            )}
          >
            {text}
          </span>
          <div {...getArrowProps({ className: "tooltip-arrow" })} />
        </div>
      )}
    </>
  )
}
