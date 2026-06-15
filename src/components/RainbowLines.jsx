import "./RainbowLines.css";

const variants = {
  // Login - lignes fines qui traversent en diagonale
  login: [
    { w: 200, t: 10, l: 80, r: 25, d: 0 },
    { w: 320, t: 30, l: 10, r: -15, d: 0.6 },
    { w: 150, t: 50, l: 75, r: 40, d: 1.2 },
    { w: 400, t: 70, l: 20, r: -10, d: 1.8 },
    { w: 250, t: 85, l: 60, r: 20, d: 2.4 },
  ],
  // Services - lignes longues et horizontales
  services: [
    { w: 500, t: 8, l: -50, r: 0, d: 0 },
    { w: 350, t: 22, l: 60, r: 5, d: 0.8 },
    { w: 600, t: 40, l: 10, r: -3, d: 1.6 },
    { w: 280, t: 55, l: 70, r: 8, d: 2.4 },
    { w: 450, t: 72, l: -30, r: -5, d: 3.2 },
    { w: 380, t: 88, l: 50, r: 2, d: 4 },
  ],
  // DevisWizard - lignes courtes dispersées
  devis: [
    { w: 120, t: 15, l: 85, r: 45, d: 0 },
    { w: 180, t: 28, l: 5, r: -20, d: 0.7 },
    { w: 100, t: 42, l: 80, r: 60, d: 1.4 },
    { w: 220, t: 58, l: 15, r: -35, d: 2.1 },
    { w: 150, t: 70, l: 75, r: 30, d: 2.8 },
    { w: 200, t: 82, l: 8, r: -10, d: 3.5 },
    { w: 140, t: 48, l: 50, r: 90, d: 4.2 },
  ],
  // Terrain/Localisation - lignes larges en vague
  terrain: [
    { w: 180, t: 12, l: 70, r: 35, d: 0 },
    { w: 300, t: 25, l: 20, r: -8, d: 0.9 },
    { w: 250, t: 38, l: 65, r: 12, d: 1.8 },
    { w: 200, t: 52, l: 10, r: -25, d: 2.7 },
    { w: 350, t: 65, l: 55, r: 5, d: 3.6 },
    { w: 220, t: 78, l: 30, r: -18, d: 4.5 },
  ],
  // Estimation - lignes épaisses
  estimation: [
    { w: 160, t: 18, l: 75, r: 50, d: 0 },
    { w: 280, t: 32, l: 15, r: -12, d: 0.8 },
    { w: 200, t: 48, l: 70, r: 25, d: 1.6 },
    { w: 350, t: 60, l: 25, r: -30, d: 2.4 },
    { w: 240, t: 75, l: 65, r: 15, d: 3.2 },
  ],
  // Quote/Devis final - grandes lignes croisées
  quote: [
    { w: 400, t: 5, l: 60, r: 40, d: 0 },
    { w: 300, t: 20, l: 30, r: -45, d: 0.7 },
    { w: 500, t: 40, l: 50, r: 10, d: 1.4 },
    { w: 350, t: 60, l: 20, r: -20, d: 2.1 },
    { w: 450, t: 80, l: 55, r: 35, d: 2.8 },
  ],
  // Finition - petites lignes subtiles
  finition: [
    { w: 100, t: 20, l: 80, r: 70, d: 0 },
    { w: 150, t: 35, l: 10, r: -40, d: 0.6 },
    { w: 120, t: 55, l: 85, r: 50, d: 1.2 },
    { w: 200, t: 70, l: 15, r: -25, d: 1.8 },
    { w: 140, t: 85, l: 75, r: 30, d: 2.4 },
    { w: 180, t: 45, l: 50, r: 80, d: 3 },
  ],
  // PostProject - lignes courbes (approximées par des rotations)
  postproject: [
    { w: 220, t: 10, l: 70, r: 55, d: 0 },
    { w: 180, t: 22, l: 15, r: -30, d: 0.9 },
    { w: 300, t: 35, l: 60, r: 20, d: 1.8 },
    { w: 160, t: 50, l: 10, r: -15, d: 2.7 },
    { w: 250, t: 65, l: 75, r: 45, d: 3.6 },
    { w: 200, t: 80, l: 25, r: -5, d: 4.5 },
  ],
  // ChooseEngineer - lignes longues croisées
  chooseEngineer: [
    { w: 350, t: 10, l: 20, r: 35, d: 0 },
    { w: 250, t: 25, l: 65, r: -20, d: 0.8 },
    { w: 400, t: 40, l: 10, r: 15, d: 1.6 },
    { w: 200, t: 55, l: 80, r: -40, d: 2.4 },
    { w: 300, t: 70, l: 30, r: 25, d: 3.2 },
    { w: 350, t: 85, l: 60, r: -10, d: 4 },
  ],
  // EngineerProfile - lignes verticales (h > w)
  engineerProfile: [
    { w: 60, t: 10, l: 80, r: 85, d: 0 },
    { w: 80, t: 25, l: 5, r: -80, d: 0.7 },
    { w: 50, t: 40, l: 85, r: 90, d: 1.4 },
    { w: 70, t: 55, l: 10, r: -85, d: 2.1 },
    { w: 90, t: 70, l: 80, r: 80, d: 2.8 },
    { w: 60, t: 85, l: 15, r: -75, d: 3.5 },
  ],
  // Recommandation matériaux - lignes solides et stables
  recommandation: [
    { w: 300, t: 8, l: 50, r: 30, d: 0 },
    { w: 250, t: 22, l: 20, r: -15, d: 0.6 },
    { w: 350, t: 38, l: 60, r: 10, d: 1.2 },
    { w: 200, t: 52, l: 10, r: -25, d: 1.8 },
    { w: 280, t: 65, l: 70, r: 40, d: 2.4 },
    { w: 400, t: 80, l: 30, r: -5, d: 3 },
  ],
  // Marketplace ameublement - lignes décoratives aérées
  marketplace: [
    { w: 180, t: 12, l: 75, r: 55, d: 0 },
    { w: 250, t: 28, l: 15, r: -20, d: 0.7 },
    { w: 200, t: 42, l: 70, r: 35, d: 1.4 },
    { w: 300, t: 58, l: 25, r: -10, d: 2.1 },
    { w: 220, t: 72, l: 65, r: 25, d: 2.8 },
    { w: 280, t: 85, l: 20, r: -15, d: 3.5 },
  ],
};

export default function RainbowLines({ variant = "login", opacity = 0.08 }) {
  const lines = variants[variant] || variants.login;

  return (
    <div className="rl-global" style={{ opacity }}>
      {lines.map((line, i) => (
        <div
          key={i}
          className="rl-item"
          style={{
            width: line.w,
            top: `${line.t}%`,
            left: `${line.l}%`,
            rotate: `${line.r}deg`,
            animationDelay: `${line.d}s`,
          }}
        />
      ))}
    </div>
  );
}
