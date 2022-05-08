import classes from "./Traits.module.scss"
import { useParams } from "react-router-dom"
import { calculate } from "utils/helper"

export const Traits = ({ data }) => {
  const { id } = useParams()
  const totalLength = data.length
  let selectedAssetTraits = []
  if (data) {
    selectedAssetTraits = data.find((li) => li.id.$numberLong === id)
  }
  return (
    <section className={classes.container}>
      <ul className={classes.grid}>
        {selectedAssetTraits &&
          selectedAssetTraits.attributes &&
          selectedAssetTraits.attributes.map((trait, idx) => (
            <li className={classes.trait} key={idx}>
              <span className={classes["trait-title"]}>{trait.trait_type}</span>
              <span className={classes["trait-value"]}>{trait.value}</span>
              <span className={classes["trait-statics"]}>
                {calculate(data, trait, totalLength)}% have this trait
              </span>

              <div className={classes["trait-progress-bar"]}>
                <div
                  className={classes["trait-progress"]}
                  style={{ width: `${calculate(data, trait, totalLength)}%` }}
                />
              </div>
            </li>
          ))}
      </ul>
    </section>
  )
}
