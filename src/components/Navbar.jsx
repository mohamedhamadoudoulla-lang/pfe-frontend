import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { Home, User, LogOut, FileText, Settings, ChevronDown } from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";
import "./Navbar.css";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPending] = useState(0);
  const [acceptedCount, setAccepted] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (user?.role !== "user") return;
    API.get("/projects/mine")
      .then((res) => {
        const apps = res.data.flatMap((p) => p.applications || []);
        setPending(apps.filter((a) => a.status === "en_attente").length);
        setAccepted(apps.filter((a) => a.status === "acceptee").length);
      })
      .catch(() => {});
  }, [user]);

  const handleLogout = () => {
    logoutUser();
    toast.success("Deconnexion reussie");
    navigate("/");
    setShowDropdown(false);
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".navbar-profile-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="navbar-logo-text">
          <span className="smart">Smart</span>
          <span className="build">Build</span>
        </span>
      </Link>

      <div className="navbar-links">
        {!user && (
          <>
            <Link to="/catalogue" className="navbar-link">
              Catalogue
            </Link>
            <Link to="/login" className="navbar-link">
              Se connecter
            </Link>
            <Link to="/register" className="navbar-btn-register">
              S'inscrire
            </Link>
          </>
        )}

        {user?.role === "user" && (
          <>
            <Link to="/catalogue" className="navbar-link">
              Catalogue
            </Link>
            <Link to="/devis-wizard" className="navbar-link">
              Estimer
            </Link>
            <Link to="/mes-projets" className="navbar-link">
              Mes projets
              {acceptedCount > 0 && (
                <span className="nb-badge nb-accepted">{acceptedCount}</span>
              )}
              {pendingCount > 0 && acceptedCount === 0 && (
                <span className="nb-badge nb-pending">{pendingCount}</span>
              )}
            </Link>
          </>
        )}

        {user?.role === "engineer" && (
          <>
            <Link to="/ingenieur/projets" className="navbar-link">
              Projets
            </Link>
            <Link to="/ingenieur/dashboard" className="navbar-link">
              Dashboard
            </Link>
          </>
        )}

        {user?.role === "terrain_seller" && (
          <>
            <Link to="/terrains/ajouter" className="navbar-link">
              Mes terrains
            </Link>
            <Link to="/vendeur/dashboard" className="navbar-link">
              Dashboard
            </Link>
          </>
        )}

        {user?.role === "equipment_seller" && (
          <>
            <Link to="/equipments/dashboard" className="navbar-link">
              Catalogue
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <Link to="/admin/dashboard" className="navbar-link">
            Admin
          </Link>
        )}

        {user && (
          <div className="navbar-profile-container">
            <button
              className="navbar-profile-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="navbar-avatar">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} />
                ) : (
                  <span>{getInitials(user.name)}</span>
                )}
              </div>
              <span className="navbar-username">{user.name}</span>
              <ChevronDown
                className={`navbar-arrow ${showDropdown ? "rotate" : ""}`}
                size={16}
              />
            </button>

            {showDropdown && (
              <div className="navbar-dropdown">
                <Link
                  to="/profil"
                  className="navbar-dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  <User size={18} />
                  Mon profil
                </Link>

                {user.role === "user" && (
                  <Link
                    to="/mes-projets"
                    className="navbar-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FileText size={18} />
                    Mes projets
                  </Link>
                )}

                <div className="navbar-dropdown-divider"></div>

                <button className="navbar-dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={18} />
                  Deconnexion
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}