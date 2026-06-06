import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 50,
  once = true,
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-50px" });

  const directionVariants = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, ...directionVariants[direction] },
        visible: { opacity: 1, x: 0, y: 0 },
      }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealCard({
  children,
  className,
  scale = 0.95,
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className={cn("rounded-lg border bg-card text-card-foreground shadow-md", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealList({
  children,
  className,
  staggerDelay = 0.1,
  direction = "up",
  distance = 30,
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const directionVariants = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, ...directionVariants[direction] },
                visible: { opacity: 1, x: 0, y: 0 },
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
            >
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
}

export function ScrollFade({
  children,
  className,
  delay = 0,
  ...props
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}