import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTerrains } from "../services/api";
import { Search, ArrowLeft, MapPin, Maximize, DollarSign } from "lucide-react";
import { getImageProduit } from "../utils/imageAuto";
import "./TerrainMarketplace.css";

const FALLBACK_TERRAINS = [
  {
    _id: "terrain-fallback-1",
    title: "Terrain habitation ind. en vente",
    region: "Kairouan",
    city: "Kairouan",
    surface: 447,
    pricePerM2: 738,
    totalPrice: 330000,
    description: "A vendre, un terrain d'habitation d'une superficie de 447 m2, beneficiant d'un emplacement ideal dans un quartier residentiel calme et securise.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"],
    isAvailable: true,
    seller: { name: "Kairouan Invest Sarl", phone: "+21628842842" },
  },
  {
    _id: "terrain-fallback-2",
    title: "Terrain habitation ind. en vente",
    region: "Sfax",
    city: "Route Gremda",
    surface: 1052,
    pricePerM2: 309,
    totalPrice: 325000,
    description: "Ce terrain de superficie 1052 m2, situe dans un quartier calme et residentiel a route de Gremda km7, dispose de deux faades.",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80"],
    isAvailable: true,
    seller: { name: "Tecnocasa Sfax", phone: "+21674400000" },
  },
  {
    _id: "terrain-fallback-3",
    title: "Terrain habitation collective en vente",
    region: "Sfax",
    city: "Route De Tunis",
    surface: 920,
    pricePerM2: 701,
    totalPrice: 645000,
    description: "Ce terrain de superficie 920 m2 est situe sur la ceinture Bourguiba, route de Tunis km3.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"],
    isAvailable: true,
    seller: { name: "Tecnocasa Sfax", phone: "+21674400000" },
  },
  {
    _id: "terrain-fallback-4",
    title: "Grand terrain constructible",
    region: "Tunis",
    city: "La Marsa",
    surface: 800,
    pricePerM2: 1200,
    totalPrice: 960000,
    description: "Terrain premium situe dans le quartier le plus pris de La Marsa, ideal pour un projet residentiel de standing.",
    images: ["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80"],
    isAvailable: true,
    seller: { name: "Tunis Immobilier", phone: "+21671000000" },
  },
  {
    _id: "terrain-fallback-5",
    title: "Terrain agricole et residentiel",
    region: "Sousse",
    city: "Kantaoui",
    surface: 1500,
    pricePerM2: 200,
    totalPrice: 300000,
    description: "Terrain mixte a proximite de la zone touristique de Kantaoui. Superficie 1500m2, ideal pour projet residentiel ou agricole.",
    images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80"],
    isAvailable: true,
    seller: { name: "Sousse Invest", phone: "+21673000000" },
  },
];

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80';

export default function TerrainMarketplace() {
  const [terrains, setTerrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    getTerrains()
      .then((res) => setTerrains(res.data.length > 0 ? res.data : FALLBACK_TERRAINS))
      .catch(() => setTerrains(FALLBACK_TERRAINS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = terrains
    .filter((t) =>
      t.title?.toLowerCase().includes(search.toLowerCase()) ||
      t.region?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-asc") return (a.pricePerM2 || 0) - (b.pricePerM2 || 0);
      if (sort === "price-desc") return (b.pricePerM2 || 0) - (a.pricePerM2 || 0);
      if (sort === "surface") return (b.surface || 0) - (a.surface || 0);
      return 0;
    });

  if (loading) {
    return (
      <div className="terrain-marketplace-page">
        <div className="loading">Chargement des terrains...</div>
      </div>
    );
  }

  return (
    <div className="terrain-marketplace-page">
      <div className="page-header">
        <h1>Terrains disponibles</h1>
        <p>Decouvrez tous les terrains a vendre en Tunisie</p>
      </div>

      <div className="tm-stats-bar">
        <div className="tm-stat">
          <strong>{terrains.length}</strong> terrains listes
        </div>
        <div className="tm-stat">
          <strong>{new Set(terrains.map((t) => t.region)).size}</strong> regions
        </div>
        <div className="tm-stat">
          <strong>Vendeurs verifies</strong>
        </div>
      </div>

      <div className="tm-filter-bar">
        <div className="tm-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Rechercher par titre ou region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="tm-sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="default">Trier par defaut</option>
          <option value="price-asc">Prix/m2 croissant</option>
          <option value="price-desc">Prix/m2 decroissant</option>
          <option value="surface">Surface decroissante</option>
        </select>
      </div>

      <p className="tm-results-count">{filtered.length} resultat(s)</p>

      <div className="terrains-container">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>Aucun terrain disponible</p>
          </div>
        ) : (
          <div className="terrains-grid">
            {filtered.map((terrain) => {
              const total = terrain.totalPrice || (terrain.surface * terrain.pricePerM2);
              return (
                <div key={terrain._id} className="terrain-card">
                  <div className="terrain-card-img">
                    <img
                      className="terrain-card-image"
                      src={getImageProduit(terrain, 'terrain')}
                      alt={terrain.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = FALLBACK_IMG;
                      }}
                    />
                    <span className="terrain-region-tag">
                      <MapPin size={11} /> {terrain.city || terrain.region}
                    </span>
                  </div>

                  <div className="terrain-header">
                    <h3>{terrain.title}</h3>
                    <span className="region">{terrain.city || terrain.region}</span>
                  </div>

                  <div className="terrain-details">
                    <div className="detail-row">
                      <span><Maximize size={12} /> Surface</span>
                      <strong>{terrain.surface} m²</strong>
                    </div>
                    <div className="detail-row">
                      <span><DollarSign size={12} /> Prix/m²</span>
                      <strong>{terrain.pricePerM2} DT</strong>
                    </div>
                    <div className="detail-row">
                      <span><DollarSign size={12} /> Total</span>
                      <strong>{total?.toLocaleString()} DT</strong>
                    </div>
                  </div>

                  <p className="description">{terrain.description}</p>

                  {terrain.seller && (
                    <div className="seller-info">
                      <span>{terrain.seller.name}</span>
                      {terrain.seller.phone && <span>{terrain.seller.phone}</span>}
                    </div>
                  )}

                  <button
                    className="select-btn"
                    onClick={() => {
                      navigate("/terrain/estimation", {
                        state: {
                          region: terrain.region,
                          surface: terrain.surface,
                          lat: terrain.location?.coordinates?.[1] || null,
                          lng: terrain.location?.coordinates?.[0] || null,
                          address: terrain.city || "",
                          terrain: terrain,
                        },
                      });
                    }}
                  >
                    Choisir ce terrain
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="back-button">
        <button className="btn-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} style={{ marginRight: 6 }} /> Retour
        </button>
      </div>
    </div>
  );
}
