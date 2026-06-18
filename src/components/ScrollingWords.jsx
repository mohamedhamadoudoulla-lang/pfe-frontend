import React from "react";
import "./ScrollingWords.css";

const stepsRow1 = [
  "Choisissez votre terrain",
  "Configurez votre maison",
  "Estimez les couts",
  "Choisissez la finition",
  "Meublez votre interieur",
  "Telechargez le devis PDF",
  "Contactez un ingenieur",
  "Validez votre projet",
  "Choisissez votre terrain",
  "Configurez votre maison",
  "Estimez les couts",
  "Choisissez la finition",
  "Meublez votre interieur",
  "Telechargez le devis PDF",
  "Contactez un ingenieur",
  "Validez votre projet",
];

const jargonRow2 = [
  "Devis instantane",
  "Prix du marche tunisien",
  "Finition Economique",
  "Finition Standard",
  "Finition Haut de Gamme",
  "Materiaux certifies",
  "Ingenieurs verifies",
  "Export PDF gratuit",
  "Devis instantane",
  "Prix du marche tunisien",
  "Finition Economique",
  "Finition Standard",
  "Finition Haut de Gamme",
  "Materiaux certifies",
  "Ingenieurs verifies",
  "Export PDF gratuit",
];

export default function ScrollingWords({ variant }) {
  const items1 = [...stepsRow1, ...stepsRow1];
  const items2 = [...jargonRow2, ...jargonRow2];

  return (
    <div className={`scroll-section ${variant === "estimation" ? "scroll-section-estimation" : ""}`}>
      <div className="scroll-row scroll-left">
        <div className="scroll-track">
          {items1.map((word, index) => (
            <span key={index} className="scroll-item">
              {word}
            </span>
          ))}
        </div>
      </div>

      <div className="scroll-row scroll-right">
        <div className="scroll-track">
          {items2.map((word, index) => (
            <span key={index} className="scroll-item scroll-item-outline">
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
