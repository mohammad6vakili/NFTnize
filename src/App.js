/* eslint-disable react-hooks/rules-of-hooks */
// import React, { useEffect } from "react"
import React from "react"
import { useSelector } from "react-redux"
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"
import * as am4core from "@amcharts/amcharts4/core"
// eslint-disable-next-line camelcase
import am4themes_animated from "@amcharts/amcharts4/themes/animated"
// eslint-disable-next-line camelcase
import am4themes_dark from "@amcharts/amcharts4/themes/dark"

import headerLogo from "./new_pages/landing/page-assets/new-logo.png"
import RouteWrapper from "./new_components/RouteWrapper"
import loadingSvg from "./assets/lottie/appLoading.svg"
import { ROUTES } from "./routings"
// import useLocalStorage from "use-local-storage"

am4core.useTheme(am4themes_animated)
am4core.useTheme(am4themes_dark)

function App() {
  const { authenticated } = useSelector((state) => state.accessCode)
  const { authChecking } = useSelector((state) => state.accessCode)
  const { rootTheme } = useSelector((state) => state.application)

  if (authChecking) {
    return <></>
  }

  return (
    <div data-theme={rootTheme}>
      <BrowserRouter>
        <React.Suspense
          fallback={
            <div
              style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={loadingSvg} alt="loading" />
              <img
                style={{ maxWidth: "300px" }}
                src={headerLogo}
                alt="NFTnize"
              />
            </div>
          }
        >
          <Switch>
            {ROUTES.map((route) => {
              if (route.authRequired && !authenticated) {
                return (
                  <Route
                    key={route.title}
                    path={route.path}
                    exact
                    render={() => <Redirect to="/access-code" />}
                  />
                )
              } else {
                return (
                  <Route
                    key={route.title}
                    path={route.path}
                    exact
                    render={(props) => (
                      <RouteWrapper route={route} {...props} />
                    )}
                  />
                )
              }
            })}
          </Switch>
        </React.Suspense>
      </BrowserRouter>
    </div>
  )
}

export default App
