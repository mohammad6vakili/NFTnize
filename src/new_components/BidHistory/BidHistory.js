import { useRef, useLayoutEffect } from "react"
import moment from "moment"
import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"
import { Icon } from "@blueprintjs/core"

import { Button } from "../../components"
import { config } from "../../utils/config"
import { formatAddress } from "../../utils/helper"
import classes from "./BidHistory.module.scss"
import { useSelector } from "react-redux"
import { Tooltip } from "new_components"

const header = ["Transaction ID", "Date/Time", "Sender", "Price"]

export const BidHistory = ({ items }) => {
  const { accts } = useSelector((state) => state.wallet)
  const chart = useRef(null)

  useLayoutEffect(() => {
    if (items.length === 0) return
    const x = am4core.create("chartdiv", am4charts.XYChart)
    x.logo.visible = false
    if (items && items.length > 0) {
      items.forEach((tx) => {
        const date = new Date(tx.time)
        x.data.push({
          date: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes()
          ),
          value: tx.amount,
        })
      })
    }

    // Create axes
    const dateAxis = x.xAxes.push(new am4charts.DateAxis())
    dateAxis.renderer.grid.template.location = 0
    dateAxis.renderer.minGridDistance = 30
    dateAxis.renderer.labels.template.fill = am4core.color("#66668B")
    dateAxis.renderer.labels.template.fontSize = 11
    dateAxis.baseInterval = {
      timeUnit: "minute",
      count: 1,
    }

    const xAxisTooltip = dateAxis.tooltip
    xAxisTooltip.background.fill = am4core.color("#394b59")
    xAxisTooltip.background.strokeWidth = 0
    xAxisTooltip.background.cornerRadius = 3
    xAxisTooltip.background.pointerLength = 0
    xAxisTooltip.dy = 5
    xAxisTooltip.label.fill = am4core.color("var(--color-light-blue)")
    xAxisTooltip.background.filters.push(new am4core.DropShadowFilter())
    const xAxisTooltipShadow = xAxisTooltip.background.filters.getIndex(0)
    xAxisTooltipShadow.dx = 0
    xAxisTooltipShadow.dy = 0
    xAxisTooltipShadow.blur = 4
    xAxisTooltipShadow.color = am4core.color("var(--color-light-blue)")

    const valueAxis = x.yAxes.push(new am4charts.ValueAxis())
    valueAxis.renderer.labels.template.fill = am4core.color("#66668B")
    valueAxis.renderer.labels.template.fontSize = 11
    const yAxisTooltip = valueAxis.tooltip
    yAxisTooltip.background.fill = am4core.color("#394b59")
    yAxisTooltip.background.strokeWidth = 0
    yAxisTooltip.background.cornerRadius = 4
    yAxisTooltip.background.pointerLength = 0
    yAxisTooltip.background.filters.push(new am4core.DropShadowFilter())
    yAxisTooltip.dy = 5
    yAxisTooltip.label.fill = am4core.color("var(--color-light-blue)")
    const yAxisTooltipShadow = yAxisTooltip.background.filters.getIndex(0)
    yAxisTooltipShadow.dx = 0
    yAxisTooltipShadow.dy = 0
    yAxisTooltipShadow.blur = 4
    yAxisTooltipShadow.color = am4core.color("var(--color-light-blue)")

    // Create series
    function createSeries(field, name) {
      const series = x.series.push(new am4charts.LineSeries())
      const shadow = series.filters.push(new am4core.DropShadowFilter())
      shadow.dx = 0
      shadow.dy = 0
      shadow.opacity = 1
      shadow.color = am4core.color("var(--color-pink)")
      series.smoothing = "monotoneX"
      series.dataFields.valueY = field
      series.dataFields.dateX = "date"
      series.name = name
      series.strokeWidth = 2
      series.stroke = am4core.color("var(--color-pink)")
      series.tooltip.background.fill = am4core.color("var(--color-pink)")
      series.tooltip.getFillFromObject = false
      series.tooltip.autoTextColor = false
      series.tooltip.label.fill = am4core.color("#fff")
      series.tooltip.background.strokeWidth = 0
      series.tooltip.background.cornerRadius = 3
      series.tooltipHTML = `
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 11.998H10.1186L8.8968 7.45979L6.26984 11.9985H4.16949L8.22974 4.97302L7.57627 2.53401L2.10136 12H0L6.93841 0H8.77798L9.58349 2.9814H11.4815L10.1856 5.2314L12 11.998Z" fill="white"/>
        </svg>
        {value}
      `
      const tooltipShadow = series.tooltip.background.filters.getIndex(0)
      tooltipShadow.dx = 0
      tooltipShadow.dy = 0
      tooltipShadow.blur = 5
      tooltipShadow.color = am4core.color("var(--color-light-blue)")

      const bullet = series.bullets.push(new am4charts.CircleBullet())
      bullet.circle.stroke = am4core.color("#fff")
      bullet.circle.fill = am4core.color("var(--color-pink)")
      bullet.circle.strokeWidth = 2

      return series
    }

    createSeries("value", "Asset price")

    x.cursor = new am4charts.XYCursor()

    chart.current = x

    return () => {
      x.dispose()
    }
  }, [items])

  return (
    <section className={classes.container}>
      <h2 className={classes.title}>Bid History</h2>

      {items.length > 0 ? (
        <div id="chartdiv" style={{ width: "100%", height: "240px" }} />
      ) : (
        <div className={classes["no-bid"]}>No bid history</div>
      )}
      <div className={classes["table-container"]}>
        <table className={classes.table}>
          <thead>
            <tr>
              {header.map((head, index) => (
                <th key={index}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((row, key) => (
              <tr key={key}>
                <td className={classes.bid}>
                  <Button
                    type="anchor-link"
                    to={`${config.blockExplorer}/tx/${row.txid}`}
                  >
                    <span className={classes["bid-link"]}>
                      {formatAddress(row.txid)}
                      <Icon
                        icon="share"
                        size={12}
                        className={classes["share-icon"]}
                      />
                    </span>
                  </Button>
                </td>
                <td>{moment(row.time).format("M/DD/YYYY, HH:mm A")}</td>
                <td>
                  <Button
                    type="anchor-link"
                    to={`${config.blockExplorer}/address/${row.sender}`}
                  >
                    <span className={classes["bid-link"]}>
                      {formatAddress(row.sender)}
                      <Icon
                        icon="share"
                        size={12}
                        className={classes["share-icon"]}
                      />
                    </span>
                  </Button>
                </td>
                <td className={classes.price}>
                  {row.amount}
                  {accts.includes(row.sender) && (
                    <Tooltip
                      placement="top"
                      text={
                        key === 0
                          ? "You are the highest bidder."
                          : "Your previous bid."
                      }
                    >
                      <div className={classes.indicator} />
                    </Tooltip>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
