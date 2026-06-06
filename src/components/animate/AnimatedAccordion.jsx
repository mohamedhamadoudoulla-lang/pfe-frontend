import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedAccordion({
  children,
  className,
  type = "single",
  collapsible = true,
  defaultValue,
  ...props
}) {
  return (
    <div className={cn("w-full", className)} {...props}>
      {children}
    </div>
  );
}

export function AnimatedAccordionItem({
  children,
  value,
  className,
  isOpen = false,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("border-b", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedAccordionTrigger({
  children,
  className,
  isOpen,
  onClick,
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <motion.svg
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 shrink-0 transition-transform"
      >
        <path d="m6 9 6 6 6-6" />
      </motion.svg>
    </motion.button>
  );
}

export function AnimatedAccordionContent({
  children,
  isOpen,
  className,
  ...props
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("overflow-hidden pb-4", className)}
          {...props}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}