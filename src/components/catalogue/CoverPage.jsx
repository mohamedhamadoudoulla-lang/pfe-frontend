import React from "react";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#E8C95A";
const DARK = "#1a1a1a";
const DARK2 = "#111";

export default function CoverPage({ data }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(160deg, ${DARK} 0%, #0d0d0d 50%, #1a1200 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Architectural lines */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "-20%",
            right: "-20%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,.06), rgba(212,175,55,.12), rgba(212,175,55,.06), transparent)",
            transform: `rotate(${-8 + i * 0.5}deg)`,
            top: `${8 + i * 8}%`,
          }}
        />
      ))}

      {/* Gold border */}
      <div
        style={{
          position: "absolute",
          inset: "16px",
          border: `1px solid rgba(212,175,55,.2)`,
          pointerEvents: "none",
        }}
      />

      {/* Corner accents */}
      {[
        { top: "12px", left: "12px" },
        { top: "12px", right: "12px" },
        { bottom: "12px", left: "12px" },
        { bottom: "12px", right: "12px" },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...pos,
            width: "24px",
            height: "24px",
            borderTop: pos.top ? `2px solid ${GOLD}` : "none",
            borderBottom: pos.bottom ? `2px solid ${GOLD}` : "none",
            borderLeft: pos.left ? `2px solid ${GOLD}` : "none",
            borderRight: pos.right ? `2px solid ${GOLD}` : "none",
          }}
        />
      ))}

      {/* Eyebrow */}
      <div
        style={{
          position: "absolute",
          top: "28px",
          fontFamily: "sans-serif",
          fontSize: "9px",
          letterSpacing: "4px",
          color: "rgba(212,175,55,.5)",
          textTransform: "uppercase",
        }}
      >
        CATALOGUE OFFICIEL 2024
      </div>

      {/* Main content */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
        {/* Logo mark */}
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 20px",
            border: `2px solid ${GOLD}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Georgia', serif",
            fontSize: "28px",
            fontWeight: 700,
            color: GOLD,
            letterSpacing: "2px",
          }}
        >
          SB
        </div>

        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: "14px",
            fontWeight: 300,
            letterSpacing: "10px",
            color: "#888",
            textTransform: "uppercase",
          }}
        >
          SMART
        </div>
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "42px",
            fontWeight: 700,
            letterSpacing: "12px",
            color: GOLD,
            textTransform: "uppercase",
            lineHeight: 1,
            marginTop: "-2px",
          }}
        >
          BUILD
        </div>

        {/* Divider */}
        <div
          style={{
            width: "60px",
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            margin: "20px auto",
          }}
        />

        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "13px",
            fontWeight: 300,
            fontStyle: "italic",
            color: "rgba(255,255,255,.6)",
            lineHeight: 1.8,
          }}
        >
          {data.subtitle}
        </p>
      </div>

      {/* Bottom brand */}
      <div
        style={{
          position: "absolute",
          bottom: "24px",
          fontFamily: "sans-serif",
          fontSize: "8px",
          letterSpacing: "5px",
          color: "rgba(212,175,55,.3)",
          textTransform: "uppercase",
        }}
      >
        SMARTBUILD
      </div>
    </div>
  );
}
