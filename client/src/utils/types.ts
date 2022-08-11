interface CollectionList {
  id: string
  name: string
}

export interface Collections {
  [propName: string]: CollectionList
}
