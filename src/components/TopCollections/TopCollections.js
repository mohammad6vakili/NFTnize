import { Collection, BlockTitle } from "components"
import classes from "./TopCollections.module.scss"

export const TopCollections = ({ className }) => {
  const collections = []

  for (let i = 0; i < 4; i += 1) {
    const col = []

    if (i === 0) col.push("7 Day volume")
    if (i === 1) col.push("By Total volume")
    if (i === 2) col.push("By 7 Day Average Price")
    if (i === 3) col.push("By Owner Count")

    for (let j = 0; j < 10; j += 1) {
      col.push({
        id: `id${j}`,
        owner: {
          name: "John Doe",
          avatar: "https://unsplash.it/100/100",
        },
        title: "Awesome collection",
        price: "2.2324 ALGO",
      })
    }

    collections.push(col)
  }

  return (
    <BlockTitle className={className} title="Top Collections">
      <div className={classes.grid}>
        {collections.map((col, index) => (
          <div key={index} className={classes.col}>
            <span className={classes["col-title"]}>{col[0]}</span>
            <div className={classes["collections-container"]}>
              {col.slice(1).map((collection, idx) => (
                <div key={idx} className={classes.collection}>
                  <Collection
                    {...collection}
                    type="compact-price"
                    key={collection.id}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </BlockTitle>
  )
}
