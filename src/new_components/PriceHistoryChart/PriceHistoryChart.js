import { useRef, useLayoutEffect } from "react"
import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"
import classes from "./PriceHistoryChart.module.scss"
import { useSelector } from "react-redux"

export const PriceHistoryChart = () => {
  const priceHistoryTransactions = useSelector(
    (state) => state.indexer.priceHistoryTransactions
  )
  const chart = useRef(null)

  useLayoutEffect(() => {
    if (priceHistoryTransactions.length === 0) return
    const x = am4core.create("chartdiv", am4charts.XYChart)
    x.logo.visible = false
    if (priceHistoryTransactions && priceHistoryTransactions.length > 0) {
      priceHistoryTransactions.forEach((tx) => {
        const date = new Date(tx.round)
        x.data.push({
          date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          value: tx.price / 100000,
        })
      })
    }

    // Create axes
    const dateAxis = x.xAxes.push(new am4charts.DateAxis())
    dateAxis.renderer.grid.template.location = 0
    dateAxis.renderer.minGridDistance = 30
    dateAxis.renderer.labels.template.fill = am4core.color("#66668B")
    dateAxis.renderer.labels.template.fontSize = 11

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
      series.tooltipText = "{dateX}: [b]{valueY}[/]"
      series.strokeWidth = 2
      series.stroke = am4core.color("var(--color-pink)")
      series.tooltip.background.fill = am4core.color("var(--color-pink)")
      series.tooltip.getFillFromObject = false
      series.tooltip.autoTextColor = false
      series.tooltip.label.fill = am4core.color("#fff")
      series.tooltip.background.strokeWidth = 0
      series.tooltip.background.cornerRadius = 3
      const tooltipShadow = series.tooltip.background.filters.getIndex(0)
      tooltipShadow.dx = 0
      tooltipShadow.dy = 0
      tooltipShadow.blur = 5
      tooltipShadow.color = am4core.color("var(--color-light-blue)")

      const bullet = series.bullets.push(new am4charts.CircleBullet())
      bullet.circle.stroke = am4core.color("#fff")
      bullet.circle.strokeWidth = 2
      bullet.circle.fill = am4core.color("var(--color-pink)")

      return series
    }

    createSeries("value", "Asset price")

    x.cursor = new am4charts.XYCursor()

    chart.current = x

    return () => {
      x.dispose()
    }
  }, [priceHistoryTransactions])

  return (
    <section className={classes.container}>
      <h2 className={classes.title}>Price History</h2>
      {priceHistoryTransactions.length > 0 ? (
        <div id="chartdiv" style={{ width: "100%", height: "240px" }} />
      ) : (
        <div
          style={{
            width: "100%",
            height: "240px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <span className={classes["blue-glow-text"]}>No price history</span>
        </div>
      )}
    </section>
  )
}
