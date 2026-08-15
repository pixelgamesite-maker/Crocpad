import WorkInProgress from "@/components/work-in-progress";
import { color } from "@/lib/theme";

export default function Traits() {
  return (
    <WorkInProgress
      title="Trait market"
      summary="Artists draw Crocs traits in their own style and list them here. Buy one, equip it, and your character changes — the trait stays a separate asset you can resell."
      accent={color.tongue}
      stages={[
        "Trait and equip contracts are deployed on mainnet",
        "Building the artist submission and review flow",
        "Building the image service that composites equipped traits",
        "Designing the browse and purchase interface",
      ]}
    />
  );
}
