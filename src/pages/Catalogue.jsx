import React, { useRef } from "react";
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
  flipSound.play().catch((err) => console.log("Audio play blocked by browser", err));
}; 

const CoverPage = React.forwardRef((props, ref) => (
  <div className="page" ref={ref}>
    <div className="cover-page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', background: '#1e3a8a', color: 'white', padding: '20px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>SMARTBUILD</h1>
      <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Catalogue Immobilier</p>
    </div>
  </div>
));

const Page = React.forwardRef(({ item }, ref) => (
  <div className="page" ref={ref}>
    <div className="catalog-page" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <img src={item.image} alt={item.title} style={{ width: '100%', height: '60%', objectFit: 'cover' }} />
      <div className="page-content" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '10px', color: '#111827' }}>{item.title}</h2>
          <p style={{ color: '#4b5563', lineHeight: 1.5 }}>
            Découvrez cette propriété exceptionnelle disponible immédiatement.
          </p>
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{item.price}</span>
      </div>
    </div>
  </div>
));

export default function Catalogue() {
  const bookRef = useRef(null);

  return (
    <div className="catalogue-container">
      <div className="catalog-toolbar">
        <button onClick={() => bookRef.current?.pageFlip().flipPrev()}>Précédent</button>
        <button onClick={() => bookRef.current?.pageFlip().flipNext()}>Suivant</button>
      </div>
      <div className="book-wrapper">
        <HTMLFlipBook
          width={500}
          height={650}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          ref={bookRef}
        >
          <CoverPage />
          {pages.map((page, index) => (
            <Page key={index} item={page} />
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
}