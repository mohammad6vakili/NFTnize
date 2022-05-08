import { io } from "socket.io-client"
import { setAccessCode, setAuthCheckingFinished } from "./accessCode/accessCode"
import { config } from "../utils/config"
import { codeExpireCount } from "utils/accessCode"
import { AuctionService } from "../services/AuctionService"
import {
  addApplication,
  deleteApplication,
  setApplications,
  updateApplication,
  asyncGetPopularAuctions,
} from "./application/application-slice"
import { BuyNowService } from "../services/BuyNowService"
import { getAccessCodeHistoryCount } from "new_services/AccessHistoryService"

function initWebsocket(store) {
  const socket = io(config.smartContractUrl)

  socket.on("applicationCreated", (data) => {
    store.dispatch(addApplication(data))
    store.dispatch(asyncGetPopularAuctions({ count: 11 }))
  })

  socket.on("applicationUpdated", (data) => {
    store.dispatch(updateApplication(data))
    store.dispatch(asyncGetPopularAuctions({ count: 11 }))
  })

  socket.on("applicationDeleted", (data) => {
    store.dispatch(deleteApplication(data))
    store.dispatch(asyncGetPopularAuctions({ count: 11 }))
  })
}

async function initAuctions(store) {
  const { data: auctions } = await AuctionService.getAuctions({})
  const { data: fixedPrices } = await BuyNowService.getBuyNows({})

  const applications = [...(auctions ?? []), ...(fixedPrices ?? [])]

  store.dispatch(setApplications(applications))
  store.dispatch(asyncGetPopularAuctions({ count: 11 }))
}

async function initAccessCode(store) {
  const accessCode = window.localStorage.getItem("accessCode")
  if (accessCode) {
    const { data: accessCount } = await getAccessCodeHistoryCount({
      code: accessCode,
    })
    if (accessCount <= codeExpireCount) {
      store.dispatch(setAccessCode(accessCode))
    } else {
      window.localStorage.removeItem("accessCode")
    }
  }
  store.dispatch(setAuthCheckingFinished(false))
}

export async function initApp(store) {
  initAccessCode(store)
  await initAuctions(store)
  initWebsocket(store)
}
