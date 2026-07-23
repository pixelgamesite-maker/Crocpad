import { ConnectButton } from "@rainbow-me/rainbowkit";
import { color, font } from "@/lib/theme";

export default function SignInButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openAccountModal, openChainModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div style={{ opacity: ready ? 1 : 0, pointerEvents: ready ? "auto" : "none" }}>
            {!connected ? (
              <button
                onClick={openConnectModal}
                style={{
                  fontFamily: font.mono,
                  fontSize: "0.66rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: color.bg,
                  background: color.lime,
                  border: "none",
                  borderRadius: "7px",
                  padding: "9px 16px",
                  cursor: "pointer",
                  transition: "filter 0.15s ease, transform 0.15s ease",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.08)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.filter = "none"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
              >
                Sign In
              </button>
            ) : chain.unsupported ? (
              <button
                onClick={openChainModal}
                style={{
                  fontFamily: font.mono, fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.08em",
                  textTransform: "uppercase", color: color.danger, background: "transparent",
                  border: `1px solid ${color.danger}`, borderRadius: "7px", padding: "9px 14px", cursor: "pointer",
                }}
              >
                Wrong network
              </button>
            ) : (
              <button
                onClick={openAccountModal}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  fontFamily: font.mono, fontSize: "0.66rem", fontWeight: 600, letterSpacing: "0.04em",
                  color: color.text, background: "transparent", border: `1px solid ${color.borderStrong}`,
                  borderRadius: "7px", padding: "8px 13px", cursor: "pointer",
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: color.lime, flexShrink: 0 }} />
                {account.displayName}
              </button>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
