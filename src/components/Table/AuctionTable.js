import { Button } from "components"
import classes from "./Table.module.scss"
import { config } from "../../utils/config"

export const AuctionTable = ({ header, items }) => (
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
                  to={`${config.blockExplorer}/tx/${row.txid}`}
                >
                  {`${row.txid.substr(0, 5)}....${row.txid.substr(
                    row.txid.length - 5,
                    row.txid.length - 1
                  )}`}
                </Button>
              </td>
              {/* <td>{new Date(row["round-time"] * 1000).toString()}</td> */}
              <td>{row.time}</td>
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
              {/* <td>
                <Button
                  type="anchor-link"
                  to={`${config.blockExplorer}/address/${row.receiver}`}
                >
                  {`${row.receiver.substr(0, 5)}....${row.receiver.substr(
                    row.receiver.length - 5,
                    row.receiver.length - 1
                  )}`}
                </Button>
              </td> */}
              <td>{row.amount}</td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
)
