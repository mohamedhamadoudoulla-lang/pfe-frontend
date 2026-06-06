import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/api";
import toast from "react-hot-toast";
import { CheckCircle, XCircle, Loader } from "lucide-react";

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const hasFetched = useRef(false);

  useEffect(() => {
    const verify = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;
      
      try {
        const res = await verifyEmail(token);
        setStatus("success");
        toast.success(res.data.message || "Email vérifié avec succès !");
        setTimeout(() => navigate("/login"), 3000);
      } catch (err) {
        setStatus("error");
        toast.error(err.response?.data?.message || "Token invalide ou expiré");
      }
    };
    if (token) verify();
    else setStatus("error");
  }, [token, navigate]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #eff6ff, #dbeafe)",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{
        background: "white",
        padding: "48px 40px",
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(59,130,246,0.15)",
        textAlign: "center",
        maxWidth: "440px",
        width: "90%",
      }}>
        {status === "loading" && (
          <>
            <Loader size={48} color="#3b82f6" style={{ marginBottom: "16px", animation: "spin 1s linear infinite" }} />
            <h2 style={{ color: "#1e40af", marginBottom: "8px" }}>Vérification en cours...</h2>
            <p style={{ color: "#6b7280" }}>Veuillez patienter pendant que nous vérifions votre email.</p>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle size={48} color="#10b981" style={{ marginBottom: "16px" }} />
            <h2 style={{ color: "#059669", marginBottom: "8px" }}>Email vérifié !</h2>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
              Votre compte est maintenant actif. Redirecting to login...
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "12px 28px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Se connecter
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <XCircle size={48} color="#ef4444" style={{ marginBottom: "16px" }} />
            <h2 style={{ color: "#dc2626", marginBottom: "8px" }}>Échec de vérification</h2>
            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
              Le lien a expiré ou est invalide. Demandez un nouveau lien de vérification.
            </p>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "#3b82f6",
                color: "white",
                border: "none",
                padding: "12px 28px",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Retour à la connexion
            </button>
          </>
        )}
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}