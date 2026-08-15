import { color, font, RULE } from "@/lib/theme";
import { PHASE } from "@/lib/crocsPadContract";

type Elig = "idle" | "checking" | "yes" | "no" | "error";

function num(v: unknown) {
  return v === undefined || v === null ? null : Number(v);
}

function Track({
  name, minted, cap, capLabel, active, status, statusTone, accent,
}: {
  name: string;
  minted: number | null;
  cap: number | null;
  capLabel?: string;
  active: boolean;
  status?: string;
  statusTone?: "good" | "bad" | "muted";
  accent: string;
}) {
  const pct = minted !== null && cap ? Math.min(100, (minted / cap) * 100) : 0;

  return (
    <div
      style={{
        borderBottom: RULE,
        background: active ? color.paperDeep : "transparent",
        padding: "14px 18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "9px" }}>
        <span
          style={{
            width: "9px", height: "9px", flexShrink: 0,
            background: active ? accent : color.inkFaint,
            animation: active ? "blink 1.6s step-end infinite" : "none",
          }}
        />
        <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.01em" }}>
          {name}
        </span>

        <span style={{ marginLeft: "auto", fontFamily: font.mono, fontSize: "0.8rem", whiteSpace: "nowrap" }}>
          {minted !== null ? minted.toLocaleString() : "—"}
          <span style={{ color: color.inkFaint }}>
            {" / "}{capLabel ?? (cap !== null ? cap.toLocaleString() : "—")}
          </span>
        </span>
      </div>

      <div style={{ height: "7px", border: `1px solid ${color.ink}`, background: color.paper, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: `${pct}%`, background: accent, transition: "width 0.5s cubic-bezier(0.2,0,0,1)" }} />
      </div>

      {status && (
        <p
          style={{
            fontFamily: font.mono, fontSize: "0.68rem", margin: "8px 0 0",
            color: statusTone === "good" ? color.croc : statusTone === "bad" ? color.tongue : color.inkSoft,
          }}
        >
          {status}
        </p>
      )}
    </div>
  );
}

export default function PhaseTracks({
  phase, teamMinted, teamCap, allowlistMinted, allowlistCap,
  publicMinted, mintableSupply, elig, isConnected,
}: {
  phase: number;
  teamMinted: unknown; teamCap: unknown;
  allowlistMinted: unknown; allowlistCap: unknown;
  publicMinted: unknown; mintableSupply: unknown;
  elig: Elig;
  isConnected: boolean;
}) {
  const tMinted = num(teamMinted), tCap = num(teamCap);
  const alMinted = num(allowlistMinted), alCap = num(allowlistCap);
  const pubMinted = num(publicMinted), mintable = num(mintableSupply);

  // Public draws from whatever the allowlist didn't use — the contract
  // shares one pool between them, so the public ceiling isn't fixed.
  const publicCeiling = mintable !== null && alMinted !== null ? mintable - alMinted : null;

  function allowlistStatus(): [string, "good" | "bad" | "muted"] {
    // Before the whitelist phase opens, lead with when it opens rather
    // than eligibility — there's nothing to check yet.
    if (phase === PHASE.CLOSED) return ["Opens 4:10pm UTC", "muted"];
    if (phase !== PHASE.ALLOWLIST) return ["", "muted"];
    if (!isConnected) return ["Connect to check eligibility", "muted"];
    if (elig === "checking") return ["Checking your wallet…", "muted"];
    if (elig === "yes") return ["Eligible — you can mint", "good"];
    if (elig === "no") return ["This wallet isn't on the list", "bad"];
    if (elig === "error") return ["Eligibility check unavailable", "bad"];
    return ["", "muted"];
  }

  const [alStatus, alTone] = allowlistStatus();

  return (
    <section style={{ border: RULE, background: color.paper }}>
      <div style={{ padding: "13px 18px", borderBottom: RULE }}>
        <span style={{ fontFamily: font.mono, fontSize: "0.64rem", letterSpacing: "0.16em", textTransform: "uppercase", color: color.inkSoft }}>
          Supply tracks
        </span>
      </div>

      <Track
        name="Team"
        minted={tMinted}
        cap={tCap}
        active={false}
        accent={color.inkSoft}
        status="Reserved. Minted by the team, not open to the public."
        statusTone="muted"
      />

      <Track
        name="Whitelist"
        minted={alMinted}
        cap={alCap}
        active={phase === PHASE.ALLOWLIST}
        accent={color.croc}
        status={alStatus || undefined}
        statusTone={alTone}
      />

      <Track
        name="Public"
        minted={pubMinted}
        cap={publicCeiling}
        capLabel={publicCeiling !== null ? publicCeiling.toLocaleString() : undefined}
        active={phase === PHASE.PUBLIC}
        accent={color.sun}
        status={
          phase === PHASE.PUBLIC
            ? "Open to everyone — no allowlist needed"
            : "Unminted whitelist supply rolls into this phase"
        }
        statusTone={phase === PHASE.PUBLIC ? "good" : "muted"}
      />

      <div style={{ padding: "12px 18px" }}>
        <p style={{ fontFamily: font.mono, fontSize: "0.66rem", color: color.inkFaint, margin: 0, lineHeight: 1.5 }}>
          Whitelist and public share one pool of {mintable !== null ? mintable.toLocaleString() : "—"}.
        </p>
      </div>
    </section>
  );
}
