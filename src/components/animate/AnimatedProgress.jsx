import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedProgress({
  value = 0,
  className,
  showValue = true,
  animated = true,
  ...props
}) {
  return (
    <div className={cn("relative", className)} {...props}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          initial={animated ? { width: 0 } : { width: `${value}%` }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-primary"
        />
      </div>
      {showValue && (
        <span className="absolute -top-6 right-0 text-sm text-muted-foreground">
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}

export function AnimatedSkeleton({
  className,
  animate = true,
  ...props
}) {
  return (
    <motion.div
      animate={animate ? { opacity: [0.5, 1, 0.5] } : {}}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      className={cn("rounded-md bg-muted", className)}
      {...props}
    />
  );
}