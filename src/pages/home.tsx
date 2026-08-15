
import { color, font, RULE, offset } from "@/lib/theme";
import CrocFrame from "@/components/croc-frame";
import { NAV } from "@/components/nav";
import NavLink from "@/components/nav-link";

const TICKER = [
  "6,000 GENESIS CROCS",
  "HAND DRAWN",
  "ROBINHOOD CHAIN",
  "7% ROYALTY",
  "ZERO CODE LAUNCHES",
  "FEES BACK TO HOLDERS",
];

/* The three things CrocPad actually does. Kept to three because a
   launchpad that claims more than it ships reads as noise. */
const PILLARS = [
  {
    title: "Launch without code",
    body: "Configure supply, pricing, and phases from a form. The contract deploys itself.",
    accent: color.croc,
  },
  {
    title: "Traits you actually own",
    body: "Artists list cosmetic traits. Buy one, equip it, and your Croc changes — the trait stays yours to resell.",
    accent: color.sun,
  },
  {
    title: "Fees return to holders",
    body: "Platform fees fund operations, and a share is distributed to genesis holders who meet the holding threshold.",
    accent: color.tongue,
  },
];

const SPECS: [string, string][] = [
  ["Supply", "6,000"],
  ["Allowlist", "Free"],
  ["Public", "0.0006 ETH"],
  ["Chain", "Robinhood"],
];

const SUPPLY_ROWS = [
  { label: "Team", count: "150", accent: color.inkSoft, note: "Reserved. Minted by the team, never sold." },
  { label: "Whitelist", count: "4,000", accent: color.croc, note: "Free to mint, 2 per wallet." },
  { label: "Public", count: "1,850+", accent: color.sun, note: "0.0006 ETH." },
];

