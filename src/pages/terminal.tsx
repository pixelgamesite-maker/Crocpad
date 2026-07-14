import { useEffect } from "react";
import { Link } from "wouter";
import { color, font, loadFonts } from "@/lib/theme";

function IconCoin({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color.lime} strokeWidth="1.5" />
      <path
        d="M12 7.5V16.5M9.3 9.4C9.3 8.2 10.4 7.5 12 7.5C13.7 7.5 14.7 8.3 14.7 9.3C14.7 11.6 9.3 10.6 9.3 13C9.3 14 10.3 14.8 12 14.8C13.6 14.8 14.7 14.1 14.7 12.9"
        stroke={color.lime}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconFrame({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" stroke={color.lime} strokeWidth="1.5" />
      <circle cx="9" cy="9" r="1.6" stroke={color.lime} strokeWidth="1.3" />
      <path d="M4 16L9 12L13 15L20 9" stroke={color.lime} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TerminalCard({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link href={href}>
      <a
        style={{
          display: "block",
          background: color.panel,
          border: `1px solid ${color.border}`,
          borderRadius: "14px",
          padding: "28px 22px",
          textDecoration: "none",
          transition: "border-color 0.2s, transform 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.borderColor = color.lime;
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.borderColor = color.border;
          (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
        }}
      >
        <div style={{ marginBottom: "16px" }}>{icon}</div>
        <p style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.15rem", color: color.text, margin: "0 0 8px" }}>
          {title}
        </p>
        <p style={{ fontSize: "0.85rem", color: color.textMuted, lineHeight: 1.6, margin: 0 }}>{desc}</p>
        <p
          style={{
            fontFamily: font.mono,
            fontSize: "0.62rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: color.lime,
            margin: "16px 0 0",
          }}
        >
          Select →
        </p>
      </a>
    </Link>
  );
}

export default function Terminal() {
  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <div style={{ background: color.bg, minHeight: "100vh", fontFamily: font.body, color: color.text, padding: "0 20px" }}>
      <style>{`*{box-sizing:border-box;} a{color:inherit;} ::placeholder{color:${color.textFaint};}`}</style>

      <div style={{ maxWidth: "560px", margin: "0 auto", padding: "50px 0 90px" }}>
        <Link href="/">
          <a style={{ fontFamily: font.mono, fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: color.textMuted, textDecoration: "none" }}>
            ← Back to CrocPad
          </a>
        </Link>

        <div style={{ marginTop: "30px", marginBottom: "40px" }}>
          <p style={{ fontFamily: font.mono, fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: color.lime, margin: "0 0 10px" }}>
            Gator Terminal
          </p>
          <h1 style={{ fontFamily: font.display, fontWeight: 700, fontSize: "clamp(2rem,7vw,2.8rem)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>
            What are you launching?
          </h1>
          <p style={{ fontSize: "0.9rem", color: color.textMuted, lineHeight: 1.65, margin: 0 }}>
            Choose a path below. Each one walks you through the setup for that launch type on Robinhood Chain.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "14px" }}>
          <TerminalCard href="/terminal/token" icon={<IconCoin />} title="Launch a Token" desc="Create a fair-launch fungible token with a bonding curve." />
          <TerminalCard href="/terminal/nft" icon={<IconFrame />} title="Launch an NFT" desc="Mint an NFT collection with phased sales and reveal." />
        </div>
      </div>
    </div>
  );
}
