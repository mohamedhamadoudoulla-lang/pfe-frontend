import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, ChevronDown, FileText, Shield, Zap, Users, PenTool } from "lucide-react";

import DemoModal from "../components/DemoModal";
import ServicesSection from "../components/ServicesSection";
import ScrollingWords from "../components/ScrollingWords";
import { AnimatedCard, ScrollReveal } from "@/components/animate";

import "./Home.css";

const faqs = [
  { q: "Comment fonctionne l'estimation de devis ?", a: "Renseignez la surface, le nombre d'étages et le niveau de finition souhaité. Notre outil calcule instantanément un devis basé sur les prix du marché tunisien actualisés." },
  { q: "Est-ce que le service est vraiment gratuit ?", a: "Oui, l'estimation et la génération de devis sont entièrement gratuites. Vous ne payez que si vous faites appel à un ingénieur partenaire via la plateforme." },
  { q: "Comment sont vérifiés les ingénieurs partenaires ?", a: "Chaque ingénieur passe par un processus de vérification de ses diplômes, certifications et références avant d'être approuvé sur la plateforme." },
  { q: "Puis-je télécharger mon devis en PDF ?", a: "Absolument. Une fois votre devis généré, vous pouvez le télécharger en format PDF pour l'imprimer ou le partager avec vos partenaires." },
  { q: "Quels types de finition sont disponibles ?", a: "Nous proposons 3 gammes : Économique (standard), Standard (bonne qualité) et Haut de Gamme (premium) avec des matériaux et équipements adaptés à chaque budget." },
  { q: "Comment contacter un ingénieur ?", a: "Après avoir généré votre devis, vous pouvez choisir parmi nos ingénieurs vérifiés et les contacter directement via la messagerie intégrée." },
];

export default function Home() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="home-rainbow-lines">
        <div className="rl" />
        <div className="rl" />
        <div className="rl" />
        <div className="rl" />
        <div className="rl" />
        <div className="rl" />
        <div className="rl" />
        <div className="rl" />
      </div>

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hero-section">
        <div className="hero-bg-img" />
        <div className="hero-overlay" />
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">Bienvenue sur SmartBuild</div>
            <h1 className="hero-title">
              <span className="hero-title-line">Construisez votre maison avec</span>
              <span className="hero-title-brand">SmartBuild</span>
            </h1>
            <p className="hero-desc">
              Estimez votre budget en temps réel, comparez les offres professionnelles et planifiez votre projet immobilier en quelques clics.
            </p>


            <div className="hero-cta">
              <Link to={user ? "/devis-wizard" : "/login"} className="btn btn-primary">
                Commencer gratuitement
                <ArrowRight size={20} />
              </Link>
              <Link to="/catalogue" className="btn btn-secondary">
                Voir le catalogue
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ SERVICES ═══════════════ */}
      <ServicesSection />

      {/* ═══════════════ STEPS ═══════════════ */}
      <section className="steps-hero">
        <video autoPlay muted loop playsInline className="steps-video">
          <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        </video>
        <div className="steps-hero-overlay" />
        <div className="steps-hero-content">
          <span className="steps-hero-tag">Comment ça marche</span>
          <h2>Quatre étapes simples</h2>
          <p>Transformez votre rêve en réalité en quatre étapes simples</p>
          <button className="btn btn-secondary" style={{ marginTop: "16px" }} onClick={() => setIsDemoOpen(true)}>
            Voir la démo
          </button>
        </div>
      </section>

      <section className="steps-list">
        {[
          { n: 1, title: "Choisissez votre terrain", desc: "Saisissez la région et la superficie souhaitée pour estimer le coût du terrain." },
          { n: 2, title: "Définissez votre maison", desc: "Surface, étages, finition — obtenez un devis détaillé en quelques secondes." },
          { n: 3, title: "Meublez votre intérieur", desc: "Estimez le budget mobilier pièce par pièce avec notre catalogue intégré." },
          { n: 4, title: "Téléchargez votre devis", desc: "Exportez un devis complet en PDF et contactez les professionnels." },
        ].map((s, i) => (
          <ScrollReveal key={s.n} direction="up" delay={i * 0.1}>
            <div className="step-card">
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section className="features">
        <div className="section-container">
          <ScrollReveal direction="up">
            <div className="section-header">
              <span className="section-tag">Pourquoi nous choisir</span>
              <h2>Des fonctionnalités pensées pour vous</h2>
              <p>Des outils professionnels pour simplifier chaque aspect de votre projet</p>
            </div>
          </ScrollReveal>

          <div className="features-grid">
            {[
              { icon: Zap, title: "Estimation intelligente", desc: "Calculs basés sur les prix réels du marché tunisien avec mise à jour trimestrielle.", color: "#3b82f6" },
              { icon: Users, title: "Ingénieurs partenaires", desc: "Accédez à des professionnels vérifiés près de chez vous, avec avis et portfolios.", color: "#8b5cf6" },
              { icon: Shield, title: "Gratuit et sans engagement", desc: "Créez un compte et estimez votre budget sans frais cachés ni abonnement.", color: "#10b981" },
              { icon: FileText, title: "Devis PDF détaillé", desc: "Obtenez un devis complet et téléchargeable avec ventilation des coûts.", color: "#f59e0b" },
              { icon: PenTool, title: "Plans prêts à l'emploi", desc: "Consultez des modèles de maison avec plans détaillés et visualisations.", color: "#06b6d4" },
            ].map((f, i) => (
              <ScrollReveal key={f.title} direction="up" delay={i * 0.08}>
                <AnimatedCard className="feature-card" whileHover={{ scale: 1.03 }}>
                  <div className="feature-icon" style={{ background: `${f.color}15`, color: f.color }}>
                    <f.icon size={24} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </AnimatedCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ SCROLLING WORDS 2 ═══════════════ */}
      <ScrollingWords />

      {/* ═══════════════ FAQ ═══════════════ */}
      <section className="faq-section">
        <div className="section-container">
          <ScrollReveal direction="up">
            <div className="section-header">
              <span className="section-tag">FAQ</span>
              <h2>Questions fréquentes</h2>
              <p>Tout ce que vous devez savoir avant de commencer</p>
            </div>
          </ScrollReveal>

          <div className="faq-list">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 0.05}>
                <div className={`faq-item ${openFaq === i ? "open" : ""}`}>
                  <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`faq-chevron ${openFaq === i ? "rotated" : ""}`} />
                  </button>
                  <div className="faq-answer" style={{ maxHeight: openFaq === i ? "200px" : "0" }}>
                    <p>{faq.a}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
    </div>
  );
}
