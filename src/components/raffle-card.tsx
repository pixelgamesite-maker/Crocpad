import { useEffect, useState } from "react";
import { useAccount, useReadContract, useReadContracts, useBlockNumber, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatEther } from "viem";
import { color, font, RULE, offset } from "@/lib/theme";
import { SHUFFLER_RAFFLE_ADDRESS, SHUFFLER_RAFFLE_ABI, ELIGIBILITY, RAFFLE_STATUS } from "@/lib/shufflerRaffleContract";

function short(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatCountdown(seconds: number) {
  if (seconds <= 0) return "Ended";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

const STATUS_LABEL: Record<number, string> = {
  [RAFFLE_STATUS.ACTIVE]: "Active",
  [RAFFLE_STATUS.DRAW_REQUESTED]: "Draw pending",
  [RAFFLE_STATUS.COMPLETE]: "Complete",
  [RAFFLE_STATUS.CANCELLED]: "Cancelled",
};

export default function RaffleCard({ raffleId }: { raffleId: bigint }) {
  const { address, isConnected } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const { data, refetch } = useReadContracts({
    contracts: [
      { address: SHUFFLER_RAFFLE_ADDRESS, abi: SHUFFLER_RAFFLE_ABI, functionName: "getRaffleSummary", args: [raffleId] },
      { address: SHUFFLER_RAFFLE_ADDRESS, abi: SHUFFLER_RAFFLE_ABI, functionName: "getPrizes", args: [raffleId] },
      { address: SHUFFLER_RAFFLE_ADDRESS, abi: SHUFFLER_RAFFLE_ABI, functionName: "entryFee" },
      {
        address: SHUFFLER_RAFFLE_ADDRESS, abi: SHUFFLER_RAFFLE_ABI, functionName: "hasEntered",
        args: [raffleId, address ?? "0x0000000000000000000000000000000000000000"],
      },
    ],
    query: { refetchInterval: 15000 },
  });

  const [summary, prizes, entryFee, alreadyEntered] = data?.map((d) => d.result) ?? [];
  const [creator, eligibility, gatingCollection, endTime, status, prizeCount, entrantCount] = summary ?? [];

  const { data: drawRequest } = useReadContract({
    address: SHUFFLER_RAFFLE_ADDRESS,
    abi: SHUFFLER_RAFFLE_ABI,
    functionName: "getDrawRequest",
    args: [raffleId],
    query: { enabled: status !== undefined && Number(status) === RAFFLE_STATUS.DRAW_REQUESTED, refetchInterval: 15000 },
  });
  const [targetBlock, fulfilled] = drawRequest ?? [];

  const { data: winners } = useReadContract({
    address: SHUFFLER_RAFFLE_ADDRESS,
    abi: SHUFFLER_RAFFLE_ABI,
    functionName: "getWinners",
    args: [raffleId],
    query: { enabled: status !== undefined && Number(status) === RAFFLE_STATUS.COMPLETE },
  });

  const { data: eligibleHolderBalance } = useReadContract({
    address: gatingCollection as `0x${string}` | undefined,
    abi: [{ type: "function", name: "balanceOf", stateMutability: "view", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }] }],
    functionName: "balanceOf",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: { enabled: isConnected && eligibility !== undefined && Number(eligibility) === ELIGIBILITY.HOLDER_GATED && !!gatingCollection },
  });

  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  useEffect(() => {
    if (endTime === undefined) return;
    setSecondsLeft(Number(endTime) - Math.floor(Date.now() / 1000));
  }, [endTime]);
  useEffect(() => {
    if (secondsLeft === null) return;
    const id = setInterval(() => setSecondsLeft((s) => (s !== null ? s - 1 : s)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft !== null]);

  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract();
  const { isLoading: confirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => { if (isSuccess) refetch(); }, [isSuccess]);

  if (!summary) return null;

  const statusNum = Number(status);
  const isPublic = Number(eligibility) === ELIGIBILITY.PUBLIC;
  const isEligible = isPublic || (eligibleHolderBalance !== undefined && Number(eligibleHolderBalance) > 0);
  const timeUp = secondsLeft !== null && secondsLeft <= 0;
  const canDrawExecute = targetBlock !== undefined && blockNumber !== undefined && !fulfilled && blockNumber > targetBlock;
  const isWinnerList = winners as readonly string[] | undefined;
  const iAmWinner = isWinnerList?.some((w) => w.toLowerCase() === address?.toLowerCase());
  const iAmCreator = creator?.toLowerCase() === address?.toLowerCase();

  function enter() {
    reset();
    writeContract({
      address: SHUFFLER_RAFFLE_ADDRESS, abi: SHUFFLER_RAFFLE_ABI, functionName: "enterRaffle",
      args: [raffleId], value: entryFee ?? 0n,
    });
  }
  function requestDraw() {
    reset();
    writeContract({ address: SHUFFLER_RAFFLE_ADDRESS, abi: SHUFFLER_RAFFLE_ABI, functionName: "requestDraw", args: [raffleId] });
  }
  function executeDraw() {
    reset();
    writeContract({ address: SHUFFLER_RAFFLE_ADDRESS, abi: SHUFFLER_RAFFLE_ABI, functionName: "executeDraw", args: [raffleId] });
  }
  function reclaim() {
    reset();
    writeContract({ address: SHUFFLER_RAFFLE_ADDRESS, abi: SHUFFLER_RAFFLE_ABI, functionName: "reclaimUnusedPrizes", args: [raffleId] });
  }

  return (
    <div style={{ border: RULE, background: color.paper, boxShadow: offset(statusNum === RAFFLE_STATUS.COMPLETE ? color.sun : color.croc) }}>
      <div style={{ padding: "14px 18px", borderBottom: RULE, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.02rem" }}>Raffle #{raffleId.toString()}</span>
        <span style={{ fontFamily: font.mono, fontSize: "0.64rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "5px 11px", border: RULE, background: statusNum === RAFFLE_STATUS.ACTIVE ? color.croc : color.paper, color: statusNum === RAFFLE_STATUS.ACTIVE ? color.paper : color.ink }}>
          {STATUS_LABEL[statusNum]}
        </span>
      </div>

      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: font.mono, fontSize: "0.76rem", marginBottom: "6px" }}>
          <span style={{ color: color.inkSoft }}>Prizes</span>
          <span>{prizeCount !== undefined ? Number(prizeCount) : "—"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: font.mono, fontSize: "0.76rem", marginBottom: "6px" }}>
          <span style={{ color: color.inkSoft }}>Entrants</span>
          <span>{entrantCount !== undefined ? Number(entrantCount) : "—"}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: font.mono, fontSize: "0.76rem", marginBottom: "6px" }}>
          <span style={{ color: color.inkSoft }}>Eligibility</span>
          <span>{isPublic ? "Public" : `Holders of ${short(gatingCollection as string)}`}</span>
        </div>
        {prizes && prizes.length > 0 && (
          <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: `1px solid ${color.paperDeep}` }}>
            {(prizes as { nftContract: string; tokenId: bigint }[]).map((p, i) => (
              <p key={i} style={{ fontFamily: font.mono, fontSize: "0.68rem", color: color.inkSoft, margin: "2px 0" }}>
                {short(p.nftContract)} · #{p.tokenId.toString()}
              </p>
            ))}
          </div>
        )}

        {statusNum === RAFFLE_STATUS.ACTIVE && (
          <p style={{ fontFamily: font.mono, fontSize: "0.8rem", fontWeight: 600, margin: "14px 0 0", color: timeUp ? color.tongue : color.ink }}>
            {secondsLeft !== null ? formatCountdown(secondsLeft) : "—"}
          </p>
        )}
      </div>

      <div style={{ padding: "0 18px 18px" }}>
        {statusNum === RAFFLE_STATUS.ACTIVE && !timeUp && (
          <>
            {alreadyEntered ? (
              <p style={{ fontFamily: font.mono, fontSize: "0.76rem", color: color.croc, textAlign: "center", padding: "12px" }}>
                You're entered
              </p>
            ) : !isConnected ? (
              <p style={{ fontFamily: font.mono, fontSize: "0.76rem", color: color.inkFaint, textAlign: "center", padding: "12px" }}>
                Connect wallet to enter
              </p>
            ) : !isEligible ? (
              <p style={{ fontFamily: font.mono, fontSize: "0.76rem", color: color.tongue, textAlign: "center", padding: "12px" }}>
                Wallet not eligible for this raffle
              </p>
            ) : (
              <button
                onClick={enter}
                disabled={isPending || confirming}
                className="press"
                style={{ width: "100%", padding: "13px", border: RULE, background: color.ink, color: color.paper, fontFamily: font.display, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}
              >
                {isPending ? "Confirm in wallet…" : confirming ? "Entering…" : `Enter${entryFee ? ` (${formatEther(entryFee)} ETH)` : " (free)"}`}
              </button>
            )}
          </>
        )}

        {statusNum === RAFFLE_STATUS.ACTIVE && timeUp && (
          <button onClick={requestDraw} disabled={isPending || confirming} className="press" style={{ width: "100%", padding: "13px", border: RULE, background: color.sun, color: color.ink, fontFamily: font.display, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
            {isPending ? "Confirm…" : confirming ? "Requesting…" : "Request draw"}
          </button>
        )}

        {statusNum === RAFFLE_STATUS.DRAW_REQUESTED && (
          canDrawExecute ? (
            <button onClick={executeDraw} disabled={isPending || confirming} className="press" style={{ width: "100%", padding: "13px", border: RULE, background: color.sun, color: color.ink, fontFamily: font.display, fontWeight: 700, fontSize: "0.9rem", cursor: "pointer" }}>
              {isPending ? "Confirm…" : confirming ? "Drawing…" : "Execute draw"}
            </button>
          ) : (
            <p style={{ fontFamily: font.mono, fontSize: "0.72rem", color: color.inkFaint, textAlign: "center", padding: "12px" }}>
              Waiting for the random seed block to be mined…
            </p>
          )
        )}

        {statusNum === RAFFLE_STATUS.COMPLETE && isWinnerList && (
          <div>
            <p style={{ fontFamily: font.mono, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 8px" }}>
              Winners
            </p>
            {isWinnerList.map((w, i) => (
              <p key={i} style={{ fontFamily: font.mono, fontSize: "0.78rem", margin: "2px 0", color: w.toLowerCase() === address?.toLowerCase() ? color.croc : color.ink, fontWeight: w.toLowerCase() === address?.toLowerCase() ? 700 : 400 }}>
                {short(w)} {w.toLowerCase() === address?.toLowerCase() && "← you"}
              </p>
            ))}
            {iAmWinner && <p style={{ fontFamily: font.mono, fontSize: "0.76rem", color: color.croc, marginTop: "10px" }}>Prize sent to your wallet.</p>}
          </div>
        )}

        {(statusNum === RAFFLE_STATUS.CANCELLED || statusNum === RAFFLE_STATUS.COMPLETE) && iAmCreator && (
          <button onClick={reclaim} disabled={isPending || confirming} className="press" style={{ width: "100%", marginTop: "10px", padding: "11px", border: RULE, background: color.paper, color: color.ink, fontFamily: font.mono, fontSize: "0.72rem", letterSpacing: "0.06em", textTransform: "uppercase", cursor: "pointer" }}>
            Reclaim unused prizes
          </button>
        )}

        {writeError && (
          <p style={{ fontFamily: font.mono, fontSize: "0.7rem", color: color.tongue, marginTop: "10px" }}>
            {(writeError as any).shortMessage ?? "Transaction failed."}
          </p>
        )}
      </div>
    </div>
  );
}
