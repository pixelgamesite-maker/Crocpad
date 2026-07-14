import { Router as WouterRouter, Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Terminal from "@/pages/terminal";
import LaunchToken from "@/pages/launch-token";
import LaunchNFT from "@/pages/launch-nft";

function App() {
  return (
    <div className="dark">
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
    </div>
  );
}

export default App;
