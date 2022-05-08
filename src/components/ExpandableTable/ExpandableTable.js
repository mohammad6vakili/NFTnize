import classes from "./ExpandableTable.module.scss"
import { ReactComponent as ArrowDownIcon } from "assets/icons/arrow-down.svg"
import AlgorandLogo from "assets/logos/algorand-logo-400x400.jpg"

export const ExpandableTable = () => {
  const headerItems = ["Price", "Date/Time", "Name", "Receiver"]

  const tableItems = []

  for (let i = 0; i < 7; i++) {
    tableItems.push({
      id: i,
      cols: [
        {
          logo: "https://unsplash.it/50/50",
          text: "5",
        },
        {
          text: "11/10/2021, 2:30 AM",
        },
        {
          text: "Stupid Face #40",
        },
        {
          text: "B7MRV...2JICA",
        },
      ],
      extra: {
        img: "https://unsplash.it/190/190",
        title: "Stupid Face #40",
        number: 5,
        details: [
          [
            {
              label: "Asset ID",
              value: "403263614",
              link: true,
              to: "/",
            },
            {
              label: "Unit Name",
              value: "November 10, 2021, 2:30 AM GMT+3:30",
            },
          ],
          [
            {
              label: "Group",
              value: "m3YHNe...mmyZE=",
              link: true,
              to: "/",
            },
            {
              label: "Group",
              value: "m3YHNe...mmyZE=",
              link: true,
              to: "/",
            },
            {
              label: "Group",
              value: "m3YHNe...mmyZE=",
              link: true,
              to: "/",
            },
            {
              label: "Group",
              value: "m3YHNe...mmyZE=",
              link: true,
              to: "/",
            },
          ],
        ],
      },
    })
  }

  return (
    <section className={classes.table}>
      <div className={classes.header}>
        {headerItems.map((item, idx) => (
          <div key={idx}>{item}</div>
        ))}
      </div>

      {tableItems.map((record, idx) => (
        <div className={classes.row} key={idx}>
          <input type="checkbox" id={record.id} />
          <label className={classes.content} htmlFor={record.id} role="table">
            {record.cols.map((col) => (
              <div className={classes.col} key={col.text}>
                {col.logo && (
                  <img src={col.logo} alt="" className={classes.avatar} />
                )}
                {col.text}
              </div>
            ))}

            <div className={classes.col}>
              <button className={classes.action} type="button">
                <ArrowDownIcon />
              </button>
            </div>
          </label>

          {record.extra && (
            <div className={classes.extra}>
              {/* dont delete this div */}
              <div>
                <img
                  src={record.extra.img}
                  alt=""
                  className={classes["extra-img"]}
                />

                <div className={classes["extra-info"]}>
                  <h5>{record.extra.title}</h5>
                  <div>
                    <img src={AlgorandLogo} alt="algorand logo" />
                    {record.extra.number}
                  </div>
                </div>

                {record.extra.details.map((list, key) => (
                  <ul key={key} className={classes["extra-details"]}>
                    {list.map((detail, index) => (
                      <li key={index}>
                        <span>{detail.label}:</span>

                        {detail.link ? (
                          <a href={detail.to}>{detail.value}</a>
                        ) : (
                          <span>{detail.value}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}
