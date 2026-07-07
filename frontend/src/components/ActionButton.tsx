import { ReactNode } from "react";
import { motion } from "framer-motion";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
};

export function ActionButton({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary",
}: Props) {
  const classes =
    variant === "primary"
      ? "bg-mint text-white shadow-soft hover:bg-emerald-700"
      : "border border-slate-200 bg-white text-ink hover:border-mint hover:text-mint";

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${classes}`}
    >
      {children}
    </motion.button>
  );
}
