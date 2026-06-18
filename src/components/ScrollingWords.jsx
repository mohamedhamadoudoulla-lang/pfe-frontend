import React from "react";
import "./ScrollingWords.css";

const wordsRow1 = [
  "SMARTBUILD",
  "CONSTRUCTION",
  "ESTIMATION",
  "TERRAIN",
  "DEVIS",
  "ARCHITECTURE",
  "MATERIALS",
  "Finition",
  "INGENIEUR",
  "MARKETPLACE",
  "AMeUBLEMENT",
  "PLANNING",
  "SmartBUILD",
  "CONSTRUCTION",
  "ESTIMATION",
  "TERRAIN",
  "DEVIS",
  "ARCHITECTURE",
  "MATERIALS",
  "Finition",
  "INGENIEUR",
  "MARKETPLACE",
  "AMeUBLEMENT",
  "PLANNING",
];

const wordsRow2 = [
  "Premium",
  "Innovation",
  "Qualite",
  "Confiance",
  "Expertise",
  "Moderne",
  "Durable",
  "Professionnel",
  "Premium",
  "Innovation",
  "Qualite",
  "Confiance",
  "Expertise",
  "Moderne",
  "Durable",
  "Professionnel",
  "Premium",
  "Innovation",
  "Qualite",
  "Confiance",
  "Expertise",
  "Moderne",
  "Durable",
  "Professionnel",
];

export default function ScrollingWords() {
  const items1 = [...wordsRow1, ...wordsRow1];
  const items2 = [...wordsRow2, ...wordsRow2];

  return (
    <div className="scroll-section">
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
