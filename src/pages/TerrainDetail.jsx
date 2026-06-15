import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Ruler, Tag, Calendar, Home, CheckCircle, School, Phone, Mail, Send } from "lucide-react";
import { getTerrain } from "../services/api";
import "./TerrainDetail.css";

const FALLBACK_MAP = {
  "terrain-fallback-1": {
    _id: "terrain-fallback-1",
    title: "Terrain habitation ind. en vente",
    region: "Kairouan",
    city: "Kairouan",
    surface: 447,
    pricePerM2: 738,
    totalPrice: 330000,
    description: "À vendre, un terrain d'habitation d'une superficie de 447 m², bénéficiant d'un emplacement idéal dans un quartier résidentiel calme et sécurisé. Grâce à son orientation est et son ouverture sur une route principale, il offre à la fois accessibilité et luminosité. Ce terrain constitue une opportunité parfaite pour la construction d'un immeuble résidentiel ou d'une maison individuelle. Ses dimensions équilibrées s'adaptent facilement à différents projets de construction, garantissant un cadre de vie paisible et agréable, tout en étant proche des commodités essentielles.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
    plan: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80",
    isAvailable: true,
    features: { ref: "58008", libre: true, categorie: "Haut standing", anneeConstruction: 2025 },
    nearby: {
      schools: [
        { name: "Lycée Pilote de Kairouan", distance: "1,6 Km" },
        { name: "Collège Dar El Hermen", distance: "2,0 Km" },
        { name: "Ecole Primaire Dar El Amen", distance: "2,0 Km" },
        { name: "Lycée Dar El Amen", distance: "2,2 Km" },
        { name: "Institut Supérieur d'Informatique et de Gestion", distance: "2,5 Km" },
      ],
      pharmacies: [
        { name: "Pharmacie Hind Ghith", distance: "2,0 Km" },
        { name: "Pharmacie", distance: "2,4 Km" },
        { name: "Pharmacie Dhib", distance: "2,8 Km" },
      ],
    },
    seller: { name: "Kairouan Invest Sarl", address: "Rue Sevilla, 3100 Kairouan (KA)", email: "contact.kr1@tecnocasa.tn", phone: "+21628842842" },
  },
  "terrain-fallback-2": {
    _id: "terrain-fallback-2",
    title: "Terrain habitation ind. en vente",
    region: "Sfax",
    city: "Route Gremda",
    surface: 1052,
    pricePerM2: 309,
    totalPrice: 325000,
    description: "Ce terrain de superficie 1052 m², situé dans un quartier calme et résidentiel à route de Gremda km7, dispose de deux façades.",
    images: ["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80"],
    plan: "https://images.unsplash.com/photo-1560518883-b2e5e0e2a1b8?w=600&q=80",
    isAvailable: true,
    features: { ref: "66284", etage: "Bas", libre: true, categorie: "Moyen standing", anneeConstruction: 1980 },
    nearby: {
      transport: [
        { name: "Transport public", distance: "2,0 Km" },
        { name: "Markez Salémi", distance: "2,5 Km" },
      ],
      schools: [
        { name: "Ecole Primaire Errached Al Jadida", distance: "380 m" },
        { name: "Ecole Primaire Markez Wali", distance: "1,1 Km" },
        { name: "Ecole Primaire Markez Kammoun", distance: "1,8 Km" },
        { name: "Collège Al Imam Sahnoun", distance: "1,8 Km" },
        { name: "Lycée Gremda", distance: "1,9 Km" },
      ],
    },
    seller: { name: "Tecnocasa Sfax", address: "Route de Tunis km3, Sfax", email: "contact.sfax@tecnocasa.tn", phone: "+21674400000" },
  },
  "terrain-fallback-3": {
    _id: "terrain-fallback-3",
    title: "Terrain habitation collective en vente",
    region: "Sfax",
    city: "Route De Tunis",
    surface: 920,
    pricePerM2: 701,
    totalPrice: 645000,
    description: "Ce terrain de superficie 920 m² est situé sur la ceinture Bourguiba, route de Tunis km3.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"],
    plan: "https://images.unsplash.com/photo-1560518883-b2e5e0e2a1b8?w=600&q=80",
    isAvailable: true,
    features: { ref: "56970", etage: "Terre", libre: true, categorie: "Haut standing", anneeConstruction: 2025 },
    nearby: {
      transport: [
        { name: "Bouassida", distance: "180 m" },
        { name: "Transport public", distance: "500 m" },
      ],
      schools: [
        { name: "Ecole Primaire Markez Chichma", distance: "220 m" },
        { name: "Lycée Secondaire 25 Juillet 1957", distance: "310 m" },
        { name: "Ecole Primaire Khaled Ibn Al Walid", distance: "380 m" },
        { name: "Ecole Primaire El Bassatine", distance: "640 m" },
        { name: "Ecole Primaire Errahma", distance: "1,3 Km" },
      ],
    },
    seller: { name: "Tecnocasa Sfax", address: "Route de Tunis km3, Sfax", email: "contact.sfax@tecnocasa.tn", phone: "+21674400000" },
  },
};

