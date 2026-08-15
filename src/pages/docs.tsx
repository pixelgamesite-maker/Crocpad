import WorkInProgress from "@/components/work-in-progress";
import { color } from "@/lib/theme";

export default function Docs() {
  return (
    <WorkInProgress
      title="Docs"
      summary="Contract addresses, mint mechanics, trait standards, and guides for creators launching on the pad."
      accent={color.tongue}
      stages={[
        "Writing the mint and phase reference",
        "Documenting deployed contract addresses and ABIs",
        "Writing the trait creation standard for artists",
        "Adding creator launch guides",
      ]}
    />
  );
}
