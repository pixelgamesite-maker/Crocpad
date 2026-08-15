import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { color, font, RULE, X_URL } from "@/lib/theme";
import SignInButton from "@/components/sign-in-button";

type NavItem = { label: string; href: string; live: boolean };

/** Order encodes the product's actual sequence: mint first, then what
 *  holding unlocks, then the reference material. */
export const NAV: NavItem[] = [
  { label: "Mint", href: "/mint", live: true },
  { label: "Vault", href: "/vault", live: false },
  { label: "Staking", href: "/staking", live: false },
  { label: "Traits", href: "/traits", live: false },
  { label: "Token", href: "/token", live: false },
  { label: "Economy", href: "/economy", live: false },
  { label: "Docs", href: "/docs", live: false },
];

function IconX({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  // Close the menu on route change so a tap-through doesn't leave it hanging.
  useEffect(() => { setOpen(false); }, [location]);

  // Lock body scroll while the overlay is up.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        style={{
          position: "sticky", top: 0, zIndex: 60,
          background: color.paper,
          borderBottom: RULE,
          height: "64px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 18px",
        }}
      >
        <Link href="/">
          <a style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <img
              src="/croclogo.jpg"
              alt=""
              style={{ width: "30px", height: "30px", objectFit: "cover", border: RULE }}
            />
            <span style={{ fontFamily: font.display, fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
              CROCPAD
            </span>
          </a>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <SignInButton />
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            style={{
              width: "42px", height: "42px", border: RULE, background: open ? color.ink : color.paper,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: "4px", cursor: "pointer", padding: 0,
            }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block", width: "18px", height: "2px",
                  background: open ? color.paper : color.ink,
                  transition: "transform 0.18s, opacity 0.18s",
                  transform:
                    open && i === 0 ? "translateY(6px) rotate(45deg)" :
                    open && i === 2 ? "translateY(-6px) rotate(-45deg)" : "none",
                  opacity: open && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </header>

      {/* slide-out panel, anchored right */}
      <div
        onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        style={{
          position: "fixed", inset: 0, zIndex: 55,
          background: "rgba(18,20,15,0.35)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.2s",
        }}
      >
        <nav
          style={{
            position: "absolute", top: 0, right: 0, bottom: 0,
            width: "min(340px, 86vw)",
            background: color.paper,
            borderLeft: RULE,
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.26s cubic-bezier(0.2,0,0,1)",
            display: "flex", flexDirection: "column",
            paddingTop: "64px",
          }}
        >
          <div style={{ flex: 1, overflowY: "auto" }}>
            {NAV.map((item) => {
              const active = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "18px 22px",
                      borderBottom: RULE,
                      background: active ? color.sun : "transparent",
                      fontFamily: font.display, fontWeight: 700, fontSize: "1.35rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.label}
                    {!item.live && (
                      <span style={{ fontFamily: font.mono, fontSize: "0.6rem", letterSpacing: "0.1em", color: color.inkFaint, textTransform: "uppercase" }}>
                        Soon
                      </span>
                    )}
                  </a>
                </Link>
              );
            })}
          </div>

          <a
            href={X_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "18px 22px", borderTop: RULE,
              fontFamily: font.mono, fontSize: "0.75rem", letterSpacing: "0.06em",
            }}
          >
            <IconX /> @CrocpadRBH
          </a>
        </nav>
      </div>
    </>
  );
}
