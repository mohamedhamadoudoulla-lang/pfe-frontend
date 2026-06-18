import React from "react";
import "./ScrollingWords.css";

const words = [
  "Choisissez votre terrain",
  "Configurez votre maison",
  "Estimez les couts",
  "Choisissez la finition",
  "Meublez votre interieur",
  "Telechargez le devis PDF",
  "Contactez un ingenieur",
  "Validez votre projet",
  "Devis instantane",
  "Prix du marche tunisien",
  "Finition Economique",
  "Finition Standard",
  "Finition Haut de Gamme",
  "Materiaux certifies",
  "Ingenieurs verifies",
  "Export PDF gratuit",
];

export default function ScrollingWords() {
  const items = [...words, ...words];

  return (
    <div className="scroll-section">
      <div className="scroll-row scroll-left">
        <div className="scroll-track">
          {items.map((word, index) => (
            <span key={index} className="scroll-item">
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="scroll-row scroll-right">
        <div className="scroll-track">
          {items.map((word, index) => (
            <span key={index} className="scroll-item">
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
