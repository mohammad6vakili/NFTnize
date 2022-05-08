import { useRef, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import classNames from "classnames"
import { collectIndexesFromTraitsData } from "utils/helper"
import classes from "./SideFilter.module.scss"
import { Collapse } from "react-collapse"
import {
  setFilterTraitValues,
  setCollapseStates,
  setCheckedValues,
} from "redux/collection/collection-slice"
import { ReactComponent as ChevronIcon } from "new_assets/icons/chevron-down.svg"

export const SideFilter = ({ data, className }) => {
  const dispatch = useDispatch()
  const formRef = useRef(null)

  const selectedCollectionTraitsData = useSelector(
    (state) => state.collection.selectedCollectionTraits
  )
  const collpaseStates = useSelector((state) => state.collection.collpaseStates)

  const [collapses, setCollapses] = useState({})
  const [isMobileFilterExpanded, setIsMobileFilterExpanded] = useState(
    () => window.innerWidth > 960
  )

  useEffect(() => {
    // Bind the event listener
    window.addEventListener("resize", handleResize)
    return () => {
      // Unbind the event listener on clean up
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleResize = () => {
    if (window.innerWidth > 960) {
      setIsMobileFilterExpanded(true)
    }
  }

  useEffect(() => {
    // create state based on data for collapse component
    const states = {}
    Object.keys(data).forEach((listKey) => {
      states[listKey] = false
    })
    setCollapses(collpaseStates)
  }, [data])

  const handleFormChanges = () => {
    const checked = []
    ;[...formRef.current.elements].forEach((checkbox) => {
      if (checkbox.checked) {
        // fined parent
        const listKey = checkbox.id.split("-")[0]
        const itemKey = checkbox.id.split("-")[1]
        checked.push({
          trait_type: listKey,
          value: itemKey,
        })
      }
    })
    const result = collectIndexesFromTraitsData(
      checked,
      selectedCollectionTraitsData
    )
    dispatch(setCollapseStates(collapses))
    dispatch(setFilterTraitValues(result))
    dispatch(setCheckedValues(checked))
  }

  const handleExpandFilter = (listKey) => {
    const collapsesCopy = { ...collapses }
    collapsesCopy[listKey] = !collapsesCopy[listKey]

    setCollapses(collapsesCopy)
  }

  const handleToggleMobileFilter = () => {
    if (window.innerWidth < 960) {
      setIsMobileFilterExpanded((isExpanded) => !isExpanded)
    }
  }

  return (
    <aside className={classNames(className)}>
      <section className={classes.filters}>
        <h2
          className={classNames(
            classes.title,
            isMobileFilterExpanded && classes["title--open"]
          )}
        >
          <button type="button" onClick={handleToggleMobileFilter}>
            Filters
            <ChevronIcon />
          </button>
        </h2>

        <Collapse isOpened={isMobileFilterExpanded}>
          <form ref={formRef}>
            {Object.keys(data).map((listKey, key) => (
              <div className={classes.filter} key={key}>
                <h3
                  className={classNames(
                    classes.filter__title,
                    collapses[listKey] && classes["filter__title--open"]
                  )}
                >
                  <button
                    type="button"
                    onClick={() => handleExpandFilter(listKey)}
                  >
                    {listKey}
                    <ChevronIcon />
                  </button>
                </h3>

                <Collapse isOpened={collapses[listKey]}>
                  <ul className={classes.filter__list}>
                    {data[listKey].map((item, idx) => {
                      const uniqueId = `${listKey}-${item.key}-${item.value}`
                      return (
                        <li className={classes.filter__item} key={idx}>
                          <label htmlFor={uniqueId}>
                            <input
                              id={uniqueId}
                              type="checkbox"
                              value={item.value}
                              onChange={() => handleFormChanges()}
                            />
                            {item.key}
                          </label>
                          <span>{item.value}</span>
                        </li>
                      )
                    })}
                  </ul>
                </Collapse>
              </div>
            ))}
          </form>
        </Collapse>
      </section>
    </aside>
  )
}
