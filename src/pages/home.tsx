import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { createClient } from "@supabase/supabase-js";
import { color, font, loadFonts, X_URL, PINNED_TWEET_URL } from "@/lib/theme";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL ?? "",
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? ""
);

/* ───────────────────────── helpers ───────────────────────── */

function isValidEvm(a: string) {
  return /^0x[0-9a-fA-F]{40}$/.test(a.trim());
}
function isValidUrl(u: string) {
  try {
    const url = new URL(u.trim());
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/* ───────────────────────── small icons (no emoji) ───────────────────────── */

function IconTerminal({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke={color.lime} strokeWidth="1.6" />
      <path d="M6 9L10 12L6 15" stroke={color.lime} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15H18" stroke={color.lime} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function IconCoin({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color.lime} strokeWidth="1.6" />
      <path d="M12 7.5V16.5M9.3 9.4C9.3 8.2 10.4 7.5 12 7.5C13.7 7.5 14.7 8.3 14.7 9.3C14.7 11.6 9.3 10.6 9.3 13C9.3 14 10.3 14.8 12 14.8C13.6 14.8 14.7 14.1 14.7 12.9"
        stroke={color.lime} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function IconFrame({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="3.5" y="3.5" width="17" height="17" rx="2" stroke={color.lime} strokeWidth="1.6" />
      <circle cx="9" cy="9" r="1.6" stroke={color.lime} strokeWidth="1.4" />
      <path d="M4 16L9 12L13 15L20 9" stroke={color.lime} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCheck({ size = 14, stroke = "#0A0F0C" }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 18 14" fill="none">
      <path d="M1.5 7L6.5 12L16.5 1.5" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconX({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

/* ───────────────────────── typewriter hero line ───────────────────────── */

const BOOT_LINES = [
  "connecting to Robinhood Chain...",
  "chain id 4663 — mainnet reached",
  "initializing gator-terminal...",
  "ready_",
];

function useBootSequence() {
  const [lines, setLines] = useState<string[]>([]);
  const [typing, setTyping] = useState("");
  useEffect(() => {
    let li = 0;
    let ci = 0;
    let cancelled = false;
    function step() {
      if (cancelled) return;
      if (li >= BOOT_LINES.length) return;
      const full = BOOT_LINES[li];
      ci++;
      setTyping(full.slice(0, ci));
      if (ci >= full.length) {
        setLines((prev) => [...prev, full]);
        setTyping("");
        li++;
        ci = 0;
        setTimeout(step, 260);
      } else {
        setTimeout(step, 18);
      }
    }
    const start = setTimeout(step, 300);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, []);
  return { lines, typing };
}

/* ───────────────────────── scroll reveal ───────────────────────── */

function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ───────────────────────── shared bits ───────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: font.mono,
        fontSize: "0.7rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: color.lime,
        margin: "0 0 10px",
      }}
    >
      {children}
    </p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: font.display,
        fontWeight: 700,
        fontSize: "clamp(1.8rem,6vw,2.6rem)",
        color: color.text,
        margin: "0 0 14px",
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </h2>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(0,0,0,0.35)",
  border: `1px solid ${color.border}`,
  borderRadius: "8px",
  padding: "11px 12px",
  fontSize: "0.85rem",
  color: color.text,
  fontFamily: font.mono,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

/* ═══════════════════════════ MAIN ═══════════════════════════ */

export default function Home() {
  const [ready, setReady] = useState(false);
  const { lines, typing } = useBootSequence();

  const [modalOpen, setModalOpen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeConfirmed, setLikeConfirmed] = useState(false);
  const [quoteUrl, setQuoteUrl] = useState("");
  const [quoteConfirmed, setQuoteConfirmed] = useState(false);
  const [commentUrl, setCommentUrl] = useState("");
  const [commentConfirmed, setCommentConfirmed] = useState(false);
  const [wallet, setWallet] = useState("");
  const [walletConfirmed, setWalletConfirmed] = useState(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    loadFonts();
    try {
      const saved = localStorage.getItem("crocpad_wl_draft");
      if (saved) {
        const p = JSON.parse(saved);
        setQuoteUrl(p.quoteUrl ?? "");
        setCommentUrl(p.commentUrl ?? "");
        setWallet(p.wallet ?? "");
      }
      if (localStorage.getItem("crocpad_wl_submitted") === "true") {
        setAlreadySubmitted(true);
      }
    } catch {
      /* ignore */
    }
    setTimeout(() => setReady(true), 60);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        "crocpad_wl_draft",
        JSON.stringify({ quoteUrl, commentUrl, wallet })
      );
    } catch {
      /* ignore */
    }
  }, [quoteUrl, commentUrl, wallet]);

  const t1 = likeConfirmed && liked;
  const t2 = quoteConfirmed && isValidUrl(quoteUrl);
  const t3 = commentConfirmed && isValidUrl(commentUrl);
  const t4 = walletConfirmed && isValidEvm(wallet);
  const allDone = t1 && t2 && t3 && t4;
  const doneCount = [t1, t2, t3, t4].filter(Boolean).length;

  async function submit() {
    if (!allDone) {
      setErr("Complete all four steps first.");
      return;
    }
    if (alreadySubmitted) {
      setErr("This browser has already submitted an application.");
      return;
    }
    setErr("");
    setSending(true);
    const { error } = await supabase.from("crocpad").insert([
      {
        wallet_address: wallet.trim(),
        quote_url: quoteUrl.trim(),
        comment_url: commentUrl.trim(),
        liked: true,
      },
    ]);
    setSending(false);
    if (error) {
      setErr("Something went wrong. Please try again.");
      return;
    }
    setSuccess(true);
    try {
      localStorage.setItem("crocpad_wl_submitted", "true");
    } catch {
      /* ignore */
    }
    setAlreadySubmitted(true);
  }

  function closeModal() {
    setModalOpen(false);
    if (!alreadySubmitted) {
      setSuccess(false);
      setErr("");
    }
  }

  return (
    <div style={{ background: color.bg, minHeight: "100vh", fontFamily: font.body, color: color.text, overflowX: "hidden" }}>
      <style>{`
        *{box-sizing:border-box;}
        ::placeholder{color:${color.textFaint};}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${color.borderStrong};border-radius:4px;}
        html{scroll-behavior:smooth;}
        a{color:inherit;}
        @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes modalIn{from{opacity:0;transform:translateY(14px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes glow{0%,100%{box-shadow:0 0 0 0 ${color.lime}33}50%{box-shadow:0 0 0 6px ${color.lime}00}}
      `}</style>

      {/* ───────── header ───────── */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: "62px",
          padding: "0 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(10,15,12,0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${color.border}`,
        }}
      >
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "7px",
              background: color.lime,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontFamily: font.mono, fontWeight: 700, fontSize: "0.85rem", color: color.bg }}>C</span>
          </div>
          <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1rem", letterSpacing: "0.02em" }}>CROCPAD</span>
        </a>

        <nav style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <a
            href="#platform"
            style={{
              fontFamily: font.mono,
              fontSize: "0.62rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: color.textMuted,
              padding: "8px 12px",
              display: "none",
            }}
            className="nav-link"
          >
            Platform
          </a>
          <a href={X_URL} target="_blank" rel="noopener noreferrer" title="Follow on X"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "32px", height: "32px", borderRadius: "7px",
              color: color.textMuted, border: `1px solid ${color.border}`, marginRight: "8px",
            }}>
            <IconX />
          </a>
          <Link href="/terminal">
            <a style={{
              fontFamily: font.mono, fontSize: "0.66rem", fontWeight: 600,
              letterSpacing: "0.1em", textTransform: "uppercase",
              color: color.bg, background: color.lime, borderRadius: "7px",
              padding: "9px 16px", textDecoration: "none",
            }}>
              Gator Terminal
            </a>
          </Link>
        </nav>
      </header>

      {/* ───────── hero ───────── */}
      <div id="top" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "110px 20px 70px", textAlign: "center" }}>
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            background: color.panel,
            border: `1px solid ${color.border}`,
            borderRadius: "10px",
            overflow: "hidden",
            textAlign: "left",
            marginBottom: "40px",
            opacity: ready ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 12px", borderBottom: `1px solid ${color.border}`, background: "rgba(0,0,0,0.2)" }}>
            {[color.lime, color.limeDim, color.teal].map((c, i) => (
              <span key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: c }} />
            ))}
            <span style={{ marginLeft: "8px", fontFamily: font.mono, fontSize: "0.62rem", color: color.textFaint, letterSpacing: "0.08em" }}>
              gator-terminal — zsh
            </span>
          </div>
          <div style={{ padding: "16px 16px 18px", fontFamily: font.mono, fontSize: "0.78rem", lineHeight: 1.9, minHeight: "108px" }}>
            {lines.map((l, i) => (
              <div key={i} style={{ color: color.textMuted }}>
                <span style={{ color: color.lime }}>{"> "}</span>
                {l}
              </div>
            ))}
            {typing && (
              <div style={{ color: color.textMuted }}>
                <span style={{ color: color.lime }}>{"> "}</span>
                {typing}
                <span style={{ animation: "blink 1s step-end infinite" }}>▌</span>
              </div>
            )}
          </div>
        </div>

        <h1
          style={{
            fontFamily: font.display,
            fontWeight: 700,
            fontSize: "clamp(2.6rem,12vw,5rem)",
            margin: "0 0 14px",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          CROCPAD
        </h1>
        <p style={{ fontFamily: font.body, fontSize: "clamp(1rem,3vw,1.15rem)", color: color.textMuted, margin: "0 0 36px", maxWidth: "440px", lineHeight: 1.6 }}>
          Launch tokens and NFTs directly on Robinhood Chain. No code, no gatekeepers — connect a wallet and go live.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "300px" }}>
          <Link href="/terminal">
            <a
              style={{
                fontFamily: font.mono, fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase",
                color: color.bg, background: color.lime, borderRadius: "8px", padding: "16px", textAlign: "center", textDecoration: "none",
              }}
            >
              Enter Gator Terminal
            </a>
          </Link>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              fontFamily: font.mono, fontWeight: 600, fontSize: "0.76rem", letterSpacing: "0.1em", textTransform: "uppercase",
              color: color.text, background: "transparent", border: `1px solid ${color.borderStrong}`,
              borderRadius: "8px", padding: "16px", cursor: "pointer",
            }}
          >
            Apply for Waitlist
          </button>
        </div>
      </div>

      {/* ───────── marquee ───────── */}
      <div style={{ borderTop: `1px solid ${color.border}`, borderBottom: `1px solid ${color.border}`, overflow: "hidden", padding: "14px 0", background: color.panel }}>
        <div style={{ display: "flex", width: "max-content", animation: "marquee 22s linear infinite" }}>
          {[...Array(2)].map((_, rep) => (
            <div key={rep} style={{ display: "flex" }}>
              {["BUILT ON ROBINHOOD CHAIN", "LAUNCH TOKENS", "MINT NFT COLLECTIONS", "NO CODE REQUIRED", "FAIR LAUNCH TOOLING"].map((t, i) => (
                <span key={i} style={{ fontFamily: font.mono, fontSize: "0.68rem", letterSpacing: "0.14em", color: color.textFaint, padding: "0 28px", whiteSpace: "nowrap" }}>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ───────── platform / utility ───────── */}
      <section id="platform" style={{ padding: "90px 20px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <Reveal>
            <Eyebrow>The Platform</Eyebrow>
            <SectionTitle>One launchpad, two ways to build.</SectionTitle>
            <p style={{ color: color.textMuted, fontSize: "0.95rem", lineHeight: 1.7, margin: "0 0 40px", maxWidth: "560px" }}>
              CrocPad is a native launchpad for Robinhood Chain. Creators use the Gator Terminal to
              launch a fungible token or mint an NFT collection without writing a line of code —
              the same way pump.fun made token launches permissionless on other chains.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "14px" }}>
            {[
              { icon: <IconCoin />, title: "Token Launchpad", desc: "Fair-launch fungible tokens with a bonding curve — coming to the terminal soon." },
              { icon: <IconFrame />, title: "NFT Studio", desc: "Mint collections with phased sales, allowlists, and delayed reveal." },
              { icon: <IconTerminal />, title: "Native to Robinhood Chain", desc: "Built directly for Robinhood Chain — fast, low-fee, fully EVM compatible." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.08}>
                <div style={{ background: color.panel, border: `1px solid ${color.border}`, borderRadius: "12px", padding: "22px 18px", height: "100%" }}>
                  <div style={{ marginBottom: "14px" }}>{f.icon}</div>
                  <p style={{ fontFamily: font.display, fontWeight: 600, fontSize: "1.02rem", margin: "0 0 8px" }}>{f.title}</p>
                  <p style={{ fontSize: "0.85rem", color: color.textMuted, lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── how it works ───────── */}
      <section style={{ padding: "20px 20px 90px" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <Reveal>
            <Eyebrow>How It Works</Eyebrow>
            <SectionTitle>From wallet to launch.</SectionTitle>
          </Reveal>
          <div style={{ marginTop: "28px" }}>
            {[
              { n: "01", t: "Connect your wallet", d: "Connect any EVM wallet on Robinhood Chain." },
              { n: "02", t: "Choose token or NFT", d: "Open the Gator Terminal and pick what you're launching." },
              { n: "03", t: "Configure your launch", d: "Set supply, price, and phases — no code required." },
              { n: "04", t: "Go live", d: "Your launch is instantly live on Robinhood Chain." },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.06}>
                <div style={{ display: "flex", gap: "18px", padding: "18px 0", borderBottom: i < 3 ? `1px solid ${color.border}` : "none" }}>
                  <span style={{ fontFamily: font.mono, fontSize: "0.8rem", color: color.lime, flexShrink: 0, paddingTop: "2px" }}>{s.n}</span>
                  <div>
                    <p style={{ margin: 0, fontFamily: font.display, fontWeight: 600, fontSize: "0.98rem" }}>{s.t}</p>
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: color.textMuted, lineHeight: 1.6 }}>{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── terminal preview ───────── */}
      <section style={{ padding: "0 20px 90px" }}>
        <Reveal>
          <div
            style={{
              maxWidth: "620px",
              margin: "0 auto",
              background: `linear-gradient(160deg, ${color.panel} 0%, #0C1712 100%)`,
              border: `1px solid ${color.border}`,
              borderRadius: "16px",
              padding: "36px 28px",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
              <IconTerminal size={30} />
            </div>
            <p style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.3rem", margin: "0 0 10px" }}>Gator Terminal</p>
            <p style={{ fontSize: "0.88rem", color: color.textMuted, lineHeight: 1.65, margin: "0 0 22px", maxWidth: "420px", marginLeft: "auto", marginRight: "auto" }}>
              The control room for every launch on CrocPad. Choose your path — a token or an
              NFT collection — and the terminal walks you through the rest.
            </p>
            <Link href="/terminal">
              <a style={{
                display: "inline-block", fontFamily: font.mono, fontWeight: 600, fontSize: "0.74rem",
                letterSpacing: "0.1em", textTransform: "uppercase", color: color.bg, background: color.lime,
                borderRadius: "8px", padding: "14px 30px", textDecoration: "none",
              }}>
                Open Terminal
              </a>
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ───────── waitlist CTA ───────── */}
      <section style={{ padding: "0 20px 100px" }}>
        <Reveal>
          <div style={{ maxWidth: "620px", margin: "0 auto", textAlign: "center" }}>
            <Eyebrow>Early Access</Eyebrow>
            <SectionTitle>Apply for the waitlist.</SectionTitle>
            <p style={{ color: color.textMuted, fontSize: "0.9rem", lineHeight: 1.7, margin: "0 0 26px", maxWidth: "460px", marginLeft: "auto", marginRight: "auto" }}>
              A limited number of wallets get early access to CrocPad launches. Complete four
              quick steps on X to apply.
            </p>
            <button
              onClick={() => setModalOpen(true)}
              style={{
                fontFamily: font.mono, fontWeight: 600, fontSize: "0.76rem", letterSpacing: "0.1em", textTransform: "uppercase",
                color: color.bg, background: color.lime, border: "none", borderRadius: "8px", padding: "16px 34px", cursor: "pointer",
              }}
            >
              Apply for Waitlist
            </button>
          </div>
        </Reveal>
      </section>

      {/* ───────── footer ───────── */}
      <footer style={{ borderTop: `1px solid ${color.border}`, padding: "50px 20px 36px", textAlign: "center" }}>
        <div
          style={{
            width: "32px", height: "32px", borderRadius: "8px", background: color.lime,
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
          }}
        >
          <span style={{ fontFamily: font.mono, fontWeight: 700, fontSize: "0.95rem", color: color.bg }}>C</span>
        </div>
        <p style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.1rem", margin: "0 0 6px" }}>CROCPAD</p>
        <p style={{ fontSize: "0.8rem", color: color.textFaint, margin: "0 0 24px" }}>
          Native launchpad for Robinhood Chain.
        </p>
        <div style={{ display: "flex", gap: "22px", justifyContent: "center", marginBottom: "26px", flexWrap: "wrap" }}>
          <a href="#platform" style={{ fontFamily: font.mono, fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: color.textMuted }}>Platform</a>
          <Link href="/terminal"><a style={{ fontFamily: font.mono, fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: color.textMuted }}>Terminal</a></Link>
          <a href={X_URL} target="_blank" rel="noopener noreferrer" style={{ fontFamily: font.mono, fontSize: "0.66rem", letterSpacing: "0.1em", textTransform: "uppercase", color: color.textMuted }}>X</a>
        </div>
        <p style={{ fontFamily: font.mono, fontSize: "0.6rem", letterSpacing: "0.16em", color: color.textFaint }}>ROBINHOOD CHAIN · MAINNET 4663</p>
      </footer>

      {/* ───────── waitlist modal ───────── */}
      {modalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          style={{
            position: "fixed", inset: 0, zIndex: 200, background: "rgba(4,7,5,0.9)",
            backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
          }}
        >
          <div
            style={{
              width: "100%", maxWidth: "440px", maxHeight: "92vh", overflowY: "auto",
              background: color.panel, border: `1px solid ${color.border}`, borderRadius: "14px",
              padding: "26px 22px 22px", animation: "modalIn 0.25s ease both", position: "relative",
            }}
          >
            <button onClick={closeModal} style={{ position: "absolute", top: "14px", right: "16px", background: "none", border: "none", cursor: "pointer", color: color.textFaint, fontSize: "1.1rem" }}>
              ✕
            </button>

            {alreadySubmitted ? (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: color.lime, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <IconCheck size={18} />
                </div>
                <p style={{ fontFamily: font.mono, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: color.lime, margin: "0 0 8px" }}>Application received</p>
                <p style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.3rem", margin: "0 0 10px" }}>You're on the list.</p>
                <p style={{ fontSize: "0.85rem", color: color.textMuted, lineHeight: 1.6, margin: 0 }}>
                  This wallet's spot has been saved. Selected applicants will be notified before mint.
                </p>
              </div>
            ) : success ? (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: color.lime, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <IconCheck size={18} />
                </div>
                <p style={{ fontFamily: font.mono, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: color.lime, margin: "0 0 8px" }}>Application sent</p>
                <p style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.3rem", margin: "0 0 10px" }}>You're under review.</p>
                <p style={{ fontSize: "0.85rem", color: color.textMuted, lineHeight: 1.6, margin: 0 }}>
                  Selected wallets will be notified before mint.
                </p>
              </div>
            ) : (
              <>
                <p style={{ fontFamily: font.mono, fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", color: color.lime, margin: "0 0 6px" }}>Waitlist Application</p>
                <p style={{ fontFamily: font.display, fontWeight: 700, fontSize: "1.3rem", margin: "0 0 6px" }}>Claim your spot.</p>
                <p style={{ fontSize: "0.8rem", color: color.textMuted, margin: "0 0 14px", lineHeight: 1.5 }}>
                  Complete all four steps, then submit.
                </p>
                <div style={{ height: "3px", background: color.border, borderRadius: "2px", overflow: "hidden", marginBottom: "6px" }}>
                  <div style={{ height: "100%", background: color.lime, width: `${(doneCount / 4) * 100}%`, transition: "width 0.3s ease" }} />
                </div>
                <p style={{ fontFamily: font.mono, fontSize: "0.62rem", color: color.textFaint, margin: "0 0 18px" }}>{doneCount} of 4 steps complete</p>

                {/* Step 1 — like */}
                <div style={{ border: `1px solid ${color.border}`, borderRadius: "10px", padding: "14px", marginBottom: "10px" }}>
                  <p style={{ margin: "0 0 8px", fontFamily: font.mono, fontSize: "0.68rem", letterSpacing: "0.06em", color: color.textMuted }}>
                    STEP 1 — Like the pinned post on X
                  </p>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <a href={PINNED_TWEET_URL} target="_blank" rel="noopener noreferrer" onClick={() => setLiked(true)}
                      style={{ flex: 1, textAlign: "center", fontFamily: font.mono, fontSize: "0.66rem", letterSpacing: "0.08em", textTransform: "uppercase", color: color.text, border: `1px solid ${color.borderStrong}`, borderRadius: "7px", padding: "9px", textDecoration: "none" }}>
                      Open post
                    </a>
                    <button
                      disabled={!liked || t1}
                      onClick={() => setLikeConfirmed(true)}
                      style={{
                        flex: 1, fontFamily: font.mono, fontSize: "0.66rem", letterSpacing: "0.08em", textTransform: "uppercase",
                        color: t1 ? color.bg : liked ? color.bg : color.textFaint,
                        background: t1 || liked ? color.lime : "rgba(255,255,255,0.04)",
                        border: "none", borderRadius: "7px", padding: "9px", cursor: liked && !t1 ? "pointer" : "default",
                      }}
                    >
                      {t1 ? "Confirmed" : "I've liked it"}
                    </button>
                  </div>
                </div>

                {/* Step 2 — quote */}
                <div style={{ border: `1px solid ${color.border}`, borderRadius: "10px", padding: "14px", marginBottom: "10px" }}>
                  <p style={{ margin: "0 0 8px", fontFamily: font.mono, fontSize: "0.68rem", letterSpacing: "0.06em", color: color.textMuted }}>
                    STEP 2 — Quote the pinned post
                  </p>
                  <a href={PINNED_TWEET_URL} target="_blank" rel="noopener noreferrer"
                    style={{ display: "block", textAlign: "center", fontFamily: font.mono, fontSize: "0.66rem", letterSpacing: "0.08em", textTransform: "uppercase", color: color.text, border: `1px solid ${color.borderStrong}`, borderRadius: "7px", padding: "9px", textDecoration: "none", marginBottom: "8px" }}>
                    Open post
                  </a>
                  <input placeholder="https://x.com/you/status/..." value={quoteUrl} disabled={t2}
                    onChange={(e) => setQuoteUrl(e.target.value)} style={inputStyle} />
                  {quoteUrl && !isValidUrl(quoteUrl) && (
                    <p style={{ fontSize: "0.68rem", color: color.danger, margin: "6px 0 0" }}>Needs a valid https:// link.</p>
                  )}
                  {isValidUrl(quoteUrl) && !t2 && (
                    <button onClick={() => setQuoteConfirmed(true)} style={{ marginTop: "8px", width: "100%", fontFamily: font.mono, fontSize: "0.64rem", letterSpacing: "0.08em", textTransform: "uppercase", color: color.bg, background: color.lime, border: "none", borderRadius: "7px", padding: "8px", cursor: "pointer" }}>
                      Confirm link
                    </button>
                  )}
                  {t2 && <p style={{ fontSize: "0.68rem", color: color.lime, margin: "8px 0 0" }}>Quote confirmed.</p>}
                </div>

                {/* Step 3 — comment + tag */}
                <div style={{ border: `1px solid ${color.border}`, borderRadius: "10px", padding: "14px", marginBottom: "10px" }}>
                  <p style={{ margin: "0 0 8px", fontFamily: font.mono, fontSize: "0.68rem", letterSpacing: "0.06em", color: color.textMuted }}>
                    STEP 3 — Comment and tag two friends
                  </p>
                  <a href={PINNED_TWEET_URL} target="_blank" rel="noopener noreferrer"
                    style={{ display: "block", textAlign: "center", fontFamily: font.mono, fontSize: "0.66rem", letterSpacing: "0.08em", textTransform: "uppercase", color: color.text, border: `1px solid ${color.borderStrong}`, borderRadius: "7px", padding: "9px", textDecoration: "none", marginBottom: "8px" }}>
                    Open post
                  </a>
                  <input placeholder="https://x.com/you/status/..." value={commentUrl} disabled={t3}
                    onChange={(e) => setCommentUrl(e.target.value)} style={inputStyle} />
                  {commentUrl && !isValidUrl(commentUrl) && (
                    <p style={{ fontSize: "0.68rem", color: color.danger, margin: "6px 0 0" }}>Needs a valid https:// link.</p>
                  )}
                  {isValidUrl(commentUrl) && !t3 && (
                    <button onClick={() => setCommentConfirmed(true)} style={{ marginTop: "8px", width: "100%", fontFamily: font.mono, fontSize: "0.64rem", letterSpacing: "0.08em", textTransform: "uppercase", color: color.bg, background: color.lime, border: "none", borderRadius: "7px", padding: "8px", cursor: "pointer" }}>
                      Confirm link
                    </button>
                  )}
                  {t3 && <p style={{ fontSize: "0.68rem", color: color.lime, margin: "8px 0 0" }}>Comment confirmed.</p>}
                </div>

                {/* Step 4 — wallet */}
                <div style={{ border: `1px solid ${color.border}`, borderRadius: "10px", padding: "14px", marginBottom: "18px" }}>
                  <p style={{ margin: "0 0 8px", fontFamily: font.mono, fontSize: "0.68rem", letterSpacing: "0.06em", color: color.textMuted }}>
                    STEP 4 — Submit your EVM address
                  </p>
                  <input placeholder="0x..." value={wallet} disabled={t4}
                    onChange={(e) => setWallet(e.target.value)} style={inputStyle} />
                  {wallet && !isValidEvm(wallet) && (
                    <p style={{ fontSize: "0.68rem", color: color.danger, margin: "6px 0 0" }}>Not a valid EVM address.</p>
                  )}
                  {isValidEvm(wallet) && !t4 && (
                    <button onClick={() => setWalletConfirmed(true)} style={{ marginTop: "8px", width: "100%", fontFamily: font.mono, fontSize: "0.64rem", letterSpacing: "0.08em", textTransform: "uppercase", color: color.bg, background: color.lime, border: "none", borderRadius: "7px", padding: "8px", cursor: "pointer" }}>
                      Confirm wallet
                    </button>
                  )}
                  {t4 && <p style={{ fontSize: "0.68rem", color: color.lime, margin: "8px 0 0" }}>Wallet confirmed.</p>}
                  <p style={{ fontSize: "0.66rem", color: color.textFaint, margin: "8px 0 0", lineHeight: 1.4 }}>Never share your private key or seed phrase.</p>
                </div>

                {err && <p style={{ fontSize: "0.78rem", color: color.danger, margin: "0 0 10px" }}>{err}</p>}

                <button
                  disabled={!allDone || sending}
                  onClick={submit}
                  style={{
                    width: "100%",
                    fontFamily: font.mono, fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase",
                    color: allDone ? color.bg : color.textFaint,
                    background: allDone ? color.lime : "rgba(255,255,255,0.04)",
                    border: `1px solid ${allDone ? color.lime : color.border}`,
                    borderRadius: "8px", padding: "15px", cursor: allDone && !sending ? "pointer" : "not-allowed",
                  }}
                >
                  {sending ? "Submitting..." : allDone ? "Submit application" : "Complete all steps to submit"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
