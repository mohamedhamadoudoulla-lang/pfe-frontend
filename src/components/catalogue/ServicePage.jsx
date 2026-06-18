import React from "react";

const GOLD = "#D4AF37";

export default function ServicePage({ data, pageNum }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#1a1a1a",
        position: "relative",
      }}
    >
      {/* Left accent strip */}
      <div
        style={{
          width: "48px",
          background: `linear-gradient(180deg, ${GOLD} 0%, #8b6914 100%)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 0",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "sans-serif",
            fontSize: "7px",
            fontWeight: 600,
            letterSpacing: "3px",
            color: "rgba(255,255,255,.5)",
            writingMode: "vertical-rl",
            textTransform: "uppercase",
          }}
        >
          SMARTBUILD
        </div>
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "12px",
            color: "rgba(255,255,255,.4)",
          }}
        >
          {String(pageNum).padStart(2, "0")}
        </div>
      </div>

      {/* Image section */}
      <div style={{ width: "55%", position: "relative", overflow: "hidden" }}>
        <img
          src={data.image}
          alt={data.title}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, transparent 60%, rgba(26,26,26,.85) 100%)",
          }}
        />
      </div>

      {/* Content section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "32px 28px",
          position: "relative",
          background: "linear-gradient(135deg, #1a1200 0%, #0d0d0d 100%)",
        }}
      >
        {/* Big number */}
        <div
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "52px",
            fontWeight: 600,
            color: "rgba(212,175,55,.08)",
            lineHeight: 1,
            marginBottom: "-8px",
          }}
        >
          {data.num}
        </div>

        <h3
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "22px",
            fontWeight: 300,
            color: "#f0f0f0",
            lineHeight: 1.3,
            marginBottom: "12px",
          }}
        >
          {data.title}
        </h3>

        {/* Gold rule */}
        <div
          style={{
            width: "36px",
            height: "1px",
            background: GOLD,
            marginBottom: "14px",
          }}
        />

        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "11px",
            fontWeight: 300,
            color: "#999",
            lineHeight: 1.8,
            marginBottom: "20px",
            maxWidth: "300px",
          }}
        >
          {data.description}
        </p>

        {/* Feature tags */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {data.features.map((f, i) => (
            <span
              key={i}
              style={{
                fontFamily: "sans-serif",
                fontSize: "8px",
                fontWeight: 500,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: GOLD,
                border: `1px solid rgba(212,175,55,.3)`,
                padding: "3px 10px",
                background: "rgba(212,175,55,.05)",
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Page number */}
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          right: "16px",
          fontFamily: "'Georgia', serif",
          fontSize: "10px",
          color: "rgba(212,175,55,.25)",
        }}
      >
        {pageNum}
      </div>
    </div>
  );
}
