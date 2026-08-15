import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { isAddress } from "viem";
import { color, font, RULE, offset } from "@/lib/theme";
import { CROCSPAD_ADDRESS, CROCSPAD_ABI, TEAM_WALLETS } from "@/lib/crocsPadContract";

/**
 * Team allocation mint. Renders only for the contract owner.
 *
 * Worth knowing: the contract uses OpenZeppelin Ownable, so exactly one
 * address can call ownerMint — the deployer. Other team wallets can
 * receive tokens but can't trigger the mint themselves, which is why
 * this takes a recipient rather than always minting to the signer.
 *
 * ownerMint has no phase check, so this works even while the sale is
 * Closed. It does respect the pause switch.
 */
export default function TeamMint({
  owner,
  teamMinted,
  teamCap,
  onMinted,
}: {
  owner?: unknown;
  teamMinted?: unknown;
  teamCap?: unknown;
  onMinted: () => void;
}) {
  const { address, isConnected } = useAccount();
  const [to, setTo] = useState<string>("");
  const [qty, setQty] = useState(1);

  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const isOwner =
    isConnected &&
    typeof owner === "string" &&
    !!address &&
    owner.toLowerCase() === address.toLowerCase();

  if (!isOwner) return null;

  const minted = teamMinted !== undefined ? Number(teamMinted) : null;
  const cap = teamCap !== undefined ? Number(teamCap) : null;
  const left = minted !== null && cap !== null ? cap - minted : null;

  const recipient = to.trim() || address || "";
  const recipientValid = isAddress(recipient);
  const qtyValid = qty > 0 && (left === null || qty <= left);
  const canMint = recipientValid && qtyValid && !isPending && !confirming;

  function mint() {
    if (!canMint) return;
    reset();
    writeContract({
      address: CROCSPAD_ADDRESS,
      abi: CROCSPAD_ABI,
      functionName: "ownerMint",
      args: [recipient as `0x${string}`, BigInt(qty)],
    });
  }

  if (isSuccess) onMinted();

  const input: React.CSSProperties = {
    width: "100%", padding: "11px 12px", border: RULE, background: color.paper,
    fontFamily: font.mono, fontSize: "0.8rem", color: color.ink, outline: "none",
  };

  return (
    <section style={{ border: RULE, background: color.paper, boxShadow: offset(color.inkSoft) }}>
      <div style={{ padding: "13px 18px", borderBottom: RULE, background: color.ink, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: font.mono, fontSize: "0.64rem", letterSpacing: "0.16em", textTransform: "uppercase", color: color.paper }}>
          Team mint · owner only
        </span>
        <span style={{ fontFamily: font.mono, fontSize: "0.72rem", color: color.paper }}>
          {minted ?? "—"} / {cap ?? "—"}
        </span>
      </div>

      <div style={{ padding: "18px" }}>
        <p style={{ fontFamily: font.mono, fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 8px" }}>
          Send to
        </p>

        <div style={{ display: "flex", gap: "6px", marginBottom: "8px", flexWrap: "wrap" }}>
          {TEAM_WALLETS.map((w) => {
            const on = recipient.toLowerCase() === w.toLowerCase();
            return (
              <button
                key={w}
                onClick={() => setTo(w)}
                style={{
                  fontFamily: font.mono, fontSize: "0.66rem", padding: "7px 10px",
                  border: RULE, cursor: "pointer",
                  background: on ? color.ink : color.paper,
                  color: on ? color.paper : color.ink,
                }}
              >
                {w.slice(0, 6)}…{w.slice(-4)}
              </button>
            );
          })}
        </div>

        <input
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder={address ?? "0x…"}
          style={input}
          spellCheck={false}
        />
        {to.trim() !== "" && !recipientValid && (
          <p style={{ fontFamily: font.mono, fontSize: "0.68rem", color: color.tongue, margin: "7px 0 0" }}>
            Not a valid address.
          </p>
        )}

        <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", marginTop: "16px" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: font.mono, fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 8px" }}>
              Amount {left !== null && <span style={{ color: color.inkFaint }}>({left} left)</span>}
            </p>
            <input
              type="number"
              min={1}
              max={left ?? undefined}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              style={input}
            />
          </div>
          <button
            onClick={mint}
            disabled={!canMint}
            className={canMint ? "press" : undefined}
            style={{
              padding: "12px 22px", border: RULE, whiteSpace: "nowrap",
              fontFamily: font.display, fontWeight: 700, fontSize: "0.92rem",
              cursor: canMint ? "pointer" : "not-allowed",
              background: canMint ? color.ink : color.paperDeep,
              color: canMint ? color.paper : color.inkFaint,
              boxShadow: canMint ? offset(color.sun, 4, 4) : "none",
            }}
          >
            {isPending ? "Confirm…" : confirming ? "Minting…" : "Mint"}
          </button>
        </div>

        {error && (
          <p style={{ fontFamily: font.mono, fontSize: "0.7rem", color: color.tongue, margin: "12px 0 0" }}>
            {(error as any).shortMessage ?? "Transaction failed."}
          </p>
        )}
        {isSuccess && (
          <p style={{ fontFamily: font.mono, fontSize: "0.7rem", color: color.croc, margin: "12px 0 0" }}>
            Minted to {recipient.slice(0, 6)}…{recipient.slice(-4)}.
          </p>
        )}

        <p style={{ fontFamily: font.mono, fontSize: "0.64rem", color: color.inkFaint, margin: "14px 0 0", lineHeight: 1.5 }}>
          Works in any phase, including before the sale opens. Only the owner wallet can sign this.
        </p>
      </div>
    </section>
  );
}
