const IMAGES = {
  terrain: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80',
    'https://images.unsplash.com/photo-1569952817893-2a8a9dfe9d65?w=400&q=80',
    'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=400&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80',
  ],
  equipement: [
    'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=80',
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80',
    'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&q=80',
    'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
  ],
  maison: [
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80',
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
  ],
  materiau: [
    'https://images.unsplash.com/photo-1597484661973-ee6cd0b6482c?w=400&q=80',
    'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&q=80',
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80',
    'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=400&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80',
  ],
};

const FALLBACK = 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80';

export function getImageProduit(produit, type) {
  if (produit?.image && produit.image.startsWith('http')) return produit.image;
  if (produit?.imageUrl && produit.imageUrl.startsWith('http')) return produit.imageUrl;
  if (produit?.photo && produit.photo.startsWith('http')) return produit.photo;
  if (produit?.images?.[0] && produit.images[0].startsWith('http')) return produit.images[0];

  const liste = IMAGES[type] || IMAGES.maison;
  const id = produit?._id || produit?.id || '';
  const index = id
    ? id.charCodeAt(id.length - 1) % liste.length
    : Math.floor(Math.random() * liste.length);

  return liste[index] || FALLBACK;
}
