import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther, parseEther, isAddress } from "viem";
import { color, font, RULE, offset } from "@/lib/theme";
import { SHUFFLER_RAFFLE_ADDRESS, SHUFFLER_RAFFLE_ABI, ERC721_MIN_ABI, ELIGIBILITY } from "@/lib/shufflerRaffleContract";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 12px", border: RULE, background: color.paper,
  fontFamily: font.mono, fontSize: "0.82rem", color: color.ink, outline: "none",
};

export default function CreateRaffleForm({ onCreated }: { onCreated: () => void }) {
  const { address, isConnected } = useAccount();

  const [nftContract, setNftContract] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [days, setDays] = useState("1");
  const [gated, setGated] = useState(false);
  const [gatingCollection, setGatingCollection] = useState("");

  const { data: creationFee } = useReadContract({
    address: SHUFFLER_RAFFLE_ADDRESS, abi: SHUFFLER_RAFFLE_ABI, functionName: "creationFee",
  });

  const validNft = isAddress(nftContract);
  const validTokenId = tokenId.trim() !== "" && !isNaN(Number(tokenId));
  const validGating = !gated || isAddress(gatingCollection);
  const validDuration = Number(days) > 0;

  const { data: approvedAddress, refetch: refetchApproval } = useReadContract({
    address: validNft ? (nftContract as `0x${string}`) : undefined,
    abi: ERC721_MIN_ABI,
    functionName: "getApproved",
    args: validTokenId ? [BigInt(tokenId)] : undefined,
    query: { enabled: validNft && validTokenId },
  });
  const isApproved = approvedAddress?.toLowerCase() === SHUFFLER_RAFFLE_ADDRESS.toLowerCase();

  const approveWrite = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approveWrite.data });

  const createWrite = useWriteContract();
  const createReceipt = useWaitForTransactionReceipt({ hash: createWrite.data });

  function approve() {
    approveWrite.reset();
    approveWrite.writeContract({
      address: nftContract as `0x${string}`, abi: ERC721_MIN_ABI, functionName: "approve",
      args: [SHUFFLER_RAFFLE_ADDRESS, BigInt(tokenId)],
    });
  }

  function create() {
    if (creationFee === undefined) return;
    createWrite.reset();
    const durationSeconds = BigInt(Math.round(Number(days) * 86400));
    createWrite.writeContract({
      address: SHUFFLER_RAFFLE_ADDRESS, abi: SHUFFLER_RAFFLE_ABI, functionName: "createRaffle",
      args: [
        [nftContract as `0x${string}`],
        [BigInt(tokenId)],
        durationSeconds,
        gated ? ELIGIBILITY.HOLDER_GATED : ELIGIBILITY.PUBLIC,
        gated ? (gatingCollection as `0x${string}`) : "0x0000000000000000000000000000000000000000",
      ],
      value: creationFee,
    });
  }

  const canApprove = isConnected && validNft && validTokenId && !isApproved;
  const canCreate = isConnected && validNft && validTokenId && validGating && validDuration && isApproved;

  if (createReceipt.isSuccess) {
    return (
      <div style={{ border: RULE, background: color.croc, color: color.paper, padding: "24px", textAlign: "center" }}>
        <p style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.1rem", margin: "0 0 8px" }}>Raffle created</p>
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
          <p style={{ fontFamily: font.mono, fontSize: "0.68rem", color: color.inkSoft, margin: "0 0 6px" }}>Prize NFT contract</p>
          <input value={nftContract} onChange={(e) => setNftContract(e.target.value)} placeholder="0x…" style={inputStyle} spellCheck={false} />
          {nftContract && !validNft && <p style={{ fontFamily: font.mono, fontSize: "0.66rem", color: color.tongue, margin: "6px 0 0" }}>Not a valid address.</p>}
        </div>

        <div>
          <p style={{ fontFamily: font.mono, fontSize: "0.68rem", color: color.inkSoft, margin: "0 0 6px" }}>Token ID</p>
          <input value={tokenId} onChange={(e) => setTokenId(e.target.value)} placeholder="1" style={inputStyle} />
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

        {!isApproved ? (
          <button
            onClick={approve}
            disabled={!canApprove || approveWrite.isPending || approveReceipt.isLoading}
            className={canApprove ? "press" : undefined}
            style={{
              width: "100%", padding: "13px", border: RULE, cursor: canApprove ? "pointer" : "not-allowed",
              background: canApprove ? color.sun : color.paperDeep, color: color.ink,
              fontFamily: font.display, fontWeight: 700, fontSize: "0.9rem",
            }}
          >
            {approveWrite.isPending ? "Confirm in wallet…" : approveReceipt.isLoading ? "Approving…" : "1. Approve NFT transfer"}
          </button>
        ) : (
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
        )}

        {(approveWrite.error || createWrite.error) && (
          <p style={{ fontFamily: font.mono, fontSize: "0.7rem", color: color.tongue }}>
            {(approveWrite.error as any)?.shortMessage ?? (createWrite.error as any)?.shortMessage ?? "Transaction failed."}
          </p>
        )}

        <p style={{ fontFamily: font.mono, fontSize: "0.64rem", color: color.inkFaint, lineHeight: 1.5, margin: 0 }}>
          Approving lets the raffle contract move this one specific token — it doesn't touch anything else in your wallet.
          The NFT moves into escrow the moment you create the raffle, not before.
        </p>
      </div>
    </div>
  );
}
