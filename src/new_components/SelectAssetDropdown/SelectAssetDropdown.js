import { useState, useEffect, useRef } from "react"
import classNames from "classnames"
import InfiniteScroll from "react-infinite-scroll-component"
import loadingBubbleAnimation from "new_assets/loadings/bubble.svg"
import { SelectAssetOption } from "./SelectAssetOption/SelectAssetOption"
import classes from "./SelectAssetDropdown.module.scss"
import { formatURL } from "utils/helper"

export const SelectAssetDropdown = ({
  className,
  required,
  error,
  labelAccent,
  assets = [],
  onChange = () => {},
  value,
  hasMore,
  fetchMoreAssets,
  disabled,
  onSearchAsset,
}) => {
  const inputRandomId = `select-asset-drop-down-${Math.random()}`
  const inputRef = useRef(false)
  const mounted = useRef(false)

  const [isDropdownShown, setIsDropdownShown] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [selectedAsset, setSelectedAsset] = useState({
    isShown: false,
    data: {},
  })
  const [loadingFailed, setLoadingFailed] = useState(false)
  const [imgLoading, setImgLoading] = useState(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    setLoadingFailed(false)
  }, [selectedAsset])

  useEffect(() => {
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOnDocument)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOnDocument)
    }
  })

  useEffect(() => {
    if (value) {
      const format = async () => {
        const url = await formatURL(value.metadata.image)
        if (mounted.current) {
          setImgLoading(true)
          setSelectedAsset({ isShown: true, data: { ...value, url } })
        }
      }

      format()
    }
  }, [value])

  const handleSearchValueChange = (searchKey) => {
    setSearchValue(searchKey)
    onSearchAsset(searchKey)
  }

  const handleClickOnDocument = (e) => {
    if (!e.target.closest(`.${classes["input-container"]}`)) {
      if (selectedAsset.data?.img) {
        setImgLoading(true)
        setSelectedAsset({ isShown: true, data: selectedAsset.data })
      }

      setIsDropdownShown(false)
    }
  }

  const handleShowInputAndDropdown = () => {
    if (!disabled) {
      // setSelectedAsset({ isShown: false, data: selectedAsset.data })
      setIsDropdownShown(true)
      setTimeout(() => {
        inputRef.current.focus()
      }, 50)
    }
  }

  const handleSelectAsset = (asset, url) => {
    if (!disabled) {
      setImgLoading(true)
      setSelectedAsset({ isShown: true, data: { ...asset, url } })
      onChange({ ...asset, url })
      setIsDropdownShown(false)
    }
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
      <label
        htmlFor={inputRandomId}
        className={classNames(
          classes.label,
          labelAccent && classes["label-accent-pink"]
        )}
      >
        NFT {required && <span style={{ color: "var(--color-pink)" }}>*</span>}
      </label>
      <div className={classes["input-container"]}>
        <input
          className={classNames(
            classes.input,
            !isDropdownShown &&
              selectedAsset.isShown &&
              classes["input--hidden"]
          )}
          type="text"
          onChange={(e) => handleSearchValueChange(e.target.value)}
          placeholder="Start typing to search"
          value={searchValue}
          id={inputRandomId}
          onFocus={() => setIsDropdownShown(true)}
          ref={inputRef}
        />

        {!isDropdownShown && selectedAsset.isShown && (
          <div
            className={classes["selected-asset"]}
            onClick={handleShowInputAndDropdown}
          >
            {imgLoading && (
              <div className={classes.loadingImgContainer}>
                <img src={loadingBubbleAnimation} alt="loading" />
              </div>
            )}
            {loadingFailed ? (
              <video
                preload="auto"
                loop
                autoPlay
                muted
                onLoadStart={() => setImgLoading(false)}
                onError={() => setImgLoading(false)}
                className={classNames(imgLoading && classes.hide_img)}
              >
                <source
                  src={`${selectedAsset.data?.url}#t=0.1`}
                  type="video/mp4"
                />
              </video>
            ) : (
              <img
                src={selectedAsset.data?.url}
                alt="nft-asset"
                onError={() => setLoadingFailed(true)}
                onLoad={() => setImgLoading(false)}
                className={classNames(imgLoading && classes.hide_img)}
              />
            )}
            <span>{selectedAsset.data?.metadata?.name}</span>
          </div>
        )}

        {isDropdownShown &&
          (assets && assets.length > 0 ? (
            <ul className={classes.dropdown} id="owned-asset-list">
              <InfiniteScroll
                dataLength={assets.length}
                next={() =>
                  fetchMoreAssets(
                    searchValue,
                    assets,
                    assets.length,
                    assets.length + 9
                  )
                }
                hasMore={hasMore}
                loader={<LoadingIndicator />}
                scrollableTarget="owned-asset-list"
              >
                {assets.map((e, index) => (
                  <SelectAssetOption
                    key={`${index}-${e.token.id}`}
                    name={e.metadata.name}
                    image={e.metadata.image}
                    selected={e.token.id === selectedAsset.data?.token?.id}
                    onClick={(img) => handleSelectAsset(e, img)}
                  />
                ))}
              </InfiniteScroll>
            </ul>
          ) : (
            <ul
              className={classNames(
                classes.dropdown,
                classes["dropdown--no-item"]
              )}
            >
              <li className={classes.dropdown__item}>No assets found!</li>
            </ul>
          ))}
      </div>
      <div className={classes["error-container"]}>{error}</div>
    </div>
  )
}

const LoadingIndicator = () => (
  <li className={classes.loadingList}>Loading...</li>
)
