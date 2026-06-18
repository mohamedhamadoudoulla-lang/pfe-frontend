const ECONOMIQUE = [
  { _id: "fe-1", name: "Carrelage standard 33x33", category: "carrelage", price: 1800, image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&q=80", description: "Carrelagegres cerame aspect marbre" },
  { _id: "fe-2", name: "Peinture mate blanc", category: "peinture", price: 600, image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80", description: "Peinture acrylique blanche mate" },
  { _id: "fe-3", name: "Porte interieure alveolaire", category: "portes_interieures", price: 2500, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", description: "Porte alveolaire laquee blanc" },
  { _id: "fe-4", name: "Porte exterieure acier", category: "portes_exterieures", price: 3200, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", description: "Porte blindee acier avec serrure" },
  { _id: "fe-5", name: "Fenetre PVC standard", category: "fenetres", price: 4200, image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=400&q=80", description: "Fenetre PVC blanc double vitrage" },
  { _id: "fe-6", name: "Cuisine economique", category: "cuisine", price: 5500, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", description: "Cuisine economique stratifiee" },
  { _id: "fe-7", name: "Sanitaire standard", category: "sanitaires", price: 3200, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80", description: "WC suspendu + lavabo standard" },
  { _id: "fe-8", name: "Cablage electrique", category: "electricite", price: 3800, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80", description: "Cablage electrique complet" },
  { _id: "fe-9", name: "Points lumineux", category: "eclairage", price: 1200, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", description: "Points lumineux avec interrupteurs" },
  { _id: "fe-10", name: "Tuyauterie PVC", category: "plomberie", price: 2800, image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80", description: "Tuyauterie complete eau chaude/froide" },
  { _id: "fe-11", name: "Faux plafond standard", category: "faux_plafond", price: 2400, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80", description: "Faux plafond en placoplatre" },
  { _id: "fe-12", name: "Revetement mural", category: "revetements", price: 1600, image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&q=80", description: "Revetement mural economique" },
  { _id: "fe-13", name: "Menuiserie standard", category: "menuiserie", price: 3500, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", description: "Menuiserie bois standard" },
];

const STANDARD = [
  { _id: "fs-1", name: "Carrelagegres cerame 45x45", category: "carrelage", price: 3200, image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&q=80", description: "Carrelagegres cerame aspect bois" },
  { _id: "fs-2", name: "Peinture velours blanc", category: "peinture", price: 1200, image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80", description: "Peinture velours lessivable" },
  { _id: "fs-3", name: "Porte interieure laquee", category: "portes_interieures", price: 4500, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", description: "Porte laquee blanche MDF" },
  { _id: "fs-4", name: "Porte exterieure bois", category: "portes_exterieures", price: 5200, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", description: "Porte bois massif avec vitrage" },
  { _id: "fs-5", name: "Fenetre PVC double vitrage", category: "fenetres", price: 6800, image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=400&q=80", description: "Fenetre PVC double vitrage 4/16/4" },
  { _id: "fs-6", name: "Cuisine standard melamine", category: "cuisine", price: 9500, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", description: "Cuisine melamine plan de travail" },
  { _id: "fs-7", name: "Sanitaire standard chrome", category: "sanitaires", price: 5500, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80", description: "Sanitaire chrome avec meuble" },
  { _id: "fs-8", name: "Cablage electrique renforce", category: "electricite", price: 5800, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80", description: "Cablage electrique avec disjoncteurs" },
  { _id: "fs-9", name: "Eclairage LED", category: "eclairage", price: 2400, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", description: "Points lumineux LED integres" },
  { _id: "fs-10", name: "Plomberie cuivre", category: "plomberie", price: 4500, image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80", description: "Plomberie cuivre avec raccords" },
  { _id: "fs-11", name: "Faux plafond modulable", category: "faux_plafond", price: 4200, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80", description: "Faux plafond modulable phonique" },
  { _id: "fs-12", name: "Revetement stratifie", category: "revetements", price: 2800, image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&q=80", description: "Revetement stratifie aspect bois" },
  { _id: "fs-13", name: "Menuiserie bois massif", category: "menuiserie", price: 5500, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", description: "Menuiserie bois massif vernis" },
  { _id: "fs-14", name: "Climatisation reversible", category: "climatisation", price: 6500, image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80", description: "Climatiseur reversible 9000 BTU" },
];

const HAUT_DE_GAMME = [
  { _id: "fh-1", name: "Carrelage grand format 60x120", category: "carrelage", price: 6800, image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&q=80", description: "Carrelagegres cerame aspect marbre" },
  { _id: "fh-2", name: "Peinture decorative", category: "peinture", price: 2800, image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400&q=80", description: "Peinture decorative effet satine" },
  { _id: "fh-3", name: "Porte interieure vitree", category: "portes_interieures", price: 7500, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", description: "Porte en verre trempe laque" },
  { _id: "fh-4", name: "Porte exterieure blindee", category: "portes_exterieures", price: 9500, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", description: "Porte blindee haute securite" },
  { _id: "fh-5", name: "Fenetre aluminium thermique", category: "fenetres", price: 12000, image: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?w=400&q=80", description: "Fenetre aluminium rupture thermique" },
  { _id: "fh-6", name: "Cuisine haut de gamme", category: "cuisine", price: 18500, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", description: "Cuisine sur mesure stratifie laque" },
  { _id: "fh-7", name: "Sanitaire design", category: "sanitaires", price: 9800, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80", description: "Sanitaire design vitrifie chrome" },
  { _id: "fh-8", name: "Installation electrique complete", category: "electricite", price: 8500, image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&q=80", description: "Installation electrique domotique" },
  { _id: "fh-9", name: "Eclairage encastré LED", category: "eclairage", price: 4500, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80", description: "Eclairage encastré LED design" },
  { _id: "fh-10", name: "Plomberie cuivre renforcee", category: "plomberie", price: 7200, image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&q=80", description: "Plomberie cuivre multicouche" },
  { _id: "fh-11", name: "Faux plafond design", category: "faux_plafond", price: 6800, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80", description: "Faux plafond design acoustique" },
  { _id: "fh-12", name: "Revetement bois massif", category: "revetements", price: 5500, image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400&q=80", description: "Revetement bois massif parquet" },
  { _id: "fh-13", name: "Menuiserie sur mesure", category: "menuiserie", price: 9500, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", description: "Menuiserie sur mesure bois exotique" },
  { _id: "fh-14", name: "Climatisation centrale", category: "climatisation", price: 12500, image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80", description: "Climatisation centrale gainable" },
];

export const FALLBACK_EQUIPMENT = {
  économique: ECONOMIQUE,
  standard: STANDARD,
  "haut de gamme": HAUT_DE_GAMME,
};
