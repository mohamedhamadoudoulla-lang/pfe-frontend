import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Ruler, Bed, Bath, ImageIcon } from "lucide-react";
import "./PropertyCard.css";

const STATUT_STYLES = {
  disponible: { bg: "#e1f5ee", text: "#085041", label: "Disponible" },
  nouveau: { bg: "#e6f1fb", text: "#0c447c", label: "Nouveau" },
  vendu: { bg: "#f1efe8", text: "#5f5e5a", label: "Vendu" },
};

export default function PropertyCard({ property }) {
  const navigate = useNavigate();
  const [favori, setFavori] = useState(false);
  const statut = STATUT_STYLES[property.statut] || STATUT_STYLES.disponible;

  return (
    <div className="property-card" onClick={() => navigate(`/property/${property._id}`)}>
      <div className="property-image">
        {property.images?.[0] ? (
          <img src={property.images[0]} alt={property.titre} loading="lazy" />
        ) : (
          <div className="property-image-placeholder">
            <ImageIcon size={32} color="#bbb" />
          </div>
        )}
        <span className="property-badge" style={{ background: statut.bg, color: statut.text }}>
          {statut.label}
        </span>
        <button
          className="property-favori"
          onClick={(e) => { e.stopPropagation(); setFavori(!favori); }}
          aria-label="Ajouter aux favoris"
        >
          <Heart size={14} fill={favori ? "#ef4444" : "none"} color={favori ? "#ef4444" : "#666"} />
        </button>
      </div>
      <div className="property-info">
        <p className="property-titre">{property.titre}</p>
        <p className="property-localisation">
          <MapPin size={12} /> {property.ville}, {property.pays}
        </p>
        <div className="property-specs">
          <span><Ruler size={12} /> {property.surface}m²</span>
          {property.chambres != null && <span><Bed size={12} /> {property.chambres} ch.</span>}
          {property.sallesDeBain != null && <span><Bath size={12} /> {property.sallesDeBain} sdb</span>}
        </div>
        <p className="property-prix">{property.prix.toLocaleString("fr-TN")} DT</p>
      </div>
    </div>
  );
}
