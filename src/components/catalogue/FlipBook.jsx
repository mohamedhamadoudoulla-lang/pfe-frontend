import React, { useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { cataloguePages } from "../../data/catalogueData";
import CoverPage from "./CoverPage";
import SummaryPage from "./SummaryPage";
import ServicePage from "./ServicePage";
import QuotePage from "./QuotePage";

const GOLD = "#D4AF37";

const PageWrapper = React.forwardRef(({ children }, ref) => (
  <div ref={ref} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
    {children}
  </div>
));

export default function FlipBook() {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const goNext = () => bookRef.current?.pageFlip().flipNext();
  const goPrev = () => bookRef.current?.pageFlip().flipPrev();

  const onPage = (e) => {
    setCurrentPage(e.data);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Navigation toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={goPrev}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: `1.5px solid rgba(212,175,55,.3)`,
            background: "rgba(255,255,255,.05)",
            color: GOLD,
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(212,175,55,.15)";
            e.currentTarget.style.borderColor = GOLD;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,.05)";
            e.currentTarget.style.borderColor = "rgba(212,175,55,.3)";
          }}
        >
          &#8249;
        </button>

        <span
          style={{
            fontFamily: "sans-serif",
            fontSize: "12px",
            color: "#888",
            letterSpacing: "2px",
          }}
        >
          {currentPage + 1} / {totalPages || "..."}
        </span>

        <button
          onClick={goNext}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: `1.5px solid rgba(212,175,55,.3)`,
            background: "rgba(255,255,255,.05)",
            color: GOLD,
            fontSize: "18px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(212,175,55,.15)";
            e.currentTarget.style.borderColor = GOLD;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,.05)";
            e.currentTarget.style.borderColor = "rgba(212,175,55,.3)";
          }}
        >
          &#8250;
        </button>
      </div>

      {/* FlipBook */}
      <HTMLFlipBook
        width={550}
        height={700}
        size="stretch"
        minWidth={350}
        maxWidth={1000}
        minHeight={500}
        maxHeight={1200}
        showCover={true}
        mobileScrollSupport={true}
        drawShadow={true}
        flippingTime={1000}
        usePortrait={true}
        startPage={0}
        onFlip={onPage}
        ref={bookRef}
        style={{ margin: "0 auto" }}
      >
        {cataloguePages.map((page, index) => (
          <PageWrapper key={index}>
            {page.type === "cover" && <CoverPage data={page} />}
            {page.type === "summary" && <SummaryPage data={page} />}
            {page.type === "service" && (
              <ServicePage data={page} pageNum={index + 1} />
            )}
            {page.type === "contact" && <QuotePage data={page} />}
          </PageWrapper>
        ))}
      </HTMLFlipBook>

      {/* Dot indicators */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "6px",
          marginTop: "16px",
        }}
      >
        {cataloguePages.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === currentPage ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              background: i === currentPage ? GOLD : "rgba(212,175,55,.2)",
              transition: "all 0.3s",
              cursor: "pointer",
            }}
            onClick={() => {
              const diff = i - currentPage;
              if (diff > 0) {
                for (let j = 0; j < diff; j++) {
                  setTimeout(() => bookRef.current?.pageFlip().flipNext(), j * 100);
                }
              } else if (diff < 0) {
                for (let j = 0; j < Math.abs(diff); j++) {
                  setTimeout(() => bookRef.current?.pageFlip().flipPrev(), j * 100);
                }
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
