import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ArrowRight, ChevronDown, Star, Quote, FileText, Calendar, Shield, Zap, Users, PenTool, Newspaper } from "lucide-react";

import DemoModal from "../components/DemoModal";
import ServicesSection from "../components/ServicesSection";
import { AnimatedButton, AnimatedCard, ScrollReveal } from "@/components/animate";

import "./Home.css";

const testimonials = [
  { name: "Sami Ben Ahmed", role: "Propriétaire, Tunis", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80", text: "SmartBuild m'a fait gagner un temps précieux dans l'estimation de ma construction. Le devis était précis et j'ai pu trouver un ingénieur en quelques clics.", rating: 5 },
  { name: "Nadia Kacem", role: "Architecte, Sfax", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", text: "Une plateforme exceptionnelle pour les professionnels du bâtiment. La mise en relation avec les clients est fluide et professionnelle.", rating: 5 },
  { name: "Mehdi Jellali", role: "Investisseur, Sousse", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80", text: "J'ai utilisé SmartBuild pour estimer le budget de 3 projets. L'outil de devis m'a aidé à comparer les finitions et à optimiser mes coûts.", rating: 4 },
  { name: "Ines Bouaziz", role: "Propriétaire, Monastir", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80", text: "Grâce à SmartBuild, j'ai pu planifier mon budget construction et ameublement avant même de commencer les travaux. Très utile !", rating: 5 },
];

const blogPosts = [
  { image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&q=80", title: "Les tendances construction 2026 en Tunisie", excerpt: "Découvrez les nouvelles tendances éco-responsables et les matériaux innovants qui façonnent le secteur du bâtiment.", date: "10 Juin 2026", tag: "Construction" },
  { image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80", title: "Comment estimer son budget ameublement ?", excerpt: "Guide complet pour évaluer le coût de l'ameublement pièce par pièce selon vos goûts et votre budget.", date: "2 Juin 2026", tag: "Ameublement" },
  { image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80", title: "Acheter un terrain : les points clés", excerpt: "Les critères essentiels à vérifier avant d'acheter un terrain constructible en Tunisie.", date: "25 Mai 2026", tag: "Terrain" },
];

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
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleStart = () => navigate(user ? "/devis-wizard" : "/login");

  const nextTestimonial = () => setTestimonialIdx((i) => (i + 1) % testimonials.length);
  const prevTestimonial = () => setTestimonialIdx((i) => (i - 1 + testimonials.length) % testimonials.length);

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
              { icon: Calendar, title: "Suivi de projet", desc: "Planifiez et suivez l'avancement de votre projet étape par étape.", color: "#ec4899" },
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

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="testimonials-section">
        <div className="section-container">
          <ScrollReveal direction="up">
            <div className="section-header">
              <span className="section-tag">Témoignages</span>
              <h2>Ce que disent nos clients</h2>
              <p>Des milliers d'utilisateurs nous font confiance</p>
            </div>
          </ScrollReveal>

          <div className="testimonials-carousel">
            <div className="testimonial-card">
              <Quote size={32} className="testimonial-quote-icon" />
              <div className="testimonial-stars">
                {Array.from({ length: testimonials[testimonialIdx].rating }).map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonials[testimonialIdx].text}"</p>
              <div className="testimonial-author">
                <img src={testimonials[testimonialIdx].image} alt={testimonials[testimonialIdx].name} />
                <div>
                  <strong>{testimonials[testimonialIdx].name}</strong>
                  <span>{testimonials[testimonialIdx].role}</span>
                </div>
              </div>
            </div>
            <div className="testimonial-controls">
              <button onClick={prevTestimonial} className="testimonial-arrow" aria-label="Précédent">
                <ArrowRight size={18} style={{ transform: "rotate(180deg)" }} />
              </button>
              <div className="testimonial-dots">
                {testimonials.map((_, i) => (
                  <span key={i} className={`dot ${i === testimonialIdx ? "active" : ""}`} onClick={() => setTestimonialIdx(i)} />
                ))}
              </div>
              <button onClick={nextTestimonial} className="testimonial-arrow" aria-label="Suivant">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ BLOG ═══════════════ */}
      <section className="blog-section">
        <div className="section-container">
          <ScrollReveal direction="up">
            <div className="section-header">
              <span className="section-tag"><Newspaper size={14} /> Blog & Actualités</span>
              <h2>Conseils et tendances</h2>
              <p>Restez informé des dernières tendances en construction et ameublement</p>
            </div>
          </ScrollReveal>

          <div className="blog-grid">
            {blogPosts.map((post, i) => (
              <ScrollReveal key={post.title} direction="up" delay={i * 0.1}>
                <AnimatedCard className="blog-card" whileHover={{ scale: 1.02 }}>
                  <div className="blog-image" style={{ backgroundImage: `url(${post.image})` }}>
                    <span className="blog-tag">{post.tag}</span>
                  </div>
                  <div className="blog-body">
                    <span className="blog-date">{post.date}</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <Link to="/catalogue" className="blog-link">
                      Lire l'article <ArrowRight size={14} />
                    </Link>
                  </div>
                </AnimatedCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

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

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="cta-section">
        <div className="cta-bg-animation">
          <div className="cta-bg-layer layer-1"></div>
          <div className="cta-bg-layer layer-2"></div>
          <div className="cta-bg-layer layer-3"></div>
        </div>
        <div className="cta-overlay"></div>

        <div className="cta-content">
          <h2>Prêt à construire votre maison de rêve ?</h2>
          <p>Rejoignez les milliers d'utilisateurs qui font confiance à SmartBuild.</p>

          <div className="cta-buttons">
            <AnimatedButton className="btn btn-primary" onClick={handleStart}>
              Obtenir un devis gratuit
              <ArrowRight size={18} />
            </AnimatedButton>
            <AnimatedButton className="btn btn-outline" onClick={() => setIsDemoOpen(true)}>
              Voir la démo
            </AnimatedButton>
          </div>
        </div>
      </section>

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" />
    </div>
  );
}
