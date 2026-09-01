import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Asad Sticker & Auto Zone — Car, Bike & Wall Stickers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background:
            "linear-gradient(135deg, #1E4A85 0%, #12294D 60%, #091426 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 104,
            fontWeight: 800,
            color: "#EEF2F6",
            letterSpacing: 4,
          }}
        >
          ASAD
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 4,
            fontSize: 44,
            fontWeight: 700,
            color: "#E08A4A",
            letterSpacing: 6,
          }}
        >
          STICKER &amp; AUTO ZONE
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 34,
            color: "rgba(238,242,246,0.85)",
          }}
        >
          Sticker for every surface ✨
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 24,
            color: "#0E1B33",
            background: "#E08A4A",
            padding: "12px 28px",
            borderRadius: 999,
          }}
        >
          Premium vinyl · Cash on delivery · Pakistan
        </div>
      </div>
    ),
    { ...size }
  );
}
