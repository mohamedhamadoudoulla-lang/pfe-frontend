import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import API from "../services/api";
import { AnimatedButton, AnimatedCard, AnimatedStagger, AnimatedStaggerItem } from "@/components/animate";
import { Plus, Trash2, Package } from "lucide-react";
import "./EquipmentVendor.css";

const EQUIPMENT_TYPES = [
  { id: "ciment", name: "Ciment", icon: "🪨", category: "salon", price: 15 },
  { id: "brique", name: "Brique", icon: "🧱", category: "salon", price: 0.50 },
  { id: "fer", name: "Fer", icon: "⚙️", category: "salon", price: 8 },
  { id: "sable", name: "Sable", icon: "🏜️", category: "salon", price: 30 },
  { id: "tuile", name: "Tuile", icon: "🏠", category: "chambre", price: 2 },
  { id: "carrelage", name: "Carrelage", icon: "🟫", category: "salle_de_bain", price: 5 },
  { id: "platre", name: "Plâtre", icon: "⬜", category: "salon", price: 10 },
  { id: "peinture", name: "Peinture", icon: "🎨", category: "salon", price: 20 },
];

export default function EquipmentVendor() {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEquipment();
  }, []);

  const loadEquipment = async () => {
    try {
      const res = await API.get("/equipments");
      setEquipment(res.data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEquipment = async (equipType) => {
    try {
      const newEquipment = {
        name: equipType.name,
        category: equipType.category,
        qualityLevel: "standard",
        price: equipType.price,
        description: `${equipType.name} de qualité standard`,
        image: "",
        isActive: true,
      };

      const res = await API.post("/equipments", newEquipment);
      setEquipment([...equipment, res.data]);
      toast.success(`✅ ${equipType.name} ajouté avec succès!`);
    } catch (error) {
      toast.error("❌ Erreur lors de l'ajout");
      console.error(error);
    }
  };

  const handleDeleteEquipment = async (id) => {
    try {
      await API.delete(`/equipments/${id}`);
      setEquipment(equipment.filter(e => e._id !== id));
      toast.success("✅ Équipement supprimé!");
    } catch (error) {
      toast.error("❌ Erreur lors de la suppression");
    }
  };

  const handleAddCustom = async () => {
    const name = prompt("Nom du produit :");
    if (!name) return;
    const price = parseFloat(prompt("Prix (DT) :"));
    if (isNaN(price) || price < 0) { toast.error("Prix invalide"); return; }
    const category = prompt("Catégorie (salon, chambre, cuisine, salle_de_bain) :", "salon") || "salon";
    try {
      const res = await API.post("/equipments", {
        name, price, category, qualityLevel: "standard",
        description: `${name} - Ajout personnalisé`,
        image: "", isActive: true,
      });
      setEquipment([...equipment, res.data]);
      toast.success(`✅ ${name} ajouté!`);
    } catch (error) {
      toast.error("❌ Erreur");
    }
  };

  if (loading) return <div className="equip-loading"><div className="equip-spinner" /><p>Chargement...</p></div>;

  return (
    <div className="equip-page">
      <style>{`
        .equip-page { font-family: 'Inter', sans-serif; background: #f8fafc; min-height: 100vh; color: #0f172a; }
        .equip-header { background: white; border-bottom: 1px solid #e2e8f0; padding: 36px 48px 28px; }
        .equip-header h1 { font-size: 26px; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 4px; }
        .equip-header p { font-size: 14px; color: #64748b; }
        .equip-container { max-width: 1280px; margin: 0 auto; padding: 32px 48px 64px; display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
        .equip-section { background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 28px; }
        .equip-section h2 { font-size: 18px; font-weight: 700; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
        .equip-empty { text-align: center; padding: 48px 20px; color: #94a3b8; font-size: 14px; }
        .equip-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
        .equip-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; transition: all 0.2s; }
        .equip-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
        .equip-card h3 { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
        .equip-card .price { font-size: 18px; font-weight: 800; color: #3b82f6; }
        .equip-card .meta { font-size: 12px; color: #94a3b8; margin: 6px 0 12px; }
        .equip-del { width: 100%; padding: 8px; background: #fef2f2; color: #ef4444; border: 1px solid #fecaca; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; }
        .equip-del:hover { background: #ef4444; color: white; border-color: #ef4444; }
        .equip-types { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; }
        .equip-type-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 14px; text-align: center; transition: all 0.2s; cursor: pointer; }
        .equip-type-card:hover { border-color: #3b82f6; box-shadow: 0 4px 16px rgba(59,130,246,0.12); transform: translateY(-2px); }
        .equip-type-icon { font-size: 28px; margin-bottom: 8px; display: block; }
        .equip-type-name { font-size: 13px; font-weight: 700; margin-bottom: 2px; }
        .equip-type-price { font-size: 15px; font-weight: 800; color: #3b82f6; margin-bottom: 12px; }
        .equip-add-btn { width: 100%; padding: 8px; background: #3b82f6; color: white; border: none; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; }
        .equip-add-btn:hover { background: #2563eb; }
        .equip-custom-btn { margin-top: 16px; width: 100%; padding: 12px; background: white; color: #3b82f6; border: 2px dashed #cbd5e1; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
        .equip-custom-btn:hover { border-color: #3b82f6; background: #eff6ff; }
        .equip-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; gap: 12px; color: #64748b; }
        .equip-spinner { width: 36px; height: 36px; border: 4px solid #e2e8f0; border-top-color: #3b82f6; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 1024px) { .equip-container { grid-template-columns: 1fr; } }
        @media (max-width: 768px) { .equip-header { padding: 24px 20px; } .equip-container { padding: 20px 16px 48px; } .equip-types { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <div className="equip-header">
        <h1><Package size={24} style={{ verticalAlign: "middle", marginRight: 8 }} />Gestion des équipements</h1>
        <p>Vendeur : {user?.name}</p>
      </div>

      <div className="equip-container">
        <section className="equip-section">
          <h2>📦 Mes équipements ({equipment.length})</h2>
          {equipment.length === 0 ? (
            <div className="equip-empty">Aucun équipement en vente. Ajoutez-en un !</div>
          ) : (
            <div className="equip-grid">
              {equipment.map((item) => (
                <div key={item._id} className="equip-card">
                  <h3>{item.name}</h3>
                  <div className="price">{Number(item.price).toLocaleString()} DT</div>
                  <div className="meta">{item.category} · {item.qualityLevel}</div>
                  <button className="equip-del" onClick={() => handleDeleteEquipment(item._id)}>
                    <Trash2 size={14} /> Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="equip-section">
          <h2>➕ Ajouter un équipement</h2>
          <div className="equip-types">
            {EQUIPMENT_TYPES.map((type) => (
              <div key={type.id} className="equip-type-card" onClick={() => handleAddEquipment(type)}>
                <span className="equip-type-icon">{type.icon}</span>
                <div className="equip-type-name">{type.name}</div>
                <div className="equip-type-price">{type.price} DT</div>
                <button className="equip-add-btn"><Plus size={14} /> Ajouter</button>
              </div>
            ))}
          </div>
          <button className="equip-custom-btn" onClick={handleAddCustom}>
            <Plus size={18} /> Ajouter un produit personnalisé
          </button>
        </section>
      </div>
    </div>
  );
}
