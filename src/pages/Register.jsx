import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, User, Mail, Phone, MapPin, Globe, Lock } from "lucide-react";
import "./Login.css";

const ROLES = [
  { value: "user",             icon: "🏠", label: "Particulier" },
  { value: "engineer",         icon: "👷", label: "Ingénieur" },
  { value: "terrain_seller",   icon: "🏗️", label: "Vendeur terrain" },
  { value: "equipment_seller", icon: "🛋️", label: "Vendeur équipement" },
];

const languages = [
  "afrikaans","বাংলা","Catalogne","Čeština","Dansk","Allemand",
  "Ελληνικά","Anglais","Espagnol","Finlande","Français","Hindi",
  "magyar","Bahasa Indonesia","Íslenska","Italien","日本語","한국어",
  "Lietuvių","Latviešu","Néerlandais","Norsk","Polski","Portugais",
  "Română","Русский","Slovène",
];

export default function Register() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", phone: "", country: "", address: "",
    password: "", confirmPassword: "", role: "user",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfPwd, setShowConfPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error("Les mots de passe ne correspondent pas"); return; }
    if (form.password.length < 6) { toast.error("Mot de passe trop court (6 min)"); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = form;
      const res = await register(data);
      if (res.data.needsVerification) {
        toast.success(res.data.message || "Veuillez vérifier votre email.");
        navigate("/login");
      } else {
        const REDIRECTS = { admin: "/admin/dashboard", engineer: "/ingenieur/dashboard", terrain_seller: "/terrains/ajouter", equipment_seller: "/equipments/dashboard", user: "/devis-wizard" };
        loginUser(res.data.user, res.data.token);
        toast.success("Compte créé !");
        navigate(REDIRECTS[res.data.user.role] || "/devis-wizard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur inscription");
    } finally { setLoading(false); }
  };

  return (
    <div className="ca-wrapper">
      <div className="ribbon-wrap">
        <svg
          viewBox="0 0 1000 640"
          xmlns="http://www.w3.org/2000/svg"
          className="ca-ribbon-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c8f400" />
              <stop offset="40%" stopColor="#ff6a00" />
              <stop offset="100%" stopColor="#ff2d8b" />
            </linearGradient>
          </defs>
          <path
            d="M -40 540 C 90 540, 170 380, 260 440 C 350 500, 320 600, 240 580 C 160 560, 190 460, 290 450 C 420 438, 540 420, 660 320 C 760 235, 880 210, 1040 240"
            fill="none"
            stroke="url(#ribbonGrad)"
            strokeWidth="30"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="ca-content">
        <div className="ca-left">
          <h1 className="ca-title">Créer un compte</h1>
          <p className="ca-subtitle">Rejoignez SmartBuild en quelques étapes</p>
        </div>

        <div className="ca-right">
          <form onSubmit={handleSubmit}>
            <div className="reg-row">
              <div className="inp-wrap">
                <span className="ca-input-icon"><User size={17} /></span>
                <input className="ca-input" placeholder="Ahmed Ben Ali" value={form.name} onChange={(e) => update("name", e.target.value)} required />
              </div>
              <div className="inp-wrap">
                <span className="ca-input-icon"><Mail size={17} /></span>
                <input className="ca-input" type="email" placeholder="vous@smartbuild.tn" value={form.email} onChange={(e) => update("email", e.target.value)} required />
              </div>
            </div>

            <div className="reg-row">
              <div className="inp-wrap">
                <span className="ca-input-icon"><Phone size={17} /></span>
                <input className="ca-input" type="tel" placeholder="+216 XX XXX XXX" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
              </div>
              <div className="inp-wrap">
                <span className="ca-input-icon"><Globe size={17} /></span>
                <select className="ca-input ca-select" value={form.country} onChange={(e) => update("country", e.target.value)} required>
                  <option value="">Sélectionner un pays</option>
                  <option value="Tunisia">Tunisie</option>
                  <option value="Algeria">Algérie</option>
                  <option value="Morocco">Maroc</option>
                  <option value="France">France</option>
                  <option value="Belgium">Belgique</option>
                </select>
              </div>
            </div>

            <div className="reg-row">
              <div className="inp-wrap">
                <span className="ca-input-icon"><MapPin size={17} /></span>
                <input className="ca-input" placeholder="Rue, Ville" value={form.address} onChange={(e) => update("address", e.target.value)} required />
              </div>
              <div className="inp-wrap" />
            </div>

            <div className="reg-row">
              <div className="inp-wrap">
                <span className="ca-input-icon"><Lock size={17} /></span>
                <input className="ca-input" type={showPwd ? "text" : "password"} placeholder="Mot de passe" value={form.password} onChange={(e) => update("password", e.target.value)} required />
                <button type="button" className="ca-eye" onClick={() => setShowPwd(!showPwd)}>{showPwd ? <Eye size={17} /> : <EyeOff size={17} />}</button>
              </div>
              <div className="inp-wrap">
                <span className="ca-input-icon"><Lock size={17} /></span>
                <input className="ca-input" type={showConfPwd ? "text" : "password"} placeholder="Confirmez" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} required />
                <button type="button" className="ca-eye" onClick={() => setShowConfPwd(!showConfPwd)}>{showConfPwd ? <Eye size={17} /> : <EyeOff size={17} />}</button>
              </div>
            </div>

            <div className="ca-roles-row">
              {ROLES.map((r) => (
                <div
                  key={r.value}
                  className={`ca-role-card-h ${form.role === r.value ? "selected" : ""}`}
                  onClick={() => update("role", r.value)}
                >
                  <span className="ca-role-icon-h">{r.icon}</span>
                  <span className="ca-role-label-h">{r.label}</span>
                </div>
              ))}
            </div>

            <button className="ca-btn ca-btn-full" type="submit" disabled={loading}>
              {loading ? "Création en cours..." : "Créer mon compte"}
            </button>
          </form>

          <div className="ca-switch">
            <span>Déjà inscrit ?</span>
            <button className="ca-link-btn" onClick={() => navigate("/login")}>Se connecter</button>
          </div>
        </div>
      </div>

      <div className="ca-languages">
        {languages.map((lang) => (
          <span key={lang} className="ca-lang-item">{lang}</span>
        ))}
      </div>
    </div>
  );
}
