import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, loginWithGoogle, loginWithFacebook } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLoginModule from "react-facebook-login/dist/facebook-login-render-props";
const FacebookLogin = FacebookLoginModule.default || FacebookLoginModule;
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import "./Login.css";

const languages = [
  "afrikaans","বাংলা","Catalogne","Čeština","Dansk","Allemand",
  "Ελληνικά","Anglais","Espagnol","Finlande","Français","Hindi",
  "magyar","Bahasa Indonesia","Íslenska","Italien","日本語","한국어",
  "Lietuvių","Latviešu","Néerlandais","Norsk","Polski","Portugais",
  "Română","Русский","Slovène",
];

export default function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const REDIRECTS = { admin: "/admin/dashboard", engineer: "/ingenieur/dashboard", terrain_seller: "/terrains/ajouter", equipment_seller: "/equipments/dashboard", user: "/devis-wizard" };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      const res = await loginWithGoogle({ accessToken: tokenResponse.access_token, role: "user" });
      loginUser(res.data.user, res.data.token);
      toast.success("Connexion Google réussie !");
      navigate(REDIRECTS[res.data.user.role] || "/devis-wizard");
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || err.message;
      toast.error("Erreur Google: " + msg);
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => toast.error("Échec de la connexion Google"),
  });

  const handleFacebookResponse = async (response) => {
    if (response.accessToken) {
      try {
        const res = await loginWithFacebook({ accessToken: response.accessToken, role: "user" });
        loginUser(res.data.user, res.data.token);
        toast.success("Connexion Facebook réussie !");
        navigate(REDIRECTS[res.data.user.role] || "/devis-wizard");
      } catch {
        toast.error("Erreur de connexion Facebook");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Email requis"); return; }
    if (password.length < 6) { toast.error("Mot de passe trop court"); return; }
    setLoading(true);
    try {
      const res = await login({ email, password });
      loginUser(res.data.user, res.data.token);
      toast.success("Connexion réussie !");
      const role = res.data.user.role;
      navigate(REDIRECTS[role] || "/devis-wizard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Email ou mot de passe incorrect");
    } finally { setLoading(false); }
  };

  return (
    <div className="ca-wrapper">
      <div className="ca-ribbon-container">
        <svg viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" className="ca-ribbon-svg">
          <defs>
            <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#c8f400" />
              <stop offset="40%" stopColor="#ff6a00" />
              <stop offset="100%" stopColor="#ff2d8b" />
            </linearGradient>
          </defs>
          <path
            d="M -50 320 C 100 320, 180 200, 250 280 C 320 360, 280 480, 220 440 C 160 400, 200 300, 280 300 C 360 300, 500 260, 700 340 C 850 400, 950 380, 1000 360"
            fill="none"
            stroke="url(#ribbonGrad)"
            strokeWidth="28"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="ca-content">
        <div className="ca-left">
          <h1 className="ca-title">Bienvenue</h1>
          <p className="ca-subtitle">Connectez-vous à votre espace SmartBuild</p>
        </div>

        <div className="ca-right">
          <div className="ca-socials">
            <button className="ca-social-btn ca-google" onClick={() => loginGoogle()} type="button">
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
              render={(renderProps) => (
                <button className="ca-social-btn ca-facebook" onClick={renderProps.onClick} type="button">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Continuer avec Facebook
                </button>
              )}
            />
          </div>

          <div className="ca-divider"><span>OU</span></div>

          <form onSubmit={handleSubmit}>
            <div className="ca-field">
              <label className="ca-label">Adresse e-mail</label>
              <div className="ca-field-line" />
              <div className="ca-input-wrap">
                <span className="ca-input-icon"><Mail size={17} /></span>
                <input className="ca-input" type="email" placeholder="vous@smartbuild.tn" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            <div className="ca-field">
              <label className="ca-label">Mot de passe</label>
              <div className="ca-field-line" />
              <div className="ca-pwd-wrap">
                <span className="ca-input-icon"><Lock size={17} /></span>
                <input className="ca-input" type={showPwd ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" className="ca-eye" onClick={() => setShowPwd(!showPwd)}>
                  {showPwd ? <Eye size={17} /> : <EyeOff size={17} />}
                </button>
              </div>
            </div>

            <div className="ca-row">
              <label className="ca-check-label">
                <input type="checkbox" className="ca-checkbox" /> Se souvenir de moi
              </label>
              <button type="button" className="ca-link-btn" onClick={() => toast.success("Lien de réinitialisation envoyé !")}>
                Mot de passe oublié ?
              </button>
            </div>

            <button className="ca-btn ca-btn-full" type="submit" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <div className="ca-switch">
            <span>Pas encore de compte ?</span>
            <button className="ca-link-btn" onClick={() => navigate("/register")}>Créer un compte gratuitement</button>
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
