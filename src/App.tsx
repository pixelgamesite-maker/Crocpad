import "@rainbow-me/rainbowkit/styles.css";
import { Router as WouterRouter, Route, Switch } from "wouter";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { wagmiConfig } from "@/lib/wagmiConfig";
import Home from "@/pages/home";
import Terminal from "@/pages/terminal";
import LaunchToken from "@/pages/launch-token";
import LaunchNFT from "@/pages/launch-nft";

const queryClient = new QueryClient();

const rainbowTheme = darkTheme({
  accentColor: "#C6FF3D",
  accentColorForeground: "#0A0F0C",
  borderRadius: "medium",
  fontStack: "system",
});

function App() {
  return (
    <div className="dark">
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={rainbowTheme}>
            <TooltipProvider>
              <WouterRouter>
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/terminal" component={Terminal} />
                  <Route path="/terminal/token" component={LaunchToken} />
                  <Route path="/terminal/nft" component={LaunchNFT} />
                  <Route>
                    <div
                      style={{
                        background: "#0A0F0C",
                        width: "100vw",
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif",
                        fontWeight: 700,
                        fontSize: "2rem",
                        color: "#C6FF3D",
                      }}
                    >
                      404 — NOT FOUND
                    </div>
                  </Route>
                </Switch>
              </WouterRouter>
              <Toaster />
            </TooltipProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}

export default App;
