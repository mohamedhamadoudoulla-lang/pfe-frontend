import { useEffect, useState } from "react";
import API from "../services/api";
import PropertyCard from "./PropertyCard";
import RainbowLines from "../components/RainbowLines";
import { Search, SlidersHorizontal, X } from "lucide-react";
import "./PropertyCatalog.css";

export default function PropertyCatalog() {
  const [properties, setProperties] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "", prixRange: "", surfaceRange: "", ville: "", statut: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = { page, limit: 9 };
        if (filters.type) params.type = filters.type;
        if (filters.ville) params.ville = filters.ville;
        if (filters.statut) params.statut = filters.statut;

        if (filters.prixRange === "0-100000") { params.prixMax = 100000; }
        else if (filters.prixRange === "100000-300000") { params.prixMin = 100000; params.prixMax = 300000; }
        else if (filters.prixRange === "300000-500000") { params.prixMin = 300000; params.prixMax = 500000; }
        else if (filters.prixRange === "500000+") { params.prixMin = 500000; }

        if (filters.surfaceRange === "0-100") { params.surfaceMax = 100; }
        else if (filters.surfaceRange === "100-200") { params.surfaceMin = 100; params.surfaceMax = 200; }
        else if (filters.surfaceRange === "200+") { params.surfaceMin = 200; }

        const res = await API.get("/properties", { params });
        setProperties(res.data.properties);
        setTotalPages(res.data.totalPages);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Erreur chargement biens:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ type: "", prixRange: "", surfaceRange: "", ville: "", statut: "" });
    setPage(1);
  };

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="pc-page">
      <RainbowLines variant="catalogue" />

      <div className="pc-hero">
        <h1>Catalogue Immobilier</h1>
        <p>Decouvrez nos biens disponibles a travers toute la Tunisie</p>
      </div>

      <div className="pc-container">
        <div className="pc-toolbar">
          <div className="pc-search-wrap">
            <Search size={16} className="pc-search-icon" />
            <input
              className="pc-search"
              placeholder="Rechercher par ville..."
              value={filters.ville}
              onChange={(e) => handleFilterChange("ville", e.target.value)}
            />
          </div>
          <button className="pc-filter-toggle" onClick={() => setShowFilters(!showFilters)}>
            <SlidersHorizontal size={16} /> Filtres
            {hasFilters && <span className="pc-filter-dot" />}
          </button>
          {hasFilters && (
            <button className="pc-clear-btn" onClick={clearFilters}>
              <X size={14} /> Effacer
            </button>
          )}
        </div>

        {showFilters && (
          <div className="pc-filters">
            <select value={filters.type} onChange={(e) => handleFilterChange("type", e.target.value)}>
              <option value="">Type de bien</option>
              <option value="maison">Maison</option>
              <option value="appartement">Appartement</option>
              <option value="terrain">Terrain</option>
            </select>
            <select value={filters.prixRange} onChange={(e) => handleFilterChange("prixRange", e.target.value)}>
              <option value="">Prix</option>
              <option value="0-100000">0 - 100 000 DT</option>
              <option value="100000-300000">100 000 - 300 000 DT</option>
              <option value="300000-500000">300 000 - 500 000 DT</option>
              <option value="500000+">500 000+ DT</option>
            </select>
            <select value={filters.surfaceRange} onChange={(e) => handleFilterChange("surfaceRange", e.target.value)}>
              <option value="">Surface</option>
              <option value="0-100">&lt; 100m²</option>
              <option value="100-200">100 - 200m²</option>
              <option value="200+">200m²+</option>
            </select>
            <select value={filters.statut} onChange={(e) => handleFilterChange("statut", e.target.value)}>
              <option value="">Statut</option>
              <option value="disponible">Disponible</option>
              <option value="nouveau">Nouveau</option>
              <option value="vendu">Vendu</option>
            </select>
          </div>
        )}

        <div className="pc-result-count">
          {loading ? "Chargement..." : `${total} bien(s) trouvé(s)`}
        </div>

        {loading ? (
          <div className="pc-loading">
            <div className="pc-spinner" />
            <p>Chargement des biens...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="pc-empty">
            <Search size={40} style={{ opacity: 0.3 }} />
            <p>Aucun bien ne correspond à ces critères.</p>
            <button className="pc-clear-btn" onClick={clearFilters}>Effacer les filtres</button>
          </div>
        ) : (
          <div className="pc-grid">
            {properties.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pc-pagination">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              &laquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={num === page ? "active" : ""}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
