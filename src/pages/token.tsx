import WorkInProgress from "@/components/work-in-progress";
import { color } from "@/lib/theme";

export default function Token() {
  return (
    <WorkInProgress
      title="Token launchpad"
      summary="Fair-launch token creation with no presale and no insider allocation. This ships only once the NFT side and the genesis collection have proven out."
      accent={color.croc}
      stages={[
        "Specifying bonding curve pricing",
        "Waiting on DEX liquidity infrastructure on Robinhood Chain",
        "Designing the migration that seeds a pool at threshold",
        "Scoping creator fee sharing",
      ]}
    />
  );
}
