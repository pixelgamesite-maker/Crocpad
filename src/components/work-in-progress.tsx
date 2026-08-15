import { useEffect, useState } from "react";

import { color, font, RULE, offset } from "@/lib/theme";
import NavLink from "@/components/nav-link";

/**
 * Shared shell for sections that aren't built yet. The status line
 * cycles through the actual remaining work for that section rather than
 * a fake percentage — it communicates "this is being built and here's
 * what's involved" without implying a completion figure we can't back.
 */
export default function WorkInProgress({
  title,
  summary,
  stages,
  accent = color.croc,
}: {
  title: string;
  summary: string;
  stages: string[];
  accent?: string;
}) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setStage((s) => (s + 1) % stages.length), 2600);
    return () => clearInterval(id);
  }, [stages.length]);

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "70px 22px 40px" }}>
      <p
        style={{
          fontFamily: font.mono, fontSize: "0.7rem", letterSpacing: "0.18em",
          textTransform: "uppercase", color: color.inkSoft, margin: "0 0 14px",
        }}
      >
        In development
      </p>

      <h1
        style={{
          fontFamily: font.display, fontWeight: 800,
          fontSize: "clamp(2.6rem, 9vw, 4.4rem)", lineHeight: 0.94,
          letterSpacing: "-0.035em", margin: "0 0 22px",
        }}
      >
        {title}
      </h1>

      <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: color.inkSoft, margin: "0 0 44px", maxWidth: "56ch" }}>
        {summary}
      </p>

      {/* build status */}
      <div style={{ border: RULE, background: color.paperDeep, boxShadow: offset(accent) }}>
        <div style={{ padding: "18px 20px", borderBottom: RULE, display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ width: "8px", height: "8px", background: accent, animation: "blink 1.4s step-end infinite" }} />
          <span style={{ fontFamily: font.mono, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Currently building
          </span>
        </div>

        <div style={{ padding: "22px 20px" }}>
          <p
            key={stage}
            style={{
              fontFamily: font.mono, fontSize: "0.9rem", margin: "0 0 18px",
              animation: "feedIn 0.3s ease both",
            }}
          >
            {stages[stage]}
          </p>

          {/* indeterminate sweep — deliberately not a percentage */}
          <div style={{ height: "10px", border: RULE, background: color.paper, overflow: "hidden", position: "relative" }}>
            <div
              style={{
                position: "absolute", top: 0, bottom: 0, width: "25%",
                background: accent,
                animation: "sweep 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
              }}
            />
          </div>

          <p style={{ fontFamily: font.mono, fontSize: "0.66rem", color: color.inkFaint, margin: "12px 0 0", letterSpacing: "0.04em" }}>
            No date announced yet. Follow the collection for updates.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "34px", flexWrap: "wrap" }}>
        <NavLink href="/mint" className="press"
            style={{
              fontFamily: font.display, fontWeight: 700, fontSize: "0.9rem",
              padding: "14px 24px", border: RULE, background: color.ink, color: color.paper,
              boxShadow: offset(color.croc, 5, 5),
            }}>
            Go to mint
          </NavLink>
        <NavLink href="/" className="press"
            style={{
              fontFamily: font.display, fontWeight: 700, fontSize: "0.9rem",
              padding: "14px 24px", border: RULE, background: color.paper,
              boxShadow: offset(color.ink, 5, 5),
            }}>
            Back home
          </NavLink>
      </div>
    </div>
  );
}
