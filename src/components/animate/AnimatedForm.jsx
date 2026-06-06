import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AnimatedCheckbox({
  checked = false,
  onChange,
  className,
  label,
  ...props
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
          checked ? "bg-primary border-primary" : "border-input bg-background hover:border-primary",
          className
        )}
        {...props}
      >
        <motion.div
          initial={false}
          animate={{
            scale: checked ? 1 : 0,
            opacity: checked ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-foreground"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </motion.div>
      </motion.button>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}

export function AnimatedSwitch({
  checked = false,
  onChange,
  className,
  label,
  ...props
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <motion.button
        whileTap={() => ({ scale: 0.95 })}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-input",
          className
        )}
        {...props}
      >
        <motion.div
          initial={false}
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md"
        />
      </motion.button>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}

export function AnimatedRadioGroup({
  children,
  value,
  onChange,
  className,
  ...props
}) {
  return (
    <div role="radiogroup" className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  );
}

export function AnimatedRadioItem({
  value: itemValue,
  children,
  className,
  isSelected = false,
  onSelect,
  ...props
}) {
  return (
    <motion.label
      whileTap={{ scale: 0.98 }}
      className={cn(
        "flex items-center gap-3 rounded-md border p-3 cursor-pointer transition-colors",
        isSelected ? "border-primary bg-primary/5" : "border-input hover:border-primary/50",
        className
      )}
      onClick={() => onSelect?.(itemValue)}
      {...props}
    >
      <motion.div
        animate={{ scale: isSelected ? 1 : 0 }}
        className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center"
      >
        <div className="w-2 h-2 rounded-full bg-primary" />
      </motion.div>
      <div className="flex-1">{children}</div>
    </motion.label>
  );
}