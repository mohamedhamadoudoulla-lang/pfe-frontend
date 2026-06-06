import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedModal({
  isOpen,
  onClose,
  children,
  className,
  ...props
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(
                "relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg",
                className
              )}
              {...props}
            >
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export function AnimatedModalHeader({ children, className, ...props }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props}>
      {children}
    </div>
  );
}

export function AnimatedModalTitle({ children, className, ...props }) {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h2>
  );
}

export function AnimatedModalContent({ children, className, ...props }) {
  return <div className={cn("py-4", className)} {...props}>{children}</div>;
}

export function AnimatedModalFooter({ children, className, ...props }) {
  return (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props}>
      {children}
    </div>
  );
}

export function AnimatedModalClose({ children, onClose, className, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClose}
      className={cn(
        "mt-2 inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:mt-0",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}