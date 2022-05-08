import { ARC3_URL_SUFFIX, ARC69_URL_SUFFIX } from "utils/nft"
import axios from "axios"
import { config } from "utils/config"

export const formatCollectionName = (str) => {
  if (!str) {
    return undefined
  }
  if (str.includes("&")) {
    const returnStr = str.split("&").join("").replace("  ", " ")
    return returnStr
  }
  return str
}

export const formatURL = async (url) => {
  if (url && url.includes("ipfs://")) {
    const urlArr = url.split("://")
    if (url.endsWith(ARC3_URL_SUFFIX) || url.endsWith(ARC69_URL_SUFFIX)) {
      const response = await axios.get(`https://ipfs.io/ipfs/${urlArr[1]}`)
      if (response.data.image) {
        const respURL = await formatURL(response.data.image)
        return respURL
      }
    } else {
      const returnURL = `${config.ipfsGateway}${urlArr[1]}`
      return returnURL
    }
  } else if (url && url.includes("ipfs.io")) {
    const replaceURL = url.replace("ipfs.io", "yieldly.mypinata.cloud")
    return replaceURL
  } else if (url && url.includes("tinyurl.com")) {
    const res = await axios.get(url)
    if (res.request.responseURL) {
      const replaceURL = res.request.responseURL.replace(
        "gateway.pinata.cloud",
        "yieldly.mypinata.cloud"
      )
      return replaceURL
    } else if (res.request.res.responseUrl) {
      const replaceURL = res.request.res.responseUrl.replace(
        "gateway.pinata.cloud",
        "yieldly.mypinata.cloud"
      )
      return replaceURL
    }
    return url
  } else if (url && url.includes("rebrand.ly")) {
    const res = await axios.get(`https://${url}`)
    if (res.request.responseURL) {
      const respURL = await formatURL(res.request.responseURL)
      return respURL
    } else if (res.request.res.responseUrl) {
      const respURL = await formatURL(res.request.res.responseUrl)
      return respURL
    }
    return url
  } else if (url && url.includes("gateway.pinata.cloud")) {
    const replaceURL = url.replace(
      "gateway.pinata.cloud",
      "yieldly.mypinata.cloud"
    )
    return replaceURL
  } else if (url && url.includes("bit.ly")) {
    const res = await axios.get(`${config.apiUrl}/format-url?url=${url}`)
    return res.data
  } else if (
    url &&
    (url.endsWith(ARC3_URL_SUFFIX) || url.endsWith(ARC69_URL_SUFFIX))
  ) {
    const response = await axios.get(url)
    if (response.data.image) {
      const respURL = await formatURL(response.data.image)
      return respURL
    }
  } else {
    return url
  }
}

export const calculate = (content, trait, totalLength) => {
  const filteredContent = content.filter((li) =>
    li.attributes?.some(
      (attr) =>
        attr.trait_type === trait.trait_type && attr.value === trait.value
    )
  )
  const filteredContentLength = filteredContent.length
  const percentage = (filteredContentLength * 100) / totalLength
  return percentage.toFixed(1)
}

export const formatPrice = (itemPrices, row, showUnit = false, unit = "A") => {
  const selectedItemPrice = itemPrices.find(
    (li) => li.roundtime === row["round-time"] && li.sender === row.sender
  )
  if (selectedItemPrice) {
    if (showUnit) {
      return `${Number(selectedItemPrice.price / 100000)} ${unit}`
    }
    return Number(selectedItemPrice.price / 100000)
  } else {
    return "-"
  }
}

export const formatDuration = (value) => {
  const seconds = parseInt(value, 10)

  const d = Math.floor(seconds / (3600 * 24))
  let h = Math.floor((seconds % (3600 * 24)) / 3600)
  let m = Math.floor((seconds % 3600) / 60)
  let s = Math.floor(seconds % 60)

  // add 0 if value < 10; Example: 2 => 02
  if (h < 10) {
    h = `0${h}`
  }
  if (m < 10) {
    m = `0${m}`
  }
  if (s < 10) {
    s = `0${s}`
  }
  if (d === 0) {
    return `${h}h ${m}m ${s}s`
  } else {
    return `${d}d ${h}h ${m}m ${s}s`
  }
}

export const numberFormatter = (num, digits) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = lookup
    .slice()
    .reverse()
    .find((i) => num >= i.value)

  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0"
}

export const formatAddress = (
  e,
  headLetterCount = 4,
  middleStr = ".",
  middleLetterCount = 4,
  tailLetterCount = 4
) => {
  if (e && typeof e === "string") {
    return `${e.substr(0, headLetterCount)}${middleStr.repeat(
      middleLetterCount
    )}${e.substr(e.length - tailLetterCount, e.length - 1)}`
  }
  return e
}

export const formatCreator = (value) => {
  const returnVal = value?.replace("By ", "")
  if (returnVal && returnVal.charAt(0) === "@") {
    return returnVal.replace("@", "")
  }
  return returnVal
}

export const formatDate = (value) => {
  const date = new Date(value * 1000).toString()
  const position = date.search("GMT")
  const formatStr = date.slice(0, position)
  return formatStr
}
// get time difference from now as a second
export const timeDiffAsSec = (time) => {
  const start = new Date()
  const end = new Date(time)
  return (end.getTime() - start.getTime()) / 1000
}

export const loadingGif =
  "https://media.giphy.com/media/4EFt4UAegpqTy3nVce/giphy.gif"

export const formatTraits = (data) => {
  const result = {}
  const traitTypes = new Set()
  data.forEach((li) => {
    li.attributes.forEach((attr) => {
      traitTypes.add(attr.trait_type)
    })
  })
  if (traitTypes.size > 0) {
    traitTypes.forEach((trait) => {
      result[trait] = []
      const traitValues = new Set()
      data.forEach((li) => {
        const selectedAttr = li.attributes.find(
          (attr) => attr.trait_type === trait
        )
        if (selectedAttr) {
          traitValues.add(selectedAttr.value)
        }
      })
      if (traitValues.size > 0) {
        traitValues.forEach((val) => {
          const filterTraitValues = data.filter((li) => {
            const selectedAttr = li.attributes.find(
              (attr) => attr.trait_type === trait && attr.value === val
            )
            if (selectedAttr) {
              return true
            } else {
              return false
            }
          })
          result[trait].push({
            key: val,
            value: filterTraitValues.length,
          })
        })
      }
    })
  }
  return result
}

export const collectIndexesFromTraitsData = (
  checked,
  selectedCollectionTraitsData
) => {
  if (checked.length > 0) {
    const result = []
    checked.forEach((chk) => {
      selectedCollectionTraitsData.filter((li) => {
        const selectedAttr = li.attributes.find(
          (attr) =>
            attr.trait_type === chk.trait_type && attr.value === chk.value
        )
        if (selectedAttr) {
          result.push(li.id.$numberLong)
          return true
        } else {
          return false
        }
      })
    })
    if (checked.length === 1) {
      return Array.from(result)
    } else if (checked.length > 1) {
      const toFindDuplicates = (arry) =>
        arry.filter((item, index) => arry.indexOf(item) !== index)
      const duplicateElements = toFindDuplicates(result)
      return Array.from(duplicateElements)
    }
  } else {
    return []
  }
}

export const isCheckedExist = (values) => {
  if (values && values.length > 0) {
    return true
  } else {
    return false
  }
}

export const isEmptyObject = (obj) => !(obj && Object.keys(obj).length > 0)

export const getOptImageUrl = (url, size) =>
  `${config.imageOptimizer}/images?url=${encodeURIComponent(url)}&size=${size}`
