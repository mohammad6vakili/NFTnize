import classes from "./Table.module.scss"
import { TableLoading } from "new_components"

export const Table = ({ header, rows, loading }) =>
  loading ? (
    <TableLoading />
  ) : (
    <table className={classes.table}>
      <thead>
        <tr>
          {header.map((head, index) => (
            <th key={index}>{head}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {rows.map((row, ind) => (
          <tr key={ind}>
            {row.map((col, index) => (
              <td key={index}>{col}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
