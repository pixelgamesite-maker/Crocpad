import { color, font, RULE, offset } from "@/lib/theme";
import NavLink from "@/components/nav-link";

const FEATURES = [
  {
    slug: "raffles",
    name: "Raffles",
    accent: color.croc,
    blurb: "Enter to win real NFT prizes. Winner drawn using a future block hash — nobody, including us, can know or influence the result in advance.",
  },
  {
    slug: "auctions",
    name: "Auctions",
    accent: color.sun,
    blurb: "English-style bidding on 1/1s and special pieces. Highest bid wins, outbid bidders get refunded automatically.",
  },
  {
    slug: "tickets",
    name: "Ticketed Auctions",
    accent: color.tongue,
    blurb: "Event and access passes as on-chain tickets — auctioned or fixed-price, checked in on-site.",
  },
  {
    slug: "whitelist",
    name: "Whitelist & Collab Distribution",
    accent: color.deep,
    blurb: "Fair, verifiable random selection for allowlist spots and collab rewards — feeds directly into the same mint system already live for Crocs.",
  },
];

export default function Shuffler() {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "70px 22px 40px" }}>
      <p style={{ fontFamily: font.mono, fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 14px" }}>
        In development
      </p>
      <h1 style={{ fontFamily: font.display, fontWeight: 800, fontSize: "clamp(2.8rem, 9vw, 4.6rem)", lineHeight: 0.92, letterSpacing: "-0.035em", margin: "0 0 22px" }}>
        Shuffler
      </h1>
      <p style={{ fontSize: "1.05rem", lineHeight: 1.6, color: color.inkSoft, margin: "0 0 44px", maxWidth: "58ch" }}>
        The activity layer for CrocPad — raffles, bidding, ticketed access, and fair whitelist
        distribution. Built feature by feature, each one live only once it's real.
      </p>

      <div style={{ border: RULE, background: color.paperDeep, padding: "18px 20px", marginBottom: "44px" }}>
        <p style={{ fontFamily: font.mono, fontSize: "0.72rem", letterSpacing: "0.06em", color: color.inkSoft, margin: 0, lineHeight: 1.6 }}>
          Foundation is live: a curated on-chain registry now tracks every campaign as it ships,
          and the randomness system raffles will use is built and ready. No campaign type has
          shipped yet — this page will update the moment one does.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "18px" }}>
        {FEATURES.map((f) => (
          <NavLink
            key={f.slug}
            href={`/shuffler/${f.slug}`}
            style={{ display: "block", border: RULE, background: color.paper, padding: "22px", boxShadow: offset(f.accent) }}
          >
            <div style={{ width: "26px", height: "8px", background: f.accent, marginBottom: "16px" }} />
            <p style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.15rem", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              {f.name}
            </p>
            <p style={{ fontSize: "0.86rem", lineHeight: 1.5, color: color.inkSoft, margin: 0 }}>{f.blurb}</p>
            <p style={{ fontFamily: font.mono, fontSize: "0.62rem", letterSpacing: "0.1em", textTransform: "uppercase", color: color.inkFaint, margin: "16px 0 0" }}>
              View status →
            </p>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
