import { Button } from "components"
import classes from "./Table.module.scss"
import { formatPrice } from "utils/helper"
import { config } from "../../utils/config"

export const Table = ({ header, items, itemPrices }) => (
  <div className={classes["table-container"]}>
    <table className={classes.table}>
      <thead>
        <tr>
          {header.map((item, key) => (
            <th key={key}>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {items &&
          items.length > 0 &&
          items.map((row, key) => (
            <tr key={key}>
              <td>
                <Button
                  type="anchor-link"
                  to={`${config.blockExplorer}/tx/${row.id}`}
                >
                  {`${row.id.substr(0, 5)}....${row.id.substr(
                    row.id.length - 5,
                    row.id.length - 1
                  )}`}
                </Button>
              </td>
              <td>{new Date(row["round-time"] * 1000).toString()}</td>
              <td>
                <Button
                  type="anchor-link"
                  to={`${config.blockExplorer}/address/${row.sender}`}
                >
                  {`${row.sender.substr(0, 5)}....${row.sender.substr(
                    row.sender.length - 5,
                    row.sender.length - 1
                  )}`}
                </Button>
              </td>
              <td>
                <Button
                  type="anchor-link"
                  to={`${config.blockExplorer}/address/${row["asset-transfer-transaction"].receiver}`}
                >
                  {`${row["asset-transfer-transaction"].receiver.substr(
                    0,
                    5
                  )}....${row["asset-transfer-transaction"].receiver.substr(
                    row["asset-transfer-transaction"].receiver.length - 5,
                    row["asset-transfer-transaction"].receiver.length - 1
                  )}`}
                </Button>
              </td>
              <td>{row["asset-transfer-transaction"].amount}</td>
              <td>{itemPrices && formatPrice(itemPrices, row)}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
)
