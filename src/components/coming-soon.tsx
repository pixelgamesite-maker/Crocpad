import { useEffect } from "react";
import { Link } from "wouter";
import { color, font, loadFonts } from "@/lib/theme";

export default function ComingSoon({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    loadFonts();
  }, []);

  return (
    <div
      style={{
        background: color.bg,
        minHeight: "100vh",
        fontFamily: font.body,
        color: color.text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: color.panel,
          border: `1px solid ${color.border}`,
          borderRadius: "14px",
          padding: "40px 26px",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            borderRadius: "999px",
            border: `1px solid ${color.borderStrong}`,
            marginBottom: "20px",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color.lime }} />
          <span style={{ fontFamily: font.mono, fontSize: "0.6rem", letterSpacing: "0.16em", textTransform: "uppercase", color: color.lime }}>
            Coming Soon
          </span>
        </div>

        <p style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.5rem", margin: "0 0 12px" }}>{title}</p>
        <p style={{ fontSize: "0.88rem", color: color.textMuted, lineHeight: 1.65, margin: "0 0 28px" }}>{description}</p>

        <Link href="/terminal">
          <a
            style={{
              display: "inline-block",
              fontFamily: font.mono,
              fontSize: "0.68rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: color.text,
              border: `1px solid ${color.borderStrong}`,
              borderRadius: "8px",
              padding: "12px 24px",
              textDecoration: "none",
            }}
          >
            ← Back to Terminal
          </a>
        </Link>
      </div>
    </div>
  );
}
