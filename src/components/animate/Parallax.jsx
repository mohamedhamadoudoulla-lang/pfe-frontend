import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

export function ParallaxCard({
  children,
  className,
  speed = 0.5,
  direction = "up",
  ...props
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const directionMultiplier = direction === "up" ? -1 : 1;
  const y = useTransform(scrollYProgress, [0, 1], [100 * speed * directionMultiplier, -100 * speed * directionMultiplier]);
  const x = useTransform(scrollYProgress, [0, 1], [50 * speed * directionMultiplier, -50 * speed * directionMultiplier]);

  return (
    <motion.div
      ref={ref}
      style={{ y, x }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxBackground({ children, className, speed = 0.3, ...props }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200 * speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={cn(className)} {...props}>
      {children}
    </motion.div>
  );
}