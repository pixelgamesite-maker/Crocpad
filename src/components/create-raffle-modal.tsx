import { useState } from "react";
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther, isAddress } from "viem";
import { color, font, RULE, offset } from "@/lib/theme";
import { SHUFFLER_RAFFLE_ADDRESS, SHUFFLER_RAFFLE_ABI, ERC721_MIN_ABI, ELIGIBILITY } from "@/lib/shufflerRaffleContract";

const ZERO = "0x0000000000000000000000000000000000000000" as const;

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 12px", border: RULE, background: color.paper,
  fontFamily: font.mono, fontSize: "0.82rem", color: color.ink, outline: "none",
};

type PrizeRow = { nftContract: string; tokenId: string };

export default function CreateRaffleForm({ onCreated }: { onCreated: () => void }) {
  const { address, isConnected } = useAccount();

  const [prizes, setPrizes] = useState<PrizeRow[]>([{ nftContract: "", tokenId: "" }]);
  const [days, setDays] = useState("1");
  const [gated, setGated] = useState(false);
  const [gatingCollection, setGatingCollection] = useState("");

  function updatePrize(i: number, field: keyof PrizeRow, value: string) {
    setPrizes((rows) => rows.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)));
  }
  function addPrize() {
    setPrizes((rows) => [...rows, { nftContract: "", tokenId: "" }]);
  }
  function removePrize(i: number) {
    setPrizes((rows) => (rows.length > 1 ? rows.filter((_, idx) => idx !== i) : rows));
  }

  const validPrizeRows = prizes.filter((p) => isAddress(p.nftContract) && p.tokenId.trim() !== "" && !isNaN(Number(p.tokenId)));
  const allRowsValid = validPrizeRows.length === prizes.length && prizes.length > 0;
  const validGating = !gated || isAddress(gatingCollection);
  const validDuration = Number(days) > 0;

  // One approval needed per unique NFT contract across all prize rows —
  // setApprovalForAll covers every token from that contract in one shot.
  const uniqueContracts = Array.from(new Set(validPrizeRows.map((p) => p.nftContract.toLowerCase())));

  const { data: creationFeeData } = useReadContracts({
    contracts: [{ address: SHUFFLER_RAFFLE_ADDRESS, abi: SHUFFLER_RAFFLE_ABI, functionName: "creationFee" }],
  });
  const creationFee = creationFeeData?.[0]?.result as bigint | undefined;

  const { data: approvalData, refetch: refetchApprovals } = useReadContracts({
    contracts: uniqueContracts.map((contract) => ({
      address: contract as `0x${string}`,
      abi: ERC721_MIN_ABI,
      functionName: "isApprovedForAll",
      args: [address ?? ZERO, SHUFFLER_RAFFLE_ADDRESS],
    })),
    query: { enabled: isConnected && uniqueContracts.length > 0 },
  });

  const approvalStatus = uniqueContracts.map((contract, i) => ({
    contract,
    approved: approvalData?.[i]?.result === true,
  }));
  const unapproved = approvalStatus.filter((a) => !a.approved);
  const allApproved = uniqueContracts.length > 0 && unapproved.length === 0;

  const [approvingContract, setApprovingContract] = useState<string | null>(null);
  const approveWrite = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approveWrite.data });

  const createWrite = useWriteContract();
  const createReceipt = useWaitForTransactionReceipt({ hash: createWrite.data });

  function approveContract(contract: string) {
    approveWrite.reset();
    setApprovingContract(contract);
    approveWrite.writeContract({
      address: contract as `0x${string}`, abi: ERC721_MIN_ABI, functionName: "setApprovalForAll",
      args: [SHUFFLER_RAFFLE_ADDRESS, true],
    });
  }

  if (approveReceipt.isSuccess && approvingContract) {
    refetchApprovals();
    setApprovingContract(null);
    approveWrite.reset();
  }

  function create() {
    if (creationFee === undefined) return;
    createWrite.reset();
    const durationSeconds = BigInt(Math.round(Number(days) * 86400));
    createWrite.writeContract({
      address: SHUFFLER_RAFFLE_ADDRESS, abi: SHUFFLER_RAFFLE_ABI, functionName: "createRaffle",
      args: [
        validPrizeRows.map((p) => p.nftContract as `0x${string}`),
        validPrizeRows.map((p) => BigInt(p.tokenId)),
        durationSeconds,
        gated ? ELIGIBILITY.HOLDER_GATED : ELIGIBILITY.PUBLIC,
        gated ? (gatingCollection as `0x${string}`) : ZERO,
      ],
      value: creationFee,
    });
  }

  const canCreate = isConnected && allRowsValid && validGating && validDuration && allApproved;
  const approvalInFlight = approveWrite.isPending || approveReceipt.isLoading;

  if (createReceipt.isSuccess) {
    return (
      <div style={{ border: RULE, background: color.croc, color: color.paper, padding: "24px", textAlign: "center" }}>
        <p style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.1rem", margin: "0 0 8px" }}>
          Raffle created — {validPrizeRows.length} prize{validPrizeRows.length > 1 ? "s" : ""}
        </p>
        <p style={{ fontFamily: font.mono, fontSize: "0.76rem", opacity: 0.9 }}>It'll appear in the list below.</p>
        <button
          onClick={onCreated}
          className="press"
          style={{ marginTop: "14px", padding: "10px 20px", border: `1px solid ${color.paper}`, background: "transparent", color: color.paper, fontFamily: font.mono, fontSize: "0.72rem", cursor: "pointer" }}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div style={{ border: RULE, background: color.paper, boxShadow: offset(color.tongue) }}>
      <div style={{ padding: "13px 18px", borderBottom: RULE }}>
        <span style={{ fontFamily: font.mono, fontSize: "0.64rem", letterSpacing: "0.14em", textTransform: "uppercase", color: color.inkSoft }}>
          Create a raffle
        </span>
      </div>

      <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "10px" }}>
            <p style={{ fontFamily: font.mono, fontSize: "0.68rem", color: color.inkSoft, margin: 0 }}>
              Prizes ({prizes.length})
            </p>
            <button
              onClick={addPrize}
              style={{ fontFamily: font.mono, fontSize: "0.68rem", background: "none", border: "none", color: color.croc, cursor: "pointer", textDecoration: "underline" }}
            >
              + Add another prize
            </button>
          </div>

          {prizes.map((row, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", alignItems: "flex-start" }}>
              <input
                value={row.nftContract}
                onChange={(e) => updatePrize(i, "nftContract", e.target.value)}
                placeholder="NFT contract 0x…"
                style={{ ...inputStyle, flex: 2 }}
                spellCheck={false}
              />
              <input
                value={row.tokenId}
                onChange={(e) => updatePrize(i, "tokenId", e.target.value)}
                placeholder="Token ID"
                style={{ ...inputStyle, flex: 1 }}
              />
              {prizes.length > 1 && (
                <button
                  onClick={() => removePrize(i)}
                  aria-label="Remove prize"
                  style={{ width: "42px", height: "42px", flexShrink: 0, border: RULE, background: color.paper, cursor: "pointer", fontSize: "1.1rem" }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div>
          <p style={{ fontFamily: font.mono, fontSize: "0.68rem", color: color.inkSoft, margin: "0 0 6px" }}>Duration (days)</p>
          <input type="number" min="0.04" step="0.5" value={days} onChange={(e) => setDays(e.target.value)} style={inputStyle} />
        </div>

        <div>
          <div style={{ display: "flex", gap: "8px", marginBottom: gated ? "10px" : 0 }}>
            {[["Public", false], ["Holder-gated", true]].map(([label, val]) => (
              <button
                key={label as string}
                onClick={() => setGated(val as boolean)}
                style={{
                  flex: 1, padding: "10px", border: RULE, cursor: "pointer",
                  fontFamily: font.mono, fontSize: "0.72rem", letterSpacing: "0.04em", textTransform: "uppercase",
                  background: gated === val ? color.ink : color.paper, color: gated === val ? color.paper : color.ink,
                }}
              >
                {label as string}
              </button>
            ))}
          </div>
          {gated && (
            <input value={gatingCollection} onChange={(e) => setGatingCollection(e.target.value)} placeholder="Gating collection address (0x…)" style={inputStyle} spellCheck={false} />
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: font.mono, fontSize: "0.76rem", paddingTop: "4px", borderTop: `1px solid ${color.paperDeep}` }}>
          <span style={{ color: color.inkSoft }}>Creation fee</span>
          <span>{creationFee !== undefined ? `${formatEther(creationFee)} ETH` : "—"}</span>
        </div>

        {/* per-contract approvals */}
        {uniqueContracts.length > 0 && (
          <div>
            <p style={{ fontFamily: font.mono, fontSize: "0.64rem", letterSpacing: "0.1em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 8px" }}>
              1. Approve each collection
            </p>
            {approvalStatus.map(({ contract, approved }) => (
              <div key={contract} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 12px", border: RULE, marginBottom: "6px", background: approved ? color.paperDeep : color.paper }}>
                <span style={{ fontFamily: font.mono, fontSize: "0.74rem" }}>
                  {contract.slice(0, 6)}…{contract.slice(-4)}
                </span>
                {approved ? (
                  <span style={{ fontFamily: font.mono, fontSize: "0.68rem", color: color.croc }}>Approved</span>
                ) : (
                  <button
                    onClick={() => approveContract(contract)}
                    disabled={approvalInFlight}
                    className="press"
                    style={{ padding: "6px 14px", border: RULE, background: color.sun, cursor: approvalInFlight ? "not-allowed" : "pointer", fontFamily: font.mono, fontSize: "0.68rem" }}
                  >
                    {approvingContract === contract && approvalInFlight
                      ? (approveWrite.isPending ? "Confirm…" : "Approving…")
                      : "Approve"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={create}
          disabled={!canCreate || createWrite.isPending || createReceipt.isLoading}
          className={canCreate ? "press" : undefined}
          style={{
            width: "100%", padding: "13px", border: RULE, cursor: canCreate ? "pointer" : "not-allowed",
            background: canCreate ? color.ink : color.paperDeep, color: canCreate ? color.paper : color.inkFaint,
            fontFamily: font.display, fontWeight: 700, fontSize: "0.9rem",
            boxShadow: canCreate ? offset(color.croc, 4, 4) : "none",
          }}
        >
          {createWrite.isPending ? "Confirm in wallet…" : createReceipt.isLoading ? "Creating…" : "2. Deposit & create raffle"}
        </button>

        {(approveWrite.error || createWrite.error) && (
          <p style={{ fontFamily: font.mono, fontSize: "0.7rem", color: color.tongue }}>
            {(approveWrite.error as any)?.shortMessage ?? (createWrite.error as any)?.shortMessage ?? "Transaction failed."}
          </p>
        )}

        <p style={{ fontFamily: font.mono, fontSize: "0.64rem", color: color.inkFaint, lineHeight: 1.5, margin: 0 }}>
          Approving a collection lets the raffle contract move ANY token you own from it, not just the ones listed
          above — this is what makes raffling several tokens from the same collection a single approval instead of
          one per token. You can revoke it anytime after. Nothing actually moves until you create the raffle.
        </p>
      </div>
    </div>
  );
}
