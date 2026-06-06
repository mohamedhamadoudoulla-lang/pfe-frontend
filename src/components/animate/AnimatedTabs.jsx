import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedTabs({
  children,
  className,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("w-full", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedTabsList({
  children,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function AnimatedTabsTrigger({
  children,
  className,
  isActive = false,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function AnimatedTabsContent({
  children,
  className,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("mt-2 ring-offset-background focus-visible:outline-none", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}