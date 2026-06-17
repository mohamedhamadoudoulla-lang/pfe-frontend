import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  ArrowLeft,
  MapPin,
  Ruler,
  Bed,
  Bath,
  Heart,
  MessageCircle,
  Calendar,
  Share2,
  Store,
} from "lucide-react";
import RainbowLines from "../components/RainbowLines";
import "./PropertyDetail.css";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgIdx, setImgIdx] = useState(0);
  const [favori, setFavori] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get(`/properties/${id}`);
        setProperty(res.data);
      } catch (err) {
        console.error("Erreur chargement bien:", err);
        setError("Bien introuvable");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const statutMap = {
    disponible: { bg: "#e1f5ee", text: "#085041", label: "Disponible" },
    nouveau: { bg: "#e6f1fb", text: "#0c447c", label: "Nouveau" },
    vendu: { bg: "#f1efe8", text: "#5f5e5a", label: "Vendu" },
  };

  if (loading) {
    return (
      <div className="pd-page">
        <RainbowLines variant="detail" />
        <div className="pd-loading">
          <div className="pd-spinner" />
          <p>Chargement du bien...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="pd-page">
        <RainbowLines variant="detail" />
        <div className="pd-error">
          <p>{error || "Bien introuvable"}</p>
          <button onClick={() => navigate("/catalogue")}>Retour au catalogue</button>
        </div>
      </div>
    );
  }

  const statut = statutMap[property.statut] || statutMap.disponible;
  const images =
    property.images && property.images.length > 0
      ? property.images
      : ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"];

  return (
    <div className="pd-page">
      <RainbowLines variant="detail" />

      <div className="pd-container">
        <button className="pd-back" onClick={() => navigate("/catalogue")}>
          <ArrowLeft size={16} /> Retour
        </button>

        <div className="pd-grid">
          {/* Galerie */}
          <div className="pd-gallery">
            <div className="pd-main-image">
              <img src={images[imgIdx]} alt={property.titre} />
              <span
                className="pd-badge"
                style={{ background: statut.bg, color: statut.text }}
              >
                {statut.label}
              </span>
            </div>
            {images.length > 1 && (
              <div className="pd-thumbs">
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Vue ${i + 1}`}
                    className={i === imgIdx ? "active" : ""}
                    onClick={() => setImgIdx(i)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="pd-details">
            <div className="pd-header">
              <h1 className="pd-titre">{property.titre}</h1>
              <span className="pd-price">
                {property.prix.toLocaleString("fr-TN")} DT
              </span>
            </div>

            <div className="pd-location">
              <MapPin size={15} />
              <span>
                {property.ville}, {property.pays}
              </span>
            </div>

            <div className="pd-specs">
              <div className="pd-spec">
                <Ruler size={20} />
                <div>
                  <span className="pd-spec-value">{property.surface}</span>
                  <span className="pd-spec-label">m²</span>
                </div>
              </div>
              {property.chambres != null && (
                <div className="pd-spec">
                  <Bed size={20} />
                  <div>
                    <span className="pd-spec-value">{property.chambres}</span>
                    <span className="pd-spec-label">
                      Chambre{property.chambres > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}
              {property.sallesDeBain != null && (
                <div className="pd-spec">
                  <Bath size={20} />
                  <div>
                    <span className="pd-spec-value">
                      {property.sallesDeBain}
                    </span>
                    <span className="pd-spec-label">
                      Salle{property.sallesDeBain > 1 ? "s" : ""} de bain
                    </span>
                  </div>
                </div>
              )}
              <div className="pd-spec">
                <Calendar size={20} />
                <div>
                  <span className="pd-spec-value" style={{ fontSize: 13 }}>
                    {new Date(property.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                  <span className="pd-spec-label">Publié</span>
                </div>
              </div>
            </div>

            <div className="pd-desc">
              <h3>Description</h3>
              <p>{property.description || "Aucune description disponible."}</p>
            </div>

            <div className="pd-actions">
              <button
                className="pd-btn pd-btn-primary"
                onClick={() => {
                  if (property.vendeurId?._id) {
                    navigate(`/messages/${property.vendeurId._id}`);
                  }
                }}
                disabled={!property.vendeurId?._id}
              >
                <MessageCircle size={16} /> Contacter le vendeur
              </button>
              <button
                className="pd-btn pd-btn-secondary"
                onClick={() => setFavori(!favori)}
              >
                <Heart
                  size={16}
                  fill={favori ? "#ef4444" : "none"}
                  color={favori ? "#ef4444" : "currentColor"}
                />
                {favori ? "En favori" : "Favori"}
              </button>
              <button className="pd-btn pd-btn-secondary">
                <Share2 size={16} /> Partager
              </button>
            </div>

            {property.vendeurId && (
              <div className="pd-vendor">
                <h3>Vendeur</h3>
                <div className="pd-vendor-info">
                  <div className="pd-vendor-avatar">
                    <Store size={18} color="#2952cc" />
                  </div>
                  <div>
                    <p className="pd-vendor-name">
                      {property.vendeurId.name || "Vendeur"}
                    </p>
                    <p className="pd-vendor-email">
                      {property.vendeurId.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
