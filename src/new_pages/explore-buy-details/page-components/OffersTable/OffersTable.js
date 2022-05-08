import classes from "./OffersTable.module.scss"
import { Table } from "new_components"
import { useEffect, useState } from "react"

export const OffersTable = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    setTimeout(() => {
      if (mounted) setLoading(false)
    }, 5000)

    return () => {
      mounted = false
    }
  }, [])

  const rows = []

  for (let i = 0; i < 10; i++) {
    rows.push(["000.2 ETH", "SomeOne", "SomeOne", "3 hours ago"])
  }

  return (
    <section className={classes.container}>
      <h2 className={classes.title}>Offers</h2>

      {rows.length > 0 ? (
        <div className={classes["table-container"]}>
          <Table
            header={["Price", "From", "To", "Date"]}
            rows={rows}
            loading={loading}
          />
        </div>
      ) : (
        <div className={classes["no-items"]}>No offers</div>
      )}
    </section>
  )
}