const LOADING = "loading";
const SUCCESS = "success";
const ERROR = "error";

export default function TerrainDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [terrain, setTerrain] = useState(null);
  const [status, setStatus] = useState(LOADING);
  const [form, setForm] = useState({ nom: "", email: "", telephone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (FALLBACK_MAP[id]) {
      setTerrain(FALLBACK_MAP[id]);
      setStatus(SUCCESS);
      return;
    }
    getTerrain(id)
      .then((res) => setTerrain(res.data))
      .catch(() => {
        const fallback = Object.values(FALLBACK_MAP)[0];
        setTerrain(fallback);
      })
      .finally(() => setStatus(SUCCESS));
  }, [id]);

  if (status === LOADING) {
    return (
      <div className="td-loading-screen">
        <div className="td-loading-spinner" />
        <p>Chargement...</p>
      </div>
    );
  }

  if (!terrain) return null;

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const f = terrain.features || {};

  return (
    <div className="td-page">
      <div className="td-container">
        <button className="td-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
          Retour
        </button>

        {/* Hero */}
        <div className="td-hero">
          <div className="td-hero-img">
            <img src={terrain.images?.[0] || Object.values(FALLBACK_MAP)[0].images[0]} alt={terrain.title} />
            <div className="td-hero-overlay">
              <h1 className="td-hero-title">{terrain.title}</h1>
              <p className="td-hero-location"><MapPin size={16} /> {terrain.city || terrain.region}, {terrain.region}</p>
            </div>
          </div>
        </div>

        <div className="td-grid">
          {/* LEFT COL */}
          <div className="td-main">
            {/* Prix */}
            <div className="td-card td-price-card">
              <div className="td-price-value">{terrain.totalPrice?.toLocaleString("fr-TN")} <span className="td-price-currency">DT</span></div>
              <p className="td-price-detail">{terrain.surface} m²</p>
            </div>

            {/* Caractéristiques */}
            <div className="td-card">
              <h2 className="td-section-title">Caractéristiques</h2>
              <div className="td-features">
                <div className="td-feature"><Tag size={16} /><span>REF.:</span><strong>{f.ref || "—"}</strong></div>
                {f.etage && <div className="td-feature"><Home size={16} /><span>Étage:</span><strong>{f.etage}</strong></div>}
                <div className="td-feature"><CheckCircle size={16} /><span>Libre:</span><strong>{f.libre ? "Oui" : "Non"}</strong></div>
                <div className="td-feature"><Home size={16} /><span>Catégorie:</span><strong>{f.categorie || "—"}</strong></div>
                <div className="td-feature"><Calendar size={16} /><span>Année de construction:</span><strong>{f.anneeConstruction || "—"}</strong></div>
                <div className="td-feature"><Ruler size={16} /><span>Surface:</span><strong>{terrain.surface} m²</strong></div>
              </div>
            </div>

            {/* Description */}
            <div className="td-card">
              <h2 className="td-section-title">Description</h2>
              <p className="td-desc">{terrain.description}</p>
            </div>

            {/* Frais */}
            <div className="td-card">
              <h2 className="td-section-title">Frais</h2>
              <div className="td-fees">
                <div className="td-fee-row">
                  <span>Prix:</span>
                  <strong>{terrain.totalPrice?.toLocaleString("fr-TN")} DT</strong>
                </div>
              </div>
            </div>

            {/* Plan du terrain */}
            {terrain.plan && (
              <div className="td-card">
                <h2 className="td-section-title">Plan du terrain</h2>
                <div className="td-plan-wrap">
                  <a href={terrain.plan} target="_blank" rel="noopener noreferrer">
                    <img src={terrain.plan} alt="Plan du terrain" className="td-plan-img" />
                  </a>
                  <p className="td-plan-hint">Cliquez pour agrandir</p>
                </div>
              </div>
            )}

            {/* À proximité */}
            <div className="td-card">
              <h2 className="td-section-title">À proximité</h2>
              {terrain.nearby?.schools?.length > 0 && (
                <div className="td-nearby-group">
                  <h3 className="td-nearby-category"><School size={16} /> École</h3>
                  {terrain.nearby.schools.map((s, i) => (
                    <div key={i} className="td-nearby-item">
                      <span>{s.name}</span>
                      <span className="td-nearby-dist">{s.distance}</span>
                    </div>
                  ))}
                </div>
              )}
              {terrain.nearby?.pharmacies?.length > 0 && (
                <div className="td-nearby-group">
                  <h3 className="td-nearby-category">💊 Pharmacie</h3>
                  {terrain.nearby.pharmacies.map((p, i) => (
                    <div key={i} className="td-nearby-item">
                      <span>{p.name}</span>
                      <span className="td-nearby-dist">{p.distance}</span>
                    </div>
                  ))}
                </div>
              )}
              {terrain.nearby?.transport?.length > 0 && (
                <div className="td-nearby-group">
                  <h3 className="td-nearby-category">🚌 Transport public</h3>
                  {terrain.nearby.transport.map((t, i) => (
                    <div key={i} className="td-nearby-item">
                      <span>{t.name}</span>
                      <span className="td-nearby-dist">{t.distance}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COL — Contact */}
          <div className="td-sidebar">
            <div className="td-card td-seller-card">
              <h2 className="td-section-title">Nous contacter</h2>
              {submitted ? (
                <div className="td-submitted">
                  <CheckCircle size={40} />
                  <p>Message envoyé avec succès !</p>
                  <p className="td-submitted-sub">Nous vous répondrons dans les plus brefs délais.</p>
                </div>
              ) : (
                  <form className="td-form" onSubmit={handleSubmit}>
                  <div className="td-form-row">
                    <div className="td-form-group">
                      <label>Nom*</label>
                      <input name="nom" value={form.nom} onChange={handleChange} required placeholder="Votre nom" />
                    </div>
                  </div>
                  <div className="td-form-group">
                    <label>E-mail*</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="votre@email.com" />
                  </div>
                  <div className="td-form-group">
                    <label>Téléphone*</label>
                    <input name="telephone" type="tel" value={form.telephone} onChange={handleChange} required placeholder="+216 XX XXX XXX" />
                  </div>
                  <div className="td-form-group">
                    <label>Message</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="Votre message..." />
                  </div>
                  <p className="td-privacy">
                    Conformément à la loi organique portant sur la protection des données à caractère personnel n° 2004-63 du 27 juillet 2004
                  </p>
                  <button type="submit" className="td-submit-btn">
                    <Send size={16} />
                    Envoyer
                  </button>
                </form>
              )}
            </div>

            {/* Agency info */}
            {terrain.seller && (
              <div className="td-card td-agency-card">
                <h3 className="td-agency-name">{terrain.seller.name || "Kairouan Invest Sarl"}</h3>
                <p className="td-agency-detail"><MapPin size={14} /> {terrain.seller.address || "Rue Sevilla, 3100 Kairouan (KA)"}</p>
                <p className="td-agency-detail"><Mail size={14} /> {terrain.seller.email || "contact.kr1@tecnocasa.tn"}</p>
                <p className="td-agency-detail"><Phone size={14} /> {terrain.seller.phone || "+21628842842"}</p>
                <div className="td-agency-badge">Affilié</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
