import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import API from "../services/api";
import { AnimatedButton, AnimatedCard, AnimatedStagger, AnimatedStaggerItem } from "@/components/animate";
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

  if (loading) return <div className="loading">Chargement...</div>;

  return (
    <div className="equipment-vendor-page">
      <div className="vendor-header">
        <h1>🛠️ Gestion des équipements</h1>
        <p>Vendeur: {user?.name}</p>
      </div>

      <div className="vendor-container">
        <section className="vendor-section">
          <h2>📦 Mes équipements en vente</h2>
          {equipment.length === 0 ? (
            <div className="empty-state">
              <p>Aucun équipement en vente. Ajoutez-en un!</p>
            </div>
          ) : (
            <AnimatedStagger className="equipment-grid" staggerDelay={0.1}>
              {equipment.map((item) => (
                <AnimatedStaggerItem key={item._id}>
                  <AnimatedCard className="equipment-card" whileHover={{ scale: 1.02 }}>
                    <h3>{item.name}</h3>
                    <p className="price">{item.price} DT</p>
                    <p className="category">Catégorie: {item.category}</p>
                    <p className="quality">Qualité: {item.qualityLevel}</p>
                    <AnimatedButton 
                      className="delete-btn"
                      variant="destructive"
                      onClick={() => handleDeleteEquipment(item._id)}
                    >
                      ✕ Supprimer
                    </AnimatedButton>
                  </AnimatedCard>
                </AnimatedStaggerItem>
              ))}
            </AnimatedStagger>
          )}
        </section>

        <section className="vendor-section">
          <h2>➕ Ajouter des équipements</h2>
          <AnimatedStagger className="equipment-types" staggerDelay={0.1}>
            {EQUIPMENT_TYPES.map((type) => (
              <AnimatedStaggerItem key={type.id}>
                <AnimatedCard className="type-card" whileHover={{ scale: 1.02 }}>
                  <span className="type-icon">{type.icon}</span>
                  <h4>{type.name}</h4>
                  <p>{type.price} DT</p>
                  <AnimatedButton 
                    className="add-btn"
                    variant="primary"
                    onClick={() => handleAddEquipment(type)}
                  >
                    + Ajouter au catalogue
                  </AnimatedButton>
                </AnimatedCard>
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        </section>
      </div>
    </div>
  );
}
