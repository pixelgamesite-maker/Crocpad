import { useState } from "react";
import { color, font, RULE, offset } from "@/lib/theme";
import { CROCSPAD_ADDRESS, CROCSTRAITS_ADDRESS, CROCSEQUIP_ADDRESS, EXPLORER } from "@/lib/crocsPadContract";
import NavLink from "@/components/nav-link";

function Section({ id, n, title, children }: { id: string; n: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ borderTop: RULE, padding: "44px 0", scrollMarginTop: "80px" }}>
      <div style={{ display: "flex", gap: "14px", alignItems: "baseline", marginBottom: "20px" }}>
        <span style={{ fontFamily: font.mono, fontSize: "0.74rem", color: color.croc }}>{n}</span>
        <h2 style={{ fontFamily: font.display, fontWeight: 800, fontSize: "clamp(1.6rem, 5vw, 2.2rem)", letterSpacing: "-0.03em", margin: 0 }}>
          {title}
        </h2>
      </div>
      <div style={{ fontSize: "0.98rem", lineHeight: 1.65, color: color.inkSoft }}>{children}</div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 14px", maxWidth: "62ch" }}>{children}</p>;
}

function Row({ k, v, mono }: { k: string; v: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${color.paperDeep}` }}>
      <span style={{ fontFamily: font.mono, fontSize: "0.74rem", letterSpacing: "0.06em", textTransform: "uppercase", color: color.inkSoft }}>{k}</span>
      <span style={{ fontFamily: mono ? font.mono : font.body, fontSize: mono ? "0.78rem" : "0.94rem", color: color.ink, fontWeight: 500, wordBreak: "break-all", textAlign: "right" }}>{v}</span>
    </div>
  );
}

function CopyAddress({ label, address }: { label: string; address: string }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(address).then(
      () => { setCopied(true); setTimeout(() => setCopied(false), 1600); },
      () => {},
    );
  }

  return (
    <div style={{ border: RULE, background: color.paper, padding: "14px 16px", marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: "0.96rem", color: color.ink }}>{label}</span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={copy}
            style={{ fontFamily: font.mono, fontSize: "0.64rem", padding: "5px 10px", border: RULE, background: copied ? color.croc : color.paper, color: copied ? color.paper : color.ink, cursor: "pointer" }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <a
            href={`${EXPLORER}/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: font.mono, fontSize: "0.64rem", padding: "5px 10px", border: RULE, background: color.paper }}
          >
            Explorer
          </a>
        </div>
      </div>
      <code style={{ fontFamily: font.mono, fontSize: "0.72rem", color: color.inkSoft, wordBreak: "break-all" }}>{address}</code>
    </div>
  );
}

const TOC = [
  ["overview", "01", "Overview"],
  ["collection", "02", "The collection"],
  ["phases", "03", "Mint phases"],
  ["supply", "04", "Supply and rollover"],
  ["contracts", "05", "Contracts"],
  ["traits", "06", "Traits"],
  ["economy", "07", "Fees and royalties"],
  ["network", "08", "Network"],
];

