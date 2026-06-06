import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight } from "lucide-react";

import DemoModal from "../components/DemoModal";
import {
  AnimatedButton,
  AnimatedCard,
  ScrollReveal,
} from "@/components/animate";

import "./Home.css";

export default function Home() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleStart = () => navigate(user ? "/devis-wizard" : "/login");

  return (
    <div className="home">

      {/* HERO */}
      <section className="hero-section">

        {/* ANIMATED BACKGROUND — pas de vidéo, animation CSS pure */}
        <div className="hero-animated-bg">
          <div className="hero-orb orb-1"></div>
          <div className="hero-orb orb-2"></div>
          <div className="hero-orb orb-3"></div>
          <div className="hero-orb orb-4"></div>
          <div className="hero-grid-lines"></div>
        </div>

<div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              Bienvenue sur SmartBuild
            </div>

       <h1 className="hero-title">
  <span className="hero-title-black">Construisez votre maison avec smartbuild</span>
  
  <span className="hero-title-blue">intelligemment</span>
</h1> 
<br />
            <p className="hero-desc">
              Estimez votre budget en temps reel,
              comparez les offres professionnelles
              et planifiez votre projet immobilier
              en quelques clics.
            </p> 
            <br />

            <div className="hero-cta">
              <Link
                to={user ? "/devis-wizard" : "/login"}
                className="btn btn-primary"
              >
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

      {/* STEPS */}
      <section className="steps">
        <div className="section-container">
          <div className="steps-header">
            <h2>Comment ca marche ?</h2>
            <p>Quatre etapes simples pour transformer votre reve en realite</p>
          </div>

          <div className="steps-grid">
            {[
              { n: 1, title: "Choisissez votre terrain", desc: "Saisissez la region et la superficie souhaitee.", footer: "Etape 1 sur 4" },
              { n: 2, title: "Definissez votre maison", desc: "Surface, etages, finition - obtenez un devis detaille.", footer: "Etape 2 sur 4" },
              { n: 3, title: "Meublez votre interieur", desc: "Estimez le budget mobilier piece par piece.", footer: "Etape 3 sur 4" },
              { n: 4, title: "Telechargez votre devis", desc: "Exportez un devis complet en PDF.", footer: "Etape 4 sur 4" },
            ].map((s, i) => (
              <ScrollReveal key={s.n} direction="up" delay={i * 0.1}>
                <AnimatedCard className="step-card" whileHover={{ scale: 1.03 }}>
                  <div className="step-number">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <div className="step-footer">{s.footer}</div>
                </AnimatedCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features">
        <div className="section-container">
          <div className="features-header">
            <h2>Pourquoi choisir SmartBuild ?</h2>
            <p>Des outils professionnels pour simplifier votre projet</p>
          </div>

          <div className="features-grid">
            {[
              { title: "Estimation intelligente", desc: "Calculs bases sur les prix reels du marche tunisien." },
              { title: "Ingenieurs partenaires", desc: "Accedez a des professionnels verifies pres de chez vous." },
              { title: "Gratuit et sans engagement", desc: "Creez un compte et estimez sans frais caches." },
            ].map((f, i) => (
              <ScrollReveal key={f.title} direction="up" delay={i * 0.1}>
                <AnimatedCard className="feature-card" whileHover={{ scale: 1.03 }}>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </AnimatedCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-bg-animation">
          <div className="cta-bg-layer layer-1"></div>
          <div className="cta-bg-layer layer-2"></div>
          <div className="cta-bg-layer layer-3"></div>
        </div>
        <div className="cta-overlay"></div>

        <div className="cta-content">
          <h2>Pret a construire votre maison de reve ?</h2>
          <p>Rejoignez les milliers d'utilisateurs qui font confiance a SmartBuild.</p>

          <div className="cta-buttons">
            <AnimatedButton className="btn btn-primary" onClick={handleStart}>
              Commencer gratuitement
              <ArrowRight size={18} />
            </AnimatedButton>

            <AnimatedButton
              className="btn btn-outline"
              onClick={() => setIsDemoOpen(true)}
            >
              Voir la demo
            </AnimatedButton>
          </div>
        </div>
      </section>

      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
      />

    </div>
  );
}