import WorkInProgress from "@/components/work-in-progress";
import { color } from "@/lib/theme";

export default function ShufflerAuctions() {
  return (
    <WorkInProgress
      title="Auctions"
      summary="English-style bidding on 1/1s and special pieces. Highest bid wins at close, and every outbid bidder gets refunded automatically — no need to come back and claim it."
      accent={color.sun}
      stages={[
        "Registry foundation deployed",
        "Specifying bid increments, reserve pricing, and anti-snipe extension window",
        "Building the auction contract — escrow, bidding, refunds, settlement",
        "Building the bidding interface and live bid history",
      ]}
    />
  );
}
