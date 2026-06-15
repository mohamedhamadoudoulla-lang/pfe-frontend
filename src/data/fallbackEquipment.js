const ECONOMIQUE = [
  { _id: "fe-1", name: "Carrelage standard 33x33", category: "carrelage", price: 1800, image: "", description: "Carrelage grès cérame aspect marbre" },
  { _id: "fe-2", name: "Peinture mate blanc", category: "peinture", price: 600, image: "", description: "Peinture acrylique blanche mate" },
  { _id: "fe-3", name: "Porte intérieure alvéolaire", category: "portes_interieures", price: 2500, image: "", description: "Porte alvéolaire laquée blanc" },
  { _id: "fe-4", name: "Porte extérieure acier", category: "portes_exterieures", price: 3200, image: "", description: "Porte blindée acier avec serrure" },
  { _id: "fe-5", name: "Fenêtre PVC standard", category: "fenetres", price: 4200, image: "", description: "Fenêtre PVC blanc double vitrage" },
  { _id: "fe-6", name: "Cuisine économique", category: "cuisine", price: 5500, image: "", description: "Cuisine économique stratifiée" },
  { _id: "fe-7", name: "Sanitaire standard", category: "sanitaires", price: 3200, image: "", description: "WC suspendu + lavabo standard" },
  { _id: "fe-8", name: "Câblage électrique", category: "electricite", price: 3800, image: "", description: "Câblage électrique complet" },
  { _id: "fe-9", name: "Points lumineux", category: "eclairage", price: 1200, image: "", description: "Points lumineux avec interrupteurs" },
  { _id: "fe-10", name: "Tuyauterie PVC", category: "plomberie", price: 2800, image: "", description: "Tuyauterie complète eau chaude/froide" },
  { _id: "fe-11", name: "Faux plafond standard", category: "faux_plafond", price: 2400, image: "", description: "Faux plafond en placoplâtre" },
  { _id: "fe-12", name: "Revêtement mural", category: "revetements", price: 1600, image: "", description: "Revêtement mural économique" },
  { _id: "fe-13", name: "Menuiserie standard", category: "menuiserie", price: 3500, image: "", description: "Menuiserie bois standard" },
];

const STANDARD = [
  { _id: "fs-1", name: "Carrelage grès cérame 45x45", category: "carrelage", price: 3200, image: "", description: "Carrelage grès cérame aspect bois" },
  { _id: "fs-2", name: "Peinture velours blanc", category: "peinture", price: 1200, image: "", description: "Peinture velours lessivable" },
  { _id: "fs-3", name: "Porte intérieure laquée", category: "portes_interieures", price: 4500, image: "", description: "Porte laquée blanche MDF" },
  { _id: "fs-4", name: "Porte extérieure bois", category: "portes_exterieures", price: 5200, image: "", description: "Porte bois massif avec vitrage" },
  { _id: "fs-5", name: "Fenêtre PVC double vitrage", category: "fenetres", price: 6800, image: "", description: "Fenêtre PVC double vitrage 4/16/4" },
  { _id: "fs-6", name: "Cuisine standard mélaminé", category: "cuisine", price: 9500, image: "", description: "Cuisine mélaminé plan de travail" },
  { _id: "fs-7", name: "Sanitaire standard chromé", category: "sanitaires", price: 5500, image: "", description: "Sanitaire chromé avec meuble" },
  { _id: "fs-8", name: "Câblage électrique renforcé", category: "electricite", price: 5800, image: "", description: "Câblage électrique avec disjoncteurs" },
  { _id: "fs-9", name: "Éclairage LED", category: "eclairage", price: 2400, image: "", description: "Points lumineux LED intégrés" },
  { _id: "fs-10", name: "Plomberie cuivre", category: "plomberie", price: 4500, image: "", description: "Plomberie cuivre avec raccords" },
  { _id: "fs-11", name: "Faux plafond modulable", category: "faux_plafond", price: 4200, image: "", description: "Faux plafond modulable phonique" },
  { _id: "fs-12", name: "Revêtement stratifié", category: "revetements", price: 2800, image: "", description: "Revêtement stratifié aspect bois" },
  { _id: "fs-13", name: "Menuiserie bois massif", category: "menuiserie", price: 5500, image: "", description: "Menuiserie bois massif vernis" },
  { _id: "fs-14", name: "Climatisation réversible", category: "climatisation", price: 6500, image: "", description: "Climatiseur réversible 9000 BTU" },
];

const HAUT_DE_GAMME = [
  { _id: "fh-1", name: "Carrelage grand format 60x120", category: "carrelage", price: 6800, image: "", description: "Carrelage grès cérame aspect marbre" },
  { _id: "fh-2", name: "Peinture décorative", category: "peinture", price: 2800, image: "", description: "Peinture décorative effet satiné" },
  { _id: "fh-3", name: "Porte intérieure vitrée", category: "portes_interieures", price: 7500, image: "", description: "Porte en verre trempé laqué" },
  { _id: "fh-4", name: "Porte extérieure blindée", category: "portes_exterieures", price: 9500, image: "", description: "Porte blindée haute sécurité" },
  { _id: "fh-5", name: "Fenêtre aluminium thermique", category: "fenetres", price: 12000, image: "", description: "Fenêtre aluminium rupture thermique" },
  { _id: "fh-6", name: "Cuisine haut de gamme", category: "cuisine", price: 18500, image: "", description: "Cuisine sur mesure stratifié laqué" },
  { _id: "fh-7", name: "Sanitaire design", category: "sanitaires", price: 9800, image: "", description: "Sanitaire design vitrifié chromé" },
  { _id: "fh-8", name: "Installation électrique complète", category: "electricite", price: 8500, image: "", description: "Installation électrique domotique" },
  { _id: "fh-9", name: "Éclairage encastré LED", category: "eclairage", price: 4500, image: "", description: "Éclairage encastré LED design" },
  { _id: "fh-10", name: "Plomberie cuivre renforcée", category: "plomberie", price: 7200, image: "", description: "Plomberie cuivre multicouche" },
  { _id: "fh-11", name: "Faux plafond design", category: "faux_plafond", price: 6800, image: "", description: "Faux plafond design acoustique" },
  { _id: "fh-12", name: "Revêtement bois massif", category: "revetements", price: 5500, image: "", description: "Revêtement bois massif parquet" },
  { _id: "fh-13", name: "Menuiserie sur mesure", category: "menuiserie", price: 9500, image: "", description: "Menuiserie sur mesure bois exotique" },
  { _id: "fh-14", name: "Climatisation centrale", category: "climatisation", price: 12500, image: "", description: "Climatisation centrale gainable" },
];

export const FALLBACK_EQUIPMENT = {
  économique: ECONOMIQUE,
  standard: STANDARD,
  "haut de gamme": HAUT_DE_GAMME,
};