export default function Docs() {
  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "56px 22px 20px" }}>
      <p style={{ fontFamily: font.mono, fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 14px" }}>
        Reference
      </p>
      <h1 style={{ fontFamily: font.display, fontWeight: 800, fontSize: "clamp(2.8rem, 10vw, 4.4rem)", lineHeight: 0.92, letterSpacing: "-0.04em", margin: "0 0 20px" }}>
        Docs
      </h1>
      <p style={{ fontSize: "1.06rem", lineHeight: 1.6, color: color.inkSoft, margin: "0 0 34px", maxWidth: "56ch" }}>
        How the pad works, what's deployed, and the numbers behind the genesis mint.
      </p>

      {/* contents */}
      <nav style={{ border: RULE, background: color.paperDeep, padding: "16px 18px", marginBottom: "10px" }}>
        <p style={{ fontFamily: font.mono, fontSize: "0.62rem", letterSpacing: "0.16em", textTransform: "uppercase", color: color.inkSoft, margin: "0 0 12px" }}>
          Contents
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "6px 18px" }}>
          {TOC.map(([id, n, label]) => (
            <a key={id} href={`#${id}`} style={{ fontFamily: font.mono, fontSize: "0.78rem", color: color.ink, padding: "3px 0" }}>
              <span style={{ color: color.croc, marginRight: "8px" }}>{n}</span>{label}
            </a>
          ))}
        </div>
      </nav>

      <Section id="overview" n="01" title="Overview">
        <P>
          CrocPad is a token and NFT launchpad built for Robinhood Chain. Creators configure
          a launch from a form — supply, pricing, phases, and the contract deploys without
          anyone writing Solidity.
        </P>
        <P>
          Crocs is the genesis collection and the first thing to launch on the pad. Everything
          else on the roadmap is gated behind it going well.
        </P>
      </Section>

      <Section id="collection" n="02" title="The collection">
        <P>
          6,000 hand-drawn characters. Multiple rarity tiers, a substantial number of one-of-ones,
          and a handful of pieces that don't fit any tier. Every piece is drawn by hand, including
          the concept art posted to the collection's X account.
        </P>
        <div style={{ marginTop: "20px" }}>
          <Row k="Total supply" v="6,000" />
          <Row k="Standard" v="ERC-721A" />
          <Row k="Reveal" v="Delayed — art reveals after minting closes" />
          <Row k="Burnable" v="Yes — holders can burn their own tokens" />
        </div>
      </Section>

      <Section id="phases" n="03" title="Mint phases">
        <P>
          Two public phases. The team allocation isn't a phase — it can be minted at any point,
          including before the sale opens.
        </P>

        <div style={{ border: RULE, background: color.paper, marginTop: "20px" }}>
          {[
            { name: "Whitelist", price: "Free + 0.00003 ETH fee", cap: "2 per wallet", note: "Merkle allowlist. Eligibility is checked against your connected wallet." },
            { name: "Public", price: "0.0006 ETH + 0.00003 ETH fee", cap: "No practical per-wallet cap", note: "Open to anyone. Bounded only by remaining supply." },
          ].map((p, i) => (
            <div key={p.name} style={{ padding: "16px 18px", borderBottom: i === 0 ? RULE : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap", marginBottom: "6px" }}>
                <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.06rem", color: color.ink }}>{p.name}</span>
                <span style={{ fontFamily: font.mono, fontSize: "0.78rem", color: color.ink }}>{p.price}</span>
              </div>
              <p style={{ fontFamily: font.mono, fontSize: "0.72rem", color: color.inkSoft, margin: "0 0 6px" }}>{p.cap}</p>
              <p style={{ fontSize: "0.88rem", margin: 0 }}>{p.note}</p>
            </div>
          ))}
        </div>

        <P>
          <span style={{ display: "block", marginTop: "18px" }}>
            The 0.00003 ETH launchpad fee applies to every mint in both phases and is collected
            separately from mint proceeds.
          </span>
        </P>
      </Section>

      <Section id="supply" n="04" title="Supply and rollover">
        <P>
          150 tokens are reserved for the team. The remaining 5,850 are shared between the
          whitelist and public phases rather than split into two fixed buckets.
        </P>
        <P>
          The whitelist can consume at most 4,000 of that pool. Whatever it doesn't use rolls
          into the public phase automatically — there's no separate rollover step, it falls out
          of how the contract counts supply.
        </P>
        <div style={{ marginTop: "20px" }}>
          <Row k="Team reserve" v="150" />
          <Row k="Shared mint pool" v="5,850" />
          <Row k="Whitelist ceiling" v="4,000" />
          <Row k="Public ceiling" v="5,850 minus whatever the whitelist minted" />
        </div>
      </Section>

      <Section id="contracts" n="05" title="Contracts">
        <P>All three are deployed and verified on Robinhood Chain mainnet.</P>
        <div style={{ marginTop: "20px" }}>
          <CopyAddress label="CrocsPad — the collection" address={CROCSPAD_ADDRESS} />
          <CopyAddress label="CrocsTraits — trait marketplace" address={CROCSTRAITS_ADDRESS} />
          <CopyAddress label="CrocsEquip — trait equipping" address={CROCSEQUIP_ADDRESS} />
        </div>
      </Section>

      <Section id="traits" n="06" title="Traits">
        <P>
          Artists draw Crocs traits in their own style and submit them for review. Approved
          traits are listed with a fixed supply, and each sale splits automatically between the
          artist and the platform.
        </P>
        <P>
          Buying a trait gives you a separate token. Equipping it onto a Croc updates that
          Croc's artwork, but the trait stays yours, it isn't burned or locked, and you can
          unequip and resell it at any time.
        </P>
        <P>
          If you sell a trait that's currently equipped, the Croc reverts to its default look
          for that slot. Ownership is re-checked whenever the artwork is rendered.
        </P>
        <p style={{ fontFamily: font.mono, fontSize: "0.76rem", color: color.inkFaint, margin: "18px 0 0" }}>
          The marketplace interface is still being built. The contracts behind it are live.
        </p>
      </Section>

      <Section id="economy" n="07" title="Fees and royalties">
        <P>
          Projects launching through CrocPad don't pay a percentage of their earnings. Platform
          revenue comes from the flat launchpad fee instead, which funds operations.
        </P>
        <P>
          A share of that fee revenue is designated for genesis holders who meet a holding
          threshold. The threshold and distribution mechanics haven't been finalised — that
          work is tracked on the economy page.
        </P>
        <div style={{ marginTop: "20px" }}>
          <Row k="Launchpad fee" v="0.00003 ETH per mint" />
          <Row k="Creator revenue cut" v="None at launch" />
          <Row k="Secondary royalty" v="7%" />
        </div>
        <p style={{ fontFamily: font.mono, fontSize: "0.76rem", color: color.inkFaint, margin: "18px 0 0", lineHeight: 1.5 }}>
          Royalties follow the ERC-2981 standard, which marketplaces choose whether to honour.
          Nothing here is financial advice.
        </p>
      </Section>

      <Section id="network" n="08" title="Network">
        <div>
          <Row k="Network" v="Robinhood Chain" />
          <Row k="Chain ID" v="4663" mono />
          <Row k="Currency" v="ETH" />
          <Row k="RPC" v="https://rpc.mainnet.chain.robinhood.com" mono />
          <Row k="Explorer" v="robinhoodchain.blockscout.com" mono />
        </div>
      </Section>

      <div style={{ borderTop: RULE, paddingTop: "34px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <NavLink
          href="/mint"
          className="press"
          style={{
            fontFamily: font.display, fontWeight: 800, fontSize: "1rem",
            padding: "16px 30px", border: RULE, background: color.ink, color: color.paper,
            boxShadow: offset(color.croc, 6, 6),
          }}
        >
          Go to mint
        </NavLink>
      </div>
    </div>
  );
}
