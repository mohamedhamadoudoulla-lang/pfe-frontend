import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MapPicker from "../components/MapPicker";
import { AnimatedButton, AnimatedCard, ScrollReveal } from "@/components/animate";
import { MapPin, ChevronRight, ArrowLeft, Home, Building } from "lucide-react";
import "./TerrainLocation.css";

const REGIONS = [
  "Tunis","Sfax","Sousse","Kairouan","Bizerte",
  "Gabès","Ariana","Gafsa","Monastir","Ben Arous",
  "Nabeul","Médenine","Kasserine","Béja","Jendouba",
];

export default function TerrainLocation() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const fromWizard = state?.fromWizard || false;
  const wizardAnswers = state?.answers || {};

  const [form, setForm] = useState({ region:"", surface:"", lat:null, lng:null, address:"" });
  const [mapUsed, setMapUsed] = useState(false);

  const handleMapSelect = (data) => {
    setMapUsed(true);
    setForm((prev) => ({
      ...prev,
      lat: data.lat,
      lng: data.lng,
      address: data.address || "",
      ...(data.region ? { region: data.region } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/terrain/estimation", {
      state: {
        region: form.region,
        surface: form.surface,
        lat: form.lat,
        lng: form.lng,
        address: form.address,
        fromWizard,
        wizardAnswers,
      },
    });
  };

  return (
    <div className="tl-page">
      <section className="tl-header-section">
        <div className="tl-header-container">
          <div className="tl-header-content">
            <ScrollReveal direction="up">
              <div className="tl-step-badge">Étape 1</div>
              <h1 className="tl-title"><MapPin size={32} className="tl-title-icon" /> Localisation du terrain</h1>
              <p className="tl-subtitle">Cliquez sur la carte ou sélectionnez une région manuellement</p>
            </ScrollReveal>
            <div className="tl-progress-bar">
              <div className="tl-progress-step active">1</div>
              <div className="tl-progress-line"></div>
              <div className="tl-progress-step">2</div>
              <div className="tl-progress-line"></div>
              <div className="tl-progress-step">3</div>
              <div className="tl-progress-line"></div>
              <div className="tl-progress-step">4</div>
            </div>
          </div>
          <ScrollReveal direction="left">
            <div className="tl-header-visual">
              <img src="/images/Location review-bro.svg" alt="Localisation" className="tl-header-image" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <div className="tl-content-wrapper">
        <ScrollReveal direction="up">
          <AnimatedCard className="tl-main-card" whileHover={{ scale: 1.01 }}>
            <div className="tl-card-header">
              <h2>🏗️ Choisissez votre terrain</h2>
              <p>Sélectionnez la région et la superficie souhaitées</p>
            </div>

            <ScrollReveal direction="up" delay={0.1}>
              <div className="tl-marketplace-banner" onClick={() => navigate("/terrains/marketplace", { state: { fromWizard, wizardAnswers, returnTo: "/terrain/localisation" } })}>
                <div className="tl-banner-content">
                  <Building size={24} className="tl-banner-icon" />
                  <div>
                    <h4>🏗️ Parcourir les terrains disponibles</h4>
                    <p>Consultez les annonces de terrains à vendre par région</p>
                  </div>
                </div>
                <AnimatedButton className="tl-banner-btn">
                  Voir les terrains <ChevronRight size={16} />
                </AnimatedButton>
              </div>
            </ScrollReveal>

            <MapPicker onLocationSelect={handleMapSelect} />

            <form onSubmit={handleSubmit} className="tl-form">
              <div className="tl-form-grid">
                <div className="tl-form-group">
                  <label><MapPin size={16} /> Région</label>
                  <select
                    value={form.region}
                    onChange={(e) => setForm({ ...form, region: e.target.value })}
                    required
                  >
                    <option value="">-- Sélectionnez une région --</option>
                    {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="tl-form-group">
                  <label><Home size={16} /> Superficie (m²)</label>
                  <input
                    type="number"
                    placeholder="Ex: 200"
                    min="50"
                    value={form.surface}
                    onChange={(e) => setForm({ ...form, surface: e.target.value })}
                    required
                  />
                </div>
              </div>

              {mapUsed && form.lat && (
                <div className="tl-location-info">
                  <MapPin size={16} />
                  <span>Position sélectionnée : <strong>{form.lat.toFixed(5)}, {form.lng.toFixed(5)}</strong></span>
                  {form.address && <span className="tl-address">{form.address}</span>}
                </div>
              )}

              <div className="tl-form-actions">
                <AnimatedButton type="submit" className="tl-btn-next" variant="primary">
                  {fromWizard ? "Continuer le devis" : "Suivant"}
                  <ChevronRight size={18} />
                </AnimatedButton>
                {fromWizard && (
                  <AnimatedButton type="button" className="tl-btn-wizard" onClick={() => navigate("/devis-wizard")}>
                    <ArrowLeft size={16} />
                    Retour au wizard
                  </AnimatedButton>
                )}
              </div>
            </form>
          </AnimatedCard>
        </ScrollReveal>
      </div>
    </div>
  );
}