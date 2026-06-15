import { MapPin, Home, Sofa, Handshake, Ruler, BarChart3, ArrowRight } from "lucide-react";
import { ScrollReveal } from "./animate";
import { Link } from "react-router-dom";
import "./ServicesSection.css";

const services = [
  {
    icon: MapPin,
    title: "Estimation Terrain",
    desc: "Évaluez le prix d'un terrain selon la région, la superficie et les caractéristiques locales. Notre outil utilise les données actualisées du marché tunisien pour vous donner une estimation fiable en quelques secondes.",
    features: ["Prix au m² par région", "Comparaison de zones", "Analyse de potentiel"],
    img: "/images/Building permit-pana.svg",
    link: "/terrain/estimation",
    cta: "Estimer un terrain",
  },
  {
    icon: Home,
    title: "Construction & Rénovation",
    desc: "Obtenez un devis détaillé pour construire ou rénover votre maison. Choisissez parmi 3 gammes de finition (Économique, Standard, Haut de gamme) et recevez une ventilation complète des coûts.",
    features: ["Devis pièce par pièce", "3 niveaux de finition", "Export PDF gratuit"],
    img: "/images/Construction costs-pana.svg",
    link: "/devis-wizard",
    cta: "Obtenir un devis",
    reverse: true,
  },
  {
    icon: Sofa,
    title: "Ameublement & Décoration",
    desc: "Estimez le budget mobilier pour chaque pièce de votre maison. Accédez à notre catalogue d'équipements et meubles avec des prix actualisés pour un budget précis.",
    features: ["Catalogue intégré", "Budget par pièce", "Styles et gammes"],
    img: "/images/Apartment rent-pana.svg",
    link: "/equipments/marketplace",
    cta: "Voir le catalogue",
  },
  {
    icon: Handshake,
    title: "Mise en relation",
    desc: "Connectez-vous avec des ingénieurs et architectes vérifiés près de chez vous. Consultez leurs profils, portfolios et avis pour choisir le professionnel idéal pour votre projet.",
    features: ["Profils vérifiés", "Messagerie intégrée", "Avis clients"],
    img: "/images/International cooperation-pana.svg",
    link: "/ingenieurs",
    cta: "Trouver un ingénieur",
    reverse: true,
  },
  {
    icon: Ruler,
    title: "Plans & Conception",
    desc: "Accédez à des plans de maison prêts à l'emploi ou faites concevoir votre plan sur mesure. Visualisez en détail chaque modèle avec des informations techniques complètes.",
    features: ["Plans détaillés", "Visualisation 3D", "Surface personnalisable"],
    img: "/images/Houses-bro.svg",
    link: "/catalogue",
    cta: "Voir les plans",
  },
  {
    icon: BarChart3,
    title: "Suivi de Budget",
    desc: "Suivez l'évolution de votre budget projet avec des estimations en temps réel. Recevez des alertes et recommendations pour optimiser vos coûts à chaque étape.",
    features: ["Tableau de bord", "Alertes budget", "Rapports détaillés"],
    img: "/images/Investment data-amico.svg",
    link: "/devis-wizard",
    cta: "Commencer le suivi",
    reverse: true,
  },
];

export default function ServicesSection() {
  return (
    <section className="ss-section">
      <div className="ss-container">
        <ScrollReveal direction="up">
          <div className="ss-header-wrap">
            <div className="ss-header">
              <span className="ss-tag">Nos services</span>
              <h2>Tout ce dont vous avez besoin pour votre projet</h2>
              <p>De l'estimation du terrain à la décoration intérieure, SmartBuild vous accompagne à chaque étape.</p>
            </div>
            <div className="ss-iphone">
              <div className="ss-iphone-body">
                <div className="ss-iphone-notch" />
                <div className="ss-iphone-screen">
                  <video autoPlay muted loop playsInline className="ss-iphone-video">
                    <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="ss-list">
          {services.map((s, i) => (
            <ScrollReveal key={s.title} direction="up" delay={i * 0.08}>
              <div className={`ss-item ${s.reverse ? "ss-reverse" : ""}`}>
                <div className="ss-image-wrap">
                  <img src={s.img} alt={s.title} className="ss-image" />
                </div>
                <div className="ss-content">
                  <div className="ss-icon">
                    <s.icon size={22} />
                  </div>
                  <h3 className="ss-title">{s.title}</h3>
                  <p className="ss-desc">{s.desc}</p>
                  <ul className="ss-features">
                    {s.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <Link to={s.link} className="ss-cta">
                    {s.cta} <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
