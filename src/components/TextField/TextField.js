import classNames from "classnames"
import classes from "./TextField.module.scss"

export const TextField = ({
  placeholder,
  value,
  onChange = () => {},
  onEnterPress = () => {},
  className,
}) => {
  const handleKeyDown = (e) => {
    if (e.code === "Enter" && onEnterPress) {
      onEnterPress(e)
    }
  }

  return (
    <input
      className={classNames(classes.input, className)}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e)}
      onKeyDown={handleKeyDown}
    />
  )
}
