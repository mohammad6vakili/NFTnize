import { useTitle } from "react-use"

const RouteWrapper = ({
  handleThemeSwitch,
  route: { main: Main, title },
  ...routeProps
}) => {
  window.analytics.page()
  useTitle(`${title} | NFTnize`)
  return (
    <>
      <Main {...routeProps} />
    </>
  )
}

export default RouteWrapper
