import { PortisConnector } from "@web3-react/portis-connector"
import { TorusConnector } from "@web3-react/torus-connector"
import { FortmaticConnector } from "@web3-react/fortmatic-connector"
import { InjectedConnector } from "@web3-react/injected-connector"

// import { MagicConnector } from "@web3-react/magic-connector"

export const MetaMaskPolygon = new InjectedConnector({
  supportedChainIds: [137, 80001],
})

export const torus = new TorusConnector({ chainId: 1 })

export const fortmatic = new FortmaticConnector({
  apiKey: "pk_test_9E6D5A88EEB4F544",
  chainId: 1,
})

export const portis = new PortisConnector({
  dAppId: "52c00538-bb28-4ac0-b17e-762471d55db1",
  networks: [1, 100],
})
