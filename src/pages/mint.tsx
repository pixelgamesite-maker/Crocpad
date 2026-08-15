import { useEffect, useState } from "react";
import { useAccount, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther } from "viem";
import { color, font, RULE, offset } from "@/lib/theme";
import { CROCSPAD_ADDRESS, CROCSPAD_ABI, ALLOWLIST_API_URL, PHASE } from "@/lib/crocsPadContract";
import CrocFrame from "@/components/croc-frame";
import MintFeed from "@/components/mint-feed";
import PhaseTracks from "@/components/phase-tracks";
import TeamMint from "@/components/team-mint";

const PHASE_LABEL: Record<number, string> = {
  [PHASE.CLOSED]: "Not open",
  [PHASE.ALLOWLIST]: "Whitelist live",
  [PHASE.PUBLIC]: "Public live",
};

const ZERO = "0x0000000000000000000000000000000000000000" as const;

export default function Mint() {
  const { address, isConnected } = useAccount();

  const read = (functionName: string, args?: readonly unknown[]) =>
    ({ address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName, ...(args ? { args } : {}) });

  const { data, refetch } = useReadContracts({
    contracts: [
      read("owner"),
      read("phase"),
      read("paused"),
      read("allowlistPrice"),
      read("publicPrice"),
      read("launchpadFee"),
      read("maxPerWalletAllowlist"),
      read("maxPerWalletPublic"),
      read("totalAllowlistMinted"),
      read("totalPublicMinted"),
      read("totalTeamMinted"),
      read("totalSupply"),
      read("MAX_SUPPLY"),
      read("TEAM_ALLOCATION"),
      read("ALLOWLIST_SUPPLY_CAP"),
      read("MINTABLE_SUPPLY"),
      read("allowlistMinted", [address ?? ZERO]),
      read("publicMinted", [address ?? ZERO]),
    ] as any,
    query: { refetchInterval: 12000 },
  });

  const [
    owner, phase, paused, allowlistPrice, publicPrice, launchpadFee,
    maxAL, maxPub, totalAL, totalPub, totalTeam, totalSupply,
    maxSupply, teamCap, alCap, mintableSupply, myAL, myPub,
  ] = data?.map((d) => d.result) ?? [];

  const phaseNum = phase !== undefined ? Number(phase) : PHASE.CLOSED;
  const isAllowlist = phaseNum === PHASE.ALLOWLIST;

  /* ---- eligibility ---- */
  const [elig, setElig] = useState<"idle" | "checking" | "yes" | "no" | "error">("idle");
  const [proof, setProof] = useState<string[] | null>(null);

  useEffect(() => {
    if (!isConnected || !address || !isAllowlist) { setElig("idle"); setProof(null); return; }
    let cancelled = false;
    setElig("checking");
    fetch(`${ALLOWLIST_API_URL}/api/allowlist-proof?address=${address}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(({ eligible, proof: p }) => {
        if (cancelled) return;
        setElig(eligible ? "yes" : "no");
        setProof(p);
      })
      .catch(() => { if (!cancelled) setElig("error"); });
    return () => { cancelled = true; };
  }, [isConnected, address, isAllowlist]);

  /* ---- mint ---- */
  const [qty, setQty] = useState(1);
  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => { if (isSuccess) refetch(); }, [isSuccess]);

  const price = isAllowlist ? allowlistPrice : publicPrice;
  const walletCap = isAllowlist ? maxAL : maxPub;
  const mine = isAllowlist ? myAL : myPub;
  const myLeft = walletCap !== undefined && mine !== undefined ? Number(walletCap) - Number(mine) : null;

  const poolLeft =
    mintableSupply !== undefined && totalAL !== undefined && totalPub !== undefined
      ? Number(mintableSupply) - Number(totalAL) - Number(totalPub)
      : null;

  const unitCost = price !== undefined && launchpadFee !== undefined ? BigInt(price as bigint) + BigInt(launchpadFee as bigint) : null;
  const totalCost = unitCost !== null ? formatEther(unitCost * BigInt(qty)) : null;

  const saleOpen = phaseNum !== PHASE.CLOSED;
  const canMint =
    isConnected && !paused && saleOpen &&
    (phaseNum === PHASE.PUBLIC || (isAllowlist && elig === "yes" && !!proof)) &&
    qty > 0 && (myLeft === null || qty <= myLeft) && (poolLeft === null || qty <= poolLeft);

  function mint() {
    if (unitCost === null) return;
    reset();
    const value = unitCost * BigInt(qty);
    if (isAllowlist && proof) {
      writeContract({ address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "mintAllowlist", args: [BigInt(qty), proof as `0x${string}`[]], value });
    } else {
      writeContract({ address: CROCSPAD_ADDRESS, abi: CROCSPAD_ABI, functionName: "mintPublic", args: [BigInt(qty)], value });
    }
  }

  const minted = totalSupply !== undefined ? Number(totalSupply) : null;
  const supply = maxSupply !== undefined ? Number(maxSupply) : null;
  const pct = minted !== null && supply ? (minted / supply) * 100 : 0;

  function buttonLabel() {
    if (!isConnected) return "Connect wallet";
    if (paused) return "Minting paused";
    if (!saleOpen) return "Sale hasn't opened";
    if (isAllowlist && elig === "checking") return "Checking allowlist…";
    if (isAllowlist && elig === "no") return "Wallet not on allowlist";
    if (isAllowlist && elig === "error") return "Eligibility unavailable";
    if (myLeft !== null && myLeft <= 0) return "Wallet limit reached";
    if (isPending) return "Confirm in wallet";
    if (confirming) return "Minting…";
    return `Mint ${qty}`;
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "44px 22px 20px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "30px" }}>
        <div>
          <p style={{ fontFamily: font.mono, fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 10px" }}>
            Genesis collection
          </p>
          <h1 style={{ fontFamily: font.display, fontWeight: 800, fontSize: "clamp(2.8rem, 10vw, 4.6rem)", lineHeight: 0.9, letterSpacing: "-0.04em", margin: 0 }}>
            CROCS
          </h1>
        </div>
        <span
          style={{
            fontFamily: font.mono, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase",
            padding: "9px 16px", border: RULE,
            background: paused ? color.tongue : !saleOpen ? color.paper : color.croc,
            color: !saleOpen && !paused ? color.ink : color.paper,
          }}
        >
          {paused ? "Paused" : PHASE_LABEL[phaseNum]}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "26px", alignItems: "start" }}>
        {/* left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
          <CrocFrame size={380} />
          <MintFeed />
        </div>

        {/* right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* overall supply */}
          <section style={{ border: RULE, background: color.paper }}>
            <div style={{ padding: "20px 18px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }}>
                <span style={{ fontFamily: font.mono, fontSize: "0.66rem", letterSpacing: "0.14em", textTransform: "uppercase", color: color.inkSoft }}>
                  Total minted
                </span>
                <span style={{ fontFamily: font.display, fontWeight: 800, fontSize: "1.9rem", letterSpacing: "-0.03em" }}>
                  {minted !== null ? minted.toLocaleString() : "—"}
                  <span style={{ color: color.inkFaint, fontWeight: 600 }}> / {supply !== null ? supply.toLocaleString() : "—"}</span>
                </span>
              </div>

              <div style={{ height: "18px", border: RULE, background: color.paperDeep, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${pct}%`, background: color.croc, transition: "width 0.5s cubic-bezier(0.2,0,0,1)" }} />
                {[25, 50, 75].map((m) => (
                  <span key={m} style={{ position: "absolute", top: 0, bottom: 0, left: `${m}%`, width: "2px", background: color.ink, opacity: 0.35 }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontFamily: font.mono, fontSize: "0.6rem", color: color.inkFaint }}>
                <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
              </div>
            </div>
          </section>

          <PhaseTracks
            phase={phaseNum}
            teamMinted={totalTeam}
            teamCap={teamCap}
            allowlistMinted={totalAL}
            allowlistCap={alCap}
            publicMinted={totalPub}
            mintableSupply={mintableSupply}
            elig={elig}
            isConnected={isConnected}
          />

          {/* controls */}
          <section style={{ border: RULE, background: color.paper, boxShadow: offset(color.ink) }}>
            <div style={{ display: "flex", borderBottom: RULE }}>
              <div style={{ padding: "16px 18px", flex: 1 }}>
                <p style={{ fontFamily: font.mono, fontSize: "0.62rem", letterSpacing: "0.14em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 4px" }}>
                  Amount
                </p>
                <p style={{ fontFamily: font.display, fontWeight: 800, fontSize: "2rem", margin: 0, letterSpacing: "-0.03em" }}>{qty}</p>
              </div>
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease amount"
                style={{ width: "64px", borderLeft: RULE, background: color.paper, cursor: "pointer", fontSize: "1.5rem", borderTop: "none", borderRight: "none", borderBottom: "none" }}
              >−</button>
              <button
                onClick={() => setQty((q) => (myLeft !== null ? Math.min(Math.max(1, myLeft), q + 1) : q + 1))}
                aria-label="Increase amount"
                style={{ width: "64px", borderLeft: RULE, background: color.sun, cursor: "pointer", fontSize: "1.5rem", borderTop: "none", borderRight: "none", borderBottom: "none" }}
              >+</button>
            </div>

            <div style={{ padding: "16px 18px", display: "flex", justifyContent: "space-between", fontFamily: font.mono, fontSize: "0.82rem", borderBottom: RULE }}>
              <span style={{ color: color.inkSoft }}>Total incl. fee</span>
              <span style={{ fontWeight: 500 }}>{totalCost ? `${totalCost} ETH` : "—"}</span>
            </div>

            <div style={{ padding: "18px" }}>
              <button
                onClick={mint}
                disabled={!canMint || isPending || confirming}
                className={canMint ? "press" : undefined}
                style={{
                  width: "100%", padding: "18px", border: RULE,
                  cursor: canMint && !isPending && !confirming ? "pointer" : "not-allowed",
                  fontFamily: font.display, fontWeight: 800, fontSize: "1.05rem", letterSpacing: "-0.01em",
                  background: canMint ? color.ink : color.paperDeep,
                  color: canMint ? color.paper : color.inkFaint,
                  boxShadow: canMint ? offset(color.croc, 5, 5) : "none",
                }}
              >
                {buttonLabel()}
              </button>

              {writeError && (
                <p style={{ fontFamily: font.mono, fontSize: "0.72rem", color: color.tongue, margin: "12px 0 0" }}>
                  {(writeError as any).shortMessage ?? "Transaction failed. Try again."}
                </p>
              )}
              {isSuccess && (
                <p style={{ fontFamily: font.mono, fontSize: "0.72rem", color: color.croc, margin: "12px 0 0" }}>
                  Minted. Welcome to the swamp.
                </p>
              )}
            </div>
          </section>

          <TeamMint owner={owner} teamMinted={totalTeam} teamCap={teamCap} onMinted={refetch} />
        </div>
      </div>
    </div>
  );
}
