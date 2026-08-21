import { useState } from "react";
import { useReadContract } from "wagmi";
import { color, font, RULE, offset } from "@/lib/theme";
import NavLink from "@/components/nav-link";
import { SHUFFLER_RAFFLE_ADDRESS, SHUFFLER_RAFFLE_ABI } from "@/lib/shufflerRaffleContract";
import RaffleCard from "@/components/raffle-card";
import CreateRaffleForm from "@/components/create-raffle-modal";

export default function ShufflerRaffles() {
  const [showCreate, setShowCreate] = useState(false);

  const { data: raffleCount, refetch } = useReadContract({
    address: SHUFFLER_RAFFLE_ADDRESS,
    abi: SHUFFLER_RAFFLE_ABI,
    functionName: "raffleCount",
    query: { refetchInterval: 20000 },
  });

  const count = raffleCount !== undefined ? Number(raffleCount) : 0;
  const ids = Array.from({ length: count }, (_, i) => BigInt(count - 1 - i)); // newest first

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "50px 22px 90px" }}>
      <NavLink href="/shuffler" style={{ fontFamily: font.mono, fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: color.inkSoft, textDecoration: "none" }}>
        ← Back to Shuffler
      </NavLink>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end", justifyContent: "space-between", margin: "24px 0 30px" }}>
        <div>
          <p style={{ fontFamily: font.mono, fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 10px" }}>
            Shuffler
          </p>
          <h1 style={{ fontFamily: font.display, fontWeight: 800, fontSize: "clamp(2.4rem, 8vw, 3.6rem)", lineHeight: 0.94, letterSpacing: "-0.035em", margin: 0 }}>
            Raffles
          </h1>
        </div>
        <button
          onClick={() => setShowCreate((s) => !s)}
          className="press"
          style={{
            fontFamily: font.display, fontWeight: 700, fontSize: "0.92rem",
            padding: "14px 24px", border: RULE,
            background: showCreate ? color.paper : color.ink,
            color: showCreate ? color.ink : color.paper,
            boxShadow: showCreate ? "none" : offset(color.croc, 5, 5),
            cursor: "pointer",
          }}
        >
          {showCreate ? "Close" : "Create a raffle"}
        </button>
      </div>

      {showCreate && (
        <div style={{ marginBottom: "36px" }}>
          <CreateRaffleForm onCreated={() => { setShowCreate(false); refetch(); }} />
        </div>
      )}

      {count === 0 ? (
        <div style={{ border: RULE, background: color.paperDeep, padding: "40px 24px", textAlign: "center" }}>
          <p style={{ fontFamily: font.mono, fontSize: "0.86rem", color: color.inkSoft, margin: 0 }}>
            No raffles yet. Be the first to create one.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "22px" }}>
          {ids.map((id) => (
            <RaffleCard key={id.toString()} raffleId={id} />
          ))}
        </div>
      )}
    </div>
  );
}
