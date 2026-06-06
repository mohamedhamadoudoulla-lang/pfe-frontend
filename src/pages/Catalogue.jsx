import HTMLFlipBook from "react-pageflip";
import "./Catalogue.css";

const pages = [
  {
    title: "Villa Moderne",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
    price: "650 000 DT",
  },
  {
    title: "Villa Luxe",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200",
    price: "1 200 000 DT",
  },
  {
    title: "Appartement Lac 2",
    image:
      "https://images.unsplash.com/photo-1605146769289-440cc1133d00?w=1200",
    price: "420 000 DT",
  },
]; 
const flipSound = new Audio("/sounds/page-flip.mp3");

const onFlip = () => {
  flipSound.currentTime = 0;
  flipSound.play();
}; 
const CoverPage = () => (
  <div className="cover-page">
    <h1>SMARTBUILD</h1>
    <p>Catalogue Immobilier</p>
  </div>
); 
const Page = ({ item }) => (
  <div className="catalog-page">
    <img src={item.image} alt="" />

    <div className="page-content">
      <h2>{item.title}</h2>

      <p>
        Découvrez cette propriété exceptionnelle
        disponible immédiatement.
      </p>

      <span>{item.price}</span>
    </div>
  </div>
);