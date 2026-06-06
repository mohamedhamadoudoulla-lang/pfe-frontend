import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop({
  threshold = 300,
  className,
  size = 48,
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ scale: 0, opacity: 0, rotate: -180 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, rotate: 180 }}
          whileHover={{ scale: 1.2, rotate: 360 }}
          whileTap={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg cursor-pointer",
            className
          )}
          style={{ width: size, height: size }}
          {...props}
        >
          <ChevronUp size={size * 0.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function BounceOnScroll({ children, className, bounceScale = 1.1, ...props }) {
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll && currentScroll > 100) {
        setBouncing(true);
        setTimeout(() => setBouncing(false), 300);
      }
      lastScroll = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      animate={{ scale: bouncing ? bounceScale : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function WobbleOnScroll({ children, className, ...props }) {
  const [wobble, setWobble] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setWobble(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      animate={{
        rotate: wobble ? [0, -5, 5, -5, 5, 0] : 0,
        scale: wobble ? [1, 1.05, 1] : 1,
      }}
      transition={{ duration: 0.5 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}