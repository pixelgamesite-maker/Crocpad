import { color } from "@/lib/theme";

export function IconCheck({ size = 14, stroke = "#0A0F0C" }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 18 14" fill="none">
      <path d="M1.5 7L6.5 12L16.5 1.5" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconX({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

export function IconArrow({ size = 14, dir = "right" as "right" | "left" }: { size?: number; dir?: "right" | "left" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: dir === "left" ? "rotate(180deg)" : undefined }}>
      <path d="M5 12H19M13 6L19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
