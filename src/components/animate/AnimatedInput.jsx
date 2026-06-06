import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedInput({
  className,
  focusScale = 1.02,
  focusRing = true,
  ...props
}) {
  return (
    <motion.input
      whileFocus={{ scale: focusScale }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        focusRing && "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}