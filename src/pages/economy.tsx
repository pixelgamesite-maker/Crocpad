import WorkInProgress from "@/components/work-in-progress";
import { color } from "@/lib/theme";

export default function Economy() {
  return (
    <WorkInProgress
      title="Economy"
      summary="Where the money moves. Platform fees, how they fund operations, and the share routed back to genesis holders who meet the holding threshold."
      accent={color.sun}
      stages={[
        "Finalising the fee split between operations and holders",
        "Defining the holding threshold for commission earnings",
        "Building live revenue and distribution reporting",
        "Publishing the full breakdown",
      ]}
    />
  );
}
