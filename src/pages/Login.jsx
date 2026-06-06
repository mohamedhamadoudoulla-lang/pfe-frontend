import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register, loginWithGoogle, loginWithFacebook } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLoginModule from "react-facebook-login/dist/facebook-login-render-props";
const FacebookLogin = FacebookLoginModule.default || FacebookLoginModule;
import {
  Eye, EyeOff, Mail, Lock, User, Phone,
  MapPin, Globe, Home, TrendingUp, Users, Zap,
} from "lucide-react";
import { AnimatedButton, AnimatedCard } from "@/components/animate";
import "./Login.css";

const REDIRECT = {
  admin:            "/admin/dashboard",
  engineer:         "/ingenieur/dashboard",
  terrain_seller:   "/terrains/ajouter",
  equipment_seller: "/equipments/dashboard",
  user:             "/devis-wizard",
};
const getRedirectPath = (role) => REDIRECT[role] || "/devis-wizard";

const ROLES = [
  { value: "user",             icon: "🏠", label: "Particulier",       desc: "Estimer et construire ma maison",             color: "#2196e8" },
  { value: "engineer",         icon: "👷", label: "Ingénieur",          desc: "Proposer mes services de construction",       color: "#10b981" },
  { value: "terrain_seller",   icon: "🏗️", label: "Vendeur terrain",   desc: "Publier des terrains à vendre",              color: "#f59e0b" },
  { value: "equipment_seller", icon: "🛋️", label: "Vendeur équipement", desc: "Vendre des meubles et équipements",         color: "#8b5cf6" },
];



