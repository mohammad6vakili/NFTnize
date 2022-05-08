import React from "react"
import ReactDOM from "react-dom"
import { Web3ReactProvider } from "@web3-react/core"
import { WalletConnectionProvider } from "contexts/walletContext"
import Web3 from "web3"
import { Provider } from "react-redux"
import App from "./App"
import store from "./redux/store"
import "antd/dist/antd.css"

import "new_styles/main.scss"
import "react-responsive-carousel/lib/styles/carousel.min.css"

function getLibrary(provider) {
  return new Web3(provider)
}

ReactDOM.render(
  <Provider store={store}>
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletConnectionProvider>
        <App />
      </WalletConnectionProvider>
    </Web3ReactProvider>
  </Provider>,
  document.getElementById("root")
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
