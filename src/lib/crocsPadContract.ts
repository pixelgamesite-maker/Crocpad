// Update this whenever CrocsPad is redeployed — this is the single
// source of truth the mint page reads from.
export const CROCSPAD_ADDRESS = "0x30B07825dF63B76A43E27b230aBb4934BCAE823c";

export const ALLOWLIST_API_URL = "https://crocpad-allowlist-production.up.railway.app";

// Phase enum matches the contract exactly: 0 = Closed, 1 = Allowlist, 2 = Public
export const PHASE = { CLOSED: 0, ALLOWLIST: 1, PUBLIC: 2 } as const;

export const CROCSPAD_ABI = [
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
  { type: "function", name: "totalSupply", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "MAX_SUPPLY", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "TEAM_ALLOCATION", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "ALLOWLIST_SUPPLY_CAP", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "MINTABLE_SUPPLY", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "allowlistTimeRemaining", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "allowlistTargetDuration", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
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
] as const;
