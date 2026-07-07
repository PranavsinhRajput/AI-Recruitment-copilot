import { motion } from "framer-motion";

export function ActionButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
}) {
  const classes =
    variant === "primary"
      ? "border border-orange-300/30 bg-gradient-to-b from-orange-400 to-orange-600 text-white shadow-button hover:from-orange-400 hover:to-orange-500"
      : "border border-line bg-panel text-ink shadow-soft hover:border-mint hover:text-mint";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1, scale: 1.015 }}
      whileTap={disabled ? undefined : { scale: 0.965 }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold tracking-[0.01em] transition disabled:cursor-not-allowed disabled:opacity-50 ${classes}`}
    >
      {children}
    </motion.button>
  );
}
