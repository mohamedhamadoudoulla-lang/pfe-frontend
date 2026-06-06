import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedTooltip({
  children,
  content,
  className,
  side = "top",
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileHover={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="relative inline-block"
      {...props}
    >
      {children}
      <motion.div
        initial={{ opacity: 0, y: side === "top" ? 5 : -5 }}
        whileHover={{ opacity: 1, y: 0 }}
        className={cn(
          "absolute z-50 whitespace-nowrap rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md",
          side === "top" && "-top-8 left-1/2 -translate-x-1/2",
          side === "bottom" && "-bottom-8 left-1/2 -translate-x-1/2",
          side === "left" && "left-full top-1/2 -translate-y-1/2 ml-2",
          side === "right" && "right-full top-1/2 -translate-y-1/2 mr-2",
          className
        )}
      >
        {content}
      </motion.div>
    </motion.div>
  );
}