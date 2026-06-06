import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  MapPin, Globe, Shield, Building2,
  Home, TrendingUp, Users, Zap,
} from "lucide-react";
import "./Login.css";

const AVATAR_OPTIONS = [
  { id: 1, name: "Architecte",     initials: "AR", color: "#3b82f6" },
  { id: 2, name: "Constructeur",   initials: "CO", color: "#06b6d4" },
  { id: 3, name: "Ingénieur",      initials: "IN", color: "#8b5cf6" },
  { id: 4, name: "Entrepreneur",   initials: "EN", color: "#ec4899" },
  { id: 5, name: "Maître d'ouvrage", initials: "MO", color: "#f59e0b" },
  { id: 6, name: "Estimateur",     initials: "ES", color: "#10b981" },
];

const REDIRECT = {
  admin:            "/admin/dashboard",
  engineer:         "/ingenieur/dashboard",
  terrain_seller:   "/terrains/ajouter",
  equipment_seller: "/equipments/dashboard",
  user:             "/terrain/localisation",
};

const getRedirectPath = (role) => REDIRECT[role] || "/terrain/localisation";

export default function BuilderLogin() {
  const [isLogin, setIsLogin] = useState(true);
  const [formLogin, setFormLogin] = useState({ email: "", password: "" });
  const [formRegister, setFormRegister] = useState({
    name: "", email: "", phone: "",
    password: "", confirmPassword: "",
    address: "", country: "",
    role: "user",
    avatar: AVATAR_OPTIONS[0],
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email) => {
    if (!email) return "";
    return emailRegex.test(email) ? "" : "Format email invalide";
  };

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setFormLogin(prev => ({ ...prev, [name]: value }));
    if (name === "email") setErrors(prev => ({ ...prev, loginEmail: validateEmail(value) }));
  };

  const handleChangeRegister = (e) => {
    const { name, value } = e.target;
    setFormRegister(prev => ({ ...prev, [name]: value }));
    if (name === "email") setErrors(prev => ({ ...prev, regEmail: validateEmail(value) }));
  };

  const handleAvatarSelect = (avatar) => setFormRegister({ ...formRegister, avatar });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateEmail(formLogin.email);
    if (err) { toast.error(err); return; }
    if (formLogin.password.length < 6) { toast.error("Mot de passe trop court"); return; }
    setLoading(true);
    try {
      const res = await login(formLogin);
      const role = res.data.user.role;
      loginUser(res.data.user, res.data.token);
      toast.success("Connexion réussie !");
      navigate(getRedirectPath(role));
    } catch (err) {
      toast.error(err.response?.data?.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    const err = validateEmail(formRegister.email);
    if (err) { toast.error(err); return; }
    if (formRegister.password !== formRegister.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas !");
      return;
    }
    if (formRegister.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères !");
      return;
    }
    setLoading(true);
    try {
      const { confirmPassword, avatar, ...dataToSend } = formRegister;
      const res = await register(dataToSend);
      const role = res.data.user.role;
      loginUser(res.data.user, res.data.token);
      toast.success("Inscription réussie !");
      navigate(getRedirectPath(role));
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="builder-login-container">
      <div className="builder-login-wrapper">

        <div className="builder-form-section">
          {isLogin ? (

            <div className="builder-card">
              <div className="builder-header">
                <div className="builder-logo-badge">
                  <Building2 size={32} />
                </div>
                <h2>Bienvenue</h2>
                <p>Connectez-vous à votre espace SmartBuild</p>
              </div>

              <form onSubmit={handleSubmit} className="builder-form">
                <div className="form-group">
                  <label>Email professionnel</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      name="email"
                      type="email"
                      placeholder="vous@construction.com"
                      value={formLogin.email}
                      onChange={handleChangeLogin}
                      required
                    />
                  </div>
                  {errors.loginEmail && <span className="field-error">{errors.loginEmail}</span>}
                </div>

                <div className="form-group">
                  <label>Mot de passe</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formLogin.password}
                      onChange={handleChangeLogin}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Se souvenir de moi</span>
                  </label>
                </div>

                <button className="builder-btn builder-btn-primary" disabled={loading}>
                  {loading ? <><span className="spinner"></span>Connexion en cours...</> : <>Se connecter</>}
                </button>
              </form>

              <div className="divider"><span>ou</span></div>
              <div className="builder-footer">
                <p>Pas encore de compte ?</p>
                <button className="switch-form-btn" onClick={() => setIsLogin(false)}>
                  Créer un compte gratuitement
                </button>
              </div>
            </div>

          ) : (

            <div className="builder-card builder-register-card">
              <div className="builder-header">
                <div className="builder-logo-badge">
                  <Building2 size={32} />
                </div>
                <h2>Créer un compte</h2>
                <p>Rejoignez SmartBuild en quelques étapes</p>
              </div>

              <form onSubmit={handleSubmitRegister} className="builder-form">

                <div className="avatar-section">
                  <label className="avatar-label">Choisissez votre profil</label>
                  <div className="avatar-grid">
                    {AVATAR_OPTIONS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        className={`avatar-button ${formRegister.avatar.id === av.id ? "selected" : ""}`}
                        onClick={() => handleAvatarSelect(av)}
                        title={av.name}
                      >
                        <div
                          className="avatar-circle"
                          style={{ backgroundColor: av.color }}
                        >
                          {av.initials}
                        </div>
                        <span className="avatar-name">{av.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Nom complet</label>
                  <div className="input-wrapper">
                    <User size={18} className="input-icon" />
                    <input
                      name="name"
                      type="text"
                      placeholder="Ahmed Ben Ali"
                      value={formRegister.name}
                      onChange={handleChangeRegister}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Email professionnel</label>
                  <div className="input-wrapper">
                    <Mail size={18} className="input-icon" />
                    <input
                      name="email"
                      type="email"
                      placeholder="vous@construction.com"
                      value={formRegister.email}
                      onChange={handleChangeRegister}
                      required
                    />
                  </div>
                  {errors.regEmail && <span className="field-error">{errors.regEmail}</span>}
                </div>

                <div className="form-group">
                  <label>Téléphone</label>
                  <div className="input-wrapper">
                    <Phone size={18} className="input-icon" />
                    <input
                      name="phone"
                      type="tel"
                      placeholder="+216 XX XXX XXX"
                      value={formRegister.phone}
                      onChange={handleChangeRegister}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Pays</label>
                  <div className="input-wrapper select-wrapper">
                    <Globe size={18} className="input-icon" />
                    <select
                      name="country"
                      value={formRegister.country}
                      onChange={handleChangeRegister}
                      required
                    >
                      <option value="">Sélectionner un pays</option>
                      <option value="Tunisia">Tunisie</option>
                      <option value="Algeria">Algérie</option>
                      <option value="Morocco">Maroc</option>
                      <option value="France">France</option>
                      <option value="Belgium">Belgique</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Adresse</label>
                  <div className="input-wrapper">
                    <MapPin size={18} className="input-icon" />
                    <input
                      name="address"
                      type="text"
                      placeholder="Rue, Ville"
                      value={formRegister.address}
                      onChange={handleChangeRegister}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Mot de passe</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      name="password"
                      type="password"
                      placeholder="Minimum 6 caractères"
                      value={formRegister.password}
                      onChange={handleChangeRegister}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Confirmation mot de passe</label>
                  <div className="input-wrapper">
                    <Lock size={18} className="input-icon" />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirmez votre mot de passe"
                      value={formRegister.confirmPassword}
                      onChange={handleChangeRegister}
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Choisissez votre profil</label>
                  <div className="profile-cards">
                    {[
                      { value: "user",          icon: "🏠", label: "Particulier",         desc: "Je veux construire ma maison et estimer mon budget",         color: "#3b82f6" },
                      { value: "engineer",       icon: "👷", label: "Ingénieur",            desc: "Je propose mes services de génie civil et construction",       color: "#10b981" },
                      { value: "terrain_seller", icon: "🏗️", label: "Vendeur terrain",     desc: "Je publie des terrains à vendre pour les acheteurs",          color: "#f59e0b" },
                      { value: "equipment_seller", icon: "🛋️", label: "Vendeur équipement", desc: "Je vends des meubles et équipements pour la maison",         color: "#8b5cf6" },
                      { value: "admin",          icon: "⚙️", label: "Administrateur",       desc: "Je gère et supervise toute la plateforme SmartBuild",        color: "#ef4444" },
                    ].map((p) => (
                      <div
                        key={p.value}
                        className={`profile-card ${formRegister.role === p.value ? "selected" : ""}`}
                        onClick={() => setFormRegister({ ...formRegister, role: p.value })}
                        style={{ "--card-color": p.color }}
                      >
                        <div className="profile-card-icon">{p.icon}</div>
                        <div className="profile-card-text">
                          <span className="profile-card-label">{p.label}</span>
                          <span className="profile-card-desc">{p.desc}</span>
                        </div>
                        <div className="profile-card-check">
                          {formRegister.role === p.value ? "✓" : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {formRegister.role === "admin" && (
                  <div className="admin-alert">
                    <Shield size={16} />
                    <span>Compte administrateur — accès complet au tableau de bord</span>
                  </div>
                )}

                <button className="builder-btn builder-btn-primary" disabled={loading}>
                  {loading ? <><span className="spinner"></span>Création en cours...</> : <>Créer mon compte</>}
                </button>
              </form>

              <div className="builder-footer">
                <p>Déjà inscrit ?</p>
                <button className="switch-form-btn" onClick={() => setIsLogin(true)}>
                  Se connecter
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="builder-branding">
          <div className="builder-brand-content">
            <div className="builder-brand-logo">
              <div className="logo-icon">
                <Home size={56} />
              </div>
            </div>
            <h1>SmartBuild</h1>
            <p className="builder-brand-subtitle">Plateforme intelligente de devis immobilier</p>

            <div className="features-list">
              <div className="feature-item">
                <TrendingUp size={20} />
                <p>Devis en 5 minutes</p>
              </div>
              <div className="feature-item">
                <Users size={20} />
                <p>Connectez vos pros</p>
              </div>
              <div className="feature-item">
                <Zap size={20} />
                <p>Technologie IA</p>
              </div>
            </div>

            <div className="builder-brand-stats">
              <div className="builder-brand-stat">
                <div className="stat-value">5K+</div>
                <div className="stat-label">Projets/an</div>
              </div>
              <div className="builder-brand-stat">
                <div className="stat-value">4.9★</div>
                <div className="stat-label">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}