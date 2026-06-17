import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

const IMAGES_TERRAIN = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
];
const IMAGES_EQUIPMENT = [
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=80",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
];

export default function ProduitCard({ produit, type, onAjoutPanier }) {
  const [ajoutEnCours, setAjoutEnCours] = useState(false);
  const [ajoute, setAjoute] = useState(false);

  const imageParDefaut =
    type === "terrain"
      ? IMAGES_TERRAIN[(produit._id?.charCodeAt(0) || 0) % 3]
      : IMAGES_EQUIPMENT[(produit._id?.charCodeAt(0) || 0) % 3];

  const handleAjoutPanier = async (e) => {
    e.stopPropagation();
    setAjoutEnCours(true);
    try {
      await API.post("/panier/ajouter", {
        produitId: produit._id,
        typeRef: type === "terrain" ? "Terrain" : "Equipement",
        quantite: 1,
        prixUnitaire: produit.totalPrice || produit.prix || produit.price || 0,
        nomProduit: produit.nom || produit.titre || produit.name || "Sans nom",
        imageProduit: produit.image || produit.images?.[0] || imageParDefaut,
        vendeurNom: produit.seller?.name || "",
      });
      setAjoute(true);
      toast.success("Ajoute au panier !");
      if (onAjoutPanier) onAjoutPanier();
      setTimeout(() => setAjoute(false), 3000);
    } catch (err) {
      toast.error("Connectez-vous pour ajouter au panier");
    }
    setAjoutEnCours(false);
  };

  const badgeColor = type === "terrain" ? "#1eb8a0" : "#1a6fff";
  const badgeLabel = type === "terrain" ? "Terrain" : "Equipement";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: "0.5px solid #e5e7eb",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "transform .2s, box-shadow .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
      }}
    >
      <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
        <img
          src={produit.image || produit.images?.[0] || imageParDefaut}
          alt={produit.nom || produit.titre || produit.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { e.target.src = imageParDefaut; }}
        />
        <span
          style={{
            position: "absolute", top: "12px", left: "12px",
            background: badgeColor, color: "#fff", fontSize: "11px",
            fontWeight: 500, padding: "4px 10px", borderRadius: "20px",
          }}
        >
          {badgeLabel}
        </span>
        {produit.isAvailable !== false && (
          <span
            style={{
              position: "absolute", top: "12px", right: "12px",
              background: "rgba(16,185,129,0.9)", color: "#fff",
              fontSize: "11px", padding: "4px 10px", borderRadius: "20px",
            }}
          >
            Disponible
          </span>
        )}
      </div>

      <div style={{ padding: "16px" }}>
        <h3 style={{ fontSize: "15px", fontWeight: 500, margin: "0 0 6px", color: "#111" }}>
          {produit.nom || produit.titre || produit.name}
        </h3>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 12px", lineHeight: 1.5 }}>
          {produit.description?.slice(0, 80)}
          {produit.description?.length > 80 ? "..." : ""}
        </p>

        {type === "terrain" && produit.surface && (
          <p style={{ fontSize: "12px", color: "#4a9eff", margin: "0 0 12px" }}>
            {produit.surface} m2 - {produit.city || produit.region}
          </p>
        )}

        {type === "terrain" && produit.seller && (
          <p style={{ fontSize: "12px", color: "#6b7280", margin: "0 0 12px" }}>
            {produit.seller.name}
          </p>
        )}

        {type === "equipement" && produit.category && (
          <p style={{ fontSize: "12px", color: "#4a9eff", margin: "0 0 12px" }}>
            {produit.category} - {produit.qualityLevel || "standard"}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "18px", fontWeight: 600, color: "#111" }}>
              {(produit.totalPrice || produit.prix || produit.price || 0).toLocaleString("fr-FR")} DT
            </span>
            {type === "terrain" && (
              <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                {" "}({produit.pricePerM2?.toLocaleString()} DT/m2)
              </span>
            )}
            {type === "equipement" && (
              <span style={{ fontSize: "12px", color: "#9ca3af" }}> / unite</span>
            )}
          </div>
          <button
            onClick={handleAjoutPanier}
            disabled={ajoutEnCours}
            style={{
              background: ajoute ? "#10b981" : "#1a6fff",
              color: "#fff", border: "none",
              padding: "8px 16px", borderRadius: "8px",
              fontSize: "13px", cursor: "pointer",
              transition: "background .3s",
            }}
          >
            {ajoutEnCours ? "..." : ajoute ? "Ajoute" : "+ Panier"}
          </button>
        </div>

        <p style={{ fontSize: "11px", color: "#9ca3af", margin: "10px 0 0", textAlign: "center" }}>
          Paiement en especes - Presence requise
        </p>
      </div>
    </div>
  );
}
