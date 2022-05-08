import { Button } from "@blueprintjs/core"
import { Breadcrumb } from "new_components"
import classes from "./CreatorInfo.module.scss"
import { formatCreator, formatAddress } from "utils/helper"
import { ReactComponent as WaveShape } from "new_assets/shapes/collection-wave.svg"

export const CreatorInfo = ({
  collection,
  ownerAddress,
  isOwnerAddress,
  onFilterTypeChange,
  filterType,
  filterTypes,
}) => (
  <section className={classes.container}>
    <div className={classes.content}>
      {!isOwnerAddress ? (
        <>
          <h1 className={classes.title}>
            {formatCreator(collection?.creator)}
          </h1>
          <Breadcrumb
            paths={[
              {
                label: "Home",
                to: "/",
              },
              {
                label: "Creators",
                to: "/markets",
              },
              {
                label: formatAddress(ownerAddress),
              },
            ]}
            className={classes.breadcrumb}
          />
        </>
      ) : (
        <>
          <h1 className={classes.title}>My Wallet</h1>
          <TypeFileter
            onFilterTypeChange={onFilterTypeChange}
            filterType={filterType}
            filterTypes={filterTypes}
          />
        </>
      )}
      {/* <TextField
        icon={<MagnifyIcon />}
        placeholder="Search Collections"
        className={classes["search-input"]}
      /> */}
    </div>

    <div className={classes.wave}>
      <div />
      <WaveShape />
    </div>
  </section>
)

const TypeFileter = ({ onFilterTypeChange, filterType, filterTypes }) => {
  const handleClick = (type) => {
    onFilterTypeChange(type)
  }

  return (
    <div className={classes.creator_types}>
      <Button
        onClick={() => handleClick(filterTypes.created)}
        minimal
        outlined
        intent="success"
        text="Created"
        className={`${classes.creator_type_blue} ${
          filterType === filterTypes.created ? classes.blue_active : ""
        }`}
        type="button"
      />
      <Button
        onClick={() => handleClick(filterTypes.owned)}
        minimal
        outlined
        intent="danger"
        text="Owned"
        className={`${classes.creator_type_pink} ${
          filterType === filterTypes.owned ? classes.pink_active : ""
        }`}
        type="button"
      />
      <Button
        onClick={() => handleClick(filterTypes.optIns)}
        minimal
        outlined
        intent="success"
        text="Opt Ins"
        className={`${classes.creator_type_blue} ${
          filterType === filterTypes.optIns ? classes.blue_active : ""
        }`}
        type="button"
      />
      <Button
        onClick={() => handleClick(filterTypes.myBids)}
        minimal
        outlined
        intent="danger"
        text="My Bids"
        className={`${classes.creator_type_pink} ${
          filterType === filterTypes.myBids ? classes.pink_active : ""
        }`}
        type="button"
      />
      <Button
        onClick={() => handleClick(filterTypes.myListings)}
        minimal
        outlined
        intent="success"
        text="My Listings"
        className={`${classes.creator_type_blue} ${
          filterType === filterTypes.myListings ? classes.blue_active : ""
        }`}
        type="button"
      />
    </div>
  )
}
