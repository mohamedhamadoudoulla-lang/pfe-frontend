import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import { AnimatedButton, AnimatedCard, AnimatedStagger, AnimatedStaggerItem } from "@/components/animate";
import RainbowLines from "../components/RainbowLines";
import toast from "react-hot-toast";
import "./RecommandationsMarketplace.css";

export default function RecommandationsMarketplace() {
  const { devisId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showOptions, setShowOptions] = useState({});
  const [panier, setPanier] = useState([]);

  useEffect(() => {
    if (!devisId) return;
    setLoading(true);
    API.get(`/marketplace/${devisId}`)
      .then((res) => setData(res.data))
      .catch(() => toast.error("Erreur chargement marketplace"))
      .finally(() => setLoading(false));
  }, [devisId]);

  const ajouterAuPanier = async (produit, quantite) => {
    try {
      const res = await API.post(`/marketplace/panier/${devisId}`, {
        produitId: produit._id,
        quantite: Math.ceil(quantite),
      });
      setPanier(res.data.panierMarketplace || []);
      toast.success(`✅ ${produit.nom} ajouté au devis`);
    } catch {
      toast.error("Erreur ajout au panier");
    }
  };

  const ajouterTout = async () => {
    if (!data) return;
    const items = [...data.materiaux, ...data.ameublement].filter((r) => r.produitRecommande);
    for (const item of items) {
      try {
        await API.post(`/marketplace/panier/${devisId}`, {
          produitId: item.produitRecommande._id,
          quantite: Math.ceil(item.quantiteRequise),
        });
      } catch {
        // continue
      }
    }
    toast.success("✅ Tous les produits recommandés ont été ajoutés au devis");
    // Recharger
    const res = await API.get(`/marketplace/${devisId}`);
    setData(res.data);
  };

  if (loading) return <div className="loading">Chargement du marketplace...</div>;
  if (!data) return <div className="loading">Aucune donnée marketplace</div>;

  return (
    <div className="marketplace-page">
      <RainbowLines variant="marketplace" />

      <div className="mp-header">
        <h1>🏪 Marketplace — Recommandations</h1>
        <p>Matériaux et ameublement recommandés pour votre projet</p>
      </div>

      {/* ── Matériaux ── */}
      <section className="mp-section">
        <h2>🧱 Matériaux de construction</h2>
        {data.materiaux.length === 0 ? (
          <p className="mp-empty">Aucun matériau trouvé pour ce scénario</p>
        ) : (
          <AnimatedStagger className="mp-grid" staggerDelay={0.08}>
            {data.materiaux.map((item, i) => (
              <AnimatedStaggerItem key={item.besoin}>
                <AnimatedCard className="mp-card">
                  <div className="mp-card-header">
                    <h3>{item.besoin}</h3>
                    <span className="mp-qte">
                      {Math.ceil(item.quantiteRequise)} {item.unite}
                    </span>
                  </div>

                  {item.produitRecommande ? (
                    <>
                      <div className="mp-produit">
                        <strong>{item.produitRecommande.nom}</strong>
                        <span className="mp-prix">
                          {item.prixTotal.toLocaleString()} DT
                        </span>
                        <span className="mp-prix-unit">
                          ({item.produitRecommande.prixUnitaire} DT/{item.unite})
                        </span>
                      </div>

                      <button
                        className="mp-toggle-options"
                        onClick={() =>
                          setShowOptions({ ...showOptions, [item.besoin]: !showOptions[item.besoin] })
                        }
                      >
                        {showOptions[item.besoin] ? "▲ Masquer" : "▼ Voir d'autres options"}
                      </button>

                      {showOptions[item.besoin] && item.autresOptions.length > 0 && (
                        <div className="mp-autres">
                          {item.autresOptions.map((opt) => (
                            <div key={opt._id} className="mp-option-row">
                              <span>{opt.nom}</span>
                              <span>{opt.prixUnitaire} DT/{item.unite}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <AnimatedButton
                        className="mp-btn-add"
                        variant="primary"
                        onClick={() => ajouterAuPanier(item.produitRecommande, item.quantiteRequise)}
                      >
                        + Ajouter au devis
                      </AnimatedButton>
                    </>
                  ) : (
                    <p className="mp-indispo">⚠️ Aucun produit disponible</p>
                  )}
                </AnimatedCard>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        )}
      </section>

      {/* ── Ameublement ── */}
      <section className="mp-section">
        <h2>🛋️ Ameublement recommandé</h2>
        {data.ameublement.length === 0 ? (
          <p className="mp-empty">Aucun meuble trouvé pour ce scénario</p>
        ) : (
          <AnimatedStagger className="mp-grid" staggerDelay={0.08}>
            {data.ameublement.map((item, i) => (
              <AnimatedStaggerItem key={item.besoin}>
                <AnimatedCard className="mp-card">
                  <div className="mp-card-header">
                    <h3>{item.besoin.replace(/_/g, " ")}</h3>
                    <span className="mp-qte">
                      {Math.ceil(item.quantiteRequise)} unité(s)
                    </span>
                  </div>

                  {item.produitRecommande ? (
                    <>
                      <div className="mp-produit">
                        <strong>{item.produitRecommande.nom}</strong>
                        <span className="mp-prix">
                          {item.prixTotal.toLocaleString()} DT
                        </span>
                        <span className="mp-prix-unit">
                          ({item.produitRecommande.prixUnitaire} DT/unité)
                        </span>
                      </div>

                      <button
                        className="mp-toggle-options"
                        onClick={() =>
                          setShowOptions({ ...showOptions, [item.besoin]: !showOptions[item.besoin] })
                        }
                      >
                        {showOptions[item.besoin] ? "▲ Masquer" : "▼ Voir d'autres options"}
                      </button>

                      {showOptions[item.besoin] && item.autresOptions.length > 0 && (
                        <div className="mp-autres">
                          {item.autresOptions.map((opt) => (
                            <div key={opt._id} className="mp-option-row">
                              <span>{opt.nom}</span>
                              <span>{opt.prixUnitaire} DT/unité</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <AnimatedButton
                        className="mp-btn-add"
                        variant="primary"
                        onClick={() => ajouterAuPanier(item.produitRecommande, item.quantiteRequise)}
                      >
                        + Ajouter au devis
                      </AnimatedButton>
                    </>
                  ) : (
                    <p className="mp-indispo">⚠️ Aucun produit disponible</p>
                  )}
                </AnimatedCard>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        )}
      </section>

      {/* ── Récapitulatif ── */}
      <div className="mp-recap">
        <div className="mp-recap-row">
          <span>Total matériaux</span>
          <strong>{data.totalMateriaux.toLocaleString()} DT</strong>
        </div>
        <div className="mp-recap-row">
          <span>Total ameublement</span>
          <strong>{data.totalAmeublement.toLocaleString()} DT</strong>
        </div>
        <div className="mp-recap-row mp-recap-total">
          <span>Total général</span>
          <strong>{data.totalGeneral.toLocaleString()} DT</strong>
        </div>
        <AnimatedButton className="mp-btn-all" variant="primary" onClick={ajouterTout}>
          📥 Ajouter tout au devis
        </AnimatedButton>
      </div>
    </div>
  );
}
