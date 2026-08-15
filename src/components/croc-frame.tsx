import { useEffect, useState } from "react";
import { color, font, RULE, CROC_IMAGES } from "@/lib/theme";

/** Color layers cycle alongside the art so the offset shadow shifts hue
 *  as the card rotates — the print never settles on one registration. */
const SHADOW_COLORS = [color.croc, color.sun, color.tongue];

export default function CrocFrame({
  size = 340,
  interval = 3200,
  caption,
}: {
  size?: number;
  interval?: number;
  caption?: string;
}) {
  const [i, setI] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setI((n) => (n + 1) % CROC_IMAGES.length);
        setFading(false);
      }, 220);
    }, interval);
    return () => clearInterval(id);
  }, [interval]);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: "14px" }}>
      <div
        className="misreg"
        style={{
          // @ts-expect-error -- CSS custom property
          "--misreg-color": SHADOW_COLORS[i % SHADOW_COLORS.length],
          width: size, height: size, maxWidth: "100%",
          border: RULE, background: color.paperDeep,
          position: "relative",
        }}
      >
        <img
          src={CROC_IMAGES[i]}
          alt="Crocs collection preview"
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            opacity: fading ? 0 : 1,
            transition: "opacity 0.22s linear",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
        <span style={{ fontFamily: font.mono, fontSize: "0.68rem", color: color.inkSoft, letterSpacing: "0.06em" }}>
          {caption ?? "Preview art · not your mint"}
        </span>
        <div style={{ display: "flex", gap: "4px" }}>
          {CROC_IMAGES.map((_, n) => (
            <span
              key={n}
              style={{
                width: n === i ? "16px" : "6px", height: "6px",
                background: n === i ? color.ink : color.inkFaint,
                transition: "width 0.24s, background 0.24s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
