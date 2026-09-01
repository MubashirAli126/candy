import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Candy — Ladies 3 Piece, 2 Piece Suits & Kurtis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Polka dots from the printed logo, scattered across the 1200×630 card. */
const DOTS = [
  { top: 40, left: 60, size: 46, color: "#E1252B" },
  { top: 120, left: 220, size: 30, color: "#22B24C" },
  { top: 50, left: 420, size: 36, color: "#FDC10D" },
  { top: 90, left: 700, size: 30, color: "#E1252B" },
  { top: 40, left: 920, size: 44, color: "#22B24C" },
  { top: 150, left: 1080, size: 32, color: "#FDC10D" },
  { top: 300, left: 70, size: 32, color: "#FDC10D" },
  { top: 420, left: 180, size: 44, color: "#22B24C" },
  { top: 520, left: 380, size: 30, color: "#E1252B" },
  { top: 480, left: 660, size: 38, color: "#FDC10D" },
  { top: 540, left: 900, size: 30, color: "#22B24C" },
  { top: 360, left: 1090, size: 44, color: "#E1252B" },
];

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        {DOTS.map((d, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: d.top,
              left: d.left,
              width: d.size,
              height: d.size,
              borderRadius: 999,
              background: d.color,
            }}
          />
        ))}
        <div
          style={{
            display: "flex",
            fontSize: 150,
            fontWeight: 800,
            color: "#E1252B",
            letterSpacing: -2,
          }}
        >
          candy
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 8,
            fontSize: 38,
            fontWeight: 700,
            color: "#2B1020",
            letterSpacing: 4,
          }}
        >
          WHOLESALE LADIES GARMENTS
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 32,
            color: "rgba(43,16,32,0.7)",
          }}
        >
          3 Piece · 2 Piece · Kurti — Karachi, Pakistan
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 26,
            color: "#FFFFFF",
            background: "#E1252B",
            padding: "12px 28px",
            borderRadius: 999,
          }}
        >
          0300-9297355 · 0312-2970685
        </div>
      </div>
    ),
    { ...size }
  );
}
