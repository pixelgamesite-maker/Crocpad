import "@rainbow-me/rainbowkit/styles.css";
import { Router as WouterRouter, Route, Switch } from "wouter";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { wagmiConfig } from "@/lib/wagmiConfig";
import { color, font, RULE, offset } from "@/lib/theme";
import Layout from "@/components/layout";

import Home from "@/pages/home";
import Mint from "@/pages/mint";
import Vault from "@/pages/vault";
import Staking from "@/pages/staking";
import Traits from "@/pages/traits";
import Token from "@/pages/token";
import Economy from "@/pages/economy";
import Docs from "@/pages/docs";
import Admin from "@/pages/admin";
import NavLink from "@/components/nav-link";

const queryClient = new QueryClient();

const rainbowTheme = lightTheme({
  accentColor: "#12140F",
  accentColorForeground: "#EFEDE0",
  borderRadius: "none",
  fontStack: "system",
});

function NotFound() {
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "90px 22px", textAlign: "center" }}>
      <p style={{ fontFamily: font.mono, fontSize: "0.72rem", letterSpacing: "0.2em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 16px" }}>
        Error 404
      </p>
      <h1 style={{ fontFamily: font.display, fontWeight: 800, fontSize: "clamp(2.6rem, 10vw, 4.4rem)", letterSpacing: "-0.04em", lineHeight: 0.92, margin: "0 0 20px" }}>
        Nothing in this swamp.
      </h1>
      <p style={{ color: color.inkSoft, fontSize: "1.02rem", margin: "0 0 32px" }}>
        That page doesn't exist. Check the menu for everything on the pad.
      </p>
      <NavLink href="/" className="press"
          style={{
            display: "inline-block", fontFamily: font.display, fontWeight: 800, fontSize: "1rem",
            padding: "16px 30px", border: RULE, background: color.ink, color: color.paper,
            boxShadow: offset(color.croc, 6, 6),
          }}>
          Back home
        </NavLink>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowTheme}>
          <TooltipProvider>
            <WouterRouter>
              <Layout>
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/mint" component={Mint} />
                  <Route path="/vault" component={Vault} />
                  <Route path="/staking" component={Staking} />
                  <Route path="/traits" component={Traits} />
                  <Route path="/token" component={Token} />
                  <Route path="/economy" component={Economy} />
                  <Route path="/docs" component={Docs} />
                  <Route path="/admin" component={Admin} />
                  <Route component={NotFound} />
                </Switch>
              </Layout>
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
