import React from "react";

const GOLD = "#D4AF37";

export default function QuotePage({ data }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: `linear-gradient(135deg, #0d0d0d 0%, #1a1200 50%, #0d0d0d 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background lines */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "-20%",
            right: "-20%",
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, rgba(212,175,55,.04), rgba(212,175,55,.08), rgba(212,175,55,.04), transparent)",
            transform: `rotate(${-6 + i * 0.8}deg)`,
            top: `${5 + i * 10}%`,
          }}
        />
      ))}

      {/* Border */}
      <div
        style={{
          position: "absolute",
          inset: "14px",
          border: "1px solid rgba(212,175,55,.15)",
          pointerEvents: "none",
        }}
      />

      <div style={{ textAlign: "center", position: "relative", zIndex: 2, padding: "0 30px" }}>
        {/* Icon */}
        <div
          style={{
            width: "56px",
            height: "56px",
            margin: "0 auto 16px",
            border: `1.5px solid ${GOLD}`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
          }}
        >
          &#9993;
        </div>

        <h3
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "24px",
            fontWeight: 300,
            color: "#f0f0f0",
            marginBottom: "6px",
          }}
        >
          {data.title}
        </h3>
        <p
          style={{
            fontFamily: "sans-serif",
            fontSize: "11px",
            color: "#888",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          {data.subtitle}
        </p>

        {/* Divider */}
        <div
          style={{
            width: "40px",
            height: "1px",
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            margin: "0 auto 24px",
          }}
        />

        {/* Contact items */}
        {[
          { icon: "&#9993;", label: data.email },
          { icon: "&#9742;", label: data.phone },
          { icon: "&#9873;", label: data.address },
          { icon: "&#8984;", label: data.website },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginBottom: "12px",
              fontFamily: "sans-serif",
              fontSize: "12px",
              color: "#ccc",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: GOLD,
                width: "20px",
                textAlign: "center",
              }}
              dangerouslySetInnerHTML={{ __html: item.icon }}
            />
            <span>{item.label}</span>
          </div>
        ))}

        {/* CTA */}
        <div
          style={{
            marginTop: "28px",
            padding: "10px 24px",
            border: `1px solid rgba(212,175,55,.4)`,
            color: GOLD,
            fontFamily: "sans-serif",
            fontSize: "10px",
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            display: "inline-block",
          }}
        >
          smartbuild.tn
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
        8
      </div>
    </div>
  );
}
