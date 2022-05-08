import classes from "./Search.module.scss"
import { TextField, Button } from "components"
import { ReactComponent as SearchIcon } from "assets/icons/search.svg"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { asyncLookupAccountByID } from "redux/indexer/indexer-slice"

export const Search = () => {
  const dispatch = useDispatch()
  const [inputText, setInputText] = useState()
  const handleChange = (e) => {
    setInputText(e.target.value)
  }
  const handleSearch = () => {
    if (inputText) {
      dispatch(asyncLookupAccountByID({ address: inputText }))
    }
  }
  return (
    <div className={classes.search}>
      <SearchIcon />
      <TextField
        placeholder="Address..."
        className={classes.input}
        onChange={handleChange}
      />
      <Button size="small" onClick={handleSearch}>
        Search
      </Button>
    </div>
  )
}
