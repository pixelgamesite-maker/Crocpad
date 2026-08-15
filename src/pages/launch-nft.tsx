import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther } from "viem";
import { color, font, loadFonts } from "@/lib/theme";
import { CROCSPAD_ADDRESS, CROCSPAD_ABI, ALLOWLIST_API_URL, PHASE } from "@/lib/crocsPadContract";
import SignInButton from "@/components/sign-in-button";

const PHASE_LABEL: Record<number, string> = {
  [PHASE.CLOSED]: "Not Open Yet",
  [PHASE.ALLOWLIST]: "Allowlist Mint",
  [PHASE.PUBLIC]: "Public Mint",
};

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export default function LaunchNFT() {
  useEffect(() => { loadFonts(); }, []);

  const { address, isConnected } = useAccount();

  const { data, refetch } = useReadContracts({
    contracts: [
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "phase" },
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "paused" },
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "allowlistPrice" },
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "publicPrice" },
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "launchpadFee" },
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "maxPerWalletAllowlist" },
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "maxPerWalletPublic" },
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "totalAllowlistMinted" },
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "totalPublicMinted" },
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "totalSupply" },
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "MAX_SUPPLY" },
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "ALLOWLIST_SUPPLY_CAP" },
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "MINTABLE_SUPPLY" },
      { address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "allowlistTimeRemaining" },
      {
        address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "allowlistMinted",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
      },
      {
        address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "publicMinted",
        args: [address ?? "0x0000000000000000000000000000000000000000"],
      },
    ],
    query: { refetchInterval: 15000 },
  });

  const [
    phase, paused, allowlistPrice, publicPrice, launchpadFee,
    maxPerWalletAllowlist, maxPerWalletPublic, totalAllowlistMinted, totalPublicMinted,
    totalSupply, maxSupply, allowlistCap, mintableSupply, allowlistTimeRemaining,
    myAllowlistMinted, myPublicMinted,
  ] = data?.map((d) => d.result) ?? [];

  const phaseNum = phase !== undefined ? Number(phase) : PHASE.CLOSED;

  // Live-ticking countdown, resynced from the contract every 15s via refetchInterval above.
  const [displaySeconds, setDisplaySeconds] = useState<number | null>(null);
  useEffect(() => {
    if (allowlistTimeRemaining === undefined) return;
    setDisplaySeconds(Number(allowlistTimeRemaining));
  }, [allowlistTimeRemaining]);
  useEffect(() => {
    if (displaySeconds === null || displaySeconds <= 0) return;
    const id = setInterval(() => setDisplaySeconds((s) => (s !== null ? Math.max(0, s - 1) : s)), 1000);
    return () => clearInterval(id);
  }, [displaySeconds]);

  // Eligibility check against the private allowlist API — only ever
  // reveals whether THIS connected address is eligible, never the list.
  const [eligibility, setEligibility] = useState<"idle" | "checking" | "eligible" | "ineligible" | "error">("idle");
  const [proof, setProof] = useState<string[] | null>(null);

  useEffect(() => {
    if (!isConnected || !address || phaseNum !== PHASE.ALLOWLIST) {
      setEligibility("idle");
      setProof(null);
      return;
    }
    let cancelled = false;
    setEligibility("checking");
    fetch(`${ALLOWLIST_API_URL}/api/allowlist-proof?address=${address}`)
      .then((res) => {
        if (!res.ok) throw new Error("lookup failed");
        return res.json();
      })
      .then(({ eligible, proof: p }) => {
        if (cancelled) return;
        setEligibility(eligible ? "eligible" : "ineligible");
        setProof(p);
      })
      .catch(() => {
        if (!cancelled) setEligibility("error");
      });
    return () => { cancelled = true; };
  }, [isConnected, address, phaseNum]);

  const [quantity, setQuantity] = useState(1);
  const { writeContract, data: txHash, isPending, error: writeError, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  useEffect(() => {
    if (isSuccess) refetch();
  }, [isSuccess]);

  const price = phaseNum === PHASE.ALLOWLIST ? allowlistPrice : publicPrice;
  const perWalletMax = phaseNum === PHASE.ALLOWLIST ? maxPerWalletAllowlist : maxPerWalletPublic;
  const myMinted = phaseNum === PHASE.ALLOWLIST ? myAllowlistMinted : myPublicMinted;
  const myRemaining =
    perWalletMax !== undefined && myMinted !== undefined ? Number(perWalletMax) - Number(myMinted) : null;

  const remainingInPool =
    mintableSupply !== undefined && totalAllowlistMinted !== undefined && totalPublicMinted !== undefined
      ? Number(mintableSupply) - Number(totalAllowlistMinted) - Number(totalPublicMinted)
      : null;

  const totalCost =
    price !== undefined && launchpadFee !== undefined
      ? formatEther((BigInt(price) + BigInt(launchpadFee)) * BigInt(quantity))
      : null;

  const canMint =
    isConnected &&
    !paused &&
    (phaseNum === PHASE.PUBLIC || (phaseNum === PHASE.ALLOWLIST && eligibility === "eligible" && proof)) &&
    quantity > 0 &&
    (myRemaining === null || quantity <= myRemaining) &&
    (remainingInPool === null || quantity <= remainingInPool);

  function handleMint() {
    if (!price || launchpadFee === undefined) return;
    const value = (BigInt(price) + BigInt(launchpadFee)) * BigInt(quantity);
    reset();
    if (phaseNum === PHASE.ALLOWLIST && proof) {
      writeContract({
        address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "mintAllowlist",
        args: [BigInt(quantity), proof as `0x${string}`[]], value,
      });
    } else if (phaseNum === PHASE.PUBLIC) {
      writeContract({
        address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "mintPublic",
        args: [BigInt(quantity)], value,
      });
    }
  }

  return (
    <div style={{ background: color.bg, minHeight: "100vh", fontFamily: font.body, color: color.text, padding: "0 20px" }}>
      <style>{`*{box-sizing:border-box;} a{color:inherit;}`}</style>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "50px 0 90px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
          <Link href="/terminal">
            <a style={{ fontFamily: font.mono, fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: color.textMuted, textDecoration: "none" }}>
              ← Back to Terminal
            </a>
          </Link>
          <SignInButton />
        </div>

        {/* status card */}
        <div style={{ background: color.panel, border: `1px solid ${color.border}`, borderRadius: "14px", overflow: "hidden", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${color.border}` }}>
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.1rem" }}>Crocs</span>
            <span
              style={{
                fontFamily: font.mono, fontSize: "0.64rem", letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "6px 12px", borderRadius: "999px",
                color: phaseNum === PHASE.CLOSED ? color.textFaint : color.bg,
                background: phaseNum === PHASE.CLOSED ? "transparent" : color.lime,
                border: phaseNum === PHASE.CLOSED ? `1px solid ${color.borderStrong}` : "none",
              }}
            >
              {paused ? "Paused" : PHASE_LABEL[phaseNum]}
            </span>
          </div>

          <div style={{ padding: "20px" }}>
            {/* supply */}
            <div style={{ marginBottom: phaseNum === PHASE.ALLOWLIST ? "18px" : "0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: font.mono, fontSize: "0.72rem", color: color.textMuted, marginBottom: "6px" }}>
                <span>MINTED</span>
                <span>{totalSupply !== undefined ? Number(totalSupply) : "—"} / {maxSupply !== undefined ? Number(maxSupply) : "—"}</span>
              </div>
              <div style={{ height: "6px", background: color.border, borderRadius: "3px", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%", background: color.lime, transition: "width 0.4s ease",
                    width: totalSupply !== undefined && maxSupply ? `${(Number(totalSupply) / Number(maxSupply)) * 100}%` : "0%",
                  }}
                />
              </div>
            </div>

            {/* countdown — only during allowlist */}
            {phaseNum === PHASE.ALLOWLIST && displaySeconds !== null && (
              <div style={{ textAlign: "center", padding: "14px 0", borderTop: `1px solid ${color.border}` }}>
                <p style={{ fontFamily: font.mono, fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: color.textFaint, margin: "0 0 6px" }}>
                  {displaySeconds > 0 ? "Suggested Window Remaining" : "Suggested Window Elapsed"}
                </p>
                <p style={{ fontFamily: font.mono, fontSize: "1.8rem", fontWeight: 600, color: displaySeconds > 0 ? color.lime : color.textFaint, margin: 0 }}>
                  {formatDuration(displaySeconds)}
                </p>
                <p style={{ fontSize: "0.68rem", color: color.textFaint, margin: "6px 0 0" }}>
                  Minting stays open until the team manually starts the next phase.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* eligibility indicator — allowlist phase only */}
        {phaseNum === PHASE.ALLOWLIST && isConnected && (
          <div
            style={{
              display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", borderRadius: "10px", marginBottom: "20px",
              background:
                eligibility === "eligible" ? "rgba(198,255,61,0.08)" :
                eligibility === "ineligible" ? "rgba(255,107,92,0.08)" : "transparent",
              border: `1px solid ${
                eligibility === "eligible" ? color.lime :
                eligibility === "ineligible" ? color.danger : color.border
              }`,
            }}
          >
            <span
              style={{
                width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                background:
                  eligibility === "eligible" ? color.lime :
                  eligibility === "ineligible" ? color.danger :
                  eligibility === "checking" ? color.amber : color.textFaint,
              }}
            />
            <span style={{ fontFamily: font.mono, fontSize: "0.76rem" }}>
              {eligibility === "checking" && "Checking eligibility..."}
              {eligibility === "eligible" && "You're on the allowlist"}
              {eligibility === "ineligible" && "This wallet isn't on the allowlist"}
              {eligibility === "error" && "Couldn't check eligibility — try again shortly"}
            </span>
          </div>
        )}

        {/* mint controls */}
        {phaseNum === PHASE.CLOSED ? (
          <div style={{ textAlign: "center", padding: "30px 0", color: color.textMuted, fontSize: "0.9rem" }}>
            Minting hasn't opened yet. Check back soon.
          </div>
        ) : (
          <div style={{ background: color.panel, border: `1px solid ${color.border}`, borderRadius: "14px", padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <span style={{ fontFamily: font.mono, fontSize: "0.72rem", color: color.textMuted }}>QUANTITY</span>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={{ width: "30px", height: "30px", borderRadius: "8px", background: color.panelRaised, border: `1px solid ${color.border}`, color: color.text, cursor: "pointer" }}>−</button>
                <span style={{ fontFamily: font.mono, fontSize: "1rem", minWidth: "20px", textAlign: "center" }}>{quantity}</span>
                <button onClick={() => setQuantity((q) => q + 1)} style={{ width: "30px", height: "30px", borderRadius: "8px", background: color.panelRaised, border: `1px solid ${color.border}`, color: color.text, cursor: "pointer" }}>+</button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: font.mono, fontSize: "0.8rem", marginBottom: "18px" }}>
              <span style={{ color: color.textMuted }}>Total ({phaseNum === PHASE.ALLOWLIST ? "free + fee" : "price + fee"})</span>
              <span>{totalCost ? `${totalCost} ETH` : "—"}</span>
            </div>

            <button
              disabled={!canMint || isPending || isConfirming}
              onClick={handleMint}
              style={{
                width: "100%", padding: "15px", borderRadius: "8px", border: "none",
                fontFamily: font.mono, fontWeight: 600, fontSize: "0.76rem", letterSpacing: "0.08em", textTransform: "uppercase",
                color: canMint ? color.bg : color.textFaint,
                background: canMint ? color.lime : "rgba(255,255,255,0.04)",
                cursor: canMint && !isPending && !isConfirming ? "pointer" : "not-allowed",
              }}
            >
              {!isConnected ? "Connect wallet to mint" :
                paused ? "Minting paused" :
                phaseNum === PHASE.ALLOWLIST && eligibility === "ineligible" ? "Not eligible" :
                phaseNum === PHASE.ALLOWLIST && eligibility === "checking" ? "Checking eligibility..." :
                isPending ? "Confirm in wallet..." :
                isConfirming ? "Minting..." :
                "Mint"}
            </button>

            {writeError && (
              <p style={{ fontSize: "0.74rem", color: color.danger, marginTop: "12px" }}>
                {(writeError as any).shortMessage ?? "Transaction failed. Try again."}
              </p>
            )}
            {isSuccess && (
              <p style={{ fontSize: "0.74rem", color: color.lime, marginTop: "12px" }}>Mint successful.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
