import * as JsSearch from "js-search"

export class Search {
  constructor(ags) {
    this.jsSearch = new JsSearch.Search(ags?.id ?? "id")
    this.jsSearch.indexStrategy = new JsSearch.AllSubstringsIndexStrategy()
    if (ags?.indexes) {
      ags.indexes.forEach((index) => {
        this.jsSearch.addIndex(index)
      })
    }
  }

  addIndex(indexes = []) {
    indexes.forEach((index) => {
      this.jsSearch.addIndex(index)
    })
  }

  addData(docs = []) {
    this.jsSearch.addDocuments(docs)
  }

  search(e) {
    return this.jsSearch.search(e)
  }
}
