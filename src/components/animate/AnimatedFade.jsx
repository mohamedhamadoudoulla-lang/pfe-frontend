import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedFade({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.5,
  distance = 30,
  ...props
}) {
  const directionVariants = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  const variants = {
    hidden: { opacity: 0, ...directionVariants[direction] },
    visible: { opacity: 1, x: 0, y: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration, delay }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedStagger({
  children,
  className,
  staggerDelay = 0.1,
  initialDelay = 0,
  ...props
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          },
        },
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedStaggerItem({
  children,
  className,
  direction = "up",
  distance = 20,
  ...props
}) {
  const directionVariants = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, ...directionVariants[direction] },
        visible: { opacity: 1, x: 0, y: 0 },
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}