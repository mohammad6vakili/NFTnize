import classes from "./Search.module.scss"
import { TextField, Button } from "components"
import { ReactComponent as SearchIcon } from "assets/icons/search.svg"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { asyncGetAssets } from "redux/indexer/indexer-slice"
import { useDebouncedCallback } from "use-debounce"

export const Search = ({ setSearchStatus }) => {
  const dispatch = useDispatch()
  const [inputText, setInputText] = useState()

  const debounced = useDebouncedCallback(
    // function
    (value) => {
      setInputText(value)
    },
    // delay in ms
    1000
  )
  const handleSearch = () => {
    if (inputText) {
      setSearchStatus(true)
    } else {
      setSearchStatus(false)
    }
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(inputText)) {
      dispatch(asyncGetAssets({ collectionIndex: inputText }))
    } else {
      dispatch(asyncGetAssets({ collectionName: inputText }))
    }
  }
  return (
    <section className={classes.container}>
      <h2>Tracking the sales and prices of NFTs</h2>
      <span>on the Algorand blockchain</span>
      <div className={classes.search}>
        <SearchIcon />
        <TextField
          placeholder="Search for a collection name, an asset ID..."
          className={classes.input}
          onChange={(e) => debounced(e.target.value)}
          onEnterPress={handleSearch}
        />
        <Button size="small" onClick={handleSearch}>
          Search
        </Button>
      </div>
    </section>
  )
}
