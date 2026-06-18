import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";

export default function PanierPage() {
  const [panier, setPanier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const navigate = useNavigate();

  const fetchPanier = () => {
    API.get("/panier/moi")
      .then((res) => setPanier(res.data))
      .catch(() => setPanier({ items: [], total: 0 }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPanier(); }, []);

  const updateQuantite = async (itemId, delta) => {
    const item = panier.items.find((i) => i._id === itemId);
    if (!item) return;
    const newQte = item.quantite + delta;
    try {
      if (newQte <= 0) {
        const res = await API.delete(`/panier/${itemId}`);
        setPanier(res.data.panier);
      } else {
        const res = await API.put(`/panier/${itemId}`, { quantite: newQte });
        setPanier(res.data.panier);
      }
    } catch {
      toast.error("Erreur");
    }
  };

  const supprimer = async (itemId) => {
    try {
      const res = await API.delete(`/panier/${itemId}`);
      setPanier(res.data.panier);
      toast.success("Article supprime");
    } catch {
      toast.error("Erreur");
    }
  };

  const vider = async () => {
    if (!confirm("Vider le panier ?")) return;
    try {
      await API.delete("/panier");
      setPanier({ items: [], total: 0 });
      toast.success("Panier vide");
    } catch {
      toast.error("Erreur");
    }
  };

  const validerCommande = async () => {
    setValidating(true);
    try {
      await API.post("/panier/valider");
      toast.success("Commande validee ! Paiement en especes au presentiel.");
      fetchPanier();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur");
    }
    setValidating(false);
  };

  if (loading) return <div style={{ textAlign: "center", padding: 60, color: "#64748b" }}>Chargement du panier...</div>;

  const items = panier?.items || [];
  const total = panier?.total || 0;

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #3b82f6, #1d4ed8)", padding: "28px 24px", color: "white" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <ArrowLeft size={16} /> Retour
          </button>
          <h1 style={{ fontSize: 22, fontWeight: 800, display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingCart size={24} /> Mon Panier
          </h1>
          <p style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>{items.length} article(s) - Paiement en especes au presentiel</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px 80px" }}>
        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: 14, border: "2px dashed #e5e7eb" }}>
            <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: 12 }} />
            <p style={{ color: "#9ca3af", fontSize: 16 }}>Votre panier est vide</p>
            <button onClick={() => navigate("/equipments/marketplace")} style={{ marginTop: 16, padding: "10px 20px", background: "#3b82f6", color: "white", border: "none", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>
              Explorer la marketplace
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
              <button onClick={vider} style={{ background: "none", border: "1px solid #e5e7eb", color: "#dc2626", padding: "6px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                <Trash2 size={14} /> Vider le panier
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map((item) => (
                <div key={item._id} style={{ display: "flex", background: "white", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden", gap: 16 }}>
                  <img src={item.imageProduit} alt={item.nomProduit} style={{ width: 140, height: 120, objectFit: "cover" }} onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200&q=60"; }} />
                  <div style={{ flex: 1, padding: "12px 16px 12px 0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: "#1f2937" }}>{item.nomProduit}</h3>
                          <span style={{ fontSize: 11, color: "#3b82f6", background: "#eff6ff", padding: "2px 8px", borderRadius: 6, marginTop: 4, display: "inline-block" }}>
                            {item.typeRef}
                          </span>
                          {item.vendeurNom && <span style={{ fontSize: 11, color: "#6b7280", marginLeft: 8 }}>Vendeur: {item.vendeurNom}</span>}
                        </div>
                        <button onClick={() => supprimer(item._id)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", padding: 4 }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid #e5e7eb", borderRadius: 8, padding: "2px 4px" }}>
                        <button onClick={() => updateQuantite(item._id, -1)} style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", padding: 4 }}><Minus size={14} /></button>
                        <span style={{ fontSize: 14, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.quantite}</span>
                        <button onClick={() => updateQuantite(item._id, 1)} style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", padding: 4 }}><Plus size={14} /></button>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 11, color: "#9ca3af" }}>{item.prixUnitaire?.toLocaleString()} DT x {item.quantite}</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#1f2937" }}>{(item.prixUnitaire * item.quantite).toLocaleString()} DT</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 20, background: "white", borderRadius: 12, border: "1px solid #e5e7eb", padding: "20px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#6b7280", fontSize: 14 }}>Sous-total ({items.length} article(s))</span>
                <span style={{ fontSize: 14 }}>{total.toLocaleString()} DT</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ color: "#6b7280", fontSize: 14 }}>Livraison</span>
                <span style={{ fontSize: 14, color: "#10b981", fontWeight: 600 }}>A definir au presentiel</span>
              </div>
              <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: "#3b82f6" }}>{total.toLocaleString()} DT</span>
              </div>
              <div style={{ background: "#fef3c7", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
                <p style={{ fontSize: 12, color: "#92400e", margin: 0 }}>Paiement en especes uniquement. Vous reglerez sur place lors de la livraison/presentation.</p>
              </div>
              <button onClick={validerCommande} disabled={validating} style={{ width: "100%", padding: "14px", background: "#3b82f6", color: "white", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                {validating ? "Validation..." : "Confirmer la commande"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
