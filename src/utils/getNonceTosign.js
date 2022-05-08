import HttpService from "./httpService"
import { config } from "./config"

const httpservice = new HttpService()

export const getNonce = async (account) => {
  const url = `${config.url_NFTnize}/auth/getnonce`
  const res = await httpservice.post(url, {
    account,
  })
  return res.data.nonce
}
