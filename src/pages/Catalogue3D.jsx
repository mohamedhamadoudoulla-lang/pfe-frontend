import React from "react";
import FlipBook from "../components/catalogue/FlipBook";

export default function Catalogue3D() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ece7df 0%, #d8d0c4 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 16px",
      }}
    >
      <FlipBook />
    </div>
  );
}
