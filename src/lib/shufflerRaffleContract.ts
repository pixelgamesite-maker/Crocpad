export const SHUFFLER_RAFFLE_ADDRESS = "0xb7E8433cb8E0dba056B6ecC5E6702F196ec302b2";
export const SHUFFLER_REGISTRY_ADDRESS = "0xF14fbA500f5C06604b4819fA30899aAad6563E92";

export const ELIGIBILITY = { PUBLIC: 0, HOLDER_GATED: 1 } as const;
export const RAFFLE_STATUS = { ACTIVE: 0, DRAW_REQUESTED: 1, COMPLETE: 2, CANCELLED: 3 } as const;

export const SHUFFLER_RAFFLE_ABI = [
  { type: "function", name: "raffleCount", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "creationFee", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "entryFee", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "minDuration", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  { type: "function", name: "maxDuration", stateMutability: "view", inputs: [], outputs: [{ type: "uint256" }] },
  {
    type: "function", name: "getRaffleSummary", stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [
      { type: "address", name: "creator" },
      { type: "uint8", name: "eligibility" },
      { type: "address", name: "gatingCollection" },
      { type: "uint256", name: "endTime" },
      { type: "uint8", name: "status" },
      { type: "uint256", name: "prizeCount" },
      { type: "uint256", name: "entrantCount" },
    ],
  },
  {
    type: "function", name: "getPrizes", stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [{ type: "tuple[]", components: [{ type: "address", name: "nftContract" }, { type: "uint256", name: "tokenId" }] }],
  },
  { type: "function", name: "hasEntered", stateMutability: "view", inputs: [{ type: "uint256" }, { type: "address" }], outputs: [{ type: "bool" }] },
  { type: "function", name: "getWinners", stateMutability: "view", inputs: [{ type: "uint256" }], outputs: [{ type: "address[]" }] },
  {
    type: "function", name: "getDrawRequest", stateMutability: "view",
    inputs: [{ type: "uint256" }],
    outputs: [{ type: "uint256", name: "targetBlock" }, { type: "bool", name: "fulfilled" }],
  },
  {
    type: "function", name: "createRaffle", stateMutability: "payable",
    inputs: [
      { type: "address[]", name: "nftContracts" },
      { type: "uint256[]", name: "tokenIds" },
      { type: "uint256", name: "duration" },
      { type: "uint8", name: "eligibility" },
      { type: "address", name: "gatingCollection" },
    ],
    outputs: [{ type: "uint256" }],
  },
  { type: "function", name: "enterRaffle", stateMutability: "payable", inputs: [{ type: "uint256" }], outputs: [] },
  { type: "function", name: "requestDraw", stateMutability: "nonpayable", inputs: [{ type: "uint256" }], outputs: [] },
  { type: "function", name: "executeDraw", stateMutability: "nonpayable", inputs: [{ type: "uint256" }], outputs: [] },
  { type: "function", name: "reclaimUnusedPrizes", stateMutability: "nonpayable", inputs: [{ type: "uint256" }], outputs: [] },
] as const;

// Minimal ERC721 surface needed for the approve-then-deposit flow —
// works against any collection, not just CrocsPad.
export const ERC721_MIN_ABI = [
  { type: "function", name: "approve", stateMutability: "nonpayable", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [] },
  { type: "function", name: "getApproved", stateMutability: "view", inputs: [{ type: "uint256" }], outputs: [{ type: "address" }] },
  { type: "function", name: "ownerOf", stateMutability: "view", inputs: [{ type: "uint256" }], outputs: [{ type: "address" }] },
] as const;
