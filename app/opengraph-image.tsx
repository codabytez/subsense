import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Subsense — Subscription management, simplified.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0e0e13",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow blobs */}
      <div
        style={{
          position: "absolute",
          top: -160,
          left: -160,
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,92,252,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -200,
          right: -100,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(124,92,252,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          padding: "56px 72px",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 28,
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(12px)",
          maxWidth: 860,
          width: "100%",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: "#7c5cfc",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 48px rgba(124,92,252,0.5)",
          }}
        >
          <svg width="38" height="35" viewBox="0 0 29 27" fill="none">
            <path
              d="M17.25 27C16 27 14.9375 26.5625 14.0625 25.6875C13.1875 24.8125 12.75 23.75 12.75 22.5C12.75 21.25 13.1875 20.1875 14.0625 19.3125C14.9375 18.4375 16 18 17.25 18C18.5 18 19.5625 18.4375 20.4375 19.3125C21.3125 20.1875 21.75 21.25 21.75 22.5C21.75 23.75 21.3125 24.8125 20.4375 25.6875C19.5625 26.5625 18.5 27 17.25 27ZM20.25 16.5C17.95 16.5 16 15.7 14.4 14.1C12.8 12.5 12 10.55 12 8.25C12 5.95 12.8 4 14.4 2.4C16 0.8 17.95 0 20.25 0C22.55 0 24.5 0.8 26.1 2.4C27.7 4 28.5 5.95 28.5 8.25C28.5 10.55 27.7 12.5 26.1 14.1C24.5 15.7 22.55 16.5 20.25 16.5ZM6 22.5C4.35 22.5 2.9375 21.9125 1.7625 20.7375C0.5875 19.5625 0 18.15 0 16.5C0 14.85 0.5875 13.4375 1.7625 12.2625C2.9375 11.0875 4.35 10.5 6 10.5C7.65 10.5 9.0625 11.0875 10.2375 12.2625C11.4125 13.4375 12 14.85 12 16.5C12 18.15 11.4125 19.5625 10.2375 20.7375C9.0625 21.9125 7.65 22.5 6 22.5Z"
              fill="white"
            />
          </svg>
        </div>

        {/* Brand name */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-2px",
              lineHeight: 1,
            }}
          >
            Subsense
          </span>
          <span
            style={{
              fontSize: 26,
              color: "rgba(255,255,255,0.45)",
              letterSpacing: "0.5px",
            }}
          >
            Subscription management, simplified.
          </span>
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 8,
          }}
        >
          {["Track", "Analyze", "Stay on top"].map((label) => (
            <div
              key={label}
              style={{
                padding: "8px 20px",
                borderRadius: 100,
                border: "1px solid rgba(124,92,252,0.4)",
                background: "rgba(124,92,252,0.1)",
                color: "#a589fd",
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom domain */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          color: "rgba(255,255,255,0.2)",
          fontSize: 16,
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        subsense.unbuilt.studio
      </div>
    </div>,
    { ...size }
  );
}
