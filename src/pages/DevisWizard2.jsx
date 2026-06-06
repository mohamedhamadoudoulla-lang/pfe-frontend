import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatedButton } from "@/components/animate";
import { ArrowLeft } from "lucide-react";
import "./DevisWizard2.css";

const STEPS = [
  {
    id: 2,
    label: "Etape 2",
    question: "Quelle est la prestation souhaitée ?",
    subtitle: "Sélectionnez le niveau de réalisation que vous souhaitez",
    options: [
      { value: "cle_en_main",  label: "Maison livrée clé en main",      icon: "🏠", desc: "Construction complète, prête à habiter" },
      { value: "hors_eau_air", label: "Maison livrée hors eau hors air", icon: "🧱", desc: "Structure + toiture + menuiseries" },
      { value: "gros_oeuvre",  label: "Gros œuvre uniquement",          icon: "🏗️", desc: "Fondations, murs porteurs et dalles" },
      { value: "autre",        label: "Autre",                          icon: "📋", desc: "Prestation personnalisée à définir" },
    ],
  },
  {
    id: 3,
    label: "Etape 3",
    question: "Quel est le type de maison souhaité ?",
    subtitle: "Le type influence le coût de construction",
    options: [
      { value: "plain_pied", label: "Maison de plain-pied", icon: "🏡", desc: "Pas d'étage, plain-pied (RDC)" },
      { value: "avec_etage", label: "Maison avec étage(s)", icon: "🏢", desc: "R+1, R+2 ou plus" },
      { value: "non_defini", label: "Non défini",           icon: "❓", desc: "Je ne sais pas encore" },
    ],
  },
  {
    id: 4,
    label: "Etape 4",
    question: "Quel est le type de construction souhaité ?",
    subtitle: "Le matériau principal de construction",
    options: [
      { value: "traditionnelle", label: "Traditionnelle (parpaing)", icon: "🧱", desc: "Construction classique en parpaing" },
      { value: "brique",         label: "En brique",                 icon: "🔶", desc: "Construction en brique monomur" },
      { value: "ossature_bois",  label: "Ossature bois",             icon: "🪵", desc: "Structure en bois, écologique" },
      { value: "monomur",        label: "Monomur",                   icon: "⬜", desc: "Blocs isolants haute performance" },
      { value: "bioclimatique",  label: "Bioclimatique",             icon: "🌿", desc: "Optimisée pour l'énergie solaire" },
      { value: "ecologique",     label: "Ecologique",                icon: "♻️", desc: "Matériaux naturels et durables" },
      { value: "non_defini",     label: "Non défini",                icon: "❓", desc: "À définir avec l'ingénieur" },
      { value: "autre",          label: "Autre",                     icon: "📋", desc: "Type de construction spécifique" },
    ],
  },
  {
    id: 5,
    label: "Etape 5",
    question: "Quel niveau de finition souhaitez-vous ?",
    subtitle: "Chaque niveau inclut les caractéristiques maison et équipements correspondants",
    options: [
      { value: "économique",    label: "Économique",    icon: "💚", desc: "Matériaux standards, budget maîtrisé — ~600 DT/m²" },
      { value: "standard",      label: "Standard",      icon: "💛", desc: "Bon rapport qualité/prix — ~900 DT/m²" },
      { value: "haut de gamme", label: "Haut de gamme", icon: "💎", desc: "Matériaux premium, finitions soignées — ~1400 DT/m²" },
    ],
  },
];

const FINITION_ROUTES = {
  "économique":    "/finition/economique",
  "standard":      "/finition/standard",
  "haut de gamme": "/finition/haut-de-gamme",
};

const STEP_PROGRESS = {
  2: 40,
  3: 55,
  4: 70,
  5: 85,
};

export default function DevisWizard2() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState(location.state?.answers || {});

  const step = STEPS[currentStep];
  const progress = STEP_PROGRESS[step.id];

  const handleSelectOption = (value) => {
    setSelected(value);
  };

  const handleNext = () => {
    if (!selected) return;

    const newAnswers = { ...answers, [step.id]: selected };
    setAnswers(newAnswers);

    if (step.id === 5) {
      const route = FINITION_ROUTES[selected] || "/finition/standard";
      navigate(route, {
        state: { 
          fromWizard: true, 
          answers: newAnswers, 
          finitionLevel: selected,
          terrain: location.state?.terrain,
          terrainInput: location.state?.terrainInput,
        },
      });
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelected(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelected(answers[STEPS[currentStep - 1]?.id] || null);
    } else {
      navigate("/devis-wz");
    }
  };

  return (
    <div className="wizard-container">
      <header className="wiz-header">
        <div className="wiz-logo">🏠 SmartBuild</div>
        <div className="wiz-step-indicator">{step.label} / 5</div>
      </header>

      <main className="wiz-main">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          <span className="progress-text">{progress}%</span>
        </div>
        <img 
   src="/images/Questions-rafiki.svg"
   alt="terrain estimation illustration"
   className="hero-image"
 />

        <div className="wiz-content">
          <h1 className="wiz-question">{step.question}</h1>
          <p className="wiz-subtitle">{step.subtitle}</p>

          <div className="options-container">
            {step.options.map((option) => (
              <button
                key={option.value}
                className={`option-card ${selected === option.value ? "selected" : ""}`}
                onClick={() => handleSelectOption(option.value)}
              >
                <div className="option-icon">{option.icon}</div>
                <div className="option-text">
                  <h3 className="option-label">{option.label}</h3>
                  <p className="option-desc">{option.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="wiz-footer">
          <button 
            className="btn-back"
            onClick={handleBack}
          >
            ← Revenir
          </button>
          <button 
            className="btn-next"
            onClick={handleNext}
            disabled={!selected}
          >
            Suivant →
          </button>
        </div>
      </main>
    </div>
  );
}