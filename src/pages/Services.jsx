import { Link } from "react-router-dom";
import {
  Building2,
  PenTool,
  Sofa,
  TreePine,
  HardHat,
  Wrench,
  ClipboardCheck,
  Lightbulb,
  Paintbrush,
  Square,
  Zap,
  Droplets,
  Hammer,
  ArrowRight,
  Phone,
  CheckCircle2,
} from "lucide-react";
import RainbowLines from "../components/RainbowLines";
import "./Services.css";

const SERVICES = [
  {
    icon: <Building2 size={28} />,
    title: "Exécution et construction de projets de bâtiment",
    desc: "Analyse approfondie, planification stratégique et élaboration détaillée du dossier d'exécution avec les détails techniques pour votre projet de construction.",
  },
  {
    icon: <PenTool size={28} />,
    title: "Architecture",
    desc: "Conception des plans architecturaux et des détails techniques pour la bonne exécution, le réaménagement et le traitement des façades.",
  },
  {
    icon: <Sofa size={28} />,
    title: "Architecture d'Intérieur",
    desc: "Conception de plans aménagés et décoration d'intérieur. Choix des matériaux, couleurs et éclairage adaptés. Nous transformons vos espaces de vie pour allier esthétique, fonctionnalité et confort.",
  },
  {
    icon: <TreePine size={28} />,
    title: "Aménagement Extérieur",
    desc: "Concevoir des espaces extérieurs tels que jardins, terrasses, et piscines, en alliant beauté, fonctionnalité et durabilité, tout en offrant un design personnalisé.",
  },
  {
    icon: <HardHat size={28} />,
    title: "Travaux Génie Civil",
    desc: "La conception, la construction et la rénovation d'infrastructures des bâtiments, en assurant la sécurité et la durabilité.",
  },
  {
    icon: <Wrench size={28} />,
    title: "Construction et Réhabilitation",
    desc: "Démolition, construction de nouveaux bâtiments, rénovation et réaménagement des espaces.",
  },
  {
    icon: <ClipboardCheck size={28} />,
    title: "Gestion et Supervision",
    desc: "Planification, gestion des coûts et suivi des chantiers afin de contrôler la qualité et la sécurité tout en respectant les délais.",
  },
  {
    icon: <Lightbulb size={28} />,
    title: "Conseils et Expertise Technique",
    desc: "Recommandation et orientation sur les choix techniques et matériels selon des évaluations et des analyses des besoins structurels, conformes aux normes de construction.",
  },
];

const SPECIALITES = [
  { icon: <Paintbrush size={20} />, title: "Peinture", desc: "Application de peintures décoratives et protectrices." },
  { icon: <Square size={20} />, title: "Menuiserie", desc: "Fournir des cahiers de menuiserie détaillés (bois, aluminium, fer forgé) et des détails d'agencement personnalisés." },
  { icon: <Zap size={20} />, title: "Électricité", desc: "Installation et maintenance des systèmes électriques." },
  { icon: <Droplets size={20} />, title: "Plomberie Sanitaire", desc: "Installation et maintenance des systèmes de plomberie." },
  { icon: <Hammer size={20} />, title: "Ferronnerie", desc: "Conception et fabrication sur mesure de structures métalliques, ainsi que l'installation et la maintenance." },
];

export default function Services() {
  return (
    <div className="sv-page">
      <RainbowLines variant="services" />
      
      {/* Hero */}
      <section className="sv-hero">
        <div className="sv-hero-bg" />
        <div className="sv-hero-content">
          <span className="sv-hero-badge">Services</span>
          <h1 className="sv-hero-title">Services en gestion de projets de construction</h1>
          <p className="sv-hero-sub">
            De la conception à la réalisation, nous vous accompagnons à chaque étape de votre projet de construction.
          </p>
          <Link to="/devis-wizard" className="sv-hero-btn">
            Commencer mon projet <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Services grid */}
      <section className="sv-section">
        <div className="sv-container">
          <div className="sv-section-header">
            <h2 className="sv-section-title">Nos prestations</h2>
            <p className="sv-section-desc">Une gamme complète de services pour votre projet de construction</p>
          </div>
          <div className="sv-grid">
            {SERVICES.map((s, i) => (
              <div key={i} className="sv-card">
                <div className="sv-card-icon">{s.icon}</div>
                <h3 className="sv-card-title">{s.title}</h3>
                <p className="sv-card-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spécialités */}
      <section className="sv-section sv-alt">
        <div className="sv-container">
          <div className="sv-section-header">
            <h2 className="sv-section-title">Travaux de construction spécifiques</h2>
            <p className="sv-section-desc">Besoin d'un artisan qualifié ? Nos experts interviennent dans tous les corps de métier.</p>
          </div>
          <div className="sv-spec-grid">
            {SPECIALITES.map((s, i) => (
              <div key={i} className="sv-spec-card">
                <div className="sv-spec-icon">{s.icon}</div>
                <h3 className="sv-spec-title">{s.title}</h3>
                <p className="sv-spec-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="sv-cta">
        <div className="sv-cta-content">
          <h2 className="sv-cta-title">Démarrons votre projet !</h2>
          <p className="sv-cta-desc">Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé.</p>
          <div className="sv-cta-actions">
            <Link to="/devis-wizard" className="sv-cta-btn sv-cta-primary">
              <CheckCircle2 size={18} />
              Estimer mon projet
            </Link>
            <a href="tel:+21628842842" className="sv-cta-btn sv-cta-secondary">
              <Phone size={18} />
              +216 28 842 842
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
