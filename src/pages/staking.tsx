import WorkInProgress from "@/components/work-in-progress";
import { color } from "@/lib/theme";

export default function Staking() {
  return (
    <WorkInProgress
      title="Staking"
      summary="Lock a Croc to build a holding position over time. Staking is what activates commission earnings from platform fees."
      accent={color.sun}
      stages={[
        "Drafting the staking contract and lock mechanics",
        "Defining the holding threshold that activates earnings",
        "Modelling reward distribution against fee revenue",
        "Preparing the contract for audit",
      ]}
    />
  );
}
