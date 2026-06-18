import React from "react";

const GOLD = "#D4AF37";
const GOLD_LIGHT = "#E8C95A";

export default function SummaryPage({ data }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      {/* Left gold panel */}
      <div
        style={{
          width: "38%",
          background: `linear-gradient(160deg, ${GOLD} 0%, #b8922e 40%, #8b6914 80%, ${GOLD} 100%)`,
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Texture */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(0,0,0,.04) 18px, rgba(0,0,0,.04) 19px)",
          }}
        />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "30px 24px" }}>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: "48px", color: "rgba(26,18,0,.2)", lineHeight: 0.6, marginBottom: 6 }}>
            "
          </div>
          <blockquote
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "14px",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#1a1200",
              lineHeight: 1.9,
              margin: 0,
            }}
          >
            Construire l'avenir avec force,
            <br />
            vision et leadership,
            <br />
            <em style={{ fontWeight: 400, color: "rgba(26,18,0,.75)" }}>-- un projet a la fois.</em>
          </blockquote>
          <div style={{ fontFamily: "'Georgia', serif", fontSize: "48px", color: "rgba(26,18,0,.2)", lineHeight: 0.6, marginTop: 6 }}>
            "
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "16px",
            fontFamily: "sans-serif",
            fontSize: "7px",
            fontWeight: 600,
            letterSpacing: "5px",
            color: "rgba(26,18,0,.35)",
            textTransform: "uppercase",
          }}
        >
          SMARTBUILD
        </div>
      </div>

      {/* Right dark panel */}
      <div
        style={{
          flex: 1,
          background: "#232320",
          position: "relative",
          display: "flex",
          alignItems: "center",
          padding: "36px 32px",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
          <h2
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "26px",
              fontWeight: 600,
              letterSpacing: "8px",
              color: GOLD_LIGHT,
              marginBottom: "28px",
              textTransform: "uppercase",
            }}
          >
            {data.title}
          </h2>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {data.items.map((item, i) => (
              <li
                key={i}
                style={{
                  borderBottom: "1px solid rgba(212,175,55,.1)",
                  padding: "10px 0",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "12px",
                    fontWeight: 300,
                    color: "#e0e0e0",
                    letterSpacing: "0.5px",
                    flexShrink: 0,
                  }}
                >
                  {item.label}
                </span>
                <span style={{ flex: 1, margin: "0 10px", display: "flex", alignItems: "center" }}>
                  <span
                    style={{
                      flex: 1,
                      height: "1px",
                      background:
                        "repeating-linear-gradient(90deg, rgba(212,175,55,.3) 0px, rgba(212,175,55,.3) 3px, transparent 3px, transparent 7px)",
                    }}
                  />
                </span>
                <span
                  style={{
                    fontFamily: "sans-serif",
                    fontSize: "11px",
                    color: GOLD,
                    fontWeight: 400,
                    minWidth: "24px",
                    textAlign: "right",
                  }}
                >
                  {item.page}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Page number */}
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            right: "16px",
            fontFamily: "'Georgia', serif",
            fontSize: "10px",
            color: "rgba(212,175,55,.3)",
          }}
        >
          2
        </div>
      </div>
    </div>
  );
}