export default function Login() {
  const [isLogin, setIsLogin]         = useState(true);
  const [showForgot, setShowForgot]   = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [formLogin, setFormLogin]     = useState({ email: "", password: "" });
  const [formReg, setFormReg]         = useState({
    name: "", email: "", phone: "", password: "",
    confirmPassword: "", address: "", country: "", role: "user",
  });

  const [showPwd, setShowPwd]         = useState(false);
  const [showConfPwd, setShowConfPwd] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [errors, setErrors]           = useState({});

  const { loginUser } = useAuth();
  const navigate      = useNavigate();

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const res = await loginWithGoogle({ accessToken: tokenResponse.access_token, role: formReg.role });
      const role = res.data.user.role;
      loginUser(res.data.user, res.data.token);
      toast.success("Connexion Google réussie !");
      navigate(getRedirectPath(role));
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur de connexion Google");
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error("Échec de la connexion Google"),
  });

  const handleFacebookResponse = async (response) => {
    if (response.accessToken) {
      try {
        const res = await loginWithFacebook({ accessToken: response.accessToken, role: formReg.role });
        const role = res.data.user.role;
        loginUser(res.data.user, res.data.token);
        toast.success("Connexion Facebook réussie !");
        navigate(getRedirectPath(role));
      } catch (err) {
        toast.error(err.response?.data?.message || "Erreur de connexion Facebook");
      }
    }
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateEmail = (email) => {
    if (!email) return "";
    return emailRegex.test(email) ? "" : "Format email invalide";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const err = validateEmail(formLogin.email);
    if (err) { toast.error(err); return; }
    if (formLogin.password.length < 6)     { toast.error("Mot de passe trop court"); return; }
    setLoading(true);
    try {
      const res  = await login(formLogin);
      const role = res.data.user.role;
      loginUser(res.data.user, res.data.token);
      toast.success("Connexion réussie !");
      navigate(getRedirectPath(role));
    } catch (err) {
      if (err.response?.data?.needsVerification) {
        toast.error("Compte non vérifié. Cliquez sur le lien dans votre email ou demandez un nouveau.");
      } else {
        toast.error(err.response?.data?.message || "Email ou mot de passe incorrect");
      }
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const err = validateEmail(formReg.email);
    if (err) { toast.error(err); return; }
    if (formReg.password !== formReg.confirmPassword) { toast.error("Les mots de passe ne correspondent pas"); return; }
    if (formReg.password.length < 6)                  { toast.error("Mot de passe trop court (6 min)"); return; }
    setLoading(true);
    try {
      const { confirmPassword, ...data } = formReg;
      const res  = await register(data);
      if (res.data.needsVerification) {
        toast.success(res.data.message || "Veuillez vérifier votre email.");
        setIsLogin(true);
      } else {
        const role = res.data.user.role;
        loginUser(res.data.user, res.data.token);
        toast.success(res.data.message || "Compte créé ! Vérifiez votre email.");
        navigate(getRedirectPath(role));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur inscription");
    } finally { setLoading(false); }
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (!forgotEmail) { toast.error("Entrez votre email"); return; }
    toast.success("Un lien de réinitialisation a été envoyé !");
    setShowForgot(false);
    setForgotEmail("");
  };

  return (
    <div className="lp-container">
      <div className="lp-bg-dots"  />
      <div className="lp-bg-orbs"  />

      <div className="lp-wrapper">

        {/* ════ PANNEAU GAUCHE — Branding ════ */}
        <aside className="lp-brand">
          <div className="lp-brand-content">
            <div className="lp-logo-box">
              <Home size={52} />
            </div>
            <h1 className="lp-brand-name">SmartBuild</h1>
            <p className="lp-brand-sub">Plateforme intelligente de devis immobilier</p>
            
            <img 
              src="/images/Sign up-rafiki.svg"
              alt="SmartBuild"
              className="hero-image"
            />

            <div className="lp-features">
              <div className="lp-feature"><TrendingUp size={20}/><span>Devis en 5 minutes</span></div>
              <div className="lp-feature"><Users size={20}/><span>Ingénieurs certifiés</span></div>
              <div className="lp-feature"><Zap size={20}/><span>Estimation en temps réel</span></div>
            </div>
          </div>
        </aside>

        {/* ════ PANNEAU DROIT — Formulaire ════ */}
        <div className="lp-form-panel">

          {/* ── MOT DE PASSE OUBLIÉ ── */}
          {showForgot && (
            <div className="lp-card">
              <button className="lp-back-btn" onClick={() => setShowForgot(false)}>
                ← Retour
              </button>
              <div className="lp-card-header">
                <div className="lp-icon-badge">🔑</div>
                <h2>Mot de passe oublié</h2>
                <p>Entrez votre email pour recevoir un lien de réinitialisation</p>
              </div>
              <form onSubmit={handleForgot} className="lp-form">
                <div className="lp-field">
                  <label>Email</label>
                  <div className="lp-input-box">
                    <Mail size={17} className="lp-ico" />
                    <input
                      type="email"
                      placeholder="vous@smartbuild.tn"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="lp-btn-primary">
                  Envoyer le lien
                </button>
              </form>
            </div>
          )}

          {/* ── CONNEXION ── */}
          {!showForgot && isLogin && (
            <div className="lp-card">
              <div className="lp-card-header">
                <div className="lp-icon-badge"><Home size={28}/></div>
                <h2>Bienvenue</h2>
                <p>Connectez-vous à votre espace SmartBuild</p>
              </div>

              <div className="lp-socials">
                <button className="lp-social-btn lp-google" onClick={() => loginGoogle()} type="button">
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Continuer avec Google
                </button>
                <FacebookLogin
                  appId={import.meta.env.VITE_FACEBOOK_APP_ID || "votre-facebook-app-id"}
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={handleFacebookResponse}
                  render={renderProps => (
                    <button className="lp-social-btn lp-facebook" onClick={renderProps.onClick} type="button">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Continuer avec Facebook
                    </button>
                  )}
                />
              </div>

              <div className="lp-divider"><span>OU</span></div>

              <form onSubmit={handleLogin} className="lp-form" autoComplete="off">
                <div className="lp-field">
                  <label>Email</label>
                  <div className="lp-input-box">
                    <Mail size={17} className="lp-ico" />
                    <input
                      type="email"
                      placeholder="vous@smartbuild.tn"
                      value={formLogin.email}
                      onChange={(e) => {
                        setFormLogin({ ...formLogin, email: e.target.value.replace(/\s/g,"") });
                        setErrors(prev => ({ ...prev, loginEmail: validateEmail(e.target.value) }));
                      }}
                      required autoComplete="off"
                    />
                  </div>
                  {errors.loginEmail && <span className="field-error">{errors.loginEmail}</span>}
                </div>

                <div className="lp-field">
                  <label>Mot de passe</label>
                  <div className="lp-input-box">
                    <Lock size={17} className="lp-ico" />
                    <input
                      type={showPwd ? "text" : "password"}
                      placeholder="••••••••"
                      value={formLogin.password}
                      onChange={(e) => setFormLogin({ ...formLogin, password: e.target.value })}
                      required autoComplete="new-password"
                    />
                    <button type="button" className="lp-eye" onClick={() => setShowPwd(!showPwd)}>
                      {showPwd ? <Eye size={17}/> : <EyeOff size={17}/>}
                    </button>
                  </div>
                </div>

                <div className="lp-form-options">
                  <label className="lp-remember">
                    <input type="checkbox" />
                    <span>Se souvenir de moi</span>
                  </label>
                  <button
                    type="button"
                    className="lp-forgot-link"
                    onClick={() => setShowForgot(true)}
                  >
                    Mot de passe oublié ?
                  </button>
                </div>

                <AnimatedButton type="submit" className="lp-btn-primary" disabled={loading}>
                  {loading ? <><span className="lp-spinner"/>&nbsp;Connexion...</> : "Se connecter"}
                </AnimatedButton>
              </form>

              <div className="lp-divider"><span>OU</span></div>

              <div className="lp-switch">
                <span>Pas encore de compte ?</span>
                <button className="lp-switch-btn" onClick={() => setIsLogin(false)}>
                  Créer un compte gratuitement
                </button>
              </div>
            </div>
          )}

          {/* ── INSCRIPTION ── */}
          {!showForgot && !isLogin && (
            <div className="lp-card lp-register-card">
              <div className="lp-card-header">
                <div className="lp-icon-badge"><Home size={28}/></div>
                <h2>Créer un compte</h2>
                <p>Rejoignez SmartBuild en quelques étapes</p>
              </div>

              <div className="lp-divider"><span>OU</span></div>

              <form onSubmit={handleRegister} className="lp-form">
                <div className="lp-field">
                  <label>Nom complet</label>
                  <div className="lp-input-box">
                    <User size={17} className="lp-ico" />
                    <input placeholder="Ahmed Ben Ali" value={formReg.name}
                      onChange={(e) => setFormReg({ ...formReg, name: e.target.value })} required />
                  </div>
                </div>

                <div className="lp-field">
                  <label>Email</label>
                  <div className="lp-input-box">
                    <Mail size={17} className="lp-ico" />
                    <input type="email" placeholder="vous@smartbuild.tn" value={formReg.email}
                      onChange={(e) => {
                        setFormReg({ ...formReg, email: e.target.value });
                        setErrors(prev => ({ ...prev, regEmail: validateEmail(e.target.value) }));
                      }} required />
                  </div>
                  {errors.regEmail && <span className="field-error">{errors.regEmail}</span>}
                </div>

                <div className="lp-field">
                  <label>Téléphone</label>
                  <div className="lp-input-box">
                    <Phone size={17} className="lp-ico" />
                    <input type="tel" placeholder="+216 XX XXX XXX" value={formReg.phone}
                      onChange={(e) => setFormReg({ ...formReg, phone: e.target.value })} required />
                  </div>
                </div>

                <div className="lp-field">
                  <label>Pays</label>
                  <div className="lp-input-box lp-select-box">
                    <Globe size={17} className="lp-ico" />
                    <select value={formReg.country}
                      onChange={(e) => setFormReg({ ...formReg, country: e.target.value })} required>
                      <option value="">Sélectionner un pays</option>
                      <option value="Tunisia">Tunisie</option>
                      <option value="Algeria">Algérie</option>
                      <option value="Morocco">Maroc</option>
                      <option value="France">France</option>
                      <option value="Belgium">Belgique</option>
                    </select>
                    <span className="lp-chevron">▾</span>
                  </div>
                </div>

                <div className="lp-field">
                  <label>Adresse</label>
                  <div className="lp-input-box">
                    <MapPin size={17} className="lp-ico" />
                    <input placeholder="Rue, Ville" value={formReg.address}
                      onChange={(e) => setFormReg({ ...formReg, address: e.target.value })} required />
                  </div>
                </div>

                <div className="lp-field">
                  <label>Mot de passe</label>
                  <div className="lp-input-box">
                    <Lock size={17} className="lp-ico" />
                    <input type={showPwd ? "text" : "password"} placeholder="Minimum 6 caractères"
                      value={formReg.password}
                      onChange={(e) => setFormReg({ ...formReg, password: e.target.value })} required />
                    <button type="button" className="lp-eye" onClick={() => setShowPwd(!showPwd)}>
                      {showPwd ? <Eye size={17}/> : <EyeOff size={17}/>}
                    </button>
                  </div>
                </div>

                <div className="lp-field">
                  <label>Confirmer le mot de passe</label>
                  <div className="lp-input-box">
                    <Lock size={17} className="lp-ico" />
                    <input type={showConfPwd ? "text" : "password"} placeholder="Confirmez votre mot de passe"
                      value={formReg.confirmPassword}
                      onChange={(e) => setFormReg({ ...formReg, confirmPassword: e.target.value })} required />
                    <button type="button" className="lp-eye" onClick={() => setShowConfPwd(!showConfPwd)}>
                      {showConfPwd ? <Eye size={17}/> : <EyeOff size={17}/>}
                    </button>
                  </div>
                </div>

                <div className="lp-field">
                  <label>Vous êtes...</label>
                  <div className="lp-roles">
                    {ROLES.map((r) => (
                      <AnimatedCard key={r.value} className={`lp-role-card ${formReg.role === r.value ? "active" : ""}`} style={{ "--rc": r.color }} whileHover={{ scale: 1.02 }}
                        onClick={() => setFormReg({ ...formReg, role: r.value })}>
                        <span className="lp-role-icon">{r.icon}</span>
                        <div className="lp-role-text">
                          <strong>{r.label}</strong>
                          <small>{r.desc}</small>
                        </div>
                        <div className="lp-role-check">
                          {formReg.role === r.value && "✓"}
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                </div>

                <AnimatedButton type="submit" className="lp-btn-primary" disabled={loading}>
                  {loading ? <><span className="lp-spinner"/>&nbsp;Création...</> : "Créer mon compte"}
                </AnimatedButton>
              </form>

              <div className="lp-switch">
                <span>Déjà inscrit ?</span>
                <button className="lp-switch-btn" onClick={() => setIsLogin(true)}>
                  Se connecter
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}