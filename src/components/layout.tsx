import { useEffect } from "react";

import { color, font, loadFonts, RULE, X_URL } from "@/lib/theme";
import GlobalStyle from "@/components/global-style";
import Nav from "@/components/nav";
import NavLink from "@/components/nav-link";

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => { loadFonts(); }, []);

  return (
    <div style={{ background: color.paper, minHeight: "100vh", fontFamily: font.body, color: color.ink }}>
      <GlobalStyle />
      <Nav />
      <main>{children}</main>

      <footer style={{ borderTop: RULE, marginTop: "80px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 22px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "28px", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ fontFamily: font.display, fontWeight: 800, fontSize: "1.6rem", margin: "0 0 6px", letterSpacing: "-0.02em" }}>
                CROCPAD
              </p>
              <p style={{ fontFamily: font.mono, fontSize: "0.72rem", color: color.inkSoft, margin: 0, letterSpacing: "0.04em" }}>
                Launchpad on Robinhood Chain
              </p>
            </div>
            <div style={{ display: "flex", gap: "26px", fontFamily: font.mono, fontSize: "0.74rem" }}>
              <NavLink href="/mint">Mint</NavLink>
              <NavLink href="/docs">Docs</NavLink>
              <a href={X_URL} target="_blank" rel="noopener noreferrer">X</a>
            </div>
          </div>

          <p style={{ fontFamily: font.mono, fontSize: "0.66rem", color: color.inkFaint, marginTop: "34px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Chain 4663 · Mainnet
          </p>
        </div>
      </footer>
    </div>
  );
}
