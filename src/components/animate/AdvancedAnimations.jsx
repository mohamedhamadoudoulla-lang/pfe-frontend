import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedCounter({
  value = 0,
  className,
  duration = 2,
  suffix = "",
  prefix = "",
  ...props
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const motionValue = useTransform(scrollYProgress, [0, 1], [0, value]);
  const springValue = useSpring(motionValue, { stiffness: 100, damping: 30 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    return springValue.on("change", (v) => setDisplayValue(Math.round(v)));
  }, [springValue]);

  return (
    <motion.span ref={ref} className={cn("inline-block", className)} {...props}>
      {prefix}{displayValue}{suffix}
    </motion.span>
  );
}

import { useState, useEffect } from "react";

export function TypewriterText({
  text,
  className,
  speed = 50,
  delay = 0,
  ...props
}) {
  const [displayText, setDisplayText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    const element = document.querySelector(`[data-typewriter="${text}"]`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [text, started]);

  useEffect(() => {
    if (!started) return;

    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay, started]);

  return (
    <span data-typewriter={text} className={cn(className)} {...props}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-[2px] h-[1em] bg-current ml-1"
      />
    </span>
  );
}

export function FlipText({ children, className, delay = 0, ...props }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.span
      ref={ref}
      initial={{ rotateX: 90, opacity: 0 }}
      animate={isInView ? { rotateX: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      style={{ display: "inline-block", transformPerspective: 1000 }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.span>
  );
}

import { useInView } from "framer-motion";

export function ShimmerText({ children, className, ...props }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      className={cn("relative inline-block", className)}
      {...props}
    >
      <motion.span
        animate={{
          backgroundPosition: ["200% center", "-200% center"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          backgroundSize: "200% auto",
          backgroundImage: "linear-gradient(90deg, #aa3bff 0%, #c084fc 50%, #aa3bff 100%)",
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

export function NeonGlow({ children, className, color = "#aa3bff", ...props }) {
  return (
    <motion.span
      animate={{
        textShadow: [
          `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
          `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}`,
          `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.span>
  );
}

export function BounceIn({ children, className, delay = 0, ...props }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 10, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ children, className, direction = "left", delay = 0, distance = 100, ...props }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const directionMap = {
    left: { x: -distance },
    right: { x: distance },
    up: { y: distance },
    down: { y: -distance },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ElasticIn({ children, className, delay = 0, ...props }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 200, damping: 10, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function PulseGlow({ children, className, color = "#aa3bff", ...props }) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 5px ${color}, 0 0 10px ${color}`,
          `0 0 20px ${color}, 0 0 40px ${color}`,
          `0 0 5px ${color}, 0 0 10px ${color}`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RotateIn({ children, className, delay = 0, angle = 360, ...props }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ rotate: angle, scale: 0, opacity: 0 }}
      animate={isInView ? { rotate: 0, scale: 1, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}