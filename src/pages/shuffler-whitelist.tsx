import WorkInProgress from "@/components/work-in-progress";
import { color } from "@/lib/theme";

export default function ShufflerWhitelist() {
  return (
    <WorkInProgress
      title="Whitelist & Collab Distribution"
      summary="Fair, verifiable random selection for allowlist spots and collab rewards. Winners feed straight into the same private allowlist system already running the Crocs mint — no new pipeline needed once this ships."
      accent={color.deep}
      stages={[
        "Randomness system built and ready to use",
        "Building the applications pool and entry page",
        "Wiring winner selection into the existing allowlist generation pipeline",
        "Testing a full draw end-to-end before running it for real",
      ]}
    />
  );
}
