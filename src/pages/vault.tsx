import WorkInProgress from "@/components/work-in-progress";
import { color } from "@/lib/theme";

export default function Vault() {
  return (
    <WorkInProgress
      title="Vault"
      summary="Your Crocs in one place — every token you hold, its traits, its mint date, and the on-chain record behind it."
      accent={color.croc}
      stages={[
        "Indexing token ownership from the collection contract",
        "Wiring trait state so equipped items show on each Croc",
        "Building the per-token detail view",
        "Adding transaction history and explorer links",
      ]}
    />
  );
}
