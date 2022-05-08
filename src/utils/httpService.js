import axios from "axios"

class HttpService {
  constructor() {
    this.client = axios.create({
      timeout: 100000,
    })
  }

  get(url, config = null) {
    return this.client.get(url, config)
  }

  post(url, params, config = null) {
    return this.client.post(url, params, config)
  }

  delete(url, config = null) {
    return this.client.delete(url, config)
  }

  put(url, params, config = null) {
    return this.client.put(url, params, config)
  }
}

export default HttpService
