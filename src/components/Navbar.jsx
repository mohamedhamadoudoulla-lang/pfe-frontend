import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  Ruler,
  Users,
  User,
  LogOut,
  FileText,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  Map,
  Package,
  ShieldCheck,
  Building2,
  Home,
  ShoppingCart,
} from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";
import "./Navbar.css";

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [pendingCount, setPending] = useState(0);
  const [acceptedCount, setAccepted] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user?.role !== "user") return;
    API.get("/projects/mine")
      .then((res) => {
        const apps = res.data.flatMap((p) => p.applications || []);
        setPending(apps.filter((a) => a.status === "en_attente").length);
        setAccepted(apps.filter((a) => a.status === "acceptee").length);
      })
      .catch(() => {});
    API.get("/panier/moi")
      .then((res) => setCartCount(res.data?.items?.length || 0))
      .catch(() => setCartCount(0));
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
        <div className="navbar-logo-icon">
          <Building2 size={22} />
        </div>
        <span className="navbar-logo-text">
          <span className="smart">Smart</span>
          <span className="build">Build</span>
        </span>
      </Link>

      <div className="navbar-links">
        <Link to="/" className="navbar-link">
          <Home size={16} className="nav-icon" />
          <span className="nav-label">Accueil</span>
        </Link>
        {!user && (
          <>
            <Link to="/catalogue" className="navbar-link">
              <LayoutGrid size={16} className="nav-icon" />
              <span className="nav-label">Catalogue</span>
            </Link>
            <Link to="/services" className="navbar-link">
              <Building2 size={16} className="nav-icon" />
              <span className="nav-label">Services</span>
            </Link>
            <Link to="/ingenieurs" className="navbar-link">
              <Users size={16} className="nav-icon" />
              <span className="nav-label">Ingénieurs</span>
            </Link>
            <Link to="/login" className="navbar-link">
              <span className="nav-label">Se connecter</span>
            </Link>

          </>
        )}

        {user?.role === "user" && (
          <>
            <Link to="/catalogue" className="navbar-link">
              <LayoutGrid size={16} className="nav-icon" />
              <span className="nav-label">Catalogue</span>
            </Link>
            <Link to="/services" className="navbar-link">
              <Building2 size={16} className="nav-icon" />
              <span className="nav-label">Services</span>
            </Link>
            <Link to="/devis-wizard" className="navbar-link">
              <Ruler size={16} className="nav-icon" />
              <span className="nav-label">Estimer</span>
            </Link>
            <Link to="/terrains/marketplace" className="navbar-link">
              <Map size={16} className="nav-icon" />
              <span className="nav-label">Terrains</span>
            </Link>
            <Link to="/equipments/marketplace" className="navbar-link">
              <Package size={16} className="nav-icon" />
              <span className="nav-label">Boutique</span>
            </Link>
            <Link to="/panier" className="navbar-link" style={{ position: "relative" }}>
              <ShoppingCart size={16} className="nav-icon" />
              <span className="nav-label">Panier</span>
              {cartCount > 0 && (
                <span className="nb-badge nb-pending" style={{ position: "absolute", top: -4, right: -8, minWidth: 18, height: 18, fontSize: 10, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/mes-projets" className="navbar-link">
              <ClipboardList size={16} className="nav-icon" />
              <span className="nav-label">Projets</span>
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
              <ClipboardList size={16} className="nav-icon" />
              <span className="nav-label">Projets</span>
            </Link>
            <Link to="/ingenieur/dashboard" className="navbar-link">
              <LayoutDashboard size={16} className="nav-icon" />
              <span className="nav-label">Dashboard</span>
            </Link>
          </>
        )}

        {user?.role === "terrain_seller" && (
          <>
            <Link to="/terrains/ajouter" className="navbar-link">
              <Map size={16} className="nav-icon" />
              <span className="nav-label">Mes terrains</span>
            </Link>
            <Link to="/vendeur/dashboard" className="navbar-link">
              <LayoutDashboard size={16} className="nav-icon" />
              <span className="nav-label">Dashboard</span>
            </Link>
          </>
        )}

        {user?.role === "equipment_seller" && (
          <>
            <Link to="/vendeur/dashboard" className="navbar-link">
              <LayoutDashboard size={16} className="nav-icon" />
              <span className="nav-label">Dashboard</span>
            </Link>
            <Link to="/vendeur/produits" className="navbar-link">
              <Package size={16} className="nav-icon" />
              <span className="nav-label">Mes Produits</span>
            </Link>
            <Link to="/equipments/dashboard" className="navbar-link">
              <Package size={16} className="nav-icon" />
              <span className="nav-label">Catalogue</span>
            </Link>
          </>
        )}

        {user?.role === "admin" && (
          <Link to="/admin/dashboard" className="navbar-link">
            <ShieldCheck size={16} className="nav-icon" />
            <span className="nav-label">Admin</span>
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
                size={14}
              />
            </button>

            {showDropdown && (
              <div className="navbar-dropdown">
                <Link
                  to="/profil"
                  className="navbar-dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  <User size={16} />
                  Mon profil
                </Link>

                {user.role === "user" && (
                  <Link
                    to="/mes-projets"
                    className="navbar-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <FileText size={16} />
                    Mes projets
                  </Link>
                )}

                <div className="navbar-dropdown-divider" />

                <button className="navbar-dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
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
