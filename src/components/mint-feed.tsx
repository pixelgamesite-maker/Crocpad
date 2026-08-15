import { useEffect, useState } from "react";
import { useWatchContractEvent } from "wagmi";
import { color, font, RULE } from "@/lib/theme";
import { CROCSPAD_ADDRESS } from "@/lib/crocsPadContract";

type FeedRow = { tokenId: string; to: string; key: string };

const TRANSFER_EVENT = [
  {
    type: "event",
    name: "Transfer",
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: true, name: "tokenId", type: "uint256" },
    ],
  },
] as const;

const ZERO = "0x0000000000000000000000000000000000000000";

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export default function MintFeed() {
  const [rows, setRows] = useState<FeedRow[]>([]);

  useWatchContractEvent({
    address: CROCSPAD_ADDRESS,
    abi: TRANSFER_EVENT,
    eventName: "Transfer",
    onLogs(logs) {
      const mints = logs
        .filter((l: any) => l.args?.from?.toLowerCase() === ZERO)
        .map((l: any) => ({
          tokenId: String(l.args.tokenId),
          to: l.args.to as string,
          key: `${l.transactionHash}-${l.args.tokenId}`,
        }));
      if (mints.length === 0) return;
      setRows((prev) => {
        const seen = new Set(prev.map((r) => r.key));
        const fresh = mints.filter((m) => !seen.has(m.key));
        return [...fresh.reverse(), ...prev].slice(0, 12);
      });
    },
  });

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
