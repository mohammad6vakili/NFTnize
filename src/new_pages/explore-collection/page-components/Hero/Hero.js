import { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import { useDebouncedCallback } from "use-debounce"
import { TextField, Breadcrumb } from "new_components"
import { ReactComponent as MagnifyIcon } from "new_assets/icons/magnify.svg"
import { ReactComponent as WaveShape } from "new_assets/shapes/collection-wave.svg"
import classes from "./Hero.module.scss"

export const Hero = () => {
  const location = useLocation()
  const history = useHistory()
  const [searchKey, setSearchKey] = useState("")

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q")
    setSearchKey(query)
  }, [location.search])

  const debounced = useDebouncedCallback((value) => {
    if (value) {
      history.push({
        pathname: "/markets",
        search: `q=${value}`,
      })
    } else {
      history.push({
        pathname: "/markets",
        search: "",
      })
    }
  }, 500)

  return (
    <section className={classes.container}>
      <div className={classes.content}>
        <h1 className={classes.title}>Collections</h1>
        <Breadcrumb
          paths={[
            {
              label: "Home",
              to: "/",
            },
            {
              label: "Collections",
            },
          ]}
          className={classes.breadcrumb}
        />
        <TextField
          icon={<MagnifyIcon />}
          placeholder="Search Collections"
          className={classes["search-input"]}
          onChange={(e) => debounced(e.target.value)}
          value={searchKey}
        />
      </div>

      <div className={classes.wave}>
        <div />
        <WaveShape />
      </div>
    </section>
  )
}
