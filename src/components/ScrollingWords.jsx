import React from "react";
import {
  MapPin, Home, Calculator, Paintbrush, Sofa, FileText,
  UserCheck, CheckCircle, Zap, TrendingUp, Star, Award,
  Shield, Gem, Layers, PenTool
} from "lucide-react";
import "./ScrollingWords.css";

const words = [
  { text: "Choisissez votre terrain", icon: MapPin, color: "#1e293b" },
  { text: "Configurez votre maison", icon: Home, color: "#3b82f6" },
  { text: "Estimez les couts", icon: Calculator, color: "#6b7280" },
  { text: "Choisissez la finition", icon: Paintbrush, color: "#92400e" },
  { text: "Meublez votre interieur", icon: Sofa, color: "#7c3aed" },
  { text: "Telechargez le devis PDF", icon: FileText, color: "#059669" },
  { text: "Contactez un ingenieur", icon: UserCheck, color: "#dc2626" },
  { text: "Validez votre projet", icon: CheckCircle, color: "#0891b2" },
  { text: "Devis instantane", icon: Zap, color: "#d97706" },
  { text: "Prix du marche tunisien", icon: TrendingUp, color: "#4f46e5" },
  { text: "Finition Economique", icon: Star, color: "#16a34a" },
  { text: "Finition Standard", icon: Award, color: "#2563eb" },
  { text: "Finition Haut de Gamme", icon: Gem, color: "#be185d" },
  { text: "Materiaux certifies", icon: Shield, color: "#854d0e" },
  { text: "Ingenieurs verifies", icon: UserCheck, color: "#1d4ed8" },
  { text: "Export PDF gratuit", icon: FileText, color: "#b45309" },
];

export default function ScrollingWords() {
  const items = [...words, ...words];

  return (
    <div className="scroll-section">
      <div className="scroll-row scroll-left">
        <div className="scroll-track">
          {items.map((item, index) => (
            <span key={index} className="scroll-item" style={{ color: item.color }}>
              <item.icon size={22} style={{ color: item.color, verticalAlign: "middle", marginRight: 10 }} />
              {item.text}
            </span>
          ))}
        </div>
      </div>

      <div className="scroll-row scroll-right">
        <div className="scroll-track">
          {items.map((item, index) => (
            <span key={index} className="scroll-item" style={{ color: item.color }}>
              <item.icon size={22} style={{ color: item.color, verticalAlign: "middle", marginRight: 10 }} />
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
