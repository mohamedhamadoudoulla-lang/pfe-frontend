import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { AnimatedButton, AnimatedCard, AnimatedStagger, AnimatedStaggerItem } from "@/components/animate";
import "./AdminPanel.css";

export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEngineers: 0,
    totalEstimations: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (user?.role !== "admin") {
      toast.error("Accès refusé - Admin uniquement");
      navigate("/");
      return;
    }
  }, [user, navigate]);

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Tableau de bord administrateur</h1>
        <p>Bienvenue, {user?.name}</p>
      </div>

<AnimatedStagger className="admin-stats" staggerDelay={0.1}>
          <AnimatedStaggerItem>
            <AnimatedCard className="stat-card" whileHover={{ scale: 1.02 }}>
              <span className="stat-icon">👥</span>
              <h3>Utilisateurs</h3>
              <p className="stat-value">{stats.totalUsers}</p>
            </AnimatedCard>
          </AnimatedStaggerItem>
          <AnimatedStaggerItem>
            <AnimatedCard className="stat-card" whileHover={{ scale: 1.02 }}>
              <span className="stat-icon">👷</span>
              <h3>Ingénieurs</h3>
              <p className="stat-value">{stats.totalEngineers}</p>
            </AnimatedCard>
          </AnimatedStaggerItem>
          <AnimatedStaggerItem>
            <AnimatedCard className="stat-card" whileHover={{ scale: 1.02 }}>
              <span className="stat-icon">📋</span>
              <h3>Devis générés</h3>
              <p className="stat-value">{stats.totalEstimations}</p>
            </AnimatedCard>
          </AnimatedStaggerItem>
          <AnimatedStaggerItem>
            <AnimatedCard className="stat-card" whileHover={{ scale: 1.02 }}>
              <span className="stat-icon">💰</span>
              <h3>Chiffre d'affaires</h3>
              <p className="stat-value">{stats.totalRevenue} DT</p>
            </AnimatedCard>
          </AnimatedStaggerItem>
        </AnimatedStagger>

      <div className="admin-sections">
        <section className="admin-section">
          <h2>Gestion</h2>
          <div className="admin-menu">
            <AnimatedButton className="admin-btn">👥 Gérer les utilisateurs</AnimatedButton>
            <AnimatedButton className="admin-btn">👷 Gérer les ingénieurs</AnimatedButton>
            <AnimatedButton className="admin-btn">🏠 Gérer les maisons</AnimatedButton>
            <AnimatedButton className="admin-btn">🏘️ Gérer les terrains</AnimatedButton>
            <AnimatedButton className="admin-btn">⚙️ Gérer les équipements</AnimatedButton>
            <AnimatedButton className="admin-btn">📊 Voir les devis</AnimatedButton>
          </div>
        </section>

        <section className="admin-section">
          <h2>Paramètres</h2>
          <div className="admin-menu">
            <AnimatedButton className="admin-btn">🔐 Sécurité</AnimatedButton>
            <AnimatedButton className="admin-btn">⚙️ Configuration</AnimatedButton>
            <AnimatedButton className="admin-btn">📧 Notifications</AnimatedButton>
            <AnimatedButton className="admin-btn">📊 Rapports</AnimatedButton>
          </div>
        </section>
      </div>
    </div>
  );
}
