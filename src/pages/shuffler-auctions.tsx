import WorkInProgress from "@/components/work-in-progress";
import { color } from "@/lib/theme";

export default function ShufflerTickets() {
  return (
    <WorkInProgress
      title="Ticketed Auctions"
      summary="Event and access passes as real on-chain tickets — auctioned or sold at a fixed price, then checked in at the door. Owning the ticket is the proof; scanning it in is what marks it used."
      accent={color.tongue}
      stages={[
        "Registry foundation deployed",
        "Deciding transferable vs. soulbound tickets per event",
        "Building the ticket contract, adapted from the trait marketplace's listing pattern",
        "Building the check-in flow event staff will actually use",
      ]}
    />
  );
}
