// Update this whenever CrocsPad is redeployed — this is the single
// source of truth the site reads from.
export const CROCSPAD_ADDRESS = "0x30B07825dF63B76A43E27b230aBb4934BCAE823c";
export const CROCSTRAITS_ADDRESS = "0x4218700b889EBcAA4faa4E96893cED1b01a89Ea7";
export const CROCSEQUIP_ADDRESS = "0x3E4327b7a1976aC2034D34424B51FB678D7aB39F";

export const ALLOWLIST_API_URL = "https://crocpad-allowlist-production.up.railway.app";

export const EXPLORER = "https://robinhoodchain.blockscout.com";

// Phase enum matches the contract exactly: 0 = Closed, 1 = Allowlist, 2 = Public
export const PHASE = { CLOSED: 0, ALLOWLIST: 1, PUBLIC: 2 } as const;

/** Wallets the team wants holding the reserved allocation. Only the
 *  contract owner can actually call ownerMint — the others are mint
 *  destinations, offered as presets in the team panel. */
export const TEAM_WALLETS = [
  "0xe3Aa84d2A4169dA6d73393fb609D1180938d7FFb",
  "0xbea4aa1e32b859ee04aecfefeda9b79dbe4fbcb8",
] as const;

export const CROCSPAD_ABI = [
  { type: "function", name: "owner", stateMutability: "view", inputs: [], outputs: [{ type: "address" }] },
  { type: "function", name: "phase", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
  { type: "function", name: "paused", stateMutability: "view", inputs: [], outputs: [{ type: "bool" }] },
  { type: "function", name: "allowlistPrice", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "publicPrice", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "launchpadFee", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "maxPerWalletAllowlist", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "maxPerWalletPublic", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "allowlistMinted", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "publicMinted", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalAllowlistMinted", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalPublicMinted", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalTeamMinted", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "MAX_SUPPLY", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "TEAM_ALLOCATION", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "ALLOWLIST_SUPPLY_CAP", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "MINTABLE_SUPPLY", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "allowlistTimeRemaining", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function", name: "mintAllowlist", stateMutability: "payable",
    inputs: [{ type: "uint256", name: "quantity" }, { type: "bytes32[]", name: "proof" }],
    outputs: [],
  },
  {
    type: "function", name: "mintPublic", stateMutability: "payable",
    inputs: [{ type: "uint256", name: "quantity" }],
    outputs: [],
  },
  {
    type: "function", name: "ownerMint", stateMutability: "nonpayable",
    inputs: [{ type: "address", name: "to" }, { type: "uint256", name: "quantity" }],
    outputs: [],
  },
  {
    type: "function", name: "setMerkleRoot", stateMutability: "nonpayable",
    inputs: [{ type: "bytes32", name: "root" }],
    outputs: [],
  },
  {
    type: "function", name: "setPhase", stateMutability: "nonpayable",
    inputs: [{ type: "uint8", name: "newPhase" }],
    outputs: [],
  },
] as const;
