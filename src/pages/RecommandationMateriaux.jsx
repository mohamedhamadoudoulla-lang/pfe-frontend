import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";
import RainbowLines from "../components/RainbowLines";
import "./RecommandationMateriaux.css";

const SAVE_KEY = "rm_validation_";

export default function RecommandationMateriaux() {
  const { estimationId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!estimationId || estimationId === "_fallback") {
      const surface = state?._fallbackSurface;
      const scenario = state?._fallbackScenario;
      if (!surface || !scenario) {
        navigate("/devis-wizard");
        return;
      }
      API.post("/estimations/init-marketplace", {
        caracteristiques: { surface: Number(surface), nbChambres: 0, nbSallesDeBain: 1, nbCuisines: 1, nbSalons: 1, scenario },
      })
        .then(({ data: est }) => {
          navigate(`/recommandation-materiaux/${est._id}`, { replace: true, state });
        })
        .catch((err) => {
          const msg = err.response?.data?.message || err.message;
          alert("Erreur création devis: " + msg);
          navigate("/devis-wizard");
        });
      return;
    }
    API.get(`/materiaux-construction/${estimationId}`)
      .then((res) => setData(res.data))
      .catch(() => alert("Erreur de calcul des matériaux"))
      .finally(() => setLoading(false));
  }, [estimationId, navigate, state]);

  const handleContinuer = async () => {
    setSaving(true);
    try {
      await API.post(`/materiaux-construction/${estimationId}/valider`, {
        lignes: data.lignes,
        totalMateriaux: data.totalMateriaux,
      });
    } catch {
      /* non bloquant */
    }
    sessionStorage.setItem(SAVE_KEY + estimationId, JSON.stringify(data));
    navigate("/devis", {
      state: {
        ...state,
        materiauxConstruction: data.lignes,
        totalMateriaux: data.totalMateriaux,
      },
    });
  };

  if (loading) return <div className="rm-loading">Calcul des matériaux nécessaires...</div>;
  if (!data) return <div className="rm-loading">Aucune donnée</div>;

  return (
    <div className="rm-page">
      <RainbowLines variant="recommandation" />

      <div className="rm-hero">
        <h1>Matériaux de construction recommandés</h1>
        <p>
          Basés sur votre surface de {data.surface} m² et votre scénario{" "}
          <strong>{data.scenario}</strong>
        </p>
      </div>

      <div className="rm-container">
        <div className="rm-table-wrapper">
          <table className="rm-table">
            <thead>
              <tr>
                <th>Matériau</th>
                <th>Quantité nécessaire</th>
                <th>Prix unitaire</th>
                <th>Sous-total</th>
              </tr>
            </thead>
            <tbody>
              {data.lignes.map((m) => (
                <tr key={m.type}>
                  <td className="rm-nom">{m.nom || m.type}</td>
                  <td className="rm-qte">
                    {m.quantite} {m.unite}
                  </td>
                  <td className="rm-prix">
                    {m.disponible
                      ? `${m.prixUnitaire.toLocaleString()} DT`
                      : "N/D"}
                  </td>
                  <td className="rm-stotal">
                    {m.disponible
                      ? `${m.sousTotal.toLocaleString()} DT`
                      : "N/D"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.avertissement && (
          <div className="rm-avertissement">{data.avertissement}</div>
        )}

        <div className="rm-total-bar">
          <span>Total matériaux de construction</span>
          <strong>{data.totalMateriaux.toLocaleString()} DT</strong>
        </div>

        <button
          className="rm-continuer"
          onClick={handleContinuer}
          disabled={saving}
        >
          {saving ? "Enregistrement..." : "Continuer vers le devis final"}
        </button>
      </div>
    </div>
  );
}
