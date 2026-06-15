import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { estimateTerrain } from "../services/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { AnimatedButton, AnimatedCard, ScrollReveal } from "@/components/animate";
import { ArrowRight, ArrowLeft, MapPin, Ruler, DollarSign, Check, Home } from "lucide-react";
import RainbowLines from "../components/RainbowLines";
import "./TerrainEstimation.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function TerrainEstimation() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!state?.region || !state?.surface) {
      navigate("/terrain/localisation");
      return;
    }
    if (state?.terrain) {
      setResult({
        region: state.terrain.region,
        surface: state.terrain.surface,
        avgPricePerM2: state.terrain.pricePerM2,
        estimatedTotal: state.terrain.totalPrice,
        terrains: [state.terrain],
        source: "terrain_selected",
      });
      setLoading(false);
      return;
    }
    estimateTerrain({ region: state.region, surface: state.surface })
      .then((res) => setResult(res.data))
      .catch((err) => setError(err.response?.data?.message || "Erreur estimation"))
      .finally(() => setLoading(false));
  }, []);

  const handleNext = () => {
    navigate("/devis-wz2", {
      state: {
        terrain: result,
        terrainInput: state,
        answers: { 1: "non" },
      },
    });
  };

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "16px" }}>
      <div style={{ width: "48px", height: "48px", border: "4px solid #e2e8f0", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
      <p style={{ color: "#64748b" }}>Calcul de l'estimation en cours...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px", maxWidth: "1100px", margin: "0 auto", fontFamily: "'Inter', sans-serif", position: "relative", zIndex: 1 }}>
      <RainbowLines variant="estimation" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .te-back { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: white; color: #3b82f6; border: 2px solid #3b82f6; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 24px; transition: all 0.2s; }
        .te-back:hover { background: #3b82f6; color: white; }
        .te-progress { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; }
        .te-step { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; background: #f1f5f9; color: #64748b; }
        .te-step.done { background: #d1fae5; color: #10b981; }
        .te-step.active { background: #3b82f6; color: white; }
        .te-line { flex: 1; height: 3px; background: #e2e8f0; border-radius: 2px; }
        .te-line.active { background: #3b82f6; }
        .te-layout { display: grid; grid-template-columns: 1fr 380px; gap: 32px; align-items: start; }
        .te-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px; margin-bottom: 24px; }
        .te-card-header { margin-bottom: 28px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; }
        .te-card-header h2 { font-size: 22px; font-weight: 800; color: #1e293b; margin-bottom: 6px; }
        .te-card-header p { font-size: 14px; color: #64748b; }
        .te-results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .te-result { background: #f8fafc; padding: 20px; border-radius: 14px; display: flex; align-items: center; gap: 14px; }
        .te-result-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #eff6ff; color: #3b82f6; }
        .te-result-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
        .te-result-value { font-size: 20px; font-weight: 800; color: #1e293b; }
        .te-result.total { background: linear-gradient(135deg, #3b82f6, #2563eb); grid-column: 1 / -1; }
        .te-result.total .te-result-icon { background: rgba(255,255,255,0.2); color: white; }
        .te-result.total .te-result-label { color: rgba(255,255,255,0.8); }
        .te-result.total .te-result-value { color: white; font-size: 28px; }
        .te-terrains h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 12px; }
        .te-no-data { font-size: 14px; color: #94a3b8; padding: 16px; background: #f8fafc; border-radius: 10px; }
        .te-terrain-item { display: flex; justify-content: space-between; padding: 10px 14px; background: #f8fafc; border-radius: 8px; margin-bottom: 8px; }
        .te-terrain-name { font-size: 13px; color: #1e293b; font-weight: 500; }
        .te-terrain-price { font-size: 13px; font-weight: 700; color: #3b82f6; }
        .te-actions { display: flex; gap: 12px; flex-wrap: wrap; }
        .te-btn-next { display: flex; align-items: center; gap: 8px; padding: 14px 28px; background: #3b82f6; color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; flex: 1; justify-content: center; }
        .te-btn-next:hover { background: #2563eb; transform: translateY(-2px); }
        .te-btn-prev { display: flex; align-items: center; gap: 8px; padding: 14px 20px; background: white; color: #3b82f6; border: 2px solid #3b82f6; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
        .te-btn-prev:hover { background: #eff6ff; }
        .te-map-card { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px; margin-top: 16px; }
        .te-map-header { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; color: #1e293b; font-weight: 700; font-size: 16px; }
        .te-img-card { background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 24px; position: sticky; top: 90px; }
        .te-img-card img { width: 100%; border-radius: 14px; }
        .te-img-label { font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 12px; text-align: center; }
        .te-error { text-align: center; padding: 40px; color: #ef4444; }
        .te-error p { margin-bottom: 16px; }
        @media (max-width: 900px) { .te-layout { grid-template-columns: 1fr; } .te-results { grid-template-columns: repeat(2, 1fr); } .te-img-card { position: static; } }
        @media (max-width: 600px) { .te-results { grid-template-columns: 1fr; } }
      `}</style>

      <button className="te-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Retour
      </button>

      <div className="te-progress">
        <div className="te-step done"><Check size={14} /> 1</div>
        <div className="te-line active"></div>
        <div className="te-step active">2</div>
        <div className="te-line"></div>
        <div className="te-step">3</div>
        <div className="te-line"></div>
        <div className="te-step">4</div>
      </div>

      <div className="te-layout">
        <div>
          <ScrollReveal direction="up">
            <AnimatedCard className="te-card" whileHover={{ scale: 1.01 }}>
              <div className="te-card-header">
                <h2>Estimation du terrain</h2>
                <p>Region : {state?.region} - {state?.surface} m2</p>
              </div>

              {error ? (
                <div className="te-error">
                  <p>{error}</p>
                  <AnimatedButton variant="primary" onClick={() => navigate("/terrain/localisation")}>
                    Reessayer
                  </AnimatedButton>
                </div>
              ) : result && (
                <>
                  <div className="te-results">
                    <div className="te-result">
                      <div className="te-result-icon"><Ruler size={22} /></div>
                      <div>
                        <div className="te-result-label">Surface</div>
                        <div className="te-result-value">{result.surface} m2</div>
                      </div>
                    </div>
                    <div className="te-result">
                      <div className="te-result-icon"><DollarSign size={22} /></div>
                      <div>
                        <div className="te-result-label">Prix moyen / m2</div>
                        <div className="te-result-value">{result.avgPricePerM2?.toLocaleString()} DT</div>
                      </div>
                    </div>
                    <div className="te-result total">
                      <div className="te-result-icon"><Home size={22} /></div>
                      <div>
                        <div className="te-result-label">Cout total estime</div>
                        <div className="te-result-value">{result.estimatedTotal?.toLocaleString()} DT</div>
                      </div>
                    </div>
                  </div>

                  <div className="te-terrains">
                    <h3>Terrains disponibles dans la region</h3>
                    {result.terrains?.length === 0 ? (
                      <p className="te-no-data">Aucun terrain liste pour cette region</p>
                    ) : (
                      result.terrains?.map((t) => (
                        <div key={t._id} className="te-terrain-item">
                          <span className="te-terrain-name">{t.title}</span>
                          <span className="te-terrain-price">{t.pricePerM2?.toLocaleString()} DT/m2</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="te-actions" style={{ marginTop: "24px" }}>
                    <AnimatedButton className="te-btn-next" variant="primary" onClick={handleNext}>
                      Suivant : Configurer ma maison <ArrowRight size={18} />
                    </AnimatedButton>
                    <AnimatedButton className="te-btn-prev" onClick={() => navigate("/terrain/localisation")}>
                      <ArrowLeft size={16} /> Precedent
                    </AnimatedButton>
                  </div>
                </>
              )}
            </AnimatedCard>
          </ScrollReveal>

          {state?.lat && state?.lng && (
            <ScrollReveal direction="up">
              <AnimatedCard className="te-map-card" whileHover={{ scale: 1.01 }}>
                <div className="te-map-header">
                  <MapPin size={18} /> Localisation sur la carte
                </div>
                <MapContainer center={[state.lat, state.lng]} zoom={14} style={{ height: "250px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[state.lat, state.lng]}>
                    <Popup>{state.region}</Popup>
                  </Marker>
                </MapContainer>
              </AnimatedCard>
            </ScrollReveal>
          )}
        </div>

        <div className="te-img-col">
          <div className="te-img-card">
            <img src="/images/Investment data-amico.svg" alt="Estimation" />
            <div className="te-img-label">Estimez le cout de votre terrain</div>
          </div>
        </div>
      </div>
    </div>
  );
}