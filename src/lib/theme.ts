/**
 * CrocPad design tokens.
 *
 * Direction: screenprint / risograph. Derived from the Crocs artwork
 * itself — thick black outlines, flat saturated color fields, and hard
 * offset shadows like a print that's slightly out of register. No
 * gradients, no glows, no soft blur anywhere in this system.
 */

export const color = {
  paper: "#EFEDE0",      // bone, warm with a green undertone
  paperDeep: "#E4E1D1",  // recessed panels, table stripes
  ink: "#12140F",        // near-black with a green undertone
  inkSoft: "#4A4E43",    // secondary text
  inkFaint: "#8A8D80",   // captions, disabled

  croc: "#46B23C",       // the green from the artwork
  sun: "#FFD52E",        // the yellow background of croc-1
  tongue: "#E8544E",     // the coral from the tongue and crown jewels
  deep: "#1F4D2B",       // deep swamp, for dark inversions
};

export const font = {
  display: "'Bricolage Grotesque', 'Arial Black', sans-serif",
  body: "'Public Sans', -apple-system, sans-serif",
  mono: "'DM Mono', 'Courier New', monospace",
};

export const FONT_LINK =
  "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Public+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap";

export function loadFonts() {
  if (typeof document === "undefined") return;
  if (document.getElementById("crocpad-fonts")) return;
  const link = document.createElement("link");
  link.id = "crocpad-fonts";
  link.rel = "stylesheet";
  link.href = FONT_LINK;
  document.head.appendChild(link);
}

// Structural constants for the print system.
export const RULE = `2px solid ${color.ink}`;
export const RULE_HAIR = `1px solid ${color.ink}`;

/** Hard offset shadow — the signature misregistration effect. */
export function offset(c: string, x = 6, y = 6) {
  return `${x}px ${y}px 0 ${c}`;
}

export const X_URL = "https://x.com/CrocpadRBH";
export const SITE_URL = "https://crocpad.fun";

export const CROC_IMAGES = [
  "/croc-1.jpg", "/croc-2.jpg", "/croc-3.jpg", "/croc-4.jpg",
  "/croc-5.jpg", "/croc-6.jpg", "/croc-7.jpg", "/croc-8.jpg",
];
