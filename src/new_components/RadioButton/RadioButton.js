import { useContext } from "react"
import classNames from "classnames"
import classes from "./RadioButton.module.scss"
import { RadioGroupContext } from "new_components/RadioGroup/RadioGroup"

const useRadioContext = () => {
  const context = useContext(RadioGroupContext)
  if (!context) {
    throw new Error("RadioButton must be used inside of <RadioGroup />")
  }
  return context
}

export const RadioButton = ({
  name,
  label,
  default: defaultChecked,
  value,
  size = "medium",
}) => {
  const inputRandomId = `radio-button-${Math.random()}`
  const { selected, onChange } = useRadioContext(RadioGroupContext)

  return (
    <label htmlFor={inputRandomId} className={classes.label}>
      <input
        type="radio"
        id={inputRandomId}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        defaultChecked={defaultChecked}
        checked={selected === value}
        className={classNames(
          selected === value ? classes.selected : classes.unSelected,
          size === "medium" ? classes.medium : classes.small
        )}
      />
      {label}
    </label>
  )
}
