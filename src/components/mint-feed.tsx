import { useEffect, useRef, useState } from "react";
import { useReadContract, usePublicClient } from "wagmi";
import { color, font, RULE } from "@/lib/theme";
import { CROCSPAD_ADDRESS, CROCSPAD_ABI } from "@/lib/crocsPadContract";

type FeedRow = { tokenId: string; to: string; key: string };

// Not in the shared ABI — only needed here, so kept local.
const OWNER_OF_ABI = [
  {
    type: "function",
    name: "ownerOf",
    stateMutability: "view",
    inputs: [{ type: "uint256", name: "tokenId" }],
    outputs: [{ type: "address" }],
  },
] as const;

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function MintFeed() {
  const publicClient = usePublicClient();
  const [rows, setRows] = useState<FeedRow[]>([]);
  const lastSupply = useRef<number | null>(null);

  // Pure eth_call, polled — same proven-working path as the mint page's numbers.
  const { data: totalSupply } = useReadContract({
    address: CROCSPAD_ADDRESS,
    abi: CROCSPAD_ABI,
    functionName: "totalSupply",
    query: { refetchInterval: 8000 },
  });

  useEffect(() => {
    if (totalSupply === undefined || !publicClient) return;
    const supply = Number(totalSupply);

    // First read just sets the baseline — nothing to diff against yet.
    if (lastSupply.current === null) {
      lastSupply.current = supply;
      return;
    }

    const prevSupply = lastSupply.current;
    if (supply <= prevSupply) {
      lastSupply.current = supply;
      return;
    }

    lastSupply.current = supply;

    // ERC721A mints sequentially, so [prevSupply, supply) are the new token IDs.
    // Token IDs may start at 0 or 1 depending on the contract — this assumes 0-indexed;
    // flip to prevSupply + 1 .. supply if yours starts at 1.
    const newIds = Array.from({ length: supply - prevSupply }, (_, i) => prevSupply + i);

    let cancelled = false;
    (async () => {
      const results = await Promise.all(
        newIds.map(async (id) => {
          try {
            const owner = await publicClient.readContract({
              address: CROCSPAD_ADDRESS,
              abi: OWNER_OF_ABI,
              functionName: "ownerOf",
              args: [BigInt(id)],
            });
            return { tokenId: String(id), to: owner as string, key: `${id}-${owner}` };
          } catch {
            return null;
          }
        })
      );
      if (cancelled) return;
      const fresh = results.filter((r): r is FeedRow => r !== null);
      if (fresh.length === 0) return;
      setRows((prev) => {
        const seen = new Set(prev.map((r) => r.key));
        const dedup = fresh.filter((f) => !seen.has(f.key));
        return [...dedup.reverse(), ...prev].slice(0, 12);
      });
    })();

    return () => { cancelled = true; };
  }, [totalSupply, publicClient]);

  return (
    <section style={{ border: RULE, background: color.paper }}>
      <div
        style={{
          padding: "14px 18px", borderBottom: RULE,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" }}>
          Live mints
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "7px", fontFamily: font.mono, fontSize: "0.64rem", letterSpacing: "0.12em", textTransform: "uppercase", color: color.inkSoft }}>
          <span style={{ width: "7px", height: "7px", background: color.croc, animation: "blink 1.4s step-end infinite" }} />
          Live
        </span>
      </div>

      {rows.length === 0 ? (
        <p style={{ fontFamily: font.mono, fontSize: "0.78rem", color: color.inkFaint, padding: "26px 18px", margin: 0, textAlign: "center" }}>
          Waiting for the first mint.
        </p>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: "260px", overflowY: "auto" }}>
          {rows.map((r, i) => (
            <li
              key={r.key}
              style={{
                display: "flex", justifyContent: "space-between", gap: "12px",
                padding: "12px 18px",
                borderBottom: i === rows.length - 1 ? "none" : `1px solid ${color.paperDeep}`,
                background: i % 2 ? color.paperDeep : "transparent",
                fontFamily: font.mono, fontSize: "0.76rem",
                animation: "feedIn 0.3s ease both",
              }}
            >
              <span style={{ fontWeight: 500 }}>Croc #{r.tokenId}</span>
              <span style={{ color: color.inkSoft }}>{short(r.to)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
