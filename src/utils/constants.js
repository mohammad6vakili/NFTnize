export const isDevelopment = process.env.NODE_ENV === "development"

export const LOADING_STATUS = {
  IDLE: -1,
  PENDING: 0,
  COMPLETED: 1,
}

export const AUCTION_TIMES = [
  {
    label: "1 Hour",
    value: 3600,
  },
  {
    label: "6 Hours",
    value: 3600 * 6,
  },
  {
    label: "12 Hours",
    value: 3600 * 12,
  },
  {
    label: "1 Day",
    value: 3600 * 24,
  },
  {
    label: "2 Days",
    value: 3600 * (24 * 2),
  },
  {
    label: "4 Days",
    value: 3600 * (24 * 4),
  },
  {
    label: "Custom",
    value: "custom",
  },
]

export const metadataFormatTypes = [
  {
    label: "ARC3",
    value: "arc3",
  },
  {
    label: "ARC69",
    value: "arc69",
  },
]

export const networkTypes = [
  {
    label: "Ethereum",
    value: "Eth",
  },
  {
    label: "Polygon",
    value: "Plg",
  },
]

export const collectionData = [
  {
    id: "1",
    name: "collection 1",
    symbol: "symbol 1",
    description: "description 1",
    shortUrl: "https://url1.com",
  },
  {
    id: "2",
    name: "collection 2",
    symbol: "symbol 2",
    description: "description 2",
    shortUrl: "https://url2.com",
  },
  {
    id: "3",
    name: "collection 3",
    symbol: "symbol 3",
    description: "description 3",
    shortUrl: "https://url3.com",
  },
]

export const tokenTypes = [
  {
    label: "ERC1155",
    value: "ERC1155",
  },
  {
    label: "ERC721",
    value: "ERC721",
  },
]

export const categories = [
  {
    label: "Art (all paintings)",
    value: "Art",
  },
  {
    label: "Antiques (anything)",
    value: "Antiques",
  },
  {
    label: "Fine Art (the Masters)",
    value: "Fine Art",
  },
  {
    label: "Digital Art and Animations",
    value: "Digital Art and Animations",
  },
  {
    label: "Pokémon cards",
    value: "Pokémon cards",
  },
  {
    label: "Comic (books and magazines)",
    value: "Comic",
  },
  {
    label: "Vintage (anything)",
    value: "Vintage",
  },
  {
    label: "Gaming (things, tools, characters)",
    value: "Gaming",
  },
  {
    label: "Photos (unique and rare)",
    value: "Photos",
  },
  {
    label: "Music (clips, tracks and songs)",
    value: "Music",
  },
  {
    label: "Videos and Films (unique and rare)",
    value: "Videos and Films",
  },
  {
    label: "Collectibles (coins, stamps, etc.)",
    value: "Collectibles",
  },
  {
    label: "Domain Names",
    value: "Domain Names",
  },
  {
    label: "Photography",
    value: "Photography",
  },
  {
    label: "Sports (trading cards, jersey, rings, trophies)",
    value: "Sports",
  },
  {
    label: "Signatures & Documents",
    value: "Signatures & Documents",
  },
  {
    label: "Books (old, new, one of a kind)",
    value: "Books",
  },
  {
    label: "Cars (rare classics and FAST!!!)",
    value: "Cars",
  },
  {
    label: "Boats, Trains and Airplanes",
    value: "Boats, Trains and Airplanes",
  },
  {
    label: "Real estate (land, buildings, structures)",
    value: "Real estate",
  },
  {
    label: "Virtual Worlds (metaverse)",
    value: "Virtual Worlds",
  },
]

export const buyTypes = {
  LIVE_AUCTION: "LIVE_AUCTION",
  CLOSED_AUCTION: "CLOSED_AUCTION",
  DELETED_AUCTION: "DELETED_AUCTION",
  BUY_NOW: "BUY_NOW",
  SOLD: "SOLD",
}

export const SellTypes = {
  FIXED_PRICE: "FIXED_PRICE",
  AUCTION: "AUCTION",
}

export const creatorFilterTypes = {
  created: "Created",
  owned: "Owned",
  optIns: "Opt Ins",
  myBids: "My Bids",
  myListings: "My Listings",
}

export const FilterTypes = {
  live: "LIVE_AUCTION",
  buy: "BUY_NOW",
  closed: "CLOSED_AUCTION",
  sold: "SOLD",
  LIVE_AUCTION: "live",
  BUY_NOW: "buy",
  SOLD: "sold",
  CLOSED_AUCTION: "closed",
}

export const SortOptions = [
  { title: "Date Listed: Newest", value: 1 },
  { title: "Price: Highest", value: 2 },
  { title: "Price: Lowest", value: 3 },
  { title: "Ending: Soonest", value: 4 },
]

export const PROGRESS_STEPS = {
  // 0
  INITIAL: {
    status: 0,
    note: "",
  },
  // 1
  CONNECT_WALLET: {
    status: 2,
    note: "Connecting wallet...",
  },
  // 2
  BALANCE_CHECK: {
    status: 10,
    note: "Checking balance...",
  },
  // 3
  CREATE_SALES_ACCOUNT: {
    status: 16,
    note: "Creating sales account...",
  },
  // 4
  MINIMAL_BALANCE_TRANSFER: {
    status: 22,
    note: "Transferring minimum balance...",
  },
  // 5
  OPT_IN: {
    status: 35,
    note: "Opt-in to receive asset...",
  },
  // 6
  ASSET_TRANSFER: {
    status: 50,
    note: "Transferring asset to contract account...",
  },
  // 7
  VERIFY_CONTRACT: {
    status: 65,
    note: "Verifying contract...",
  },
  // 8
  REDIRECT: {
    status: 97,
    note: "Redirecting...",
  },
}

export const BID_PROGRESS_STEPS = {
  // 0
  INITIAL: {
    status: 0,
    note: "",
  },
  // 1
  CONNECT_WALLET: {
    status: 20,
    note: "Connecting wallet...",
  },
  // 2
  OPTIN_APPLICATION: {
    status: 40,
    note: "Opt-in Application...",
  },
  // 3
  BALANCE_CHECK: {
    status: 60,
    note: "Checking balance...",
  },
  // 3
  CLOSE_CONTRACT: {
    status: 60,
    note: "Closing contract...",
  },
  // 4
  BIDDING: {
    status: 80,
    note: "Bidding...",
  },
  // 4
  BUYING: {
    status: 80,
    note: "Buying...",
  },
  // 5
  BID_CONFIRM: {
    status: 90,
    note: "Waiting for bid to be confirmed on the blockchain...",
  },
  // 5
  CLOSE_CONFIRM: {
    status: 90,
    note: "Waiting for close auction to be confirmed on the blockchain...",
  },
  // 5
  CLOSE_BUYNOW: {
    status: 90,
    note: "Waiting for close Fixed Sale to be confirmed on the blockchain...",
  },
}

export const MINIMUM_BALANCE_APPLICATION = 0.658
