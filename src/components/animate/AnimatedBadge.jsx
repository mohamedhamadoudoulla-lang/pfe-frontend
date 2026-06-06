import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedBadge({
  children,
  className,
  pulse = false,
  ...props
}) {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
      {...props}
    >
      {pulse && (
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mr-1 h-2 w-2 rounded-full bg-current"
        />
      )}
      {children}
    </motion.span>
  );
}

export function AnimatedAvatar({
  children,
  className,
  hoverScale = 1.1,
  ...props
}) {
  return (
    <motion.div
      whileHover={{ scale: hoverScale }}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedAvatarImage({ src, alt, className, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  );
}

export function AnimatedAvatarFallback({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}