import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import "../styles/Navbar.css";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);

  // Notifications projets UNIQUEMENT pour particuliers
  useEffect(() => {
    if (!user || user.role !== "user") return;

    API.get("/projects/mine")
      .then((res) => {
        const apps = res.data.flatMap((p) => p.applications || []);
        setPendingCount(apps.filter((a) => a.status === "en_attente").length);
        setAcceptedCount(apps.filter((a) => a.status === "acceptée").length);
      })
      .catch(() => {});
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Déconnecté !");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        🏠 SmartBuild
      </Link>

      <div className="navbar-links">

        {/* ════════════════════════════════════════════════
            1. NON CONNECTÉ
            ✅ "Connexion" → /mes-projets (redirige vers login
               puis vers mes-projets si particulier)
        ════════════════════════════════════════════════ */}
        {!user && (
          <>
            <Link to="/catalogue" className="navbar-link">
              📚 Catalogue
            </Link>
            {/* ✅ Connexion → mes-projets (MyProjects redirige vers /login si non connecté) */}
            <Link to="/mes-projets" className="navbar-btn-register">
              Se connecter
            </Link>
          </>
        )}

        {/* ════════════════════════════════════════════════
            2. PARTICULIER (user)
        ════════════════════════════════════════════════ */}
        {user?.role === "user" && (
          <>
            <Link to="/catalogue" className="navbar-link">
              📚 Catalogue
            </Link>
            <Link to="/devis-wizard" className="navbar-link">
              ✨ Estimer
            </Link>
            <Link to="/deposer-projet" className="navbar-link">
              📋 Déposer
            </Link>

            {/* ✅ Mes projets — avec badges notifications */}
            <Link to="/mes-projets" className="navbar-link navbar-projects-btn">
              📁 Mes projets
              {acceptedCount > 0 && (
                <span className="nb-badge nb-accepted">✅{acceptedCount}</span>
              )}
              {pendingCount > 0 && acceptedCount === 0 && (
                <span className="nb-badge nb-pending">{pendingCount}</span>
              )}
            </Link>

            <Link to="/profil" className="navbar-link">
              👤 Profil
            </Link>
          </>
        )}

        {/* ════════════════════════════════════════════════
            3. INGÉNIEUR
            ✅ Bouton "ingénieur" supprimé de la navbar
        ════════════════════════════════════════════════ */}
        {user?.role === "engineer" && (
          <>
            <Link to="/ingenieur/projets" className="navbar-link">
              📋 Mes projets
            </Link>
            <Link to="/ingenieur/dashboard" className="navbar-link">
              📊 Dashboard
            </Link>
            <Link to="/profil" className="navbar-link">
              👤 Profil
            </Link>
          </>
        )}

        {/* ════════════════════════════════════════════════
            4. VENDEUR TERRAIN
        ════════════════════════════════════════════════ */}
        {user?.role === "terrain_seller" && (
          <>
            <Link to="/terrains/ajouter" className="navbar-link">
              🏗️ Mes terrains
            </Link>
            <Link to="/vendeur/dashboard" className="navbar-link">
              📊 Dashboard
            </Link>
            <Link to="/profil" className="navbar-link">
              👤 Profil
            </Link>
          </>
        )}

        {/* ════════════════════════════════════════════════
            5. VENDEUR ÉQUIPEMENT
        ════════════════════════════════════════════════ */}
        {user?.role === "equipment_seller" && (
          <>
            <Link to="/equipments/dashboard" className="navbar-link">
              🛋️ Catalogue
            </Link>
            <Link to="/profil" className="navbar-link">
              👤 Profil
            </Link>
          </>
        )}

        {/* ════════════════════════════════════════════════
            6. ADMIN
        ════════════════════════════════════════════════ */}
        {user?.role === "admin" && (
          <>
            <Link to="/admin/dashboard" className="navbar-link">
              ⚙️ Admin
            </Link>
            <Link to="/profil" className="navbar-link">
              👤 Profil
            </Link>
          </>
        )}

        {/* ════════════════════════════════════════════════
            7. DÉCONNEXION — tous les connectés
        ════════════════════════════════════════════════ */}
        {user && (
          <AnimatedButton onClick={handleLogout} className="navbar-btn-logout" variant="destructive">
            🚪 Déconnexion
          </AnimatedButton>
        )}
      </div>
    </nav>
  );
}