export default function Home() {
  return (
    <>
      {/* ── hero ── */}
      <section style={{ borderBottom: RULE }}>
        <div
          style={{
            maxWidth: "1100px", margin: "0 auto", padding: "60px 22px 70px",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "48px", alignItems: "center",
          }}
        >
          <div>
            <p style={{ fontFamily: font.mono, fontSize: "0.72rem", letterSpacing: "0.18em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 18px" }}>
              Launchpad · Robinhood Chain
            </p>

            <h1
              style={{
                fontFamily: font.display, fontWeight: 800,
                fontSize: "clamp(3rem, 11vw, 5.4rem)", lineHeight: 0.88,
                letterSpacing: "-0.045em", margin: "0 0 24px",
              }}
            >
              Launch it<br />
              <span style={{ background: color.croc, color: color.paper, padding: "0 0.12em" }}>on chain</span><br />
              in minutes.
            </h1>

            <p style={{ fontSize: "1.1rem", lineHeight: 1.55, color: color.inkSoft, margin: "0 0 32px", maxWidth: "44ch" }}>
              CrocPad is a token and NFT launchpad built natively for Robinhood Chain.
              It starts with Crocs 6,000 hand-drawn genesis characters.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <NavLink href="/mint" className="press"
                  style={{
                    fontFamily: font.display, fontWeight: 800, fontSize: "1rem",
                    padding: "16px 30px", border: RULE,
                    background: color.ink, color: color.paper,
                    boxShadow: offset(color.croc, 6, 6),
                  }}>
                  Mint Crocs
                </NavLink>
              <NavLink href="/docs" className="press"
                  style={{
                    fontFamily: font.display, fontWeight: 700, fontSize: "1rem",
                    padding: "16px 30px", border: RULE, background: color.paper,
                    boxShadow: offset(color.ink, 6, 6),
                  }}>
                  Read the docs
                </NavLink>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <CrocFrame size={360} caption="8 of 6,000 · art rotates" />
          </div>
        </div>
      </section>

      {/* ── ticker ── */}
      <div style={{ borderBottom: RULE, background: color.ink, overflow: "hidden", padding: "12px 0" }}>
        <div className="ticker-track">
          {[0, 1].map((rep) => (
            <div key={rep} style={{ display: "flex" }} aria-hidden={rep === 1}>
              {TICKER.map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: font.mono, fontSize: "0.74rem", letterSpacing: "0.16em",
                    color: color.paper, padding: "0 26px", whiteSpace: "nowrap",
                  }}
                >
                  {t}
                  <span style={{ color: color.croc, marginLeft: "26px" }}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── spec strip ── */}
      <section style={{ borderBottom: RULE }}>
        <div
          style={{
            maxWidth: "1100px", margin: "0 auto",
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {SPECS.map(([label, value], i) => (
            <div
              key={label}
              style={{
                padding: "26px 22px",
                borderRight: i === SPECS.length - 1 ? "none" : RULE,
              }}
            >
              <p style={{ fontFamily: font.mono, fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 8px" }}>
                {label}
              </p>
              <p style={{ fontFamily: font.display, fontWeight: 800, fontSize: "1.7rem", margin: 0, letterSpacing: "-0.03em" }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── pillars ── */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "72px 22px" }}>
        <h2 style={{ fontFamily: font.display, fontWeight: 800, fontSize: "clamp(2rem, 6vw, 3rem)", letterSpacing: "-0.035em", margin: "0 0 44px", maxWidth: "18ch", lineHeight: 1 }}>
          What the pad does
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "26px" }}>
          {PILLARS.map((p) => (
            <article
              key={p.title}
              style={{ border: RULE, background: color.paper, boxShadow: offset(p.accent), padding: "26px 22px" }}
            >
              <div style={{ width: "30px", height: "10px", background: p.accent, marginBottom: "18px" }} />
              <h3 style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.25rem", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                {p.title}
              </h3>
              <p style={{ fontSize: "0.94rem", lineHeight: 1.55, color: color.inkSoft, margin: 0 }}>{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── how it works ── */}
      <section style={{ borderTop: RULE, background: color.paperDeep }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "68px 22px" }}>
          <h2 style={{ fontFamily: font.display, fontWeight: 800, fontSize: "clamp(2rem, 6vw, 3rem)", letterSpacing: "-0.035em", margin: "0 0 12px", lineHeight: 1 }}>
            How the mint runs
          </h2>
          <p style={{ color: color.inkSoft, fontSize: "1rem", margin: "0 0 40px", maxWidth: "52ch" }}>
            Two phases, one shared pool of supply. Whatever the whitelist doesn't take rolls
            straight into public.
          </p>

          <div style={{ border: RULE, background: color.paper }}>
            {SUPPLY_ROWS.map((r, i) => (
              <div
                key={r.label}
                style={{
                  display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "baseline",
                  justifyContent: "space-between", padding: "20px 22px",
                  borderBottom: i === SUPPLY_ROWS.length - 1 ? "none" : RULE,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "180px" }}>
                  <span style={{ width: "12px", height: "12px", background: r.accent, flexShrink: 0 }} />
                  <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.16rem", letterSpacing: "-0.02em" }}>
                    {r.label}
                  </span>
                </div>
                <span style={{ fontFamily: font.display, fontWeight: 800, fontSize: "1.5rem", letterSpacing: "-0.03em" }}>
                  {r.count}
                </span>
                <span style={{ fontSize: "0.9rem", color: color.inkSoft, flex: "1 1 260px", textAlign: "right" }}>
                  {r.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── section index ── */}
      <section style={{ borderTop: RULE, borderBottom: RULE, background: color.paperDeep }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "56px 22px" }}>
          <p style={{ fontFamily: font.mono, fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 26px" }}>
            Everything on the pad
          </p>

          <div style={{ border: RULE, background: color.paper }}>
            {NAV.map((item, i) => (
              <NavLink key={item.href} href={item.href} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "20px 22px",
                    borderBottom: i === NAV.length - 1 ? "none" : RULE,
                  }}>
                  <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.3rem", letterSpacing: "-0.02em" }}>
                    {item.label}
                  </span>
                  <span
                    style={{
                      fontFamily: font.mono, fontSize: "0.62rem", letterSpacing: "0.12em",
                      textTransform: "uppercase", padding: "5px 11px", border: RULE,
                      background: item.live ? color.croc : color.paper,
                      color: item.live ? color.paper : color.inkFaint,
                    }}
                  >
                    {item.live ? "Live" : "Building"}
                  </span>
                </NavLink>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
