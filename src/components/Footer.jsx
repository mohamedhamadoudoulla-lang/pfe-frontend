import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background: "#fff", borderTop: "0.5px solid #e2eaf4", marginTop: "auto" }}>
      <div style={{ background: "#fff", lineHeight: 0 }}>
        <svg viewBox="0 0 1200 80" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: "80px" }}>
          <path d="M0,80 L0,40 Q150,0 300,30 Q450,60 600,20 Q750,-10 900,25 Q1050,55 1200,15 L1200,80 Z" fill="#1255a1" />
        </svg>
      </div>

      <div style={{ background: "#1255a1", padding: "40px 32px 0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div className="ft-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "36px", paddingBottom: "36px" }}>
            <div>
              <p style={{ color: "#fff", fontSize: "18px", fontWeight: 500, margin: "12px 0 8px" }}>
                SmartBuild
              </p>
              <p style={{ color: "#b8d4f0", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                Votre plateforme de devis et d'estimation de construction intelligente.
                Materiaux, terrains et equipements - tout en un.
              </p>
            </div>

            <FooterCol title="Services" links={[
              { label: "Estimation devis", to: "/devis-wizard" },
              { label: "Materiaux", to: "/recommandation-materiaux/estimation1" },
              { label: "Catalogue", to: "/catalogue" },
              { label: "Marketplace terrains", to: "/terrains/marketplace" },
              { label: "Equipements pro", to: "/equipments/marketplace" },
            ]} />

            <FooterCol title="Vendeurs" links={[
              { label: "Publier un terrain", to: "/terrains/ajouter" },
              { label: "Gerer mes produits", to: "/vendeur/produits" },
              { label: "Mes commandes", to: "/vendeur/dashboard" },
              { label: "Tableau de bord", to: "/vendeur/dashboard" },
            ]} />

            <FooterCol title="Support" links={[
              { label: "Comment ca marche", to: "/services" },
              { label: "Contactez-nous", to: "/services" },
            ]} />
          </div>

          <hr style={{ border: "none", borderTop: "0.5px solid rgba(255,255,255,0.15)", margin: 0 }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 24px", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px" }}>
              2024 SmartBuild - Tous droits reserves
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <p style={{ color: "#7ec3ff", fontSize: "11px", fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 14px" }}>{title}</p>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {links.map(({ label, to }) => (
          <li key={label} style={{ marginBottom: "9px" }}>
            <Link to={to} style={{ color: "#c2dcf5", fontSize: "13px", textDecoration: "none" }}>{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
