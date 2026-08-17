import WorkInProgress from "@/components/work-in-progress";
import { color } from "@/lib/theme";

export default function ShufflerRaffles() {
  return (
    <WorkInProgress
      title="Raffles"
      summary="Enter to win real NFT prizes. Winners are drawn using a future block's hash as the random seed — the outcome can't be known or influenced by anyone, including the platform, until that block is mined."
      accent={color.croc}
      stages={[
        "Registry and randomness foundation deployed",
        "Building the raffle contract — entry, escrow, verifiable draw",
        "Building the entry and results interface",
        "Testing the draw mechanism on testnet before any real prize is at stake",
      ]}
    />
  );
}
