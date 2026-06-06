import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedCard({
  children,
  className,
  hoverScale = 1.02,
  shadow = true,
  ...props
}) {
  return (
    <motion.div
      whileHover={{ scale: hoverScale }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        "rounded-lg border bg-card text-card-foreground",
        shadow && "shadow-md hover:shadow-lg transition-shadow",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCardHeader({ children, className, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function AnimatedCardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function AnimatedCardContent({ children, className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props}>{children}</div>;
}

export function AnimatedCardFooter({ children, className, ...props }) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props}>{children}</div>;
}