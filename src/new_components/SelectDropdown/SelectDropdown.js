import { useState, useEffect } from "react"
import classNames from "classnames"
import classes from "./SelectDropdown.module.scss"
import { ReactComponent as ChevronDownIcon } from "new_assets/icons/chevron-down.svg"
import { ReactComponent as QuestionMarkIcon } from "new_assets/icons/question-mark-circle.svg"
import { Tooltip } from "new_components"

export const SelectDropdown = ({
  placeholder,
  value,
  onChange = () => {},
  label,
  required,
  error,
  labelAccent,
  disabled,
  items = [],
  className,
  tooltipText,
  capitalizeLabel,
}) => {
  const [isDropdownShown, setIsDropdownShown] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (value) {
      // find value in items
      const valueItem = items.find((item) => item.value === value)
      if (valueItem) setSelected(valueItem)
    }
  }, [value])

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOnDocument)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOnDocument)
    }
  })

  const handleClickOnDocument = (e) => {
    if (!e.target.closest(`.${classes["input-container"]}`)) {
      setIsDropdownShown(false)
    }
  }

  const handleSelectItem = (item) => {
    setSelected(item)
    setIsDropdownShown(false)
    onChange(item.value)
  }

  return (
    <div
      className={classNames(
        classes.container,
        error && classes.error,
        disabled && classes.disabled,
        className
      )}
    >
      <button
        type="button"
        className={classNames(
          classes.label,
          labelAccent && classes["label-accent-pink"],
          capitalizeLabel && classes["label-capitalize"]
        )}
      >
        {label} {required && <span style={{ color: "#ff39b0" }}>*</span>}
        {tooltipText && (
          <Tooltip placement="right" text={tooltipText}>
            <QuestionMarkIcon />
          </Tooltip>
        )}
      </button>
      <div className={classes["input-container"]}>
        <button
          type="button"
          className={classes.input}
          onClick={() => setIsDropdownShown((isShown) => !isShown)}
          disabled={disabled}
        >
          {selected ? (
            <span className={classes["selected-item"]}>{selected.label}</span>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronDownIcon
            className={classNames(
              classes["dropdown-icon"],
              isDropdownShown && classes["dropdown-icon--open"]
            )}
          />
        </button>

        {isDropdownShown &&
          (items && items.length > 0 ? (
            <ul className={classes.dropdown}>
              {items.map((item, index) => (
                <li
                  key={index}
                  className={classNames(
                    classes.dropdown__item,
                    selected &&
                      selected.value === item.value &&
                      classes["dropdown__item--active"]
                  )}
                >
                  <button type="button" onClick={() => handleSelectItem(item)}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul
              className={classNames(
                classes.dropdown,
                classes["dropdown--no-item"]
              )}
            >
              <li className={classes.dropdown__item}>No items found!</li>
            </ul>
          ))}
      </div>
      <div className={classes["error-container"]}>{error}</div>
    </div>
  )
}
