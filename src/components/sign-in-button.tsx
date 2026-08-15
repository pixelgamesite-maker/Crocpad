import { ConnectButton } from "@rainbow-me/rainbowkit";
import { color, font, RULE } from "@/lib/theme";

export default function SignInButton() {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, openAccountModal, openChainModal, mounted }) => {
        const connected = mounted && account && chain;

        const base: React.CSSProperties = {
          fontFamily: font.mono,
          fontSize: "0.72rem",
          letterSpacing: "0.04em",
          padding: "0 14px",
          height: "42px",
          border: RULE,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: color.paper,
          color: color.ink,
        };

        if (!mounted) {
          return <div style={{ ...base, visibility: "hidden" }} aria-hidden />;
        }

        if (!connected) {
          return (
            <button className="press" onClick={openConnectModal} style={{ ...base, background: color.sun, fontWeight: 500 }}>
              Connect
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button className="press" onClick={openChainModal} style={{ ...base, background: color.tongue, color: color.paper }}>
              Wrong network
            </button>
          );
        }

        return (
          <button className="press" onClick={openAccountModal} style={base}>
            <span style={{ width: "7px", height: "7px", background: color.croc }} />
            {account.displayName}
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}
