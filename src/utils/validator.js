import { JSON_TYPE } from "./nft"

function mdurl(nft) {
  return nft.urlMimeType === JSON_TYPE
}

function mdhash(nft) {
  return (
    nft.token.metadataHash ===
    Buffer.from(nft.metadata.toHash()).toString("base64")
  )
}

function total(nft) {
  // return nft.token.total / 10 ** nft.token.decimals === 1
  return nft.token.total === 1
}

// TODO: Check that metadata contains correct fields
// TODO: Check that integrity hashes are valid

const validators = {
  "URL Points to metadata": mdurl,
  "Metadata Hash matches": mdhash,
  "Total Supply Is 1": total,
}

export function validArc3(nft) {
  return validateArc3(nft).length === 0
}

export function validateArc3(nft) {
  const tests = []
  /* eslint no-restricted-syntax: ["error", "FunctionExpression", "WithStatement", "BinaryExpression[operator='in']"] */
  if (nft.token) {
    for (const k in validators) {
      if (Object.prototype.hasOwnProperty.call(validators, k)) {
        tests.push({ name: k, pass: validators[k](nft) })
      }
    }
    return tests
  }
  return []
}
