/**
 * CrocPad design tokens.
 *
 * Direction: a dark, moss-and-lime "terminal" aesthetic native to
 * Robinhood Chain's own bright-green identity, rendered through a
 * technical/monospace lens rather than a luxury or meme one.
 */

export const color = {
  bg: "#0A0F0C",          // near-black, green-tinted — "swamp water"
  panel: "#10231A",       // card / surface
  panelRaised: "#142B20", // slightly lighter surface (hover, inputs)
  border: "#1E3B2C",      // hairline borders
  borderStrong: "#2C4A3A",

  lime: "#C6FF3D",        // primary accent — electric lime, croc-eye
  limeDim: "#8FCC2A",     // pressed / muted lime
  teal: "#1B4D3E",        // secondary deep swamp accent

  text: "#F4F7F1",
  textMuted: "rgba(244,247,241,0.58)",
  textFaint: "rgba(244,247,241,0.34)",

  amber: "#FFB020",
  danger: "#FF6B5C",
};

export const font = {
  display: "'Space Grotesk', 'Segoe UI', sans-serif",
  body: "'Inter', 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
};

export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap";

export function loadFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById("crocpad-fonts")) return;
  const link = document.createElement("link");
  link.id = "crocpad-fonts";
  link.rel = "stylesheet";
  link.href = FONT_LINK;
  document.head.appendChild(link);
}

export const X_URL = "https://x.com/CrocpadRBH";

export const PINNED_TWEET_URL = "https://x.com/i/status/2077071416231346359";
